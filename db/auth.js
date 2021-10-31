require('dotenv').config()
const jwt = require('jsonwebtoken')
const NodeCache = require('node-cache')

const cache = new NodeCache()

const createToken = (user)=>{
    return jwt.sign(user,process.env.SECRET_KEY,{expiresIn :'1h'})
}

const verifyToken = (token)=>{
    let user;
    try {
        user = jwt.verify(token,process.env.SECRET_KEY)
    } catch (error) {
        user = null
    }
    if(user!=null && cache.get(token)!=null){
        user = null
    }
    return user;
}

const deleteToken = (token)=>{
    cache.set(token,'expired',3600)
}

module.exports = {
    createToken,
    verifyToken,
    deleteToken
}