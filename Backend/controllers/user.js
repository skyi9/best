const Post = require('../models/Post');
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
        res.cookie('token', token, {
            secure: false,
            httpOnly: true,
            withCredentials: true,
            sameSite: "Lax",
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
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
        res.cookie('token', token, {
            secure: false,
            httpOnly: true,
            withCredentials: true,
            sameSite: "Lax",
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
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

exports.logout = async (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
            .json({
                success: true,
                message: "Logged out",
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        if (!userToFollow) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        if (loggedInUser.following.includes(userToFollow._id)) {
            const userToFollowIdx = loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(userToFollowIdx, 1);
            await loggedInUser.save();
            const loggedInUserIdx = userToFollow.followers.indexOf(loggedInUser._id);
            userToFollow.followers.splice(loggedInUserIdx, 1);
            await userToFollow.save();

            res.status(200).json({
                success: true,
                message: "user unfollowed"
            })
        } else {
            loggedInUser.following.push(userToFollow._id);
            await loggedInUser.save();
            userToFollow.followers.push(loggedInUser._id);
            await userToFollow.save();
            res.status(200).json({
                success: false,
                message: "user followed"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "password cannot be empty"
            })
        }
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "incorrect password"
            })
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "password updated"
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email, avatar } = req.body;
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: "profile updated"
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
}

exports.deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        await user.deleteOne();
        // Logout user after deleting profile
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        // Delete all posts of the user
        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await post.remove();
        }
        // Removing User from Followers Following
        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i]);
            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
        }
        // Removing User from Following's Followers
        for (let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i]);
            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);
            await follows.save();
        }
        // removing all comments of the user from all posts
        const allPosts = await Post.find();
        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id);

            for (let j = 0; j < post.comments.length; j++) {
                if (post.comments[j].user === userId) {
                    post.comments.splice(j, 1);
                }
            }
            await post.save();
        }
        // removing all likes of the user from all posts
        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id);
            for (let j = 0; j < post.likes.length; j++) {
                if (post.likes[j] === userId) {
                    post.likes.splice(j, 1);
                }
            }
            await post.save();
        }
        res.status(200).json({
            success: true,
            message: "Profile Deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "posts followers following"
        );

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate(
            "posts followers following"
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};