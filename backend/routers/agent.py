from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import schemas
from agent_orchestrator import AgentOrchestrator
from rag_engine import OfflineRAGEngine
import os

router = APIRouter(prefix="/api/agent", tags=["agent"])

KNOWLEDGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "knowledge", "curated_handbook")
rag_engine = OfflineRAGEngine(KNOWLEDGE_DIR)
orchestrator = AgentOrchestrator(rag_engine)

@router.post("/query", response_model=schemas.StructuredAgentResponse)
def query_agent(req: schemas.AgentQueryRequest, db: Session = Depends(get_db)):
    return orchestrator.process_query(req.prompt, req.scenario or "power_outage", db)
