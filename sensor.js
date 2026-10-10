const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// In-memory storage para sa mga readings
let readings = [];

// Initialize Google Gen AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// 1. POST /api/readings
app.post('/api/readings', (req, res) => {
    const { sensorId, waterLevelCm, timestamp } = req.body;
    
    if (!isValidReading({ sensorId, waterLevelCm })) {
        return res.status(400).json({ error: 'Invalid or missing fields.' });
    }

    const newReading = {
        sensorId,
        waterLevelCm,
        timestamp: timestamp || new Date().toISOString()
    };

    readings.unshift(newReading);
    if (readings.length > 1000) readings.pop();

    return res.status(201).json({ message: 'Reading saved successfully', data: newReading });
});

// 2. GET /api/readings
app.get('/api/readings', (req, res) => {
    res.json(readings.slice(0, 50));
});

// 3. GET /api/summary
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

// 4. POST /api/advisory (Gemini AI + Fallback)
app.post('/api/advisory', async (req, res) => {
    const summary = req.body;
    let fallbackAdvisory = "Maging alerto sa pagbabago ng tubig. Manatiling ligtas.";
    if (summary.max >= 150) {
        fallbackAdvisory = "DANGER LEVEL: Lumikas na agad sa mas mataas na lugar para sa kaligtasan.";
    } else if (summary.max >= 100) {
        fallbackAdvisory = "ALERT LEVEL: Maghanda na sa posibleng pagtaas ng tubig malapit sa sapa.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Based on the following flood summary data: Average level ${summary.average}cm, Minimum ${summary.min}cm, Maximum ${summary.max}cm, Trend is ${summary.trend}. Write a short advisory (3 sentences or fewer) in both Filipino and English telling residents what to do. Use only the numbers provided.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const advisoryText = response.text();
        res.json({ advisory: advisoryText, source: 'ai' });
    } catch (error) {
        console.error('Gemini API Error, using fallback:', error.message);
        res.json({ advisory: fallbackAdvisory, source: 'fallback' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
