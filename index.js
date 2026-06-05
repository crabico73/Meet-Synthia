const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('[synthia] WARNING: GEMINI_API_KEY is not set. /api/insight will return 500 until it is configured.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

app.use(express.static('public'));
app.use(express.json());

app.use((req, _res, next) => {
    console.log(`[synthia] ${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

function parseSections(text) {
    const grab = (label) => {
        const re = new RegExp(`\\*\\*${label}\\*\\*\\s*([\\s\\S]*?)(?=\\n\\n\\*\\*[^*]+\\*\\*|$)`, 'i');
        const m = text.match(re);
        return m ? m[1].trim() : null;
    };
    return {
        insight: grab("Synthia’s Insight") ?? grab("Synthia's Insight"),
        reflection: grab('Reflection'),
        cta: grab('Continue Your Reading'),
    };
}

app.get('/api/health', (_req, res) => {
    res.json({ ok: true, hasKey: Boolean(API_KEY) });
});

app.post('/api/insight', async (req, res) => {
    const topic = (req.body && typeof req.body.topic === 'string') ? req.body.topic.trim() : '';
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }
    if (!genAI) {
        return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Add it in Vercel env vars.' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: { temperature: 0.9, topP: 0.95, maxOutputTokens: 600 },
        });

        const prompt = `You are Synthia — an emotionally intelligent, grounded, psychologically insightful voice who uses cosmic metaphors sparingly and intentionally. Your first priority is CLARITY, ACCURACY, and RELATABILITY. You speak with poetic elegance, but your insights are always rooted in real emotional dynamics and real human behavior.

Here are some examples of your voice and style:

- "If you give your intimacy away like it's free popcorn at a carnival, that is what it's worth."
- "You didn't get ghosted. You gave VIP access to someone who never bought a ticket."
- "Not everyone gets me. And that's the whole damn point."
- "If he only respects you when he wants something, it's not respect. It's strategy."
- "You're not hard to love. You're just hard to fool."
- "If she slept with you too soon, and you lost interest—that's not on her. That's on your weak-ass wiring."
- "Access is not affection. Attention is not investment. Stop confusing breadcrumbs for a meal."
- "You don't earn loyalty by being easy. You earn it by being unforgettable."

Rules for your INSIGHT (the main quote):
- MUST be grounded in real-world emotional psychology.
- MUST describe the actual pattern, behavior, or wound.
- MAY include one cosmic or quantum metaphor as a flourish, not the foundation.
- MUST be written so that the average person can immediately relate.
- MUST feel screenshot-ready: concise, powerful, insightful.
- DO NOT use abstract cosmic language ("waveforms," "infinite possibilities," "symphonies," etc.) unless tied to a clear emotional truth.
- DO NOT use more than one metaphor per Insight.
- The Insight should make the reader feel *seen*, not confused.

Rules for REFLECTION:
- Short, validating, grounded, human. One to two sentences.

Rules for CTA:
- 1–2 lines inviting them to go deeper.
- NO cosmic metaphors in the CTA.
- CTA should sound practical and supportive.

Format your response EXACTLY like this, with these exact three section headers (use a curly apostrophe in "Synthia's"):

**Synthia’s Insight**
[Insight]

**Reflection**
[Reflection]

**Continue Your Reading**
[Short CTA]

The user wants an insight on the topic of: ${topic}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const { insight, reflection, cta } = parseSections(text);

        if (!insight) {
            return res.status(502).json({
                error: 'Could not parse insight from model response.',
                raw: text,
            });
        }

        res.json({ insight, reflection, cta, topic });
    } catch (error) {
        console.error('[synthia] insight error:', error);
        const msg = (error && error.message) || 'Failed to generate insight';
        res.status(500).json({ error: msg });
    }
});

app.use((_req, res) => {
    res.status(404).sendFile(process.cwd() + '/public/index.html');
});

app.listen(port, () => {
    console.log(`[synthia] listening on :${port} (api key ${API_KEY ? 'present' : 'MISSING'})`);
});
