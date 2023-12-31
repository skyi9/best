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

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "post not found",
            });
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "unAuthorized"
            })
        }
        await post.deleteOne();
        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        await user.save();
        res.status(200).json({
            success: true,
            message: "post deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "post not found",
            });
        }

        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);

            post.likes.splice(index, 1);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "post Unliked",
            });
        } else {
            post.likes.push(req.user._id);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "post Liked",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getPostsOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        console.log(user.following);
        const posts = await Post.find({
            owner: {
                $in: user.following
            }
        }).populate("owner likes comments.user");

        res.status(200).json({
            success: true,
            posts: posts.reverse()
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "post not found"
            })
        }
        if (req.user._id.toString() !== post.owner.toString()) {
            return res.status(400).json({
                success: false,
                message: "unAuthorized"
            })
        }
        post.caption = req.body.caption;
        await post.save();
        res.status(200).json({
            success: true,
            message: "caption updated"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "post not found"
            })
        }
        post.comments.push({
            user: req.user._id,
            comment: req.body.comment
        });
        await post.save();
        res.status(200).json({
            success: true,
            message: "comment added"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        // Checking If owner wants to delete
        if (post.owner.toString() === req.user._id.toString()) {
            if (req.body.commentId === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Comment Id is required",
                });
            }
            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(index, 1);
                }
            });
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Selected Comment has deleted",
            });
        } else {
            post.comments.forEach((item, index) => {
                if (item.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(index, 1);
                }
            });
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Your Comment has deleted",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}