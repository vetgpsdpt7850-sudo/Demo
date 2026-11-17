import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Proxy route for Adsun GPS Tracking API
app.get('/api/gps', async (req, res) => {
  try {
    const pageIds = (req.query.pageIds as string) || '6208';
    const username = (req.query.username as string) || 'vetadmin';
    const pwd = (req.query.pwd as string) || '12345';

    const targetUrl = `https://shareapi.adsun.vn/Vehicle/GpsInfos?pageIds=${encodeURIComponent(
      pageIds
    )}&username=${encodeURIComponent(username)}&pwd=${encodeURIComponent(pwd)}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 BusPad-Kiosk'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Remote API responded with status ${response.status}`,
        status: response.status
      });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.json(data);
  } catch (err: any) {
    console.error('GPS Proxy Error:', err.message);
    return res.status(500).json({
      error: 'Failed to fetch GPS data from Adsun API',
      message: err.message
    });
  }
});

// Serve frontend build in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BusPad GPS server running on http://0.0.0.0:${PORT}`);
});
