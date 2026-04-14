namespace SchoolManagementAPI.Models;
public class AuditLog
{
    public string Id { get; set; }

    public string ActorType { get; set; }
    public string ActorId { get; set; }
    public string ActorName { get; set; }
    public string ActorCode { get; set; }

    public string Action { get; set; }
    public string EntityType { get; set; }
    public string EntityId { get; set; }

    public string Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<AuditChange> Changes { get; set; }
}