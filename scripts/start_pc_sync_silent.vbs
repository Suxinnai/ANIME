Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "g:\code\demo\scripts"
WshShell.Run "pythonw pc_sync.py", 0, False
