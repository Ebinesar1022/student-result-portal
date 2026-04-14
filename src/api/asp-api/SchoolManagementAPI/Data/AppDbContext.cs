using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<ClassSubject> ClassSubjects { get; set; }
        public DbSet<Mark> Marks { get; set; }
        public DbSet<TeacherAssignment> TeacherAssignments { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<AuditChange> AuditChanges { get; set; }
        public DbSet<StudentSection> StudentSections { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Mark>()
                .HasOne(m => m.Student)
                .WithMany()
                .HasForeignKey(m => m.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Mark>()
                .HasOne(m => m.Class)
                .WithMany()
                .HasForeignKey(m => m.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Mark>()
                .HasOne(m => m.Subject)
                .WithMany()
                .HasForeignKey(m => m.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Mark>()
                .HasOne(m => m.Teacher)
                .WithMany()
                .HasForeignKey(m => m.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}