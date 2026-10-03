import datetime
from app.db.database import SessionLocal, init_db, engine
from app.db.models import (
    Base, Customer, LoanApplication, DeviceNetworkProfile,
    ApplicationRelationship, CaseEvidence, CaseNote,
    AnalystDecision, AuditLog, AnalystFeedback
)
from app.agents.orchestrator import orchestrator

def seed_database():
    init_db()
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(LoanApplication).count() > 0:
            print("[Seed] Database already populated. Skipping duplicate seed.")
            return

        print("[Seed] Populating RiskSense AI with realistic banking fraud scenarios & dossiers...")

        scenarios = [
            # 1. Critical Shared Device Syndicate
            {
                "customer_ref": "CUST-10293",
                "full_name": "Rohan Deshmukh",
                "pan_number": "BKUPD9021R",
                "phone": "+91 98201 44102",
                "email": "rohan.deshmukh@mailtemp.in",
                "residential_city": "Mumbai",
                "application_ref": "APP-10293",
                "loan_type": "Personal Loan",
                "loan_amount_requested": 1200000.0,
                "loan_tenure_months": 36,
                "interest_rate_offered": 15.5,
                "purpose_of_loan": "Debt Consolidation",
                "monthly_income": 32000.0,
                "cibil_score": 590,
                "existing_emis_monthly": 16000.0,
                "debt_to_income_ratio": 0.50,
                "applicant_age": 28,
                "number_of_dependents": 2,
                "employment_status": "Self-Employed",
                "property_ownership_status": "Rented",
                "gender": "Male",
                "residential_address": "Flat 402, Sai Kripa Heights, Andheri East, Mumbai",
                "device_fingerprint": "DEV-FINGERPRINT-X98",
                "ip_address": "103.21.14.89",
                "device_model": "Xiaomi Redmi Note 11",
                "status": "NEW",
                "priority": "CRITICAL",
                "assigned_to": "Fraud FCU Team",
                "simulated_scenario": "SHARED_DEVICE_RING"
            },
            # 2. Prime Genuine Borrower
            {
                "customer_ref": "CUST-10294",
                "full_name": "Dr. Aarav Sharma",
                "pan_number": "ARFPS1092K",
                "phone": "+91 99881 22334",
                "email": "dr.aarav.sharma@apollohosp.org",
                "residential_city": "Delhi NCR",
                "application_ref": "APP-10294",
                "loan_type": "Home Loan",
                "loan_amount_requested": 3500000.0,
                "loan_tenure_months": 180,
                "interest_rate_offered": 8.65,
                "purpose_of_loan": "Home Purchase",
                "monthly_income": 195000.0,
                "cibil_score": 815,
                "existing_emis_monthly": 12000.0,
                "debt_to_income_ratio": 0.062,
                "applicant_age": 38,
                "number_of_dependents": 2,
                "employment_status": "Salaried",
                "property_ownership_status": "Owned",
                "gender": "Male",
                "residential_address": "C-14, Green Park Extension, New Delhi",
                "device_fingerprint": "DEV-APPLE-IPHONE15-A1",
                "ip_address": "49.36.88.12",
                "device_model": "Apple iPhone 15 Pro",
                "status": "CLEARED",
                "priority": "LOW",
                "assigned_to": "Ananya Sen",
                "simulated_scenario": "GENUINE_PRIME"
            },
            # 3. Severe Debt Burden & Unemployed
            {
                "customer_ref": "CUST-10295",
                "full_name": "Vikram Sen",
                "pan_number": "CVKPS4481M",
                "phone": "+91 97110 55901",
                "email": "vikramsen88@fastmail.com",
                "residential_city": "Kolkata",
                "application_ref": "APP-10295",
                "loan_type": "Personal Loan",
                "loan_amount_requested": 1200000.0,
                "loan_tenure_months": 12,
                "interest_rate_offered": 16.5,
                "purpose_of_loan": "Business Expansion",
                "monthly_income": 18000.0,
                "cibil_score": 520,
                "existing_emis_monthly": 12000.0,
                "debt_to_income_ratio": 0.667,
                "applicant_age": 19,
                "number_of_dependents": 0,
                "employment_status": "Unemployed",
                "property_ownership_status": "Rented",
                "gender": "Male",
                "residential_address": "12/B, Deshapriya Park Road, Kolkata",
                "device_fingerprint": "DEV-SAMSUNG-GALAXY-M31",
                "ip_address": "115.187.45.22",
                "device_model": "Samsung Galaxy M31",
                "status": "UNDER_REVIEW",
                "priority": "CRITICAL",
                "assigned_to": "Rajesh Verma (Senior Analyst)",
                "simulated_scenario": "HIGH_DEBT_BURDEN"
            },
            # 4. Deep Autoencoder Manifold Anomaly
            {
                "customer_ref": "CUST-10296",
                "full_name": "Priya Nair",
                "pan_number": "AJSPN7721L",
                "phone": "+91 94471 88302",
                "email": "priya.nair@venturespace.co",
                "residential_city": "Bengaluru",
                "application_ref": "APP-10296",
                "loan_type": "Business Loan",
                "loan_amount_requested": 850000.0,
                "loan_tenure_months": 240,
                "interest_rate_offered": 14.0,
                "purpose_of_loan": "Medical Emergency",
                "monthly_income": 42000.0,
                "cibil_score": 690,
                "existing_emis_monthly": 18500.0,
                "debt_to_income_ratio": 0.44,
                "applicant_age": 24,
                "number_of_dependents": 4,
                "employment_status": "Self-Employed",
                "property_ownership_status": "Rented",
                "gender": "Female",
                "residential_address": "Flat 304, Palm Meadows, Indiranagar, Bengaluru",
                "device_fingerprint": "DEV-ONEPLUS-11R-K9",
                "ip_address": "106.51.90.114",
                "device_model": "OnePlus 11R",
                "status": "UNDER_REVIEW",
                "priority": "HIGH",
                "assigned_to": "Pooja Mehta",
                "simulated_scenario": "AUTOENCODER_ANOMALY"
            },
            # 5. Secondary Review / High Debt
            {
                "customer_ref": "CUST-10297",
                "full_name": "Ananya Iyer",
                "pan_number": "BNPIY5502P",
                "phone": "+91 98402 77192",
                "email": "ananya.iyer@techcorp.in",
                "residential_city": "Chennai",
                "application_ref": "APP-10297",
                "loan_type": "Personal Loan",
                "loan_amount_requested": 600000.0,
                "loan_tenure_months": 36,
                "interest_rate_offered": 12.0,
                "purpose_of_loan": "Wedding Expenses",
                "monthly_income": 54000.0,
                "cibil_score": 672,
                "existing_emis_monthly": 21000.0,
                "debt_to_income_ratio": 0.389,
                "applicant_age": 31,
                "number_of_dependents": 1,
                "employment_status": "Salaried",
                "property_ownership_status": "Owned",
                "gender": "Female",
                "residential_address": "15, 2nd Main Road, Adyar, Chennai",
                "device_fingerprint": "DEV-MACBOOK-AIR-M2",
                "ip_address": "122.178.45.19",
                "device_model": "Apple MacBook Air M2",
                "status": "DOCUMENT_REQUESTED",
                "priority": "MEDIUM",
                "assigned_to": "Ananya Sen",
                "simulated_scenario": "SECONDARY_REVIEW"
            },
            # 6. Velocity Burst Application (Credit Stacking)
            {
                "customer_ref": "CUST-10298",
                "full_name": "Rahul Kapoor",
                "pan_number": "CRPKP3319Q",
                "phone": "+91 98119 44812",
                "email": "rahul.kapoor@speedtrade.in",
                "residential_city": "Gurugram",
                "application_ref": "APP-10298",
                "loan_type": "Business Loan",
                "loan_amount_requested": 1500000.0,
                "loan_tenure_months": 24,
                "interest_rate_offered": 15.0,
                "purpose_of_loan": "Working Capital",
                "monthly_income": 45000.0,
                "cibil_score": 610,
                "existing_emis_monthly": 19000.0,
                "debt_to_income_ratio": 0.422,
                "applicant_age": 29,
                "number_of_dependents": 2,
                "employment_status": "Self-Employed",
                "property_ownership_status": "Rented",
                "gender": "Male",
                "residential_address": "Tower 4, DLF Phase 5, Gurugram",
                "device_fingerprint": "DEV-WINDOWS-SURFACE-8",
                "ip_address": "182.72.101.44",
                "device_model": "Microsoft Surface Pro 8",
                "status": "ESCALATED",
                "priority": "HIGH",
                "assigned_to": "Rajesh Verma (Senior Analyst)",
                "simulated_scenario": "VELOCITY_BURST"
            },
            # 7. Confirmed Fraud Case (Resolved Benchmark)
            {
                "customer_ref": "CUST-10299",
                "full_name": "Deepak Choudhury",
                "pan_number": "DKPCD8812J",
                "phone": "+91 93301 99201",
                "email": "deepak.c@mailtemp.cc",
                "residential_city": "Hyderabad",
                "application_ref": "APP-10299",
                "loan_type": "Personal Loan",
                "loan_amount_requested": 900000.0,
                "loan_tenure_months": 24,
                "interest_rate_offered": 16.0,
                "purpose_of_loan": "Debt Consolidation",
                "monthly_income": 22000.0,
                "cibil_score": 540,
                "existing_emis_monthly": 14000.0,
                "debt_to_income_ratio": 0.636,
                "applicant_age": 26,
                "number_of_dependents": 1,
                "employment_status": "Unemployed",
                "property_ownership_status": "Rented",
                "gender": "Male",
                "residential_address": "402, Hitech City Main Road, Hyderabad",
                "device_fingerprint": "DEV-FINGERPRINT-X98",
                "ip_address": "103.21.14.89",
                "device_model": "Xiaomi Redmi Note 11",
                "status": "CONFIRMED_FRAUD",
                "priority": "CRITICAL",
                "assigned_to": "Fraud FCU Team",
                "simulated_scenario": "SHARED_DEVICE_RING"
            },
            # 8. False Positive Case (Resolved Benchmark)
            {
                "customer_ref": "CUST-10300",
                "full_name": "Meera Nambiar",
                "pan_number": "AJMNB6619H",
                "phone": "+91 98470 33112",
                "email": "meera.nambiar@kimshealth.org",
                "residential_city": "Kochi",
                "application_ref": "APP-10300",
                "loan_type": "Professional Loan",
                "loan_amount_requested": 2500000.0,
                "loan_tenure_months": 48,
                "interest_rate_offered": 9.25,
                "purpose_of_loan": "Clinic Setup",
                "monthly_income": 180000.0,
                "cibil_score": 795,
                "existing_emis_monthly": 15000.0,
                "debt_to_income_ratio": 0.083,
                "applicant_age": 27,
                "number_of_dependents": 0,
                "employment_status": "Salaried",
                "property_ownership_status": "Owned",
                "gender": "Female",
                "residential_address": "Harbor View Apartments, Marine Drive, Kochi",
                "device_fingerprint": "DEV-IPAD-PRO-129",
                "ip_address": "117.200.55.91",
                "device_model": "Apple iPad Pro 12.9",
                "status": "FALSE_POSITIVE",
                "priority": "HIGH",
                "assigned_to": "Pooja Mehta",
                "simulated_scenario": "AUTOENCODER_ANOMALY"
            }
        ]

        # Additional queue filler applications
        names = ["Siddharth Rao", "Kavita Nair", "Arjun Singhal", "Neha Kulkarni", "Amitabh Joshi", "Pooja Hegde", "Manoj Tiwari", "Sunita Rao", "Gaurav Malhotra", "Swati Bhatt"]
        for idx, n in enumerate(names, start=10301):
            is_high = idx % 3 == 0
            scenarios.append({
                "customer_ref": f"CUST-{idx}",
                "full_name": n,
                "pan_number": f"ABCDE{idx}Z",
                "phone": f"+91 98200 {idx}",
                "email": f"{n.lower().replace(' ', '.')}@domain.in",
                "residential_city": "Pune" if idx % 2 == 0 else "Ahmedabad",
                "application_ref": f"APP-{idx}",
                "loan_type": "Personal Loan" if idx % 2 == 0 else "Auto Loan",
                "loan_amount_requested": 850000.0 if is_high else 320000.0,
                "loan_tenure_months": 36,
                "interest_rate_offered": 14.5 if is_high else 10.2,
                "purpose_of_loan": "Debt Consolidation" if is_high else "Vehicle Purchase",
                "monthly_income": 35000.0 if is_high else 65000.0,
                "cibil_score": 580 if is_high else 760,
                "existing_emis_monthly": 16000.0 if is_high else 4500.0,
                "debt_to_income_ratio": 0.457 if is_high else 0.069,
                "applicant_age": 28 + (idx % 20),
                "number_of_dependents": idx % 3,
                "employment_status": "Self-Employed" if is_high else "Salaried",
                "property_ownership_status": "Rented" if is_high else "Owned",
                "gender": "Male" if idx % 2 == 0 else "Female",
                "residential_address": f"Flat {idx % 500}, Sector {idx % 20}, Pune",
                "device_fingerprint": f"DEV-GENERIC-{idx}",
                "ip_address": f"103.44.12.{idx % 250}",
                "device_model": "Android Handset",
                "status": "NEW" if idx % 2 == 0 else "UNDER_REVIEW",
                "priority": "HIGH" if is_high else "LOW",
                "assigned_to": "Ananya Sen" if idx % 2 == 0 else "Pooja Mehta",
                "simulated_scenario": "STANDARD_QUEUE"
            })

        for s in scenarios:
            # 1. Create or fetch Customer
            cust = Customer(
                customer_ref=s["customer_ref"],
                full_name=s["full_name"],
                pan_number=s["pan_number"],
                phone=s["phone"],
                email=s["email"],
                residential_city=s["residential_city"]
            )
            db.add(cust)
            db.flush()

            # 2. Process through Multi-Agent Orchestrator for full ML scoring & signal generation
            raw_payload = {
                "application_id": s["application_ref"],
                "application_ref": s["application_ref"],
                "customer_id": s["customer_ref"],
                "applicant_name": s["full_name"],
                "loan_amount_requested": s["loan_amount_requested"],
                "loan_tenure_months": s["loan_tenure_months"],
                "interest_rate_offered": s["interest_rate_offered"],
                "monthly_income": s["monthly_income"],
                "cibil_score": s["cibil_score"],
                "existing_emis_monthly": s["existing_emis_monthly"],
                "debt_to_income_ratio": s["debt_to_income_ratio"],
                "applicant_age": s["applicant_age"],
                "number_of_dependents": s["number_of_dependents"],
                "loan_type": s["loan_type"],
                "purpose_of_loan": s["purpose_of_loan"],
                "employment_status": s["employment_status"],
                "property_ownership_status": s["property_ownership_status"],
                "gender": s["gender"],
                "residential_address": s["residential_address"],
                "device_fingerprint": s["device_fingerprint"],
                "simulated_scenario": s.get("simulated_scenario")
            }
            report = orchestrator.process_application(raw_payload)

            detection = report["detection_report"]
            sup_res = detection["supervised_model"]
            ae_res = detection["autoencoder_anomaly"]
            analytics = report["analytics_report"]
            advisory = report["advisory_report"]
            relationship = report["relationship_report"]

            app_row = LoanApplication(
                application_ref=s["application_ref"],
                customer_id=cust.id,
                loan_type=s["loan_type"],
                loan_amount_requested=s["loan_amount_requested"],
                loan_tenure_months=s["loan_tenure_months"],
                interest_rate_offered=s["interest_rate_offered"],
                purpose_of_loan=s["purpose_of_loan"],
                monthly_income=s["monthly_income"],
                cibil_score=s["cibil_score"],
                existing_emis_monthly=s["existing_emis_monthly"],
                debt_to_income_ratio=s["debt_to_income_ratio"],
                applicant_age=s["applicant_age"],
                number_of_dependents=s["number_of_dependents"],
                employment_status=s["employment_status"],
                property_ownership_status=s["property_ownership_status"],
                gender=s["gender"],
                residential_address=s["residential_address"],
                status=s["status"],
                priority=analytics["risk_tier"],
                assigned_to=s["assigned_to"],
                risk_score=analytics["composite_risk_score"],
                risk_tier=analytics["risk_tier"],
                fraud_probability=sup_res.get("fraud_probability", 0.0),
                dynamic_threshold=sup_res.get("dynamic_threshold", 0.40),
                is_model_flagged=sup_res.get("is_flagged", False),
                autoencoder_error=ae_res.get("reconstruction_error", 0.0),
                autoencoder_threshold=ae_res.get("anomaly_threshold", 0.128788),
                is_anomaly=ae_res.get("is_anomaly", False),
                anomaly_deviation_pct=ae_res.get("relative_deviation_pct", 0.0),
                decision_summary=advisory.get("decision_summary", "")
            )
            db.add(app_row)
            db.flush()

            # 3. Device Profile
            dev_row = DeviceNetworkProfile(
                application_id=app_row.id,
                device_fingerprint=s["device_fingerprint"],
                ip_address=s["ip_address"],
                device_model=s["device_model"],
                residential_address_hash=str(hash(s["residential_address"]))[:12]
            )
            db.add(dev_row)

            # 4. Evidence Items
            for sig in analytics.get("signals", []):
                ev = CaseEvidence(
                    application_id=app_row.id,
                    signal_code=sig.get("code", "SIG_GENERAL"),
                    severity=sig.get("severity", "MODERATE"),
                    category=sig.get("category", "MODEL"),
                    title=sig.get("title", ""),
                    description=sig.get("description", ""),
                    impact_score=sig.get("impact_score", 0.0),
                    is_verified=False
                )
                db.add(ev)

            # 5. Application Relationships
            for rel in relationship.get("relationships", []):
                rel_row = ApplicationRelationship(
                    source_application_ref=app_row.application_ref,
                    target_application_ref=rel.get("target_application_ref", ""),
                    source_customer_name=s["full_name"],
                    target_customer_name=rel.get("target_customer_name", ""),
                    link_type=rel.get("link_type", "SHARED_DEVICE"),
                    link_value=rel.get("link_value", ""),
                    risk_contribution=rel.get("risk_contribution", 10.0)
                )
                db.add(rel_row)

            # 6. Specific Audit notes & decisions for resolved scenarios
            if s["application_ref"] == "APP-10299":
                note = CaseNote(
                    application_id=app_row.id,
                    author_name="Rajesh Verma (Senior Analyst)",
                    author_role="SUPERVISOR",
                    note_text="Field Investigation confirmed employer address is a ghost entity. Form 26AS mismatch found. Case escalated to FCU."
                )
                db.add(note)
                dec = AnalystDecision(
                    application_id=app_row.id,
                    analyst_name="Rajesh Verma",
                    analyst_role="SUPERVISOR",
                    decision="CONFIRMED_FRAUD",
                    reason_code="RC_SYNTHETIC_IDENTITY",
                    is_override=False,
                    rationale="Fabricated income documents and shared device link confirmed with APP-10291 and APP-10293."
                )
                db.add(dec)
                audit = AuditLog(
                    application_id=app_row.id,
                    actor_name="Rajesh Verma",
                    actor_role="SUPERVISOR",
                    action_type="STATUS_CHANGE",
                    details="Status changed from UNDER_REVIEW to CONFIRMED_FRAUD"
                )
                db.add(audit)
                fb = AnalystFeedback(
                    application_id=app_row.id,
                    ai_risk_score=analytics["composite_risk_score"],
                    ai_risk_tier=analytics["risk_tier"],
                    ai_fraud_probability=sup_res.get("fraud_probability", 0.0),
                    analyst_decision="CONFIRMED_FRAUD",
                    is_fraud_confirmed=True,
                    is_false_positive=False,
                    disposition_category="SYNTHETIC_IDENTITY",
                    feedback_notes="AI correctly prioritized high risk due to shared device syndicate."
                )
                db.add(fb)

            elif s["application_ref"] == "APP-10300":
                note = CaseNote(
                    application_id=app_row.id,
                    author_name="Pooja Mehta",
                    author_role="FRAUD_ANALYST",
                    note_text="Doctor clinic verification completed. Legitimate high earner with young professional profile. Autoencoder flag cleared."
                )
                db.add(note)
                dec = AnalystDecision(
                    application_id=app_row.id,
                    analyst_name="Pooja Mehta",
                    analyst_role="FRAUD_ANALYST",
                    decision="FALSE_POSITIVE",
                    reason_code="RC_LEGITIMATE_OUTLIER",
                    is_override=True,
                    rationale="High income at young age triggered autoencoder outlier, but physical e-KYC and medical council registration verified genuine."
                )
                db.add(dec)
                audit = AuditLog(
                    application_id=app_row.id,
                    actor_name="Pooja Mehta",
                    actor_role="FRAUD_ANALYST",
                    action_type="DECISION_RECORDED",
                    details="Analyst overrode AI high risk recommendation to FALSE_POSITIVE."
                )
                db.add(audit)
                fb = AnalystFeedback(
                    application_id=app_row.id,
                    ai_risk_score=analytics["composite_risk_score"],
                    ai_risk_tier=analytics["risk_tier"],
                    ai_fraud_probability=sup_res.get("fraud_probability", 0.0),
                    analyst_decision="FALSE_POSITIVE",
                    is_fraud_confirmed=False,
                    is_false_positive=True,
                    disposition_category="LEGITIMATE_HIGH_NET_WORTH",
                    feedback_notes="Logged as valid manifold false positive for future autoencoder percentile calibration."
                )
                db.add(fb)
            else:
                audit = AuditLog(
                    application_id=app_row.id,
                    actor_name="System",
                    actor_role="AI_ENGINE",
                    action_type="SCREENING_INGESTED",
                    details=f"Application screened and assigned risk tier: {analytics['risk_tier']} (Score: {analytics['composite_risk_score']}/100)"
                )
                db.add(audit)

        db.commit()
        print(f"[Seed] Successfully initialized SQLite database with {len(scenarios)} applications!")
    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
