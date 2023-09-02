import { useEffect } from "react";
import Post from "../Post/Post";
import User from "../User/User";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, postsOfFollowing } from "../../Redux/Actions/User";
import Loader from "../Loader/Loader";
import { Typography } from "@mui/material";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, posts } = useSelector((state) => state.postsOfFollowing);
  const { users, loading: userLoading } = useSelector(
    (state) => state.allUsers
  );

  useEffect(() => {
    dispatch(postsOfFollowing());
    dispatch(getAllUsers());
  }, []);
  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="home">
      <div className="homeleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={
                "https://media.istockphoto.com/id/1267019828/photo/blank-billboard-outdoor-easy-png.jpg?s=1024x1024&w=is&k=20&c=qGRm6Idr_0M5nT5fdnPi4IpqA2XxWVxOztnbiSgxBXE="
              }
              likes={post.likes}
              comments={post.comments}
              //   ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
            />
          ))
        ) : (
          <Typography variant="h6">No Posts yet</Typography>
        )}
      </div>
      <div className="homeright">
        {users && users.length > 0 ? (
          users.map((user) => (
            <User
              key={user._id}
              userId={user._id}
              name={user.name}
              //   avatar={user.avatar.url}
            />
          ))
        ) : (
          <Typography variant="h6">No Posts yet</Typography>
        )}
      </div>
    </div>
  );
};

export default Home;
