const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyze', async (req, res) => {
  try {
    const response = await axios.get('https://www.ss.com/lv/real-estate/flats/riga/center/', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'lv,en;q=0.9',
      }
    });

    const $ = cheerio.load(response.data);
    const listings = [];

    $('tr[id^=tr_]').each((i, el) => {
      if (i >= 5) return; // Tikai 5 sludinājumi
      const title = $(el).find('.msga2-o').eq(1).text().trim();
      const location = $(el).find('.msga2-o').eq(3).text().trim();
      const price = $(el).find('.msga2-o').last().text().trim();

      listings.push({
        title: title || 'Nav nosaukuma',
        location: location || 'Nezināma vieta',
        price: price || 'Nav cenas',
        phone: null
      });
    });

    res.json({ listings });
  } catch (err) {
    console.error('Scraping kļūda:', err.message);
    res.status(500).json({ error: 'Neizdevās iegūt datus no ss.com' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveris strādā: http://localhost:${PORT}`);
});
