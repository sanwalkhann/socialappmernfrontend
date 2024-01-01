import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

const LoadingSpinner = () => (
  <div className="text-center mt-4">
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const Post = ({ user, setuser }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (hovered) => {
    setIsHovered(hovered);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("url params..", urlParams);
    if (urlParams.get("email")) {
      const email = urlParams.get("email");
      const username = urlParams.get("name");
      const user = {email, username: username}
      setuser(user)
    }
    const userDataFromCookie = Cookies.get("user");
    if (userDataFromCookie) {
      const userFromCookie = JSON.parse(userDataFromCookie);
      setuser(userFromCookie);
    }

    fetch("https://fakestoreapi.com/products/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const imagePosts = data.filter((post) => post.image);
        setPosts(imagePosts);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, [setuser]);

  useEffect(() => {
    if (selectedPost) {
      fetchLikes(selectedPost.id);
    }
  }, [selectedPost]);

  const fetchLikes = async (postId) => {
    try {
      setLoadingLikes(true);
      const response = await fetch(`http://localhost:3500/${postId}/like`);
      if (!response.ok) {
        throw new Error("Failed to fetch likes");
      }
      const data = await response.json();
      setLikes(data.likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      setLikedPosts((prevLikedPosts) => {
        if (prevLikedPosts.includes(postId)) {
          return prevLikedPosts.filter((id) => id !== postId);
        } else {
          return [...prevLikedPosts, postId];
        }
      });

      const localstorageToken = localStorage.getItem("token");
      console.log(localstorageToken);

      const response = await fetch(`http://localhost:3500/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localstorageToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like on the server");
      }
      await fetchLikes(postId);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setuser(null);
    window.location.href = "/";
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="container mx-auto px-8  flex">
      {/* Left Panel - User Information */}
      <div className="flex flex-col w-1/4 pr-4 mt-8">
        {user ? (
          <div className="mb-auto">
            <div className="flex items-center mb-4">
              <img
                src={"../assets/profile.jpg"}
                alt="User Avatar"
                className="w-12 h-12 rounded-full mr-2"
              />
              <div>
                <p className="font-bold text-xl">
                  {user.username || user.email}
                </p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
            </button>
          </div>
        ) : (
          <p>Please log in to view user information.</p>
        )}
      </div>

      {/* Center Panel - */}
      <div className="flex-1 overflow-y-auto max-h-screen ">
        <div className="flex w-full flex-col">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`max-w-sm mx-auto bg-white border-2 p-4 border-black shadow-md rounded-md overflow-hidden m-4 cursor-pointer relative ${
                isHovered ? "hovered-style" : ""
              }`}
              onMouseEnter={() => handleHover(true)}
              onMouseLeave={() => handleHover(false)}
            >
              <div
                className="aspect-w-16 aspect-h-9"
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-md transition-transform transform hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Selected Information */}
      <div className="w-1/4 pl-4 flex flex-col mt-8">
        {selectedPost && (
          <div className="w-full mx-auto bg-white shadow-md rounded-md overflow-hidden h-full overflow-y-auto">
            <div className="p-4 w-[80%] flex-grow">
              <h2 className="text-xl font-bold mb-2">{selectedPost.title}</h2>
              <p className="text-gray-700">Price: ${selectedPost.price}</p>
            </div>
            <div className="flex justify-end p-4">
              <button
                className={`text-red-500 ${
                  likedPosts.includes(selectedPost.id) ? "text-red-600" : ""
                }`}
                onClick={() => handleLike(selectedPost.id)}
                disabled={loadingLikes}
              >
                <FontAwesomeIcon icon={faHeart} size="lg" />
              </button>
              <span className="ml-2">
                {loadingLikes ? (
                  <LoadingSpinner />
                ) : (
                  `${
                    likes.productId === selectedPost.id ? likes.likesCount : "0"
                  } likes`
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
