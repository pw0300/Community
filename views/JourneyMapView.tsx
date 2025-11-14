import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '../services/mockApi';
import type { Community, Milestone, SKU, Cohort, Provider } from '../types';
import * as Icons from '../components/icons';
import { formatDateTime } from '../utils';

interface JourneyMapViewProps {
    communityId: string;
    navigateTo: (view: string, data?: any) => void;
}

const MilestoneNode: React.FC<{
    milestone: Milestone,
    index: number,
    isCompleted: boolean,
    isNext: boolean,
    onSelect: () => void,
}> = ({ milestone, index, isCompleted, isNext, onSelect }) => {
    
    const Icon = milestone.type === 'community'
        ? Icons.ChatBubbleIcon
        : Icons[milestone.skuId === 'sku-1' ? 'HikingBootIcon' : 'SparklesIcon' as keyof typeof Icons];
    
    const nodeColor = isCompleted ? 'bg-teal-500' : isNext ? 'bg-amber-500' : 'bg-slate-300';
    const textColor = isCompleted ? 'text-teal-600' : isNext ? 'text-amber-600' : 'text-slate-500';
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center w-full"
            style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}
        >
            <div className={`w-1/2 p-4 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <h3 className={`font-bold ${textColor}`}>{milestone.title}</h3>
                <p className="text-sm text-slate-600">{milestone.description}</p>
            </div>
            <div className="relative w-16 flex-shrink-0 flex justify-center">
                <div
                    onClick={onSelect}
                    className={`h-16 w-16 rounded-full ${nodeColor} flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform hover:scale-110`}
                >
                    {isCompleted ? <Icons.CheckCircleIcon className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                </div>
            </div>
            <div className="w-1/2"></div>
        </motion.div>
    );
};


const JourneyMapView: React.FC<JourneyMapViewProps> = ({ communityId, navigateTo }) => {
    const [community, setCommunity] = useState<Community | null>(null);
    const [skus, setSkus] = useState<Map<string, SKU>>(new Map());
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
    const [skuDetails, setSkuDetails] = useState<{sku: SKU, cohort: Cohort, provider: Provider} | null>(null);

    const userProgress = 1; // Mock user has completed the first milestone

    useEffect(() => {
        const fetchData = async () => {
            const communityData = await mockApi.getCommunityById(communityId);
            setCommunity(communityData || null);

            if (communityData?.journeyMap) {
                const skuIds = communityData.journeyMap.filter(m => m.type === 'sku').map(m => m.skuId!);
                const skuData = await Promise.all(skuIds.map(id => mockApi.getSkuById(id)));
                const skuMap = new Map<string, SKU>();
                skuData.forEach(s => s && skuMap.set(s.id, s));
                setSkus(skuMap);
            }
        };
        fetchData();
    }, [communityId]);

    const handleSelectMilestone = async (milestone: Milestone) => {
        setSelectedMilestone(milestone);
        if (milestone.type === 'sku' && milestone.skuId) {
            const sku = skus.get(milestone.skuId);
            if (sku) {
                 const nextCohort = sku.variants.flatMap(v => v.cohorts).filter(c => c.startDateTime > new Date()).sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())[0];
                 if (nextCohort) {
                     const provider = await mockApi.getProviderById(nextCohort.providerId);
                     if (provider) {
                         setSkuDetails({ sku, cohort: nextCohort, provider });
                     }
                 }
            }
        }
    };

    const closeModal = () => {
        setSelectedMilestone(null);
        setSkuDetails(null);
    }

    if (!community) return <div>Loading journey...</div>;

    return (
        <>
            <div className="relative overflow-hidden">
                {/* Background Map */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20" 
                    style={{ backgroundImage: 'url(https://picsum.photos/seed/map-bg/2000/3000)' }}
                ></div>
                
                <div className="relative min-h-screen">
                    {/* Header */}
                    <div className="sticky top-20 z-20 bg-white/70 backdrop-blur-md p-4 rounded-b-xl shadow-md container mx-auto">
                        <h1 className="text-3xl font-bold text-slate-800">{community.name} Journey</h1>
                        <p className="text-slate-600">Your path to becoming a Peak Performer.</p>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                           <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${(userProgress / (community.journeyMap?.length || 1)) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Path and Milestones */}
                    <div className="container mx-auto py-12 relative">
                        {/* The Path Line */}
                        <div className="absolute top-0 left-1/2 w-1 bg-slate-300 h-full -ml-0.5"></div>
                        
                        <div className="space-y-8">
                            {community.journeyMap?.map((milestone, index) => (
                                <MilestoneNode
                                    key={milestone.id}
                                    milestone={milestone}
                                    index={index}
                                    isCompleted={index < userProgress}
                                    isNext={index === userProgress}
                                    onSelect={() => handleSelectMilestone(milestone)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedMilestone && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                             {selectedMilestone.type === 'community' && (
                                <div className="p-6 text-center">
                                    <Icons.ChatBubbleIcon className="w-12 h-12 mx-auto text-teal-500" />
                                    <h2 className="text-2xl font-bold mt-4">{selectedMilestone.title}</h2>
                                    <p className="text-slate-600 mt-2">{selectedMilestone.description}</p>
                                    <button onClick={closeModal} className="mt-6 bg-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-600">Mark as Complete</button>
                                </div>
                            )}

                             {selectedMilestone.type === 'sku' && skuDetails && (
                                <div>
                                    <img src={`https://picsum.photos/seed/${skuDetails.sku.id}/600/300`} className="w-full h-48 object-cover"/>
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold">{skuDetails.sku.name}</h2>
                                        <p className="text-slate-600 mt-2">{skuDetails.sku.description}</p>
                                        <div className="mt-4 bg-slate-50 p-3 rounded-lg">
                                            <p className="font-semibold">Next Cohort:</p>
                                            <p>{formatDateTime(skuDetails.cohort.startDateTime, skuDetails.cohort.timeZone)}</p>
                                            <p className="text-sm">with {skuDetails.provider.name}</p>
                                        </div>
                                         <div className="mt-4 flex justify-between items-center">
                                            <div>
                                                {/* FIX: The Cohort object does not have a variant/price. Find the variant via skuVariantId to get the price. */}
                                                <p className="text-3xl font-bold">${skuDetails.sku.variants.find(v => v.id === skuDetails.cohort.skuVariantId)?.price}</p>
                                                <div className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-bold rounded-full inline-block mt-1 animate-pulse">
                                                    {skuDetails.cohort.capacity - skuDetails.cohort.attendees.length} SEATS LEFT
                                                </div>
                                            </div>
                                            <button onClick={() => navigateTo('checkout', { cohortId: skuDetails.cohort.id })} className="bg-teal-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-teal-600 transition-transform transform hover:scale-105">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                             {selectedMilestone.type === 'sku' && !skuDetails && <div className="p-6 text-center">Loading experience details...</div>}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default JourneyMapView;