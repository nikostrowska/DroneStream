namespace backend.DTOs;

// DTO record for drone telemetry frontend data
public record DroneTelemetryDTO(
    string? Timestamp,
    double? Latitude,
    double? Longtitude,
    double? RelativeAltitude,
    double? AbsoluteAltitude,
    double? GimbalYaw,
    double? GimbalPitch,
    double? GimbalRoll
);
