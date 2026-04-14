namespace SchoolManagementAPI.Models;
public class AuditChange
{
    public int Id { get; set; }

    public string AuditId { get; set; }
    public AuditLog Audit { get; set; }

    public string Field { get; set; }
    public string OldValue { get; set; }
    public string NewValue { get; set; }
}