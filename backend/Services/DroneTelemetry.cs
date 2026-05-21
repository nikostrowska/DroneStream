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


        public DroneTelemetry(
            IHubContext<DroneTelemetryHub> hubContext,
            ILogger<DroneTelemetry> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task HandleMessage(string topic, string payload)
        {
            // SN parsowany z topic
            var topicParts = topic.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var serialNumber = topicParts.Length >= 3 ? topicParts[2].Trim() : null;

            using var jsonTelemetry = JsonDocument.Parse(payload);
            var gateway = jsonTelemetry.RootElement.GetProperty("gateway").GetString()?.Trim();

            _logger.LogInformation(
                "Received MQTT payload with sn: '{SerialNumber}', gateway: '{Gateway}'",
                serialNumber, gateway);

            var options = new JsonSerializerOptions {
                PropertyNameCaseInsensitive = true 
            };
            var data = jsonTelemetry.RootElement.GetProperty("data").Deserialize<DroneTelemetryDataDto>(options);

            var droneTelemetry = new DroneTelemetryDTO
            {
                SerialNumber = serialNumber,   // SN drona z MQTT
                Gateway = gateway,        // SN pilota z JSON
                Data = data
            };

            _logger.LogInformation(JsonSerializer.Serialize(droneTelemetry, new JsonSerializerOptions
            {
                WriteIndented = true
            }));

            if (!string.IsNullOrWhiteSpace(serialNumber))
            {
                await _hubContext.Clients.Group(serialNumber).SendAsync("ReceiveTelemetry", droneTelemetry);
            }
            else
            {
                _logger.LogWarning("Could not determine drone serial number from topic: {Topic}", topic);
            }
        }
    }
}