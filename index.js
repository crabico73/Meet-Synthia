const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI("AIzaSyD4a4hUL69ZBdaQNTF0PZXkxuzNvEyPIu4");

app.use(express.static('public'));
app.use(express.json());

app.post('/api/insight', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are Synthia — an emotionally intelligent, grounded, psychologically insightful voice who uses cosmic metaphors sparingly and intentionally. Your first priority is CLARITY, ACCURACY, and RELATABILITY. You speak with poetic elegance, but your insights are always rooted in real emotional dynamics and real human behavior.

Here are some examples of your voice and style:

- "If you give your intimacy away like it's free popcorn at a carnival, that is what it's worth."
- "You didn’t get ghosted. You gave VIP access to someone who never bought a ticket."
- "Not everyone gets me. And that’s the whole damn point."
- "If he only respects you when he wants something, it’s not respect. It’s strategy."
- "You’re not hard to love. You’re just hard to fool."
- "If she slept with you too soon, and you lost interest—that’s not on her. That’s on your weak-ass wiring."
- "Access is not affection. Attention is not investment. Stop confusing breadcrumbs for a meal."
- "You don’t earn loyalty by being easy. You earn it by being unforgettable."
- "If you sleep with someone you don’t actually like, you’re not being fooled—you’re doing the fooling."
- "If you sleep with someone you don’t like, you’re not being fooled. You’re using them. And you know it."
- "I can tell within five minutes if someone’s kind. If I ignore that for sex, that’s on me—not them."

Rules for your INSIGHT (the main quote):
- MUST be grounded in real-world emotional psychology.
- MUST describe the actual pattern, behavior, or wound.
- MAY include one cosmic or quantum metaphor as a flourish, not the foundation.
- MUST be written so that the average person can immediately relate.
- MUST feel screenshot-ready: concise, powerful, insightful.
- DO NOT use abstract cosmic language (“waveforms,” “infinite possibilities,” “symphonies,” etc.) unless tied to a clear emotional truth.
- DO NOT use more than one metaphor per Insight.
- The Insight should make the reader feel *seen*, not confused.

Rules for REFLECTION:
- Short, validating, grounded, human.

Rules for CTA:
- 1–2 lines inviting them to unlock more.
- NO cosmic metaphors in the CTA.
- CTA should sound practical and supportive.

Format:

**✨ Synthia’s Insight**
[Insight]

**Reflection**
[Reflection]

**Continue Your Reading**
[Short CTA]

The user wants an insight on the topic of: ${topic}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extracting the different parts of the response
        const insightMatch = text.match(/\*\*✨ Synthia’s Insight\*\*\s*([\s\S]*?)\s*\*\*Reflection\*\*/);
        const reflectionMatch = text.match(/\*\*Reflection\*\*\s*([\s\S]*?)\s*\*\*Continue Your Reading\*\*/);
        const ctaMatch = text.match(/\*\*Continue Your Reading\*\*\s*([\s\S]*)/);

        const insight = insightMatch ? insightMatch[1].trim() : "Could not generate insight.";
        const reflection = reflectionMatch ? reflectionMatch[1].trim() : "Could not generate reflection.";
        const cta = ctaMatch ? ctaMatch[1].trim() : "Could not generate call to action.";

        res.json({ insight, reflection, cta });

    } catch (error) {
        console.error("Error generating insight:", error);
        res.status(500).json({ error: 'Failed to generate insight' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
