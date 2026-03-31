import subprocess
import sys
import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from auth import get_current_user, User

router = APIRouter(prefix="/sandbox", tags=["sandbox"])

ALLOWED_LANGUAGES = {"python", "c", "cpp"}

TIMEOUT_SECONDS = 5

# Security: block dangerous imports/statements
BLOCKED_PATTERNS = [
    "import os", "import sys", "import subprocess",
    "import shutil", "__import__", "open(",
    "exec(", "eval(", "compile(", "globals(", "locals(",
    "getattr(", "__builtins__", "importlib",
    "socket", "requests", "urllib", "http.client",
    "os.system", "os.popen", "subprocess.run",
    " rm ", "rmdir", "shutil.rmtree",
]


class RunRequest(BaseModel):
    code: str
    language: str = "python"


class RunResult(BaseModel):
    output: str
    error: str
    timed_out: bool = False


@router.post("/run", response_model=RunResult)
async def run_code(
    req: RunRequest,
    user: User = Depends(get_current_user),
):
    if req.language not in ALLOWED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Language '{req.language}' not supported.")

    # Basic security check
    code_lower = req.code.lower()
    for pattern in BLOCKED_PATTERNS:
        if pattern.lower() in code_lower:
            return RunResult(
                output="",
                error=f"⚠️ Security: '{pattern}' is not allowed in sandbox code.",
            )

    if len(req.code) > 5000:
        return RunResult(output="", error="⚠️ Code too long (max 5000 chars).")

    try:
        if req.language == "python":
            result = subprocess.run(
                [sys.executable, "-c", req.code],
                capture_output=True,
                text=True,
                timeout=TIMEOUT_SECONDS,
                env={**os.environ, "PYTHONPATH": ""},
            )
        else:
            ext = ".c" if req.language == "c" else ".cpp"
            compiler = "gcc" if req.language == "c" else "g++"
            filename = f"temp_code{ext}"
            exec_name = "./temp_exec" if os.name != "nt" else "temp_exec.exe"

            with open(filename, "w") as f:
                f.write(req.code)
            
            # Compile
            compile_res = subprocess.run([compiler, filename, "-o", "temp_exec"], capture_output=True, text=True)
            if compile_res.returncode != 0:
                if os.path.exists(filename): os.remove(filename)
                return RunResult(output="", error="Compilation Error:\\n" + compile_res.stderr)
            
            # Execute
            result = subprocess.run([exec_name], capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
            
            # Cleanup
            if os.path.exists(filename): os.remove(filename)
            if os.path.exists(exec_name): os.remove(exec_name)

        return RunResult(
            output=result.stdout[:4000],  # Cap output
            error=result.stderr[:2000],
            timed_out=False,
        )
    except subprocess.TimeoutExpired:
        return RunResult(
            output="",
            error=f"⏱️ Execution timed out after {TIMEOUT_SECONDS} seconds.",
            timed_out=True,
        )
    except Exception as e:
        return RunResult(output="", error=f"Runner error: {str(e)}")
