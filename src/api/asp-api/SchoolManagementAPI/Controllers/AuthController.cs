using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Dtos;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (request.Username == "admin" && request.Password == "admin123")
        {
            return Ok(new { role = "admin" });
        }

        var teacher = await _context.Teachers
            .Where(t => t.TeacherNo == request.Username && t.Password == request.Password)
            .FirstOrDefaultAsync();

        if (teacher != null)
        {
            return Ok(new
            {
                role = "teacher",
                teacher = teacher.ToDto()
            });
        }

        var student = await _context.Students
            .Where(s => s.RollNo == request.Username && s.Password == request.Password)
            .FirstOrDefaultAsync();

        if (student != null)
        {
            return Ok(new
            {
                role = "student",
                rollNo = student.RollNo
            });
        }

        return Unauthorized();
    }
}
