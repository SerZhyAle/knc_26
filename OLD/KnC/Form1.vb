

Public Class Form1
    Dim firstrun As Boolean

    Private Sub Form1_Activated(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Activated
        If Not firstrun Then
            firstrun = True
            Me.ButtExit.Location = New System.Drawing.Point(Me.Width - Me.ButtExit.Width - 2, Me.ButtExit.Location.Y)

        End If
    End Sub

    Private Sub Form1_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load

    End Sub

    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ButtExit.Click
        Application.Exit()

    End Sub
End Class
