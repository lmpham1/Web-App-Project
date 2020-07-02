const express = require("express");
const cors = require("cors");
const path = require("path");

const scraper = require("./scraper.js");

const app = express();

const HTTP_PORT = process.env.port || 8080;

app.use(cors());

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/api/songs", (req, res) =>{
    scraper.songsGetAll().then(results => res.json(results))
    .catch(error => console.log(error));
})

app.get("/api/songs/:name", (req, res) =>{
    console.log(req.params.name);
    scraper.songsGetByName(req.params.name).then(results => res.json(results)).catch(error => console.log(error));
})

app.listen(HTTP_PORT, ()=> {
    console.log("Listening on port 8080...");
    scraper.initialize();
});
