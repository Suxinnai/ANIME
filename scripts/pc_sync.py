
import requests
import time
import json
import ctypes
import urllib3
import os
import psutil
import asyncio
from openai import OpenAI
from ctypes import wintypes

# 尝试导入 winrt 媒体控制 API
try:
    from winrt.windows.media.control import GlobalSystemMediaTransportControlsSessionManager as MediaManager
    WINRT_AVAILABLE = True
    print("[Info] winrt media API loaded successfully!")
except ImportError:
    WINRT_AVAILABLE = False
    print("[Warning] winrt not available, falling back to window title detection.")

# 禁用 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ================= 配置区 =================
API_URL = "https://anime.suxinnai.online/api/status/update"
SECRET = "sxn_8f3c1a9d2e6b4c7f90a1d3e5b7c9f1a2"

# AI 配置
AI_API_KEY = "sk-solroao8wo7exh5wgx9z2x6ayyz0enrznogpkvqt4jzhftig"
AI_BASE_URL = "https://api.xiaomimimo.com/v1"

client = OpenAI(
    api_key=AI_API_KEY,
    base_url=AI_BASE_URL
)

user32 = ctypes.windll.user32

# ================= 辅助函数 =================
def get_active_window_title():
    try:
        hwnd = user32.GetForegroundWindow()
        length = user32.GetWindowTextLengthW(hwnd)
        buff = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, buff, length + 1)
        return buff.value
    except:
        return ""

async def get_media_info_async():
    """使用 Windows Media API 获取当前播放的媒体信息"""
    if not WINRT_AVAILABLE:
        return None, None, None
    
    try:
        sessions = await MediaManager.request_async()
        current_session = sessions.get_current_session()
        
        if current_session:
            info = await current_session.try_get_media_properties_async()
            
            # 获取播放状态
            playback_info = current_session.get_playback_info()
            is_playing = playback_info.playback_status == 4  # 4 = Playing
            
            if info and is_playing:
                title = info.title or ""
                artist = info.artist or ""
                return True, title, artist
                
    except Exception as e:
        print(f"[Debug] Media API error: {e}")
    
    return False, None, None

def get_media_info():
    """同步包装器"""
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(get_media_info_async())
        loop.close()
        return result
    except Exception as e:
        print(f"[Debug] Async wrapper error: {e}")
        return False, None, None

def get_all_window_titles():
    titles = []
    def foreach_window(hwnd, lParam):
        if user32.IsWindowVisible(hwnd):
            length = user32.GetWindowTextLengthW(hwnd)
            buff = ctypes.create_unicode_buffer(length + 1)
            user32.GetWindowTextW(hwnd, buff, length + 1)
            if buff.value:
                titles.append(buff.value)
        return True
    
    EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int))
    user32.EnumWindows(EnumWindowsProc(foreach_window), 0)
    return titles


def get_network_type():
    try:
        stats = psutil.net_if_stats()
        # 优先检测有线
        for interface, status in stats.items():
            if status.isup:
                lower = interface.lower()
                if "ethernet" in lower or "以太网" in lower:
                    return "Ethernet"
        # 其次检测 WiFi
        for interface, status in stats.items():
            if status.isup:
                lower = interface.lower()
                if "wi-fi" in lower or "wlan" in lower or "无线" in lower:
                    return "WiFi"
        # 其他
        for interface, status in stats.items():
            if status.isup and "loopback" not in interface.lower():
                return "Online"
    except:
        pass
    return "Offline"

def generate_ai_status(context_text, is_music=False):
    try:
        if not context_text: return "发呆中..."
        
        system_prompt = "你是一个活泼可爱的二次元少女（Suxinnai的数字分身）。"
        if is_music:
            system_prompt += f"用户正在听歌，请评价这首歌或表达听歌的心情。歌名：{context_text}。风格要俏皮、颜文字。自称'Suxinnai'。"
        else:
            system_prompt += "根据用户当前正在使用的电脑窗口标题，用一句话（15字以内）描述当前的状态。风格要俏皮、吐槽。自称'Suxinnai'（不要叫苏芯）。"

        completion = client.chat.completions.create(
            model="mimo-v2-flash",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"当前状态: {context_text}"}
            ],
            max_completion_tokens=60,
            temperature=0.8,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"AI Error: {e}")
        return "Listening..." if is_music else "Thinking..."

def sync_loop():
    last_context = ""
    last_ai_text = "Ready!"

    print("Sync loop started. Press Ctrl+C to stop.")

    while True:
        try:
            # 1. 获取基础信息
            active_window = get_active_window_title() or "Desktop"
            current_network = get_network_type()

            # 2. 智能状态推断
            display_text = active_window
            pkg_name = active_window
            is_music_mode = False
            music_context = ""
            app_category = "other"  # 默认分类
            
            # 应用分类规则
            lower_window = active_window.lower()
            
            # 浏览器
            if any(x in lower_window for x in ["chrome", "edge", "comet", "浏览器", "firefox"]):
                app_category = "browser"
                display_text = "Browsing"
            # 通讯软件
            elif any(x in lower_window for x in ["qq", "微信", "wechat", "telegram", "tim"]) and "qq音乐" not in lower_window:
                app_category = "chat"
                display_text = "Chatting"
            # 编程软件
            elif any(x in lower_window for x in ["visual studio code", "vscode", "cursor", "kiro", "antigravity", "pycharm", "intellij"]):
                app_category = "coding"
                display_text = "Coding"
            
            # 优先使用 Windows Media API 检测音乐 (覆盖上面的分类)
            is_playing, song_title, song_artist = get_media_info()
            
            if is_playing and song_title:
                is_music_mode = True
                app_category = "music"
                if song_artist:
                    display_text = f"🎵 {song_title} - {song_artist}"
                    music_context = f"{song_title} - {song_artist}"
                else:
                    display_text = f"🎵 {song_title}"
                    music_context = song_title
                pkg_name = music_context
                print(f"[Media API] Detected: {music_context}")
            
            # 如果标题太长，截断
            if app_category == "other" and len(active_window) > 20:
                display_text = active_window[:20] + "..."

            # 3. AI 生成 (减少频率，只有状态根本改变时才生成)
            ai_context_key = music_context if is_music_mode else active_window
            
            # 只有当状态改变，或者每隔 5 分钟 (100次循环) 重新生成一次以保持新鲜感
            if ai_context_key != last_context:
                print(f"State changed to: {ai_context_key}, asking AI...")
                ai_mood = generate_ai_status(ai_context_key, is_music_mode)
                last_context = ai_context_key
                last_ai_text = ai_mood
            
            # 4. 发送数据
            payload = {
                "app": display_text,         # 前端显示的大标题
                "pkg": pkg_name,             # 详细包名/标题
                "mood": last_ai_text,        # AI 吐槽
                "category": app_category,    # 应用分类
                "network": current_network,
                "device": "RedmiBook Pro 15 2021",
                "location": "重庆",
                "isCharging": True
            }

            url = f"{API_URL}?secret={SECRET}"
            requests.post(url, json=payload, timeout=5, verify=False)
            
            print(f"Synced: {display_text} | Cat: {app_category} | Net: {current_network}")
            
        except Exception as e:
            print(f"Sync Logic Error: {e}")
            import traceback
            traceback.print_exc()

        time.sleep(3) # 加快同步频率到 3秒

if __name__ == "__main__":
    print(f"Starting AI Sync (Lightweight Mode)...")
    sync_loop()
