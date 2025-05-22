import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FaReply, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
const Comment = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [imagePreview] = useState("https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [replies, setReplies] = useState({});

  // Fetch comments with author names
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:9000/api/v2/approveComment");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const commentsData = await response.json();
      const commentsWithAuthors = await Promise.all(
        commentsData.map(async comment => {
          try {
            const nameResponse = await fetch(`http://localhost:9000/api/v2/GetNameApprenant/${comment.id}`);
            const fullname = nameResponse.ok ? await nameResponse.text() : 'Anonymous';
            return { ...comment, fullname };
          } catch (error) {
            console.error('Error fetching author name:', error);
            return { ...comment, fullname: 'Anonymous' };
          }
        })
      );
      
      setComments(commentsWithAuthors);
      await fetchInitialReplies(commentsWithAuthors.map(c => c.id));
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial replies for comments
  const fetchInitialReplies = async (commentIds) => {
    try {
      const repliesData = await Promise.all(
        commentIds.map(async id => {
          const response = await fetch(`http://localhost:9000/api/v2/replies/comment/${id}`);
          if (!response.ok) return [];
          
          const replies = await response.json();
          return replies.map(reply => ({
            ...reply,
            fullname: reply.internote?.fullname || 'Anonymous',
            image: reply.internote?.image || imagePreview
          }));
        })
      );
      
      const repliesMap = {};
      commentIds.forEach((id, index) => {
        repliesMap[id] = repliesData[index];
      });
      
      setReplies(repliesMap);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };
  // Handle reply button click
  const handleReplyClick = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText("");
  };

  // Handle reply submission
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const decodedToken = jwtDecode(token);
      const authorId = decodedToken.sub;
      
      const response = await fetch(`http://localhost:9000/api/v2/replies/${commentId}/${authorId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add auth token to headers if needed
        },
        body: JSON.stringify({
          message: replyText // Only send the message as your backend expects
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to post reply");
      }
  
      // Refresh replies for this comment
      const updatedReplies = await fetch(`http://localhost:9000/api/v2/replies/comment/${commentId}`, {
        headers: {
          "Authorization": `Bearer ${token}` // Include token if needed
        }
      }).then(res => res.json());
      
      setReplies(prev => ({ ...prev, [commentId]: updatedReplies }));
      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error("Error posting reply:", error);
      setError(error.message);
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) return <div className="p-4 sm:ml-64">Loading comments...</div>;
  if (error) return <div className="p-4 sm:ml-64 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 bg-white sm:ml-64" style={{fontFamily:"Montserrat, sans-serif"}}>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6 ">Community</h1>
        
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 rounded-lg shadow-md">
                <div className="flex gap-3">
                  <img src={comment.image || imagePreview} alt="User" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{comment.fullname}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.date).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-400">{comment.message}</p>
                    
                    <div className="flex gap-4 mt-2 text-sm text-gray-400">
                      <button className="flex items-center gap-1 hover:text-blue-400">
                        <FaThumbsUp />
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-400">
                        <FaThumbsDown />
                      </button>
                      <button 
                        className="flex items-center gap-1 hover:text-gray-600"
                        onClick={() => handleReplyClick(comment.id)}
                      >
                        <FaReply /> Reply
                      </button>
                      {replies[comment.id]?.length > 0 && (
                        <button 
                          className="text-blue-500 hover:underline"
                          onClick={() => toggleReplies(comment.id)}
                        >
                          {showReplies[comment.id] ? 'Hide replies' : `Show replies (${replies[comment.id].length})`}
                        </button>
                      )}
                    </div>

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 flex gap-2">
                        <img src={imagePreview} alt="You" className="w-8 h-8 mt-1 rounded-full" />
                        <div className="flex-1">
                          <textarea
                            className="w-full p-2 border rounded-lg text-sm"
                            rows="2"
                            placeholder="Write your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="flex justify-end gap-2 mt-1">
                            <button 
                              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancel
                            </button>
                            <button 
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                              onClick={() => handleReplySubmit(comment.id)}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies list */}
                    {showReplies[comment.id] && replies[comment.id]?.length > 0 && (
                      <div className="mt-3 border-l-2 border-gray-200 pl-4">
                        {replies[comment.id].map(reply => (
                          <div key={reply.id} className="flex gap-3 py-3">
                            <img 
                              src={reply.internote?.image || imagePreview} 
                              alt="Replier" 
                              className="w-8 h-8 rounded-full" 
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">
                                  {reply.fullname || 'Anonymous'}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(reply.date).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-1 text-sm">{reply.message}</p>
                              <div className="flex gap-4 mt-1 text-xs text-gray-400">
                                <button className="flex items-center gap-1 hover:text-blue-400">
                                  <FaThumbsUp size={12} />
                                </button>
                                <button className="flex items-center gap-1 hover:text-red-400">
                                  <FaThumbsDown size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Comment
