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
   Begin VB.Label label2 
      Caption         =   "Метка1"
      Height          =   255
      Left            =   480
      TabIndex        =   1
      Top             =   240
      Width           =   2175
   End
   Begin VB.Label label1 
      Caption         =   "Метка1"
      Height          =   255
      Left            =   480
      TabIndex        =   0
      Top             =   480
      Width           =   1935
   End
End
Attribute VB_Name = "Форма1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Form_Load()
label1.ForeColor = &H80000012
label2.ForeColor = &HC0&
label1.Caption = "Привет!"
label2.Caption = "Привет!"
label2.Top = label1.Top - 10
label2.Left = label1.Left - 10
label2.Visible = False
End Sub

Private Sub Form_MouseMove(Button As Integer, Shift As Integer, X As Single, Y As Single)
label2.Visible = False
End Sub

Private Sub Label1_MouseMove(Button As Integer, Shift As Integer, X As Single, Y As Single)
label2.Visible = True
End Sub
 
