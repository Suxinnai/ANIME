
import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const POST: APIRoute = async ({ request }) => {
    // 1. 安全验证 (简单版：检查 URL 参数中的 secret)
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');

    // 建议在环境变量中设置 SECRET，这里演示用简单的硬编码或环境变量
    const MY_SECRET = import.meta.env.STATUS_SECRET || "sxn_8f3c1a9d2e6b4c7f90a1d3e5b7c9f1a2";

    if (secret !== MY_SECRET) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        // 2. 获取数据并添加时间戳
        const body = await request.json();
        const dataToSave = {
            ...body,
            lastUpdate: Date.now()
        };

        // 3. 存入 Redis
        // 将过期时间延长到 24 小时 (86400秒)，以便保留“最后在线”时的设备名和位置
        await kv.set('my_device_status', dataToSave, { ex: 86400 });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
