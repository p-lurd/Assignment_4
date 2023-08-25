const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const homepagePath = path.join(__dirname, "public", "index.html");
const notFound = path.join(__dirname, "public", "404.html");
const db = path.join(__dirname, "db", "items.json")


// ------------navigate to “/index.html”, I should see a simple webpage of the student-----------
app.get("/", (req, res) => {
    res.status(200).sendFile(homepagePath);
  });






  //-------------- when I navigate to “{random}.html” it should return with a 404 page-----------------
app.get("*", (req, res) => {
    res.status(404).sendFile(notFound);
  });


  

app.listen(3001, () => {
  console.log("Hello");
});