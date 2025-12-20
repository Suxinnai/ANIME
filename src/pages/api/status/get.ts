
import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const GET: APIRoute = async () => {
    try {
        // 从 Redis 读取数据 (仅读取手动/脚本上传的数据)
        const status = await kv.get('my_device_status');

        // 默认数据
        const fallbackData = {
            battery: 0,
            network: "Offline",
            location: "Neo-Tokyo",
            device: "Xiaomi 13",
            isCharging: false
        };

        // 使用 Redis 数据或默认数据
        let data: any = status || fallbackData;

        // 离线检测：如果数据最后更新时间超过 15 秒，标记为离线
        if (data.lastUpdate) {
            const now = Date.now();
            if (now - data.lastUpdate > 15000) {
                data.isOffline = true;
            }
        } else if (status) {
            // 如果有数据但没时间戳（旧数据），也暂时不处理，或者默认在线
        } else {
            data.isOffline = true; // 没数据肯定是离线
        }

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
