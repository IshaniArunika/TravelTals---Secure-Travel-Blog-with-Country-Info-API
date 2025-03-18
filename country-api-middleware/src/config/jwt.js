// implement jwt authontication here

const jwt = require('jsonwebtoken');
require('dotenv').config();

// secreat key
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

//genarate jwt token
const generateToken = (user)=>{
    return jwt.sign(
        {id:user.id,email:user.email},// data inside token -payload
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
    )
}

const verifyToken = (token)=>{
    try{
        return jwt.verify(token,JWT_SECRET)
    }catch (error) {
        return null;  // return null if token is invalid or expired
    }
}

module.exports = { generateToken, verifyToken };