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
   Begin VB.CommandButton Комманда1 
      Caption         =   "Комманда1"
      Height          =   375
      Left            =   720
      TabIndex        =   0
      Top             =   840
      Width           =   855
   End
End
Attribute VB_Name = "Форма1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Комманда1_Click()
z = 0
For z = 3000 To 1 Step -1
zz = zz + z
Next z
Print zz
End Sub
