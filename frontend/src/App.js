import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


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
      setLongUrl('');
    } catch (err) {
      setError(err.message);

      setUrls(prev => prev.filter(url => url.shortCode !== tempShortCode));
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          URL Shortener
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            type="url"
            label="Paste your long URL here..."
            value={longUrl}
            onChange={e => setLongUrl(e.target.value)}
            required
            variant="outlined"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} size="large">
            {loading ? 'Shortening...' : 'Shorten'}
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {shortUrl && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Your shortened URL:
            </Typography>
            <Button
              onClick={async () => {
                try {
                  const res = await fetch(`http://localhost:3001/api/url/${shortUrl.split('/').pop()}`);
                  if (!res.ok) throw new Error('Short URL not found');
                  const data = await res.json();
                  window.location.href = data.originalUrl;
                } catch (err) {
                  alert(err.message);
                }
              }}
              variant="contained"
              color="secondary"
              sx={{ fontWeight: 'bold', fontSize: 18 }}
            >
              {shortUrl}
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Your shortened URLs history:
        </Typography>
        {urls.length === 0 ? (
          <Typography color="text.secondary">No shortened links yet.</Typography>
        ) : (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <List>
              {urls.map((item, idx) => (
                <React.Fragment key={item.shortCode}>
                  <ListItem sx={{ justifyContent: 'center' }}>
                    <ListItemText
                      sx={{ display: 'flex', justifyContent: 'center' }}
                      primary={
                        <Button
                          onClick={async () => {
                            try {
                              const res = await fetch(`http://localhost:3001/api/url/${item.shortCode}`);
                              if (!res.ok) throw new Error('Short URL not found');
                              const data = await res.json();
                              window.location.href = data.originalUrl;
                            } catch (err) {
                              alert(err.message);
                            }
                          }}
                          variant="text"
                          sx={{ color: 'primary.main', textTransform: 'none', fontWeight: 'bold' }}
                        >
                          {item.shortUrl}
                        </Button>
                      }
                    />
                  </ListItem>
                  {idx < urls.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
