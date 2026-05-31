VERSION 5.00
Begin VB.Form Form1 
   Caption         =   "KnC"
   ClientHeight    =   5370
   ClientLeft      =   60
   ClientTop       =   300
   ClientWidth     =   5145
   Icon            =   "Form1.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   5370
   ScaleWidth      =   5145
   StartUpPosition =   3  'Windows Default
   Begin VB.Image Image6 
      Height          =   855
      Left            =   0
      Top             =   4440
      Width           =   855
   End
   Begin VB.Image Image5 
      Height          =   855
      Left            =   0
      Top             =   3600
      Width           =   855
   End
   Begin VB.Image Image4 
      Height          =   855
      Left            =   0
      Top             =   2760
      Width           =   855
   End
   Begin VB.Image Image3 
      Height          =   855
      Left            =   0
      Top             =   1920
      Width           =   855
   End
   Begin VB.Image Image2 
      Height          =   855
      Left            =   0
      Top             =   1080
      Width           =   855
   End
   Begin VB.Image Image1 
      Height          =   855
      Left            =   0
      Top             =   240
      Width           =   855
   End
   Begin VB.Label Label8 
      Caption         =   "10"
      Height          =   255
      Left            =   1320
      TabIndex        =   11
      Top             =   0
      Width           =   375
   End
   Begin VB.Label Label7 
      Caption         =   "0"
      Height          =   255
      Left            =   2280
      TabIndex        =   10
      Top             =   0
      Width           =   375
   End
   Begin VB.Label Label6 
      Caption         =   "Выход. Его нужно достигнуть игроку, обойдя все преграды. В него можно скинуть стену, если надавить по сильнее."
      Height          =   855
      Index           =   5
      Left            =   840
      TabIndex        =   9
      Top             =   4440
      Visible         =   0   'False
      Width           =   4215
   End
   Begin VB.Label Label6 
      Caption         =   $"Form1.frx":0A8A
      Height          =   855
      Index           =   4
      Left            =   840
      TabIndex        =   8
      Top             =   3600
      Visible         =   0   'False
      Width           =   4215
   End
   Begin VB.Label Label6 
      Caption         =   $"Form1.frx":0B15
      Height          =   855
      Index           =   3
      Left            =   840
      TabIndex        =   7
      Top             =   2760
      Visible         =   0   'False
      Width           =   4215
   End
   Begin VB.Label Label6 
      Caption         =   "Фигура игрока. Ее нужно доставить к выходу стрелками. При этом нужно избежать встречи с врагом."
      Height          =   855
      Index           =   2
      Left            =   840
      TabIndex        =   6
      Top             =   1920
      Visible         =   0   'False
      Width           =   4215
   End
   Begin VB.Label Label6 
      Caption         =   "Стена. Ее нужно или обойти или сдвинуть, если за ней пусто или выход."
      Height          =   855
      Index           =   1
      Left            =   840
      TabIndex        =   5
      Top             =   1080
      Visible         =   0   'False
      Width           =   4215
   End
   Begin VB.Label Label6 
      Caption         =   "Пустое пространство. По нему передвигаются фигуры. На него можно сдвигать  стены."
      Height          =   855
      Index           =   0
      Left            =   840
      TabIndex        =   4
      Top             =   240
      Visible         =   0   'False
      Width           =   4215
   End
   Begin VB.Label Label5 
      BackStyle       =   0  'Transparent
      Caption         =   "как?"
      Height          =   255
      Left            =   1800
      TabIndex        =   3
      Top             =   0
      Width           =   375
   End
   Begin VB.Label Label3 
      BackStyle       =   0  'Transparent
      Caption         =   "сетк"
      Height          =   255
      Left            =   960
      TabIndex        =   2
      Top             =   0
      Width           =   255
   End
   Begin VB.Label Label2 
      BackStyle       =   0  'Transparent
      Caption         =   "обн"
      Height          =   255
      Left            =   480
      TabIndex        =   1
      Top             =   0
      Width           =   375
   End
   Begin VB.Label Label1 
      BackStyle       =   0  'Transparent
      Caption         =   "Нов"
      Height          =   255
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   375
   End
   Begin VB.Shape sh 
      BorderStyle     =   0  'Transparent
      Height          =   5055
      Left            =   0
      Top             =   240
      Width           =   5055
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Base 1

