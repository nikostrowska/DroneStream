namespace DroneStream.DTOs;

// DTO record for drone telemetry frontend data
public record DroneTelemetryDTO(
    Guid Id,
    string? Timestamp,
    double? Latitude,
    double? Longtitude,
    double? RelativeAltitude,
    double? AbsoluteAltitude,
    double? GimbalYaw,
    double? GimbalPitch,
    double? GimbalRoll
);
