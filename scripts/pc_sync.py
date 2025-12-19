
import requests
import time
import json
import ctypes
import urllib3
from ctypes import wintypes

# 禁用 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ================= 配置区 =================
# 1. 你的 Vercel 域名
API_URL = "https://anime.suxinnai.online/api/status/update"

# 2. 安全密钥 (和 Vercel 环境变量 STATUS_SECRET 一致)
SECRET = "sxn_8f3c1a9d2e6b4c7f90a1d3e5b7c9f1a2"

# 3. 自定义状态
CurrentMood = "Focusing"  # 你可以在这里随时修改心情，比如 "Coding", "Gaming", "Coffee Time"
# =========================================

user32 = ctypes.windll.user32
psapi = ctypes.windll.psapi

def get_active_window_title():
    try:
        hwnd = user32.GetForegroundWindow()
        length = user32.GetWindowTextLengthW(hwnd)
        buff = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, buff, length + 1)
        return buff.value
    except:
        return "Unknown"

def sync_status():
    while True:
        try:
            active_app = get_active_window_title()
            
            # 简单的应用名清洗
            if "Visual Studio Code" in active_app:
                display_app = "VS Code"
            elif "Chrome" in active_app:
                display_app = "Chrome"
            else:
                display_app = active_app[:20] # 截取前20个字符防止太长

            payload = {
                "app": display_app,
                "pkg": active_app, # 完整标题放在 pkg 字段备查
                "mood": CurrentMood,
                "network": "Ethernet", # 电脑一般也是有线的，或者检测 wifi
                "device": "Workstation",
                "location": "Chongqing",
                "isCharging": True
            }

            url = f"{API_URL}?secret={SECRET}"
            # verify=False 用于绕过本地 SSL 代理问题
            response = requests.post(url, json=payload, timeout=5, verify=False)
            
            print(f"[{time.strftime('%H:%M:%S')}] Synced: {display_app} | Mood: {CurrentMood}")
            
        except Exception as e:
            print(f"Sync Error: {e}")

        time.sleep(5)  # 每 5 秒同步一次

if __name__ == "__main__":
    print(f"Starting PC Status Sync to: {API_URL}")
    print("Press Ctrl+C to stop.")
    sync_status()
