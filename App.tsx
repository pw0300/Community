

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import DiscoverView from './views/DiscoverView';
import SKUDetailView from './views/SKUDetailView';
import CheckoutView from './views/CheckoutView';
import CohortRoomView from './views/CohortRoomView';
import MyActivitiesView from './views/MyActivitiesView';
import CommunityHubView from './views/CommunityHubView';
import CommunityDetailView from './views/CommunityDetailView';
import JourneyMapView from './views/JourneyMapView';
import GuideDashboard from './views/provider/GuideDashboard';
import PartnerDashboard from './views/provider/PartnerDashboard';
import ConciergeAgent from './components/ConciergeAgent';
import LandingPage from './views/LandingPage';
import LandingHeader from './components/LandingHeader';
import LandingFooter from './components/LandingFooter';
import OnboardingView from './views/OnboardingView';
import type { SKU } from './types';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<string>('landing');
    const [selectedSku, setSelectedSku] = useState<SKU | null>(null);
    const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
    const [checkoutCohortId, setCheckoutCohortId] = useState<string | null>(null);
    const [activeCohortId, setActiveCohortId] = useState<string | null>(null);

    const [userMode, setUserMode] = useState<'seeker' | 'provider'>('seeker');
    const [providerRole, setProviderRole] = useState<'guide' | 'partner'>('guide');

    const navigateTo = (view: string, data?: any) => {
        if (view === 'skuDetail' && data?.sku) {
            setSelectedSku(data.sku);
        }
        if ((view === 'communityDetail' || view === 'journeyMap') && data?.communityId) {
            setSelectedCommunityId(data.communityId);
        }
        if (view === 'checkout' && data?.cohortId) {
            setCheckoutCohortId(data.cohortId);
        }
         if (view === 'cohortRoom' && data?.cohortId) {
            setActiveCohortId(data.cohortId);
        }
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    const renderSeekerView = () => {
        switch (currentView) {
            case 'discover':
                return <DiscoverView navigateTo={navigateTo} />;
            case 'skuDetail':
                return selectedSku ? <SKUDetailView sku={selectedSku} navigateTo={navigateTo} /> : <DiscoverView navigateTo={navigateTo} />;
            case 'checkout':
                return checkoutCohortId ? <CheckoutView cohortId={checkoutCohortId} navigateTo={navigateTo} /> : <DiscoverView navigateTo={navigateTo} />;
            case 'cohortRoom':
                 return activeCohortId ? <CohortRoomView cohortId={activeCohortId} navigateTo={navigateTo} /> : <MyActivitiesView navigateTo={navigateTo} />;
            case 'myActivities':
                return <MyActivitiesView navigateTo={navigateTo} />;
            case 'communityHub':
                return <CommunityHubView navigateTo={navigateTo} />;
            case 'communityDetail':
                return selectedCommunityId ? <CommunityDetailView communityId={selectedCommunityId} navigateTo={navigateTo} /> : <CommunityHubView navigateTo={navigateTo} />;
            case 'journeyMap':
                return selectedCommunityId ? <JourneyMapView communityId={selectedCommunityId} navigateTo={navigateTo} /> : <CommunityHubView navigateTo={navigateTo} />;
             case 'onboarding':
                return <OnboardingView navigateTo={navigateTo} />;
            default:
                return <DiscoverView navigateTo={navigateTo} />;
        }
    };
    
    const renderProviderView = () => {
        if (providerRole === 'guide') {
            return <GuideDashboard navigateTo={navigateTo} />;
        }
        if (providerRole === 'partner') {
            return <PartnerDashboard navigateTo={navigateTo} />;
        }
        return <div>Invalid Provider Role</div>;
    }
    
    if (currentView === 'landing') {
        return (
            <AppProvider>
                <div className="bg-white text-slate-800 antialiased">
                    <LandingHeader navigateTo={navigateTo} />
                    <LandingPage navigateTo={navigateTo} />
                    <LandingFooter />
                </div>
            </AppProvider>
        );
    }

    return (
        <AppProvider>
            <div className="min-h-screen bg-gray-50 font-sans">
                <Header 
                  userMode={userMode} 
                  setUserMode={setUserMode}
                  providerRole={providerRole}
                  setProviderRole={setProviderRole}
                  navigateTo={navigateTo} 
                />
                <main className="container mx-auto p-4 md:p-6 lg:p-8">
                    {userMode === 'seeker' ? renderSeekerView() : renderProviderView()}
                </main>
                {userMode === 'seeker' && <ConciergeAgent navigateTo={navigateTo} />}
            </div>
        </AppProvider>
    );
};

export default App;