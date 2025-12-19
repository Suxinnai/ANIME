
import React, { useState, useEffect } from 'react';
import { Zap, Wifi, MapPin, Smartphone, Activity } from 'lucide-react';

export default function DigitalTwinReact() {
    const [data, setData] = useState({
        battery: 85,
        network: "WiFi • 5G",
        location: "Neo-Tokyo, Sector 7",
        device: "Neural Link v2.0",
        isCharging: false
    });
    const [loading, setLoading] = useState(true);

    // 轮询获取状态
    useEffect(() => {
        const fetchData = async () => {
            try {
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

    // 动态颜色计算
    const getBatteryColor = (level) => {
        if (level <= 20) return "text-red-500";
        if (level <= 50) return "text-yellow-500";
        return "text-green-500";
    };

    // 识别网络类型
    const isWifi = data.network?.toLowerCase().includes('wifi');
    const isMobile = !isWifi && data.network !== 'Offline' && data.network !== 'Unknown';

    return (
        <div className="relative group perspective-1000">
            {/* Holographic Card Container */}
            <div className="relative w-full aspect-[4/5] bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden border-2 border-anime-dark dark:border-white/20 shadow-comic dark:shadow-none transition-all duration-500 group-hover:rotate-y-1 group-hover:rotate-x-1">

                {/* Top Status Bar (Phone-style) */}
                <div className="absolute top-4 left-5 right-5 flex justify-between items-center z-30 pointer-events-none">
                    {/* Left: Device & Location Info */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            <Smartphone className="w-3 h-3 text-anime-blue" />
                            <span className="text-[9px] font-bold text-anime-dark/70 dark:text-gray-300 uppercase tracking-tighter">
                                {data.device || "Unknown Device"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            <MapPin className="w-3 h-3 text-anime-pink" />
                            <span className="text-[9px] font-bold text-anime-dark/70 dark:text-gray-300 uppercase tracking-tighter">
                                {data.location || "Neo-Tokyo"}
                            </span>
                        </div>
                    </div>

                    {/* Right: Network & Pulse */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-anime-dark/5 dark:border-white/5 shadow-sm">
                            {isWifi ? (
                                <Wifi className="w-3 h-3 text-green-500" />
                            ) : isMobile ? (
                                <Activity className="w-3 h-3 text-blue-500" />
                            ) : (
                                <Activity className="w-3 h-3 text-gray-400 opacity-50" />
                            )}
                            <span className="text-[9px] font-bold text-anime-dark/80 dark:text-gray-200">
                                {data.network || "Offline"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Top Center: Active App Display (Dynamic Island Style) */}
                <div className="absolute top-14 left-0 right-0 flex justify-center z-40">
                    <div className="max-w-[80%] flex items-center gap-2.5 px-4 py-1.5 bg-anime-dark dark:bg-white text-white dark:text-anime-dark rounded-full shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                        <div className="flex-shrink-0 w-4 h-4 rounded-md bg-white/20 dark:bg-anime-dark/10 flex items-center justify-center">
                            <Activity className="w-2.5 h-2.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-bold opacity-70 uppercase tracking-widest leading-none mb-0.5">Currently Using</span>
                            <span className="text-[10px] font-black tracking-wide leading-none truncate max-w-[120px]">
                                {data.app || "System Idle"}
                            </span>
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${data.network === 'Offline' ? 'bg-red-500' : 'bg-green-400 animate-pulse'} ml-1`}></div>
                    </div>
                </div>

                {/* Character Visual */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-[#1a1a1a] dark:to-black">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[85%] h-[75%] transition-transform duration-700 hover:scale-105">
                        <img
                            src="/mascot.png"
                            alt="Digital Twin"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.15))' }}
                        />
                    </div>
                </div>

                {/* Bottom Left: Quick Stats (Simplified) */}
                <div className="absolute bottom-6 left-6 z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-xl border border-anime-dark/5 dark:border-white/5 shadow-sm">
                                <Zap className={`w-4 h-4 ${getBatteryColor(data.battery)} ${data.isCharging ? 'animate-bounce' : ''}`} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">Energy</span>
                                <span className="text-sm font-black text-anime-dark dark:text-white leading-tight">
                                    {data.battery}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Right Card (Detail View) */}
                <div className="absolute bottom-6 right-6 z-20">
                    <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-4 shadow-xl w-40 transform transition-all duration-300 hover:scale-105 hover:translate-x-[-4px] hover:translate-y-[-4px]">
                        <div className="space-y-3">
                            <div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status Report</div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-anime-blue transition-all duration-1000"
                                        style={{ width: `${data.battery}%` }}
                                    ></div>
                                </div>
                            </div>

                            {data.pkg && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[8px] text-gray-400 font-bold uppercase">Package</span>
                                    <span className="text-[9px] font-bold text-anime-dark dark:text-white truncate" title={data.pkg}>
                                        {data.pkg}
                                    </span>
                                </div>
                            )}

                            <div className="pt-1 flex items-center justify-between">
                                <span className="text-[8px] font-bold text-anime-pink uppercase">Live Sync</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-1 h-3 bg-anime-blue/20 rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-anime-blue animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-opacity">
                        <Activity className="w-8 h-8 text-anime-blue animate-spin mb-2" />
                        <span className="text-[10px] font-bold text-anime-dark dark:text-white uppercase tracking-widest animate-pulse">Establishing Link...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
