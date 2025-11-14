import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '../../services/mockApi';
import { generateCommunityOnboarding, generateMemberBadge } from '../../services/geminiService';
import { useAppContext } from '../../context/AppContext';
import type { Community, CommunityPost, User, SKU, CommunityMemberProfile } from '../../types';
import { formatTimeAgo, formatDateTime } from '../../utils';

interface ClubDetailViewProps {
    community: Community;
    navigateTo: (view: string, data?: any) => void;
    isMember: boolean;
}

const ClubDetailView: React.FC<ClubDetailViewProps> = ({ community: initialCommunity, navigateTo, isMember }) => {
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
            const authorData = await Promise.all(Array.from(authorIds).map(id => mockApi.getUserById(id)));
            const authorMap = new Map<string, User>();
            authorData.forEach(u => u && authorMap.set(u.id, u));
            setAuthors(authorMap);
            
            const allSkus = await mockApi.getAllSkus();
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
            // Last step, generate badge
            setOnboardingState(s => ({ ...s, answers: newAnswers, isLoading: true }));
            finishOnboarding(newAnswers);
        }
    };
    
    const finishOnboarding = async (answers: string[]) => {
        const questionsAndAnswers = onboardingState.questions.map((q, i) => ({ question: q, answer: answers[i]}));
        const { badge, about } = await generateMemberBadge(community.name, questionsAndAnswers);
        
        // In a real app, this would be an API call to save the profile
        const newProfile: CommunityMemberProfile = { userId: 'user-seeker-123', communityId: community.id, badge, about };
        setMemberProfiles(prev => [...prev, newProfile]);
        
        dispatch({ type: 'JOIN_COMMUNITY', payload: { communityId: community.id } });
        setOnboardingState({ questions: [], answers: [], step: 0, isLoading: false });
        setShowOnboarding(false);
        setActiveTab('members');
    };

    return (
         <>
         <div className="max-w-4xl mx-auto animate-fade-in-up">
             <header className="mb-8 relative h-48 rounded-2xl overflow-hidden">
                <img src={community.coverImageUrl} alt={`${community.name} cover`} className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <button onClick={() => navigateTo('communityHub')} className="text-white/80 hover:text-white mb-2 font-semibold text-sm">&larr; All Communities</button>
                    <h1 className="text-3xl font-bold tracking-tight text-white">{community.name}</h1>
                </div>
             </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex border-b bg-white rounded-t-lg p-2 sticky top-20 z-10 shadow-sm">
                        <button onClick={() => setActiveTab('discussion')} className={`py-2 px-4 font-semibold ${activeTab === 'discussion' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500'}`}>Discussion</button>
                        <button onClick={() => setActiveTab('members')} className={`py-2 px-4 font-semibold ${activeTab === 'members' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500'}`}>Members ({community.members.length})</button>
                    </div>

                    {activeTab === 'discussion' && (
                        <div className="space-y-4">
                            {community.posts.length > 0 ? community.posts.map(post => <p key={post.id}>{post.content}</p>) : <p>No posts yet.</p>}
                        </div>
                    )}
                    {activeTab === 'members' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {memberProfiles.map(profile => {
                                const user = authors.get(profile.userId);
                                if (!user) return null;
                                return (
                                    <div key={profile.userId} className="bg-white p-4 rounded-xl shadow-sm border flex items-center space-x-4">
                                        <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full"/>
                                        <div>
                                            <h4 className="font-bold">{user.name}</h4>
                                            <p className="text-sm font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full inline-block">{profile.badge}</p>
                                            <p className="text-xs text-slate-500 mt-1 italic">"{profile.about}"</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                </div>
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm sticky top-28">
                        <h3 className="font-bold text-lg mb-2">Club Info</h3>
                        <p className="text-sm text-slate-600 mb-4">{community.description}</p>
                        {isMember ? (
                            <button onClick={() => navigateTo('journeyMap', { communityId: community.id })} className="w-full bg-amber-400 text-amber-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors">
                                View Your Journey Map
                            </button>
                        ) : (
                             <button onClick={handleJoin} className="w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors">
                                Join Club
                            </button>
                        )}
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
                                        className="mt-2 w-full border-b-2 border-slate-300 focus:border-teal-500 outline-none p-2 text-center text-lg"
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

export default ClubDetailView;
