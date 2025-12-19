
import React, { useState, useEffect } from 'react';
import { Zap, Wifi, MapPin, Smartphone, Activity, Globe, Music, Code, Coffee, MessageSquare, Monitor } from 'lucide-react';

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

    // 状态映射（中文化）
    const getNetworkName = (net) => {
        if (!net) return "未知网络";
        const lower = net.toLowerCase();
        if (lower.includes('ethernet')) return "有线网络";
        if (lower.includes('wifi')) return "无线网络";
        if (lower.includes('offline')) return "离线";
        return net;
    };
    const networkName = getNetworkName(data.network);

    // 识别网络类型
    const getNetworkIcon = (net) => {
        if (!net) return Wifi;
        const lower = net.toLowerCase();
        if (lower.includes('ethernet')) return Activity;
        if (lower.includes('offline')) return Zap;
        return Wifi;
    };
    const NetworkIcon = getNetworkIcon(data.network);

    // 当前应用
    const currentApp = data.app || "System Idle";

    // 识别是否在听歌
    const isPlayingMusic = currentApp.includes('🎵') || (data.pkg && (data.pkg.includes('Music') || data.pkg.includes('Spotify') || data.pkg.includes('网易云') || data.pkg.includes('QQ音乐')));

    // 去除歌名中的 🎵 前缀用于显示
    const displayAppName = currentApp.replace('🎵 ', '');

    // 映射应用图标
    const getAppIcon = (appName) => {
        if (!appName) return Activity;
        const lower = appName.toLowerCase();
        if (lower.includes('vs code') || lower.includes('code') || lower.includes('dev')) return Code;
        if (lower.includes('music') || lower.includes('spotify') || lower.includes('cloud') || lower.includes('🎵')) return Music;
        if (lower.includes('chrome') || lower.includes('browser') || lower.includes('edge')) return Globe;
        if (lower.includes('wechat') || lower.includes('discord') || lower.includes('chat')) return MessageSquare;
        return Activity;
    };

    // 状态文案生成
    const getStatusText = (appName) => {
        if (!appName) return "等待指令... 💤";
        const lower = appName.toLowerCase();

        if (isPlayingMusic) return "沉浸音乐中... 🎧";
        if (lower.includes('chrome') || lower.includes('edge') || lower.includes('browser') || lower.includes('冲浪')) return "网络冲浪中... 🏄";
        if (lower.includes('code') || lower.includes('dev')) return "努力搬砖中... 🧱";
        if (lower.includes('wechat') || lower.includes('chat')) return "正在等待中... 💤";
        if (lower.includes('game') || lower.includes('steam')) return "正在游戏中... 🎮";
        if (lower.includes('video') || lower.includes('movie')) return "正在看番中... 📺";

        return "正在摸鱼中... 🐟";
    };
    const statusText = getStatusText(currentApp);

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
                            <Monitor className="w-3 h-3 text-anime-blue" />
                            <span className="text-[10px] font-bold text-anime-dark/70 dark:text-gray-300 uppercase tracking-tight truncate max-w-[120px]">
                                {data.device || "RedmiBook Pro 15 2021"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            <MapPin className="w-3 h-3 text-anime-pink" />
                            <span className="text-[10px] font-bold text-anime-dark/70 dark:text-gray-300 tracking-tight">
                                {data.location || "重庆"}
                            </span>
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
                                <span className="text-[10px] font-black tracking-wide leading-none truncate w-full max-w-[150px]" title={displayAppName}>
                                    {displayAppName}
                                </span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1 flex-shrink-0"></div>
                        </div>
                    </div>

                    {/* Right: Network */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            <NetworkIcon className={`w-3 h-3 ${data.network === 'Offline' ? 'text-gray-400' : 'text-green-500'}`} />
                            <span className="text-[10px] font-bold text-anime-dark/80 dark:text-gray-200">
                                {networkName}
                            </span>
                        </div>
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

                        {/* AI Speech Bubble - Redesigned (Glassmorphism, Softer) */}
                        {data.mood && (
                            <div className="absolute top-32 -right-4 max-w-[130px]">
                                <div className="relative bg-white/80 dark:bg-black/60 backdrop-blur-md border border-anime-pink/30 text-anime-dark dark:text-gray-100 text-[10px] font-medium px-3 py-2.5 rounded-2xl rounded-tl-none shadow-sm leading-relaxed break-words animate-[float_4s_ease-in-out_infinite]">
                                    {data.mood}
                                    {/* Small Triangle Indicator */}
                                    <div className="absolute -left-1.5 top-0 w-2 h-2 bg-white/80 dark:bg-black/60 border-l border-b border-anime-pink/30 transform rotate-45"></div>
                                </div>
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

                {/* Bottom Right: Status / Media Widget (Refined) */}
                <div className="absolute bottom-6 right-6 z-20">
                    {isPlayingMusic ? (
                        // Music Mode: Sleek Keyboard Style
                        <div className="flex items-center gap-3 px-3 py-2 bg-black/90 dark:bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-xl max-w-[160px]">
                            {/* Animated Vinyl/Icon */}
                            <div className="relative flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-800 rounded-full animate-[spin_3s_linear_infinite]">
                                <Music className="w-3.5 h-3.5 text-anime-pink" />
                            </div>

                            {/* Track Info */}
                            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-[1px]">听歌ing...</span>
                                <div className="relative overflow-hidden h-[12px]">
                                    <span className="text-[9px] font-bold text-white leading-none whitespace-nowrap animate-marquee">
                                        {displayAppName}
                                    </span>
                                </div>
                            </div>

                            {/* Equalizer Bars */}
                            <div className="flex gap-[2px] items-end h-3 pl-1">
                                <div className="w-[2px] bg-anime-pink animate-[music-bar_0.5s_ease-in-out_infinite] h-[40%]"></div>
                                <div className="w-[2px] bg-anime-pink animate-[music-bar_0.5s_ease-in-out_infinite_0.1s] h-[100%]"></div>
                                <div className="w-[2px] bg-anime-pink animate-[music-bar_0.5s_ease-in-out_infinite_0.2s] h-[60%]"></div>
                            </div>
                        </div>
                    ) : (
                        // Standard Activity Mode
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/10 shadow-lg">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </div>
                            <span className="text-[10px] font-bold text-anime-dark dark:text-white tracking-widest">
                                {statusText}
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
