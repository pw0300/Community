import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '../../services/mockApi';
import { generateCommunityOnboarding, generateMemberBadge } from '../../services/geminiService';
import { useAppContext } from '../../context/AppContext';
import type { Community, CommunityPost, User, SKU, CommunityResource, CommunityMemberProfile } from '../../types';
import { formatTimeAgo } from '../../utils';
import { BookOpenIcon, QuestionMarkCircleIcon } from '../../components/icons';

interface GuildDetailViewProps {
    community: Community;
    navigateTo: (view: string, data?: any) => void;
    isMember: boolean;
}

const GuildDetailView: React.FC<GuildDetailViewProps> = ({ community: initialCommunity, navigateTo, isMember }) => {
    const { dispatch } = useAppContext();
    const [community, setCommunity] = useState<Community>(initialCommunity);
    const [authors, setAuthors] = useState<Map<string, User>>(new Map());
    const [memberProfiles, setMemberProfiles] = useState<CommunityMemberProfile[]>(initialCommunity.memberProfiles || []);
    const [relatedSkus, setRelatedSkus] = useState<SKU[]>([]);
    const [activeTab, setActiveTab] = useState('discussion');
    
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingState, setOnboardingState] = useState<{ questions: string[], answers: string[], step: number, isLoading: boolean }>({ questions: [], answers: [], step: 0, isLoading: false });

    useEffect(() => {
        const fetchData = async () => {
            const authorIds = new Set(community.posts.map(p => p.authorId).concat(community.members));
            community.posts.forEach(p => p.comments.forEach(c => authorIds.add(c.authorId)));
            (community.resources || []).forEach(r => authorIds.add(r.authorId));

            const authorData = await Promise.all(
                Array.from(authorIds).map(id => mockApi.getUserById(id))
            );
            const authorMap = new Map<string, User>();
            authorData.forEach(u => u && authorMap.set(u.id, u));
            setAuthors(authorMap);
            
            const allSkus = (await mockApi.getAllSkus());
            setRelatedSkus(allSkus.filter(s => s.communityId === community.id));
        };
        fetchData();
    }, [community]);

    const handleJoin = async () => {
        setShowOnboarding(true);
        setOnboardingState(s => ({ ...s, isLoading: true }));
        const { questions } = await generateCommunityOnboarding(community.name);
        setOnboardingState(s => ({ ...s, questions, step: 1, isLoading: false }));
    };

    const handleAnswerOnboarding = (answer: string) => {
        const newAnswers = [...onboardingState.answers, answer];
        if (onboardingState.step < onboardingState.questions.length) {
            setOnboardingState(s => ({...s, answers: newAnswers, step: s.step + 1 }));
        } else {
            setOnboardingState(s => ({ ...s, answers: newAnswers, isLoading: true }));
            finishOnboarding(newAnswers);
        }
    };
    
    const finishOnboarding = async (answers: string[]) => {
        const questionsAndAnswers = onboardingState.questions.map((q, i) => ({ question: q, answer: answers[i]}));
        const { badge, about } = await generateMemberBadge(community.name, questionsAndAnswers);
        
        const newProfile: CommunityMemberProfile = { userId: 'user-seeker-123', communityId: community.id, badge, about };
        setMemberProfiles(prev => [...prev, newProfile]);
        
        dispatch({ type: 'JOIN_COMMUNITY', payload: { communityId: community.id } });
        setOnboardingState({ questions: [], answers: [], step: 0, isLoading: false });
        setShowOnboarding(false);
        setActiveTab('members');
    };

    const renderDiscussion = () => (
        <div className="space-y-4">
            {community.posts.filter(p => p.postType === 'prompt').map(post => {
                const author = authors.get(post.authorId);
                return (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-slate-300">
                        <div className="flex items-start space-x-3">
                            <img src={author?.avatarUrl} alt={author?.name} className="w-10 h-10 rounded-full"/>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <p className="font-semibold">{author?.name}</p>
                                    <p className="text-xs text-slate-500">&middot; {formatTimeAgo(post.timestamp)}</p>
                                </div>
                                <p className="mt-1">{post.content}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
    
    const renderResources = () => (
         <div className="space-y-4">
            {(community.resources || []).map(resource => {
                 const author = authors.get(resource.authorId);
                 return (
                     <div key={resource.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4">
                            <div className="bg-slate-100 p-3 rounded-lg"><BookOpenIcon className="w-6 h-6 text-slate-600"/></div>
                            <div className="flex-1">
                                <p className="font-bold text-teal-700">{resource.title}</p>
                                <p className="text-sm text-slate-500">Shared by {author?.name} &middot; {formatTimeAgo(resource.timestamp)}</p>
                            </div>
                             <span className="text-teal-500 font-bold">&rarr;</span>
                        </a>
                     </div>
                 )
            })}
        </div>
    );

     const renderQA = () => (
        <div className="space-y-4">
            {community.posts.filter(p => p.postType === 'question').map(post => {
                const author = authors.get(post.authorId);
                return (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
                         <div className="flex items-start space-x-3">
                            <img src={author?.avatarUrl} alt={author?.name} className="w-10 h-10 rounded-full"/>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <p className="font-semibold">{author?.name}</p>
                                    <p className="text-xs text-slate-500">&middot; {formatTimeAgo(post.timestamp)}</p>
                                </div>
                                <p className="mt-1 font-semibold">{post.content}</p>
                                {post.comments.length > 0 && (
                                    <div className="mt-3 border-t pt-3">
                                        {post.comments.map((comment, i) => {
                                            const cAuthor = authors.get(comment.authorId);
                                            return (
                                                <div key={i} className="flex items-start space-x-2">
                                                    <img src={cAuthor?.avatarUrl} className="w-8 h-8 rounded-full" />
                                                    <div className="bg-slate-50 p-2 rounded-lg text-sm">
                                                        <p><span className="font-semibold">{cAuthor?.name}</span> {comment.text}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                            <QuestionMarkCircleIcon className="w-6 h-6 text-amber-500" />
                        </div>
                    </div>
                );
            })}
        </div>
    );

     const renderMembers = () => (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberProfiles.map(profile => {
                const user = authors.get(profile.userId);
                if (!user) return null;
                return (
                    <div key={profile.userId} className="bg-white p-4 rounded-xl shadow-sm border flex items-center space-x-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full"/>
                        <div>
                            <h4 className="font-bold">{user.name}</h4>
                            <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">{profile.badge}</p>
                            <p className="text-xs text-slate-500 mt-1 italic">"{profile.about}"</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );

    return (
         <>
         <div className="max-w-4xl mx-auto animate-fade-in-up">
             <header className="mb-8 relative h-40 rounded-2xl overflow-hidden bg-slate-800">
                 <img src={community.coverImageUrl} alt={`${community.name} cover`} className="absolute inset-0 w-full h-full object-cover opacity-30"/>
                <div className="absolute bottom-0 left-0 p-6">
                    <button onClick={() => navigateTo('communityHub')} className="text-white/80 hover:text-white mb-2 font-semibold text-sm">&larr; All Communities</button>
                    <h1 className="text-3xl font-bold tracking-tight text-white">{community.name}</h1>
                </div>
             </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex border-b mb-6 bg-white rounded-t-lg p-2 sticky top-20 z-10 shadow-sm">
                        <button onClick={() => setActiveTab('discussion')} className={`py-2 px-4 font-semibold ${activeTab === 'discussion' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500'}`}>Discussion</button>
                        <button onClick={() => setActiveTab('resources')} className={`py-2 px-4 font-semibold ${activeTab === 'resources' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500'}`}>Resources</button>
                        <button onClick={() => setActiveTab('qa')} className={`py-2 px-4 font-semibold ${activeTab === 'qa' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500'}`}>Q&A</button>
                        <button onClick={() => setActiveTab('members')} className={`py-2 px-4 font-semibold ${activeTab === 'members' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500'}`}>Members</button>
                    </div>
                    {activeTab === 'discussion' && renderDiscussion()}
                    {activeTab === 'resources' && renderResources()}
                    {activeTab === 'qa' && renderQA()}
                    {activeTab === 'members' && renderMembers()}
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm sticky top-28">
                         <h3 className="font-bold text-lg mb-2">About this Guild</h3>
                         <p className="text-sm text-slate-600 mb-4">{community.description}</p>
                         {!isMember && (
                            <button onClick={handleJoin} className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                                Join Guild
                            </button>
                         )}
                    </div>
                     <div className="bg-white p-4 rounded-xl shadow-sm sticky top-72">
                         <h3 className="font-bold text-lg mb-2">Key Accelerators</h3>
                         {relatedSkus.map(sku => (
                            <div key={sku.id} onClick={() => navigateTo('skuDetail', {sku})} className="block p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                                <p className="font-semibold text-teal-700">{sku.name}</p>
                                <p className="text-xs text-slate-500">{sku.description.slice(0, 50)}...</p>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
         </div>
          <AnimatePresence>
            {showOnboarding && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowOnboarding(false)}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 text-center" onClick={e => e.stopPropagation()}>
                        {onboardingState.isLoading ? <p>Loading...</p> : (
                            <>
                                <h2 className="text-2xl font-bold">Welcome to {community.name}!</h2>
                                <p className="text-slate-600 mt-2">Let's set up your member profile. {onboardingState.step}/{onboardingState.questions.length}</p>
                                <div className="mt-6">
                                    <p className="font-semibold text-lg">{onboardingState.questions[onboardingState.step - 1]}</p>
                                    <input
                                        type="text"
                                        autoFocus
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAnswerOnboarding((e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                        className="mt-2 w-full border-b-2 border-slate-300 focus:border-blue-500 outline-none p-2 text-center text-lg"
                                        placeholder="Type your answer..."
                                    />
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
         </AnimatePresence>
         </>
    );
};

export default GuildDetailView;