Dim act As Integer
Dim im As Integer
Dim z As Integer
Dim k As Integer
Dim zz As Integer
Dim zzz As Integer
'Dim Images(100) As Image
Dim grid As Integer
'Dim skin As Integer
'war
Dim w_(3) As Integer
'white
Dim p_(3) As Integer
'wall
Dim l_(3) As Integer
'pl
Dim a_(3) As Integer
'black
Dim b_(3) As Integer
'exit
Dim e_(3) As Integer
Dim BL_end As Integer
Dim BL(255, 4) As Integer
'Dim curbl As Integer
Dim M(20, 20) As Integer
'Const ww = 10
'Const www = 9
Dim ww As Integer
Const w3 = 11
Dim plx As Integer
Dim ply As Integer
Dim wax As Integer
Dim way As Integer
Dim x As Integer
Dim y As Integer
Dim GGOO As Integer
Dim GoGo As Integer
'Dim z As Integer

Private Sub lpl(x1 As Integer, y1 As Integer, x2 As Integer, y2 As Integer, xy As Integer, atx As Integer, aty As Integer)
  Select Case xy
  Case 0
 r = p_(1)
 g = p_(2)
 B = p_(3)
  Case 1
 r = l_(1)
 g = l_(2)
 B = l_(3)
  Case 2
 r = a_(1)
 g = a_(2)
 B = a_(3)
  Case 3
 r = w_(1)
 g = w_(2)
 B = w_(3)
  Case 4
 r = b_(1)
 g = b_(2)
 B = b_(3)
  Case 5
 r = e_(1)
 g = e_(2)
 B = e_(3)
  End Select
 'If xy > 0 Then
   Line (x1, y1)-(x2, y2), RGB(r, g, B), BF
 'End If
If grid = 1 Then Line (x1, y1)-(x2, y2), RGB(0, 0, 0), B
  
End Sub
Private Sub Command1_Click()
Call NewG
Call Form_Activate
End Sub
Private Sub Form_Activate()
If act = 0 Then
Label7.Caption = Str(BL_end)
x = Int(sh.Width / ww)
y = Int(sh.Height / ww)
For z = 1 To ww
 For zz = 1 To ww
  Call lpl(sh.Left + (z - 1) * x, sh.Top + (zz - 1) * y, sh.Left + (z - 1) * x + x, sh.Top + (zz - 1) * y + y, M(z, zz), z, zz)
 Next zz
 DoEvents
Next z
If grid = 1 Then
 For z = 1 To ww
  Line (sh.Left, sh.Top)-(sh.Left + x * ww, sh.Top + (z - 1) * y + y), RGB(0, 0, 0), B
 Next z
 For z = 1 To ww
  Line (sh.Left, sh.Top)-(sh.Left + (z - 1) * x + x, sh.Top + y * ww), RGB(0, 0, 0), B
 Next z
End If
Else
'MsgBox act
act = 0
Call Label5_Click
'act = 0
Form1.Top = 100
Form1.Left = 100
Form1.Width = 8000
Form1.Height = 9000
End If
End Sub
Private Sub tot(pox As Integer, poy As Integer)
 If (plx + pox) > ww Or (plx + pox) < 1 Or (ply + poy) > ww Or (ply + poy) < 1 Then GoTo 100
  trg = M(plx + pox, ply + poy)
  'MsgBox trg
  Select Case trg
  Case 0
   M(plx, ply) = 0
   M(plx + pox, ply + poy) = 2
   Call lpl(sh.Left + (plx - 1) * x, sh.Top + (ply - 1) * y, sh.Left + (plx - 1) * x + x, sh.Top + (ply - 1) * y + y, 0, plx, ply)
   plx = plx + pox
   ply = ply + poy
   Call lpl(sh.Left + (plx - 1) * x, sh.Top + (ply - 1) * y, sh.Left + (plx - 1) * x + x, sh.Top + (ply - 1) * y + y, 2, plx, ply)
   GGOO = 1
  Case 1
  If ((plx + pox * 2) <= ww) And ((plx + pox * 2) >= 1) And ((ply + poy * 2) <= (ww)) And ((ply + poy * 2) >= 1) Then
    trg2 = M(plx + pox * 2, ply + poy * 2)
    Select Case trg2
    Case 0, 4
     M(plx, ply) = 0
     M(plx + pox, ply + poy) = 2
     M(plx + pox * 2, ply + poy * 2) = 1
    Call lpl(sh.Left + (plx - 1) * x, sh.Top + (ply - 1) * y, sh.Left + (plx - 1) * x + x, sh.Top + (ply - 1) * y + y, 0, plx, ply)
     plx = plx + pox
     ply = ply + poy
    Call lpl(sh.Left + (plx - 1) * x, sh.Top + (ply - 1) * y, sh.Left + (plx - 1) * x + x, sh.Top + (ply - 1) * y + y, 2, plx, ply)
    Call lpl(sh.Left + (plx - 1 + pox) * x, sh.Top + (ply - 1 + poy) * y, sh.Left + (plx - 1 + pox) * x + x, sh.Top + (ply - 1 + poy) * y + y, 1, plx + pox, ply + poy)
     If trg2 = 4 Then
      MiR = 0
      bl_for = 0
    Do While (MiR = 0) And (bl_for < BL_end)
   DoEvents
    bl_for = bl_for + 1
    If BL(bl_for, 1) = plx + pox And BL(bl_for, 2) = ply + poy Then
     If BL(bl_for, 3) = 1 Then BL(bl_for, 3) = 0
     End If
   Loop
  End If
   GGOO = 1
    Case 5
  M(plx, ply) = 0
   M(plx + pox, ply + poy) = 2
   Call lpl(sh.Left + (plx - 1) * x, sh.Top + (ply - 1) * y, sh.Left + (plx - 1) * x + x, sh.Top + (ply - 1) * y + y, 0, plx, ply)
   plx = plx + pox
   ply = ply + poy
   Call lpl(sh.Left + (plx - 1) * x, sh.Top + (ply - 1) * y, sh.Left + (plx - 1) * x + x, sh.Top + (ply - 1) * y + y, 2, plx, ply)
   GGOO = 1
    End Select
   End If
  Case 3, 4
   smz = MsgBox("ИГРА ПРОИГРАНА!", vbOKOnly, "Вы натолкнулись на врага.")
   GGOO = 2
  Case 5
  smz = MsgBox("ИГРА ВЫИГРАНА!", vbOKOnly, "Вы достигли цели.")
