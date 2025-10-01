'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const DeviceContext = createContext();

export function DeviceProvider({ children }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkDevice = () => {
            // Check if screen width is mobile size OR if device has touch capability
            const mobile = window.matchMedia('(max-width: 768px)').matches ||
                          ('ontouchstart' in window && !window.matchMedia('(min-width: 1024px)').matches);
            setIsMobile(mobile);
            setIsLoading(false);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return (
        <DeviceContext.Provider value={{ isMobile, isLoading }}>
            {children}
        </DeviceContext.Provider>
    );
}

export function useDevice() {
    const context = useContext(DeviceContext);
    if (context === undefined) {
        throw new Error('useDevice must be used within a DeviceProvider');
    }
    return context;
}
