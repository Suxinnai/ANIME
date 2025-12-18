
import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const POST: APIRoute = async ({ request }) => {
    // 1. 安全验证 (简单版：检查 URL 参数中的 secret)
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');

    // 建议在环境变量中设置 SECRET，这里演示用简单的硬编码或环境变量
    const MY_SECRET = import.meta.env.STATUS_SECRET || "suxinnai_secret_123";

    if (secret !== MY_SECRET) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        // 2. 获取手机发来的 JSON 数据
        const body = await request.json();
        // body 格式期待: { battery: 80, network: "WiFi", location: "Home", device: "Xiaomi 13", ... }

        // 3. 存入 Redis
        // 设置过期时间为 10 分钟 (600秒)，如果手机很久没发数据，就认为离线
        await kv.set('my_device_status', body, { ex: 600 });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
