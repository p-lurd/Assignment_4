const express = require("express");
const fs = require("fs");
const path = require("path");
const { postItem,getItems, getOneItem, updateItem, deleteItem } = require("./controller");
const userController = require('./users/user.controller')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const homepagePath = path.join(__dirname, "public", "index.html");
const notFound = path.join(__dirname, "public", "404.html");
const db = path.join(__dirname, "db", "items.json")
const items = [];
const usersDetailsPath = path.join(__dirname, "db", "users.json")

const globalMiddlewares = require('./middlewares/global.middleware');



// -----------To create user and admin--------------------
app.post("/v1/user", userController.createUser);

// ----------------to authenticate user-----------------
app.use(globalMiddlewares.apiKeyAuth);


// -----------To login----------------------
// app.post('/v1/login', userController.login);

//-------------To create item---------------------
app.post("/v1/items",globalMiddlewares.checkAdmin, postItem);

// ------------------To get all items-----------------------
app.get('/v1/items', getItems)


// ---------------To get one item----------------------
app.get('/v1/items/:id', getOneItem)

// -----------------To update an item---------------
app.patch('/v1/items/:id',globalMiddlewares.checkAdmin, updateItem);


// ---------------- To delete an item----------------
app.delete('/v1/items/:id',globalMiddlewares.checkAdmin,deleteItem);


app.use((error, req, res, next) => {
  if (error.status == 404) return res.status(404).sendFile(notFound);
  res.status(error.status ?? 500)
  res.send(error.message)
})


app.listen(3001, () => {
  console.log("Hello");
});
