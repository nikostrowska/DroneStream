namespace backend.DTOs;

// DTO record for drone frontend data
public record DroneDTO(
    string Name,
    string? Model,
    string SerialNumber,
    bool IsOnline,
    DateTime? LastActivity
);

public record AddDroneDTO(
    string Name,
    string? Model,
    string SerialNumber
);

public record UpdateDroneDTO(
    string? Name,
    string? Model,
    string? SerialNumber
);

