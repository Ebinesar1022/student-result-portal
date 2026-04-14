using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/student
        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }

        // POST: api/student
        [HttpPost]
        public async Task<IActionResult> CreateStudent(Student student)
        {
            student.Id = Guid.NewGuid().ToString();

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }

        // PUT: api/student/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, Student updated)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null) return NotFound();

            student.Name = updated.Name;
            student.Phone = updated.Phone;
            student.Email = updated.Email;

            await _context.SaveChangesAsync();

            return Ok(student);
        }

        // DELETE: api/student/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null) return NotFound();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}