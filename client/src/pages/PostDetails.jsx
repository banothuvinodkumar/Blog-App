import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, User, Clock, MessageSquare, Send, Edit, Trash2, Heart, Share2, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const PostDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const [postRes, commentRes] = await Promise.all([
                    API.get(`/posts/${id}`),
                    API.get(`/comments/${id}`)
                ]);
                setPost(postRes.data);
                setComments(commentRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setCommentLoading(true);
        try {
            const { data } = await API.post(`/comments/${id}`, { text: newComment });
            setComments([data, ...comments]);
            setNewComment('');
            toast.success('Comment added successfully!');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to add comment');
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDeletePost = async () => {
        try {
            await API.delete(`/posts/${id}`);
            toast.success('Post deleted successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete post');
            setShowConfirmDelete(false);
        }
    };

    if (loading) {
        return (
            <div className="theme-post min-h-screen py-12 sm:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100 dark:border-gray-700 animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-10"></div>
                        <div className="flex items-center gap-5 mb-12">
                            <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) return <div className="text-center py-20">Post not found</div>;

    const readingTime = post ? Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)) : 1;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="theme-post min-h-screen bg-gradient-to-b from-primary-50/50 to-transparent py-12 sm:py-20"
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.article 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 sm:p-12 border border-white mb-16 relative overflow-hidden"
                >
                    {/* Decorative background blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-10 leading-tight tracking-tight relative z-10">
                        {post.title}
                    </h1>
                    
                    {/* Author Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-gray-100 mb-12 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-gradient-to-tr from-primary-500 to-primary-300 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                                {post.author?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-lg">{post.author?.username}</div>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 font-medium">
                                    <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5"><BookOpen size={16} /> {readingTime} min read</span>
                                </div>
                            </div>
                        </div>
                        
                        {user && (user.role === 'admin' || user.id === post.author?._id) && (
                            <div>
                                {showConfirmDelete ? (
                                    <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-100">
                                        <span className="text-sm text-red-800 font-semibold mx-2">Are you sure?</span>
                                        <button onClick={handleDeletePost} className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-sm">Yes, Delete</button>
                                        <button onClick={() => setShowConfirmDelete(false)} className="text-sm bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-sm">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link to={`/edit/${post._id}`} className="flex items-center gap-1.5 text-sm text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all duration-300">
                                            <Edit size={16} /> Edit
                                        </Link>
                                        <button onClick={() => setShowConfirmDelete(true)} className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all duration-300">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="text-xl text-gray-800 leading-loose space-y-8 relative z-10 font-sans tracking-wide">
                        {post.content.split('\n').map((paragraph, idx) => (
                            paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-8 pt-8 border-t border-gray-100 mt-16 relative z-10">
                        <button className="flex items-center gap-2.5 text-gray-500 hover:text-primary-600 hover:scale-105 transition-all duration-300 group">
                            <Heart size={24} className="group-hover:fill-primary-100 transition-colors" />
                            <span className="font-semibold text-lg hidden sm:inline">Like</span>
                        </button>
                        <button 
                            onClick={() => document.getElementById('comments').scrollIntoView({ behavior: 'smooth' })}
                            className="flex items-center gap-2.5 text-gray-500 hover:text-primary-600 hover:scale-105 transition-all duration-300"
                        >
                            <MessageSquare size={24} />
                            <span className="font-semibold text-lg hidden sm:inline">Comment ({comments.length})</span>
                        </button>
                        <button className="flex items-center gap-2.5 text-gray-500 hover:text-primary-600 hover:scale-105 transition-all duration-300 ml-auto">
                            <Share2 size={24} />
                        </button>
                    </div>
                </motion.article>

                {/* Comments Section */}
                <section id="comments" className="max-w-3xl mx-auto pt-8">
                    <div className="flex items-center gap-3 mb-8">
                        <MessageSquare size={28} className="text-primary-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Conversations ({comments.length})</h2>
                    </div>

                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="mb-12">
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all resize-none text-lg"
                                    rows="3"
                                ></textarea>
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={commentLoading || !newComment.trim()}
                                        className="px-6 py-2.5 btn-gradient disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm"
                                    >
                                        {commentLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                        <span>Post Comment</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 text-center mb-12">
                            <p className="text-lg text-gray-600">Please <Link to="/login" className="text-primary-600 font-bold hover:underline">Login</Link> to join the conversation.</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 text-lg font-medium">No comments yet. Start the conversation!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="flex gap-5 p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-inner">
                                        {comment.user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-gray-900 text-lg">{comment.user?.username}</h4>
                                            <span className="text-sm text-gray-500 font-medium">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 text-lg leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default PostDetails;
