const fs = require("fs");
const path = require("path");
const utilities = require("../utilities");

const user = [];

// -----------To create user and admin--------------------
function createUser(req, res, next) {

  try {
    const bodyOfRequest = req.body;
    const username = bodyOfRequest.username;

    if (!bodyOfRequest.username || !bodyOfRequest.password) {
      const badRequestError = new Error("username & password are required, kindly fill correctly");
      badRequestError.status = 400;
      throw badRequestError;
    }

    const usernameDomain = username.split("@")[1];

    const users = fs.readFileSync(utilities.usersDetailsPath);
    const parsedUsers = JSON.parse(users);
    bodyOfRequest.api_key = `${bodyOfRequest.username}_${bodyOfRequest.password}`

    if (usernameDomain === "altschool.com") {
      const existedUsername = parsedUsers.find(
        (parsedUsers) => parsedUsers.username === username
      );

      if (existedUsername) {
        const duplicateUserError = Error("User already exists");
        duplicateUserError.status = 409;
        throw duplicateUserError;
      }

      user.push({ ...bodyOfRequest, level: "ordinaryUser admin" });

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
      res.status(201);
      res.send("admin created successfully");

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
      res.status(201);
      res.send("user created successfully");
    }
  } catch (error) {
    next(error)
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

