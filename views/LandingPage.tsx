import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '../services/mockApi';
import { generateCommunitySnippet } from '../services/geminiService';
import type { Community, Provider, SKU } from '../types';
import { CheckCircleIcon, UsersIcon } from '../components/icons';

interface LandingPageProps {
    navigateTo: (view: string, data?: any) => void;
}

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut'
        }
    }
};

const LandingPage: React.FC<LandingPageProps> = ({ navigateTo }) => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [skus, setSkus] = useState<SKU[]>([]);
    const [view, setView] = useState<'clubs' | 'guilds'>('clubs');
    const [aiSnippets, setAiSnippets] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        const fetchData = async () => {
            const [comms, provs, allSkus] = await Promise.all([
                mockApi.getAllCommunities(),
                mockApi.getAllProviders(),
                mockApi.getAllSkus(),
            ]);
            setCommunities(comms);
            setProviders(provs.filter(p => p.isTrusted && p.quote).slice(0, 4));
            setSkus(allSkus.slice(0, 5));
            generateAllSnippets(comms);
        };
        
        const generateAllSnippets = async (comms: Community[]) => {
            const snippetPromises = comms.map(community =>
                generateCommunitySnippet(community.name, community.posts.slice(0, 3))
                    .then(snippet => ({ communityId: community.id, snippet }))
            );

            const results = await Promise.all(snippetPromises);

            setAiSnippets(prev => {
                const newSnippets = new Map(prev);
                results.forEach(result => {
                    if (result.snippet) {
                        newSnippets.set(result.communityId, result.snippet);
                    }
                });
                return newSnippets;
            });
        };

        fetchData();
    }, []);

    const filteredCommunities = communities.filter(c => c.type === (view === 'clubs' ? 'club' : 'guild'));

    const getCommunityForSku = (sku: SKU): Community | undefined => {
        return communities.find(c => c.id === sku.communityId);
    };

    return (
        <main>
            {/* Section 1: Hero */}
            <motion.section 
                className="relative bg-white"
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* The Club */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-900">
                                Find Your <span className="text-teal-500">People.</span>
                            </h1>
                            <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto md:mx-0">
                                Join member-led clubs for travel, wellness, and celebration.
                            </p>
                            <img src="https://picsum.photos/seed/hike-club/600/400" alt="People hiking" className="mt-6 rounded-2xl shadow-xl w-full" />
                        </div>
                        {/* The Guild */}
                        <div className="text-center md:text-left">
                             <img src="https://picsum.photos/seed/coding-guild/600/400" alt="People in a workshop" className="mb-6 rounded-2xl shadow-xl w-full" />
                             <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-900">
                                Find Your <span className="text-amber-500">Guild.</span>
                            </h1>
                            <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto md:mx-0">
                                Access expert-led guilds to accelerate your wealth and career.
                            </p>
                        </div>
                    </div>
                    <div className="mt-16 max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder='🔍 Search for a community (e.g., "Trekking", "F/O Trading")'
                                className="w-full py-4 pl-6 pr-32 text-lg border-2 border-slate-200 rounded-full focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition"
                            />
                            <button onClick={() => navigateTo('onboarding')} className="absolute top-1/2 right-2 -translate-y-1/2 bg-teal-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-teal-600 transition-all transform hover:scale-105">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Section 2: Experts-in-Residence */}
            <motion.section 
                className="py-20 bg-slate-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight">Learn From Proven Experts</h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {providers.map(provider => (
                            <motion.div key={provider.id} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center" whileHover={{ y: -5, shadow: 'xl' }}>
                                <img src={provider.avatarUrl} alt={provider.name} className="w-24 h-24 rounded-full mx-auto ring-4 ring-white shadow-md" />
                                <h3 className="mt-4 text-xl font-bold">{provider.name}</h3>
                                <p className="text-sm text-teal-600 font-semibold">{provider.bio}</p>
                                <div className="mt-2 flex items-center justify-center space-x-1 text-sm text-slate-500 font-medium">
                                    <CheckCircleIcon className="w-4 h-4 text-teal-500" />
                                    <span>Trusted Provider</span>
                                </div>
                                <p className="mt-4 text-slate-600 italic border-l-4 border-amber-300 pl-4">"{provider.quote}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Section 3: How It Works */}
            <motion.section 
                id="how-it-works"
                className="py-20 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A Simpler Path to Growth</h2>
                    <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
                        <div className="flex flex-col items-center">
                            <div className="bg-teal-100 text-teal-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">1</div>
                            <h3 className="mt-4 text-xl font-bold">Join a Community</h3>
                            <p className="mt-2 text-slate-600">Find your topic, meet your peers, and get access.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-teal-100 text-teal-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">2</div>
                            <h3 className="mt-4 text-xl font-bold">Unlock Exclusive SKUs</h3>
                            <p className="mt-2 text-slate-600">Get member-only access to curated services and events.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-teal-100 text-teal-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">3</div>
                            <h3 className="mt-4 text-xl font-bold">Grow Together</h3>
                            <p className="mt-2 text-slate-600">Share your experience, build your network, and find your next step.</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Section 4: Community Browser */}
            <motion.section 
                id="clubs-guilds"
                className="py-20 bg-slate-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight">Find Where You Belong</h2>
                    <div className="mt-8 flex justify-center">
                        <div className="bg-slate-200 p-1 rounded-full flex space-x-1">
                            <button 
                                onClick={() => setView('clubs')}
                                className={`px-6 py-2 rounded-full font-semibold transition-colors ${view === 'clubs' ? 'bg-white text-teal-600 shadow' : 'text-slate-600 hover:bg-slate-300/50'}`}
                            >
                                🌱 Personal Clubs
                            </button>
                            <button 
                                onClick={() => setView('guilds')}
                                className={`px-6 py-2 rounded-full font-semibold transition-colors ${view === 'guilds' ? 'bg-white text-amber-600 shadow' : 'text-slate-600 hover:bg-slate-300/50'}`}
                            >
                                👔 Professional Guilds
                            </button>
                        </div>
                    </div>
                    <div className="mt-12">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={view}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredCommunities.map(community => (
                                    <motion.div 
                                        key={community.id} 
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group cursor-pointer" 
                                        whileHover={{ y: -5, shadow: 'xl' }}
                                        onClick={() => navigateTo('communityDetail', { communityId: community.id })}
                                    >
                                        <div className="relative h-48">
                                            <img src={community.coverImageUrl} alt={community.name} className="w-full h-full object-cover" />
                                            <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white rounded-full ${community.type === 'club' ? 'bg-teal-500' : 'bg-amber-500'}`}>
                                                #{community.type === 'club' ? 'TheClub' : 'TheGuild'}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-slate-900">{community.name}</h3>
                                            <div className="mt-2 flex items-center space-x-2 text-sm text-slate-500">
                                                <UsersIcon className="w-4 h-4" />
                                                <span>{community.members.length}+ Members</span>
                                            </div>
                                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm">
                                                <p className="font-semibold text-amber-800">Live Activity:</p>
                                                <p className="text-amber-700 italic">
                                                    {aiSnippets.get(community.id) || <span className="animate-pulse">Generating snippet...</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 mt-auto">
                                            <button className="w-full text-center bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                                View Community
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.section>

             {/* Section 5: What's Happening This Week */}
            <motion.section 
                className="py-20 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight">Don't Miss Out</h2>
                    <div className="mt-12 max-w-2xl mx-auto space-y-4">
                        {/* Hardcoded events for demo */}
                        <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between transition-shadow hover:shadow-md">
                            <div className="flex items-center space-x-4">
                                <div className="text-center bg-white p-2 rounded-md border">
                                    <p className="font-bold text-amber-600 text-sm">NOV</p>
                                    <p className="font-bold text-xl">15</p>
                                </div>
                                <div>
                                    <h3 className="font-bold">AMA: Gut Health & You</h3>
                                    <p className="text-sm text-slate-500">with Dr. Priya Singh from 'Wellness Warriors'</p>
                                </div>
                            </div>
                            <button onClick={() => navigateTo('onboarding')} className="bg-amber-400 text-amber-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors">Join to RSVP</button>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between transition-shadow hover:shadow-md">
                            <div className="flex items-center space-x-4">
                                <div className="text-center bg-white p-2 rounded-md border">
                                    <p className="font-bold text-amber-600 text-sm">NOV</p>
                                    <p className="font-bold text-xl">18</p>
                                </div>
                                <div>
                                    <h3 className="font-bold">Live Trading Session</h3>
                                    <p className="text-sm text-slate-500">with Leo Sterling from 'Wealth Architects'</p>
                                </div>
                            </div>
                            <button onClick={() => navigateTo('onboarding')} className="bg-amber-400 text-amber-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors">Join to RSVP</button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Section 6: SKU Crossover */}
            <motion.section 
                className="py-20 bg-slate-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight">Exclusive Member-Only Experiences</h2>
                     <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {skus.slice(0,3).map(sku => {
                            const community = getCommunityForSku(sku);
                            return (
                             <motion.div 
                                 key={sku.id} 
                                 className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group"
                                 whileHover={{ y: -5, shadow: 'xl' }}
                             >
                                 <img src={`https://picsum.photos/seed/${sku.id}/600/400`} alt={sku.name} className="w-full h-48 object-cover" />
                                 <div className="p-6 flex flex-col flex-grow">
                                     <h3 className="text-xl font-bold text-slate-900">{sku.name}</h3>
                                     <p className="text-slate-600 mt-2 flex-grow">{sku.description.slice(0, 100)}...</p>
                                     <div className="mt-4">
                                         <p className="text-sm text-slate-500">From ${sku.variants[0].price.toLocaleString()}</p>
                                     </div>
                                 </div>
                                 <div className="p-6 pt-0">
                                     <button 
                                        onClick={() => community && navigateTo('communityDetail', { communityId: community.id })}
                                        className="w-full text-center bg-teal-500 text-white font-semibold py-3 px-4 rounded-lg group-hover:bg-teal-600 transition-colors"
                                    >
                                         Join '{community ? community.name : ''}' to Unlock
                                     </button>
                                 </div>
                             </motion.div>
                            )
                         })}
                     </div>
                </div>
            </motion.section>
        </main>
    );
};

export default LandingPage;