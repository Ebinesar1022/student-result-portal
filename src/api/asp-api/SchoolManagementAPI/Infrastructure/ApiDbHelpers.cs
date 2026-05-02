using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Infrastructure;

public static class ApiDbHelpers
{
    public const string SystemTeacherId = "SYSTEM";

    public static async Task<Subject> GetOrCreateSubjectAsync(AppDbContext context, string subjectName)
    {
        var trimmedName = subjectName.Trim();
        var subject = await context.Subjects.FirstOrDefaultAsync(s => s.Name == trimmedName);

        if (subject != null)
        {
            return subject;
        }

        subject = new Subject
        {
            Name = trimmedName
        };

        context.Subjects.Add(subject);
        await context.SaveChangesAsync();
        return subject;
    }

    public static async Task EnsureSystemTeacherAsync(AppDbContext context)
    {
        var existing = await context.Teachers.FirstOrDefaultAsync(t => t.Id == SystemTeacherId);
        if (existing != null)
        {
            return;
        }

        context.Teachers.Add(new Teacher
        {
            Id = SystemTeacherId,
            Name = "System",
            TeacherNo = SystemTeacherId,
            Password = SystemTeacherId,
            Email = "system@local",
            Phone = string.Empty,
            Gender = string.Empty,
            MaritalStatus = string.Empty
        });

        await context.SaveChangesAsync();
    }

    public static async Task SyncClassSubjectsAsync(AppDbContext context, Class entity, IEnumerable<string> subjectNames)
    {
        var normalizedSubjects = subjectNames
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Select(name => name.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var existingLinks = await context.ClassSubjects
            .Where(cs => cs.ClassId == entity.Id)
            .Include(cs => cs.Subject)
            .ToListAsync();

        foreach (var link in existingLinks.Where(link => normalizedSubjects.All(name =>
                     !string.Equals(name, link.Subject.Name, StringComparison.OrdinalIgnoreCase))))
        {
            context.ClassSubjects.Remove(link);
        }

        foreach (var subjectName in normalizedSubjects)
        {
            var alreadyLinked = existingLinks.Any(link =>
                string.Equals(link.Subject.Name, subjectName, StringComparison.OrdinalIgnoreCase));

            if (alreadyLinked)
            {
                continue;
            }

            var subject = await GetOrCreateSubjectAsync(context, subjectName);
            context.ClassSubjects.Add(new ClassSubject
            {
                ClassId = entity.Id,
                SubjectId = subject.Id
            });
        }

        await context.SaveChangesAsync();
    }
}
