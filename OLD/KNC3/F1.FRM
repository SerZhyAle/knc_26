VERSION 5.00
Begin VB.Form f1 
   ClientHeight    =   1470
   ClientLeft      =   60
   ClientTop       =   60
   ClientWidth     =   3075
   ControlBox      =   0   'False
   LinkTopic       =   "Form1"
   ScaleHeight     =   1470
   ScaleWidth      =   3075
   StartUpPosition =   3  'Windows Default
   Begin VB.Line li8 
      BorderColor     =   &H0000FFFF&
      BorderWidth     =   10
      X1              =   2760
      X2              =   2760
      Y1              =   360
      Y2              =   720
   End
   Begin VB.Line li7 
      BorderColor     =   &H0000FFFF&
      BorderWidth     =   10
      X1              =   2640
      X2              =   2640
      Y1              =   360
      Y2              =   720
   End
   Begin VB.Line li6 
      BorderColor     =   &H00FF0000&
      BorderWidth     =   10
      X1              =   2400
      X2              =   2400
      Y1              =   840
      Y2              =   1200
   End
   Begin VB.Line li5 
      BorderColor     =   &H00FF0000&
      BorderWidth     =   10
      X1              =   2280
      X2              =   2280
      Y1              =   840
      Y2              =   1200
   End
   Begin VB.Line li4 
      BorderColor     =   &H00FF0000&
      BorderWidth     =   10
      X1              =   2160
      X2              =   2160
      Y1              =   840
      Y2              =   1200
   End
   Begin VB.Line li3 
      BorderColor     =   &H000000FF&
      BorderWidth     =   10
      X1              =   2400
      X2              =   2400
      Y1              =   360
      Y2              =   720
   End
   Begin VB.Line li2 
      BorderColor     =   &H000000FF&
      BorderWidth     =   10
      X1              =   2280
      X2              =   2280
      Y1              =   360
      Y2              =   720
   End
   Begin VB.Line li1 
      BorderColor     =   &H000000FF&
      BorderWidth     =   10
      X1              =   2160
      X2              =   2160
      Y1              =   360
      Y2              =   720
   End
   Begin VB.Label l2 
      BackStyle       =   0  'Transparent
      Caption         =   "E&xit"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   1680
      TabIndex        =   7
      Top             =   0
      Visible         =   0   'False
      Width           =   615
   End
   Begin VB.Label l1 
      BackStyle       =   0  'Transparent
      Caption         =   "O&ptions"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   720
      TabIndex        =   6
      Top             =   0
      Visible         =   0   'False
      Width           =   855
   End
   Begin VB.Label l3 
      BackStyle       =   0  'Transparent
      Caption         =   " &File"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   0
      TabIndex        =   5
      Top             =   0
      Visible         =   0   'False
      Width           =   615
   End
   Begin VB.Label l8 
      BackStyle       =   0  'Transparent
      Caption         =   " Hide this list"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   120
      TabIndex        =   4
      Top             =   1200
      Visible         =   0   'False
      Width           =   1935
   End
   Begin VB.Label l7 
      BackStyle       =   0  'Transparent
      Caption         =   " &Help about  F1"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   120
      TabIndex        =   3
      Top             =   960
      Visible         =   0   'False
      Width           =   1935
   End
   Begin VB.Label l5 
      BackStyle       =   0  'Transparent
      Caption         =   " &New Game    F4"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   120
      TabIndex        =   2
      Top             =   240
      Visible         =   0   'False
      Width           =   1935
   End
   Begin VB.Label l6 
      BackStyle       =   0  'Transparent
      Caption         =   " &Save file.. F2"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   120
      TabIndex        =   1
      Top             =   720
      Visible         =   0   'False
      Width           =   1935
   End
   Begin VB.Label l4 
      BackStyle       =   0  'Transparent
      Caption         =   " &Load file.. F3"
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   9.75
         Charset         =   204
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   120
      TabIndex        =   0
      Top             =   480
      Visible         =   0   'False
      Width           =   1935
   End
   Begin VB.Shape sh2 
      BackStyle       =   1  'Opaque
      Height          =   1215
      Left            =   120
      Top             =   240
      Visible         =   0   'False
      Width           =   1935
   End
   Begin VB.Shape sh1 
      BackStyle       =   1  'Opaque
      Height          =   255
      Left            =   0
      Top             =   0
      Visible         =   0   'False
      Width           =   2295
   End
End
Attribute VB_Name = "f1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Dim mnu1
Dim mnu2
Dim ztim

Private Sub Form_Load()
Call PrgStart(f1, "KnC3")
Call FrmUp(f1, "f1")
Call FrmUpAdv(f1, "f1")
Call Lng
Call FrmLng
ztim = Timer
Call ss
End Sub

Private Sub Form_MouseDown(Button As Integer, Shift As Integer, X As Single, Y As Single)
Call FrmMove(f1)
End Sub

Private Sub Form_MouseMove(Button As Integer, Shift As Integer, X As Single, Y As Single)
If ztim + 0.5 < Timer Then
If Y < 130 And mnu1 = 0 Then Call MnuShow
If Y > 400 And mnu1 = 1 Then Call MnuHide
ztim = Timer
End If
End Sub

Private Sub Form_Resize()
If f1.Width < 2400 Then f1.Width = 2400
If f1.Height < 1590 Then f1.Height = 1590
Call ss
End Sub

