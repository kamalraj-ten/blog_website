const express = require("express");
const path = require("path");
const Database = require("./database");

Database.getTime();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT);

app.use(express.static(path.join(__dirname, "public")));
