require('dotenv').config()
const jwt = require('jsonwebtoken')
let map = new Map()

const createNewtoken = (user)=>{
    const token = jwt.sign(user,process.env.SECRET_KEY,{
        expiresIn: 10800
    })
    map.set(user.email_id,token)
    return token
}

// const destroyToken = (token)=>{
//     jwt.destroy(token)
// }

const verifyToken = (token,email_id)=>{
    let validity = false
    jwt.verify(token,process.env.SECRET_KEY,(err,res)=>{
        if(err){
            validity = false
        }else if(map.get(email_id) === token){
            validity = true
        }
    })
    return validity
}


module.exports = {
    createNewtoken,
    verifyToken
}