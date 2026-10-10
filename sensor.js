// sensor.js
const API_URL = 'http://localhost:3000/api/readings'; // Palitan ng live URL kapag nasa Part G na

let currentLevel = 85.5; // Magsimula sa normal na water level (cm)

function sendSensorReading() {
    // Unti-unting pagbabago (gradual step): random na tataas o baba ng konti mula sa huling value
    const step = (Math.random() * 4) - 2; // Magbibigay ng pagbabago sa pagitan ng -2cm at +2cm
    currentLevel += step;

    // Panatilihing nasa valid range (0 hanggang 500 cm)
    currentLevel = Math.max(0, Math.min(500, parseFloat(currentLevel.toFixed(1))));

    const payload = {
        sensorId: "CREEK-01",
        waterLevelCm: currentLevel,
        timestamp: new Date().toISOString()
    };

    /* 
      NOTE: A real IoT setup would replace this software script with a physical microcontroller 
      (such as an ESP32 or ESP8266) wired to an ultrasonic distance sensor (like HC-SR04) 
      installed above the creek, transmitting live telemetry data over Wi-Fi (HTTP/MQTT).
    */

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(`[Sensor Simulator] Sent: ${currentLevel} cm`, data);
    })
    .catch(error => {
        console.error('[Sensor Simulator] Failed to send reading:', error.message);
    });
}

// Mag-execute kada 5 segundo (5000 ms)
setInterval(sendSensorReading, 5000);

console.log('IoT Sensor Simulator is running... Press Ctrl+C to stop.');
