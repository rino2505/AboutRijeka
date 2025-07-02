const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const path = require("path");

const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'projekt')));


app.get("/vrijemes", async (req, res) => {
    try {
        const response = await axios.get('https://vrijeme.hr/hrvatska_n.xml', { responseType: "text" });
        const xmlData = response.data;

        xml2js.parseString(xmlData, (err, result) => {
            if (err) return res.status(500).send("Greška u parsiranju podataka");

            const gradovi = result.Hrvatska.Grad;
            const rijeka = gradovi.find(g => g.GradIme[0].toLowerCase() === 'rijeka');

            if (!rijeka) return res.status(404).send(`Grad "Rijeka" nije pronađen.`);

            const podaci = rijeka.Podatci[0];
            const temperatura = podaci.Temp[0];
            const vlaga = podaci.Vlaga[0];
            const tlak = podaci.Tlak[0];
            const opis = podaci.Vrijeme?.[0] ?? "Nepoznato"; 

            res.json({ temperatura, vlaga, tlak, opis });
        });
    } catch (error) {
        console.error("Greška:", error);
        res.status(500).send("Greška kod dohvata podataka");
    }
});

app.listen(port, () => {
    console.log(`Server radi na http://localhost:${port}`);
});

