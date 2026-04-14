
namespace SchoolManagementAPI.Models;

public class Mark
{
    public string Id { get; set; }

    public string StudentId { get; set; }
    public Student Student { get; set; }

    public string ClassId { get; set; }
    public Class Class { get; set; }

    public int SubjectId { get; set; }
    public Subject Subject { get; set; }

    public int Marks { get; set; }

    public string TeacherId { get; set; }
    public Teacher Teacher { get; set; }
}