const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { createPost, likeAndUnlikePost, deletePost, getPostsOfFollowing, updateCaption, addComment, deleteComment } = require("../controllers/post");
const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);
router.route("/post/:id")
    .get(isAuthenticated, likeAndUnlikePost)
    .delete(isAuthenticated, deletePost)
    .put(isAuthenticated, updateCaption);

router.route("/posts").get(isAuthenticated, getPostsOfFollowing);
router.route("/post/comment/:id").post(isAuthenticated, addComment)
    .delete(isAuthenticated, deleteComment)

module.exports = router;