require('dotenv').config()

const jwt = require('jsonwebtoken')

const createToken = (user)=>{
    return jwt.sign(user,process.env.SECRET_KEY,{expiresIn :'1h'})
}

const verifyToken = (token)=>{
    let user;
    try {
        user = jwt.verify(token,process.env.SECRET_KEY)
    } catch (error) {
        user = null;   
    }
    return user;
}

module.exports = {
    createToken,
    verifyToken
}