import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`);
                // Enforce author verification on the frontend
                if (data.author._id !== user?.id && user?.role !== 'admin') {
                    toast.error('You are not authorized to edit this post');
                    navigate('/');
                    return;
                }
                setTitle(data.title);
                setContent(data.content);
            } catch (err) {
                toast.error('Failed to load post data');
                navigate('/');
            } finally {
                setFetching(false);
            }
        };

        if (user) fetchPost();
    }, [id, user, navigate]);

    if (!user) {
        return (
            <div className="theme-create flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="glass-card p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You must be logged in to edit a post.</p>
                    <button onClick={() => navigate('/login')} className="w-full px-6 py-3 btn-gradient">
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    if (fetching) {
        return (
            <div className="theme-create flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put(`/posts/${id}`, { title, content });
            toast.success('Post updated successfully!');
            navigate(`/post/${id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="theme-create max-w-3xl mx-auto px-4 py-10">
            <div className="glass-card p-8 sm:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold gradient-text pb-2">Edit Post</h1>
                    <p className="text-gray-500 mt-2">Update your story.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A Great Title" className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell your story..." rows="12" className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none leading-relaxed"></textarea>
                    </div>
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate(`/post/${id}`)} className="text-gray-600 font-medium hover:text-gray-900 hover:scale-105 transition-all duration-300">Cancel</button>
                        <button type="submit" disabled={loading || !title.trim() || !content.trim()} className="px-8 py-3 btn-gradient disabled:opacity-50 flex items-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;