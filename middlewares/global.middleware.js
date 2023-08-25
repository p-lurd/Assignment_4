const fs = require('fs')
const path = require('path');
const { usersDetailsPath } = require('../utilities');


const usersList = fs.readFileSync(usersDetailsPath);
const parsedUsersList = JSON.parse(usersList)






// -----------------to authenticate user-------------
const apiKeyAuth = (req, res, next) => {
    const authHeader = req.headers;

    if (!authHeader.api_key) {
        return res.status(401).json({ message: 'You are not authenticated!' });
    }

    const existingUser = parsedUsersList.find(parsedUsersList => parsedUsersList.api_key === authHeader.api_key)
    if (existingUser) {
        req.user = existingUser
        next();
    } else {
        return res.status(401).json({ message: 'You are not authenticated!' });
    }
}



const validateUserCreation = (req, res, next) => {

}


// --------------------to check if it is an admin-------------
const checkAdmin = (req, res, next) => {
    if (req.user.level !== 'ordinaryUser admin') {
        return res.status(403).json({ message: 'You are not authorized!' });
    }

    next()
}


module.exports = {
    apiKeyAuth,
    validateUserCreation,
    checkAdmin
}