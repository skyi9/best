const User = require('../models/User');
import { verify } from "jsonwebtoken";

export async function isAuthenticated(req, res, next) {

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "please login first"
        })
    }
    const decoded = await verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne(decoded._id);
    next();
}