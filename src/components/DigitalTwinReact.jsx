
import React, { useState, useEffect } from 'react';
import { Zap, Wifi, MapPin, Smartphone, Activity, Globe, Music, Code, Coffee, MessageSquare } from 'lucide-react';

export default function DigitalTwinReact() {
    const [data, setData] = useState({
        network: "Ethernet",
        location: "Chongqing", // 重庆
        device: "Workstation",
        app: "VS Code",
        mood: "Focusing", // 默认状态
        isCharging: true
    });
    const [loading, setLoading] = useState(true);
    // 轮询获取状态
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取硬件电量数据
                const res = await fetch('/api/status/get');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error("Status fetch failed", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Initial load
        const interval = setInterval(fetchData, 5000); // Poll every 5s

        return () => clearInterval(interval);
    }, []);

    // 识别网络类型
    const getNetworkIcon = (net) => {
        if (!net) return Wifi;
        const lower = net.toLowerCase();
        if (lower.includes('ethernet') || lower.includes('有线')) return Activity;
        if (lower.includes('offline') || lower.includes('离线')) return Zap; // Or a disconnect icon
        return Wifi;
    };
    const NetworkIcon = getNetworkIcon(data.network);

    // 当前应用
    const currentApp = data.app || "System Idle";

    // 识别是否在听歌
    const isPlayingMusic = currentApp.includes('🎵') || (data.pkg && (data.pkg.includes('Music') || data.pkg.includes('Spotify') || data.pkg.includes('网易云')));

    // 映射应用图标
    const getAppIcon = (appName) => {
        if (!appName) return Activity;
        const lower = appName.toLowerCase();
        if (lower.includes('vs code') || lower.includes('code') || lower.includes('dev')) return Code;
        if (lower.includes('music') || lower.includes('spotify') || lower.includes('cloud')) return Music;
        if (lower.includes('chrome') || lower.includes('browser') || lower.includes('edge')) return Globe;
        if (lower.includes('wechat') || lower.includes('discord') || lower.includes('chat')) return MessageSquare;
        return Activity;
    };

    const AppIcon = getAppIcon(currentApp);

    return (
        <div className="relative group perspective-1000">
            {/* Holographic Card Container */}
            <div className="relative w-full aspect-[4/5] bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden border-2 border-anime-dark dark:border-white/20 shadow-comic dark:shadow-none transition-all duration-500 group-hover:rotate-y-1 group-hover:rotate-x-1">

                {/* Top Status Bar (Refined) */}
                <div className="absolute top-4 left-5 right-5 flex justify-between items-center z-30 pointer-events-none">
                    {/* Left: Device & Location */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            <Smartphone className="w-3 h-3 text-anime-blue" />
                            <span className="text-[10px] font-bold text-anime-dark/70 dark:text-gray-300 uppercase tracking-tight max-w-[80px] truncate">
                                {data.device || "RedmiBook"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            <MapPin className="w-3 h-3 text-anime-pink" />
                            <span className="text-[10px] font-bold text-anime-dark/70 dark:text-gray-300 tracking-tight">
                                {data.location || "重庆"}
                            </span>
                        </div>
                    </div>

                    {/* Right: Network */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            <NetworkIcon className={`w-3 h-3 ${data.network === 'Offline' ? 'text-gray-400' : 'text-green-500'}`} />
                            <span className="text-[10px] font-bold text-anime-dark/80 dark:text-gray-200">
                                {data.network || "WiFi"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Top Center: Active App Display (Dynamic Island Style) */}
                <div className="absolute top-14 left-0 right-0 flex justify-center z-50">
                    <div className="max-w-[85%] flex items-center gap-2.5 px-4 py-1.5 bg-anime-dark dark:bg-white text-white dark:text-anime-dark rounded-full shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                        <div className="flex-shrink-0 w-4 h-4 rounded-md bg-white/20 dark:bg-anime-dark/10 flex items-center justify-center overflow-hidden">
                            <AppIcon className="w-2.5 h-2.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[8px] font-bold opacity-70 uppercase tracking-widest leading-none mb-0.5">Active Task</span>
                            <span className="text-[10px] font-black tracking-wide leading-none truncate w-full max-w-[150px]" title={currentApp}>
                                {currentApp}
                            </span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1 flex-shrink-0"></div>
                    </div>
                </div>

                {/* Character Visual */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-[#1a1a1a] dark:to-black overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Character Container */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[85%] h-[75%] transition-transform duration-700 hover:scale-105 group">
                        <img
                            src="/mascot.png"
                            alt="Digital Twin"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.15))' }}
                        />

                        {/* AI Speech Bubble */}
                        {data.mood && (
                            <div className="absolute top-20 -right-2 max-w-[130px] bg-white dark:bg-anime-dark border-2 border-anime-pink text-anime-dark dark:text-white text-[10px] font-bold px-3 py-2.5 rounded-2xl rounded-tr-none shadow-[2px_2px_0px_#ff75c3] animate-bounce z-40 leading-snug break-words">
                                {data.mood}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Left: System Time */}
                <div className="absolute bottom-6 left-6 z-20">
                    <div className="flex items-center gap-3">
                        {/* Clock Icon */}
                        <div className="p-2 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-xl border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-anime-blue animate-pulse-slow"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-0.5">Beijing Time</span>
                            <span className="text-xl font-black text-anime-dark dark:text-white leading-none font-mono tracking-tight">
                                {new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Right: Status / Media Widget (Premium Redesign) */}
                <div className="absolute bottom-6 right-6 z-20">
                    {isPlayingMusic ? (
                        // Music Mode: Sleek Glass Capsule
                        <div className="flex items-center gap-3 px-3 py-2 bg-black/80 dark:bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-xl max-w-[160px]">
                            {/* Animated Vinyl/Icon */}
                            <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full animate-[spin_3s_linear_infinite]">
                                <Music className="w-4 h-4 text-anime-pink" />
                            </div>

                            {/* Track Info */}
                            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-[1px]">Now Playing</span>
                                <div className="relative overflow-hidden h-[14px]">
                                    <span className="text-[10px] font-bold text-white leading-none whitespace-nowrap animate-marquee">
                                        {currentApp.replace('🎵 ', '')}
                                    </span>
                                </div>
                            </div>

                            {/* Equalizer Bars */}
                            <div className="flex gap-[2px] items-end h-3 pl-1">
                                <div className="w-[2px] bg-anime-pink animate-[music-bar_0.5s_ease-in-out_infinite] h-[40%]"></div>
                                <div className="w-[2px] bg-anime-pink animate-[music-bar_0.5s_ease-in-out_infinite_0.1s] h-[100%]"></div>
                                <div className="w-[2px] bg-anime-pink animate-[music-bar_0.5s_ease-in-out_infinite_0.2s] h-[60%]"></div>
                                <div className="w-[2px] bg-anime-pink animate-[music-bar_0.5s_ease-in-out_infinite_0.3s] h-[80%]"></div>
                            </div>
                        </div>
                    ) : (
                        // Live Mode: Minimalist Badge
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/10 shadow-lg">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </div>
                            <span className="text-[10px] font-black text-anime-dark dark:text-white tracking-widest uppercase">
                                LIVE
                            </span>
                        </div>
                    )}
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-opacity">
                        <Activity className="w-8 h-8 text-anime-blue animate-spin mb-2" />
                        <span className="text-[10px] font-bold text-anime-dark dark:text-white uppercase tracking-widest animate-pulse">Establishing Link...</span>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes music-bar {
                    0%, 100% { height: 40%; }
                    50% { height: 100%; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-marquee {
                    animation: marquee 5s linear infinite;
                    display: inline-block;
                    padding-left: 100%; /* Start offset */
                }
            `}</style>
        </div>
    );
}
