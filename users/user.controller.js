const fs = require("fs");
const path = require("path");
const utilities = require("../utilities");

const user = [];

// -----------To create user and admin--------------------
function createUser(req, res) {
  const bodyOfRequest = req.body;
  const username = bodyOfRequest.username;

  const usernameDomain = username.split("@")[1];

  const users = fs.readFileSync(utilities.usersDetailsPath);
  const parsedUsers = JSON.parse(users);
  bodyOfRequest.api_key = `${bodyOfRequest.username}_${bodyOfRequest.password}`


  
  if (!bodyOfRequest.username || !bodyOfRequest.password) {
    res.send("username or password is required, kindly fill correctly");
    res.status(400);
    return;
  } else if (usernameDomain === "altschool.com") {
    const existedUsername = parsedUsers.find(
      (parsedUsers) => parsedUsers.username === username
    );
    
    if (!existedUsername) {
      
      user.push({ ...bodyOfRequest, level: "ordinaryUser admin"});

      fs.writeFileSync(
        utilities.usersDetailsPath,
        JSON.stringify(user, null, 2),
        function (err) {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log("admin created successfully");
          }
        }
      );
      res.send("admin created successfully");
      res.status(200);
    } else {
      res.send("user already exists");
      res.status(409);
    }
  } else {
    user.push({ ...bodyOfRequest, level: "ordinaryUser" });
    fs.writeFileSync(
      utilities.usersDetailsPath,
      JSON.stringify(user, null, 2),
      function (err) {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log("admin created successfully");
        }
      }
    );
    res.send("user created successfully");
    res.status(200);
  }
}

// function login(req, res) {
//   const { username, password } = req.body;
//   const users = require(utilities.usersDetailsPath);
//   const user = users.find(
//     users.username === username && users.password === password
//   );
// }

module.exports = {
  createUser
};
