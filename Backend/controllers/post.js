const Post = require("../models/Post");
const User = require("../models/User");


exports.createPost = async (req, res) => {
    try {
        const newPostData = {
            image: {
                public_id: "public_id",
                url: "url",
            },
            caption: req.body.caption,
            owner: req.user._id
        }
        const newPost = await Post.create(newPostData);
        const user = await User.findById(req.user._id);
        user.posts.push(newPost._id);
        await user.save();
        res.status(200).json({
            success: true,
            post: newPost
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}