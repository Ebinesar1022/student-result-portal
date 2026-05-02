using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Dtos;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/audit")]
public class AuditController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuditController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuditLogDto>>> GetAuditLogs(
        [FromQuery] string? action,
        [FromQuery] string? actorCode)
    {
        var query = _context.AuditLogs
            .Include(a => a.Changes)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(action))
        {
            query = query.Where(a => a.Action == action);
        }

        if (!string.IsNullOrWhiteSpace(actorCode))
        {
            query = query.Where(a => a.ActorCode == actorCode);
        }

        var logs = await query
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(logs.Select(a => a.ToDto()));
    }

    [HttpPost]
    public async Task<ActionResult<AuditLogDto>> CreateAuditLog([FromBody] AuditLogDto dto)
    {
        var log = new AuditLog
        {
            Id = string.IsNullOrWhiteSpace(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
            ActorType = dto.ActorType,
            ActorId = dto.ActorId,
            ActorName = dto.ActorName,
            ActorCode = dto.ActorCode,
            Action = dto.Action,
            EntityType = dto.EntityType,
            EntityId = dto.EntityId,
            Description = dto.Description,
            CreatedAt = dto.CreatedAt == default ? DateTime.UtcNow : dto.CreatedAt,
            Changes = dto.Changes.Select(change => new AuditChange
            {
                Field = change.Field,
                OldValue = SerializeAuditValue(change.OldValue),
                NewValue = SerializeAuditValue(change.NewValue)
            }).ToList()
        };

        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();

        var created = await _context.AuditLogs.Include(a => a.Changes).FirstAsync(a => a.Id == log.Id);
        return Ok(created.ToDto());
    }

    private static string SerializeAuditValue(object? value)
    {
        if (value == null)
        {
            return string.Empty;
        }

        return value switch
        {
            JsonElement json => json.ValueKind == JsonValueKind.String
                ? json.GetString() ?? string.Empty
                : json.GetRawText(),
            _ => value.ToString() ?? string.Empty
        };
    }
}
