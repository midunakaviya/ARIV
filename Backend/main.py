from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, date
from contextlib import contextmanager
from io import StringIO
import mysql.connector
from mysql.connector import Error
import jwt
import json
import uuid
import hashlib
import random
import csv
import os
from dotenv import load_dotenv
import resend
import httpx
from httpx import AsyncClient, TimeoutException, HTTPStatusError  # add these if not already imported
from fastapi import Body
from rapidfuzz import fuzz, process
# import sys

# if sys.platform == "win32":
#     # Force UTF-8 output on Windows console (Python 3.7+)
#     sys.stdout.reconfigure(encoding="utf-8", errors="replace")
#     sys.stderr.reconfigure(encoding="utf-8", errors="replace")


# -------------------------------
# CONFIG
# -------------------------------
load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
if not resend.api_key or not resend.api_key.startswith("re_"):
    print("Warning: RESEND_API_KEY not set — emails will not send")

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-jwt-key-change-in-production-1234567890")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

app = FastAPI(title="Chatbot Experiment Platform")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# -------------------------------
# DATABASE CONNECTION
# -------------------------------
def get_db_connection():
    try:
        # conn = mysql.connector.connect(
        #     host="localhost",
        #     user="root",
        #     password="",
        #     database="chatbot_experiments",
        #     port=3306,
        # )
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT", 10753)),
            ssl_disabled=False,
            ssl_ca=None,
            ssl_verify_cert=False,
            ssl_verify_identity=False,

            connect_timeout=20,
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci',
            autocommit=True,

)
        print("Aiven DB Connection successful")
        return conn
    except Error as e:
        error_msg = f"Aiven DB connection failed: {str(e)}"
        print(error_msg)                   
        raise HTTPException(status_code=500, detail=error_msg)


@contextmanager
def get_db_cursor(dictionary=True):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=dictionary)
    try:
        yield cursor
        conn.commit()
    finally:
        cursor.close()
        conn.close()


# -------------------------------
# JWT HELPERS
# -------------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
        user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ────────────────────────────────────────────────
# ROLE ENFORCEMENT DEPENDENCIES
# ────────────────────────────────────────────────

def company_required(user: dict = Depends(get_current_user)):
    if user.get('role') != 'company':
        raise HTTPException(status_code=403, detail="Only companies can access this")
    return user

def participant_required(user: dict = Depends(get_current_user)):
    if user.get('role') != 'participant':
        raise HTTPException(status_code=403, detail="Only participants can access this")
    return user    


def admin_required(user: dict = Depends(get_current_user)):
    if not user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user

def get_knowledge(chatbot_id: int):
    # your existing DB fetch logic
    rows = fetch_all("""
        SELECT question, answer 
        FROM chatbot_knowledge 
        WHERE chatbot_id = %s
    """, (chatbot_id,))
    return [{"q": r["question"], "a": r["answer"]} for r in rows]    


# Add to models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[date] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None
    role: str = "participant"          # ← new field, default participant
    # Company fields (optional)
    company_name: Optional[str] = None
    contact_person: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    website: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ChatbotCreateUpdate(BaseModel):
    name: str
    config: dict                     # ← this is what frontend sends
    avatar_url: Optional[str] = None


class ExperimentBase(BaseModel):
    title: str
    description: Optional[str] = None
    chatbot_id_a: int                           
    chatbot_id_b: int                           
    external_chatbot_url: Optional[str] = None
    steps: List[Dict[str, Any]] = []
    randomization: bool = True
    budget: Optional[float] = 0.0
    participant_limit: Optional[int] = None


class ExperimentCreate(ExperimentBase):
    pass


class ExperimentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    chatbot_id_a: Optional[int] = None
    chatbot_id_b: Optional[int] = None
    external_chatbot_url: Optional[str] = None
    steps: Optional[List[Dict[str, Any]]] = None
    randomization: Optional[bool] = None
    budget: Optional[float] = None
    participant_limit: Optional[int] = None


class Experiment(ExperimentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    status: str = "active"
    spent_budget: float = 0.0

class StepsReorder(BaseModel):
    steps: List[dict]


class ParticipantRegister(BaseModel):
    experiment_id: int


class SurveyResult(BaseModel):
    experiment_id: int
    participant_id: int
    survey_type: str
    answers: dict


class InvitationAccept(BaseModel):
    email: EmailStr
    experiment_id: int


class ExperimentStatusUpdate(BaseModel):
    status: str


class LLMMessage(BaseModel):
    role: str  # "system" | "user" | "assistant"
    content: str


class LLMChatRequest(BaseModel):
    provider: str  # "openai" | "anthropic" | "groq" | "gemini"
    model: str
    messages: List[LLMMessage]
    temperature: float = 0.7
    max_tokens: int = 1024


# -------------------------------
# UTILS
# -------------------------------
def fetch_all(query: str, params: tuple = ()):
    with get_db_cursor() as cursor:
        cursor.execute(query, params)
        return cursor.fetchall()


def fetch_one(query: str, params: tuple = ()):
    with get_db_cursor() as cursor:
        cursor.execute(query, params)
        return cursor.fetchone()


def execute(query: str, params: tuple = ()):
    with get_db_cursor() as cursor:
        cursor.execute(query, params)
        return cursor.lastrowid



def get_experiment_by_id(experiment_id: int) -> Dict:
    row = fetch_one("SELECT * FROM experiments WHERE id = %s", (experiment_id,))
    if not row:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    row["steps"] = json.loads(row["steps"]) if row.get("steps") else []
    
    # Always expose A & B (new standard)
    return {
        **row,
        "chatbot_id_a": row["chatbot_id_a"],
        "chatbot_id_b": row["chatbot_id_b"],
    }

def _normalize_survey_type(st: str) -> str:
    return (st or "").strip().lower()


VALID_SURVEY_TYPES = {
    "sus",
    "cuq",
    "attrakdiff",
    "demographics",
    "nasa_tlx",
    "trust_chatbot",
    "bus15",
    "tam",
    "seq",
    "ueq",
}


# Answers can arrive as int, or string label. Keep it simple & robust.
LIKERT5_MAP = {
    "strongly disagree": 1,
    "disagree": 2,
    "neutral": 3,
    "agree": 4,
    "strongly agree": 5,
}
LIKERT7_MAP = {
    "strongly disagree": 1,
    "disagree": 2,
    "somewhat disagree": 3,
    "neutral": 4,
    "somewhat agree": 5,
    "agree": 6,
    "strongly agree": 7,
}


def _to_int(val: Any) -> Optional[int]:
    if val is None: return None
    if isinstance(val, (int, float)): return int(val)
    if isinstance(val, str):
        s = val.strip().lower()
        if s.isdigit(): return int(s)
        if s in LIKERT5_MAP: return LIKERT5_MAP[s]
        if s in LIKERT7_MAP: return LIKERT7_MAP[s]
    return None

@app.post("/auth/register")
def register(user: UserRegister):
    password_hash = hashlib.sha256(user.password.encode()).hexdigest()

    if user.role not in ["participant", "company"]:
        raise HTTPException(400, "Invalid role")

    with get_db_cursor() as cursor:
        try:
            if user.role == "participant":
                cursor.execute(
                    """
                    INSERT INTO users 
                    (email, first_name, last_name, dob, country, phone_number, password_hash, role, user_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        user.email,
                        user.first_name,
                        user.last_name,
                        user.dob,
                        user.country,
                        user.phone_number,
                        password_hash,
                        "participant",
                        "participant",
                    )
                )
            else:  # company
                cursor.execute(
                    """
                    INSERT INTO users 
                    (email, password_hash, role, user_type, company_name, contact_person, industry, company_size, website)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        user.email,
                        password_hash,
                        "company",
                        "company",
                        user.company_name,
                        user.contact_person,
                        user.industry,
                        user.company_size,
                        user.website,
                    )
                )
            user_id = cursor.lastrowid
        except mysql.connector.IntegrityError:
            raise HTTPException(400, "Email already exists")

    token = create_access_token({"user_id": user_id})
    return {"access_token": token, "token_type": "bearer"}


# @app.post("/auth/login")
# def login(user: UserLogin):
#     db_user = fetch_one("SELECT * FROM users WHERE email=%s", (user.email,))
#     if not db_user:
#         raise HTTPException(400, "Incorrect email or password")
    
#     password_hash = hashlib.sha256(user.password.encode()).hexdigest()
#     if db_user["password_hash"] != password_hash:
#         raise HTTPException(400, "Incorrect email or password")

#     access_token = create_access_token({"user_id": db_user["id"]})

#     return {
#         "access_token": access_token,
#         "token_type": "bearer",
#         "role": db_user["role"],              # ← ADD
#         "user_type": db_user["user_type"],    # ← ADD (for compatibility)
#     } ashok
@app.post("/auth/login")
def login(user: UserLogin):
    try:
        print(f"[LOGIN ATTEMPT] Email: {user.email}")

        db_user = fetch_one("SELECT * FROM users WHERE email=%s", (user.email,))
        if not db_user:
            print(f"[LOGIN FAILED] User not found: {user.email}")
            raise HTTPException(400, "Incorrect email or password")
        
        password_hash = hashlib.sha256(user.password.encode()).hexdigest()
        if db_user.get("password_hash") != password_hash:
            print(f"[LOGIN FAILED] Wrong password for: {user.email}")
            raise HTTPException(400, "Incorrect email or password")

        access_token = create_access_token({"user_id": db_user["id"]})

        print(f"[LOGIN SUCCESS] User: {user.email} | Role: {db_user.get('role')}")

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": db_user.get("role"),
            "user_type": db_user.get("user_type"),
        }
    except Exception as e:
        print(f"[LOGIN ERROR] Unexpected error for {user.email}: {str(e)}")
        raise



@app.get("/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user["role"],
        "user_type": current_user["user_type"],
        "first_name": current_user.get("first_name"),
        "last_name": current_user.get("last_name"),
        "company_name": current_user.get("company_name"),
        # Add more fields if needed
    }

# -------------------------------
# USERS ENDPOINTS
# -------------------------------
@app.get("/users")
def list_users(current_user: dict = Depends(admin_required)):
    return fetch_all("SELECT id, email, first_name, last_name, dob, country, phone_number, created_at, is_admin, role FROM users")


