
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

    return (
        <div className="relative group perspective-1000">
            {/* Holographic Card Container */}
            <div className="relative w-full aspect-[4/5] bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden border-2 border-anime-dark dark:border-white/20 shadow-comic dark:shadow-none transition-transform duration-500 group-hover:rotate-y-2 group-hover:rotate-x-2">

                {/* Header Status Bar (Floating) */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full border border-anime-dark/10 shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${data.network === 'Offline' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                        <span className="text-[10px] font-bold tracking-wider text-anime-dark dark:text-gray-200">
                            {data.network === 'Offline' ? 'SYSTEM: OFFLINE' : 'SYSTEM: ONLINE'}
                        </span>
                    </div>
                </div>

                {/* Character Visual (Live2D Placeholder) */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-[#1a1a1a] dark:to-black">
                    {/* Grid Effect */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Mascot Image */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] transition-transform duration-700 hover:scale-105">
                        <img
                            src="/mascot.jpg"
                            alt="Digital Twin"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))' }}
                        />
                    </div>
                </div>

                {/* Floating Data HUD (Glassmorphism) */}
                <div className="absolute bottom-6 right-6 z-20">
                    <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-4 shadow-lg w-48 transition-all duration-300 hover:scale-105">

                        {/* Current App Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/5 dark:border-white/10">
                            <div className="flex items-center gap-2 overflow-hidden">
                                {/* App Icon Placeholder - In a real app you'd map pkg to actual icons */}
                                <div className="w-4 h-4 rounded bg-gray-200 dark:bg-white/20 flex items-center justify-center text-[8px] font-bold text-gray-500">
                                    {data.app ? data.app[0] : 'A'}
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest truncate max-w-[80px]" title={data.app || "Idle"}>
                                    {data.app || "System Idle"}
                                </span>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full ${data.isCharging ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'} shadow-[0_0_8px_rgba(74,222,128,0.6)]`}></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="space-y-3">
                            {/* Battery */}
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg">
                                    <Zap className={`w-3 h-3 ${getBatteryColor(data.battery)}`} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Energy {data.isCharging && '⚡'}</div>
                                    <div className="text-xs font-bold text-anime-dark dark:text-white flex items-center gap-1">
                                        {data.battery}%
                                        {/* Charging Progress Bar */}
                                        <div className={`w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden ml-1`}>
                                            <div
                                                className={`h-full ${data.battery <= 20 ? 'bg-red-500' : 'bg-green-500'} transition-all duration-1000`}
                                                style={{ width: `${data.battery}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* App Package Name (Technical Details) */}
                            {data.pkg && (
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg">
                                        <Activity className="w-3 h-3 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">Process</div>
                                        <div className="text-[10px] font-bold text-anime-dark dark:text-white truncate w-24" title={data.pkg}>
                                            {data.pkg}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fallback / Extra Info */}
                            {(data.network || data.location) && (
                                <div className="flex items-start gap-3 opacity-60">
                                    <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg">
                                        <Wifi className="w-3 h-3 text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">Status</div>
                                        <div className="text-[10px] font-bold text-anime-dark dark:text-white">
                                            {data.network || "Online"}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Loading Overlay (Optional) */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] z-30 flex items-center justify-center opacity-0 pointer-events-none transition-opacity">
                        <Activity className="w-8 h-8 text-anime-blue animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
