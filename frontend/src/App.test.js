import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.resetAllMocks();
});

describe('URL Shortener Frontend', () => {
  beforeAll(() => {
    window.alert = jest.fn();
    window.open = jest.fn();
  });
  beforeEach(() => {
    process.env.REACT_APP_API_URL = '/api/url';
    fetch.mockImplementation((url, opts) => {
      if (opts && opts.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            shortUrl: 'http://localhost:3001/api/url/abc123',
            shortCode: 'abc123',
            originalUrl: 'https://example.com'
          })
        });
      }
      // GET or other fetches
      return Promise.resolve({
        ok: true,
        json: async () => ([]),
      });
    });
  });

  afterEach(() => {
    fetch.mockReset();
  });
  test('renders input and submit button', () => {
    render(<App />);
    expect(screen.getByLabelText(/paste your long url here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument();
  });

  test('creates a short URL and displays it', async () => {
    // Mock POST response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shortUrl: 'http://localhost:3001/api/url/abc123', shortCode: 'abc123', originalUrl: 'https://example.com' })
    });
    render(<App />);
    const input = screen.getByLabelText(/paste your long url here/i);
    const button = screen.getByRole('button', { name: /shorten/i });
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/url'),
      expect.objectContaining({ method: 'POST' })
    );
    const btn = await screen.findByRole('button', { name: /http:\/\/localhost:3001\/api\/url\/abc123/i });
    expect(btn).toBeInTheDocument();
  });

  test('redirects to original URL when clicking short URL button', async () => {
    render(<App />);
    const input = screen.getByLabelText(/paste your long url here/i);
    const button = screen.getByRole('button', { name: /shorten/i });
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);
    const btn = await screen.findByRole('button', { name: /http:\/\/localhost:3001\/api\/url\/abc123/i });
    expect(btn).toBeInTheDocument();

    // Mock GET /api/url/abc123
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ originalUrl: 'https://example.com' })
    });
    const shortUrlButton = screen.getByRole('button', { name: /http:\/\/localhost:3001\/api\/url\/abc123/i });
    expect(shortUrlButton).toBeInTheDocument();
    fireEvent.click(shortUrlButton);
    await waitFor(() => expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank'));
  });

  test('shows error if backend returns error on short URL click', async () => {
    render(<App />);
    const input = screen.getByLabelText(/paste your long url here/i);
    const button = screen.getByRole('button', { name: /shorten/i });
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);
    const btn = await screen.findByRole('button', { name: /http:\/\/localhost:3001\/api\/url\/abc123/i });
    expect(btn).toBeInTheDocument();

    fetch.mockResolvedValueOnce({ ok: false });
    const shortUrlButton = screen.getByRole('button', { name: /http:\/\/localhost:3001\/api\/url\/abc123/i });
    expect(shortUrlButton).toBeInTheDocument();
    fireEvent.click(shortUrlButton);
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Short URL not found'));
  });
});
