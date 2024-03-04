import jwt from "jsonwebtoken";

const generateRefreshToken = (id) =>{
    return jwt.sign({id}, "mysecret", {expiresIn: "1d"});
}

export {generateRefreshToken};