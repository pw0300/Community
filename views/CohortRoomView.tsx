

import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import type { Cohort, SKU, Provider, ChecklistItem as ChecklistItemType } from '../types';
import { formatDateTime, formatTimeAgo } from '../utils';

interface CohortRoomViewProps {
    cohortId: string;
    navigateTo: (view: string, data?: any) => void;
}

const CohortRoomView: React.FC<CohortRoomViewProps> = ({ cohortId, navigateTo }) => {
    const [cohort, setCohort] = useState<Cohort | null>(null);
    const [sku, setSku] = useState<SKU | null>(null);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [activeTab, setActiveTab] = useState('checklist');
    const [checklist, setChecklist] = useState<ChecklistItemType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const cohortData = await mockApi.getCohortById(cohortId);
            setCohort(cohortData || null);
            setChecklist(cohortData?.checklist || []);

            if (cohortData) {
                // FIX: Find the SKU using the cohort's skuVariantId, as Cohort type does not have skuId.
                const allSkus = await mockApi.getAllSkus();
                const skuData = allSkus.find(s => s.variants.some(v => v.id === cohortData.skuVariantId));
                setSku(skuData || null);
                const providerData = await mockApi.getProviderById(cohortData.providerId);
                setProvider(providerData || null);
            }
        };
        fetchData();
    }, [cohortId]);

    const handleChecklistItemToggle = (itemId: string) => {
        setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item));
    };
    
    const checklistProgress = checklist.length > 0 ? (checklist.filter(i => i.completed).length / checklist.length) * 100 : 0;

    const isLive = cohort && new Date() >= cohort.startDateTime && new Date() <= cohort.endDateTime;

    if (!cohort || !sku || !provider) {
        return <div>Loading Cohort Room...</div>
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'checklist':
                return (
                    <div>
                         <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${checklistProgress}%` }}></div>
                         </div>
                        <ul className="space-y-3">
                            {checklist.map(item => (
                                <li key={item.id} className="flex items-center">
                                    <input
                                        id={`item-${item.id}`}
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={() => handleChecklistItemToggle(item.id)}
                                        className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                                    />
                                    <label htmlFor={`item-${item.id}`} className={`ml-3 text-gray-700 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                                        {item.text}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'announcements':
                return (
                    <div className="space-y-4">
                        {cohort.announcements.length > 0 ? cohort.announcements.map(ann => (
                            <div key={ann.id} className="bg-teal-50 p-4 rounded-lg">
                                <p className="text-gray-800">{ann.content}</p>
                                <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(ann.timestamp)}</p>
                            </div>
                        )) : <p>No announcements yet.</p>}
                    </div>
                );
            case 'chat':
                return (
                     <div className="space-y-4">
                        {cohort.chat.map(msg => (
                             <div key={msg.id} className={`flex items-start space-x-3 ${msg.authorId === 'user-seeker-123' ? 'justify-end' : ''}`}>
                                {msg.authorId !== 'user-seeker-123' && <img src="https://picsum.photos/seed/jane/100/100" className="h-8 w-8 rounded-full" />}
                                <div className={`p-3 rounded-lg ${msg.authorId === 'user-seeker-123' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
                                    <p>{msg.content}</p>
                                </div>
                             </div>
                        ))}
                         <div className="mt-4 flex">
                           <input type="text" placeholder="Type a message..." className="flex-1 border rounded-l-lg p-2 focus:ring-teal-500 focus:border-teal-500"/>
                           <button className="bg-teal-500 text-white px-4 rounded-r-lg">Send</button>
                         </div>
                    </div>
                );
        }
    }
    
    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
            <header className="border-b pb-4 mb-6">
                {isLive && (
                    <div className="inline-block bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-2 animate-pulse">
                        LIVE NOW
                    </div>
                )}
                <h1 className="text-3xl font-bold">{sku.name}</h1>
                <p className="text-gray-600">with {provider.name}</p>
                <p className="text-sm text-gray-500 mt-1">{formatDateTime(cohort.startDateTime, cohort.timeZone)}</p>
            </header>

            <div className="flex border-b mb-6">
                <button onClick={() => setActiveTab('checklist')} className={`py-2 px-4 font-semibold ${activeTab === 'checklist' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500'}`}>Checklist</button>
                <button onClick={() => setActiveTab('announcements')} className={`py-2 px-4 font-semibold ${activeTab === 'announcements' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500'}`}>Announcements</button>
                <button onClick={() => setActiveTab('chat')} className={`py-2 px-4 font-semibold ${activeTab === 'chat' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500'}`}>Chat</button>
            </div>
            
            <div>{renderTabContent()}</div>
        </div>
    );
};

export default CohortRoomView;
