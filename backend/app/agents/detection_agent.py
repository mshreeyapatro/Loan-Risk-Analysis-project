import time
from typing import Dict, Any
from app.ml.engine import ml_engine

class DetectionAgent:
    """
    Stage 1 Agent: Runs Supervised Classification and Deep Tabular Autoencoder
    concurrently, extracting model metrics and execution latencies.
    """
    def run(self, application_dict: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        
        # Transform inputs into standardized 33-dim vector
        transformed_features = ml_engine.transform_payload(application_dict)
        
        # 1. Supervised Fraud Classifier
        supervised_result = ml_engine.predict_supervised(transformed_features, application_dict)
        
        # 2. Deep Unsupervised Autoencoder Anomaly Detector
        autoencoder_result = ml_engine.predict_unsupervised_autoencoder(transformed_features)
        
        latency_ms = round((time.time() - start_time) * 1000, 2)
        
        return {
            "status": "COMPLETED",
            "latency_ms": latency_ms,
            "supervised_model": supervised_result,
            "autoencoder_anomaly": autoencoder_result
        }