BL_end = BL_end + 1
   GGOO = 2
  End Select
100
End Sub
Private Sub Form_KeyDown(KeyCode As Integer, Shift As Integer)
GGOO = 0
'MsgBox (KeyCode)
'37 <
Select Case KeyCode
Case 37
Call tot(-1, 0)
Case 38
'38 ^
Call tot(0, -1)
Case 39
'39 >
Call tot(1, 0)
Case 40
'40 V
Call tot(0, 1)
End Select
If GGOO = 1 Then Call GOW
If GGOO = 1 Then Call BOW
If GGOO = 2 Then Call Label1_Click

'Call Form_Activate
End Sub
Private Sub BOW()
lost = 0
For z = 1 To BL_end
GoGo = 0
If BL(z, 3) = 1 Then
ax = BL(z, 1)
ay = BL(z, 2)
If ax > 1 Then
If M(ax - 1, ay) = 2 Then lost = 1
End If
If ax < ww Then
If M(ax + 1, ay) = 2 Then lost = 1
End If
If ay > 1 Then
 If M(ax, ay - 1) = 2 Then lost = 1
End If
If ay < ww Then
 If M(ax, ay + 1) = 2 Then lost = 1
End If
If lost = 1 Then
 sms = MsgBox("ИГРА ПРОИГРАНА!", vbOKOnly, "Помощник врага УБИЛ вас!")
 z = BL_end
 GGOO = 2
 GoGo = 1
Else
 gh = Int(Rnd * 4) + 1
 Select Case gh
 Case 1
  If ay > 1 Then Call kety(z, 0, -1)
 Case 2
  If ay < ww Then Call kety(z, 0, 1)
 Case 3
  If ax > 1 Then Call kety(z, -1, 0)
 Case 4
  If ax < ww Then Call kety(z, 1, 0)
 End Select
 If GoGo = 0 Then
  gh = Int(Rnd * 4) + 1
  Select Case gh
  Case 1
   If ay < ww Then Call kety(z, 0, 1)
  Case 2
   If ay > 1 Then Call kety(z, 0, -1)
  Case 3
   If ax < ww Then Call kety(z, 1, 0)
  Case 4
   If ax > 1 Then Call kety(z, -1, 0)
  End Select
 End If
 If GoGo = 0 Then If ax < ww Then Call kety(z, 1, 0)
 If GoGo = 0 Then If ax > 1 Then Call kety(z, -1, 0)
 If GoGo = 0 Then If ay < ww Then Call kety(z, 0, 1)
 If GoGo = 0 Then If ay > 1 Then Call kety(z, 0, -1)
End If
End If
Next z
End Sub
Private Sub GOW()
GoGo = 0
lost = 0
If wax > 1 Then
 If M(wax - 1, way) = 2 Then lost = 1
End If
If wax < ww Then
 If M(wax + 1, way) = 2 Then lost = 1
End If
If way > 1 Then
 If M(wax, way - 1) = 2 Then lost = 1
