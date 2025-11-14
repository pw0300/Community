
export const formatDateTime = (date: Date, timeZone: string, options?: Intl.DateTimeFormatOptions): string => {
    let effectiveOptions: Intl.DateTimeFormatOptions;

    if (options && (options.dateStyle || options.timeStyle)) {
        // If style options are provided, don't mix them with component options.
        effectiveOptions = {
            ...options,
            timeZone: timeZone,
        };
    } else {
        // Default component options.
        effectiveOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short',
            ...options,
            timeZone: timeZone,
        };
    }
    
    try {
        return new Intl.DateTimeFormat('en-US', effectiveOptions).format(date);
    } catch (e) {
        // Fallback for invalid timezone
        const fallbackOptions = { ...effectiveOptions, timeZone: undefined };
        return new Intl.DateTimeFormat('en-US', fallbackOptions).format(date);
    }
};

export const formatDate = (date: Date, timeZone: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    
    try {
        return new Intl.DateTimeFormat('en-US', { ...options, timeZone }).format(date);
    } catch (e) {
        // Fallback for invalid timezone
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
};

export const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
}