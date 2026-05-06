import { Link } from 'react-router-dom';
import { Clock, User, Edit, Trash2 } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';

const PostCard = ({ post }) => {
    const { user } = useContext(AuthContext);
    const category = post.category || 'Article';

    const canEditDelete = user && (user.role === 'admin' || user.id === post.author?._id);

    const handleDelete = async (e) => {
        e.preventDefault();
        toast.warn(
            ({ closeToast }) => (
                <div>
                    <p className="font-bold mb-3 text-gray-800">Are you sure you want to delete this post?</p>
                    <div className="flex gap-2">
                        <button 
                            onClick={async () => {
                                closeToast();
                                try {
                                    await API.delete(`/posts/${post._id}`);
                                    toast.success('Post deleted successfully!');
                                    window.location.reload(); // Refresh to remove the card from the list
                                } catch (err) {
                                    toast.error(err.response?.data?.message || 'Failed to delete post');
                                }
                            }} 
                            className="bg-red-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-red-700 transition shadow-sm text-sm"
                        >
                            Yes, Delete
                        </button>
                        <button 
                            onClick={closeToast} 
                            className="bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-bold hover:bg-gray-50 transition shadow-sm text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false, closeOnClick: false, draggable: false }
        );
    };

    return (
        <div className="glass-card flex flex-col h-full overflow-hidden group border-white/50 relative">
            {/* Image Placeholder */}
            <div className="w-full h-52 relative overflow-hidden bg-gray-100">
                <img src={`https://picsum.photos/seed/${post._id}/600/400`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-primary-700 shadow-sm uppercase tracking-wider">
                        {category}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                <Link to={`/post/${post._id}`} className="block">
                    <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                    </h3>
                </Link>
                
                <p className="text-gray-600 line-clamp-3 leading-relaxed flex-1 text-lg">
                    {post.content}
                </p>

                <div className="flex items-center justify-between mt-2">
                    <Link to={`/post/${post._id}`} className="text-primary-600 font-bold hover:text-primary-700 inline-flex items-center gap-1 w-fit group/link">
                        Read More <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                    </Link>

                    {canEditDelete && (
                        <div className="flex items-center gap-3">
                            <Link to={`/edit/${post._id}`} className="text-gray-400 hover:text-primary-600 transition-colors" title="Edit">
                                <Edit size={18} />
                            </Link>
                            <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-5 border-t border-gray-100/60 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-100 p-2 rounded-full">
                            <User size={16} className="text-primary-600" />
                        </div>
                        <span className="font-bold text-gray-900">{post.author?.username}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <Clock size={16} className="text-gray-400" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;