End If
If way < ww Then
 If M(wax, way + 1) = 2 Then lost = 1
End If
If lost = 1 Then
 sms = MsgBox("ИГРА ПРОИГРАНА!", vbOKOnly, "Враг УБИЛ вас!")
 GGOO = 2
 GoGo = 1
Else
 gh = Int(Rnd * 2) + 1
 Select Case gh
 Case 1
  If plx > wax Then
   Call ket(1, 0)
  ElseIf plx < wax Then
   Call ket(-1, 0)
  End If
  If GoGo = 0 Then
   If ply > way Then
    Call ket(0, 1)
   ElseIf ply < way Then
    Call ket(0, -1)
   End If
  End If
 Case 2
  If ply > way Then
   Call ket(0, 1)
  ElseIf ply < way Then
   Call ket(0, -1)
  End If
  If GoGo = 0 Then
   If plx > wax Then
    Call ket(1, 0)
   ElseIf plx < wax Then
    Call ket(-1, 0)
   End If
  End If
 End Select
 If GoGo = 0 Then
  gh = Int(Rnd * 4) + 1
  Select Case gh
  Case 1
   If way > 1 Then Call ket(0, -1)
  Case 2
   If way < ww Then Call ket(0, 1)
  Case 3
   If wax > 1 Then Call ket(-1, 0)
  Case 4
   If wax < ww Then Call ket(1, 0)
  End Select
 If GoGo = 0 Then
  gh = Int(Rnd * 4) + 1
  Select Case gh
   Case 1
    If way < ww Then Call ket(0, 1)
   Case 2
    If way > 1 Then Call ket(0, -1)
   Case 3
    If wax < ww Then Call ket(1, 0)
   Case 4
    If wax > 1 Then Call ket(-1, 0)
   End Select
  End If
  If GoGo = 0 Then If wax < ww Then Call ket(1, 0)
  If GoGo = 0 Then If wax > 1 Then Call ket(-1, 0)
  If GoGo = 0 Then If way < ww Then Call ket(0, 1)
  If GoGo = 0 Then If way > 1 Then Call ket(0, -1)
 End If
End If
End Sub
Private Sub ket(pox As Integer, poy As Integer)
  'trg = M(wax + pox, way + poy)
If M(wax + pox, way + poy) = 0 Then
   M(wax, way) = 0
   Call lpl(sh.Left + (wax - 1) * x, sh.Top + (way - 1) * y, sh.Left + (wax - 1) * x + x, sh.Top + (way - 1) * y + y, 0, wax, way)
   wax = wax + pox
   way = way + poy
   M(wax, way) = 3
   Call lpl(sh.Left + (wax - 1) * x, sh.Top + (way - 1) * y, sh.Left + (wax - 1) * x + x, sh.Top + (way - 1) * y + y, 3, wax, way)
   GoGo = 1
   End If
End Sub
Private Sub kety(zz As Integer, pox As Integer, poy As Integer)
  'trg = M(wax + pox, way + poy)
If M(BL(zz, 1) + pox, BL(zz, 2) + poy) = 0 Then
   M(BL(zz, 1), BL(zz, 2)) = 0
   Call lpl(sh.Left + (BL(zz, 1) - 1) * x, sh.Top + (BL(zz, 2) - 1) * y, sh.Left + (BL(zz, 1) - 1) * x + x, sh.Top + (BL(zz, 2) - 1) * y + y, 0, BL(zz, 1), BL(zz, 2))
   BL(zz, 1) = BL(zz, 1) + pox
   BL(zz, 2) = BL(zz, 2) + poy
   M(BL(zz, 1), BL(zz, 2)) = 4
   Call lpl(sh.Left + (BL(zz, 1) - 1) * x, sh.Top + (BL(zz, 2) - 1) * y, sh.Left + (BL(zz, 1) - 1) * x + x, sh.Top + (BL(zz, 2) - 1) * y + y, 4, BL(zz, 1), BL(zz, 2))
   GoGo = 1
   End If
End Sub

Private Sub NewG()
For z = 1 To ww
 For zz = 1 To ww
  M(z, zz) = 0
 Next zz
Next z
Randomize Timer
'walls
zz = Int(Rnd * ww * ww / 10)
For z = 1 To Int(ww * 3 * ww / 10 + zz)
 zx = Int(Rnd * (ww) + 1)
 zy = Int(Rnd * (ww) + 1)
 M(zx, zy) = 1
Next z
'player
 zx = Int(Rnd * (ww) + 1)
 zy = Int(Rnd * (ww) + 1)
 M(zx, zy) = 2
