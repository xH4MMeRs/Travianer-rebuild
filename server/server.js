const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
const DATA_FILE = './data/player.json';

// Spieler laden
app.get('/api/player', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE);
        res.json(JSON.parse(data));
    } else {
        // Standardwerte, falls noch kein Spielstand existiert
        res.json({
            name: "Neuer Römer",
            x: 500, y: 300,
            resources: { holz: 100, lehm: 100, eisen: 100, getreide: 50 },
            level: 1
        });
    }
});

// Spieler speichern (Jede Aktion)
app.post('/api/save', (req, res) => {
    const playerData = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(playerData, null, 2));
    res.json({ status: "Erfolgreich gespeichert" });
});

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));