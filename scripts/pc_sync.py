
import requests
import time
import json
import ctypes
import urllib3
import os
import psutil
from openai import OpenAI
from ctypes import wintypes

# 尝试导入 winsdk，如果没安装则提示
try:
    from winsdk.windows.media.control import GlobalSystemMediaTransportControlsSessionManager
except ImportError:
    pass

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

def find_music_info(active_title):
    # 1. 优先检查当前前台窗口
    if " - " in active_title and ("Music" in active_title or "Spotify" in active_title or "网易云" in active_title or "QQ音乐" in active_title):
        return True, active_title

    # 2. 如果前台不是音乐，遍历所有后台窗口查找播放器
    # 这一步能检测到后台播放的 QQ 音乐或网易云（前提是它们更新了窗口标题）
    all_titles = get_all_window_titles()
    for t in all_titles:
        if " - " in t:
             if "QQ音乐" in t or "网易云音乐" in t or "Spotify" in t:
                 return True, t
    
    return False, ""

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

    while True:
        try:
            # 1. 获取基础信息
            active_window = get_active_window_title() or "Desktop"
            current_network = get_network_type()

            # 2. 智能状态推断
            display_text = active_window
            pkg_name = active_window
            is_music_mode = False
            
            # 尝试检测音乐（前台或后台）
            found_music, music_title = find_music_info(active_window)
            if found_music:
                is_music_mode = True
                # 提取歌名： "七里香 - 周杰伦 - QQ音乐" -> "七里香 - 周杰伦"
                # 通常取第一个 " - " 之前比较保险，或者保留歌手
                # 这里我们简单保留 " - " 之前的内容作为主标题，完整标题作为上下文
                if " - " in music_title:
                   display_text = "🎵 " + music_title.split(" - ")[0]
                else:
                   display_text = "🎵 " + music_title
                pkg_name = music_title # 完整标题传给 pkg 用于前端判断
            
            elif "Visual Studio Code" in active_window:
                display_text = "Writing Code"
            elif "Chrome" in active_window or "Edge" in active_window:
                display_text = "Browsing"
            elif len(active_window) > 20: 
                display_text = active_window[:20] + "..."

            # 3. AI 生成 (减少频率，只有状态根本改变时才生成)
            ai_context_key = music_title if is_music_mode else active_window
            if ai_context_key != last_context:
                print(f"State changed to: {ai_context_key}, asking AI...")
                ai_mood = generate_ai_status(ai_context_key, is_music_mode)
                last_context = ai_context_key
                last_ai_text = ai_mood
            
            # 4. 发送数据
            payload = {
                "app": display_text,     # 前端显示的大标题
                "pkg": pkg_name,         # 详细包名/标题
                "mood": last_ai_text,    # AI 吐槽
                "network": current_network,
                "device": "RedmiBook Pro 15 2021",
                "location": "重庆",
                "isCharging": True
            }

            url = f"{API_URL}?secret={SECRET}"
            requests.post(url, json=payload, timeout=5, verify=False)
            
            print(f"Synced: {display_text} | Net: {current_network} | AI: {last_ai_text[:10]}...")
            
        except Exception as e:
            print(f"Sync Logic Error: {e}")
            import traceback
            traceback.print_exc()

        time.sleep(5)

if __name__ == "__main__":
    print(f"Starting AI Sync (Lightweight Mode)...")
    sync_loop()
