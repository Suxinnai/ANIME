
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

# ================= 配置加载 =================
def load_dotenv(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    key, value = line.split("=", 1)
                    os.environ[key] = value

# 加载 .env 文件 (项目根目录下的 .env)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

API_URL = os.getenv("STATUS_API_URL", "https://anime.suxinnai.online/api/status/update")
SECRET = os.getenv("STATUS_SECRET", "")

# AI 配置
AI_API_KEY = os.getenv("AI_API_KEY", "")
AI_BASE_URL = os.getenv("AI_BASE_URL", "https://api.xiaomimimo.com/v1")

if not AI_API_KEY or not SECRET:
    print("[Warning] Missing API_KEY or SECRET in .env file!")

client = OpenAI(
    api_key=AI_API_KEY,
    base_url=AI_BASE_URL
)

user32 = ctypes.windll.user32

# ================= 辅助函数 =================
def get_active_window_info():
    """获取前台窗口信息：进程名和窗口标题"""
    try:
        hwnd = user32.GetForegroundWindow()
        
        # 获取窗口标题
        length = user32.GetWindowTextLengthW(hwnd)
        title_buff = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, title_buff, length + 1)
        window_title = title_buff.value
        
        # 获取进程ID
        pid = wintypes.DWORD()
        user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
        
        # 获取进程名
        process_name = ""
        try:
            process = psutil.Process(pid.value)
            process_name = process.name()  # 例如: "chrome.exe"
        except:
            pass
        
        return process_name, window_title
    except:
        return "", ""

def get_active_window_title():
    """兼容性函数，只返回标题"""
    _, title = get_active_window_info()
    return title

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
            # 1. 获取基础信息（进程名 + 窗口标题）
            process_name, window_title = get_active_window_info()
            # print(f"[Debug] Process: {process_name} | Title: {window_title}") 
            current_network = get_network_type()

            # 2. 智能应用识别（优先使用进程名）
            app_display_name = window_title or "Desktop"  # 默认显示窗口标题
            app_category = "other"  # 默认分类
            is_music_mode = False
            music_context = ""
            
            # 基于进程名的精准识别
            lower_proc = process_name.lower()
            
            # 浏览器（保留网页标题作为显示内容）
            if any(x in lower_proc for x in ["chrome", "edge", "firefox", "brave", "opera", "msedge"]):
                app_category = "browser"
                # 浏览器使用网页标题，但截断过长标题
                if window_title and len(window_title) > 50:
                    app_display_name = window_title[:47] + "..."
                elif window_title:
                    app_display_name = window_title
                else:
                    # 如果没有标题，才用浏览器名
                    if "chrome" in lower_proc:
                        app_display_name = "Google Chrome"
                    elif "edge" in lower_proc or "msedge" in lower_proc:
                        app_display_name = "Microsoft Edge"
                    elif "firefox" in lower_proc:
                        app_display_name = "Firefox"
                    else:
                        app_display_name = "Browser"
            
            # 编程软件
            elif any(x in lower_proc for x in ["code", "cursor", "pycharm", "intellij", "devenv"]):
                app_category = "coding"
                if "code" in lower_proc:
                    app_display_name = "Visual Studio Code"
                elif "cursor" in lower_proc:
                    app_display_name = "Cursor"
                elif "pycharm" in lower_proc:
                    app_display_name = "PyCharm"
                else:
                    app_display_name = "IDE"
            
            # 通讯软件
            elif any(x in lower_proc for x in ["qq.exe", "wechat", "telegram", "discord", "tim"]):
                app_category = "chat"
                if "qq" in lower_proc and "音乐" not in lower_proc:
                    app_display_name = "QQ"
                elif "wechat" in lower_proc:
                    app_display_name = "WeChat"
                elif "telegram" in lower_proc:
                    app_display_name = "Telegram"
                else:
                    app_display_name = "Messaging"
            
            # 如果进程名没匹配到，回退到窗口标题检测
            elif app_category == "other":
                lower_win = window_title.lower()
                if any(x in lower_win for x in ["chrome", "firefox", "edge"]):
                    app_category = "browser"
                elif any(x in lower_win for x in ["visual studio code", "vscode"]):
                    app_category = "coding"
            
            # 优先使用 Windows Media API 检测音乐 (不覆盖前台应用分类)
            is_playing, song_title, song_artist = get_media_info()
            
            if is_playing and song_title:
                is_music_mode = True
                # 注意：不要改 app_category，保留前台应用的真实分类
                if song_artist:
                    music_context = f"{song_title} - {song_artist}"
                else:
                    music_context = song_title
                print(f"[Media API] Detected: {music_context}")

            # 3. AI 生成 (减少频率，只有状态根本改变时才生成)
            # AI 的上下文：如果有音乐，用音乐生成心情；否则用当前应用
            ai_context_key = music_context if is_music_mode else app_display_name
            
            # 只有当状态改变，或者每隔 5 分钟 (100次循环) 重新生成一次以保持新鲜感
            if ai_context_key != last_context:
                print(f"State changed to: {ai_context_key}, asking AI...")
                ai_mood = generate_ai_status(ai_context_key, is_music_mode)
                last_context = ai_context_key
                last_ai_text = ai_mood
            
            # 4. 发送数据
            # 逻辑分离：
            # app: 始终显示前台窗口 (灵动岛用)
            # track: 音乐信息 (右下角用)
            # category: 当前应用的分类 (图标用) - 如果在听歌，右下角会覆盖 category 显示 CD 样式，但图标仍可保留
            
            payload = {
                "app": app_display_name,      # 灵动岛显示友好应用名
                "pkg": window_title,          # 保留原始窗口标题备用
                "track": music_context if is_music_mode else None, # 新增：专门的音乐字段
                "mood": last_ai_text,         # AI 吐槽
                "category": app_category,     # 应用分类
                "network": current_network,
                "device": "RedmiBook Pro 15 2021",
                "location": "重庆",
                "isCharging": True
            }

            url = f"{API_URL}?secret={SECRET}"
            requests.post(url, json=payload, timeout=5, verify=False)
            
            print(f"Synced: App={app_display_name} | Music={music_context if is_music_mode else 'None'} | Cat={app_category}")
            
        except Exception as e:
            print(f"Sync Logic Error: {e}")
            import traceback
            traceback.print_exc()

        time.sleep(3) # 加快同步频率到 3秒

if __name__ == "__main__":
    print(f"Starting AI Sync (Lightweight Mode)...")
    sync_loop()
