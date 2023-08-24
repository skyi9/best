const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            })
        }
        user = await User.create({
            name,
            email,
            password,
            avatar: { public_id: "public-id", url: "url" }
        })
        const token = await user.generateToken();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        })
        res.status(201).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user doesn't exists"
            })
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "password is not correct"
            })
        }
        const token = await user.generateToken();
        res.cookie("token", JSON.stringify(token), {
            secure: true,
            httpOnly: true,
            withCredentials: true,
            sameSite: "None",
        })
        res.status(201).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
}
