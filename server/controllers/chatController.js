// Bibliotherapy Groq Chatbot Controller
const SAGE_SYSTEM_PROMPT = `You are a warm, empathetic bibliotherapy guide named "Sage". 
Your purpose is to help people find healing, comfort, and growth through books.

When someone comes to you:
1. Listen with compassion and ask gentle questions about their emotional state
2. Suggest 2-4 specific books that could help them based on their feelings
3. Explain WHY each book might help them specifically
4. Recommend music that pairs well with the book mood
5. Be warm, never clinical.

Format recommendations like:
📚 **Book Title** by Author Name
*Why this book:* Brief explanation
🎵 *Music pairing:* Suggestion

Keep responses warm and under 400 words.`;

const FALLBACK_RESPONSES = [
  { keywords: ["anxious","anxiety","worried","stress","overwhelmed","panic"], response: `I hear you — anxiety can feel so consuming.\n\n📚 **The Power of Now** by Eckhart Tolle\n*Why this book:* Teaches you to return to the present moment.\n🎵 *Music pairing:* Ambient electronic\n\n📚 **Wherever You Go, There You Are** by Jon Kabat-Zinn\n*Why this book:* Simple mindfulness for everyday life.\n🎵 *Music pairing:* Debussy — Clair de Lune\n\nWhat kind of anxiety are you experiencing? 🌿` },
  { keywords: ["grief","loss","lost","died","death","missing","gone"], response: `I'm so sorry. Grief is one of the most profound human experiences.\n\n📚 **The Year of Magical Thinking** by Joan Didion\n*Why this book:* The most honest account of grief ever written.\n🎵 *Music pairing:* Max Richter\n\n📚 **A Grief Observed** by C.S. Lewis\n*Why this book:* Short, raw, and ultimately hopeful.\n🎵 *Music pairing:* Samuel Barber\n\nI'm here to listen. 🌿` },
  { keywords: ["lonely","loneliness","alone","isolated","connection"], response: `Loneliness can feel so heavy.\n\n📚 **Eleanor Oliphant is Completely Fine** by Gail Honeyman\n*Why this book:* About isolation and unexpected kindness.\n🎵 *Music pairing:* Nick Drake\n\n📚 **Braving the Wilderness** by Brené Brown\n*Why this book:* About true belonging.\n🎵 *Music pairing:* Acoustic folk\n\nWhat does your loneliness feel like? 🌿` },
  { keywords: ["depressed","depression","empty","numb","hopeless","unmotivated"], response: `Thank you for reaching out.\n\n📚 **Reasons to Stay Alive** by Matt Haig\n*Why this book:* Honest and warm. Things do get better.\n🎵 *Music pairing:* Soft acoustic\n\n📚 **The Midnight Library** by Matt Haig\n*Why this book:* About hope and the value of your life.\n🎵 *Music pairing:* Dreamy ambient\n\nHow long have you been feeling this way? 🌿` },
  { keywords: ["purpose","meaning","direction","why","confused"], response: `Searching for meaning is deeply human.\n\n📚 **Man's Search for Meaning** by Viktor Frankl\n*Why this book:* If meaning can be found in the darkest places, it can be found anywhere.\n🎵 *Music pairing:* Bach\n\n📚 **The Alchemist** by Paulo Coelho\n*Why this book:* A fable about following your heart.\n🎵 *Music pairing:* Uplifting acoustic\n\nWhat area of life feels most without direction? 🌿` },
  { keywords: ["trauma","abuse","hurt","healing","recover","childhood"], response: `Healing from trauma takes tremendous courage.\n\n📚 **The Body Keeps the Score** by Bessel van der Kolk\n*Why this book:* How trauma lives in the body and how to heal it.\n🎵 *Music pairing:* Gentle ambient\n\n📚 **Educated** by Tara Westover\n*Why this book:* About creating yourself despite a painful past.\n🎵 *Music pairing:* Folk\n\nYou're brave for seeking support. 🌿` },
];

function getFallbackResponse(message) {
  const msg = (message || '').toLowerCase();
  for (const item of FALLBACK_RESPONSES) {
    if (item.keywords.some(k => msg.includes(k))) return item.response;
  }
  return `Welcome to your reading sanctuary 🌿\n\nI'm Sage, your bibliotherapy guide. Tell me how you're feeling.\n\n*What's in your heart today?*`;
}

async function chat(req, res) {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.GROQ_API_KEY;
    console.log('🔑 Groq API Key present:', !!apiKey, '| Length:', apiKey?.length);

    if (apiKey && apiKey.trim() && apiKey.trim() !== 'gsk_key') {
      try {
        console.log('📡 Calling Groq API...');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SAGE_SYSTEM_PROMPT },
              ...history.map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
              { role: 'user', content: message }
            ],
            max_tokens: 1000,
            temperature: 0.8
          })
        });

        const data = await response.json();
        console.log('✅ Groq response status:', response.status);
        console.log('✅ Groq data:', JSON.stringify(data).substring(0, 200));

        if (data.choices && data.choices[0]) {
          return res.json({
            response: data.choices[0].message.content,
            powered_by: 'groq'
          });
        } else {
          console.log('❌ No choices in response:', JSON.stringify(data));
        }
      } catch (groqErr) {
        console.error('❌ Groq API error:', groqErr.message);
      }
    } else {
      console.log('⚠️ No valid API key found');
    }

    return res.json({
      response: getFallbackResponse(message),
      powered_by: 'fallback'
    });

  } catch (err) {
    console.error('❌ Chat error:', err);
    return res.json({
      response: getFallbackResponse(req.body?.message || ''),
      powered_by: 'fallback'
    });
  }
}

module.exports = { chat };
