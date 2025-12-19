
import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // OwnTracks 发送的数据中，_type 为 'location' 或 'lwt' 时包含电池信息
        if (data._type === 'location' || data._type === 'lwt') {
            const batteryInfo = {
                battery: data.batt, // 0-100
                isCharging: data.bs === 1 || data.bs === 2, // 1: 充电中, 2: 满电
                device: "Mobile Device",
                lastUpdate: Date.now()
            };

            // 存入 Redis，有效期 24 小时
            await kv.set('my_device_status_owntracks', batteryInfo, { ex: 86400 });
        }

        // OwnTracks 要求返回空对象和 200 状态码
        return new Response(JSON.stringify({}), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
