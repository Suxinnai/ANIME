import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

export const DailyQuote = () => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://api.bugpk.com/api/yiyan');
            if (!response.ok) throw new Error('Failed to fetch quote');
            const data = await response.text();
            setQuote(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <div className="my-8 p-6 bg-white/5 dark:bg-white/5 rounded-2xl border-2 border-anime-dark/10 dark:border-white/10 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={80} />
            </div>

            <div className="relative z-10">
                {loading ? (
                    <div className="flex items-center gap-3 text-anime-dark/50 dark:text-gray-400 animate-pulse">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>正在捕捉此时此刻的灵感...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-sm">灵感掉线了：{error}</div>
                ) : (
                    <>
                        <div className="mb-4">
                            {quote.split('/&/').map((part, index) => (
                                <p
                                    key={index}
                                    className={index === 0
                                        ? "text-lg md:text-xl font-display font-medium text-anime-dark dark:text-white leading-relaxed mb-2 italic"
                                        : "text-base md:text-lg font-sans text-anime-dark/70 dark:text-gray-300 leading-relaxed"
                                    }
                                >
                                    {part.trim()}
                                </p>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-anime-dark/5 dark:border-white/5">
                            <span className="text-xs uppercase tracking-widest text-anime-pink font-bold">每日一言 · Daily Quote</span>
                            <button
                                onClick={fetchQuote}
                                className="p-2 hover:bg-anime-pink/10 rounded-full transition-colors text-anime-dark/60 dark:text-gray-400 hover:text-anime-pink"
                                title="换一句"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
