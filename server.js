const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servē statiskos failus no public mapes
app.use(express.static('public'));

// Mājas lapa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Startē serveri
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
