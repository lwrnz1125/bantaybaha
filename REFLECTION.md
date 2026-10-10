# Bantay Baha - Security, Ethics & Emerging Tech Reflection (REFLECTION.md)

### 1. Security Risks and Fixes
One major security risk in the current app is that the POST `/api/readings` endpoint is unauthenticated, allowing anyone with the API endpoint to submit fake or malicious water level data. Another risk is potential Cross-Site Scripting (XSS) if sensor IDs or inputs are rendered unsanitized on the client side. To fix these, I would implement API authentication tokens or HMAC signatures for authorized IoT devices, and ensure strict input sanitization on the frontend.

### 2. AI Accountability and Safeguards
If the generative AI writes a wrong advisory (such as declaring a false "Normal" status during a flash flood), the system developer and deploying officials share responsibility for deploying an unverified model. To safeguard against this, the app includes a hardcoded rule-based fallback advisory that activates if the AI fails or outputs invalid risk levels, ensuring life-critical warnings rely primarily on deterministic sensor thresholds.

### 3. Emerging Technology Extension (Blockchain)
Integrating blockchain technology could create an immutable, tamper-proof audit trail of every water level reading and advisory issued, which is valuable for post-disaster accountability. However, it might not be worth the cost because the high latency, deployment complexity, and computational overhead provide zero functional benefit for a real-time emergency dashboard that simply needs fast HTTP updates.

### 4. Big Data Analytics at Scale
If the barangay installed 200 sensors across Metro Manila instead of just one, big data analytics would shift from a simple moving average to a complex spatial-temporal processing pipeline. It would require distributed data streaming architectures (like Kafka or Spark) to handle high-velocity telemetry, spatial interpolation algorithms to map localized flood predictions, and anomaly detection models to isolate faulty sensors.
