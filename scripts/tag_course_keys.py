"""One-shot tagger: derives course_keys[] for questions and course_key/optional_in for learn_topics.

Run from repo root:  python scripts/tag_course_keys.py
Updates backend/seeds/questions.json and backend/seeds/learn_topics.json in place.
Idempotent — re-running overwrites previously-set course_keys/course_key with current mapping.
"""
import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEEDS = os.path.join(REPO_ROOT, "backend", "seeds")

COURSE_NAME_TO_KEY = {
    "Building with the Claude API":            "claude-api",
    "Claude Code 101":                         "claude-code-101",
    "Claude Code in Action":                   "claude-code-in-action",
    "Introduction to Subagents":               "subagents",
    "Introduction to Agent Skills":            "agent-skills",
    "Introduction to Model Context Protocol":  "mcp-intro",
    "MCP Advanced Topics":                     "mcp-advanced",
    "Introduction to Claude Cowork":           "claude-cowork",
}

DOCS_ONLY = "cca-docs-only"

# Manual overrides — questions where the skilljar_ref is wrong/missing.
# id -> list[str]
QUESTION_OVERRIDES = {
    # Null skilljar_ref but content is Message Batches API
    405: ["claude-api"],
    406: ["claude-api"],
    416: ["claude-api"],
    418: ["claude-api"],
    # Mis-tagged "Claude Code Advanced" — research §5.3 says cca-docs-only pending manual review
    326: [DOCS_ONLY],
    327: [DOCS_ONLY],
    328: [DOCS_ONLY],
}


def normalize_skilljar_ref(val):
    if isinstance(val, str):
        try:
            return json.loads(val)
        except json.JSONDecodeError:
            return None
    return val


def derive_course_keys_for_question(q):
    qid = q.get("id")
    if qid in QUESTION_OVERRIDES:
        return QUESTION_OVERRIDES[qid]
    sj = normalize_skilljar_ref(q.get("skilljar_ref"))
    if not isinstance(sj, dict):
        return []
    course_name = sj.get("course")
    key = COURSE_NAME_TO_KEY.get(course_name)
    return [key] if key else []


def derive_topic_courses(t):
    refs = normalize_skilljar_ref(t.get("skilljar_refs"))
    courses = []
    if isinstance(refs, list):
        for r in refs:
            if isinstance(r, dict):
                k = COURSE_NAME_TO_KEY.get(r.get("course"))
                if k and k not in courses:
                    courses.append(k)
    elif isinstance(refs, dict):
        k = COURSE_NAME_TO_KEY.get(refs.get("course"))
        if k:
            courses.append(k)
    if not courses:
        return None, None
    return courses[0], courses[1:]  # canonical, optional_in


def tag_questions():
    path = os.path.join(SEEDS, "questions.json")
    with open(path, encoding="utf-8") as f:
        questions = json.load(f)
    counts = {"tagged": 0, "untagged": 0, "docs_only": 0}
    for q in questions:
        keys = derive_course_keys_for_question(q)
        q["course_keys"] = keys
        if not keys:
            counts["untagged"] += 1
        elif keys == [DOCS_ONLY]:
            counts["docs_only"] += 1
        else:
            counts["tagged"] += 1
    with open(path, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"questions.json: tagged={counts['tagged']} docs_only={counts['docs_only']} untagged={counts['untagged']} total={len(questions)}")


def tag_topics():
    path = os.path.join(SEEDS, "learn_topics.json")
    with open(path, encoding="utf-8") as f:
        topics = json.load(f)
    counts = {"tagged": 0, "untagged": 0}
    for t in topics:
        canonical, optional = derive_topic_courses(t)
        if canonical:
            t["course_key"] = canonical
            t["optional_in"] = optional or []
            t["verification"] = t.get("verification") or "verified"
            counts["tagged"] += 1
        else:
            t["course_key"] = None
            t["optional_in"] = []
            t["verification"] = t.get("verification") or "research-only"
            counts["untagged"] += 1
        t.setdefault("verification_note", None)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(topics, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"learn_topics.json: tagged={counts['tagged']} untagged={counts['untagged']} total={len(topics)}")


if __name__ == "__main__":
    tag_questions()
    tag_topics()
    print("Done. Re-run `python -m backend.seed` to push into the DB.")
