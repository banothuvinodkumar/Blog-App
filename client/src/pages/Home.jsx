import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, PlusCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    if (loading) {
        return (
            <div className="theme-home min-h-screen py-16 px-4 max-w-7xl mx-auto">
                <div className="h-16 w-3/4 md:w-1/2 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6 animate-pulse"></div>
                <div className="h-6 w-1/2 md:w-1/3 bg-gray-200 dark:bg-gray-800 rounded-xl mb-20 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="glass-card h-96 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl border-none"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="theme-home relative min-h-screen">
            {/* Decorative background blobs */}
            <div className="absolute top-0 left-10 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute top-10 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <header className="mb-20 flex flex-col md:flex-row md:items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <h1 className="text-5xl font-extrabold sm:text-6xl lg:text-7xl mb-6 tracking-tight gradient-text drop-shadow-sm">
                            Explore Stories & Ideas
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mx-auto md:mx-0">
                            Discover thought-provoking articles from our community of writers. Share your perspective with the world.
                        </p>
                    </div>
                    {user && (
                        <Link to="/create" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg btn-gradient flex-shrink-0 mx-auto md:mx-0 shadow-[0_10px_20px_rgba(217,70,239,0.3)]">
                            <PlusCircle size={20} />
                            Create a Post
                        </Link>
                    )}
                </header>

                {posts.length === 0 ? (
                    <div className="text-center py-24 glass-card border-dashed border-2">
                        <p className="text-gray-500 text-lg">No posts available yet. Be the first to write one!</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post) => (
                            <motion.div key={post._id} variants={itemVariants} className="h-full">
                                <PostCard post={post} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;
