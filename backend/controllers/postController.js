import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error: " + error.message);
  }
};

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "Postedby and text fields are required" });
    }

    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();
    res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error: " + error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to delete post" });
    }

    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error: " + error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      return res.status(200).json({ message: "Post unliked successfully" });
    }
    // Like post
    post.likes.push(userId);
    await post.save();
    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error: " + error.message);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();

    res.status(200).json({ message: "Reply added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error: " + error.message);
  }
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost };
