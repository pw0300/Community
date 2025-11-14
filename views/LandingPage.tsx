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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.01, 0.05, 0.95]
        }
    }
};

const LandingPage: React.FC<LandingPageProps> = ({ navigateTo }) => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [skus, setSkus] = useState<SKU[]>([]);
    const [view, setView] = useState<'clubs' | 'guilds'>('clubs');
    const [aiSnippets, setAiSnippets] = useState<Map<string, string>>(new Map());
    const [snippetsLoading, setSnippetsLoading] = useState(true);

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
            setSnippetsLoading(true);
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
            setSnippetsLoading(false);
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
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 !leading-tight">
                        Stop Searching. <br/> Start <span className="text-teal-500">Becoming.</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        GrowthQuest is a curated marketplace of services, powered by communities and guided by AI, to help you achieve your personal and professional growth goals.
                    </p>
                    <div className="mt-10 max-w-xl mx-auto">
                        <motion.button 
                            onClick={() => navigateTo('onboarding')} 
                            className="w-full bg-teal-500 text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-teal-500/30"
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 25px -5px rgba(20, 184, 166, 0.2), 0 8px 10px -6px rgba(20, 184, 166, 0.2)" }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                           Find Your Community in 60 Seconds
                        </motion.button>
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
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A Smarter Path to Growth</h2>
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
                                        onClick={() => navigateTo(community.type === 'club' ? 'journeyMap' : 'communityDetail', { communityId: community.id })}
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
                                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm h-20 flex flex-col justify-center">
                                                <p className="font-semibold text-amber-800">Live Activity:</p>
                                                <p className="text-amber-700 italic">
                                                    {snippetsLoading ? (
                                                        <span className="animate-pulse">Generating snippet...</span>
                                                    ) : (
                                                        aiSnippets.get(community.id) || `Join the conversation in ${community.name}!`
                                                    )}
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
                        <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between transition-shadow hover:shadow-md">
                            <div className="flex items-center space-x-4">
                                <div className="text-center bg-white p-2 rounded-md border">
                                    <p className="font-bold text-amber-600 text-sm">NOV</p>
                                    <p className="font-bold text-xl">28</p>
                                </div>
                                <div>
                                    <h3 className="font-bold">AMA: Gut Health & You</h3>
                                    <p className="text-sm text-slate-500">with Dr. Priya Singh from 'Mindful Living'</p>
                                </div>
                            </div>
                            <button onClick={() => navigateTo('onboarding')} className="bg-amber-400 text-amber-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors">Join to RSVP</button>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between transition-shadow hover:shadow-md">
                            <div className="flex items-center space-x-4">
                                <div className="text-center bg-white p-2 rounded-md border">
                                    <p className="font-bold text-amber-600 text-sm">DEC</p>
                                    <p className="font-bold text-xl">02</p>
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
                                        onClick={() => community && navigateTo(community.type === 'club' ? 'journeyMap' : 'communityDetail', { communityId: community.id })}
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