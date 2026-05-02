using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Dtos;

public static class ApiMappings
{
    public static ClassDto ToDto(this Class entity)
    {
        return new ClassDto
        {
            Id = entity.Id,
            ClassName = entity.ClassName,
            ClassCode = entity.ClassCode,
            ExamName = entity.ExamName,
            Subjects = entity.ClassSubjects?
                .Where(cs => cs.Subject != null)
                .Select(cs => cs.Subject.Name)
                .Distinct()
                .OrderBy(name => name)
                .ToList() ?? new List<string>()
        };
    }

    public static TeacherDto ToDto(this Teacher entity)
    {
        return new TeacherDto
        {
            Id = entity.Id,
            Name = entity.Name,
            TeacherNo = entity.TeacherNo,
            Password = entity.Password,
            Phone = entity.Phone,
            Email = entity.Email,
            Gender = entity.Gender,
            MaritalStatus = entity.MaritalStatus
        };
    }

    public static StudentDto ToDto(this Student entity)
    {
        var classSubjects = entity.Class?.ClassSubjects?
            .Where(cs => cs.Subject != null)
            .Select(cs => cs.Subject.Name)
            .Distinct()
            .ToList() ?? new List<string>();

        var subjectMarks = classSubjects
            .Select(name => new SubjectMarkDto
            {
                Name = name,
                Marks = 0
            })
            .ToList();

        return new StudentDto
        {
            Id = entity.Id,
            ClassId = entity.ClassId ?? string.Empty,
            ClassName = entity.Class?.ClassName ?? string.Empty,
            Name = entity.Name,
            RollNo = entity.RollNo,
            Photo = entity.Photo,
            Password = entity.Password,
            Phone = entity.Phone,
            Email = entity.Email,
            Gender = entity.Gender,
            Section = entity.Sections.Select(s => s.Section).ToList(),
            State = entity.State,
            District = entity.District,
            Subjects = subjectMarks
        };
    }

    public static MarkDto ToDto(this Mark entity)
    {
        return new MarkDto
        {
            Id = entity.Id,
            StudentId = entity.StudentId,
            ClassId = entity.ClassId,
            Subject = entity.Subject?.Name ?? string.Empty,
            Marks = entity.Marks,
            TeacherId = entity.TeacherId
        };
    }

    public static TeacherAssignmentDto ToDto(this TeacherAssignment entity)
    {
        return new TeacherAssignmentDto
        {
            Id = entity.Id,
            TeacherId = entity.TeacherId,
            ClassId = entity.ClassId,
            Subject = entity.Subject?.Name ?? string.Empty
        };
    }

    public static AuditLogDto ToDto(this AuditLog entity)
    {
        return new AuditLogDto
        {
            Id = entity.Id,
            ActorType = entity.ActorType,
            ActorId = entity.ActorId,
            ActorName = entity.ActorName,
            ActorCode = entity.ActorCode,
            Action = entity.Action,
            EntityType = entity.EntityType,
            EntityId = entity.EntityId,
            Description = entity.Description,
            CreatedAt = entity.CreatedAt,
            Changes = entity.Changes?.Select(change => new AuditChangeDto
            {
                Field = change.Field,
                OldValue = change.OldValue,
                NewValue = change.NewValue
            }).ToList() ?? new List<AuditChangeDto>()
        };
    }
}
