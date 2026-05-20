using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using System.Text.Json;
using backend.DTOs;
using Microsoft.Extensions.Caching.Memory;


namespace backend.Services
{
    public class DroneTelemetry(IHubContext<DroneTelemetryHub> hubContext, IMemoryCache cache, ILogger<DroneTelemetry> logger) : IDroneTelemetry
    {
        private readonly IHubContext<DroneTelemetryHub> _hubContext = hubContext;
        private readonly IMemoryCache _cache = cache;
        private readonly ILogger _logger = logger;

        public async Task HandleMessage(string topic, string payload)
        {
            var topic_parts = topic.Split('/');
            if (topic_parts.Length < 3) return;
            var topicSN = topic_parts[2];

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


            var droneTelemetry = new DroneTelemetryDTO
            {
                Gateway = gateway,
                Topic = topicSN,
                Data = data
            };
            if (droneTelemetry.Gateway == droneTelemetry.Topic)
            {
                _cache.Set(droneTelemetry.Topic, droneTelemetry, TimeSpan.FromMinutes(60));
            }
            _logger.LogInformation(JsonSerializer.Serialize(droneTelemetry, new JsonSerializerOptions
            {
                WriteIndented = true
            }));

            await _hubContext.Clients.Group(topicSN).SendAsync("ReceiveTelemetry", droneTelemetry);

        }
    }
}
