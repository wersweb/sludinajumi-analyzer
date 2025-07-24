const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Statiskie faili
app.use(express.static(path.join(__dirname, 'public')));

// Maršruts datu iegūšanai
app.post('/analyze', async (req, res) => {
  try {
    console.log('➡️ Sākam sludinājumu iegūšanu no ss.com...');

    const response = await axios.get('https://www.ss.com/lv/real-estate/flats/riga/center/', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'lv,en;q=0.9',
      }
    });

    const $ = cheerio.load(response.data);
    const listings = [];

    $('tr[id^=tr_]').each((i, el) => {
      if (i >= 5) return false; // Tikai pirmie 5 sludinājumi

      const title = $(el).find('.msga2-o').eq(1).text().trim();
      const location = $(el).find('.msga2-o').eq(3).text().trim();
      const price = $(el).find('.msga2-o').last().text().trim();

      listings.push({
        title: title || 'Nav nosaukuma',
        location: location || 'Nezināma vieta',
        price: price || 'Nav cenas',
        phone: '—' // Telefons nav redzams bez ieiešanas sludinājumā
      });
    });

    console.log('✅ Sludinājumi iegūti:', listings.length);
    res.json({ listings });

  } catch (err) {
    console.error('❌ Kļūda pieprasot ss.com:', err.message);
    res.status(500).json({ error: 'Neizdevās iegūt sludinājumus' });
  }
});

// Startē serveri
app.listen(PORT, () => {
  console.log(`🚀 Serveris darbojas: http://localhost:${PORT}`);
});
