using System.Text.Json.Serialization;

namespace backend.DTOs;

// DTO record for drone telemetry frontend data
public record DroneTelemetryDTO(
    string? Gateway = null,
    DroneTelemetryDataDto? Data = null
);

public record DroneTelemetryDataDto
{
    public DateTimeOffset? Timestamp {get; init;} = null;
    public double? Latitude {get; init;} = null;
    public double? Longitude {get; init;} = null;
    [JsonPropertyName("height")]
    public double? RelativeAltitude {get; init;} = null;
    public double? AbsoluteAltitude {get; init;} = null;
    public double? GimbalYaw {get; init;} = null;
    public double? GimbalPitch {get; init;} = null;
    public double? GimbalRoll {get; init;} = null;
}
