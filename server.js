// Ilagay ito sa iyong server.js
const { GoogleGenAI } = require('@google/genai');

// I-initialize ang Google Gen AI SDK (gumagamit ng GEMINI_API_KEY environment variable)
const ai = new GoogleGenAI();

app.post('/api/advisory', async (req, res) => {
    const summary = req.body;
    
    // Rule-based fallback advisory kung sakaling mag-fail ang AI call
    let fallbackAdvisory = "Maging alerto sa pagbabago ng tubig. Manatiling ligtas.";
    if (summary.max >= 150) {
        fallbackAdvisory = "DANGER LEVEL: Lumikas na agad sa mas mataas na lugar para sa kaligtasan.";
    } else if (summary.max >= 100) {
        fallbackAdvisory = "ALERT LEVEL: Maghanda na sa posibleng pagtaas ng tubig malapit sa sapa.";
    }

    try {
        // AI Prompt na gumagamit lamang ng mga numerong ipinadala mula sa summary
        const prompt = `Based on the following flood summary data: Average level ${summary.average}cm, Minimum ${summary.min}cm, Maximum ${summary.max}cm, Trend is ${summary.trend}. Write a short advisory (3 sentences or fewer) in both Filipino and English telling residents what to do. Use only the numbers provided.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const advisoryText = response.text;
        res.json({ advisory: advisoryText, source: 'ai' });
    } catch (error) {
        console.error('Gemini API Error, using fallback:', error.message);
        res.json({ advisory: fallbackAdvisory, source: 'fallback' });
    }
});
