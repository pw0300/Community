
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import type { Booking } from '../types';

interface AppState {
    // In a real app, user would be an object. We'll use ID for simplicity.
    userId: string;
    bookings: Booking[];
}

type Action = 
    | { type: 'ADD_BOOKING'; payload: Booking }
    | { type: 'CANCEL_BOOKING'; payload: { bookingId: string } };

const initialState: AppState = {
    userId: 'user-seeker-123',
    bookings: [],
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'ADD_BOOKING':
            return {
                ...state,
                bookings: [...state.bookings, action.payload],
            };
        case 'CANCEL_BOOKING':
            return {
                ...state,
                bookings: state.bookings.map(b => 
                    b.id === action.payload.bookingId ? { ...b, status: 'cancelled' } : b
                ),
            };
        default:
            return state;
    }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
