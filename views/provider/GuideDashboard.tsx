

import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import type { Cohort, SKU, Provider } from '../../types';
import { formatDateTime } from '../../utils';
import { CheckCircleIcon } from '../../components/icons';

interface GuideDashboardProps {
    navigateTo: (view: string, data?: any) => void;
}

const GuideDashboard: React.FC<GuideDashboardProps> = ({ navigateTo }) => {
    const [provider, setProvider] = useState<Provider | null>(null);
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [activeTab, setActiveTab] = useState('cohorts');

    useEffect(() => {
        // Hardcoded guide ID for demo
        const guideId = 'prov-1';
        const fetchData = async () => {
            const providerData = await mockApi.getProviderById(guideId);
            setProvider(providerData || null);
            // In real app, this would be a specific API call
            // FIX: SKU does not have a 'cohorts' property. Cohorts exist on SkuVariant.
            const sku = await mockApi.getSkuById('sku-1');
            const allCohorts = sku?.variants.flatMap(v => v.cohorts) || [];
            setCohorts(allCohorts.filter(c => c.providerId === guideId));
        };
        fetchData();
    }, []);

    const ProviderScorecard: React.FC<{ provider: Provider }> = ({ provider }) => (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold">{provider.name}</h2>
                <p className="text-gray-600">Welcome to your Guide Dashboard.</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-semibold">On-time Start Rate</p>
                <p className="text-3xl font-bold text-teal-600">{provider.onTimeStartRate}%</p>
                 {provider.isTrusted && (
                    <div className="flex items-center justify-end space-x-1 text-sm text-teal-600 font-semibold mt-1">
                        <CheckCircleIcon />
                        <span>Trusted Provider</span>
                    </div>
                )}
            </div>
        </div>
    );
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'cohorts':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-xl font-bold">Your Cohorts</h3>
                           <button className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600">
                               + Publish New Cohort
                           </button>
                        </div>
                        <div className="space-y-4">
                            {cohorts.map(cohort => (
                                <div key={cohort.id} className="border p-4 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">Weekend Trek</p>
                                        <p className="text-sm text-gray-600">{formatDateTime(cohort.startDateTime, cohort.timeZone)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold">{cohort.attendees.length} / {cohort.capacity}</p>
                                        <p className="text-sm text-gray-500">Attendees</p>
                                    </div>
                                    <div>
                                        <button className="bg-gray-200 px-3 py-1 rounded-md text-sm hover:bg-gray-300">Manage</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'payouts':
                return (
                     <div className="bg-white p-6 rounded-lg shadow-md">
                         <h3 className="text-xl font-bold mb-4">Payouts</h3>
                         <div className="space-y-4">
                             <div className="flex justify-between items-center p-4 bg-green-50 rounded-md">
                                 <div>
                                     <p className="font-semibold">December Payout</p>
                                     <p className="text-sm text-green-700">Completed</p>
                                 </div>
                                 <p className="text-lg font-bold text-green-800">$4,570.00</p>
                             </div>
                              <div className="flex justify-between items-center p-4 bg-amber-50 rounded-md">
                                 <div>
                                     <p className="font-semibold">January Payout</p>
                                     <p className="text-sm text-amber-700">Pending</p>
                                 </div>
                                 <p className="text-lg font-bold text-amber-800">$1,250.00</p>
                             </div>
                         </div>
                    </div>
                );
        }
    };

    if (!provider) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <ProviderScorecard provider={provider} />
            <div className="flex border-b">
                 <button onClick={() => setActiveTab('cohorts')} className={`py-2 px-4 font-semibold ${activeTab === 'cohorts' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500'}`}>Cohorts</button>
                 <button onClick={() => setActiveTab('payouts')} className={`py-2 px-4 font-semibold ${activeTab === 'payouts' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500'}`}>Payouts</button>
            </div>
            {renderTabContent()}
        </div>
    );
};

export default GuideDashboard;
