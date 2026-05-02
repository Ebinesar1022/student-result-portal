using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Dtos;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/students")]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudents(
        [FromQuery] string? classId,
        [FromQuery] string? rollNo,
        [FromQuery] string? password)
    {
        var query = _context.Students
            .Include(s => s.Class)
            .ThenInclude(c => c.ClassSubjects)
            .ThenInclude(cs => cs.Subject)
            .Include(s => s.Sections)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(classId))
        {
            query = query.Where(s => s.ClassId == classId);
        }

        if (!string.IsNullOrWhiteSpace(rollNo))
        {
            query = query.Where(s => s.RollNo == rollNo);
        }

        if (!string.IsNullOrWhiteSpace(password))
        {
            query = query.Where(s => s.Password == password);
        }

        var students = await query.OrderBy(s => s.Name).ToListAsync();
        return Ok(students.Select(s => s.ToDto()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetStudent(string id)
    {
        var student = await _context.Students
            .Include(s => s.Class)
            .ThenInclude(c => c.ClassSubjects)
            .ThenInclude(cs => cs.Subject)
            .Include(s => s.Sections)
            .FirstOrDefaultAsync(s => s.Id == id);

        return student == null ? NotFound() : Ok(student.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] StudentDto dto)
    {
        var student = new Student
        {
            Id = string.IsNullOrWhiteSpace(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
            Name = dto.Name,
            RollNo = dto.RollNo,
            Password = dto.Password,
            Phone = dto.Phone,
            Email = dto.Email,
            Gender = dto.Gender,
            State = dto.State,
            District = dto.District,
            Photo = dto.Photo,
            ClassId = string.IsNullOrWhiteSpace(dto.ClassId) ? null : dto.ClassId
        };

        student.Sections = dto.Section
            .Where(section => !string.IsNullOrWhiteSpace(section))
            .Select(section => new StudentSection
            {
                StudentId = student.Id,
                Section = section
            })
            .ToList();

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        var created = await _context.Students
            .Include(s => s.Class)
            .ThenInclude(c => c.ClassSubjects)
            .ThenInclude(cs => cs.Subject)
            .Include(s => s.Sections)
            .FirstAsync(s => s.Id == student.Id);

        return Ok(created.ToDto());
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<StudentDto>> UpdateStudent(string id, [FromBody] StudentDto dto)
    {
        var student = await _context.Students
            .Include(s => s.Sections)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
        {
            return NotFound();
        }

        student.Name = dto.Name;
        student.RollNo = dto.RollNo;
        student.Password = dto.Password;
        student.Phone = dto.Phone;
        student.Email = dto.Email;
        student.Gender = dto.Gender;
        student.State = dto.State;
        student.District = dto.District;
        student.Photo = dto.Photo;
        student.ClassId = string.IsNullOrWhiteSpace(dto.ClassId) ? null : dto.ClassId;

        _context.StudentSections.RemoveRange(student.Sections);
        student.Sections = dto.Section
            .Where(section => !string.IsNullOrWhiteSpace(section))
            .Select(section => new StudentSection
            {
                StudentId = student.Id,
                Section = section
            })
            .ToList();

        await _context.SaveChangesAsync();

        var updated = await _context.Students
            .Include(s => s.Class)
            .ThenInclude(c => c.ClassSubjects)
            .ThenInclude(cs => cs.Subject)
            .Include(s => s.Sections)
            .FirstAsync(s => s.Id == id);

        return Ok(updated.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(string id)
    {
        var student = await _context.Students
            .Include(s => s.Sections)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
        {
            return NotFound();
        }

        var marks = await _context.Marks.Where(m => m.StudentId == id).ToListAsync();
        _context.Marks.RemoveRange(marks);
        _context.StudentSections.RemoveRange(student.Sections);
        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
