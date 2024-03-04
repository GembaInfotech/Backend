import jwt from "jsonwebtoken";

const generateToken = (id) =>{
    return jwt.sign({id}, "mysecret", {expiresIn: "3d"});
}

export {generateToken};