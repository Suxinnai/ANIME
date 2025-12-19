
import requests
import time
import json
import ctypes
import urllib3
import os
from openai import OpenAI
from ctypes import wintypes

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

def get_active_window_title():
    try:
        hwnd = user32.GetForegroundWindow()
        length = user32.GetWindowTextLengthW(hwnd)
        buff = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, buff, length + 1)
        return buff.value
    except:
        return ""

def generate_ai_status(context_text, is_music=False):
    try:
        if not context_text: return "发呆中..."
        
        system_prompt = "你是一个活泼可爱的二次元少女（Suxinnai的数字分身）。"
        if is_music:
            system_prompt += f"用户正在听歌，请评价这首歌或表达听歌的心情。歌名：{context_text}。风格要俏皮、颜文字。"
        else:
            system_prompt += "根据用户当前正在使用的电脑窗口标题，用一句话（15字以内）描述当前的状态。风格要俏皮、吐槽。"

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
            # 获取前台窗口标题
            active_window = get_active_window_title() or "Desktop"
            
            # --- 智能推断逻辑 (无需 winsdk) ---
            display_text = active_window
            is_music_mode = False
            
            # 常见音乐软件标题规则匹配
            # 网易云: "七里香 - 周杰伦" (很多时候不带后缀，或者被播放器设置隐藏)
            # Spotify: "Song Name - Artist"
            # QQ音乐: "七里香 - QQ音乐"
            
            if " - " in active_window and ("Music" in active_window or "Spotify" in active_window or "网易云" in active_window or "QQ音乐" in active_window):
                # 显式识别到音乐播放器
                is_music_mode = True
                display_text = "🎵 " + active_window.split(" - ")[0] # 取前半部分
            elif "Visual Studio Code" in active_window:
                display_text = "VS Code"
            elif "Chrome" in active_window or "Edge" in active_window:
                display_text = "Browsing"
            elif len(active_window) > 20: 
                display_text = active_window[:20] + "..."

            # 4. AI 生成
            ai_mood = last_ai_text
            if active_window != last_context and active_window:
                print(f"Status changed to: {active_window} (Music: {is_music_mode}), asking AI...")
                ai_mood = generate_ai_status(display_text if is_music_mode else active_window, is_music_mode)
                last_context = active_window
                last_ai_text = ai_mood

            # 5. 发送
            payload = {
                "app": display_text,
                "pkg": active_window, 
                "mood": ai_mood,
                "network": "Ethernet",
                "device": "Workstation",
                "location": "Chongqing",
                "isCharging": True
            }

            url = f"{API_URL}?secret={SECRET}"
            requests.post(url, json=payload, timeout=5, verify=False)
            
            print(f"Synced: {display_text} | AI: {ai_mood}")
            
        except Exception as e:
            print(f"Sync Logic Error: {e}")

        time.sleep(5)

if __name__ == "__main__":
    print(f"Starting AI Sync (Lightweight Mode)...")
    sync_loop()
