import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Select only the images
        const imagePosts = data.filter((post) => post.image);
        setPosts(imagePosts);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const [likedPosts, setLikedPosts] = useState([]);

  const handleLike = (postId) => {
    // Toggle like status
    setLikedPosts((prevLikedPosts) => {
      if (prevLikedPosts.includes(postId)) {
        return prevLikedPosts.filter((id) => id !== postId);
      } else {
        return [...prevLikedPosts, postId];
      }
    });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="container mx-auto p-8 flex">
      <div className="flex flex-wrap">
        {posts.map((post) => (
          <div
            key={post.id}
            className="max-w-sm mx-auto bg-white shadow-md rounded-md overflow-hidden m-4 cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            </div>

            <div className="flex justify-end p-4">
              <button
                className={`text-red-500 ${likedPosts.includes(post.id) ? 'text-red-600' : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent post click event from firing
                  handleLike(post.id);
                }}
              >
                <FontAwesomeIcon icon={faHeart} size="lg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 ml-8">
        {selectedPost && (
          <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden">
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 object-cover" />
            
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{selectedPost.title}</h2>
              <p className="text-gray-700">{selectedPost.description}</p>
            </div>

            <div className="flex justify-end p-4">
              <button
                className={`text-red-500 ${likedPosts.includes(selectedPost.id) ? 'text-red-600' : ''}`}
                onClick={() => handleLike(selectedPost.id)}
              >
                <FontAwesomeIcon icon={faHeart} size="lg" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
