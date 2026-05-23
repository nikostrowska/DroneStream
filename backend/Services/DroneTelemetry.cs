using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using System.Text.Json;
using backend.DTOs;
using Microsoft.Extensions.Caching.Memory;


namespace backend.Services
{
    public class DroneTelemetry(
        IHubContext<DroneTelemetryHub> hubContext,
        ILogger<DroneTelemetry> logger,
        IMemoryCache cache
            ) : IDroneTelemetry
    {
        private readonly IHubContext<DroneTelemetryHub> _hubContext = hubContext;
        private readonly IMemoryCache _cache = cache;
        private readonly ILogger<DroneTelemetry> _logger = logger;


        public async Task HandleMessage(string topic, string payload)
        {
            // SN parsowany z topic
            var topicParts = topic.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var serialNumber = topicParts.Length >= 3 ? topicParts[2].Trim() : null;
            if (string.IsNullOrWhiteSpace(serialNumber))
            {
                _logger.LogWarning("Could not determine drone serial number from topic: {Topic}", topic);
                return;
            }
            using var jsonTelemetry = JsonDocument.Parse(payload);
            var gateway = jsonTelemetry.RootElement.GetProperty("gateway").GetString()?.Trim();

            // _logger.LogInformation(
            //     "Received MQTT payload with sn: '{SerialNumber}', gateway: '{Gateway}'",
            //     serialNumber, gateway);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            var data = jsonTelemetry.RootElement.GetProperty("data").Deserialize<DroneTelemetryDataDto>(options);

            var droneTelemetry = new DroneTelemetryDTO
            {
                SerialNumber = serialNumber,   // SN drona z MQTT
                Gateway = gateway,        // SN pilota z JSON
                Data = data
            };

            // jeśli gateway == sn to telemetria pilota na 100%
            if (droneTelemetry.Gateway == droneTelemetry.SerialNumber)
            {
                _logger.LogInformation(JsonSerializer.Serialize(droneTelemetry, new JsonSerializerOptions { WriteIndented = true }));
                _cache.Set(serialNumber, droneTelemetry, TimeSpan.FromMinutes(60));
                await _hubContext.Clients.Group(serialNumber).SendAsync("PilotTelemetry", droneTelemetry);
            }

            // _logger.LogInformation(JsonSerializer.Serialize(droneTelemetry, new JsonSerializerOptions { WriteIndented = true }));

            await _hubContext.Clients.Group(serialNumber).SendAsync("ReceiveTelemetry", droneTelemetry);
        }
    }
}
