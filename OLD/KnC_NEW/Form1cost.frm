VERSION 5.00
Object = "{F9043C88-F6F2-101A-A3C9-08002B2F49FB}#1.2#0"; "COMDLG32.OCX"
Begin VB.Form Form1 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "COPY STRUCTURE"
   ClientHeight    =   5475
   ClientLeft      =   45
   ClientTop       =   330
   ClientWidth     =   8415
   Icon            =   "Form1cost.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   5475
   ScaleWidth      =   8415
   StartUpPosition =   3  'Windows Default
   Begin VB.TextBox Text3 
      Height          =   5415
      Left            =   4680
      MultiLine       =   -1  'True
      ScrollBars      =   2  'Vertical
      TabIndex        =   8
      Top             =   0
      Width           =   3735
   End
   Begin VB.CommandButton Command4 
      Caption         =   "RunCopyingStructure"
      Height          =   375
      Left            =   120
      TabIndex        =   7
      Top             =   1440
      Width           =   2415
   End
   Begin VB.CommandButton Command3 
      Caption         =   "Save + Exit"
      Height          =   375
      Left            =   2640
      TabIndex        =   6
      Top             =   1440
      Width           =   1815
   End
   Begin VB.CommandButton Command2 
      Caption         =   "Browse"
      Height          =   375
      Left            =   3840
      TabIndex        =   5
      Top             =   960
      Width           =   735
   End
   Begin VB.TextBox Text2 
      Height          =   375
      Left            =   120
      TabIndex        =   3
      Top             =   960
      Width           =   3615
   End
   Begin MSComDlg.CommonDialog CommonDialog1 
      Left            =   3960
      Top             =   720
      _ExtentX        =   847
      _ExtentY        =   847
      _Version        =   393216
   End
   Begin VB.CommandButton Command1 
      Caption         =   "Browse"
      Height          =   375
      Left            =   3840
      TabIndex        =   2
      Top             =   240
      Width           =   735
   End
   Begin VB.TextBox Text1 
      Height          =   375
      Left            =   120
      TabIndex        =   0
      Top             =   240
      Width           =   3615
   End
   Begin VB.Label Label2 
      Caption         =   "Destiny"
      Height          =   255
      Left            =   240
      TabIndex        =   4
      Top             =   720
      Width           =   735
   End
   Begin VB.Label Label1 
      Caption         =   "Target"
      Height          =   255
      Left            =   240
      TabIndex        =   1
      Top             =   0
      Width           =   615
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Command1_Click()
On Error Resume Next
CommonDialog1.DialogTitle = "Select the target directory.."
CommonDialog1.ShowOpen
Text1.Text = CommonDialog1.FileName
ma$ = Spl(Text1.Text, "\")
Text1.Text = Left$(Text1.Text, Len(Text1.Text) - Len(ma$))
End Sub

Private Sub Command2_Click()
On Error Resume Next
CommonDialog1.DialogTitle = "Select the destiny directory.."
CommonDialog1.ShowOpen
Text2.Text = CommonDialog1.FileName
ma$ = Spl(Text2.Text, "\")
Text2.Text = Left$(Text2.Text, Len(Text2.Text) - Len(ma$))

End Sub

Private Sub Command3_Click()
Open "stucture.set" For Output As #1
s$ = Trim$(Text1.Text)
Print #1, s$
s$ = Trim$(Text2.Text)
Print #1, s$
Close 1
Unload Me
End Sub
 Private Function Spl(sFullPath As String, point As String)
Dim str1() As String
str1 = Split(sFullPath, point)
Spl = str1(UBound(str1))
End Function
Private Sub Command4_Click()
Path = Trim$(Text1.Text)
strFile = Dir(Path & "*")
Do While strFile <> ""
   Text3.Text = Text3.Text + strFile + Chr$(13) + Chr$(10)
 '  sngSize = sngSize + FileLen(Path & strFile)
   strFile = Dir()
   DoEvents
Loop
'MsgBox sngSize
End Sub

Private Sub Form_Load()
On Error GoTo 100
Open "stucture.set" For Input As #1
Line Input #1, s$
Text1.Text = s$
Line Input #1, s$
Text2.Text = s$
Close 1
GoTo 300
100 Resume 200
200
On Error Resume Next
Open "stucture.set" For Output As #2
Print #2, ""
Close 2
300
Dim sngSize As Single
Dim strFile As String
Reset
End Sub
