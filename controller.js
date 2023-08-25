const fs = require("fs");
const path = require("path");
const db = path.join(__dirname, "db", "items.json")
const items = [];




//-------------To create item---------------------
function postItem(req, res){
    const bodyOfRequest = req.body;
    console.log(bodyOfRequest);
    if(!bodyOfRequest.name || !bodyOfRequest.price || !bodyOfRequest.size){
        res.status(400);
        return
    }
    items.push({
      ...bodyOfRequest,
      id: Math.floor(Math.random() * 500).toString(),
    });
    fs.writeFileSync(
      db,
      JSON.stringify(items, null, 2),
      function (err) {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log("written successfully");
        }
      }
    );
    console.log({ items });
    res.status(201).json(items)
}



// ------------------To get all items-----------------------
function getItems(req, res){
    const data = fs.readFileSync(db);
    const jsonData = JSON.parse(data);
    res.status(201).json(jsonData);
}




// ---------------To get one item----------------------
function getOneItem(req, res){
    const id = req.params.id
    const dbData = fs.readFileSync(db);
    const data = JSON.parse(dbData)
    const itemIndex = data.findIndex((data)=> data.id === id)
    if (itemIndex === -1){
        res.status(400)
        console.log("item not found")
    }
    const item = data[itemIndex]
    res.status(200).json(item)
    console.log(item)
}



// -----------------To update an item---------------
function updateItem(req, res){
    const itemUpdate = req.body
    const id = req.params.id
    const objectKeys = Object.keys(itemUpdate)
    const allowedKeys = ["name", "price", "size"]
    const isValidOperation = objectKeys.every((update) => {
        return allowedKeys.includes(update);
    });
    if (!isValidOperation){
        res.status(400)
        return
    }
    const dbItems = fs.readFileSync(db)
    const parsedBody = JSON.parse(dbItems)
    const itemIndex = parsedBody.findIndex((data)=> data.id === id)
    if (itemIndex === -1){
        res.status(400)
        console.log("item not found")
    }
    
    
    const item = {...parsedBody[itemIndex], ...itemUpdate}
    parsedBody[itemIndex] = item
    fs.writeFileSync(db, JSON.stringify(parsedBody, null, 2),
    function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("written successfully");
      }
    } )
    res.status(200).json(parsedBody)
}




// ---------------- To delete an item----------------
function deleteItem(req, res){
    const id = req.params.id
    const dbItems = fs.readFileSync(db)
    const data = JSON.parse(dbItems)
    const itemIndex = data.findIndex((item)=>item.id === id)
    if (itemIndex === -1){
        res.status(404)
        console.log("item does not exist")
        return
    }
    data.splice(itemIndex, 1)
    fs.writeFileSync(db, JSON.stringify(data, null, 2), (err)=>{
        if (err) {
            console.log(err);
            return
        } else{
            console.log("deleted succesfully")
        }
    })
    res.status(200).json(data)
}






module.exports = {
    postItem,
    getItems,
    getOneItem,
    updateItem,
    deleteItem
    
};