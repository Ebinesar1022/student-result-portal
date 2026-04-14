using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClassController(AppDbContext context)
        {
            _context = context;
        }

        // GET all
        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            return Ok(await _context.Classes.ToListAsync());
        }

        // POST create
        [HttpPost]
        public async Task<IActionResult> CreateClass(Class cls)
        {
            _context.Classes.Add(cls);
            await _context.SaveChangesAsync();
            return Ok(cls);
        }
    }
}