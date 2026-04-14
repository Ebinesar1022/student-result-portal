namespace SchoolManagementAPI.Models;
public class Class
{
    public string Id { get; set; }
    public string ClassName { get; set; }
    public string ClassCode { get; set; }
    public string ExamName { get; set; }

    public ICollection<ClassSubject> ClassSubjects { get; set; }
}