Private Sub Form_Unload(Cancel As Integer)
Call FrmDown(f1, "f1")
'tm1.Enabled = False
End Sub

Private Sub l1_Click()
If mnu2 = 0 Then Call Mnu2Show(2)
End Sub

Private Sub l2_DblClick()
Unload Me
End Sub

Private Sub FrmLng()
If lngload > 7 Then
l3.Caption = m$(1)
l2.Caption = m$(3)
l1.Caption = m$(2)
l8.Caption = m$(8)
End If
End Sub

Private Sub MnuShow()
sh1.Visible = True
l1.Visible = True
l2.Visible = True
l3.Visible = True
mnu1 = 1
'tm1.Enabled = True
For z = 1 To 14
    zz = 18 * z
    sh1.Height = zz
    l1.Height = zz
    l2.Height = zz
    l3.Height = zz
'    f1.Refresh
    ztim = Timer
    Do While ztim + 0.005 > Timer
        DoEvents
    Loop
Next z
'tm1.Enabled = False
End Sub
Private Sub MnuHide()
For z = 14 To 1 Step -1
    zz = 18 * z
    sh1.Height = zz
    l1.Height = zz
    l2.Height = zz
    l3.Height = zz
'    f1.Refresh
    ztim = Timer
    Do While ztim + 0.005 > Timer
        DoEvents
    Loop
Next z
mnu1 = 0
sh1.Visible = False
l1.Visible = False
l2.Visible = False
l3.Visible = False
End Sub

Private Sub l3_Click()
Call Mnu2Show(1)
End Sub

Private Sub Mnu2Show(mode)
If mode = 1 Then
    sh2.Left = 120
    l4.Left = 120
    l5.Left = 120
    l6.Left = 120
    l7.Left = 120
    l8.Left = 120
    If lngload > 6 Then
        l5.Caption = m$(4)
        l4.Caption = m$(5)
        l6.Caption = m$(6)
        l7.Caption = m$(7)
    Else
        l5.Caption = " &New Game    F4"
        l4.Caption = " &Load file.. F3"
        l6.Caption = " &Save file.. F2"
        l7.Caption = " &Help about  F1"
    End If
Else
    sh2.Left = 600
    l4.Left = 600
    l5.Left = 600
    l6.Left = 600
    l7.Left = 600
    l8.Left = 600
    If lngload > 11 Then
        l5.Caption = m$(9)
        l4.Caption = m$(10)
        l6.Caption = m$(11)
        l7.Caption = m$(12)
    Else
        l5.Caption = " S&et language"
        l4.Caption = " Set &ColRows"
        l6.Caption = ""
        l7.Caption = ""
    End If
End If
sh2.Visible = True
l4.Visible = True
l5.Visible = True
l6.Visible = True
l7.Visible = True
l8.Visible = True
mnu2 = 1
For z = 1 To 43
    zz = 45 * z
    sh2.Width = zz
    l4.Width = zz
    l5.Width = zz
    l6.Width = zz
    l7.Width = zz
    l8.Width = zz
    'f1.Refresh
    ztim = Timer
    Do While (ztim + 0.0001) > Timer
        DoEvents
    Loop
Next z
End Sub

Private Sub l4_Click()
If l5.Left = 600 Then
    fin = "2"
    f2.Show 1
    
End If
End Sub

Private Sub l5_Click()
If l5.Left = 600 Then
    fin = "1"
    f2.Show 1
    Call Lng
    Call FrmLng
    f1.Refresh
Else
End If
End Sub

Private Sub l8_Click()
mnu2 = 0
For z = 43 To 1 Step -1
    zz = 45 * z
    sh2.Width = zz
    l4.Width = zz
    l5.Width = zz
    l6.Width = zz
    l7.Width = zz
    l8.Width = zz
    'f1.Refresh
    ztim = Timer
    Do While (ztim + 0.0001) > Timer
        DoEvents
    Loop
Next z
If mnu1 = 1 Then Call MnuHide
sh2.Visible = False
l4.Visible = False
l5.Visible = False
l6.Visible = False
l7.Visible = False
l8.Visible = False
End Sub
Private Sub ss()
cn2 = 300
cn1 = (f1.Width - cn2 * 2) / 3 * 2
cn3 = cn2 * 1.5
cn4 = (f1.Height - cn2 * 2) / 2
cn5 = cn4 + cn2

li1.X1 = cn2: li1.X2 = cn2: li1.Y1 = cn2: li1.Y2 = f1.Height - cn2
li2.X1 = cn2: li2.X2 = cn1: li2.Y1 = cn4: li2.Y2 = cn2
li3.X1 = cn2: li3.X2 = li2.X2: li3.Y1 = li2.Y1: li3.Y2 = f1.Height - cn2
li4.X1 = cn3: li4.X2 = cn3: li4.Y1 = cn5: li4.Y2 = f1.Height - cn2
li5.X1 = cn3: li5.X2 = li2.X2 - cn2: li5.Y1 = li4.Y1: li5.Y2 = li3.Y2
li6.X1 = li5.X2: li6.X2 = li5.X2: li6.Y1 = li5.Y2: li6.Y2 = li4.Y1
li7.X1 = li2.X1 + cn2: li7.X2 = li2.X2 + cn2: li7.Y1 = li2.Y1: li7.Y2 = li2.Y2
li8.X1 = li7.X1: li8.X2 = li7.X2: li8.Y1 = li2.Y1: li8.Y2 = li3.Y2
End Sub
