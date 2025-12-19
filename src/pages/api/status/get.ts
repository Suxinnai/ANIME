
import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const GET: APIRoute = async () => {
    try {
        // 从 Redis 读取两份数据
        const [manualStatus, owntracksStatus] = await Promise.all([
            kv.get('my_device_status'),
            kv.get('my_device_status_owntracks')
        ]);

        // 默认数据
        const fallbackData = {
            battery: 0,
            network: "Offline",
            location: "Neo-Tokyo",
            device: "Xiaomi 13",
            isCharging: false
        };

        // 合并数据：如果有手动同步则优先，否则用 OwnTracks 的电量
        const data = {
            ...fallbackData,
            ...(owntracksStatus as object || {}),
            ...(manualStatus as object || {})
        };

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        // 本地开发或者没有配置 KV 时，返回一个 Mock 数据，保证页面不崩
        console.warn("Failed to fetch from KV, returning mock data.");
        return new Response(JSON.stringify({
            battery: 85,
            network: "WiFi • Mock",
            location: "Neo-Tokyo",
            device: "Dev Device",
            isCharging: true
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
};
