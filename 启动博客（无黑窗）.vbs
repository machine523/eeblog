' ============================================
' shiguang-blog hidden launcher (no console window)
' Double-click: server starts silently in background,
' browser opens http://localhost:3000 after 8 seconds.
' To stop the server: double-click the stop script in the same folder.
' ============================================
Set ws = CreateObject("Wscript.Shell")

' 0 = run completely hidden, False = do not wait
ws.CurrentDirectory = "D:\KimiData\kimi\tasks\2026-09-11\16-31-47-3ee75245\blog"
ws.Run "start-blog.bat", 0, False

WScript.Sleep 8000
ws.Run "http://localhost:3000", 1, False
