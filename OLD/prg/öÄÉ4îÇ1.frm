VERSION 5.00
Begin VB.Form Форма1 
   Caption         =   "Форма1"
   ClientHeight    =   3240
   ClientLeft      =   60
   ClientTop       =   300
   ClientWidth     =   4680
   LinkTopic       =   "Форма1"
   ScaleHeight     =   3240
   ScaleWidth      =   4680
   StartUpPosition =   3  'Окна По Умолчанию
   Begin VB.PictureBox p 
      Height          =   1215
      Left            =   720
      ScaleHeight     =   1155
      ScaleWidth      =   1275
      TabIndex        =   0
      Top             =   360
      Width           =   1335
   End
End
Attribute VB_Name = "Форма1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Const WS_CHILD = &H40000000

Private Declare Function mciSendString Lib "winmm" Alias "mciSendStringA" _
(ByVal lpstrCommand As String, ByVal lpstrReturnString As String, _
ByVal uReturnLength As Long, ByVal hwndCallback As Long) As Long

Private Declare Function mciGetErrorString Lib "winmm" Alias _
"mciGetErrorStringA" (ByVal dwError As Long, ByVal lpstrBuffer As String, _
ByVal uLength As Long) As Long

Private Declare Function GetShortPathName Lib "kernel32" Alias _
"GetShortPathNameA" (ByVal lpszLongPath As String, _
ByVal lpszShortPath As String, ByVal cchBuffer As Long) As Long

Sub PlayAVIPictureBox(FileName As String, ByVal Window As PictureBox)
Dim RetVal As Long
Dim CommandString As String
Dim ShortFileName As String * 260
Dim deviceIsOpen As Boolean

' Retrieve short file name format
RetVal = GetShortPathName(FileName, ShortFileName, Len(ShortFileName))
FileName = Left$(ShortFileName, RetVal)

' Open the device
CommandString = "Open " & FileName & " type AVIVideo alias AVIFile parent " _
& CStr(Window.hWnd) & " style " & CStr(WS_CHILD)
RetVal = mciSendString(CommandString, vbNullString, 0, 0&)
If RetVal Then GoTo error

' remember that the device is now open
deviceIsOpen = True

' Resize the movie to PictureBox size
CommandString = "put AVIFile window at 0 0 " & CStr(Window.ScaleWidth / _
Screen.TwipsPerPixelX) & " " & CStr(Window.ScaleHeight / _
Screen.TwipsPerPixelY)
RetVal = mciSendString(CommandString, vbNullString, 0, 0&)
If RetVal <> 0 Then GoTo error

' Play the file
CommandString = "Play AVIFile wait"
RetVal = mciSendString(CommandString, vbNullString, 0, 0&)
If RetVal <> 0 Then GoTo error

' Close the device
CommandString = "Close AVIFile"
RetVal = mciSendString(CommandString, vbNullString, 0, 0&)
If RetVal <> 0 Then GoTo error

Exit Sub

error:
' An error occurred.
' Get the error description
Dim ErrorString As String
ErrorString = Space$(256)
mciGetErrorString RetVal, ErrorString, Len(ErrorString)
ErrorString = Left$(ErrorString, InStr(ErrorString, vbNullChar) - 1)

' close the device if necessary
If deviceIsOpen Then
CommandString = "Close AVIFile"
mciSendString CommandString, vbNullString, 0, 0&
End If

' raise a custom error, with the proper description
Err.Raise 999, , ErrorString

End Sub

Private Sub P_Click()
'www.VBGreatone.8m.com
'Put the path of the filename here
PlayAVIPictureBox "C:\1.avi", p
End Sub

