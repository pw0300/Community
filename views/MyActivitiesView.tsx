

import React, { useState, useEffect, useMemo } from 'react';
import { mockApi } from '../services/mockApi';
import { getWhatsNextSuggestion } from '../services/geminiService';
import type { Booking, Cohort, SKU } from '../types';
import { formatDateTime } from '../utils';
import { SparklesIcon } from '../components/icons';
import PassportView from './PassportView';

interface MyActivitiesViewProps {
    navigateTo: (view: string, data?: any) => void;
}

type ActivityDetails = { cohort: Cohort; sku: SKU };
type Suggestion = { skuName: string; reason: string; skuId: string };

const MyActivitiesView: React.FC<MyActivitiesViewProps> = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [details, setDetails] = useState<Map<string, ActivityDetails>>(new Map());
    const [suggestions, setSuggestions] = useState<Map<string, Suggestion | null>>(new Map());
    const [areSuggestionsLoading, setAreSuggestionsLoading] = useState(true);
    const [navigatingSkuId, setNavigatingSkuId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

    const categorizedBookings = useMemo(() => {
        const current: Booking[] = [];
        const past: Booking[] = [];

        bookings.forEach(b => {
            const detail = details.get(b.cohortId);
            if (!detail) return;
            
            if (b.status === 'completed' || (b.status === 'confirmed' && detail.cohort.endDateTime < new Date())) {
                past.push(b);
            } else if (b.status === 'waitlisted' || b.status === 'confirmed') {
                current.push(b);
            }
        });
        return { current, past };
    }, [bookings, details]);

    useEffect(() => {
        const fetchActivities = async () => {
            setIsLoading(true);
            const userBookings = await mockApi.getUserBookings('user-seeker-123');
            const detailsMap = new Map<string, ActivityDetails>();
            
            const allSkus = await mockApi.getAllSkus();

            await Promise.all(userBookings.map(async (booking) => {
                const cohort = await mockApi.getCohortById(booking.cohortId);
                if (cohort) {
                    const sku = allSkus.find(s => s.variants.some(v => v.id === cohort.skuVariantId));
                    if (sku) {
                        detailsMap.set(booking.cohortId, { cohort, sku });
                    }
                }
            }));

            setBookings(userBookings);
            setDetails(detailsMap);
            setIsLoading(false);
        };
        fetchActivities();
    }, []);

    useEffect(() => {
        if (!isLoading && categorizedBookings.past.length > 0) {
            const fetchSuggestions = async () => {
                setAreSuggestionsLoading(true);
                const suggestionsMap = new Map<string, Suggestion | null>();
                
                await Promise.all(categorizedBookings.past.map(async (booking) => {
                    const detail = details.get(booking.cohortId);
                    if (detail) {
                        const suggestion = await getWhatsNextSuggestion(detail.sku.name);
                        suggestionsMap.set(booking.id, suggestion);
                    }
                }));

                setSuggestions(suggestionsMap);
                setAreSuggestionsLoading(false);
            };
            fetchSuggestions();
        } else if (!isLoading) {
             setAreSuggestionsLoading(false);
        }
    }, [isLoading, categorizedBookings.past, details]);

    const handleExploreClick = async (skuId: string) => {
        setNavigatingSkuId(skuId);
        const sku = await mockApi.getSkuById(skuId);
        if (sku) {
            navigateTo('skuDetail', { sku });
        }
        setNavigatingSkuId(null);
    };
    
    const ActivityCard: React.FC<{ booking: Booking }> = ({ booking }) => {
        const detail = details.get(booking.cohortId);
        if (!detail) return null;

        const { sku, cohort } = detail;
        const suggestion = suggestions.get(booking.id);

        const isUpcoming = booking.status === 'confirmed' && cohort.endDateTime > new Date();
        const isWaitlisted = booking.status === 'waitlisted';
        
        const statusStyles = {
            upcoming: {
                borderColor: 'border-teal-500',
                bgColor: 'bg-teal-500',
                label: 'Upcoming'
            },
            waitlisted: {
                borderColor: 'border-amber-500',
                bgColor: 'bg-amber-500',
                label: 'Waitlisted'
            },
        };
        
        const currentStatus = isUpcoming ? statusStyles.upcoming : statusStyles.waitlisted;

        return (
             <div className={`bg-white rounded-xl shadow-lg border-l-4 ${currentStatus.borderColor} transition-shadow hover:shadow-xl flex flex-col md:flex-row overflow-hidden`}>
                <div className="p-6">
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${currentStatus.bgColor} text-white mb-3`}>{currentStatus.label}</span>
                    <h3 className="text-xl font-bold text-slate-800">{sku.name}</h3>
                    <p className="text-slate-500 text-sm">{formatDateTime(cohort.startDateTime, cohort.timeZone)}</p>
                    {isUpcoming && (
                        <button onClick={() => navigateTo('cohortRoom', { cohortId: cohort.id })} className="mt-4 w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600">
                            Enter Cohort Room
                        </button>
                    )}
                     {isWaitlisted && (
                         <p className="text-slate-600 mt-4">You'll be notified if a spot opens up. You can also explore other dates for this activity.</p>
                    )}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <div>Loading your activities...</div>
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">My Activities</h1>
                <p className="text-slate-600">Your personal hub for all your GrowthQuest journeys.</p>
            </header>

            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'current'
                                ? 'border-teal-500 text-teal-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        Current & Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'past'
                                ? 'border-teal-500 text-teal-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        My Passport
                    </button>
                </nav>
            </div>

            {activeTab === 'current' && (
                <section>
                    {categorizedBookings.current.length > 0 ? (
                        <div className="space-y-6">
                            {categorizedBookings.current.map(b => <ActivityCard key={b.id} booking={b} />)}
                        </div>
                    ) : <p className="text-slate-500 bg-white p-6 rounded-lg shadow-sm text-center">No upcoming activities. Time to discover something new!</p>}
                </section>
            )}

            {activeTab === 'past' && (
                 <PassportView 
                    pastBookings={categorizedBookings.past}
                    details={details}
                    navigateTo={navigateTo}
                 />
            )}
        </div>
    );
};

export default MyActivitiesView;