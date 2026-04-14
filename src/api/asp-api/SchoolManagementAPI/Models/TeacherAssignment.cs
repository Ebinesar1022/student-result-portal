
namespace SchoolManagementAPI.Models;

public class TeacherAssignment
{
    public string Id { get; set; }

    public string TeacherId { get; set; }
    public Teacher Teacher { get; set; }

    public string ClassId { get; set; }
    public Class Class { get; set; }

    public int SubjectId { get; set; }
    public Subject Subject { get; set; }
}