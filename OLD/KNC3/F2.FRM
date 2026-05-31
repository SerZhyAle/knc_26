VERSION 5.00
Begin VB.Form f2 
   ClientHeight    =   2310
   ClientLeft      =   60
   ClientTop       =   60
   ClientWidth     =   2310
   ControlBox      =   0   'False
   LinkTopic       =   "Form1"
   ScaleHeight     =   2310
   ScaleWidth      =   2310
   StartUpPosition =   3  'Windows Default
   Begin VB.DirListBox d2 
      Height          =   765
      Left            =   0
      TabIndex        =   6
      Top             =   1080
      Width           =   1095
   End
   Begin VB.FileListBox fl1 
      Height          =   1065
      Left            =   1200
      TabIndex        =   5
      Top             =   720
      Width           =   1095
   End
   Begin VB.DriveListBox d1 
      Height          =   315
      Left            =   0
      TabIndex        =   4
      Top             =   720
      Width           =   1095
   End
   Begin VB.CommandButton c3 
      Caption         =   "Cancel"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   1200
      TabIndex        =   3
      Top             =   1920
      Width           =   1095
   End
   Begin VB.CommandButton c2 
      Caption         =   "OK"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   0
      TabIndex        =   2
      Top             =   1920
      Width           =   1095
   End
   Begin VB.TextBox t1 
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   0
      TabIndex        =   0
      Text            =   "file.."
      Top             =   240
      Width           =   2295
   End
   Begin VB.Label l1 
      AutoSize        =   -1  'True
      BackStyle       =   0  'Transparent
      Caption         =   "Select the file.."
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   240
      Left            =   120
      TabIndex        =   1
      Top             =   0
      Width           =   2040
   End
End
Attribute VB_Name = "f2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Dim hei
Private Sub c2_Click()
If fin = "1" Then Call savestring(H_C_U, mykey$, "LngFile", t1.Text)
If fin = "2" And Val(t1) >= 9 And Val(t1) <= 90 Then Call savestring(H_C_U, mykey$, "ColRows", t1.Text)
Unload Me
End Sub

Private Sub c3_Click()
Unload Me
End Sub

Private Sub d1_Change()
d2.Path = Left(Trim(d1), 2) + "\"
End Sub

Private Sub d2_Change()
fl1.Path = d2.Path
End Sub

Private Sub fl1_Click()
t1.Text = d2.Path + "\" + fl1.FileName
End Sub

Private Sub Form_Load()
Call FrmUp(f2, "f2")
Call FrmLng
If fin = "1" Then
    hei = 2415
    t1 = getstring(H_C_U, mykey$, "LngFile")
    s$ = getstring(H_C_U, mykey$, "DefDrive")
    If s$ <> "" Then d1.Drive = s$
    s$ = getstring(H_C_U, mykey$, "DefFolder")
    If s$ <> "" Then d2.Path = s$
End If
If fin = "2" Then
    t1 = getstring(H_C_U, mykey$, "ColRows")
    hei = 1245
    d1.Visible = False
    d2.Visible = False
    fl1.Visible = False
    If f2.Height > hei Then f2.Height = hei
    If f2.Width > 2430 Then f2.Height = 2430
End If
End Sub

Private Sub Form_MouseDown(Button As Integer, Shift As Integer, X As Single, Y As Single)
Call FrmMove(f2)
End Sub

Private Sub Form_Resize()
If f2.Height < hei Then f2.Height = hei
If f2.Width < 2430 Then f2.Width = 2430
t1.Width = f2.Width - 120
d1.Width = (f2.Width - 240) / 2
d2.Width = d1.Width
fl1.Left = d1.Width + 120
fl1.Width = d1.Width
fl1.Height = 1065 + (f2.Height - hei)
d2.Height = 765 + (f2.Height - hei)
c2.Top = f2.Height - c2.Height - 120
c3.Top = c2.Top
End Sub

Private Sub Form_Unload(Cancel As Integer)
Call FrmDown(f2, "f2")
If fin = "1" Then
    Call savestring(H_C_U, mykey$, "DefDrive", d1.Drive)
    Call savestring(H_C_U, mykey$, "DefFolder", d2.Path)
End If
End Sub

Private Sub FrmLng()
If fin = "1" Then
If lngload > 15 Then
    l1.Caption = m$(13)
    c2.Caption = m$(15)
    c3.Caption = m$(16)
Else
    l1.Caption = "Select the file.."
    c2.Caption = "OK"
    c3.Caption = "Cancel"
End If
End If
If fin = "2" Then
If lngload > 17 Then
    l1.Caption = m$(14)
    c2.Caption = m$(18)
    c3.Caption = m$(16)
Else
    l1.Caption = "Set ColRows range.."
    c2.Caption = "Set"
    c3.Caption = "Cancel"
End If
End If
End Sub

Private Sub t1_Change()
If fin = "2" And Val(t1) = 0 And Len(t1.Text) > 0 Then t1.Text = ""
End Sub

Private Sub t1_LostFocus()
If fin = "2" And Val(t1) > 90 Then t1 = "90"
If fin = "2" And Val(t1) < 9 Then t1 = "9"
End Sub
