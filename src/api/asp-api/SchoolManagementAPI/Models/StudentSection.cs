namespace SchoolManagementAPI.Models;
public class StudentSection
{
    public int Id { get; set; }

    public string StudentId { get; set; } = string.Empty;

    public Student? Student { get; set; }

    public string Section { get; set; } = string.Empty;
}