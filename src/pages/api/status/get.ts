
import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const GET: APIRoute = async () => {
    try {
        // 从 Redis 读取数据
        const status = await kv.get('my_device_status');

        // 默认数据 (Fallback)
        const fallbackData = {
            battery: 0,
            network: "Offline",
            location: "Unknown",
            device: "Xiaomi 13",
            isCharging: false
        };

        // 如果 Redis 里有数据，就用 Redis 的，否则用默认的
        const data = status || fallbackData;

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
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
