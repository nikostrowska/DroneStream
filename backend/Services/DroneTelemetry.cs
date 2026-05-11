using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using System.Text.Json;
using backend.DTOs;


namespace backend.Services
{
    public class DroneTelemetry : IDroneTelemetry
    {
        private readonly IHubContext<DroneTelemetryHub> _hubContext;
        private readonly ILogger<DroneTelemetry> _logger;
        private readonly DroneStatusService _statusService;

        public DroneTelemetry(
            IHubContext<DroneTelemetryHub> hubContext,
            ILogger<DroneTelemetry> logger,
            DroneStatusService statusService)
        {
            _hubContext = hubContext;
            _logger = logger;
            _statusService = statusService;
        }

        public async Task HandleMessage(string topic, string payload)
        {
            using var jsonTelemetry = JsonDocument.Parse(payload);
            var gateway = jsonTelemetry.RootElement.GetProperty("gateway").GetString()?.Trim();
            var serialNumber = jsonTelemetry.RootElement.GetProperty("serialNumber").GetString()?.Trim();
            var identifier = serialNumber ?? gateway; // Use serialNumber if available, otherwise gateway
            _logger.LogInformation("Received MQTT payload with gateway: '{Gateway}', serialNumber: '{SerialNumber}', using identifier: '{Identifier}'", gateway, serialNumber, identifier);
            var options = new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            };
            var data = jsonTelemetry.RootElement.GetProperty("data").Deserialize<DroneTelemetryDataDto>(options);

            if (!string.IsNullOrWhiteSpace(identifier))
            {
                _statusService.UpdateActivity(identifier);
                _logger.LogInformation("Updated activity for drone: {Identifier}", identifier);
            }

            var droneTelemetry = new DroneTelemetryDTO
            {
                Gateway = identifier, // Use identifier instead of gateway
                Data = data
            };
            _logger.LogInformation(JsonSerializer.Serialize(droneTelemetry, new JsonSerializerOptions
            {
                WriteIndented = true
            }));

            var topicParts = topic.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var groupName = topicParts.Length >= 3 ? topicParts[2].Trim() : string.Empty;
            if (!string.IsNullOrWhiteSpace(groupName))
            {
                await _hubContext.Clients.Group(groupName).SendAsync("ReceiveTelemetry", droneTelemetry);
            }
        }
    }
}
