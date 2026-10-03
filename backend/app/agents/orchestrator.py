import uuid
import datetime
from typing import Dict, Any, List, Optional
from app.agents.detection_agent import DetectionAgent
from app.agents.relationship_agent import RelationshipAgent
from app.agents.analytics_agent import AnalyticsAgent
from app.agents.advisory_agent import AdvisoryAgent

class RiskSenseOrchestrator:
    """
    Central Multi-Agent Pipeline Coordinator:
    Stage 1: Detection Agent (ML Supervised Classifier + PyTorch DL Autoencoder)
    Stage 1.5: Relationship Agent (Entity Linkage, Shared Hardware/IP, Velocity Stacking)
    Stage 2: Analytics Agent (Rules, Composite Risk Score, Calibrated Signal Breakdown)
    Stage 3: Advisory Agent (Decision, Mandated Action Checklist, Underwriting Memos)
    """
    def __init__(self):
        self.detection_agent = DetectionAgent()
        self.relationship_agent = RelationshipAgent()
        self.analytics_agent = AnalyticsAgent()
        self.advisory_agent = AdvisoryAgent()

    def process_application(self, application_data: Dict[str, Any], existing_applications: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        app_id = application_data.get("application_ref") or application_data.get("application_id") or f"APP-{str(uuid.uuid4())[:8].upper()}"
        application_data["application_ref"] = app_id
        application_data["application_id"] = app_id
        timestamp = datetime.datetime.now().isoformat()

        # Stage 1: ML & DL Detection
        detection_report = self.detection_agent.run(application_data)

        # Stage 1.5: Relationship & Network Analysis
        relationship_report = self.relationship_agent.run(application_data, existing_applications)

        # Stage 2: Analytics & Calibrated Risk Scoring
        analytics_report = self.analytics_agent.run(application_data, detection_report, relationship_report)

        # Stage 3: Advisory & Mandated SOP Actions
        advisory_report = self.advisory_agent.run(application_data, analytics_report)

        return {
            "application_id": app_id,
            "application_ref": app_id,
            "timestamp": timestamp,
            "application_data": application_data,
            "detection_report": detection_report,
            "relationship_report": relationship_report,
            "analytics_report": analytics_report,
            "advisory_report": advisory_report
        }

# Global singleton
orchestrator = RiskSenseOrchestrator()
