using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Dtos;
using SchoolManagementAPI.Infrastructure;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/teacherAssignments")]
public class TeacherAssignmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeacherAssignmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeacherAssignmentDto>>> GetAssignments([FromQuery] string? teacherId)
    {
        var query = _context.TeacherAssignments
            .Include(a => a.Subject)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(teacherId))
        {
            query = query.Where(a => a.TeacherId == teacherId);
        }

        var assignments = await query.ToListAsync();
        return Ok(assignments.Select(a => a.ToDto()));
    }

    [HttpPost]
    public async Task<ActionResult<TeacherAssignmentDto>> CreateAssignment([FromBody] TeacherAssignmentDto dto)
    {
        var subject = await ApiDbHelpers.GetOrCreateSubjectAsync(_context, dto.Subject);
        var entity = new TeacherAssignment
        {
            Id = string.IsNullOrWhiteSpace(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
            TeacherId = dto.TeacherId,
            ClassId = dto.ClassId,
            SubjectId = subject.Id
        };

        _context.TeacherAssignments.Add(entity);
        await _context.SaveChangesAsync();

        var created = await _context.TeacherAssignments.Include(a => a.Subject).FirstAsync(a => a.Id == entity.Id);
        return Ok(created.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAssignment(string id)
    {
        var entity = await _context.TeacherAssignments.FirstOrDefaultAsync(a => a.Id == id);
        if (entity == null)
        {
            return NotFound();
        }

        _context.TeacherAssignments.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
