# 📚 Bibliotherapy — Healing Through Books

A full-stack MERN application that uses AI-powered bibliotherapy to help users find the right books for their emotional needs, paired with genre-specific ambient music.

---

## ✨ Features

- **🤖 Sage AI Chatbot** — Powered by Google Gemini (free API key), provides personalized book recommendations based on your emotional state
- **🎵 Genre Music Player** — Curated YouTube playlists for each book genre (mystery, romance, fantasy, etc.)
- **📚 Healing Library** — 24+ curated books organized by mood and genre with music pairings
- **🌿 Soothing Design** — Warm parchment aesthetic with nature-inspired typography
- **🔑 No secret keys required** — Works with smart fallback if no API key added

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, CSS Animations |
| Backend | Node.js, Express |
| Database | MongoDB (optional) |
| AI | Google Gemini 1.5 Flash |
| Music | YouTube Embed API (free) |
| API Testing | Postman |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root tools
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
# In server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bibliotherapy

# Optional but recommended - get FREE key from https://aistudio.google.com/
GEMINI_API_KEY=your_free_key_here
```

### 3. Start the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
# App opens at http://localhost:3000
```

---

## 🔑 Getting Your Free Gemini API Key

The chatbot works WITHOUT an API key (smart fallback mode), but for full AI-powered responses:

1. Go to [aistudio.google.com](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API key"**
4. Copy the key and add it to `server/.env`:
   ```
   GEMINI_API_KEY=AIza...your_key_here
   ```
5. Restart the server

**It's completely free for personal use! ✅**

---

## 📮 Postman API Testing

Import `bibliotherapy-api.postman_collection.json` into Postman.

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/chat` | Chat with Sage (AI guide) |
| `GET` | `/api/chat/music-map` | Genre → music mappings |
| `GET` | `/api/books` | Get all books |
| `GET` | `/api/books?mood=grief` | Filter by mood |
| `GET` | `/api/books?genre=memoir` | Filter by genre |
| `GET` | `/api/books/:id` | Get single book |
| `GET` | `/api/moods` | Get all available moods |

### Example Chat Request

```json
POST /api/chat
{
  "message": "I've been feeling really anxious and overwhelmed",
  "history": []
}
```

### Example Response

```json
{
  "response": "I hear you... Here are books that might help:\n\n📚 **The Power of Now** by Eckhart Tolle...",
  "powered_by": "gemini",
  "genre_music": { ... }
}
```

---

## 🗂 Project Structure

```
bibliotherapy/
├── server/
│   ├── index.js                    # Express server entry point
│   ├── routes/
│   │   ├── chat.js                 # /api/chat routes
│   │   ├── books.js                # /api/books routes
│   │   └── moods.js                # /api/moods routes
│   ├── controllers/
│   │   ├── chatController.js       # Gemini AI integration
│   │   └── bookController.js       # Book data & filtering
│   └── .env                        # Environment variables
│
├── client/
│   └── src/
│       ├── App.js                  # Root component + routing
│       ├── context/
│       │   └── MusicContext.js     # Global music state
│       ├── components/
│       │   ├── Navbar.js           # Navigation
│       │   └── MusicPlayer.js      # YouTube music player
│       └── pages/
│           ├── HomePage.js         # Landing page
│           ├── ChatPage.js         # Sage chatbot
│           ├── LibraryPage.js      # Book library
│           └── MusicPage.js        # Music by genre
│
├── bibliotherapy-api.postman_collection.json
└── README.md
```

---

## 🎵 Music Sources

Music is streamed free from YouTube. Genres include:
- **Romance** → Chopin Nocturnes
- **Mystery** → Jazz Noir (Miles Davis)
- **Fantasy** → Epic Orchestral
- **Literary** → Debussy Piano
- **Self-Help** → Mindfulness Ambient
- **Poetry** → Max Richter "Sleep"
- **Historical** → Bach Cello Suites
- **Sci-Fi** → Vangelis Space Ambient
- And more...

---

## 🌿 About Bibliotherapy

Bibliotherapy is the practice of using books and reading as a therapeutic tool. Dating back to ancient Greece where the library at Thebes bore the inscription "Medicine for the Soul," it has been used by therapists, librarians, and educators to support:

- Emotional processing and grief
- Anxiety and stress management  
- Building empathy and perspective
- Recovery from trauma
- Developing self-understanding

---

*"A reader lives a thousand lives before he dies." — George R.R. Martin*
