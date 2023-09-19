const fs = require("fs");
const path = require("path");
const db = path.join(__dirname, "db", "items.json")
const items = [];

//-------------To create item---------------------
function postItem(req, res, next) {
  try {
    const bodyOfRequest = req.body;
    // console.log(bodyOfRequest);
    if (!bodyOfRequest.name || !bodyOfRequest.price || !bodyOfRequest.size) {
      const badRequestError = new Error("name, price & size are required, kindly fill correctly");
      badRequestError.status = 400;
      throw badRequestError;
    }
    items.push({
      ...bodyOfRequest,
      id: Math.floor(Math.random() * 500).toString(),
    });
    fs.writeFileSync(
      db,
      JSON.stringify(items, null, 2)
    );
    res.status(201).json(items)
  } catch (error) {
    next(error)
  }

}



// ------------------To get all items-----------------------
function getItems(req, res, next) {
  try {
    const data = fs.readFileSync(db);
    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
  } catch (error) {
    next(error)
  }

}




// ---------------To get one item----------------------
function getOneItem(req, res, next) {
  try {
    const id = req.params.id
    const dbData = fs.readFileSync(db);
    const data = JSON.parse(dbData)
    const itemIndex = data.findIndex((data) => data.id === id)
    if (itemIndex === -1) {
      const notFoundError = new Error("Item not found");
      notFoundError.status = 404;
      throw notFoundError;
    }
    const item = data[itemIndex]
    res.status(200).json(item)
    console.log(item)
  } catch (error) {
    next(error)
  }

}



// -----------------To update an item---------------
function updateItem(req, res, next) {
  try {
    const itemUpdate = req.body
    const id = req.params.id
    const objectKeys = Object.keys(itemUpdate)
    const allowedKeys = ["name", "price", "size"]
    const isValidOperation = objectKeys.every((update) => {
      return allowedKeys.includes(update);
    });
    if (!isValidOperation) {
      const badRequestError = new Error("The operation you're trying to perform is not valid");
      badRequestError.status = 400;
      throw badRequestError;
    }
    const dbItems = fs.readFileSync(db)
    const parsedBody = JSON.parse(dbItems)
    const itemIndex = parsedBody.findIndex((data) => data.id === id)
    if (itemIndex === -1) {
      const notFoundError = new Error("Item not found");
      notFoundError.status = 404;
      throw notFoundError;
    }


    const item = { ...parsedBody[itemIndex], ...itemUpdate }
    parsedBody[itemIndex] = item
    fs.writeFileSync(db, JSON.stringify(parsedBody, null, 2),
      function (err) {
        if (err) {
          throw err;
        } else {
          console.log("written successfully");
        }
      })
    res.status(200).json(parsedBody)
  } catch (error) {
    next(error)
  }

}




// ---------------- To delete an item----------------
function deleteItem(req, res, next) {
  try {
    const id = req.params.id
    const dbItems = fs.readFileSync(db)
    const data = JSON.parse(dbItems)
    const itemIndex = data.findIndex((item) => item.id === id)
    if (itemIndex === -1) {
      const notFoundError = new Error("Item not found");
      notFoundError.status = 404;
      throw notFoundError;
    }
    data.splice(itemIndex, 1)
    fs.writeFileSync(db, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        throw err;
      } else {
        console.log("deleted succesfully")
      }
    })
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }

}

module.exports = {
  postItem,
  getItems,
  getOneItem,
  updateItem,
  deleteItem

};