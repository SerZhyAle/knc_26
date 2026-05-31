Attribute VB_Name = "un"
Option Base 1
Declare Sub SetWindowPos Lib "user32" (ByVal hWnd As Long, ByVal hWndInsertAfter As Long, ByVal X As Long, ByVal Y As Long, ByVal cx As Long, ByVal cy As Long, ByVal wFlags As Long)

Const enno = "Sege Zhigunenko, 2003, Odessa, Ukraine. Жигуненко Сергей, 2003 г., Одесса Украина. sza@mail.od.ua http://www.sza.in.net.ua"
Public flg
Public fin
Public lngload
Public Const maxm = 120
Public m$(maxm)
Public mykey$

Const SWP_NOSIZE = 1
Const SWP_NOMOVE = 2
Dim flags As Integer
Public Const H_C_U = &H80000001

Public Const HKEY_CLASSES_ROOT = &H80000000
Public Const HKEY_CURRENT_USER = &H80000001
Public Const HKEY_LOCAL_MACHINE = &H80000002
Public Const HKEY_USERS = &H80000003
Public Const HKEY_PERFORMANCE_DATA = &H80000004
Public Const ERROR_SUCCESS = 0&

' Registry API prototypes

Declare Function RegCloseKey Lib "advapi32.dll" (ByVal Hkey As Long) As Long
Declare Function RegCreateKey Lib "advapi32.dll" Alias "RegCreateKeyA" (ByVal Hkey As Long, ByVal lpSubKey As String, phkResult As Long) As Long
Declare Function RegDeleteKey Lib "advapi32.dll" Alias "RegDeleteKeyA" (ByVal Hkey As Long, ByVal lpSubKey As String) As Long
Declare Function RegDeleteValue Lib "advapi32.dll" Alias "RegDeleteValueA" (ByVal Hkey As Long, ByVal lpValueName As String) As Long
Declare Function RegOpenKey Lib "advapi32.dll" Alias "RegOpenKeyA" (ByVal Hkey As Long, ByVal lpSubKey As String, phkResult As Long) As Long
Declare Function RegQueryValueEx Lib "advapi32.dll" Alias "RegQueryValueExA" (ByVal Hkey As Long, ByVal lpValueName As String, ByVal lpReserved As Long, lpType As Long, lpData As Any, lpcbData As Long) As Long
Declare Function RegSetValueEx Lib "advapi32.dll" Alias "RegSetValueExA" (ByVal Hkey As Long, ByVal lpValueName As String, ByVal Reserved As Long, ByVal dwType As Long, lpData As Any, ByVal cbData As Long) As Long
Public Const REG_SZ = 1                         ' Unicode nul terminated string
Public Const REG_DWORD = 4                      ' 32-bit number
'for winmoving
Const WM_NCLBUTTONDOWN = &HA1
Const HTCAPTION = 2

Public Declare Function SendMessage Lib "user32" Alias "SendMessageA" (ByVal hWnd As Long, ByVal wMsg As Long, ByVal wParam As Long, lParam As Any) As Long
Public Declare Function ReleaseCapture Lib "user32" () As Long

Public Sub savekey(Hkey As Long, strPath As String)
Dim keyhand&
r = RegCreateKey(Hkey, strPath, keyhand&)
r = RegCloseKey(keyhand&)
End Sub

Public Function getstring(Hkey As Long, strPath As String, strValue As String)

Dim keyhand As Long
Dim datatype As Long
Dim lResult As Long
Dim strBuf As String
Dim lDataBufSize As Long
Dim intZeroPos As Integer
r = RegOpenKey(Hkey, strPath, keyhand)
lResult = RegQueryValueEx(keyhand, strValue, 0&, lValueType, ByVal 0&, lDataBufSize)
If lValueType = REG_SZ Then
    strBuf = String(lDataBufSize, " ")
    lResult = RegQueryValueEx(keyhand, strValue, 0&, 0&, ByVal strBuf, lDataBufSize)
    If lResult = ERROR_SUCCESS Then
        intZeroPos = InStr(strBuf, Chr$(0))
        If intZeroPos > 0 Then
            getstring = Left$(strBuf, intZeroPos - 1)
        Else
            getstring = strBuf
        End If
    End If
End If
End Function


