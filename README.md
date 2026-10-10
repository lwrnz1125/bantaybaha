# Bantay Baha Flood Monitor

A comprehensive flood monitoring web application built for a barangay in Manila, featuring real-time IoT sensor simulation, data analytics, generative AI advisories, and mobile-responsive visualization[cite: 1, 3, 4].

## Features
* **REST API:** Handles incoming water level readings with validation (POST and GET endpoints).
* **IoT Sensor Simulator:** Automatically sends gradual water level updates every 5 seconds[cite: 3].
* **Mobile-Responsive Dashboard:** Displays current water status (Normal, Alert, Danger) with color coding, an interactive Chart.js line chart, a table of latest readings, and auto-refresh[cite: 3, 4].
* **Data Analytics:** Computes average, min, max, status counts, and trend logic (`/api/summary`)[cite: 4].
* **Generative AI Advisory:** Integrates Gemini API to generate short bilingual advisories (Filipino/English) with a built-in rule-based fallback[cite: 4].

## How to Run Locally
1. Clone the repository:
   ```bash
   git clone [https://github.com/lwrnz1125/bantay-baha.git](https://github.com/lwrnz1125/bantay-baha.git)
   cd bantay-baha
