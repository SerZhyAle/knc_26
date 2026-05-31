VERSION 5.00
Begin VB.Form Form1 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Parallel RUN list.."
   ClientHeight    =   3540
   ClientLeft      =   45
   ClientTop       =   330
   ClientWidth     =   3360
   Icon            =   "Form1_2.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   3540
   ScaleWidth      =   3360
   StartUpPosition =   3  'Windows Default
   Begin VB.CheckBox Check1 
      Caption         =   "Set Normal Focus for all applications"
      Height          =   195
      Left            =   120
      TabIndex        =   4
      Top             =   2880
      Width           =   3015
   End
   Begin VB.CommandButton Command3 
      Caption         =   "Exit"
      Height          =   375
      Left            =   2400
      TabIndex        =   3
      Top             =   3120
      Width           =   855
   End
   Begin VB.CommandButton Command2 
      Caption         =   "Save&START!"
      Height          =   375
      Left            =   120
      TabIndex        =   2
      Top             =   3120
      Width           =   1215
   End
   Begin VB.CommandButton Command1 
      Caption         =   "Save"
      Height          =   375
      Left            =   1440
      TabIndex        =   1
      Top             =   3120
      Width           =   855
   End
   Begin VB.TextBox Text1 
      Height          =   2775
      Left            =   120
      MultiLine       =   -1  'True
      ScrollBars      =   2  'Vertical
      TabIndex        =   0
      Top             =   0
      Width           =   3135
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Dim ddoo As Integer
Dim c$
Private Sub Command1_Click()
Open c$ For Output As 1
Print #1, Text1.Text

Close 1

End Sub

Private Sub Command2_Click()
On Error Resume Next
Call Command1_Click
Open c$ For Input As 1
Do While EOF(1) = False
Line Input #1, s$
s$ = Trim$("" + s$)
If Len(s$) > 0 Then
'MsgBox (s$)
If Check1.Value = 1 Then a1 = Shell(s$, vbNormalFocus) Else a1 = Shell(s$, vbHide)
End If
DoEvents
Loop
Close 1
End Sub

Private Sub Command3_Click()
Unload Me
End Sub

Private Sub Form_Activate()
If ddoo = 1 Then Call Command3_Click
'MsgBox ddoo
End Sub

Private Sub Form_Load()
c$ = Trim$(Command$)
If c$ = "" Then c$ = "run_list.lst"
ddoo = 0
If UCase(Left$(c$, 3)) = "DO " Then c$ = Right$(c$, Len(c$) - 3): ddoo = 1
'MsgBox c$
On Error GoTo 100
Open c$ For Input As 1
Close 1
GoTo 200
100 Open c$ For Output As #2
Print #2, ""
Close 2
Resume 200
200
Reset
Open c$ For Input As 3
On Error Resume Next
Do While EOF(3) = False
Line Input #3, s$
If ddoo = 0 Then
Text1.Text = Text1.Text + s$ + Chr$(13) + Chr$(10)
Else
s$ = Trim$("" + s$)
a1 = Shell(s$, vbHide)
DoEvents
End If
Loop
Close 3
Reset
End Sub
