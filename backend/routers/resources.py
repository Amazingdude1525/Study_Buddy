from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
from auth import get_current_user, User

router = APIRouter(prefix="/resources", tags=["resources"])


class Resource(BaseModel):
    name: str
    url: str
    type: str  # youtube, website, tool, platform
    description: str
    free: bool = True
    icon: str = "🔗"


class SubjectGuide(BaseModel):
    subject: str
    seriousness: str  # Chill / Moderate / Intense
    seriousness_color: str
    description: str
    youtube_channels: List[Resource]
    websites: List[Resource]
    ai_tools: List[Resource]
    practice_platforms: List[Resource]
    study_tip: str


SUBJECT_DB: dict = {
    "dsa": SubjectGuide(
        subject="Data Structures & Algorithms",
        seriousness="Intense",
        seriousness_color="#ef4444",
        description="Core CS fundamentals required for competitive programming and interviews.",
        youtube_channels=[
            Resource(name="Abdul Bari", url="https://www.youtube.com/@abdul_bari", type="youtube", description="Best algorithm explanations", icon="📺"),
            Resource(name="Striver (takeUforward)", url="https://www.youtube.com/@takeUforward", type="youtube", description="DSA sheet + video series", icon="📺"),
            Resource(name="NeetCode", url="https://www.youtube.com/@NeetCode", type="youtube", description="LeetCode problems explained", icon="📺"),
            Resource(name="Back To Back SWE", url="https://www.youtube.com/@BackToBackSWE", type="youtube", description="Interview-focused DSA", icon="📺"),
        ],
        websites=[
            Resource(name="Striver's DSA Sheet", url="https://takeuforward.org/strivers-a2z-dsa-course", type="website", description="Complete roadmap", icon="📋"),
            Resource(name="CP-Algorithms", url="https://cp-algorithms.com", type="website", description="Advanced algorithm reference", icon="🧮"),
        ],
        ai_tools=[
            Resource(name="NotebookLM", url="https://notebooklm.google.com", type="tool", description="Upload PDFs and chat with them", icon="📓"),
            Resource(name="Phind", url="https://phind.com", type="tool", description="AI search for coding questions", icon="🔍"),
        ],
        practice_platforms=[
            Resource(name="LeetCode", url="https://leetcode.com", type="platform", description="Industry standard DSA practice", icon="💻"),
            Resource(name="Programmiz", url="https://www.programiz.com", type="platform", description="Learn & try code online", icon="🎯"),
            Resource(name="Codeforces", url="https://codeforces.com", type="platform", description="Competitive programming", icon="⚔️"),
        ],
        study_tip="Solve at least 2 problems daily. Focus on understanding patterns, not memorizing solutions.",
    ),
    "math": SubjectGuide(
        subject="Mathematics",
        seriousness="Moderate",
        seriousness_color="#f59e0b",
        description="Fundamental for CS, ML, and engineering disciplines.",
        youtube_channels=[
            Resource(name="3Blue1Brown", url="https://www.youtube.com/@3blue1brown", type="youtube", description="Visual math intuition", icon="📺"),
            Resource(name="Khan Academy", url="https://www.youtube.com/@khanacademy", type="youtube", description="Full math curriculum", icon="📺"),
            Resource(name="Professor Leonard", url="https://www.youtube.com/@ProfessorLeonard", type="youtube", description="Calculus masterclass", icon="📺"),
        ],
        websites=[
            Resource(name="Khan Academy", url="https://khanacademy.org", type="website", description="Complete math courses free", icon="📚"),
            Resource(name="Paul's Online Math Notes", url="https://tutorial.math.lamar.edu", type="website", description="Calculus, Algebra notes", icon="📝"),
        ],
        ai_tools=[
            Resource(name="Wolfram Alpha", url="https://wolframalpha.com", type="tool", description="Compute & solve anything", icon="🔢"),
            Resource(name="Symbolab", url="https://symbolab.com", type="tool", description="Step-by-step math solver", icon="🧮"),
        ],
        practice_platforms=[
            Resource(name="Brilliant", url="https://brilliant.org", type="platform", description="Interactive problem solving", icon="⭐", free=False),
            Resource(name="Art of Problem Solving", url="https://artofproblemsolving.com", type="platform", description="Competition math", icon="🏆"),
        ],
        study_tip="Don't skip steps. Write every step on paper. Visualize with 3Blue1Brown before doing problems.",
    ),
    "machine learning": SubjectGuide(
        subject="Machine Learning",
        seriousness="Intense",
        seriousness_color="#ef4444",
        description="High-demand field requiring math + programming foundations.",
        youtube_channels=[
            Resource(name="Andrej Karpathy", url="https://www.youtube.com/@AndrejKarpathy", type="youtube", description="Deep learning from scratch", icon="📺"),
            Resource(name="Sentdex", url="https://www.youtube.com/@sentdex", type="youtube", description="Practical ML with Python", icon="📺"),
            Resource(name="StatQuest", url="https://www.youtube.com/@statquest", type="youtube", description="Stats & ML visually explained", icon="📺"),
        ],
        websites=[
            Resource(name="fast.ai", url="https://fast.ai", type="website", description="Top-down practical ML course", icon="🚀"),
            Resource(name="ML Cheatsheet", url="https://ml-cheatsheet.readthedocs.io", type="website", description="Quick reference", icon="📋"),
        ],
        ai_tools=[
            Resource(name="NotebookLM", url="https://notebooklm.google.com", type="tool", description="Deep dive into papers", icon="📓"),
            Resource(name="Colab", url="https://colab.research.google.com", type="tool", description="Free GPU notebooks", icon="☁️"),
        ],
        practice_platforms=[
            Resource(name="Kaggle", url="https://kaggle.com", type="platform", description="ML competitions & datasets", icon="🏆"),
            Resource(name="Hugging Face", url="https://huggingface.co", type="platform", description="Models & datasets hub", icon="🤗"),
        ],
        study_tip="Build projects > read theory. Start with Andrew Ng's course, then implement from scratch.",
    ),
    "programming": SubjectGuide(
        subject="Programming",
        seriousness="Chill",
        seriousness_color="#22c55e",
        description="Learn to code — starts easy but depth is unlimited.",
        youtube_channels=[
            Resource(name="Fireship", url="https://www.youtube.com/@Fireship", type="youtube", description="Fast-paced modern dev content", icon="📺"),
            Resource(name="Traversy Media", url="https://www.youtube.com/@TraversyMedia", type="youtube", description="Web dev tutorials", icon="📺"),
            Resource(name="CS50", url="https://www.youtube.com/@cs50", type="youtube", description="Harvard's intro to CS", icon="📺"),
        ],
        websites=[
            Resource(name="MDN Web Docs", url="https://developer.mozilla.org", type="website", description="Web tech reference", icon="📚"),
            Resource(name="The Odin Project", url="https://theodinproject.com", type="website", description="Full stack curriculum", icon="⚡"),
        ],
        ai_tools=[
            Resource(name="GitHub Copilot", url="https://github.com/features/copilot", type="tool", description="AI pair programmer", icon="🤖", free=False),
            Resource(name="Phind", url="https://phind.com", type="tool", description="Coding AI search engine", icon="🔍"),
        ],
        practice_platforms=[
            Resource(name="Programmiz", url="https://www.programiz.com", type="platform", description="Learn + try code online", icon="🎯"),
            Resource(name="HackerRank", url="https://hackerrank.com", type="platform", description="Coding challenges", icon="⚔️"),
        ],
        study_tip="Code every day. Build something real. Reading tutorials without coding gains you nothing.",
    ),
}

# Default fallback
DEFAULT_GUIDE = SUBJECT_DB["programming"]


@router.get("/subjects")
def list_subjects():
    return {"subjects": list(SUBJECT_DB.keys())}


@router.get("/guide", response_model=SubjectGuide)
def get_guide(
    subject: str = Query("programming"),
    user: User = Depends(get_current_user),
):
    """Return curated resource guide for a subject."""
    key = subject.lower().strip()
    # Fuzzy match
    for db_key in SUBJECT_DB:
        if key in db_key or db_key in key:
            return SUBJECT_DB[db_key]
    return DEFAULT_GUIDE