plx = zx
ply = zy
'war
MiR = 0
Do While MiR = 0
 zx = Int(Rnd * (ww) + 1)
 zy = Int(Rnd * (ww) + 1)
 If (Abs(plx - zx) + Abs(ply - zy)) > ww / 3 Then
   MiR = 1
 End If
Loop
wax = zx
way = zy
 M(zx, zy) = 3
'black
'BL_end = 2
For z = 1 To BL_end
MiR = 0
Do While MiR = 0
 zx = Int(Rnd * (ww) + 1)
 zy = Int(Rnd * (ww) + 1)
 If (Abs(plx - zx) + Abs(ply - zy)) > ww / 4 Then
   If (wax = zx) And (way = zy) Then
   Else
    MiR = 1
   End If
 End If
Loop
BL(z, 1) = zx
BL(z, 2) = zy
BL(z, 3) = 1
M(zx, zy) = 4
Next z
'Exit
MiR = 0
Do While MiR = 0
 zx = Int(Rnd * (ww) + 1)
 zy = Int(Rnd * (ww) + 1)
 If (Abs(plx - zx) + Abs(ply - zy)) > ww / 4 Then
  If M(zx, zy) = 0 Then
   MiR = 1
  End If
 End If
Loop
 M(zx, zy) = 5
End Sub

Private Sub Form_KeyPress(KeyAscii As Integer)
'MsgBox 1
End Sub

Private Sub Form_Load()
ww = 10
BL_end = 1
act = 0
 p_(1) = 255
 p_(2) = 255
 p_(3) = 255
 
 l_(1) = 128
 l_(2) = 128
 l_(3) = 128

 a_(1) = 32
 a_(2) = 200
 a_(3) = 32

 w_(1) = 128
 w_(2) = 32
 w_(3) = 32

 b_(1) = 0
 b_(2) = 0
 b_(3) = 0

 e_(1) = 200
 e_(2) = 128
 e_(3) = 128
Call NewG

End Sub

Private Sub Form_Resize()
If Form1.WindowState = 0 Then
If Form1.Width < 2000 Then Form1.Width = 2000
If Form1.Height < 2000 + sh.Top Then Form1.Height = 2000 + sh.Top
sh.Width = Form1.Width - 150 - sh.Left
sh.Height = Form1.Height - 400 - sh.Top
Call Form_Activate
End If
End Sub

Private Sub Images_Click(Index As Integer)
'MsgBox (Index)
End Sub

Private Sub Label1_Click()
Call NewG
Call Form_Activate
End Sub

Private Sub Label2_Click()
Call Form_Activate
End Sub

Private Sub Label3_Click()
If grid = 1 Then grid = 0 Else grid = 1
Call Form_Activate
End Sub


Private Sub Label5_Click()
Form1.Width = 5265
Form1.Height = 5730
'DoEvents
For z = 0 To 5
 Label6(z).Visible = True
Next z
 Line (Image1.Left, Image1.Top)-(Image1.Left + Image1.Width, Image1.Top + Image1.Height), RGB(p_(1), p_(2), p_(3)), BF
 Line (Image2.Left, Image2.Top)-(Image2.Left + Image2.Width, Image2.Top + Image2.Height), RGB(l_(1), l_(2), l_(3)), BF
 Line (Image3.Left, Image3.Top)-(Image3.Left + Image3.Width, Image3.Top + Image3.Height), RGB(a_(1), a_(2), a_(3)), BF
 Line (Image4.Left, Image4.Top)-(Image4.Left + Image4.Width, Image4.Top + Image4.Height), RGB(w_(1), w_(2), w_(3)), BF
 Line (Image5.Left, Image5.Top)-(Image5.Left + Image5.Width, Image5.Top + Image5.Height), RGB(b_(1), b_(2), b_(3)), BF
 Line (Image6.Left, Image6.Top)-(Image6.Left + Image6.Width, Image6.Top + Image6.Height), RGB(e_(1), e_(2), e_(3)), BF
'act = 1
sas = MsgBox("Ознакомились с помощью?", vbOKOnly, "Помощь")
'act = 0
For z = 0 To 5
 Label6(z).Visible = False
Next z
If act = 0 Then Call Form_Activate
End Sub

Private Sub Label8_Click()
'MsgBox ww
If ww = 10 Then ww = 15: Label8.Caption = 15: Call NewG: GoTo 100
If ww = 15 Then ww = 20: Label8.Caption = 20: Call NewG: GoTo 100
If ww = 20 Then ww = 10: Label8.Caption = 10: Call NewG: GoTo 100
100
Call Form_Activate
End Sub
