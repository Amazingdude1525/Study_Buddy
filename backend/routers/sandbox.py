import subprocess
import sys
import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from auth import get_current_user, User

router = APIRouter(prefix="/sandbox", tags=["sandbox"])

ALLOWED_LANGUAGES = {"python", "c", "cpp", "java"}

TIMEOUT_SECONDS = 10
MAX_OUTPUT = 10000

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
            return RunResult(output="", error=f"⚠️ Security: '{pattern}' is not allowed.")

    if len(req.code) > 10000:
        return RunResult(output="", error="⚠️ Code too long (max 10000 chars).")

    unique_id = f"{user.id}_{os.urandom(4).hex()}"
    cwd = os.getcwd()

    try:
        if req.language == "python":
            result = subprocess.run(
                [sys.executable, "-c", req.code],
                capture_output=True, text=True, timeout=TIMEOUT_SECONDS,
                env={**os.environ, "PYTHONPATH": ""},
            )
            return RunResult(output=result.stdout[:MAX_OUTPUT], error=result.stderr[:2000])

        elif req.language in ["c", "cpp"]:
            ext = ".c" if req.language == "c" else ".cpp"
            compiler = "gcc" if req.language == "c" else "g++"
            src_file = f"temp_{unique_id}{ext}"
            bin_file = f"bin_{unique_id}.exe" if os.name == "nt" else f"bin_{unique_id}"

            with open(src_file, "w") as f: f.write(req.code)
            
            # Compile
            comp = subprocess.run([compiler, src_file, "-o", bin_file], capture_output=True, text=True)
            if comp.returncode != 0:
                if os.path.exists(src_file): os.remove(src_file)
                return RunResult(output="", error=f"Compilation Error:\n{comp.stderr}")
            
            # Run
            result = subprocess.run([os.path.join(cwd, bin_file)], capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
            
            # Cleanup
            if os.path.exists(src_file): os.remove(src_file)
            if os.path.exists(bin_file): os.remove(bin_file)

            return RunResult(output=result.stdout[:MAX_OUTPUT], error=result.stderr[:2000])

        elif req.language == "java":
            # Detect class name or use Main
            import re
            match = re.search(r"public\s+class\s+(\w+)", req.code)
            class_name = match.group(1) if match else "Main"
            java_file = f"{class_name}.java"
            
            # Write file
            with open(java_file, "w") as f: f.write(req.code)
            
            # Compile
            comp = subprocess.run(["javac", java_file], capture_output=True, text=True)
            if comp.returncode != 0:
                if os.path.exists(java_file): os.remove(java_file)
                return RunResult(output="", error=f"Java Compilation Error:\n{comp.stderr}")
            
            # Run
            result = subprocess.run(["java", class_name], capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
            
            # Cleanup
            if os.path.exists(java_file): os.remove(java_file)
            class_file = f"{class_name}.class"
            if os.path.exists(class_file): os.remove(class_file)

            return RunResult(output=result.stdout[:MAX_OUTPUT], error=result.stderr[:2000])

    except subprocess.TimeoutExpired:
        return RunResult(output="", error=f"⏱️ Timed out after {TIMEOUT_SECONDS}s.", timed_out=True)
    except Exception as e:
        return RunResult(output="", error=f"Runner error: {str(e)}")

    return RunResult(output="", error="Unknown error")
