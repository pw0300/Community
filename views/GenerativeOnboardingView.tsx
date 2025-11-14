import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '../services/mockApi';
import { generateOnboardingQuestion } from '../services/geminiService';
import type { Community } from '../types';
import { SparklesIcon } from '../components/icons';

interface GenerativeOnboardingViewProps {
    navigateTo: (view: string, data?: any) => void;
}

const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
};

interface OnboardingState {
    question: string;
    options: string[];
    isFinal: boolean;
    recommendedCommunityIds?: string[];
}

const GenerativeOnboardingView: React.FC<GenerativeOnboardingViewProps> = ({ navigateTo }) => {
    const [step, setStep] = useState(0); // 0: Intro, 1: Quiz, 2: Loading, 3: Results
    const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
    const [currentState, setCurrentState] = useState<OnboardingState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recommendedCommunities, setRecommendedCommunities] = useState<Community[]>([]);

    const fetchNextStep = useCallback(async (currentHistory: { question: string; answer: string }[]) => {
        setIsLoading(true);
        const nextState = await generateOnboardingQuestion(currentHistory);
        setCurrentState(nextState);
        setIsLoading(false);

        if (nextState.isFinal && nextState.recommendedCommunityIds) {
            setStep(3); // Go to results step
            const communitiesData = await Promise.all(
                nextState.recommendedCommunityIds.map(id => mockApi.getCommunityById(id))
            );
            setRecommendedCommunities(communitiesData.filter(Boolean) as Community[]);
        }
    }, []);

    useEffect(() => {
        if (step === 1) {
            fetchNextStep(history);
        }
    }, [step, history, fetchNextStep]);
    
    const handleAnswer = (answer: string) => {
        if (!currentState) return;
        const newHistory = [...history, { question: currentState.question, answer }];
        setHistory(newHistory);
        fetchNextStep(newHistory);
    };

    const handleCommunityClick = (community: Community) => {
        navigateTo(community.type === 'club' ? 'journeyMap' : 'communityDetail', { communityId: community.id });
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 p-4">
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div
                        key="step0"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-center max-w-2xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Let's Find Your Path</h1>
                        <p className="mt-4 text-lg text-slate-600">Answer a few quick questions to help our AI Concierge curate the perfect starting point for your growth journey.</p>
                        <button
                            onClick={() => setStep(1)}
                            className="mt-8 bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg"
                        >
                            Let's Begin
                        </button>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div
                        key={`quiz-step-${history.length}`}
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full max-w-2xl text-center"
                    >
                        {isLoading || !currentState ? (
                             <div className="text-center">
                                <SparklesIcon className="w-12 h-12 text-teal-500 mx-auto animate-pulse" />
                                <p className="mt-4 text-xl font-semibold text-slate-700">Thinking...</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold tracking-tight mb-8">{currentState.question}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentState.options.map(option => (
                                        <motion.button
                                            key={option}
                                            onClick={() => handleAnswer(option)}
                                            className="w-full bg-white p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-teal-400 transition-colors text-lg font-semibold"
                                            whileHover={{ y: -5 }}
                                        >
                                            {option}
                                        </motion.button>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
                
                {step === 3 && (
                     <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full max-w-3xl"
                    >
                         <h2 className="text-3xl font-bold text-center tracking-tight mb-2">Your Starting Point</h2>
                         <p className="text-center text-slate-600 mb-8">Based on your answers, here are the communities where you'll thrive.</p>
                         <div className="space-y-4">
                            {recommendedCommunities.map(community => (
                                <div key={community.id} onClick={() => handleCommunityClick(community)} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-slate-100 flex items-center p-4 space-x-4">
                                    <img src={community.coverImageUrl} alt={community.name} className="h-20 w-20 object-cover rounded-lg" />
                                    <div className="flex-grow">
                                       <h3 className="text-xl font-bold text-slate-800">{community.name}</h3>
                                       <p className="text-slate-600 text-sm mt-1 line-clamp-2">{community.description}</p>
                                    </div>
                                    <span className="text-teal-500 font-bold">&rarr;</span>
                                </div>
                            ))}
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

export default GenerativeOnboardingView;
