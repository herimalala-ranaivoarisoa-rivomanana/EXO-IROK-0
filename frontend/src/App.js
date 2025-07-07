import React, { useState } from 'react';
import './App.css';

/**
 * Main React component for the URL shortener frontend.
 * Handles URL input, submission, optimistic updates, and displays history.
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [urls, setUrls] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  React.useEffect(() => {
    fetch(process.env.REACT_APP_API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des URLs');
        return res.json();
      })
      .then(data => {
        
        setUrls(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  


  /**
 * Handles form submission for creating a shortened URL.
 * Performs optimistic UI update and error handling.
 * @param {React.FormEvent<HTMLFormElement>} e - The form event
 */
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setOriginalUrl('');

    
    const tempShortCode = 'temp-' + Date.now();
    const optimisticUrl = {
      shortUrl: 'En attente...',
      shortCode: tempShortCode,
      originalUrl: longUrl
    };
    setUrls(prev => [optimisticUrl, ...prev]);

    try {
      const res = await fetch(process.env.REACT_APP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: longUrl }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur serveur');
      }
      const data = await res.json();
      setShortUrl(data.shortUrl);
      setOriginalUrl(data.originalUrl);
      
      setUrls(prev => {
        
        return [
          { shortUrl: data.shortUrl, shortCode: data.shortCode, originalUrl: data.originalUrl },
          ...prev.filter(url => url.shortCode !== tempShortCode)
        ];
      });
    } catch (err) {
      setError(err.message);
      
      setUrls(prev => prev.filter(url => url.shortCode !== tempShortCode));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Réducteur d'URL</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, width: '100%' }}>
          <input
            type="url"
            placeholder="Collez votre URL longue ici..."
            value={longUrl}
            onChange={e => setLongUrl(e.target.value)}
            required
            style={{ padding: 8, width: '100%', marginBottom: 12, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '8px 24px', borderRadius: 4, border: 'none', background: '#007bff', color: 'white', fontWeight: 'bold' }}>
            {loading ? 'Raccourcissement...' : 'Raccourcir'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        {shortUrl && (
          <div style={{ marginTop: 24 }}>
            <strong>Votre URL raccourcie :</strong>
            <div>
              <a href={originalUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            </div>
          </div>
        )}
      </header>
      <div style={{ marginTop: 40 }}>
        <strong>Historique de vos URLs raccourcies :</strong>
        {urls.length === 0 ? (
          <div>Aucun lien raccourci pour l'instant.</div>
        ) : (
          <ul>
            {urls.map((item) => (
              <li key={item.shortCode}>
                <a href={item.originalUrl} target="_blank" rel="noopener noreferrer">{item.shortUrl}</a>
              </li>
            ))} 
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
