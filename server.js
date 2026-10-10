const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory storage para sa mga readings
let readings = [];

// Helper para sa data validation
function isValidReading(data) {
    if (!data.sensorId || data.waterLevelCm === undefined || data.waterLevelCm === null) {
        return false;
    }
    if (typeof data.waterLevelCm !== 'number' || isNaN(data.waterLevelCm)) {
        return false;
    }
    if (data.waterLevelCm < 0 || data.waterLevelCm > 500) {
        return false;
    }
    return true;
}

// 1. POST /api/readings - Tumatanggap at nag-sasaver ng bagong reading
app.post('/api/readings', (req, res) => {
    const { sensorId, waterLevelCm, timestamp } = req.body;
    
    if (!isValidReading({ sensorId, waterLevelCm })) {
        return res.status(400).json({ error: 'Invalid or missing fields. waterLevelCm must be a number between 0 and 500, and sensorId is required.' });
    }

    const newReading = {
        sensorId,
        waterLevelCm,
        timestamp: timestamp || new Date().toISOString()
    };

    // Ilagay sa unahan ng array para newest first
    readings.unshift(newReading);
    
    // Panatilihing manageable ang memory (opsyonal: limitahan sa huling 1000)
    if (readings.length > 1000) readings.pop();

    return.status(201).json({ message: 'Reading saved successfully', data: newReading });
});

// 2. GET /api/readings - Nagbabalik ng 50 most recent readings
app.get('/api/readings', (req, res) => {
    const latestReadings = readings.slice(0, 50);
    res.json(latestReadings);
});

// 3. GET /api/summary - Nagbabalik ng analytics (para sa Part E)
app.get('/api/summary', (req, res) => {
    if (readings.length === 0) {
        return res.json({
            count: 0,
            average: 0,
            min: 0,
            max: 0,
            statusCounts: { normal: 0, alert: 0, danger: 0 },
            trend: 'steady'
        });
    }

    const levels = readings.map(r => r.waterLevelCm);
    const sum = levels.reduce((a, b) => a + b, 0);
    const average = sum / levels.length;
    const min = Math.min(...levels);
    const max = Math.max(...levels);

    let normal = 0, alert = 0, danger = 0;
    readings.forEach(r => {
        if (r.waterLevelCm < 100) normal++;
        else if (r.waterLevelCm <= 149) alert++;
        else danger++;
    });

    // Trend calculation: compare average of last 5 vs previous 5
    let trend = 'steady';
    if (readings.length >= 10) {
        const last5 = readings.slice(0, 5).map(r => r.waterLevelCm);
        const prev5 = readings.slice(5, 10).map(r => r.waterLevelCm);
        const avgLast5 = last5.reduce((a, b) => a + b, 0) / 5;
        const avgPrev5 = prev5.reduce((a, b) => a + b, 0) / 5;

        if (avgLast5 > avgPrev5 + 1) trend = 'rising';
        else if (avgLast5 < avgPrev5 - 1) trend = 'falling';
    }

    res.json({
        count: readings.length,
        average: parseFloat(average.toFixed(2)),
        min,
        max,
        statusCounts: { normal, alert, danger },
        trend
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
