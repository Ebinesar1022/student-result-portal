using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Dtos;
using SchoolManagementAPI.Infrastructure;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/marks")]
public class MarksController : ControllerBase
{
    private readonly AppDbContext _context;

    public MarksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MarkDto>>> GetMarks(
        [FromQuery] string? classId,
        [FromQuery] string? studentId,
        [FromQuery] string? subject)
    {
        var query = _context.Marks
            .Include(m => m.Subject)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(classId))
        {
            query = query.Where(m => m.ClassId == classId);
        }

        if (!string.IsNullOrWhiteSpace(studentId))
        {
            query = query.Where(m => m.StudentId == studentId);
        }

        if (!string.IsNullOrWhiteSpace(subject))
        {
            query = query.Where(m => m.Subject.Name == subject);
        }

        var marks = await query.ToListAsync();
        return Ok(marks.Select(m => m.ToDto()));
    }

    [HttpPost]
    public async Task<ActionResult<MarkDto>> CreateMark([FromBody] MarkDto dto)
    {
        var subject = await ApiDbHelpers.GetOrCreateSubjectAsync(_context, dto.Subject);

        var teacherId = dto.TeacherId;
        if (string.IsNullOrWhiteSpace(teacherId))
        {
            await ApiDbHelpers.EnsureSystemTeacherAsync(_context);
            teacherId = ApiDbHelpers.SystemTeacherId;
        }

        var entity = new Mark
        {
            Id = string.IsNullOrWhiteSpace(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
            StudentId = dto.StudentId,
            ClassId = dto.ClassId,
            SubjectId = subject.Id,
            Marks = dto.Marks,
            TeacherId = teacherId
        };

        _context.Marks.Add(entity);
        await _context.SaveChangesAsync();

        var created = await _context.Marks.Include(m => m.Subject).FirstAsync(m => m.Id == entity.Id);
        return Ok(created.ToDto());
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MarkDto>> UpdateMark(string id, [FromBody] MarkDto dto)
    {
        var entity = await _context.Marks.FirstOrDefaultAsync(m => m.Id == id);
        if (entity == null)
        {
            return NotFound();
        }

        var subject = await ApiDbHelpers.GetOrCreateSubjectAsync(_context, dto.Subject);
        entity.StudentId = dto.StudentId;
        entity.ClassId = dto.ClassId;
        entity.SubjectId = subject.Id;
        entity.Marks = dto.Marks;

        if (!string.IsNullOrWhiteSpace(dto.TeacherId))
        {
            entity.TeacherId = dto.TeacherId;
        }

        await _context.SaveChangesAsync();
        var updated = await _context.Marks.Include(m => m.Subject).FirstAsync(m => m.Id == id);
        return Ok(updated.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMark(string id)
    {
        var entity = await _context.Marks.FirstOrDefaultAsync(m => m.Id == id);
        if (entity == null)
        {
            return NotFound();
        }

        _context.Marks.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
