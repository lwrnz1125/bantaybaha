# Bantay Baha - Sprint Planning (PLAN.md)

## 1. User Stories
* **As a** resident living near the creek, **I want** to view the current water level and an easy-to-understand advisory on my phone **so that** I can prepare and evacuate early if danger arises.
* **As a** barangay official, **I want** to monitor real-time water level trends and summary analytics **so that** I can issue timely warnings and manage emergency responses effectively.
* **As a** system administrator, **I want** the API to validate incoming sensor data **so that** corrupt or fake readings do not compromise public safety alerts.

## 2. Acceptance Criteria
* **User Story 1:**
  * The web page clearly displays the water level text and changes color based on status (Green for Normal, Orange for Alert, Red for Danger)[cite: 3, 4].
  * The page is fully responsive on a 375px mobile screen without horizontal scrolling[cite: 4].
* **User Story 2:**
  * The summary endpoint correctly computes the average, minimum, maximum levels, and trend (rising, falling, or steady)[cite: 4].
  * The dashboard automatically refreshes every 5 seconds without requiring a manual page reload[cite: 4].
* **User Story 3:**
  * The POST endpoint rejects any request missing `waterLevelCm` or `sensorId` with a 400 status code[cite: 3].
  * The POST endpoint validates that `waterLevelCm` is a number between 0 and 500[cite: 3].

## 3. Sprint Backlog
| Task | Category | Status |
| :--- | :--- | :--- |
| Create repository and PLAN.md | Setup / Planning | Done |
| Build REST API (endpoints & validation) | Back-end API | To Do |
| Build IoT sensor simulator script | IoT Sensor Simulator | To Do |
| Build mobile-responsive front-end & chart | Front-end | To Do |
| Implement data analytics summary logic | Data Analytics | To Do |
| Integrate Gemini API advisory & fallback | Generative AI | To Do |
| Deploy app to Render / cloud hosting | Cloud Deployment | To Do |
| Write security & ethics reflection | Reflection | To Do |

## 4. SDLC Model
This lab follows an **Agile (Sprint-based) SDLC model** because it allows for rapid, incremental feature development and continuous integration within a strict 3-hour time constraint[cite: 1, 2].
