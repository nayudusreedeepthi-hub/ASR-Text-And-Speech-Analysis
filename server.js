const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

// Serve frontend files
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`ASR server running at http://localhost:${PORT}`);
});