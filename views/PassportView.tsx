import React, { useMemo, useEffect } from 'react';
import type { Booking, Cohort, SKU } from '../types';
import * as Icons from '../components/icons';
import { useConcierge } from '../context/ConciergeContext';

interface PassportViewProps {
    pastBookings: Booking[];
    details: Map<string, { cohort: Cohort; sku: SKU }>;
    navigateTo: (view: string, data?: any) => void;
}

const PassportView: React.FC<PassportViewProps> = ({ pastBookings, details, navigateTo }) => {
    const { showNudge } = useConcierge();

    const completedActivities = useMemo(() => {
        return pastBookings
            .map(booking => {
                const detail = details.get(booking.cohortId);
                if (!detail) return null;
                return { booking, ...detail };
            })
            .filter(Boolean)
            .sort((a,b) => b!.cohort.endDateTime.getTime() - a!.cohort.endDateTime.getTime());
    }, [pastBookings, details]);
    
    useEffect(() => {
        // Find the most recently completed activity to trigger a nudge
        if (completedActivities.length > 0) {
            const mostRecent = completedActivities[0];
            const timeSinceCompletion = new Date().getTime() - mostRecent!.cohort.endDateTime.getTime();
            
            // If completed within the last day, show a nudge
            if (timeSinceCompletion < 24 * 60 * 60 * 1000) {
                 showNudge({
                    message: `Congratulations on completing the ${mostRecent!.sku.name}! Why not share your key takeaways with the community?`,
                    actionText: `Share in '${mostRecent!.sku.communityId === 'comm-1' ? 'Peak Performers' : 'Future Leaders'}'`,
                    action: {
                        type: 'navigate',
                        view: 'communityDetail',
                        data: { communityId: mostRecent!.sku.communityId }
                    }
                });
            }
        }
    }, [completedActivities, showNudge]);

    if (completedActivities.length === 0) {
        return (
            <div className="text-center bg-white p-10 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold">Your Passport is Ready!</h2>
                <p className="text-slate-600 mt-2">Complete an activity to earn your first stamp and start your collection.</p>
                <button
                    onClick={() => navigateTo('discover')}
                    className="mt-6 bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg"
                >
                    Start a New Adventure
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in-up border-4 border-slate-200">
            <div className="text-center border-b-2 border-dashed pb-4 mb-6">
                <h1 className="text-3xl font-bold text-slate-800 tracking-wider uppercase">Passport</h1>
                <p className="text-slate-500">Your Record of Growth & Adventure</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {completedActivities.map(activity => {
                    if (!activity) return null;
                    const { sku, cohort } = activity;
                    const StampIcon = Icons[sku.stampIcon as keyof typeof Icons] || Icons.SparklesIcon;

                    return (
                        <div
                            key={activity.booking.id}
                            className="group relative aspect-square bg-gradient-to-br from-teal-50 to-amber-50 rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-lg border-2 border-slate-200 border-dashed cursor-pointer transition-transform hover:-rotate-3 hover:scale-105"
                            onClick={() => navigateTo('skuDetail', { sku })}
                        >
                            <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-lg font-bold text-teal-800">
                                View Details
                            </div>
                            <div>
                                <h3 className="font-bold text-teal-900 leading-tight">{sku.name}</h3>
                                <p className="text-xs text-slate-500">{cohort.location || 'Online'}</p>
                            </div>

                            <div className="my-4">
                               <StampIcon className="w-16 h-16 text-teal-600 opacity-80" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Completed</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {new Date(cohort.endDateTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PassportView;