Public Sub savestring(Hkey As Long, strPath As String, strValue As String, strdata As String)
Dim keyhand As Long
Dim r As Long
r = RegCreateKey(Hkey, strPath, keyhand)
r = RegSetValueEx(keyhand, strValue, 0, REG_SZ, ByVal strdata, Len(strdata))
r = RegCloseKey(keyhand)
End Sub

Public Sub PrgStart(ff, nam$)
mykey$ = "Software\SZA\" + nam$
s$ = App.Major & "." & App.Minor & "." & App.Revision
Call savestring(H_C_U, mykey$, "Version", s$)
Call savestring(H_C_U, mykey$, "AboutThis", enno)
Call savestring(H_C_U, mykey$, "Caption", ff.Caption)
Call savestring(H_C_U, mykey$, "Comments", App.Comments)
Call savestring(H_C_U, mykey$, "CompanyName", App.CompanyName)
Call savestring(H_C_U, mykey$, "EXEName", App.EXEName)
Call savestring(H_C_U, mykey$, "FileDescription", App.FileDescription)
Call savestring(H_C_U, mykey$, "HelpFile", App.HelpFile)
Call savestring(H_C_U, mykey$, "LegalCopyright", App.LegalCopyright)
Call savestring(H_C_U, mykey$, "LegalTrademarks", App.LegalTrademarks)
s$ = App.Path & "\" & App.EXEName & ".exe"
Call savestring(H_C_U, mykey$, "Path", s$)
Call savestring(H_C_U, mykey$, "ThreadID", App.ThreadID)
Call savestring(H_C_U, mykey$, "StartMode", App.StartMode)
Call savestring(H_C_U, mykey$, "ProductName", App.ProductName)

firstup$ = getstring(H_C_U, mykey$, "FirstUp")
If firstup$ = "" Then Call savestring(H_C_U, mykey$, "FirstUp", Date$ + " " + Time$)
Call savestring(H_C_U, mykey$, "LastUp", Date$ + " " + Time$)
loads$ = getstring(H_C_U, mykey$, "Loads")
If Val(loads$) = 0 Then
    Call savestring(H_C_U, mykey$, "Loads", "1")
    Else
    Call savestring(H_C_U, mykey$, "Loads", Str(Val(loads) + 1))
End If
End Sub
Public Sub FrmUp(ff, frm$)
z = Val(getstring(H_C_U, mykey$, frm$ + "X"))
If z < Screen.Width Then ff.Left = z
z = Val(getstring(H_C_U, mykey$, frm$ + "Y"))
If z < Screen.Height Then ff.Top = z
z = Val(getstring(H_C_U, mykey$, frm$ + "W"))
If z <> 0 Then ff.Width = z
z = Val(getstring(H_C_U, mykey$, frm$ + "H"))
If z <> 0 Then ff.Height = z
End Sub

Public Sub FrmDown(ff, frm$)
If ff.Left < Screen.Width Then Call savestring(H_C_U, mykey$, frm$ + "X", Str(ff.Left))
If ff.Top < Screen.Height Then Call savestring(H_C_U, mykey$, frm$ + "Y", Str(ff.Top))
Call savestring(H_C_U, mykey$, frm$ + "W", Str(ff.Width))
Call savestring(H_C_U, mykey$, frm$ + "H", Str(ff.Height))
End Sub

Public Sub FrmUpAdv(ff, frm$)
z = Val(getstring(H_C_U, mykey$, frm$ + "OnTop"))
If z = 1 Then
    SetWindowPos ff.hWnd, -1, ff.Left / 15, ff.Top / 15, ff.Width / 15, ff.Height / 15, flags
Else
    SetWindowPos ff.hWnd, -2, ff.Left / 15, ff.Top / 15, ff.Width / 15, ff.Height / 15, flags
End If
End Sub
Public Sub FrmMove(ff)
    Call ReleaseCapture
    Call SendMessage(ff.hWnd, WM_NCLBUTTONDOWN, HTCAPTION, 0&)
End Sub
Public Sub Lng()
lngfil = getstring(H_C_U, mykey$, "LngFile")
On Error GoTo 100
Open lngfil For Input As 1
Do While EOF(1) = False And z < maxm
    z = z + 1
    Line Input #1, m$(z)
Loop
lngload = z
Close 1
GoTo 200
100 reset: Resume 200
200
End Sub
