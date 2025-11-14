
import React, { useState, useEffect } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { mockApi } from '../services/mockApi';
import { getAiBundleSuggestion } from '../services/geminiService';
import type { Cohort, SKU } from '../types';
import { formatDateTime } from '../utils';
import { SparklesIcon } from '../components/icons';


interface CheckoutViewProps {
    cohortId: string;
    navigateTo: (view: string, data?: any) => void;
}

interface AddOn {
    id: string;
    name: string;
    price: number;
}

interface AiBundle {
    skuName: string;
    discount: number;
    reason: string;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ cohortId, navigateTo }) => {
    const { minutes, seconds, isFinished } = useCountdown(15);
    const [cohort, setCohort] = useState<Cohort | null>(null);
    const [sku, setSku] = useState<SKU | null>(null);
    const [addOns, setAddOns] = useState<AddOn[]>([]);
    const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
    const [aiBundle, setAiBundle] = useState<AiBundle | null>(null);
    const [includeBundle, setIncludeBundle] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            const cohortData = await mockApi.getCohortById(cohortId);
            if (cohortData) {
                setCohort(cohortData);
                // FIX: Find the SKU using the cohort's skuVariantId, as Cohort type does not have skuId.
                const allSkus = await mockApi.getAllSkus();
                const skuData = allSkus.find(s => s.variants.some(v => v.id === cohortData.skuVariantId));
                setSku(skuData || null);
                
                if (skuData) {
                    const bundleSuggestion = await getAiBundleSuggestion(skuData.name);
                    setAiBundle(bundleSuggestion);
                }
            }
            const availableAddOns = await mockApi.getAddOns();
            setAddOns(availableAddOns);
        };
        fetchData();
    }, [cohortId]);

    const handleAddOnToggle = (addOnId: string) => {
        const newSet = new Set(selectedAddOns);
        if (newSet.has(addOnId)) {
            newSet.delete(addOnId);
        } else {
            newSet.add(addOnId);
        }
        setSelectedAddOns(newSet);
    };

    const calculateTotal = () => {
        // FIX: The Cohort object does not have a price. The price is on the SkuVariant.
        const variant = sku?.variants.find(v => v.id === cohort?.skuVariantId);
        let total = variant?.price || 0;
        selectedAddOns.forEach(id => {
            const addOn = addOns.find(a => a.id === id);
            if (addOn) total += addOn.price;
        });
        if(includeBundle && aiBundle){
            // Fake price for demo
            total += (250 * (1 - (aiBundle.discount/100)));
        }
        return total.toFixed(2);
    };
    
    if (!cohort || !sku) {
        return <div>Loading checkout...</div>;
    }
    
    if (isFinished) {
        return (
            <div className="text-center p-10 bg-white rounded-xl shadow-xl">
                <h2 className="text-2xl font-bold text-red-600">Your session has expired!</h2>
                <p className="mt-2 text-slate-600">Your hold on this seat has been released. Please try again.</p>
                <button onClick={() => navigateTo('skuDetail', { sku })} className="mt-6 bg-teal-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-600">
                    Return to Options
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-900 p-4 rounded-lg mb-8 flex items-center justify-between shadow-md" role="alert">
                <p className="font-bold">Your seat is held for:</p> 
                <span className="text-2xl font-mono bg-white/50 px-3 py-1 rounded-md tracking-widest">{minutes}:{seconds}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Order details */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    
                    <div className="border-b pb-4">
                        <h3 className="font-semibold text-lg text-slate-800">{sku.name}</h3>
                        <p className="text-slate-600">{formatDateTime(cohort.startDateTime, cohort.timeZone)}</p>
                        <p className="text-lg font-bold text-right text-slate-800">${(sku.variants.find(v => v.id === cohort.skuVariantId)?.price || 0).toFixed(2)}</p>
                    </div>

                    <div className="py-4 border-b">
                        <h3 className="font-semibold text-slate-800">Optional Add-ons</h3>
                        <div className="space-y-2 mt-2">
                            {addOns.map(addOn => (
                                <div key={addOn.id} className="flex justify-between items-center">
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" onChange={() => handleAddOnToggle(addOn.id)} className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"/>
                                        <span>{addOn.name}</span>
                                    </label>
                                    <span>+${addOn.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {aiBundle && (
                        <div className="py-4 my-4 relative bg-teal-50 rounded-xl p-4 border border-teal-200">
                             <div className="absolute -top-3 -left-3 bg-white p-1 rounded-full shadow-md">
                                <SparklesIcon className="w-6 h-6 text-amber-500" />
                            </div>
                             <h3 className="font-semibold text-teal-800">AI Suggestion: Complete your quest!</h3>
                             <p className="text-sm text-teal-700 italic mt-1">"{aiBundle.reason}"</p>
                             <div className="mt-3 flex justify-between items-center">
                                <label className="flex items-center space-x-2 font-medium">
                                    <input type="checkbox" onChange={(e) => setIncludeBundle(e.target.checked)} className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"/>
                                    <span>Add: {aiBundle.skuName}</span>
                                </label>
                                <span className="font-bold text-teal-600 bg-teal-200 px-2 py-0.5 rounded-full text-sm">{aiBundle.discount}% OFF</span>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
                    </div>
                </div>

                {/* Right side: Payment form */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
                    {/* Mock payment form */}
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Card Number</label>
                            <input type="text" placeholder="**** **** **** 1234" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
                        </div>
                         <div className="flex space-x-4">
                            <div className="flex-1">
                               <label className="block text-sm font-medium text-slate-700">Expiry</label>
                               <input type="text" placeholder="MM/YY" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
                           </div>
                            <div className="flex-1">
                               <label className="block text-sm font-medium text-slate-700">CVC</label>
                               <input type="text" placeholder="123" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
                           </div>
                        </div>
                    </div>
                    <button onClick={() => navigateTo('cohortRoom', { cohortId: cohort.id })} className="w-full mt-6 bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600 transition-colors">
                        Confirm & Pay
                    </button>
                    <p className="text-xs text-slate-500 mt-4 text-center">
                        By confirming, you agree to the GrowthQuest Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutView;
