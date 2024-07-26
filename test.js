// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5501; // You can change the port number if needed

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
