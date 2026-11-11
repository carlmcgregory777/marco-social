param([string]$nome)
Add-Type -AssemblyName System.Drawing
Add-Type @'
using System; using System.Runtime.InteropServices;
public class W3 { [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr dc, uint f); [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h, out RECT r); public struct RECT{public int L,T,R,B;} }
'@
$h=(Get-Process mstsc | Where-Object MainWindowTitle -ne '' | Select-Object -First 1).MainWindowHandle
$r=New-Object W3+RECT; [W3]::GetClientRect($h,[ref]$r) | Out-Null
$bmp=New-Object System.Drawing.Bitmap ($r.R),($r.B)
$g=[System.Drawing.Graphics]::FromImage($bmp); $dc=$g.GetHdc(); [W3]::PrintWindow($h,$dc,3) | Out-Null; $g.ReleaseHdc($dc)
$out="C:\Users\stang\code\marco-social\produzione\algory11-curve-fitting\schermate\$nome.png"
$bmp.Save($out,[System.Drawing.Imaging.ImageFormat]::Png); "$out $($r.R)x$($r.B)"
