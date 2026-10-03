import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from app.db.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_ref = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    pan_number = Column(String(20), index=True, nullable=True)
    phone = Column(String(20), index=True, nullable=True)
    email = Column(String(100), nullable=True)
    residential_city = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    applications = relationship("LoanApplication", back_populates="customer")

class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(Integer, primary_key=True, index=True)
    application_ref = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    
    # Loan parameters
    loan_type = Column(String(50), nullable=False)
    loan_amount_requested = Column(Float, nullable=False)
    loan_tenure_months = Column(Integer, nullable=False)
    interest_rate_offered = Column(Float, nullable=False)
    purpose_of_loan = Column(String(100), nullable=False)
    
    # Financial profile
    monthly_income = Column(Float, nullable=False)
    cibil_score = Column(Integer, nullable=False)
    existing_emis_monthly = Column(Float, default=0.0)
    debt_to_income_ratio = Column(Float, nullable=False)  # Standardized 0.0 to 1.0
    applicant_age = Column(Integer, nullable=False)
    number_of_dependents = Column(Integer, default=0)
    employment_status = Column(String(50), nullable=False)
    property_ownership_status = Column(String(50), nullable=False)
    gender = Column(String(20), nullable=False)
    residential_address = Column(String(255), nullable=True)
    
    # Workflow & Risk Status
    status = Column(String(30), default="NEW", index=True)  # NEW, UNDER_REVIEW, DOCUMENT_REQUESTED, ESCALATED, CONFIRMED_FRAUD, FALSE_POSITIVE, CLEARED
    priority = Column(String(20), default="NORMAL", index=True)  # CRITICAL, HIGH, MEDIUM, LOW
    assigned_to = Column(String(100), default="Unassigned")
    
    # Risk Engine Outcomes
    risk_score = Column(Float, default=0.0)
    risk_tier = Column(String(20), default="LOW", index=True)  # CRITICAL, HIGH, MODERATE, LOW
    fraud_probability = Column(Float, default=0.0)
    dynamic_threshold = Column(Float, default=0.40)
    is_model_flagged = Column(Boolean, default=False)
    autoencoder_error = Column(Float, default=0.0)
    autoencoder_threshold = Column(Float, default=0.128788)
    is_anomaly = Column(Boolean, default=False)
    anomaly_deviation_pct = Column(Float, default=0.0)
    decision_summary = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="applications")
    device_profile = relationship("DeviceNetworkProfile", back_populates="application", uselist=False)
    evidence_items = relationship("CaseEvidence", back_populates="application", cascade="all, delete-orphan")
    notes = relationship("CaseNote", back_populates="application", cascade="all, delete-orphan")
    decisions = relationship("AnalystDecision", back_populates="application", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="application", cascade="all, delete-orphan")
    feedback = relationship("AnalystFeedback", back_populates="application", uselist=False)

class DeviceNetworkProfile(Base):
    __tablename__ = "device_network_profiles"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=False)
    device_fingerprint = Column(String(100), index=True, nullable=False)
    ip_address = Column(String(50), index=True, nullable=True)
    device_model = Column(String(100), nullable=True)
    browser_user_agent = Column(String(255), nullable=True)
    geo_city = Column(String(50), nullable=True)
    residential_address_hash = Column(String(100), index=True, nullable=True)

    application = relationship("LoanApplication", back_populates="device_profile")

class ApplicationRelationship(Base):
    __tablename__ = "application_relationships"

    id = Column(Integer, primary_key=True, index=True)
    source_application_ref = Column(String(50), index=True, nullable=False)
    target_application_ref = Column(String(50), index=True, nullable=False)
    source_customer_name = Column(String(100), nullable=True)
    target_customer_name = Column(String(100), nullable=True)
    link_type = Column(String(50), index=True, nullable=False)  # SHARED_DEVICE, SHARED_ADDRESS, SHARED_PHONE, VELOCITY_BURST, SHARED_IP
    link_value = Column(String(100), nullable=False)
    risk_contribution = Column(Float, default=10.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CaseEvidence(Base):
    __tablename__ = "case_evidence"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=False)
    signal_code = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)  # CRITICAL, HIGH, MODERATE, LOW
    category = Column(String(50), nullable=False)  # MODEL, ANOMALY, CREDIT, DEBT, RELATIONSHIP, EMPLOYMENT
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    impact_score = Column(Float, default=0.0)
    is_verified = Column(Boolean, default=False)
    verification_notes = Column(Text, nullable=True)

    application = relationship("LoanApplication", back_populates="evidence_items")

class CaseNote(Base):
    __tablename__ = "case_notes"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=False)
    author_name = Column(String(100), nullable=False)
    author_role = Column(String(50), default="FRAUD_ANALYST")
    note_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("LoanApplication", back_populates="notes")

class AnalystDecision(Base):
    __tablename__ = "analyst_decisions"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=False)
    analyst_name = Column(String(100), nullable=False)
    analyst_role = Column(String(50), nullable=False)
    decision = Column(String(50), nullable=False)  # CLEARED, REQUEST_DOCUMENTS, ESCALATE, CONFIRMED_FRAUD, FALSE_POSITIVE
    reason_code = Column(String(100), nullable=False)
    is_override = Column(Boolean, default=False)
    rationale = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("LoanApplication", back_populates="decisions")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=False)
    actor_name = Column(String(100), nullable=False)
    actor_role = Column(String(50), nullable=False)
    action_type = Column(String(50), nullable=False)  # STATUS_CHANGE, NOTE_ADDED, DECISION_RECORDED, EVIDENCE_VERIFIED
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("LoanApplication", back_populates="audit_logs")

class AnalystFeedback(Base):
    __tablename__ = "analyst_feedback"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=False)
    ai_risk_score = Column(Float, nullable=False)
    ai_risk_tier = Column(String(20), nullable=False)
    ai_fraud_probability = Column(Float, nullable=False)
    analyst_decision = Column(String(50), nullable=False)
    is_fraud_confirmed = Column(Boolean, default=False)
    is_false_positive = Column(Boolean, default=False)
    disposition_category = Column(String(100), nullable=False)
    feedback_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("LoanApplication", back_populates="feedback")
