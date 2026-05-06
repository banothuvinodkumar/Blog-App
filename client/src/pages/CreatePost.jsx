import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { PenTool, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="theme-create min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-primary-50/50 to-transparent">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-primary-50 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You must be logged in to create a post.</p>
                    <button onClick={() => navigate('/login')} className="w-full px-6 py-3 btn-gradient">
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/posts', { title, content });
            toast.success('Post published successfully!');
            navigate(`/post/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
            toast.error(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="theme-create min-h-screen bg-gradient-to-b from-primary-50/50 to-transparent py-12 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 sm:p-12 border border-white relative overflow-hidden">
                    {/* Decorative background blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                    <div className="mb-10 relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">Create a <span className="gradient-text">New Post</span></h1>
                        <p className="text-lg text-gray-500">Share your thoughts, ideas, and stories with the world.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm border border-red-100 font-medium relative z-10">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Post Title</label>
                            <input type="text" required maxLength="100" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Future of Technology" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-lg shadow-sm" />
                            <div className="flex justify-between mt-2">
                                <span className="text-xs font-medium text-gray-400">Keep it short and catchy</span>
                                <span className={`text-xs font-bold ${title.length >= 100 ? 'text-red-500' : 'text-gray-400'}`}>{title.length}/100</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                            <textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your amazing story here..." rows="12" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none leading-relaxed text-lg shadow-sm"></textarea>
                            <div className="flex justify-end mt-2">
                                <span className="text-xs font-bold text-gray-400">{content.length} characters</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => navigate('/')} className="px-6 py-3 text-gray-500 font-bold hover:text-gray-900 hover:scale-105 transition-all duration-300 mr-4">Cancel</button>
                            <button type="submit" disabled={loading || !title.trim() || !content.trim()} className="px-10 py-4 btn-gradient disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)]">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><PenTool size={20} /> Publish Post</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;