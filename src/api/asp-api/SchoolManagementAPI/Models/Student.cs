namespace SchoolManagementAPI.Models;
public class Student
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string RollNo { get; set; }
    public string Password { get; set; }

    public string Phone { get; set; }
    public string Email { get; set; }
    public string Gender { get; set; }
    public string State { get; set; }
    public string District { get; set; }
    public string? Photo { get; set; }

    public string? ClassId { get; set; }
    public Class? Class { get; set; }

    public ICollection<StudentSection> Sections { get; set; } = new List<StudentSection>();
}