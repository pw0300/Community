import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import type { Community } from '../types';
import ClubDetailView from './templates/ClubDetailView';
import GuildDetailView from './templates/GuildDetailView';
import { useAppContext } from '../context/AppContext';

interface CommunityDetailViewProps {
    communityId: string;
    navigateTo: (view: string, data?: any) => void;
}

const CommunityDetailView: React.FC<CommunityDetailViewProps> = ({ communityId, navigateTo }) => {
    const { state: { joinedCommunityIds } } = useAppContext();
    const [community, setCommunity] = useState<Community | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isMember = joinedCommunityIds.has(communityId);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setIsLoading(true);
            const communityData = await mockApi.getCommunityById(communityId);
            if (isMounted) {
                setCommunity(communityData || null);
                setIsLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; }
    }, [communityId]);

    if (isLoading) {
        return <div className="text-center p-10">Loading Community...</div>;
    }

    if (!community) {
        return <div className="text-center p-10">Community not found.</div>;
    }

    const viewProps = { community, navigateTo, isMember };

    if (community.type === 'club') {
        return <ClubDetailView {...viewProps} />;
    }
    
    if (community.type === 'guild') {
        return <GuildDetailView {...viewProps} />;
    }

    return <div className="text-center p-10">Invalid community type.</div>;
};

export default CommunityDetailView;