@app.get("/users/{user_id}")
def get_user(user_id: int, current_user: dict = Depends(admin_required)):
    user = fetch_one(
        "SELECT id, email, first_name, last_name, dob, country, phone_number, created_at, is_admin, role FROM users WHERE id=%s",
        (user_id,),
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# -------------------------------
# CHATBOTS ENDPOINTS
# -------------------------------
# ==================== CHATBOTS ENDPOINTS ====================

@app.get("/chatbots")
def list_chatbots(current_user: dict = Depends(company_required)):
    bots = fetch_all("SELECT * FROM chatbots WHERE created_by = %s", (current_user["id"],))  # ← optional: only own bots
    for b in bots:
        try:
            b["config"] = json.loads(b["config"]) if b["config"] else {}
        except:
            b["config"] = {}
    return bots


# @app.post("/chatbots")
# def create_chatbot(data: dict, current_user: dict = Depends(company_required)):
#     # data comes directly from frontend (JSON body)
#     name = data.get("name")
#     config = data.get("config", {})  # full config object from frontend
#     avatar_url = data.get("avatar_url")

#     if not name:
#         raise HTTPException(400, "Name is required")

#     bot_id = execute(
#         """
#         INSERT INTO chatbots 
#         (name, created_by, config, avatar_url, is_public) 
#         VALUES (%s, %s, %s, %s, %s)
#         """,
#         (
#             name,
#             current_user["id"],
#             json.dumps(config),           # ← save full config as JSON
#             avatar_url,
#             config.get("isPublic", False) # ← map frontend field (note: case sensitive!)
#         )
#     )
#     return {"chatbot_id": bot_id, "message": "Chatbot created"}
@app.post("/chatbots")
def create_chatbot(data: dict, current_user: dict = Depends(company_required)):
    name = data.get("name")
    config = data.get("config", {})
    avatar_url = data.get("avatar_url")
    
    if not name:
        raise HTTPException(400, "Name is required")

    is_public = config.get("isPublic", False)  # from frontend config

    # Step 1: Insert without public_url first (because we need bot_id)
    bot_id = execute(
        """
        INSERT INTO chatbots
        (name, created_by, config, avatar_url, is_public)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            name,
            current_user["id"],
            json.dumps(config),
            avatar_url,
            int(is_public),
        )
    )

    # Step 2: Immediately set public_url if it's public
    public_url = None
    if is_public:
        public_url = f"https://ariv-one.vercel.app/chat/{bot_id}"  # or use env variable later
        execute(
            "UPDATE chatbots SET public_url = %s WHERE id = %s",
            (public_url, bot_id)
        )

    # ─── Save qaPairs to chatbot_knowledge table ───────────────────────
    qa_pairs = config.get("qaPairs", [])
    if isinstance(qa_pairs, list) and qa_pairs:
        for pair in qa_pairs:
            question = pair.get("question", "").strip()
            answer = pair.get("answer", "").strip()
            if question and answer:
                execute(
                    """
                    INSERT INTO chatbot_knowledge
                    (chatbot_id, question, answer, created_at)
                    VALUES (%s, %s, %s, NOW())
                    """,
                    (bot_id, question, answer)
                )

    return {
        "chatbot_id": bot_id,
        "public_url": public_url,  # optional: return it so frontend can show it
        "message": "Chatbot created successfully"
    }
# @app.put("/chatbots/{chatbot_id}")
# def update_chatbot(chatbot_id: int, data: dict, current_user: dict = Depends(company_required)):
#     # Ownership check
#     exists = fetch_one(
#         "SELECT id FROM chatbots WHERE id = %s AND created_by = %s",
#         (chatbot_id, current_user["id"])
#     )
#     if not exists:
#         raise HTTPException(404, "Chatbot not found or not yours")

#     name = data.get("name")
#     config = data.get("config", {})
#     avatar_url = data.get("avatar_url")

#     # Update main chatbot row
#     execute(
#         """
#         UPDATE chatbots
#         SET name = %s,
#             config = %s,
#             avatar_url = %s,
#             is_public = %s
#         WHERE id = %s
#         """,
#         (
#             name,
#             json.dumps(config),
#             avatar_url,
#             config.get("isPublic", False),
#             chatbot_id
#         )
#     )

#     # ─── NEW: Replace old knowledge with new qaPairs ─────────────────────────
#     qa_pairs = config.get("qaPairs", [])

#     # Clear old entries first
#     execute("DELETE FROM chatbot_knowledge WHERE chatbot_id = %s", (chatbot_id,))

#     if isinstance(qa_pairs, list) and qa_pairs:
#         for pair in qa_pairs:
#             question = pair.get("question", "").strip()
#             answer   = pair.get("answer",   "").strip()
#             if question and answer:
#                 execute(
#                     """
#                     INSERT INTO chatbot_knowledge
#                     (chatbot_id, question, answer, created_at)
#                     VALUES (%s, %s, %s, NOW())
#                     """,
#                     (chatbot_id, question, answer)
#                 )

#     return {"message": "Chatbot updated successfully"}

@app.put("/chatbots/{chatbot_id}")
def update_chatbot(chatbot_id: int, data: dict, current_user: dict = Depends(company_required)):
    # Ownership check
    exists = fetch_one(
        "SELECT id FROM chatbots WHERE id = %s AND created_by = %s",
        (chatbot_id, current_user["id"])
    )
    if not exists:
        raise HTTPException(404, "Chatbot not found or not yours")

    name = data.get("name")
    config = data.get("config", {})
    avatar_url = data.get("avatar_url")
    is_public = config.get("isPublic", False)

    # Generate public_url only if it's public
    public_url = f"https://ariv-one.vercel.app/chat/{chatbot_id}" if is_public else None

    # Update main row — include public_url
    execute(
        """
        UPDATE chatbots
        SET name = %s,
            config = %s,
            avatar_url = %s,
            is_public = %s,
            public_url = %s
        WHERE id = %s
        """,
        (
            name,
            json.dumps(config),
            avatar_url,
            int(is_public),
            public_url,
            chatbot_id
        )
    )

    # ─── Replace old knowledge with new qaPairs ─────────────────────────
    qa_pairs = config.get("qaPairs", [])
    # Clear old entries first
    execute("DELETE FROM chatbot_knowledge WHERE chatbot_id = %s", (chatbot_id,))
    
    if isinstance(qa_pairs, list) and qa_pairs:
        for pair in qa_pairs:
            question = pair.get("question", "").strip()
            answer = pair.get("answer", "").strip()
            if question and answer:
                execute(
                    """
                    INSERT INTO chatbot_knowledge
                    (chatbot_id, question, answer, created_at)
                    VALUES (%s, %s, %s, NOW())
                    """,
                    (chatbot_id, question, answer)
                )

    return {
        "message": "Chatbot updated successfully",
        "public_url": public_url  # optional: let frontend know the new link
    }

@app.get("/chatbots/{chatbot_id}")
def get_chatbot(chatbot_id: int, current_user: dict = Depends(company_required)):
    bot = fetch_one(
        "SELECT * FROM chatbots WHERE id = %s AND created_by = %s",
        (chatbot_id, current_user["id"])
    )
    if not bot:
        raise HTTPException(404, "Chatbot not found or not yours")

    try:
        bot["config"] = json.loads(bot["config"]) if bot["config"] else {}
    except:
        bot["config"] = {}

    return bot


# @app.put("/chatbots/{chatbot_id}")
# def update_chatbot(chatbot_id: int, data: dict, current_user: dict = Depends(company_required)):
#     # Check ownership
#     exists = fetch_one(
#         "SELECT id FROM chatbots WHERE id = %s AND created_by = %s",
#         (chatbot_id, current_user["id"])
#     )
#     if not exists:
#         raise HTTPException(404, "Chatbot not found or not yours")

#     name = data.get("name")
#     config = data.get("config", {})
#     avatar_url = data.get("avatar_url")

#     execute(
#         """
#         UPDATE chatbots 
#         SET name = %s, 
#             config = %s, 
#             avatar_url = %s,
#             is_public = %s
#         WHERE id = %s
#         """,
#         (
#             name,
#             json.dumps(config),
#             avatar_url,
#             config.get("isPublic", False),  # ← important mapping!
#             chatbot_id
#         )
#     )
#     return {"message": "Chatbot updated successfully"}


@app.delete("/chatbots/{chatbot_id}")
def delete_chatbot(chatbot_id: int, current_user: dict = Depends(company_required)):
    execute(
        "DELETE FROM chatbots WHERE id = %s AND created_by = %s",
        (chatbot_id, current_user["id"])
    )
    return {"message": "Chatbot deleted"}

# Public endpoint - already quite good, just make sure field names match frontend expectation
@app.get("/chatbots/public/{identifier}")
async def get_public_chatbot(identifier: str):
    if not identifier.isdigit():
        raise HTTPException(400, "Only numeric chatbot ID is supported")

    bot_id = int(identifier)
    
    bot = fetch_one(
        """
        SELECT id, name, config, avatar_url, is_public
        FROM chatbots 
        WHERE id = %s
        """,
        (bot_id,)
    )
    
    if not bot:
        raise HTTPException(404, "Chatbot not found")

    if not bot["is_public"]:
        raise HTTPException(403, "This chatbot is not public")

    try:
        config = json.loads(bot["config"]) if bot["config"] else {}
    except:
        config = {}

    return {
        "id": bot["id"],
        "name": bot["name"],
        "avatar_url": bot["avatar_url"],
        "config": config,
    }

@app.post("/chatbots/{chatbot_id}/chat")
async def send_chat_message(chatbot_id: int, body: dict):
    message = body.get("message", "").strip()
    if not message:
        return {"error": "No message"}

    # Debug log
    print(f"[chat] chatbot={chatbot_id} | user said: {message!r}")

    # 1. Load rule-based knowledge
    knowledge = get_knowledge(chatbot_id)
    print(f"[chat] loaded {len(knowledge)} knowledge entries")

    if not knowledge:
        # No rules → straight to LLM
        llm_text = await call_groq_llm(f"You are a helpful assistant.\nUser: {message}\nAnswer concisely:")
        return {"text": llm_text, "source": "llm"}

    # 2. Try to match rule-based (fuzzy)
    questions = [item["q"] for item in knowledge]
    answer_map = {item["q"]: item["a"] for item in knowledge}

    matches = process.extract(
        message,
        questions,
        scorer=fuzz.WRatio,
        limit=3
    )

    best = matches[0] if matches else None
    MIN_CONF = 82

    if best and best[1] >= MIN_CONF:
        answer = answer_map[best[0]]
        print(f"[chat] RULE-BASED MATCH | score={best[1]:.1f} | Q: {best[0][:60]}…")
        return {
            "text": answer,
            "source": "knowledge",
            "confidence": round(best[1], 1),
            "matched_q": best[0][:80] + "..." if len(best[0]) > 80 else best[0]
        }

    # 3. No strong rule match → use LLM + give it near-matches as context
    context = ""
    if matches:
        context = "\nNear matches from knowledge base:\n" + "\n".join(
            f"Q: {q[:100]} → A: {answer_map[q][:120]}..."
            for q, score, _ in matches[:2] if score > 60
        )

    system_prompt = """You are a concise, helpful customer support assistant.
Use the provided knowledge base excerpts only if they are clearly relevant.
If nothing matches, answer naturally based on general knowledge.
Keep answers short, friendly and accurate.
If you don't know, say so honestly."""

    user_prompt = f"{context}\n\nUser question: {message}\n\nAnswer:"

    try:
        llm_text = await call_groq_llm(
            prompt = user_prompt,
            system = system_prompt
        )
        print("[chat] LLM fallback used")
        return {"text": llm_text, "source": "llm"}
    except Exception as e:
        print(f"[chat] LLM call failed: {e}")
        return {
            "text": "Sorry, I'm having trouble generating an answer right now. Please try again or rephrase your question.",
            "source": "error"
        }


# ────────────────────────────────────────────────
# Real Groq LLM call
# ────────────────────────────────────────────────
async def call_groq_llm(prompt: str, system: str = "You are a helpful assistant.") -> str:
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set")

    async with AsyncClient(timeout=15.0) as client:
        try:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                json={
                    "model": "llama-3.1-8b-instant",          # fast + cheap
                    # "model": "mixtral-8x7b-32768",         # better quality (slower)
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user",   "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 280,
                    "top_p": 0.9
                }
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"].strip()
            return content
        except (TimeoutException, HTTPStatusError) as e:
            raise RuntimeError(f"Groq API error: {e}")

# -------------------------------
# EXPERIMENTS ENDPOINTS (UPDATED - anonymization forced)
# -------------------------------
# @app.get("/experiments")
# def list_experiments(status: Optional[str] = None, current_user: dict = Depends(company_required)):
#     query = "SELECT * FROM experiments WHERE user_id = %s"
#     params = (current_user["id"],)
#     if status:
#         query += " AND status = %s"
#         params += (status,)
#     exps = fetch_all(query, params)
#     for e in exps:
#         e["steps"] = json.loads(e["steps"]) if e.get("steps") else []
#     return exps


# @app.post("/experiments")
# async def create_experiment(
#     data: dict,      
#     background_tasks: BackgroundTasks,                    # ← changed to dict to match your style
#     user: dict = Depends(company_required), # ← role enforcement
   
# ):
#     if not data.get('title', '').strip():
#         raise HTTPException(422, "Title is required")

#     if data.get("chatbot_id_a") == data.get("chatbot_id_b"):
#         raise HTTPException(422, "Chatbot A and B must be different")

#     # Insert experiment (your original logic, adapted)
#     exp_id = execute(
#         """
#         INSERT INTO experiments 
#         (title, description, chatbot_id_a, chatbot_id_b, external_chatbot_url, steps, 
#          anonymization, randomization, user_id, budget, participant_limit, status,
#          stars_per_completion)
#         VALUES (%s, %s, %s, %s, %s, %s, 1, %s, %s, %s, %s, 'draft', %s)
#         """,
#         (
#             data['title'].strip(),
#             data.get("description") or None,
#             data.get("chatbot_id_a"),
#             data.get("chatbot_id_b"),
#             data.get("external_chatbot_url"),
#             json.dumps(data.get("steps") or []),
#             data.get("randomization", True),
#             user["id"],
#             data.get("budget", 0.0),
#             data.get("participant_limit"),
#             data.get("stars_per_completion", 50),  # ← new field
#         )
#     )

#     # Auto-invite from filtered pool
#     filters = data.get('filters', {})
#     query = """
#         SELECT p.user_id, u.email
# FROM participants p
# JOIN users u ON p.user_id = u.id
#         WHERE p.is_in_pool = 1 AND p.consent_given = 1
#     """
#     params = []
#     if 'age_range' in filters:
#         query += " AND p.age_range = %s"
#         params.append(filters['age_range'])
#     if 'gender' in filters:
#         query += " AND p.gender = %s"
#         params.append(filters['gender'])
#     if 'region' in filters:
#         query += " AND p.region = %s"
#         params.append(filters['region'])
#     if 'education' in filters:
#         query += " AND p.education = %s"
#         params.append(filters['education'])
#     if 'chatbot_use_frequency' in filters:
#         query += " AND p.chatbot_use_frequency = %s"
#         params.append(filters['chatbot_use_frequency'])

#     pool = fetch_all(query, tuple(params))

#     for p in pool:
#         anon_id = str(uuid.uuid4())[:12]
#         execute(
#             """
#             INSERT INTO participants 
#             (experiment_id, user_id, anon_id, status, is_in_pool, consent_given) 
#             VALUES (%s, %s, %s, 'invited', 1, 1)
#             """,
#             (exp_id, p['user_id'], anon_id)
#         )
#         link = f"http://localhost:5173/participant/{anon_id}"  # ← CHANGE TO YOUR FRONTEND URL
#         background_tasks.add_task(
#             send_invite_email, 
#             p['email'], 
#             link, 
#             data['title'], 
#             data.get('stars_per_completion', 50)
#         )

#     return {"id": exp_id, "message": "Experiment created and pool invites sent"}

# @app.post("/experiments")
# async def create_experiment(
#     data: dict,
#     background_tasks: BackgroundTasks,
#     user: dict = Depends(company_required),
# ):
#     if not data.get('title', '').strip():
#         raise HTTPException(422, "Title is required")
    
#     if data.get("chatbot_id_a") == data.get("chatbot_id_b"):
#         raise HTTPException(422, "Chatbot A and B must be different")

#     # Insert the experiment
#     exp_id = execute(
#         """
#         INSERT INTO experiments
#         (title, description, chatbot_id_a, chatbot_id_b, external_chatbot_url, steps,
#          anonymization, randomization, user_id, budget, participant_limit, status,
#          stars_per_completion)
#         VALUES (%s, %s, %s, %s, %s, %s, 1, %s, %s, %s, %s, 'draft', %s)
#         """,
#         (
#             data['title'].strip(),
#             data.get("description") or None,
#             data.get("chatbot_id_a"),
#             data.get("chatbot_id_b"),
#             data.get("external_chatbot_url"),
#             json.dumps(data.get("steps") or []),
#             data.get("randomization", True),
#             user["id"],
#             data.get("budget", 0.0),
#             data.get("participant_limit"),
#             data.get("stars_per_completion", 50),
#         )
#     )

#     # Auto-invite from filtered pool — EXCLUDE the creator themselves
#     filters = data.get('filters', {})
#     query = """
#         SELECT p.user_id, u.email
#         FROM participants p
#         JOIN users u ON p.user_id = u.id
#         WHERE p.is_in_pool = 1 
#           AND p.consent_given = 1
#           AND p.user_id != %s          -- Prevent adding the creator
#     """
#     params = [user["id"]]  # Start with creator's ID to exclude

#     if 'age_range' in filters:
#         query += " AND p.age_range = %s"
#         params.append(filters['age_range'])
#     if 'gender' in filters:
#         query += " AND p.gender = %s"
#         params.append(filters['gender'])
#     if 'region' in filters:
#         query += " AND p.region = %s"
#         params.append(filters['region'])
#     if 'education' in filters:
#         query += " AND p.education = %s"
#         params.append(filters['education'])
#     if 'chatbot_use_frequency' in filters:
#         query += " AND p.chatbot_use_frequency = %s"
#         params.append(filters['chatbot_use_frequency'])

#     pool = fetch_all(query, tuple(params))

#     invited_count = 0
#     for p in pool:
#         anon_id = str(uuid.uuid4())[:12]
#         try:
#             execute(
#                 """
#                 INSERT INTO participants
#                 (experiment_id, user_id, anon_id, status, is_in_pool, consent_given)
#                 VALUES (%s, %s, %s, 'invited', 1, 1)
#                 """,
#                 (exp_id, p['user_id'], anon_id)
#             )
#             link = f"http://localhost:5173/participant/{anon_id}"
#             background_tasks.add_task(
#                 send_invite_email,
#                 p['email'],
#                 link,
#                 data['title'],
#                 data.get('stars_per_completion', 50)
#             )
#             invited_count += 1
#         except mysql.connector.IntegrityError:
#             # Skip if already invited (rare, but safe)
#             continue
#         except Exception as e:
#             print(f"Failed to invite user {p['user_id']}: {e}")
#             continue

#     return {
#         "id": exp_id,
#         "message": f"Experiment created successfully. {invited_count} participants invited from pool."
#     }


# @app.put("/experiments/{experiment_id}", response_model=Experiment)
# def update_experiment(experiment_id: int, update: ExperimentUpdate, current_user: dict = Depends(company_required)):
#     existing = get_experiment_by_id(experiment_id)
#     if existing["user_id"] != current_user["id"]:
#         raise HTTPException(403, "Not your experiment")

#     updates = {}
#     if update.title is not None: 
#         updates["title"] = update.title.strip()
#     if update.description is not None: 
#         updates["description"] = update.description or None
#     if update.chatbot_id_a is not None: 
#         updates["chatbot_id_a"] = update.chatbot_id_a
#     if update.chatbot_id_b is not None: 
#         updates["chatbot_id_b"] = update.chatbot_id_b
#     if update.external_chatbot_url is not None: 
#         updates["external_chatbot_url"] = update.external_chatbot_url
#     if update.steps is not None: 
#         updates["steps"] = json.dumps(update.steps)
#     if update.randomization is not None: 
#         updates["randomization"] = update.randomization
#     if update.budget is not None: 
#         updates["budget"] = update.budget
#     if update.participant_limit is not None: 
#         updates["participant_limit"] = update.participant_limit

#     # Validate if someone tries to change A/B
#     if "chatbot_id_a" in updates or "chatbot_id_b" in updates:
#         new_a = updates.get("chatbot_id_a", existing["chatbot_id_a"])
#         new_b = updates.get("chatbot_id_b", existing["chatbot_id_b"])
#         if new_a == new_b:
#             raise HTTPException(422, "Chatbot A and Chatbot B must be different")

#     if not updates:
#         raise HTTPException(400, "No fields to update")

#     set_clause = ", ".join(f"{k}=%s" for k in updates)
#     values = list(updates.values()) + [experiment_id]

#     execute(f"UPDATE experiments SET {set_clause}, updated_at=NOW() WHERE id=%s", tuple(values))
#     return get_experiment_by_id(experiment_id)

# -------------------------------
# EXPERIMENTS ENDPOINTS
# -------------------------------
@app.get("/experiments")
def list_experiments(status: Optional[str] = None, current_user: dict = Depends(company_required)):
    """
    List experiments created by the current company user.
    Optional status filter: draft, active, inactive, completed, launched
    """
    query = "SELECT * FROM experiments WHERE user_id = %s"
    params = (current_user["id"],)
    
    if status:
        if status not in ["draft", "active", "inactive", "completed", "launched"]:
            raise HTTPException(400, "Invalid status filter")
        query += " AND status = %s"
        params += (status,)
    
    exps = fetch_all(query, params)
    for e in exps:
        try:
            e["steps"] = json.loads(e["steps"]) if e.get("steps") else []
        except json.JSONDecodeError:
            e["steps"] = []
            print(f"[WARNING] Invalid steps JSON in experiment {e['id']}")
    
    return exps


@app.post("/experiments")
async def create_experiment(
    data: dict,
    background_tasks: BackgroundTasks,
    user: dict = Depends(company_required),
):
    """
    Create a new experiment draft.
    Supports:
    - A/B mode: requires chatbot_id_a and chatbot_id_b
    - External mode: requires external_chatbot_url
    """
    title = (data.get("title") or "").strip()
    if not title:
        raise HTTPException(422, "Title is required")

    chatbot_a_raw = data.get("chatbot_id_a")
    chatbot_b_raw = data.get("chatbot_id_b")
    external_url = (data.get("external_chatbot_url") or "").strip()

    # Determine mode
    use_external = bool(external_url)

    chatbot_a = None
    chatbot_b = None

    if not use_external:
        # A/B mode required
        if not chatbot_a_raw or not chatbot_b_raw:
            raise HTTPException(422, "Both chatbot_id_a and chatbot_id_b are required when not using external_chatbot_url")
        
        try:
            chatbot_a = int(chatbot_a_raw)
            chatbot_b = int(chatbot_b_raw)
        except (ValueError, TypeError):
            raise HTTPException(422, "chatbot_id_a and chatbot_id_b must be valid integers")
        
        if chatbot_a == chatbot_b:
            raise HTTPException(422, "chatbot_id_a and chatbot_id_b must be different")
    else:
        # External mode
        if not external_url.startswith(("http://", "https://")):
            raise HTTPException(422, "external_chatbot_url must start with http:// or https://")

    # Insert draft
    exp_id = execute(
        """
        INSERT INTO experiments
        (title, description, chatbot_id_a, chatbot_id_b, external_chatbot_url, steps,
         anonymization, randomization, user_id, budget, participant_limit, status,
         stars_per_completion, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, 1, %s, %s, %s, %s, 'draft', %s, NOW(), NOW())
        """,
        (
            title,
            data.get("description") or None,
            chatbot_a,
            chatbot_b,
            external_url or None,
            json.dumps(data.get("steps") or []),
            data.get("randomization", True),
            user["id"],
            float(data.get("budget", 1000.0)),
            data.get("participant_limit"),
            data.get("stars_per_completion", 50),
        )
    )

    print(f"[CREATE EXPERIMENT] Draft created → ID={exp_id} | title='{title}' | external={use_external}")

    # ─── Auto-invite from filtered pool (your original logic, improved) ───────
    filters = data.get('filters', {})
    query = """
        SELECT p.user_id, u.email
        FROM participants p
        JOIN users u ON p.user_id = u.id
        WHERE p.is_in_pool = 1
          AND p.consent_given = 1
          AND p.user_id != %s
    """
    params = [user["id"]]

    if 'age_range' in filters:
        query += " AND p.age_range = %s"
        params.append(filters['age_range'])
    if 'gender' in filters:
        query += " AND p.gender = %s"
        params.append(filters['gender'])
    if 'region' in filters:
        query += " AND p.region = %s"
        params.append(filters['region'])
    if 'education' in filters:
        query += " AND p.education = %s"
        params.append(filters['education'])
    if 'chatbot_use_frequency' in filters:
        query += " AND p.chatbot_use_frequency = %s"
        params.append(filters['chatbot_use_frequency'])

    pool = fetch_all(query, tuple(params))
    invited_count = 0

    for p in pool:
        anon_id = str(uuid.uuid4())[:12]
        try:
            # Assign variant based on randomization setting
            randomize = data.get("randomization", True)
            variant = random.choice(['A', 'B']) if randomize else 'A'

            execute(
                """
                INSERT INTO participants
                (experiment_id, user_id, anon_id, variant, status, is_in_pool, consent_given, created_at)
                VALUES (%s, %s, %s, %s, 'invited', 1, 1, NOW())
                """,
                (exp_id, p['user_id'], anon_id, variant)
            )

            link = f"https://ariv-one.vercel.app/participant/{anon_id}"
            background_tasks.add_task(
                send_invite_email,
                p['email'],
                link,
                title,
                data.get('stars_per_completion', 50)
            )
            invited_count += 1
        except mysql.connector.IntegrityError:
            # Already invited → skip silently
            continue
        except Exception as e:
            print(f"Failed to invite user {p['user_id']}: {e}")
            continue

    return {
        "id": exp_id,
        "message": f"Experiment draft created. {invited_count} participants invited."
    }


@app.put("/experiments/{experiment_id}")
async def update_experiment(
    experiment_id: int,
    data: dict,
    current_user: dict = Depends(company_required),
):
    """
    Update an existing experiment (draft or otherwise).
    """
    exp = fetch_one("SELECT user_id FROM experiments WHERE id = %s", (experiment_id,))
    if not exp:
        raise HTTPException(404, "Experiment not found")
    if exp["user_id"] != current_user["id"]:
        raise HTTPException(403, "Not your experiment")

    title = (data.get("title") or "").strip()
    if not title:
        raise HTTPException(422, "Title is required")

    chatbot_a_raw = data.get("chatbot_id_a")
    chatbot_b_raw = data.get("chatbot_id_b")
    external_url = (data.get("external_chatbot_url") or "").strip()

    use_external = bool(external_url)

    chatbot_a = None
    chatbot_b = None

    if not use_external:
        if not chatbot_a_raw or not chatbot_b_raw:
            raise HTTPException(422, "Both chatbot_id_a and chatbot_id_b required unless external URL is used")
        try:
            chatbot_a = int(chatbot_a_raw)
            chatbot_b = int(chatbot_b_raw)
        except (ValueError, TypeError):
            raise HTTPException(422, "Chatbot IDs must be valid integers")
        if chatbot_a == chatbot_b:
            raise HTTPException(422, "Chatbot A and B must be different")
    else:
        if not external_url.startswith(("http://", "https://")):
            raise HTTPException(422, "Invalid external chatbot URL")

    execute(
        """
        UPDATE experiments
        SET title = %s,
            description = %s,
            chatbot_id_a = %s,
            chatbot_id_b = %s,
            external_chatbot_url = %s,
            steps = %s,
            randomization = %s,
            anonymization = %s,
            budget = %s,
            participant_limit = %s,
            updated_at = NOW()
        WHERE id = %s
        """,
        (
            title,
            data.get("description") or None,
            chatbot_a,
            chatbot_b,
            external_url or None,
            json.dumps(data.get("steps") or []),
            data.get("randomization", True),
            data.get("anonymization", True),
            float(data.get("budget", 1000.0)),
            data.get("participant_limit"),
            experiment_id,
        )
    )

    print(f"[UPDATE EXPERIMENT] ID={experiment_id} updated | title='{title}'")

    return {"id": experiment_id, "message": "Experiment updated successfully"}


@app.post("/experiments/{experiment_id}/finalize")
def finalize_experiment(
    experiment_id: int,
    data: dict = Body(...),
    current_user: dict = Depends(company_required)
):
    """
    Finalize experiment:
    - Merge incoming steps with existing ones (preserves DB questions for surveys)
    - Set status to 'active'
    - Auto-assign variants if randomization enabled
    - Ensure at least one invited participant exists
    """
    exp = fetch_one(
        "SELECT user_id, steps, randomization FROM experiments WHERE id = %s",
        (experiment_id,)
    )
    if not exp:
        raise HTTPException(404, "Experiment not found")
    if exp["user_id"] != current_user["id"]:
        raise HTTPException(403, "Not authorized")

    incoming_steps = data.get("steps")
    if incoming_steps is not None:
        if not isinstance(incoming_steps, list):
            raise HTTPException(400, "steps must be a list")

        try:
            existing_steps = json.loads(exp["steps"]) if exp.get("steps") else []
        except:
            existing_steps = []

        # Build lookup tables for merging
        existing_by_id = {s.get("id"): s for s in existing_steps if s.get("id")}
        existing_by_type = {
            s.get("survey_type"): s for s in existing_steps
            if s.get("type") == "survey" and s.get("survey_type")
        }

        merged = []
        for step in incoming_steps:
            if not isinstance(step, dict):
                merged.append(step)
                continue

            if step.get("type") == "survey":
                sid = step.get("id")
                stype = step.get("survey_type")
                existing = None

                if sid and sid in existing_by_id:
                    existing = existing_by_id[sid]
                elif stype and stype in existing_by_type:
                    existing = existing_by_type[stype]

                # Preserve existing questions if frontend didn't send any
                if (not step.get("questions") or len(step.get("questions", [])) == 0) and existing:
                    step["questions"] = existing.get("questions", [])

                # Add question count for UI convenience
                if "questions" in step and isinstance(step["questions"], list):
                    step["question_count"] = len(step["questions"])

            merged.append(step)

        execute(
            "UPDATE experiments SET steps = %s, updated_at = NOW() WHERE id = %s",
            (json.dumps(merged), experiment_id)
        )

    # Activate experiment
    execute(
        "UPDATE experiments SET status = 'active', updated_at = NOW() WHERE id = %s",
        (experiment_id,)
    )

    # Auto-assign variants to participants missing them
    if exp.get("randomization", False):
        null_rows = fetch_all(
            "SELECT id FROM participants WHERE experiment_id = %s AND variant IS NULL",
            (experiment_id,)
        )
        assigned = 0
        for row in null_rows:
            variant = random.choice(['A', 'B'])
            execute("UPDATE participants SET variant = %s WHERE id = %s", (variant, row["id"]))
            assigned += 1
        if assigned:
            print(f"[FINALIZE] Assigned variants to {assigned} participants in exp {experiment_id}")

    # Fallback: ensure at least one invited participant
    has_invited = fetch_one(
        "SELECT 1 FROM participants WHERE experiment_id = %s AND status = 'invited' LIMIT 1",
        (experiment_id,)
    )
    if not has_invited:
        anon_id = str(uuid.uuid4())[:12]
        variant = random.choice(['A', 'B']) if exp.get("randomization", False) else 'A'
        execute(
            """
            INSERT INTO participants
            (experiment_id, anon_id, status, variant, created_at)
            VALUES (%s, %s, 'invited', %s, NOW())
            """,
            (experiment_id, anon_id, variant)
        )
        print(f"[FINALIZE] Created fallback invited participant for exp {experiment_id}")

    return {
        "experiment_id": experiment_id,
        "status": "active",
        "message": "Experiment finalized and activated successfully"
    }


# ────────────────────────────────────────────────
# Keep the remaining endpoints below unchanged:
# get_experiment, delete_experiment, reorder_steps, status update,
# add-survey, demographics, etc.
# ────────────────────────────────────────────────

@app.get("/experiments/by-session/{session_id}")
def get_experiment_by_session(session_id: str):
    row = fetch_one(
        """
        SELECT
            p.id AS participant_id,
            p.anon_id AS participant_anon_id,
            p.variant,
            p.experiment_id,
            e.title,
            e.description,
            e.chatbot_id_a,
            e.chatbot_id_b,
            ca.public_url AS url_a,
            cb.public_url AS url_b,
            e.external_chatbot_url,
            e.steps,
            e.anonymization,
            e.randomization
        FROM participants p
        JOIN experiments e ON p.experiment_id = e.id
        LEFT JOIN chatbots ca ON e.chatbot_id_a = ca.id
        LEFT JOIN chatbots cb ON e.chatbot_id_b = cb.id
        WHERE p.anon_id = %s
        LIMIT 1
        """,
        (session_id,)
    )
    
    if not row:
        raise HTTPException(status_code=404, detail="Invalid or expired session")

    # ─── Variant fallback & safety checks ───────────────────────────────
    variant = row.get("variant")
    
    if variant not in ('A', 'B'):
        variant = 'A'
        print(f"Warning: participant {session_id} has no/invalid variant → defaulting to A")

    if variant == 'A':
        active_url = row["url_a"]
        active_id  = row["chatbot_id_a"]
    else:  # 'B' or fallback
        active_url = row["url_b"]
        active_id  = row["chatbot_id_b"]

    # Final safety: if somehow both URLs are missing
    if not active_url:
        raise HTTPException(
            status_code=500,
            detail=f"Chatbot URL missing for variant {variant} (chatbot_id: {active_id or 'unknown'})"
        )

    # ─── NEW: extra safety for missing chatbot ID ───────────────────────
    if not active_id:
        raise HTTPException(
            status_code=500,
            detail=f"No chatbot configured for variant {variant} in experiment {row['experiment_id']}"
        )

    # ─── Optional: log successful access (good for debugging in production) ───
    print(f"Session {session_id} loaded → variant {variant}, chatbot {active_id}")

    return {
        "id": row["experiment_id"],
        "title": row["title"],
        "description": row["description"] or "",
        "participant_id": row["participant_id"],
        "participant_anon_id": row["participant_anon_id"],
        
        # The key part the frontend needs
        "chatbot": {
            "id": active_id,
            "url": active_url,
            "variant": variant
        },
        
        # Keep everything else the frontend already expects
        "external_chatbot_url": row.get("external_chatbot_url"),
        "steps": json.loads(row["steps"]) if row.get("steps") else [],
        "anonymization": bool(row["anonymization"]),
        "randomization": bool(row["randomization"]),
    }


@app.post("/experiments/save-general")
def save_experiment_general(data: dict, current_user: dict = Depends(company_required)):
    title = (data.get("title") or "").strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    experiment_id = data.get("experiment_id")
    make_active = data.get("make_active", False)
    desired_status = "active" if make_active else "draft"

    # NEW: Extract A & B (required!)
    chatbot_a = data.get("chatbot_id_a")
    chatbot_b = data.get("chatbot_id_b")

    if experiment_id is None:
        # Create new → both A & B mandatory
        if not chatbot_a or not chatbot_b:
            raise HTTPException(422, "Both Chatbot A and Chatbot B are required for new experiments")
        if int(chatbot_a) == int(chatbot_b):
            raise HTTPException(422, "Chatbot A and Chatbot B must be different")

        exp_id = execute(
            """
            INSERT INTO experiments
            (title, description, chatbot_id_a, chatbot_id_b, external_chatbot_url, steps,
             anonymization, randomization, user_id, status, budget, participant_limit)
            VALUES (%s, %s, %s, %s, %s, %s, 1, %s, %s, %s, %s, %s)
            """,
            (
                title,
                data.get("description", ""),
                chatbot_a,
                chatbot_b,
                data.get("external_chatbot_url"),
                json.dumps([]),
                data.get("randomization", True),
                current_user["id"],
                desired_status,
                data.get("budget", 0.0),
                data.get("participant_limit"),
            )
        )
        return {
            "experiment_id": exp_id,
            "status": desired_status,
            "message": f"Experiment created as {desired_status}"
        }

    # Update existing
    try:
        exp_id = int(experiment_id)
    except:
        raise HTTPException(400, "Invalid experiment_id")

    exp = fetch_one("SELECT user_id FROM experiments WHERE id=%s", (exp_id,))
    if not exp:
        raise HTTPException(404, "Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(403, "Not authorized")

    execute(
        """
        UPDATE experiments
        SET title = %s,
            description = %s,
            chatbot_id_a = %s,
            chatbot_id_b = %s,
            external_chatbot_url = %s,
            status = %s,
            updated_at = NOW()
        WHERE id = %s
        """,
        (
            title,
            data.get("description", ""),
            chatbot_a,
            chatbot_b,
            data.get("external_chatbot_url"),
            desired_status,
            exp_id,
        )
    )

    return {
        "experiment_id": exp_id,
        "status": desired_status,
        "message": f"Experiment updated as {desired_status}"
    }


# @app.post("/experiments/{experiment_id}/finalize")
# def finalize_experiment(experiment_id: int, data: dict = Body(...), current_user: dict = Depends(company_required)):
#     exp = fetch_one("SELECT user_id, steps FROM experiments WHERE id=%s", (experiment_id,))
#     if not exp:
#         raise HTTPException(404, "Experiment not found")
#     if exp["user_id"] != current_user["id"]:
#         raise HTTPException(403, "Not authorized")

#     incoming_steps = data.get("steps")
#     if incoming_steps is not None:
#         if not isinstance(incoming_steps, list):
#             raise HTTPException(400, "steps must be a list")

#         # ✅ Load existing steps from DB (the ones added via add-survey)
#         existing_steps = json.loads(exp["steps"]) if exp.get("steps") else []

#         # Build lookup by step id (best) and fallback by survey_type
#         existing_by_id = {s.get("id"): s for s in existing_steps if s.get("id")}
#         existing_by_type = {
#             s.get("survey_type"): s for s in existing_steps
#             if s.get("type") == "survey" and s.get("survey_type")
#         }

#         merged = []
#         for step in incoming_steps:
#             if not isinstance(step, dict):
#                 merged.append(step)
#                 continue

#             if step.get("type") == "survey":
#                 sid = step.get("id")
#                 stype = step.get("survey_type")

#                 existing = None
#                 if sid and sid in existing_by_id:
#                     existing = existing_by_id[sid]
#                 elif stype and stype in existing_by_type:
#                     existing = existing_by_type[stype]

#                 # ✅ If frontend sent survey step without questions, keep DB questions
#                 incoming_q = step.get("questions")
#                 if (incoming_q is None or (isinstance(incoming_q, list) and len(incoming_q) == 0)) and existing:
#                     step["questions"] = existing.get("questions", [])

#                 # ✅ Always keep a count field too (helps UI)
#                 if "questions" in step and isinstance(step["questions"], list):
#                     step["question_count"] = len(step["questions"])

#             merged.append(step)

#         execute("UPDATE experiments SET steps = %s WHERE id = %s", (json.dumps(merged), experiment_id))

#     # Activate
#     execute("UPDATE experiments SET status = 'active', updated_at = NOW() WHERE id = %s", (experiment_id,))

#     # Ensure at least one invited participant exists
#     has_invited = fetch_one(
#         "SELECT 1 FROM participants WHERE experiment_id = %s AND status = 'invited' LIMIT 1",
#         (experiment_id,)
#     )
#     if not has_invited:
#         anon_id = str(uuid.uuid4())[:12]
#         execute(
#             "INSERT INTO participants (experiment_id, anon_id, status) VALUES (%s, %s, 'invited')",
#             (experiment_id, anon_id)
#         )

#     return {"experiment_id": experiment_id, "status": "active", "message": "Experiment finalized and activated"}

@app.get("/experiments/{experiment_id}")
def get_experiment(experiment_id: int, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")

    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Not authorized")

    exp["steps"] = json.loads(exp["steps"]) if exp.get("steps") else []
    return exp



@app.delete("/experiments/{experiment_id}")
def delete_experiment(experiment_id: int, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Not authorized")
    execute("DELETE FROM participants WHERE experiment_id=%s", (experiment_id,))
    execute("DELETE FROM invitations WHERE experiment_id=%s", (experiment_id,))
    execute("DELETE FROM survey_results WHERE experiment_id=%s", (experiment_id,))
    execute("DELETE FROM experiments WHERE id=%s", (experiment_id,))
    return {"message": "Experiment and all related data deleted"}


@app.put("/experiments/{experiment_id}/reorder_steps")
def reorder_experiment_steps(experiment_id: int, data: StepsReorder, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Not authorized to reorder steps")
    execute("UPDATE experiments SET steps=%s WHERE id=%s", (json.dumps(data.steps), experiment_id))
    return {"message": "Experiment steps reordered successfully"}


@app.put("/experiments/{experiment_id}/status")
def update_experiment_status(experiment_id: int, data: ExperimentStatusUpdate, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Not authorized")
    new_status = data.status
    if new_status not in ["active", "inactive", "completed", "launched"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    execute("UPDATE experiments SET status=%s WHERE id=%s", (new_status, experiment_id))
    return {"message": f"Experiment status updated to {new_status}"}


# ✅ UPDATED: supports all new survey types + stores questions always (demographics customizable)
@app.post("/experiments/{experiment_id}/add-survey")
def add_survey_to_experiment(
    experiment_id: str,
    body: dict,
    current_user: dict = Depends(company_required),
):
    survey_type = _normalize_survey_type(body.get("survey_type", ""))
    title = body.get("title")
    questions = body.get("questions", [])

    if survey_type not in VALID_SURVEY_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid survey_type: {survey_type}")

    # //Added/updated for experimentConfig
    # UI now creates draft via /experiments/save-general; no auto-create here.
    try:
        experiment_id_int = int(experiment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid experiment ID")

    exp = fetch_one("SELECT steps, user_id FROM experiments WHERE id=%s", (experiment_id_int,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    steps = json.loads(exp["steps"]) if exp["steps"] else []

    new_step = {
        "id": f"survey-{uuid.uuid4().hex[:10]}",
        "type": "survey",
        "title": title or f"{survey_type.upper()} Questionnaire",
        "survey_type": survey_type,     # ✅ lowercase to match frontend
        "questions": questions or [],   # ✅ always store questions (demographics + others)
    }

    steps.append(new_step)
    execute("UPDATE experiments SET steps=%s WHERE id=%s", (json.dumps(steps), experiment_id_int))

    return {"message": "Survey added!", "step": new_step, "experiment_id": experiment_id_int}

@app.get("/experiments/{experiment_id}/demographics")
def get_experiment_demographics(
    experiment_id: int,
    current_user: dict = Depends(company_required)
):
    exp = fetch_one("SELECT user_id FROM experiments WHERE id = %s", (experiment_id,))
    if not exp:
        raise HTTPException(404, "Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(403, "Not authorized")

    demo_stats = fetch_one("""
        SELECT 
            COUNT(*) AS total_responses,
            -- Gender
            SUM(CASE WHEN JSON_EXTRACT(answers, '$.gender') = 'Male' THEN 1 ELSE 0 END) AS male,
            SUM(CASE WHEN JSON_EXTRACT(answers, '$.gender') = 'Female' THEN 1 ELSE 0 END) AS female,
            SUM(CASE WHEN JSON_EXTRACT(answers, '$.gender') = 'Non-binary' THEN 1 ELSE 0 END) AS non_binary,
            SUM(CASE WHEN JSON_EXTRACT(answers, '$.gender') = 'Prefer not to say' THEN 1 ELSE 0 END) AS prefer_not_say,
            -- Age ranges (assuming frontend sends age as number or range string)
            SUM(CASE WHEN JSON_EXTRACT(answers, '$.age') < 18 THEN 1 ELSE 0 END) AS age_under_18,
            SUM(CASE WHEN JSON_EXTRACT(answers, '$.age') BETWEEN 18 AND 24 THEN 1 ELSE 0 END) AS age_18_24,
            SUM(CASE WHEN JSON_EXTRACT(answers, '$.age') BETWEEN 25 AND 34 THEN 1 ELSE 0 END) AS age_25_34,
            -- Add more ranges as needed
            -- Country (if collected)
            JSON_EXTRACT(answers, '$.country') AS countries_json
        FROM survey_results
        WHERE experiment_id = %s
          AND survey_type = 'demographics'
        GROUP BY experiment_id
    """, (experiment_id,))

    if not demo_stats or demo_stats["total_responses"] == 0:
        return {"total_responses": 0, "gender": {}, "age": {}, "countries": {}}

    total = demo_stats["total_responses"]

    return {
        "total_responses": total,
        "gender": {
            "Male": round((demo_stats["male"] or 0) / total * 100, 1),
            "Female": round((demo_stats["female"] or 0) / total * 100, 1),
            "Non-binary": round((demo_stats["non_binary"] or 0) / total * 100, 1),
            "Prefer not to say": round((demo_stats["prefer_not_say"] or 0) / total * 100, 1),
        },
        "age": {
            "Under 18": round((demo_stats["age_under_18"] or 0) / total * 100, 1),
            "18-24": round((demo_stats["age_18_24"] or 0) / total * 100, 1),
            "25-34": round((demo_stats["age_25_34"] or 0) / total * 100, 1),
            # Add more ranges...
        },
        # "countries": ... (parse JSON if needed)
    }

# -------------------------------
# PARTICIPANTS ENDPOINTS
# -------------------------------
@app.get("/participants")
def list_all_participants(current_user: dict = Depends(participant_required)):
    return fetch_all("SELECT * FROM participants")


@app.get("/participants/{participant_id}")
def get_participant(participant_id: int, current_user: dict = Depends(participant_required)):
    part = fetch_one("SELECT * FROM participants WHERE id=%s", (participant_id,))
    if not part:
        raise HTTPException(status_code=404, detail="Participant not found")
    return part


@app.post("/participants")
def create_participant(part: ParticipantRegister, current_user: dict = Depends(participant_required)):
    anon_id = str(uuid.uuid4())
    part_id = execute("INSERT INTO participants (experiment_id, anon_id) VALUES (%s,%s)", (part.experiment_id, anon_id))
    return {"participant_id": part_id, "anon_id": anon_id}


@app.put("/participants/{participant_id}")
def update_participant(participant_id: int, data: dict, current_user: dict = Depends(participant_required)):
    participant = fetch_one("SELECT * FROM participants WHERE id=%s", (participant_id,))
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (participant["experiment_id"],))
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    allowed = {}
    for k in ["status", "group", "random_order", "email"]:
        if k in data:
            allowed[k] = data[k]

    if "email" in allowed:
        execute(
            "UPDATE invitations SET email=%s WHERE experiment_id=%s AND anon_id=%s",
            (allowed["email"], participant["experiment_id"], participant["anon_id"]),
        )

    sets = []
    vals = []
    for k in ["status", "group", "random_order"]:
        if k in allowed:
            sets.append(f"{k}=%s")
            vals.append(allowed[k])

    if sets:
        vals.append(participant_id)
        execute(f"UPDATE participants SET {', '.join(sets)} WHERE id=%s", tuple(vals))

    return {"message": "Participant updated"}


@app.delete("/participants/{participant_id}")
def delete_participant(participant_id: int, current_user: dict = Depends(participant_required)):
    participant = fetch_one("SELECT * FROM participants WHERE id=%s", (participant_id,))
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (participant["experiment_id"],))
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    execute("DELETE FROM participants WHERE id=%s", (participant_id,))
    return {"message": "Participant deleted"}

# ────────────────────────────────────────────────
# GLOBAL PARTICIPANT POOL ENDPOINTS
# ────────────────────────────────────────────────

@app.post("/pool/join")
async def join_pool(user: dict = Depends(participant_required)):
    execute(
        "UPDATE participants SET is_in_pool = 1, consent_given = 1, consent_date = NOW() "
        "WHERE user_id = %s",
        (user['id'],)
    )
    return {"message": "Joined global participant pool"}

@app.get("/pool")
async def get_pool(
    user: dict = Depends(company_required),
    age_range: Optional[str] = None,
    gender: Optional[str] = None,
    region: Optional[str] = None,
    education: Optional[str] = None,
    chatbot_use_frequency: Optional[str] = None,
    limit: int = 50
):
    query = """
        SELECT p.id, p.anon_id, p.age_range, p.gender, p.region, p.education, 
               p.chatbot_use_frequency, u.email 
        FROM participants p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.is_in_pool = 1 AND p.consent_given = 1
    """
    params = []
    if age_range:
        query += " AND p.age_range = %s"
        params.append(age_range)
    if gender:
        query += " AND p.gender = %s"
        params.append(gender)
    if region:
        query += " AND p.region = %s"
        params.append(region)
    if education:
        query += " AND p.education = %s"
        params.append(education)
    if chatbot_use_frequency:
        query += " AND p.chatbot_use_frequency = %s"
        params.append(chatbot_use_frequency)
    
    query += " LIMIT %s"
    params.append(limit)

    pool = fetch_all(query, tuple(params))
    return {"participants": pool}    
@app.post("/participants/complete/{experiment_id}")
def complete_participant(
    experiment_id: int,
    current_user: dict = Depends(participant_required)
):
    print(f"COMPLETE CALLED - exp={experiment_id}, user={current_user['id']}")

    participant = fetch_one("""
        SELECT p.id AS participant_id, p.status, p.user_id, e.stars_per_completion
        FROM participants p
        JOIN experiments e ON p.experiment_id = e.id
        WHERE p.user_id = %s AND p.experiment_id = %s
        LIMIT 1
    """, (current_user["id"], experiment_id))

    if not participant:
        raise HTTPException(404, "You are not participating in this experiment")

    stars = participant.get("stars_per_completion") or 50

    # Mark complete (safe)
    execute("""
        UPDATE participants 
        SET status = 'complete', completed_at = NOW()
        WHERE id = %s
    """, (participant["participant_id"],))

    # Always ensure stars are in the table
    execute("""
        INSERT INTO participant_rewards 
            (participant_id, experiment_id, stars_earned, awarded_at)
        VALUES (%s, %s, %s, NOW())
        ON DUPLICATE KEY UPDATE stars_earned = %s
    """, (participant["participant_id"], experiment_id, stars, stars))

    award_badges_for_participant(
        participant_id=participant["participant_id"],
        user_id=current_user["id"],
        experiment_id=experiment_id
    )

    return {
        "message": "Experiment completed!",
        "stars_earned": stars
    }

# @app.post("/participants/complete/{experiment_id}")
# def complete_participant(
#     experiment_id: int,
#     current_user: dict = Depends(participant_required)
# ):
#     print(f"COMPLETE CALLED - exp={experiment_id}, user={current_user['id']}")

#     participant = fetch_one("""
#         SELECT 
#             p.id AS participant_id,
#             p.status,
#             p.user_id,
#             e.stars_per_completion
#         FROM participants p
#         JOIN experiments e ON p.experiment_id = e.id
#         WHERE p.user_id = %s AND p.experiment_id = %s
#         LIMIT 1
#     """, (current_user["id"], experiment_id))

#     if not participant:
#         raise HTTPException(404, "You are not participating in this experiment")

#     if participant["status"] == "complete":
#         return {"message": "Already completed", "stars_earned": 0}

#     # Mark complete
#     execute("""
#         UPDATE participants 
#         SET status = 'complete', completed_at = NOW()
#         WHERE id = %s
#     """, (participant["participant_id"],))

#     # Award stars
#     stars = participant.get("stars_per_completion") or 50

#     execute("""
#         INSERT INTO participant_rewards 
#             (participant_id, experiment_id, stars_earned, awarded_at)
#         VALUES (%s, %s, %s, NOW())
#         ON DUPLICATE KEY UPDATE stars_earned = %s
#     """, (participant["participant_id"], experiment_id, stars, stars))

#     award_badges_for_participant(
#         participant_id=participant["participant_id"],
#         user_id=current_user["id"],
#         experiment_id=experiment_id
#     )

#     return {
#         "message": "Experiment completed!",
#         "stars_earned": stars
#     }


@app.get("/experiments/{experiment_id}/participants")
def list_participants(experiment_id: int, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp or (exp["user_id"] != current_user["id"] and not current_user.get("is_admin")):
        raise HTTPException(status_code=403, detail="Not authorized")
    return fetch_all("SELECT * FROM participants WHERE experiment_id=%s", (experiment_id,))


# -------------------------------
# INVITATIONS & EMAIL
# -------------------------------

def send_invite_email(email: str, link: str, title: str, stars: int):
    try:
        resend.Emails.send({
            "from": "Chatbot Experiments <no-reply@yourdomain.com>",  # ← change domain
            "to": [email],
            "subject": f"Join {title} - Earn {stars} Stars",
            "html": f"""
                <h2>You're invited to participate!</h2>
                <p>Click below to start the study:</p>
                <a href="{link}" style="background:#6366f1;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;">
                    Start Experiment
                </a>
                <p>Earn <strong>{stars} stars</strong> upon completion.</p>
                <hr>
                <small>From Ariv Chatbot Research Platform</small>
            """
        })
    except Exception as e:
        print(f"Email failed for {email}: {e}")

def send_completion_email(email: str, stars: int):
    try:
        resend.Emails.send({
            "from": "Chatbot Experiments <no-reply@yourdomain.com>",
            "to": [email],
            "subject": "Study Complete — Stars Awarded!",
            "html": f"""
                <h2>Congratulations!</h2>
                <p>You've successfully completed the study.</p>
                <p><strong>{stars} stars</strong> have been added to your account.</p>
                <p>Check your dashboard to see your rewards.</p>
            """
        })
    except Exception as e:
        print(f"Completion email failed: {e}")

@app.post("/experiments/{experiment_id}/invite")
def invite_participants(
    experiment_id: int,
    data: Dict[str, List[str]],
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(company_required),
):
    emails = data.get("emails", [])
    if not emails:
        raise HTTPException(status_code=400, detail="No emails provided")

    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    sent_count = 0
    for email in emails:
        anon_id = str(uuid.uuid4())
        try:
            execute("INSERT INTO invitations (experiment_id, email, anon_id) VALUES (%s,%s,%s)", (experiment_id, email, anon_id))
            link = f"https://ariv-one.vercel.app/participant/{anon_id}"
            background_tasks.add_task(send_invite_email, email, link, exp["title"], exp.get("stars_per_completion", 50))
            sent_count += 1
        except mysql.connector.IntegrityError:
            continue

    return {"message": f"{sent_count} invitations scheduled to be sent"}


@app.post("/invitations/accept")
def accept_invitation(data: InvitationAccept):
    invitation = fetch_one(
        "SELECT anon_id FROM invitations WHERE experiment_id=%s AND email=%s",
        (data.experiment_id, data.email)
    )
    if not invitation:
        raise HTTPException(status_code=400, detail="Invalid or expired invitation")

    user = fetch_one("SELECT id FROM users WHERE email=%s", (data.email,))
    if not user:
        raise HTTPException(status_code=400, detail="No user account found for this email")

    participant_id = execute(
        "INSERT INTO participants (experiment_id, anon_id, email, user_id) VALUES (%s,%s,%s,%s)",
        (data.experiment_id, invitation["anon_id"], data.email, user["id"]),
    )
    return {"participant_id": participant_id, "anon_id": invitation["anon_id"]}


# -------------------------------
# SURVEYS ENDPOINTS
# -------------------------------
@app.get("/surveys")
def list_surveys(current_user: dict = Depends(company_required)):
    surveys = fetch_all("SELECT * FROM surveys")
    for s in surveys:
        s["questions"] = json.loads(s["questions"])
    return surveys


@app.post("/surveys")
def create_survey(data: dict, current_user: dict = Depends(company_required)):
    survey_id = execute("INSERT INTO surveys (name, questions) VALUES (%s,%s)", (data["name"], json.dumps(data["questions"])))
    return {"survey_id": survey_id, "message": "Survey created"}
@app.post("/survey_results")
async def submit_survey_result(
    background_tasks: BackgroundTasks,
    result: SurveyResult
):
    print("\n" + "="*80)
    print(f"[SURVEY SUBMIT] {datetime.now()}")
    print(f"Received payload: {result.dict()}")

    # 1. Validate participant belongs to experiment
    participant = fetch_one("""
        SELECT id, experiment_id, status, user_id, completed_at
        FROM participants
        WHERE id = %s AND experiment_id = %s
    """, (result.participant_id, result.experiment_id))

    if not participant:
        print("→ REJECT: Participant not found or does not belong to this experiment")
        raise HTTPException(403, "Invalid participant or experiment")

    if participant["status"] == "complete":
        print("→ REJECT: Experiment already marked complete")
        raise HTTPException(409, "Experiment already completed")

    survey_type = _normalize_survey_type(result.survey_type)

    # 2. Prevent duplicate submission for same survey type
    duplicate = fetch_one("""
        SELECT 1 FROM survey_results
        WHERE experiment_id = %s AND participant_id = %s AND survey_type = %s
        LIMIT 1
    """, (result.experiment_id, result.participant_id, survey_type))

    if duplicate:
        print(f"→ REJECT: Duplicate submission for {survey_type}")
        raise HTTPException(409, f"{survey_type.upper()} survey already submitted")

    # 3. Save the survey result
    computed_score = _calc_sus_score_from_answers(result.answers) if survey_type == "sus" else None

    execute("""
        INSERT INTO survey_results
        (experiment_id, participant_id, survey_type, answers, computed_score, created_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
    """, (
        result.experiment_id,
        result.participant_id,
        survey_type,
        json.dumps(result.answers),
        computed_score
    ))

    print(f"→ Survey {survey_type} saved successfully")

    # 4. Load experiment to check if all surveys are done
    exp = fetch_one("""
        SELECT steps, stars_per_completion
        FROM experiments WHERE id = %s
    """, (result.experiment_id,))

    if not exp:
        print("→ WARNING: Experiment not found after save")
        return {"status": "success", "message": "Survey saved", "all_surveys_done": False}

    steps = json.loads(exp.get("steps") or "[]")
    stars = exp.get("stars_per_completion") or 50

    # Check required surveys vs submitted
    required = {_normalize_survey_type(s["survey_type"]) for s in steps
                if s.get("type") == "survey" and s.get("survey_type")}

    submitted = {r["survey_type"] for r in fetch_all("""
        SELECT survey_type FROM survey_results
        WHERE participant_id = %s AND experiment_id = %s
    """, (result.participant_id, result.experiment_id))}

    all_surveys_done = required.issubset(submitted) if required else True

    print(f"→ All required surveys completed? {all_surveys_done} (required: {required}, submitted: {submitted})")

    return {
        "status": "success",
        "message": f"{survey_type.upper()} survey saved",
        "all_surveys_done": all_surveys_done,
        "stars_earned": 0  # Stars only awarded on final complete call
    }
# @app.post("/survey_results")
# async def submit_survey_result(
#     background_tasks: BackgroundTasks,
#     result: SurveyResult
# ):
#     print("\n" + "="*60)
#     print(f"[SURVEY SUBMIT] START at {datetime.now()}")
#     print(f"Received payload: participant_id={result.participant_id}, "
#           f"experiment_id={result.experiment_id}, survey_type={result.survey_type}")
#     print(f"Answers keys: {list(result.answers.keys())}")

#     # 1. Fetch participant
#     participant = fetch_one("""
#         SELECT id, experiment_id, status, user_id, completed_at
#         FROM participants
#         WHERE id = %s AND experiment_id = %s
#     """, (result.participant_id, result.experiment_id))

#     if not participant:
#         print("→ REJECT: Participant not found or wrong experiment_id")
#         raise HTTPException(403, "Invalid participant or experiment")

#     print(f"→ Participant found: id={participant['id']}, user_id={participant['user_id']}, "
#           f"status={participant['status']}, completed_at={participant['completed_at']}")

#     # 2. Already complete?
#     if participant["status"] == "complete":
#         print("→ REJECT: Participant already marked complete → no further processing")
#         raise HTTPException(409, "Already completed")

#     survey_type = _normalize_survey_type(result.survey_type)
#     print(f"→ Normalized survey_type: {survey_type}")

#     # 3. Duplicate check
#     duplicate = fetch_one("""
#         SELECT 1 FROM survey_results
#         WHERE experiment_id = %s AND participant_id = %s AND survey_type = %s
#         LIMIT 1
#     """, (result.experiment_id, result.participant_id, survey_type))

#     if duplicate:
#         print(f"→ REJECT: Duplicate {survey_type} submission detected")
#         raise HTTPException(409, f"{survey_type.upper()} already submitted")

#     print("→ No duplicate → proceeding to save")

#     # 4. Save survey
#     computed_score = _calc_sus_score_from_answers(result.answers) if survey_type == "sus" else None
#     execute("""
#         INSERT INTO survey_results
#         (experiment_id, participant_id, survey_type, answers, computed_score, created_at)
#         VALUES (%s, %s, %s, %s, %s, NOW())
#     """, (
#         result.experiment_id, result.participant_id, survey_type,
#         json.dumps(result.answers), computed_score
#     ))
#     print(f"→ SURVEY SAVED successfully: {survey_type}")

#     # 5. Load experiment steps
#     exp = fetch_one("""
#         SELECT steps, stars_per_completion
#         FROM experiments
#         WHERE id = %s
#     """, (result.experiment_id,))

#     if not exp:
#         print("→ ERROR: Experiment not found after save")
#         return {"status": "success", "message": "Survey saved", "completed": False}

#     steps_json = exp.get("steps")
#     print(f"→ Raw steps JSON from DB: {steps_json[:200]}{'...' if len(str(steps_json)) > 200 else ''}")

#     try:
#         steps = json.loads(steps_json) if steps_json else []
#         print(f"→ Parsed steps count: {len(steps)}")
#     except Exception as e:
#         print(f"→ JSON parse ERROR on steps: {e}")
#         steps = []

#     # 6. Required survey types
#     required = set()
#     for s in steps:
#         if s.get("type") == "survey" and s.get("survey_type"):
#             required.add(_normalize_survey_type(s["survey_type"]))
#     print(f"→ Required survey types for this experiment: {sorted(required)} (empty = no surveys required)")

#     # 7. Submitted so far (for this participant + experiment)
#     submitted_rows = fetch_all("""
#         SELECT survey_type
#         FROM survey_results
#         WHERE participant_id = %s AND experiment_id = %s
#     """, (result.participant_id, result.experiment_id))
#     submitted = {_normalize_survey_type(r["survey_type"]) for r in submitted_rows}
#     print(f"→ Submitted so far: {sorted(submitted)}")

#     # 8. Completion check
#     is_complete = True
#     if required:
#         missing = required - submitted
#         if missing:
#             is_complete = False
#             print(f"→ NOT COMPLETE: missing surveys → {sorted(missing)}")
#         else:
#             print("→ All required surveys submitted → COMPLETE")
#     else:
#         print("→ No surveys required → auto-complete ALLOWED")

#     if is_complete:
#         print("\n→ COMPLETION CONDITION MET → attempting to mark complete & award rewards")
        
#         updated = execute("""
#             UPDATE participants
#             SET status = 'complete',
#                 completed_at = NOW()
#             WHERE id = %s AND status != 'complete'
#         """, (result.participant_id,))

#         print(f"→ UPDATE complete query affected {updated} rows")

#         if updated > 0:
#             print(f"[SUCCESS] Participant {result.participant_id} is NOW marked COMPLETE!")
#             stars = exp.get("stars_per_completion", 50) or 50
#             print(f"→ Awarding {stars} stars")

#             execute("""
#                 INSERT INTO participant_rewards
#                     (participant_id, experiment_id, stars_earned, awarded_at)
#                 VALUES (%s, %s, %s, NOW())
#                 ON DUPLICATE KEY UPDATE stars_earned = %s
#             """, (result.participant_id, result.experiment_id, stars, stars))
#             print("→ Stars awarded (or updated)")

#             print(f"\n→ Starting badge check for participant {result.participant_id} (user {participant['user_id']})")
#             newly_awarded_badges = award_badges_for_participant(
#                 participant_id = result.participant_id,
#                 user_id = participant["user_id"],
#                 experiment_id = result.experiment_id
#             )
#             print(f"→ Badges awarding finished. New badges this time: {newly_awarded_badges}")

#             # Email
#             email_row = fetch_one("""
#                 SELECT u.email
#                 FROM users u
#                 JOIN participants p ON p.user_id = u.id
#                 WHERE p.id = %s
#             """, (result.participant_id,))
#             if email_row and email_row.get("email"):
#                 print(f"→ Scheduling completion email to {email_row['email']}")
#                 background_tasks.add_task(
#                     send_completion_email,
#                     email_row["email"],
#                     stars
#                 )
#             else:
#                 print("→ No email found for participant → skipping email")
#         else:
#             print("→ UPDATE affected 0 rows → participant was already complete → skipping rewards")
#     else:
#         print("→ Completion condition NOT met → skipping stars, badges, email")

#     print("[SURVEY SUBMIT] END")
#     print("="*60 + "\n")

#     return {
#         "status": "success",
#         "message": f"{survey_type.upper()} saved",
#         "completed": participant["status"] == "complete" or is_complete
#     }
    
# def award_badges_for_participant(participant_id: int = None, user_id: int = None, experiment_id: int = None):
#     print(f"\n=== BADGE AWARD START === {datetime.now()} | pid={participant_id} | uid={user_id} | exp={experiment_id}")

#     # Prefer user_id if given, otherwise try to resolve from participant_id
#     if user_id is None:
#         if participant_id is None:
#             print("→ CRITICAL: No user_id AND no participant_id → cannot award badges")
#             return []
#         row = fetch_one("SELECT user_id FROM participants WHERE id = %s LIMIT 1", (participant_id,))
#         if not row or not row.get("user_id"):
#             print(f"→ ERROR: participant_id {participant_id} has no user_id or doesn't exist")
#             return []
#         user_id = row["user_id"]
#         print(f"→ Resolved user_id = {user_id} from participant_id {participant_id}")

#     print(f"→ Working with user_id = {user_id}")

#     # Get user-level stats (across ALL their participant rows)
#     stats = fetch_one("""
#         SELECT 
#             COUNT(DISTINCT CASE WHEN p.status = 'complete' AND p.completed_at IS NOT NULL 
#                                 THEN p.experiment_id END) AS total_completed,
#             COALESCE(SUM(pr.stars_earned), 0) AS total_stars,
#             MIN(CASE WHEN p.status = 'complete' AND p.completed_at IS NOT NULL 
#                      THEN TIMESTAMPDIFF(MINUTE, p.created_at, p.completed_at) END) AS fastest_minutes
#         FROM participants p
#         LEFT JOIN participant_rewards pr 
#                ON pr.participant_id = p.id 
#               AND pr.experiment_id = p.experiment_id
#         WHERE p.user_id = %s
#     """, (user_id,))

#     total_completed = int(stats.get("total_completed") or 0) if stats else 0
#     total_stars     = int(stats.get("total_stars") or 0)     if stats else 0
#     fastest         = stats.get("fastest_minutes")           if stats else None

#     print(f"→ Stats for user {user_id}: completed={total_completed}, stars={total_stars}, fastest={fastest} min")

#     # Determine qualifying badges
#     candidates = []
#     if total_completed >= 1: candidates.append(('first_study', 'First Study'))
#     if total_stars >= 5:     candidates.append(('five_stars', 'Rising Star'))
#     if total_completed >= 5: candidates.append(('chat_master', 'Chat Master'))
#     if fastest is not None and fastest < 10:
#         candidates.append(('speed_demon', 'Speed Demon'))
#     if total_completed >= 10: candidates.append(('loyal_scientist', 'Loyal Scientist'))

#     try:
#         fb = fetch_one("""
#             SELECT COUNT(*) as cnt
#             FROM survey_results sr
#             JOIN participants p ON sr.participant_id = p.id
#             WHERE p.user_id = %s AND JSON_LENGTH(sr.answers) >= 3
#         """, (user_id,))
#         if fb and fb["cnt"] >= 3:
#             candidates.append(('feedback_pro', 'Feedback Pro'))
#     except Exception as e:
#         print(f"→ Feedback Pro check failed: {e}")

#     print(f"→ Qualifying badges: {candidates}")

#     if not candidates:
#         print("→ No badges qualify → nothing to award")
#         return []

#     newly_awarded = []
#     for key, name in candidates:
#         # Safety: badge must exist
#         if not fetch_one("SELECT 1 FROM badges WHERE badge_key = %s LIMIT 1", (key,)):
#             print(f"→ Badge key '{key}' missing in badges table → skip")
#             continue

#         # Check if user already has this badge (prevent duplicates)
#         already = fetch_one("""
#             SELECT 1 FROM participant_badges 
#             WHERE user_id = %s AND badge_key = %s 
#             LIMIT 1
#         """, (user_id, key))

#         if already:
#             print(f"→ User already has: {name} ({key}) → skip")
#             continue

#         # Award it!
#         try:
#             execute("""
#                 INSERT IGNORE INTO participant_badges 
#                     (participant_id, user_id, badge_key, experiment_id, earned_at)
#                 VALUES (%s, %s, %s, %s, NOW())
#             """, (participant_id, user_id, key, experiment_id))
#             newly_awarded.append(name)
#             print(f"→ AWARDED SUCCESS: {name} ({key})")
#         except Exception as e:
#             print(f"→ INSERT FAILED for {key}: {str(e)}")

#     print(f"=== BADGE AWARD END === Awarded: {newly_awarded}")
#     return newly_awarded

def award_badges_for_participant(participant_id: int = None, user_id: int = None, experiment_id: int = None):
    print(f"\n=== BADGE AWARD START === {datetime.now()} | pid={participant_id} | uid={user_id} | exp={experiment_id}")
    
    # Resolve user_id if only participant_id is given
    if user_id is None and participant_id:
        row = fetch_one("SELECT user_id FROM participants WHERE id = %s LIMIT 1", (participant_id,))
        if row and row.get("user_id"):
            user_id = row["user_id"]
        else:
            print("→ ERROR: Could not resolve user_id")
            return []

    if not user_id:
        print("→ CRITICAL: No user_id available")
        return []

    # Get total completed experiments (only count once per experiment)
    stats = fetch_one("""
        SELECT COUNT(DISTINCT experiment_id) as completed_experiments
        FROM participants
        WHERE user_id = %s AND status = 'complete' AND completed_at IS NOT NULL
    """, (user_id,))

    completed = int(stats["completed_experiments"]) if stats and stats["completed_experiments"] else 0
    print(f"→ User {user_id} has completed {completed} experiments")

    # Milestone thresholds and corresponding badge keys
    milestones = [
        (1,  'first_steps'),
        (10, 'dedicated_explorer'),
        (20, 'research_veteran'),
        (30, 'core_contributor'),
        (40, 'elite_participant'),
        (50, 'legend_of_ariv'),
    ]

    newly_awarded = []

    for threshold, badge_key in milestones:
        if completed >= threshold:
            # Check if already awarded
            already = fetch_one("""
                SELECT 1 FROM participant_badges 
                WHERE user_id = %s AND badge_key = %s LIMIT 1
            """, (user_id, badge_key))
            
            if not already:
                try:
                    execute("""
                        INSERT IGNORE INTO participant_badges
                        (participant_id, user_id, badge_key, experiment_id, earned_at)
                        VALUES (%s, %s, %s, %s, NOW())
                    """, (participant_id, user_id, badge_key, experiment_id))
                    newly_awarded.append(badge_key)
                    print(f"→ AWARDED: {badge_key} (at {threshold} experiments)")
                except Exception as e:
                    print(f"→ INSERT FAILED for {badge_key}: {str(e)}")
            else:
                print(f"→ Already has: {badge_key} → skipped")

    print(f"=== BADGE AWARD END === Newly awarded: {newly_awarded}")
    return newly_awarded

@app.post("/experiments/{experiment_id}/complete")
def complete_experiment(experiment_id: int, current_user: dict = Depends(participant_required)):
    """
    Mark an experiment as complete and award badges.
    This is called when a participant finishes all required steps.
    """
    
    # Get participant record
    participant = fetch_one("""
        SELECT id, status, user_id
        FROM participants 
        WHERE user_id = %s AND experiment_id = %s
    """, (current_user['id'], experiment_id))
    
    if not participant:
        raise HTTPException(404, "Participant record not found")
    
    # Only complete if not already complete
    if participant['status'] != 'complete':
        # Mark as complete
        execute("""
            UPDATE participants 
            SET status = 'complete', completed_at = NOW()
            WHERE id = %s
        """, (participant['id'],))
        
        # Get experiment stars
        exp = fetch_one("SELECT stars_per_completion FROM experiments WHERE id = %s", (experiment_id,))
        stars = (exp.get('stars_per_completion') if exp else None) or 50
        
        # Award stars
        execute("""
            INSERT INTO participant_rewards
        (participant_id, experiment_id, stars_earned, awarded_at)
    VALUES (%s, %s, %s, NOW())
    ON DUPLICATE KEY UPDATE stars_earned = %s
        """, (participant_id, experiment_id, stars, stars))
        
        # ✅ AUTO-AWARD BADGES
        newly_awarded = award_badges_for_participant(participant_id = participant['id'],        # ← from the fetched participant
    user_id = current_user['id'],              # ← or participant['user_id']
    experiment_id = experiment_id)
        
        return {
            "message": "Experiment completed successfully",
            "stars_earned": stars,
            "badges_earned": newly_awarded
        }
    
    return {
        "message": "Experiment already completed",
        "stars_earned": 0,
        "badges_earned": []
    }

@app.get("/survey_results/{experiment_id}")
def get_survey_results(experiment_id: int, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp or (exp["user_id"] != current_user["id"] and not current_user.get("is_admin")):
        raise HTTPException(status_code=403, detail="Not authorized")
    results = fetch_all("SELECT * FROM survey_results WHERE experiment_id=%s", (experiment_id,))
    for r in results:
        r["answers"] = json.loads(r["answers"])
    return results


# -------------------------------
# DASHBOARD ENDPOINTS
# -------------------------------
def _user_experiment_ids(user_id: int, is_admin: bool):
    sql = "SELECT id FROM experiments"
    params = ()
    if not is_admin:
        sql += " WHERE user_id = %s"
        params = (user_id,)
    rows = fetch_all(sql, params)
    return [r["id"] for r in rows]


def _calc_sus_score_from_answers(ans: dict) -> Optional[float]:
    """
    Supports keys: sus_1..sus_10 or q1..q10; values expected 1..5 (or labels).
    Returns SUS score 0..100 or None if insufficient.
    """
    total = 0
    count = 0
    for i in range(1, 11):
        v = ans.get(f"sus_{i}")
        if v is None:
            v = ans.get(f"q{i}")
        vi = _to_int(v)
        if vi is None:
            continue
        if not (1 <= vi <= 5):
            continue
        # odd items: (vi - 1), even: (5 - vi)
        total += (vi - 1) if (i % 2 == 1) else (5 - vi)
        count += 1

    if count < 8:  # require enough items to be meaningful
        return None

    # If some missing, normalize to 10 items
    normalized = total * (10 / count)
    return round(normalized * 2.5, 2)


@app.get("/dashboard")
def get_dashboard(current_user: dict = Depends(company_required)):
    user_id = current_user["id"]
    is_admin = current_user.get("is_admin", False)

    exp_ids = _user_experiment_ids(user_id, is_admin)
    if not exp_ids:
        return {
            "total_participants": 0,
            "completion_rate": 0,
            "active_experiments": 0,
            "avg_sus_score": 0,
            "participants_over_time": [],
            "survey_results": {},
            "experiments": [],
        }

    placeholders = ",".join(["%s"] * len(exp_ids))

    total_participants = fetch_one(
        f"SELECT COUNT(*) AS cnt FROM participants WHERE experiment_id IN ({placeholders})",
        tuple(exp_ids),
    )["cnt"]

    completed = fetch_one(
        f"SELECT COUNT(*) AS cnt FROM participants WHERE experiment_id IN ({placeholders}) AND status = 'complete'",
        tuple(exp_ids),
    )["cnt"]
    completion_rate = round((completed / total_participants * 100), 1) if total_participants else 0

    active_experiments = fetch_one(
        f"SELECT COUNT(*) AS cnt FROM experiments WHERE id IN ({placeholders}) AND status = 'active'",
        tuple(exp_ids),
    )["cnt"]

    # SUS average
    sus_rows = fetch_all(
        f"SELECT answers FROM survey_results WHERE experiment_id IN ({placeholders}) AND survey_type = 'sus'",
        tuple(exp_ids),
    )
    sus_scores = []
    for row in sus_rows:
        ans = json.loads(row["answers"]) if row.get("answers") else {}
        score = _calc_sus_score_from_answers(ans)
        if score is not None:
            sus_scores.append(score)
    avg_sus = round(sum(sus_scores) / len(sus_scores), 1) if sus_scores else 0

    # Participants over time (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    pot_raw = fetch_all(
        f"""
        SELECT DATE(created_at) AS day, COUNT(*) AS cnt
        FROM participants
        WHERE experiment_id IN ({placeholders}) AND created_at >= %s
        GROUP BY DATE(created_at)
        ORDER BY day
        """,
        tuple(exp_ids) + (thirty_days_ago,),
    )
    participants_over_time = [{"date": r["day"].strftime("%Y-%m-%d"), "count": r["cnt"]} for r in pot_raw]

    # Survey averages (generic)
    types_to_report = sorted(list(VALID_SURVEY_TYPES - {"demographics"}))
    survey_results = {}
    for st in types_to_report:
        rows = fetch_all(
            f"SELECT answers FROM survey_results WHERE experiment_id IN ({placeholders}) AND survey_type = %s",
            tuple(exp_ids) + (st,),
        )
        values = []
        for r in rows:
            ans = json.loads(r["answers"]) if r.get("answers") else {}
            nums = []
            for v in ans.values():
                vi = _to_int(v)
                if vi is not None:
                    nums.append(vi)
            if not nums:
                continue
            values.append(sum(nums) / len(nums))
        survey_results[st] = round(sum(values) / len(values), 2) if values else 0

    # Experiments table + sample anon id
    exp_rows = fetch_all(
        f"""
        SELECT
            e.id,
            e.title,
            e.status,
            e.budget,
            COALESCE(e.spent_budget, 0) AS spent_budget,
            COUNT(p.id) AS participant_count,
            (SELECT anon_id
             FROM participants
             WHERE experiment_id = e.id
             AND status = 'invited'
             ORDER BY id ASC
             LIMIT 1) AS sample_anon_id
        FROM experiments e
        LEFT JOIN participants p ON e.id = p.experiment_id
        WHERE e.id IN ({placeholders})
        GROUP BY e.id
        """,
        tuple(exp_ids),
    )
    experiments = [
        {
            "id": e["id"],
            "title": e["title"],
            "status": e["status"],
            "participant_count": e["participant_count"] or 0,
            "budget": float(e["budget"] or 0),
            "spent": float(e["spent_budget"] or 0),
            "sample_anon_id": e["sample_anon_id"] or None,
        }
        for e in exp_rows
    ]

    return {
        "total_participants": total_participants,
        "completion_rate": completion_rate,
        "active_experiments": active_experiments,
        "avg_sus_score": avg_sus,
        "participants_over_time": participants_over_time,
        "survey_results": survey_results,
        "experiments": experiments,
    }


@app.get("/dashboard/export")
def export_dashboard(current_user: dict = Depends(company_required)):
    user_id = current_user["id"]
    is_admin = current_user.get("is_admin", False)

    exp_ids = _user_experiment_ids(user_id, is_admin)
    if not exp_ids:
        raise HTTPException(status_code=404, detail="No experiments to export")

    placeholders = ",".join(["%s"] * len(exp_ids))

    participants = fetch_all(
        f"""
        SELECT p.*, e.title AS exp_title
        FROM participants p
        JOIN experiments e ON p.experiment_id = e.id
        WHERE p.experiment_id IN ({placeholders})
        """,
        tuple(exp_ids),
    )

    results = fetch_all(
        f"""
        SELECT sr.*, e.title AS exp_title
        FROM survey_results sr
        JOIN experiments e ON sr.experiment_id = e.id
        WHERE sr.experiment_id IN ({placeholders})
        """,
        tuple(exp_ids),
    )

    out = StringIO()
    writer = csv.writer(out)
    writer.writerow(["Experiment", "Participant ID", "Anon ID", "Email", "Status", "Created At", "Survey Type", "Answers (JSON)"])

    result_map: Dict[int, List[dict]] = {}
    for r in results:
        result_map.setdefault(r["participant_id"], []).append(r)

    for p in participants:
        for sr in result_map.get(p["id"], []):
            writer.writerow(
                [
                    p["exp_title"],
                    p["id"],
                    p["anon_id"],
                    p.get("email") or "",
                    p["status"],
                    p["created_at"].isoformat() if p.get("created_at") else "",
                    sr["survey_type"],
                    sr["answers"],
                ]
            )

    out.seek(0)
    return StreamingResponse(out, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=dashboard_export.csv"})
@app.get("/dashboard/participant-demographics")
def get_participant_demographics(current_user: dict = Depends(company_required)):
    """
    Counts ALL users with role='participant' (no experiment ownership filter).
    Useful for development/demo when participants are not yet linked.
    """
    stats = fetch_one("""
        SELECT
            COUNT(*) AS total_participants,
            
            -- Age buckets
            SUM(CASE WHEN age IS NULL OR age < 18 THEN 1 ELSE 0 END) AS age_under_18_or_unknown,
            SUM(CASE WHEN age BETWEEN 18 AND 24 THEN 1 ELSE 0 END) AS age_18_24,
            SUM(CASE WHEN age BETWEEN 25 AND 34 THEN 1 ELSE 0 END) AS age_25_34,
            SUM(CASE WHEN age BETWEEN 35 AND 44 THEN 1 ELSE 0 END) AS age_35_44,
            SUM(CASE WHEN age >= 45 THEN 1 ELSE 0 END) AS age_45_plus,
            
            -- Profession
            COUNT(CASE WHEN profession = 'Student' THEN 1 END) AS prof_student,
            COUNT(CASE WHEN profession = 'Engineer' THEN 1 END) AS prof_engineer,
            COUNT(CASE WHEN profession = 'Designer' THEN 1 END) AS prof_designer,
            COUNT(CASE WHEN profession = 'Researcher' THEN 1 END) AS prof_researcher,
            COUNT(CASE WHEN profession NOT IN ('Student','Engineer','Designer','Researcher') 
                      AND profession IS NOT NULL THEN 1 END) AS prof_other,
            
            -- Chatbot Usage
            COUNT(CASE WHEN chatbot_usage = 'Never' THEN 1 END) AS usage_never,
            COUNT(CASE WHEN chatbot_usage = 'Rarely' THEN 1 END) AS usage_rarely,
            COUNT(CASE WHEN chatbot_usage = 'Sometimes' THEN 1 END) AS usage_sometimes,
            COUNT(CASE WHEN chatbot_usage = 'Often' THEN 1 END) AS usage_often,
            COUNT(CASE WHEN chatbot_usage = 'Daily' THEN 1 END) AS usage_daily
        FROM users
        WHERE role = 'participant'
    """)

    if not stats or stats["total_participants"] == 0:
        return {
            "total_participants": 0,
            "age": {},
            "profession": {},
            "chatbot_usage": {},
            "country": {}
        }

    total = stats["total_participants"]

    response = {
        "total_participants": total,
        "age": {
            "Under 18 / Unknown": round((stats["age_under_18_or_unknown"] or 0) / total * 100, 1),
            "18-24": round((stats["age_18_24"] or 0) / total * 100, 1),
            "25-34": round((stats["age_25_34"] or 0) / total * 100, 1),
            "35-44": round((stats["age_35_44"] or 0) / total * 100, 1),
            "45+": round((stats["age_45_plus"] or 0) / total * 100, 1),
        },
        "profession": {
            "Student": round((stats["prof_student"] or 0) / total * 100, 1),
            "Engineer": round((stats["prof_engineer"] or 0) / total * 100, 1),
            "Designer": round((stats["prof_designer"] or 0) / total * 100, 1),
            "Researcher": round((stats["prof_researcher"] or 0) / total * 100, 1),
            "Other": round((stats["prof_other"] or 0) / total * 100, 1),
        },
        "chatbot_usage": {
            "Never": round((stats["usage_never"] or 0) / total * 100, 1),
            "Rarely": round((stats["usage_rarely"] or 0) / total * 100, 1),
            "Sometimes": round((stats["usage_sometimes"] or 0) / total * 100, 1),
            "Often": round((stats["usage_often"] or 0) / total * 100, 1),
            "Daily": round((stats["usage_daily"] or 0) / total * 100, 1),
        },
        "country": {}
    }

    # Optional: top countries
    country_rows = fetch_all("""
        SELECT country, COUNT(*) AS cnt
        FROM users
        WHERE role = 'participant' AND country IS NOT NULL
        GROUP BY country
        ORDER BY cnt DESC
        LIMIT 6
    """)

    country_dist = {}
    for row in country_rows:
        if row["country"]:
            country_dist[row["country"]] = round(row["cnt"] / total * 100, 1)

    response["country"] = country_dist
    return response
# ────────────────────────────────────────────────
# PARTICIPANT REWARDS DASHBOARD
# ────────────────────────────────────────────────

@app.get("/rewards")
async def get_my_rewards(user: dict = Depends(participant_required)):
    rewards = fetch_all("""
        SELECT 
            pr.id, pr.experiment_id, pr.stars_earned, pr.badges, 
            pr.awarded_at, pr.redeemed, pr.redeemed_at,
            e.title AS experiment_title
        FROM participant_rewards pr
        JOIN experiments e ON pr.experiment_id = e.id
        WHERE pr.participant_id IN (
            SELECT id FROM participants WHERE user_id = %s
        )
        ORDER BY pr.awarded_at DESC
    """, (user['id'],))
    return {"rewards": rewards}
# -------------------------------
# RANDOMIZATION & ANONYMIZATION
# -------------------------------
@app.post("/experiments/{experiment_id}/randomize_participants")
def randomize_participants(experiment_id: int, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    participants = fetch_all("SELECT * FROM participants WHERE experiment_id=%s", (experiment_id,))
    if not participants:
        raise HTTPException(status_code=400, detail="No participants to randomize")

    shuffled = participants.copy()
    random.shuffle(shuffled)

    for idx, participant in enumerate(shuffled):
        execute("UPDATE participants SET random_order=%s WHERE id=%s", (idx + 1, participant["id"]))

    return {"message": "Participants randomized successfully", "total": len(shuffled)}


@app.post("/experiments/{experiment_id}/anonymize_participants")
def anonymize_participants(experiment_id: int, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT * FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    participants = fetch_all("SELECT * FROM participants WHERE experiment_id=%s", (experiment_id,))
    if not participants:
        raise HTTPException(status_code=400, detail="No participants to anonymize")

    for participant in participants:
        anon_id = str(uuid.uuid4())
        execute("UPDATE participants SET anon_id=%s, email=NULL WHERE id=%s", (anon_id, participant["id"]))

    return {"message": f"{len(participants)} participants anonymized successfully"}


# -------------------------------
# PARTICIPANT SETTINGS + ATTACHED SURVEYS
# -------------------------------
@app.get("/experiments/{experiment_id}/participant-settings")
def get_participant_settings(experiment_id: int, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT user_id, participant_limit, anonymization, randomization FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    current_count = fetch_one("SELECT COUNT(*) as cnt FROM participants WHERE experiment_id=%s", (experiment_id,))["cnt"]

    return {
        "max_participants": exp["participant_limit"] or 100,
        "anonymization": bool(exp["anonymization"]),
        "randomization": bool(exp["randomization"]),
        "current_count": current_count,
    }


@app.put("/experiments/{experiment_id}/participant-settings")
def update_participant_settings(experiment_id: int, data: dict, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT user_id FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    execute(
        "UPDATE experiments SET participant_limit=%s, anonymization=%s, randomization=%s WHERE id=%s",
        (data.get("max_participants"), data.get("anonymization"), data.get("randomization"), experiment_id),
    )
    return {"message": "Participant settings updated"}


@app.get("/experiments/{experiment_id}/surveys")
def get_attached_surveys(experiment_id: int, current_user: dict = Depends(company_required)):
    exp = fetch_one("SELECT user_id, steps FROM experiments WHERE id=%s", (experiment_id,))
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if exp["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    steps = json.loads(exp["steps"]) if exp["steps"] else []
    survey_steps = [s for s in steps if s.get("type") == "survey"]

    attached = []
    for s in survey_steps:
        attached.append(
            {
                "type": s.get("survey_type") or "custom",
                "title": s.get("title") or "Untitled Survey",
                "questions": len(s.get("questions") or []),
            }
        )

    return {"attached_surveys": attached}


# -------------------------------
# LLM ENDPOINT
# -------------------------------
@app.post("/llm/chat")
async def llm_chat(request: LLMChatRequest):
    messages = [m.model_dump() for m in request.messages]

    try:
        if request.provider == "openai":
            if not OPENAI_API_KEY:
                raise HTTPException(500, "OpenAI API key not configured")
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",  # ✅ fixed
                    headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                    json={
                        "model": request.model,
                        "messages": messages,
                        "temperature": request.temperature,
                        "max_tokens": request.max_tokens,
                    },
                    timeout=30.0,
                )

        elif request.provider == "anthropic":
            if not ANTHROPIC_API_KEY:
                raise HTTPException(500, "Anthropic API key not configured")
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": ANTHROPIC_API_KEY,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": request.model,
                        "messages": [{"role": m["role"], "content": m["content"]} for m in messages if m["role"] != "system"],
                        "system": next((m["content"] for m in messages if m["role"] == "system"), ""),
                        "max_tokens": request.max_tokens,
                        "temperature": request.temperature,
                    },
                    timeout=30.0,
                )

        elif request.provider == "groq":
            if not GROQ_API_KEY:
                raise HTTPException(500, "Groq API key not configured")
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                    json={
                        "model": request.model,
                        "messages": messages,
                        "temperature": request.temperature,
                        "max_tokens": request.max_tokens,
                    },
                    timeout=15.0,
                )

        elif request.provider == "gemini":
            if not GEMINI_API_KEY:
                raise HTTPException(500, "Gemini API key not configured")
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{request.model}:generateContent?key={GEMINI_API_KEY}",
                    json={
                        "contents": [
                            {"role": "user" if m["role"] == "user" else "model", "parts": [{"text": m["content"]}]}
                            for m in messages
                            if m["role"] != "system"
                        ],
                        "generationConfig": {"temperature": request.temperature, "maxOutputTokens": request.max_tokens},
                    },
                    timeout=30.0,
                )
            resp_json = resp.json()
            text = resp_json["candidates"][0]["content"]["parts"][0]["text"]
            return {"response": text.strip()}

        else:
            raise HTTPException(400, "Invalid provider")

        resp.raise_for_status()
        data = resp.json()

        if request.provider == "anthropic":
            text = data["content"][0]["text"]
        else:
            text = data["choices"][0]["message"]["content"]

        return {"response": text.strip()}

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"LLM provider error: {e.response.text[:200]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM chat failed: {str(e)}")

@app.get("/participants/me/dashboard")
def get_participant_dashboard(current_user: dict = Depends(participant_required)):
    award_badges_for_participant(user_id=current_user["id"])
    
    print(f"[{datetime.now()}] Dashboard called for user {current_user.get('id')} ({current_user.get('email')})")
    uid = current_user["id"]

    # ─── Stats (unchanged) ────────────────────────────────────────────────
    stats_row = fetch_one("""
        SELECT
            COALESCE(SUM(pr.stars_earned), 0) AS total_stars,
            COUNT(DISTINCT CASE WHEN p.status = 'complete' AND p.completed_at IS NOT NULL
                                THEN p.experiment_id END) AS completed_count,
            COUNT(DISTINCT p.experiment_id) AS total_joined
        FROM participants p
        LEFT JOIN participant_rewards pr
          ON pr.participant_id = p.id AND pr.experiment_id = p.experiment_id
        WHERE p.user_id = %s
    """, (uid,)) or {}
    
    total_stars = int(stats_row.get("total_stars") or 0)
    completed_count = int(stats_row.get("completed_count") or 0)
    total_joined = int(stats_row.get("total_joined") or 0)

    earned_badges = fetch_one("""
        SELECT COUNT(DISTINCT badge_key) AS cnt
        FROM participant_badges
        WHERE user_id = %s
    """, (uid,))["cnt"] or 0

    total_badges = fetch_one("SELECT COUNT(*) AS cnt FROM badges")["cnt"] or 0

    # ─── Leaderboard rank (unchanged) ─────────────────────────────────────
    rank_row = fetch_one("""
        SELECT FIND_IN_SET(
            my_total,
            (
                SELECT GROUP_CONCAT(DISTINCT total ORDER BY total DESC)
                FROM (
                    SELECT COALESCE(SUM(pr2.stars_earned), 0) AS total
                    FROM participant_rewards pr2
                    JOIN participants p2 ON pr2.participant_id = p2.id
                    GROUP BY p2.user_id
                ) ranks
            )
        ) AS rank_pos
        FROM (
            SELECT COALESCE(SUM(pr.stars_earned), 0) AS my_total
            FROM participant_rewards pr
            JOIN participants p ON pr.participant_id = p.id
            WHERE p.user_id = %s
        ) me
    """, (uid,))
    leaderboard_rank = f"{rank_row['rank_pos']}" if rank_row and rank_row.get("rank_pos") else "#-"

    # ─── FIXED: Experiments – one row per experiment (no duplicates) ───────
    exp_rows = fetch_all("""
        SELECT
            e.id,
            e.title,
            COALESCE(e.company_name, u.company_name, 'Unknown Organization') AS org,
            MAX(p.status) AS status,
            SUM(TIMESTAMPDIFF(MINUTE, p.created_at, COALESCE(p.completed_at, NOW()))) AS minutes_spent,
            MAX(p.completed_at) AS completed_at,
            COALESCE(SUM(r.stars_earned), 0) AS points
        FROM experiments e
        JOIN users u ON e.user_id = u.id
        LEFT JOIN participants p
            ON e.id = p.experiment_id
           AND p.user_id = %s
        LEFT JOIN participant_rewards r
            ON r.participant_id = p.id
           AND r.experiment_id = e.id
        WHERE p.id IS NOT NULL
        GROUP BY e.id
        ORDER BY MAX(COALESCE(p.completed_at, p.created_at)) DESC
    """, (uid,))

    experiments = []
    for row in exp_rows:
        is_completed = (row["status"] == "complete")
        experiments.append({
            "id": row["id"],
            "title": row["title"],
            "org": row["org"],
            "status": "Completed" if is_completed else "In Progress",
            "minutes": int(row["minutes_spent"] or 0),
            "completedOn": row["completed_at"].strftime("%Y-%m-%d") if row.get("completed_at") else None,
            "points": int(row["points"] or 0),
            "action": "Continue" if not is_completed else "View",
        })

    # ─── BADGES – FIXED: include icon_name ────────────────────────────────
    all_badges = fetch_all("""
        SELECT badge_key, title, description, icon_name
        FROM badges
        ORDER BY id
    """)

    earned_rows = fetch_all("""
        SELECT badge_key 
        FROM participant_badges 
        WHERE user_id = %s
    """, (uid,))
    earned_keys = {row["badge_key"] for row in earned_rows}

    badges = []
    for b in all_badges:
        badges.append({
            "title": b.get("title") or b["badge_key"],
            "desc": b.get("description") or "",
            "icon_name": b.get("icon_name") or "trophy",  # ← this is what frontend expects!
            "earned": b["badge_key"] in earned_keys
        })

    # ─── Final return ─────────────────────────────────────────────────────
    return {
        "stats": {
            "totalStars": total_stars,
            "completedExperiments": completed_count,
            "earnedBadges": int(earned_badges),
            "totalBadges": int(total_badges),
            "leaderboardRank": leaderboard_rank
        },
        "experiments": experiments,
        "badges": badges
    }

# @app.get("/participants/me/dashboard")
# def get_participant_dashboard(current_user: dict = Depends(participant_required)):
#     award_badges_for_participant(user_id=current_user["id"])
    
#     print(f"[{datetime.now()}] Dashboard called for user {current_user.get('id')} ({current_user.get('email')})")
#     uid = current_user["id"]

#     # ─── Stats (unchanged) ────────────────────────────────────────────────
#     stats_row = fetch_one("""
#         SELECT
#             COALESCE(SUM(pr.stars_earned), 0) AS total_stars,
#             COUNT(DISTINCT CASE WHEN p.status = 'complete' AND p.completed_at IS NOT NULL 
#                                 THEN p.experiment_id END) AS completed_count,
#             COUNT(DISTINCT p.experiment_id) AS total_joined
#         FROM participants p
#         LEFT JOIN participant_rewards pr
#           ON pr.participant_id = p.id AND pr.experiment_id = p.experiment_id
#         WHERE p.user_id = %s
#     """, (uid,)) or {}

#     total_stars = int(stats_row.get("total_stars") or 0)
#     completed_count = int(stats_row.get("completed_count") or 0)
#     total_joined = int(stats_row.get("total_joined") or 0)

#     earned_badges = fetch_one("""
#         SELECT COUNT(DISTINCT badge_key) AS cnt 
#         FROM participant_badges 
#         WHERE user_id = %s
#     """, (uid,))["cnt"] or 0

#     total_badges = fetch_one("SELECT COUNT(*) AS cnt FROM badges")["cnt"] or 0

#     # ─── Leaderboard rank (unchanged) ─────────────────────────────────────
#     rank_row = fetch_one("""
#         SELECT FIND_IN_SET(
#             my_total,
#             (
#                 SELECT GROUP_CONCAT(DISTINCT total ORDER BY total DESC)
#                 FROM (
#                     SELECT COALESCE(SUM(pr2.stars_earned), 0) AS total
#                     FROM participant_rewards pr2
#                     JOIN participants p2 ON pr2.participant_id = p2.id
#                     GROUP BY p2.user_id
#                 ) ranks
#             )
#         ) AS rank_pos
#         FROM (
#             SELECT COALESCE(SUM(pr.stars_earned), 0) AS my_total
#             FROM participant_rewards pr
#             JOIN participants p ON pr.participant_id = p.id
#             WHERE p.user_id = %s
#         ) me
#     """, (uid,))

#     leaderboard_rank = f"#{rank_row['rank_pos']}" if rank_row and rank_row.get("rank_pos") else "#-"

#     # ─── FIXED: Experiments – one row per experiment (no duplicates) ───────
#     exp_rows = fetch_all("""
#         SELECT
#             e.id,
#             e.title,
#             COALESCE(e.company_name, u.company_name, 'Unknown Organization') AS org,
#             MAX(p.status) AS status,                            -- take the "best" status
#             SUM(TIMESTAMPDIFF(MINUTE, p.created_at, COALESCE(p.completed_at, NOW()))) AS minutes_spent,
#             MAX(p.completed_at) AS completed_at,                -- latest completion
#             COALESCE(SUM(r.stars_earned), 0) AS points
#         FROM experiments e
#         JOIN users u ON e.user_id = u.id
#         LEFT JOIN participants p 
#             ON e.id = p.experiment_id 
#            AND p.user_id = %s
#         LEFT JOIN participant_rewards r 
#             ON r.participant_id = p.id 
#            AND r.experiment_id = e.id
#         WHERE p.id IS NOT NULL   -- only experiments the user actually joined
#         GROUP BY e.id
#         ORDER BY MAX(COALESCE(p.completed_at, p.created_at)) DESC
#     """, (uid,))

#     print(f"Experiments found for user {uid}: {len(exp_rows)} rows")
#     if exp_rows:
#         print("First experiment:", exp_rows[0])

#     experiments = []
#     for row in exp_rows:
#         is_completed = (row["status"] == "complete")
#         progress = 100 if is_completed else 50
#         experiments.append({
#             "id": row["id"],
#             "title": row["title"],
#             "org": row["org"],
#             "status": "Completed" if is_completed else "In Progress",
#             "minutes": int(row["minutes_spent"] or 0),
#             "completedOn": row["completed_at"].strftime("%Y-%m-%d") if row.get("completed_at") else None,
#             "progress": int(progress),
#             "points": int(row["points"] or 0),
#             "badgeLabel": "First Study" if is_completed else None,
#             "action": "Continue" if not is_completed else "View",
#         })

#     # ─── Badges (unchanged) ────────────────────────────────────────────────
#     all_badges = fetch_all("""
#         SELECT badge_key, title, description, icon_name
#         FROM badges 
#         ORDER BY id
#     """)

#     earned_keys = set()
#     earned_rows = fetch_all(
#         "SELECT badge_key FROM participant_badges WHERE user_id = %s",
#         (uid,)
#     )
#     earned_keys = {row["badge_key"] for row in earned_rows}

#     badges = []
#     for b in all_badges:
#         badges.append({
#             "title": b.get("title") or b["badge_key"],
#             "desc": b.get("description") or "",
#             "iconKey": (b.get("icon_name") or "target").strip().lower(),
#             "earned": b["badge_key"] in earned_keys
#         })

#     # ─── Final return (unchanged structure) ────────────────────────────────
#     return {
#         "stats": {
#             "totalStars": total_stars,
#             "completedExperiments": completed_count,
#             "totalExperiments": total_joined,
#             "earnedBadges": int(earned_badges),
#             "totalBadges": int(total_badges),
#             "leaderboardRank": leaderboard_rank
#         },
#         "experiments": experiments,
#         "badges": badges
#     }
@app.get("/participants/me/experiment/{experiment_id}")
def get_participant_experiment(
    experiment_id: int,
    current_user: dict = Depends(participant_required)
):
    """
    Returns flattened experiment + participant progress for the logged-in user.
    Frontend can directly use: experiment.steps, experiment.title, experiment.chatbot.url, etc.
    """
    # Verify the user is actually participating
    participant = fetch_one("""
        SELECT 
            id AS participant_id,
            status,
            last_step_index,
            completed_at,
            consent_given,
            variant
        FROM participants
        WHERE user_id = %s AND experiment_id = %s
        LIMIT 1
    """, (current_user["id"], experiment_id))

    if not participant:
        raise HTTPException(403, "You are not participating in this experiment")

    # Fetch experiment data
    exp = fetch_one("""
        SELECT 
            id, title, description, steps, anonymization, randomization,
            chatbot_id_a, chatbot_id_b, external_chatbot_url
        FROM experiments 
        WHERE id = %s
    """, (experiment_id,))

    if not exp:
        raise HTTPException(404, "Experiment not found")

    # Safely parse steps
    steps = []
    if exp.get("steps"):
        try:
            steps = json.loads(exp["steps"])
        except json.JSONDecodeError as e:
            print(f"Warning: Invalid steps JSON in experiment {experiment_id}: {e}")
            steps = []

    # Determine active variant & chatbot URL
    variant = participant.get("variant", "A")  # fallback to A if missing

    active_chatbot = {"id": None, "url": None, "variant": variant}

    chatbot_id = exp["chatbot_id_a"] if variant == "A" else exp["chatbot_id_b"]
    if chatbot_id:
        bot_row = fetch_one(
            "SELECT public_url FROM chatbots WHERE id = %s",
            (chatbot_id,)
        )
        if bot_row and bot_row.get("public_url"):
            active_chatbot["id"] = chatbot_id
            active_chatbot["url"] = bot_row["public_url"]

    # Return FLATTENED structure (no nested "experiment" object)
    return {
        # Participant progress
        "participant_id": participant["participant_id"],
        "status": participant["status"],
        "last_step_index": participant.get("last_step_index") or 0,
        "completed_at": participant["completed_at"],
        "consent_given": bool(participant["consent_given"]),
        "variant": variant,

        # Experiment fields — directly at root level
        "id": exp["id"],
        "title": exp["title"],
        "description": exp["description"] or "",
        "steps": steps,
        "anonymization": bool(exp["anonymization"]),
        "randomization": bool(exp["randomization"]),
        "external_chatbot_url": exp.get("external_chatbot_url"),

        # Active chatbot for this participant (used in task/chatbot steps)
        "chatbot": active_chatbot
    }  
@app.get("/participants/me/stats")
def get_participant_stats(current_user: dict = Depends(participant_required)):
    uid = current_user["id"]

    stats = fetch_one("""
        SELECT
            COALESCE(SUM(pr.stars_earned), 0) AS total_stars,
            COUNT(DISTINCT CASE WHEN p.status = 'complete' THEN p.experiment_id END) AS completed_count,
            COUNT(DISTINCT p.experiment_id) AS total_joined
        FROM participants p
        LEFT JOIN participant_rewards pr
          ON pr.participant_id = p.id AND pr.experiment_id = p.experiment_id
        WHERE p.user_id = %s
    """, (uid,)) or {}

    badges_count = fetch_one("""
        SELECT COUNT(DISTINCT badge_key) AS cnt 
        FROM participant_badges 
        WHERE user_id = %s
    """, (uid,))["cnt"] or 0

    total_badges = fetch_one("SELECT COUNT(*) AS cnt FROM badges")["cnt"] or 0

    # FIXED rank: per user_id
    rank_row = fetch_one("""
        SELECT FIND_IN_SET(my_stars, (
            SELECT GROUP_CONCAT(DISTINCT total_stars ORDER BY total_stars DESC)
            FROM (
                SELECT COALESCE(SUM(pr2.stars_earned), 0) AS total_stars
                FROM participant_rewards pr2
                JOIN participants p2 ON pr2.participant_id = p2.id
                GROUP BY p2.user_id
            ) t
        )) AS rank_pos
        FROM (
            SELECT COALESCE(SUM(pr.stars_earned), 0) AS my_stars
            FROM participant_rewards pr
            JOIN participants p ON pr.participant_id = p.id
            WHERE p.user_id = %s
        ) me
    """, (uid,))

    return {
        "stars": int(stats.get("total_stars") or 0),
        "completed": f"{int(stats.get('completed_count') or 0)}/{int(stats.get('total_joined') or 0)}",
        "badges": f"{badges_count}/{total_badges}",
        "rank": f"#{rank_row['rank_pos']}" if rank_row and rank_row.get("rank_pos") else "#-"
    }

@app.get("/participants/me/experiments")
def get_my_experiments(current_user: dict = Depends(participant_required)):
    exps = fetch_all("""
        SELECT
            e.id,
            e.title,
            COALESCE(e.company_name, u.company_name, 'Unknown Organization') AS org,
            p.status,
            TIMESTAMPDIFF(MINUTE, p.created_at, COALESCE(p.completed_at, NOW())) AS minutes_spent,
            p.completed_at,
            COALESCE(r.stars_earned, 0) AS points
        FROM participants p
        JOIN experiments e ON p.experiment_id = e.id
        JOIN users u ON e.user_id = u.id
        LEFT JOIN participant_rewards r 
            ON r.participant_id = p.id AND r.experiment_id = e.id
        WHERE p.user_id = %s
        ORDER BY COALESCE(p.completed_at, p.created_at) DESC
    """, (current_user["id"],))

    return exps
@app.get("/participants/me/profile")
def get_participant_profile(current_user: dict = Depends(participant_required)):
    profile = fetch_one("""
        SELECT 
            u.first_name,
            u.last_name,
            u.email,
            u.created_at AS joined_at,
            COALESCE(
                p.avatar_url,
                CONCAT('https://ui-avatars.com/api/?name=', u.first_name, '+', u.last_name)
            ) AS avatar_url,
            (SELECT COUNT(*) FROM participants WHERE user_id = %s) AS total_experiments,
            (SELECT COUNT(*) FROM participants WHERE user_id = %s AND status = 'complete') AS completed_experiments
        FROM users u
        LEFT JOIN participants p ON p.user_id = u.id
        WHERE u.id = %s
        LIMIT 1
    """, (current_user["id"], current_user["id"], current_user["id"]))

    if not profile:
        raise HTTPException(404, "Participant profile not found")

    return {
        "full_name": f"{profile['first_name'] or ''} {profile['last_name'] or ''}".strip() or "Participant",
        "email": profile["email"],
        "joined_at": profile["joined_at"].isoformat() if profile["joined_at"] else None,
        "avatar_url": profile["avatar_url"],
        "total_experiments": profile["total_experiments"],
        "completed_experiments": profile["completed_experiments"]
    }

# In /badges
@app.get("/badges")
def list_all_badges():
    badges = fetch_all("SELECT * FROM badges ORDER BY id")
    return {"badges": badges}

@app.get("/participants/me/badges")
def get_my_badges(current_user: dict = Depends(participant_required)):
    uid = current_user["id"]

    all_badges = fetch_all("SELECT * FROM badges ORDER BY id")

    earned = fetch_all("""
        SELECT b.*, pb.earned_at, pb.experiment_id, e.title AS experiment_title
        FROM participant_badges pb
        JOIN badges b ON pb.badge_key = b.badge_key
        LEFT JOIN experiments e ON pb.experiment_id = e.id
        WHERE pb.user_id = %s
        ORDER BY pb.earned_at DESC
    """, (uid,))

    return {
        "earned": earned,
        "all": all_badges,
        "earned_count": len(earned),
        "total_badges": len(all_badges)
    }
    
@app.get("/leaderboard")
def get_leaderboard(limit: int = 10):
    leaderboard = fetch_all("""
        SELECT
            u.id,
            COALESCE(NULLIF(TRIM(CONCAT(IFNULL(u.first_name,''),' ',IFNULL(u.last_name,''))), ''), 'Anonymous') AS name,
            COALESCE(SUM(pr.stars_earned),0) AS total_stars,
            COUNT(DISTINCT pr.experiment_id) AS completed_experiments
        FROM participant_rewards pr
        JOIN participants p ON pr.participant_id = p.id
        JOIN users u ON p.user_id = u.id
        GROUP BY u.id
        ORDER BY total_stars DESC
        LIMIT %s
    """, (limit,))
    return {"leaderboard": leaderboard}
