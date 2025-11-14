import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { generateCommunityPost } from '../services/geminiService';
import type { Community, CommunityPost, User, SKU } from '../types';
import { formatTimeAgo, formatDateTime } from '../utils';

interface CommunityDetailViewProps {
    communityId: string;
    navigateTo: (view: string, data?: any) => void;
}

const AIPostContent: React.FC<{ post: CommunityPost }> = ({ post }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    if (post.postType === 'poll' && post.pollOptions) {
        return (
            <>
                <p className="mt-1 text-slate-800">{post.content}</p>
                <div className="mt-3 space-y-2">
                    {post.pollOptions.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedOption(option)}
                            className={`w-full text-left p-3 border rounded-lg transition-all ${
                                selectedOption === option
                                    ? 'bg-teal-500 border-teal-500 text-white font-semibold shadow'
                                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </>
        );
    }

    return <p className="mt-1 text-slate-800 whitespace-pre-wrap">{post.content}</p>;
};

const AITypingPlaceholder: React.FC = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-start space-x-4">
            <img src="https://picsum.photos/seed/ai/100/100" className="w-12 h-12 rounded-full"/>
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <p className="font-bold text-teal-700">Community AI Agent</p>
                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">AI Agent</span>
                </div>
                <div className="mt-2 flex items-center space-x-1">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></span>
                </div>
            </div>
        </div>
    </div>
);


const CommunityDetailView: React.FC<CommunityDetailViewProps> = ({ communityId, navigateTo }) => {
    const [community, setCommunity] = useState<Community | null>(null);
    const [authors, setAuthors] = useState<Map<string, User>>(new Map());
    const [relatedSkus, setRelatedSkus] = useState<SKU[]>([]);
    const [activeTab, setActiveTab] = useState('feed');
    const [isGenerating, setIsGenerating] = useState(false);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            const communityData = await mockApi.getCommunityById(communityId);
            if (!isMounted || !communityData) return;
            
            setCommunity(communityData);

            const authorIds = new Set(communityData.posts.map(p => p.authorId).concat(communityData.members));
            communityData.posts.forEach(p => p.comments.forEach(c => authorIds.add(c.authorId)));
            const authorData = await Promise.all(
                Array.from(authorIds).map(id => mockApi.getUserById(id))
            );
            const authorMap = new Map<string, User>();
            authorData.forEach(u => u && authorMap.set(u.id, u));
            setAuthors(authorMap);
            
            const allSkus = (await mockApi.getAllSkus());
            setRelatedSkus(allSkus.filter(s => s.communityId === communityId));
        };
        fetchData();
        return () => { isMounted = false; }
    }, [communityId]);

    const handleAiPost = async () => {
        if (!community) return;
        setIsGenerating(true);
        const postContent = await generateCommunityPost(community.name);
        const newPost: CommunityPost = {
            ...postContent,
            id: `post-${Date.now()}`,
            authorId: 'ai-agent',
            timestamp: new Date(),
        };
        setTimeout(() => {
            setCommunity(prev => prev ? { ...prev, posts: [newPost, ...prev.posts] } : null);
            setIsGenerating(false);
        }, 1500);
    };
    
    const handleLike = (postId: string) => {
        setCommunity(prev => {
            if (!prev) return null;
            const newPosts = prev.posts.map(p => {
                if (p.id === postId) {
                    const alreadyLiked = likedPosts.has(postId);
                    return { ...p, likes: alreadyLiked ? p.likes - 1 : p.likes + 1 };
                }
                return p;
            });
            return { ...prev, posts: newPosts };
        });
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const handleAddComment = (postId: string) => {
        if (!commentText.trim()) return;
        const newComment = {
            authorId: 'user-seeker-123',
            text: commentText,
            timestamp: new Date()
        };
        setCommunity(prev => {
            if (!prev) return null;
            const newPosts = prev.posts.map(p => {
                if (p.id === postId) {
                    return { ...p, comments: [...p.comments, newComment] };
                }
                return p;
            });
            return { ...prev, posts: newPosts };
        });
        setCommentText('');
        setActiveCommentBox(null);
    };

    if (!community) {
        return <div>Loading Community...</div>;
    }
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'feed':
                return (
                     <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <textarea className="w-full border rounded-md p-2 focus:ring-teal-500 focus:border-teal-500" placeholder={`Share your thoughts, ${authors.get('user-seeker-123')?.name?.split(' ')[0]}...`}></textarea>
                            <div className="flex justify-between items-center mt-2">
                                <button className="text-sm text-slate-500 hover:text-slate-700">Add Photo</button>
                                <button className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600">Post</button>
                            </div>
                        </div>
                        {isGenerating && <AITypingPlaceholder />}
                        {community.posts.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).map(post => {
                            const author = authors.get(post.authorId);
                            const isLiked = likedPosts.has(post.id);
                            return (
                                <div key={post.id} className={`bg-white p-4 rounded-xl shadow-sm ${post.isAiAgentPost ? 'bg-gradient-to-tr from-teal-50 to-white border border-teal-100' : ''}`}>
                                    <div className="flex items-start space-x-4">
                                        <img src={author?.avatarUrl} alt={author?.name} className="w-12 h-12 rounded-full"/>
                                        <div className="flex-1">
                                            <div className="flex items-baseline space-x-2">
                                                <p className="font-bold text-teal-700">{author?.name}</p>
                                                {post.isAiAgentPost && <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">AI Agent</span>}
                                                <p className="text-xs text-slate-500">{formatTimeAgo(post.timestamp)}</p>
                                            </div>
                                            <AIPostContent post={post} />
                                            {post.photos && (
                                                <div className="mt-3 grid grid-cols-2 gap-2">
                                                    {post.photos.map((p, i) => <img key={i} src={p} className="w-full rounded-md object-cover" alt="post attachment"/>)}
                                                </div>
                                            )}
                                            <div className="mt-3 flex items-center space-x-6 text-sm text-slate-500">
                                                <button onClick={() => handleLike(post.id)} className={`flex items-center space-x-1 hover:text-rose-500 ${isLiked ? 'text-rose-500' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> <span>{post.likes}</span></button>
                                                <button onClick={() => setActiveCommentBox(activeCommentBox === post.id ? null : post.id)} className="flex items-center space-x-1 hover:text-teal-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg> <span>{post.comments.length}</span></button>
                                            </div>
                                            {activeCommentBox === post.id && (
                                                <div className="mt-4">
                                                    <div className="space-y-3">
                                                        {post.comments.map((comment, i) => {
                                                            const commentAuthor = authors.get(comment.authorId);
                                                            return (
                                                                <div key={i} className="flex items-start space-x-2">
                                                                    <img src={commentAuthor?.avatarUrl} className="w-8 h-8 rounded-full"/>
                                                                    <div className="bg-slate-100 p-2 rounded-lg">
                                                                        <p className="font-semibold text-sm">{commentAuthor?.name}</p>
                                                                        <p className="text-sm">{comment.text}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className="mt-3 flex space-x-2">
                                                        <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="flex-1 border rounded-full px-3 py-1 text-sm"/>
                                                        <button onClick={() => handleAddComment(post.id)} className="bg-teal-500 text-white text-sm font-semibold px-3 py-1 rounded-full">Submit</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                );
            case 'events':
                return (
                    <div className="space-y-6">
                        {relatedSkus.length > 0 ? relatedSkus.map(sku => {
                             const nextCohort = sku.variants.flatMap(v => v.cohorts).filter(c => c.startDateTime > new Date()).sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())[0];
                            if (!nextCohort) return null;
                            return (
                                <div key={sku.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                                     <div className="md:w-1/3"><img src={`https://picsum.photos/seed/${sku.name.split(' ')[0]}/400/300`} alt={sku.name} className="w-full h-full object-cover"/></div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div><h3 className="text-xl font-bold text-slate-800">{sku.name}</h3><p className="text-slate-600 mt-1 line-clamp-2">{sku.description}</p></div>
                                        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between">
                                            <div><p className="font-semibold text-teal-700">Next event:</p><p className="text-sm text-slate-600">{formatDateTime(nextCohort.startDateTime, nextCohort.timeZone)}</p></div>
                                            <button onClick={() => navigateTo('skuDetail', {sku})} className="mt-4 md:mt-0 bg-teal-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-teal-600 transition-colors">View Details</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <div className="bg-white p-6 rounded-xl shadow-sm text-center"><p>No upcoming events for this community.</p></div>}
                    </div>
                );
            case 'members':
                 return (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                         {community.members.map(memberId => {
                            const member = authors.get(memberId);
                            if (!member) return null;
                            return (
                                <div key={memberId} className="text-center bg-white p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                                    <img src={member.avatarUrl} alt={member.name} className="w-20 h-20 rounded-full mx-auto" />
                                    <p className="mt-2 font-semibold">{member.name}</p>
                                </div>
                            )
                        })}
                    </div>
                 );
        }
    };

    return (
         <div className="max-w-4xl mx-auto animate-fade-in-up">
             <header className="mb-8 relative h-48 rounded-2xl overflow-hidden">
                <img src={community.coverImageUrl} alt={`${community.name} cover`} className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <button onClick={() => navigateTo('communityHub')} className="text-white/80 hover:text-white mb-2 font-semibold text-sm">&larr; All Communities</button>
                    <h1 className="text-3xl font-bold tracking-tight text-white">{community.name}</h1>
                </div>
             </header>

            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex justify-around text-center">
                <div><p className="text-2xl font-bold">{community.members.length}</p><p className="text-sm text-slate-500">Members</p></div>
                <div><p className="text-2xl font-bold text-red-600">{community.activeNow}</p><p className="text-sm text-slate-500">Active Now</p></div>
                <div><p className="text-2xl font-bold text-green-600">+{community.weeklyGrowth}%</p><p className="text-sm text-slate-500">This Week</p></div>
            </div>

             <div className="flex border-b mb-6 justify-between items-center bg-white rounded-t-lg p-2 sticky top-20 z-10">
                <div className="flex">
                    <button onClick={() => setActiveTab('feed')} className={`py-2 px-4 font-semibold ${activeTab === 'feed' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500'}`}>Feed</button>
                    <button onClick={() => setActiveTab('events')} className={`py-2 px-4 font-semibold ${activeTab === 'events' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500'}`}>Events</button>
                    <button onClick={() => setActiveTab('members')} className={`py-2 px-4 font-semibold ${activeTab === 'members' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500'}`}>Members</button>
                </div>
                {activeTab === 'feed' && (
                    <button onClick={handleAiPost} disabled={isGenerating} className="flex items-center space-x-2 bg-amber-400 text-amber-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 disabled:bg-amber-200 disabled:cursor-not-allowed transition-colors text-sm">
                        <span>✨</span><span>{isGenerating ? 'Generating...' : 'Spark Engagement'}</span>
                    </button>
                )}
            </div>
            {renderTabContent()}
         </div>
    );
};

export default CommunityDetailView;