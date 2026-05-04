using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

// DTO record for drone frontend data
public record DroneDTO(
    Guid Id,
    string Name,
    string? Model,
    string SerialNumber,
    bool IsOnline,
    DateTime? LastActivity
);

public record AddDroneDTO(
    [Required] [MaxLength(50)] string Name,
    [MaxLength(50)] string? Model,
    [Required] [MaxLength(25)] string SerialNumber
);

public record UpdateDroneDTO(
    [MaxLength(50)] string? Name,
    [MaxLength(50)] string? Model,
    [MaxLength(25)] string? SerialNumber
);

