using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔥 Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔥 Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔥 Controllers
builder.Services.AddControllers();

var app = builder.Build();

// 🔥 Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// OPTIONAL
// app.UseHttpsRedirection();

app.MapControllers();

app.Run();