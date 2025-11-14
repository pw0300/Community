import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { ConciergeNudge } from '../types';

interface ConciergeContextType {
    nudge: ConciergeNudge | null;
    showNudge: (nudge: Omit<ConciergeNudge, 'id'>) => void;
    hideNudge: () => void;
}

const ConciergeContext = createContext<ConciergeContextType | undefined>(undefined);

export const ConciergeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nudge, setNudge] = useState<ConciergeNudge | null>(null);

    const showNudge = useCallback((nudgeData: Omit<ConciergeNudge, 'id'>) => {
        setNudge({ ...nudgeData, id: `nudge-${Date.now()}` });
    }, []);

    const hideNudge = useCallback(() => {
        setNudge(null);
    }, []);

    return (
        <ConciergeContext.Provider value={{ nudge, showNudge, hideNudge }}>
            {children}
        </ConciergeContext.Provider>
    );
};

export const useConcierge = () => {
    const context = useContext(ConciergeContext);
    if (context === undefined) {
        throw new Error('useConcierge must be used within a ConciergeProvider');
    }
    return context;
};
