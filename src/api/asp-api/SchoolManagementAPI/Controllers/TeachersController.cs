using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Dtos;
using SchoolManagementAPI.Infrastructure;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/teachers")]
public class TeachersController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeachersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeacherDto>>> GetTeachers(
        [FromQuery] string? teacherNo,
        [FromQuery] string? password)
    {
        var query = _context.Teachers
            .Where(t => t.Id != ApiDbHelpers.SystemTeacherId)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(teacherNo))
        {
            query = query.Where(t => t.TeacherNo == teacherNo);
        }

        if (!string.IsNullOrWhiteSpace(password))
        {
            query = query.Where(t => t.Password == password);
        }

        var teachers = await query.OrderBy(t => t.Name).ToListAsync();
        return Ok(teachers.Select(t => t.ToDto()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeacherDto>> GetTeacher(string id)
    {
        var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.Id == id);
        return teacher == null ? NotFound() : Ok(teacher.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<TeacherDto>> CreateTeacher([FromBody] TeacherDto dto)
    {
        var teacher = new Teacher
        {
            Id = string.IsNullOrWhiteSpace(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
            Name = dto.Name,
            TeacherNo = dto.TeacherNo,
            Password = dto.Password,
            Phone = dto.Phone ?? string.Empty,
            Email = dto.Email ?? string.Empty,
            Gender = dto.Gender ?? string.Empty,
            MaritalStatus = dto.MaritalStatus ?? string.Empty
        };

        _context.Teachers.Add(teacher);
        await _context.SaveChangesAsync();
        return Ok(teacher.ToDto());
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TeacherDto>> UpdateTeacher(string id, [FromBody] TeacherDto dto)
    {
        var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.Id == id);
        if (teacher == null)
        {
            return NotFound();
        }

        teacher.Name = dto.Name;
        teacher.TeacherNo = dto.TeacherNo;
        teacher.Password = dto.Password;
        teacher.Phone = dto.Phone ?? string.Empty;
        teacher.Email = dto.Email ?? string.Empty;
        teacher.Gender = dto.Gender ?? string.Empty;
        teacher.MaritalStatus = dto.MaritalStatus ?? string.Empty;

        await _context.SaveChangesAsync();
        return Ok(teacher.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeacher(string id)
    {
        var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.Id == id);
        if (teacher == null)
        {
            return NotFound();
        }

        var marks = await _context.Marks.Where(m => m.TeacherId == id).ToListAsync();
        var assignments = await _context.TeacherAssignments.Where(a => a.TeacherId == id).ToListAsync();

        _context.Marks.RemoveRange(marks);
        _context.TeacherAssignments.RemoveRange(assignments);
        _context.Teachers.Remove(teacher);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
