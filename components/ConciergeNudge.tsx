import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConcierge } from '../context/ConciergeContext';
import { SparklesIcon } from './icons';

interface ConciergeNudgeProps {
    navigateTo: (view: string, data?: any) => void;
}

const ConciergeNudge: React.FC<ConciergeNudgeProps> = ({ navigateTo }) => {
    const { nudge, hideNudge } = useConcierge();

    useEffect(() => {
        if (nudge) {
            const timer = setTimeout(() => {
                hideNudge();
            }, 8000); // Nudge disappears after 8 seconds
            return () => clearTimeout(timer);
        }
    }, [nudge, hideNudge]);

    const handleActionClick = () => {
        if (nudge?.action) {
            const { type, view, data } = nudge.action;
            if (type === 'navigate') {
                navigateTo(view, data);
            }
        }
        hideNudge();
    };

    return (
        <AnimatePresence>
            {nudge && (
                <motion.div
                    key={nudge.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-28 right-6 z-40 bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden"
                >
                    <div className="p-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-teal-100 p-2 rounded-full mt-1">
                                <SparklesIcon className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-800">Your Concierge says:</p>
                                <p className="text-sm text-slate-600">{nudge.message}</p>
                                {nudge.actionText && nudge.action && (
                                    <button
                                        onClick={handleActionClick}
                                        className="mt-2 text-sm font-bold text-teal-600 hover:underline"
                                    >
                                        {nudge.actionText} &rarr;
                                    </button>
                                )}
                            </div>
                            <button onClick={hideNudge} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConciergeNudge;
