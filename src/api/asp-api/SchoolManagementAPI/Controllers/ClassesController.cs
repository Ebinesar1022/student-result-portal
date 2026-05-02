using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Dtos;
using SchoolManagementAPI.Infrastructure;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/classes")]
public class ClassesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClassesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClassDto>>> GetClasses()
    {
        var classes = await _context.Classes
            .Include(c => c.ClassSubjects)
            .ThenInclude(cs => cs.Subject)
            .OrderBy(c => c.ClassName)
            .ToListAsync();

        return Ok(classes.Select(c => c.ToDto()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClassDto>> GetClass(string id)
    {
        var entity = await _context.Classes
            .Include(c => c.ClassSubjects)
            .ThenInclude(cs => cs.Subject)
            .FirstOrDefaultAsync(c => c.Id == id);

        return entity == null ? NotFound() : Ok(entity.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<ClassDto>> CreateClass([FromBody] ClassDto dto)
    {
        var entity = new Class
        {
            Id = string.IsNullOrWhiteSpace(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
            ClassName = dto.ClassName,
            ClassCode = dto.ClassCode,
            ExamName = dto.ExamName
        };

        _context.Classes.Add(entity);
        await _context.SaveChangesAsync();
        await ApiDbHelpers.SyncClassSubjectsAsync(_context, entity, dto.Subjects);

        var created = await _context.Classes
            .Include(c => c.ClassSubjects)
            .ThenInclude(cs => cs.Subject)
            .FirstAsync(c => c.Id == entity.Id);

        return Ok(created.ToDto());
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ClassDto>> UpdateClass(string id, [FromBody] ClassDto dto)
    {
        var entity = await _context.Classes.FirstOrDefaultAsync(c => c.Id == id);
        if (entity == null)
        {
            return NotFound();
        }

        entity.ClassName = dto.ClassName;
        entity.ClassCode = dto.ClassCode;
        entity.ExamName = dto.ExamName;

        await _context.SaveChangesAsync();
        await ApiDbHelpers.SyncClassSubjectsAsync(_context, entity, dto.Subjects);

        var updated = await _context.Classes
            .Include(c => c.ClassSubjects)
            .ThenInclude(cs => cs.Subject)
            .FirstAsync(c => c.Id == id);

        return Ok(updated.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClass(string id)
    {
        var entity = await _context.Classes.FirstOrDefaultAsync(c => c.Id == id);
        if (entity == null)
        {
            return NotFound();
        }

        var marks = await _context.Marks.Where(m => m.ClassId == id).ToListAsync();
        var assignments = await _context.TeacherAssignments.Where(a => a.ClassId == id).ToListAsync();
        var classSubjects = await _context.ClassSubjects.Where(cs => cs.ClassId == id).ToListAsync();

        _context.Marks.RemoveRange(marks);
        _context.TeacherAssignments.RemoveRange(assignments);
        _context.ClassSubjects.RemoveRange(classSubjects);
        _context.Classes.Remove(entity);

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
