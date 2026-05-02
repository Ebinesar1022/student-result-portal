namespace SchoolManagementAPI.Dtos;

public class SubjectMarkDto
{
    public string Name { get; set; } = string.Empty;
    public int Marks { get; set; }
}

public class ClassDto
{
    public string Id { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string ClassCode { get; set; } = string.Empty;
    public List<string> Subjects { get; set; } = new();
    public string ExamName { get; set; } = string.Empty;
}

public class StudentDto
{
    public string Id { get; set; } = string.Empty;
    public string ClassId { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string RollNo { get; set; } = string.Empty;
    public string? Photo { get; set; }
    public string Password { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public List<string> Section { get; set; } = new();
    public string State { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public List<SubjectMarkDto> Subjects { get; set; } = new();
}

public class TeacherDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string TeacherNo { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Gender { get; set; }
    public string? MaritalStatus { get; set; }
}

public class MarkDto
{
    public string Id { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string ClassId { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public int Marks { get; set; }
    public string? TeacherId { get; set; }
}

public class TeacherAssignmentDto
{
    public string Id { get; set; } = string.Empty;
    public string TeacherId { get; set; } = string.Empty;
    public string ClassId { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
}

public class AuditChangeDto
{
    public string Field { get; set; } = string.Empty;
    public object? OldValue { get; set; }
    public object? NewValue { get; set; }
}

public class AuditLogDto
{
    public string Id { get; set; } = string.Empty;
    public string ActorType { get; set; } = string.Empty;
    public string ActorId { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public string ActorCode { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<AuditChangeDto> Changes { get; set; } = new();
}

public class LoginRequestDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
