VERSION 5.00
Begin VB.Form f1 
   Caption         =   "Form1"
   ClientHeight    =   3165
   ClientLeft      =   60
   ClientTop       =   375
   ClientWidth     =   4680
   LinkTopic       =   "Form1"
   ScaleHeight     =   3165
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "f1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Form_Load()
Call PrgStart(f1)
Call FrmUp(f1, "f1")
Call FrmUpAdv(f1, "f1")
End Sub

Private Sub Form_MouseDown(Button As Integer, Shift As Integer, X As Single, Y As Single)
Call FrmMove(f1)
End Sub

Private Sub Form_Unload(Cancel As Integer)
Call FrmDown(f1, "f1")
End Sub
