import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './LibraryPage.css';

const BOOK_SUMMARIES = {
  1: { pages: 227, summary: "After the sudden death of her husband, Joan Didion spent a year lost in the fog of grief. A raw, unflinching examination of how we grieve and how we go on. A seminal work on loss.", themes: ["Grief", "Marriage", "Loss", "Memory"], readingTime: "5–6 hours" },
  2: { pages: 76, summary: "Written after his wife's death, C.S. Lewis confronts the silence of God and the terrifying absence of someone beloved. One of the most honest books about grief ever written.", themes: ["Grief", "Faith", "Loss", "Love"], readingTime: "2–3 hours" },
  3: { pages: 228, summary: "A neurosurgeon diagnosed with cancer at 36 asks: what makes life meaningful when time is short? Beautiful, devastating, and ultimately life-affirming.", themes: ["Mortality", "Meaning", "Love"], readingTime: "5–6 hours" },
};

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const { user, isLoggedIn, toggleFavourite, updateReadingList, isFavourite, getReadingStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const mood = searchParams.get('mood');
    if (mood) setSelectedMood(mood);
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
    fetchMoods();
  }, [selectedMood]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = selectedMood ? { mood: selectedMood } : {};
      const res = await axios.get('/api/books', { params });
      setBooks(res.data.books);
    } catch { setBooks([]); }
    setLoading(false);
  };

  const fetchMoods = async () => {
    try {
      const res = await axios.get('/api/moods');
      setMoods(res.data.moods);
    } catch {}
  };

  const filteredBooks = books.filter(b =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleFav = async (e, bookId) => {
    e.stopPropagation();
    if (!isLoggedIn) { navigate('/auth'); return; }
    await toggleFavourite(bookId);
  };

  const handleReadingList = async (e, bookId, status) => {
    e.stopPropagation();
    if (!isLoggedIn) { navigate('/auth'); return; }
    await updateReadingList(bookId, status);
  };

  return (
    <div className="library-page">
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBook(null)}>✕</button>
            <div className="modal-header">
              <div className="modal-spine" style={{ background: selectedBook.cover_color }}></div>
              <div className="modal-title-block">
                <div className="modal-genre-tag">{selectedBook.genre}</div>
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">by {selectedBook.author} · {selectedBook.year}</p>
                <div className="modal-meta">
                  <span>📄 {selectedBook.pages} pages</span>
                  <span>⏱ {selectedBook.reading_time}</span>
                  <span>⭐ {selectedBook.rating}</span>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <h4>About this book</h4>
              <p className="modal-summary">{selectedBook.summary || selectedBook.description}</p>
              {selectedBook.themes && (
                <div className="modal-themes">
                  <h4>Themes</h4>
                  <div className="modal-theme-tags">
                    {selectedBook.themes.map(t => <span key={t} className="modal-theme-tag">{t}</span>)}
                  </div>
                </div>
              )}
              <div className="modal-music">
                <h4>🎵 Music Pairing</h4>
                <p>{selectedBook.music}</p>
              </div>

              {/* Auth actions in modal */}
              <div className="modal-actions">
                <button
                  className={`modal-fav-btn ${isFavourite(selectedBook.id) ? 'active' : ''}`}
                  onClick={(e) => handleFav(e, selectedBook.id)}
                >
                  {isFavourite(selectedBook.id) ? '❤️ Favourited' : '🤍 Add to Favourites'}
                </button>
                <div className="modal-reading-btns">
                  {['want', 'reading', 'finished'].map(status => (
                    <button
                      key={status}
                      className={`modal-status-btn ${getReadingStatus(selectedBook.id) === status ? 'active' : ''}`}
                      onClick={(e) => handleReadingList(e, selectedBook.id, status)}
                    >
                      {status === 'want' ? '📌 Want to Read' : status === 'reading' ? '📖 Reading' : '✅ Finished'}
                    </button>
                  ))}
                </div>
                {!isLoggedIn && <p className="modal-auth-hint">👤 <button onClick={() => navigate('/auth')}>Sign in</button> to save books</p>}
              </div>

              <div className="modal-moods">
                <h4>Good for when you feel</h4>
                <div className="book-moods">
                  {selectedBook.mood.map(m => (
                    <span key={m} className="book-mood-tag" onClick={() => { setSelectedMood(m); setSelectedBook(null); }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="library-header">
        <div className="library-header-text">
          <span className="section-tag">The Sanctuary</span>
          <h1>Healing Library</h1>
          <p>100 books curated for every shade of the human experience</p>
        </div>
        <div className="library-controls">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search books or authors..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="mood-filter">
            <button className={`mood-filter-btn ${!selectedMood ? 'active' : ''}`} onClick={() => setSelectedMood('')}>All</button>
            {moods.slice(0, 14).map(m => (
              <button key={m} className={`mood-filter-btn ${selectedMood === m ? 'active' : ''}`} onClick={() => setSelectedMood(m === selectedMood ? '' : m)}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="library-loading"><div className="loading-spinner">📚</div><p>Finding your books...</p></div>
      ) : (
        <>
          <p className="book-count">{filteredBooks.length} books found · <em>Click any book to read a summary</em></p>
          <div className="books-grid">
            {filteredBooks.map((book, i) => (
              <div key={book.id} className="book-card" style={{ '--delay': `${i * 0.05}s` }} onClick={() => setSelectedBook(book)}>
                <div className="book-spine" style={{ background: book.cover_color }}></div>
                <div className="book-content">
                  <div className="book-genre-tag">{book.genre}</div>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <p className="book-desc">{book.description}</p>
                  <div className="book-music"><span>🎵</span><span>{book.music}</span></div>
                  <div className="book-moods">
                    {book.mood.map(m => (
                      <span key={m} className="book-mood-tag" onClick={e => { e.stopPropagation(); setSelectedMood(m); }}>{m}</span>
                    ))}
                  </div>
                  <div className="book-card-actions">
                    <button
                      className={`card-fav-btn ${isFavourite(book.id) ? 'active' : ''}`}
                      onClick={(e) => handleFav(e, book.id)}
                      title={isFavourite(book.id) ? 'Remove from favourites' : 'Add to favourites'}
                    >
                      {isFavourite(book.id) ? '❤️' : '🤍'}
                    </button>
                    <div className="book-preview-hint">👁 Click to read summary</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredBooks.length === 0 && (
            <div className="no-books">
              <p>No books found. <button className="link-btn" onClick={() => { setSelectedMood(''); setSearch(''); }}>Clear filters</button></p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
