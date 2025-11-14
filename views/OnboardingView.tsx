import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '../services/mockApi';
import type { Community, SKU } from '../types';
import { UsersIcon, SparklesIcon } from '../components/icons';

interface OnboardingViewProps {
    navigateTo: (view: string, data?: any) => void;
}

const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
};

type Archetype = 'explorer' | 'architect';

const OnboardingView: React.FC<OnboardingViewProps> = ({ navigateTo }) => {
    const [step, setStep] = useState(1);
    const [archetype, setArchetype] = useState<Archetype | null>(null);
    const [recommendations, setRecommendations] = useState<{ communities: Community[], skus: SKU[] } | null>(null);

    useEffect(() => {
        if (archetype) {
            const getRecommendations = async () => {
                const [allCommunities, allSkus] = await Promise.all([
                    mockApi.getAllCommunities(),
                    mockApi.getAllSkus()
                ]);

                if (archetype === 'explorer') {
                    const explorerCommunities = allCommunities.filter(c => c.type === 'club');
                    const explorerSkus = allSkus.filter(s => ['cat-1', 'cat-2', 'cat-6'].includes(s.subCategoryId.slice(0,5))); // Travel, Wellness, Creative
                    setRecommendations({
                        communities: explorerCommunities.slice(0, 2),
                        skus: explorerSkus.slice(0, 2)
                    });
                } else if (archetype === 'architect') {
                    const architectCommunities = allCommunities.filter(c => c.type === 'guild');
                    const architectSkus = allSkus.filter(s => ['cat-3', 'cat-4', 'cat-5'].includes(s.subCategoryId.slice(0,5))); // Business, Tech, Finance
                     setRecommendations({
                        communities: architectCommunities.slice(0, 2),
                        skus: architectSkus.slice(0, 2)
                    });
                }

                setTimeout(() => setStep(4), 500); // Wait half a second after recommendations are set
            };
            getRecommendations();
        }
    }, [archetype]);

    const handleSelectArchetype = (selectedArchetype: Archetype) => {
        setStep(3); // Go to loading step
        setArchetype(selectedArchetype);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 p-4">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-center max-w-2xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Let's Find Your Path</h1>
                        <p className="mt-4 text-lg text-slate-600">Answer one quick question to help us curate the perfect starting point for your growth journey.</p>
                        <button
                            onClick={() => setStep(2)}
                            className="mt-8 bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg"
                        >
                            Let's Begin
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full max-w-4xl"
                    >
                        <h2 className="text-3xl font-bold text-center tracking-tight mb-8">Which of these sounds more like you?</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <ArchetypeCard
                                title="The Explorer"
                                icon="🌱"
                                description="You're drawn to new experiences, personal well-being, and creative passions. You believe growth comes from exploring the world and your inner self."
                                buttonText="This is me"
                                onSelect={() => handleSelectArchetype('explorer')}
                            />
                            <ArchetypeCard
                                title="The Architect"
                                icon="👔"
                                description="You're focused on building your career, mastering new skills, and achieving financial goals. You see growth as a strategic path to professional success."
                                buttonText="That's my focus"
                                onSelect={() => handleSelectArchetype('architect')}
                            />
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-center"
                    >
                        <SparklesIcon className="w-12 h-12 text-teal-500 mx-auto animate-pulse" />
                        <p className="mt-4 text-xl font-semibold text-slate-700">Crafting your personalized GrowthQuest...</p>
                    </motion.div>
                )}
                
                {step === 4 && recommendations && (
                    <motion.div
                        key="step4"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full max-w-5xl"
                    >
                         <h2 className="text-3xl font-bold text-center tracking-tight mb-2">Your Personalized Starting Point</h2>
                         <p className="text-center text-slate-600 mb-8">Based on your path as an {archetype}, here are a few communities and experiences we think you'll love.</p>
                        
                         <div className="grid lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Recommended Communities</h3>
                                <div className="space-y-4">
                                {recommendations.communities.map(community => (
                                     <CommunityCard key={community.id} community={community} navigateTo={navigateTo} />
                                ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-2xl font-bold mb-4">Featured Experiences</h3>
                                <div className="space-y-4">
                                {recommendations.skus.map(sku => (
                                     <SkuCard key={sku.id} sku={sku} navigateTo={navigateTo} />
                                ))}
                                </div>
                            </div>
                         </div>
                         <div className="text-center mt-12">
                            <button onClick={() => navigateTo('discover')} className="text-teal-600 font-semibold hover:underline">Or, explore all options &rarr;</button>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ArchetypeCard: React.FC<{ title: string, icon: string, description: string, buttonText: string, onSelect: () => void }> = ({ title, icon, description, buttonText, onSelect }) => (
    <motion.div 
        className="bg-white p-8 rounded-2xl shadow-xl border-2 border-transparent hover:border-teal-400 transition-colors text-center flex flex-col"
        whileHover={{ y: -5 }}
    >
        <span className="text-5xl mx-auto">{icon}</span>
        <h3 className="text-2xl font-bold mt-4">{title}</h3>
        <p className="text-slate-600 mt-2 flex-grow">{description}</p>
        <button onClick={onSelect} className="mt-6 bg-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-600 transition-colors">
            {buttonText}
        </button>
    </motion.div>
);

const CommunityCard: React.FC<{ community: Community, navigateTo: OnboardingViewProps['navigateTo'] }> = ({ community, navigateTo }) => (
    <div onClick={() => navigateTo('communityDetail', { communityId: community.id })} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-slate-100 flex items-center p-4 space-x-4">
        <img src={community.coverImageUrl} alt={community.name} className="h-20 w-20 object-cover rounded-lg" />
        <div className="flex-grow">
           <h3 className="text-xl font-bold text-slate-800">{community.name}</h3>
           <p className="text-slate-600 text-sm mt-1 line-clamp-2">{community.description}</p>
        </div>
        <span className="text-teal-500 font-bold">&rarr;</span>
    </div>
);

const SkuCard: React.FC<{ sku: SKU, navigateTo: OnboardingViewProps['navigateTo'] }> = ({ sku, navigateTo }) => (
    <div onClick={() => navigateTo('skuDetail', { sku })} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-slate-100 flex items-center p-4 space-x-4">
        <img src={`https://picsum.photos/seed/${sku.id}/200/200`} alt={sku.name} className="h-20 w-20 object-cover rounded-lg" />
        <div className="flex-grow">
           <h3 className="text-xl font-bold text-slate-800">{sku.name}</h3>
           <p className="text-slate-600 text-sm mt-1 line-clamp-2">{sku.description}</p>
        </div>
        <span className="text-teal-500 font-bold">&rarr;</span>
    </div>
);


export default OnboardingView;