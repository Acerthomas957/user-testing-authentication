const CustomError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(new CustomError("Please login to access this resourse", 403));
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        return next(new CustomError("Please login to access this resourse", 403));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if(!decoded) {
        return next(new CustomError("Token is not valid", 403));
    }

    const user = await UserModel.findById(decoded.id);
    if(!user) {
        return next(new CustomError("Please login to access this resourse", 403));
    }
    req.user = user;
    next();
};

const authorizeRoles = (roles) => { // roles = [0, 1]
    return(req, res, next) => {
        if(!roles.includes(req.user?.role)) {
            return next(new CustomError(`Role: ${req.user?.role} is not allowed to access this resourse`, 403));
        }
        next();
    }
}

module.exports = { isAuthenticated, authorizeRoles };