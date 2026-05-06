import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { LayoutDashboard, FileText, Users, Settings, TrendingUp, Eye, Edit, Trash2, PlusCircle, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await API.get('/posts');
                setPosts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDeletePost = async (id) => {
        toast.warn(
            ({ closeToast }) => (
                <div>
                    <p className="font-bold mb-3 text-gray-800">Are you sure you want to delete this post?</p>
                    <div className="flex gap-2">
                        <button 
                            onClick={async () => {
                                closeToast();
                                try {
                                    await API.delete(`/posts/${id}`);
                                    setPosts(prev => prev.filter(post => post._id !== id));
                                    toast.success('Post deleted successfully!');
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

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { title: 'Total Posts', value: posts.length, icon: <FileText size={24} className="text-primary-500" />, trend: '+12%' },
        { title: 'Total Views', value: '12.5K', icon: <Eye size={24} className="text-primary-500" />, trend: '+18%' },
        { title: 'Active Users', value: '842', icon: <Users size={24} className="text-primary-500" />, trend: '+5%' },
        { title: 'Engagement', value: '64%', icon: <TrendingUp size={24} className="text-primary-500" />, trend: '+2%' },
    ];

    return (
        <div className="theme-admin min-h-[calc(100vh-4rem)] bg-[var(--color-background)] text-gray-200 flex flex-col md:flex-row font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[var(--color-surface)] border-r border-gray-800 flex-shrink-0">
                <div className="p-6">
                    <h2 className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-4">Admin Dashboard</h2>
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`}>
                            <LayoutDashboard size={18} /> Overview
                        </button>
                        <button onClick={() => setActiveTab('posts')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'posts' ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`}>
                            <FileText size={18} /> Manage Posts
                        </button>
                        <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`}>
                            <Users size={18} /> Users
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`}>
                            <Settings size={18} /> Settings
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Platform Overview</h1>
                        <p className="text-gray-400">Monitor metrics and manage content.</p>
                    </div>
                    <Link to="/create" className="btn-gradient px-5 py-2.5 flex items-center justify-center gap-2 text-sm">
                        <PlusCircle size={18} /> New Post
                    </Link>
                </div>

                {/* Stats Grid */}
                {activeTab === 'overview' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-[var(--color-surface)] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                    {stat.icon}
                                </div>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">{stat.trend}</span>
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>
                )}

                {/* Table Section */}
                {(activeTab === 'overview' || activeTab === 'posts') && (
                 <div className="bg-[var(--color-surface)] border border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-white">{activeTab === 'posts' ? 'All Posts' : 'Recent Posts'}</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search posts..." className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 outline-none transition-all" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-900/50 border-b border-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Author</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center">
                                            <div className="flex justify-center"><Loader2 className="animate-spin text-primary-500" size={24} /></div>
                                        </td>
                                    </tr>
                                ) : filteredPosts.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No posts found.</td>
                                    </tr>
                                ) : (
                                    filteredPosts.slice(0, activeTab === 'overview' ? 5 : undefined).map((post) => (
                                        <tr key={post._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-200 line-clamp-1">{post.title}</td>
                                            <td className="px-6 py-4 text-gray-300">{post.author?.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link to={`/post/${post._id}`} className="text-primary-500 hover:text-primary-400 transition-colors bg-primary-500/10 p-2 rounded-lg" title="View">
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link to={`/edit/${post._id}`} className="text-emerald-500 hover:text-emerald-400 transition-colors bg-emerald-500/10 p-2 rounded-lg" title="Edit">
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button onClick={() => handleDeletePost(post._id)} className="text-red-500 hover:text-red-400 transition-colors bg-red-500/10 p-2 rounded-lg" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-[var(--color-surface)] border border-gray-800 rounded-2xl p-12 text-center shadow-lg">
                        <Users size={48} className="mx-auto text-gray-600 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
                        <p className="text-gray-400 max-w-md mx-auto">This module is currently under development. You will soon be able to manage roles and accounts here.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-[var(--color-surface)] border border-gray-800 rounded-2xl p-12 text-center shadow-lg">
                        <Settings size={48} className="mx-auto text-gray-600 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Platform Settings</h2>
                        <p className="text-gray-400 max-w-md mx-auto">Configuration options and environmental settings will be available in a future update.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;