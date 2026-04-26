using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using System.Text.Json;
using backend.DTOs;


namespace backend.Services
{
    public class DroneTelemetry : IDroneTelemetry
    {
        private IHubContext<DroneTelemetryHub> _hubContext;
        // private readonly ILogger<DroneTelemetry> _logger;

        public DroneTelemetry(IHubContext<DroneTelemetryHub> hubContext, ILogger<DroneTelemetry> logger)
        {
            _hubContext = hubContext;
            // _logger = logger;
        }
        public async Task HandleMessage(string topic, string payload)
        {
            using var jsonTelemetry = JsonDocument.Parse(payload);
            var gateway = jsonTelemetry.RootElement.GetProperty("gateway").GetString();
            var options = new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            };
            var data = jsonTelemetry.RootElement.GetProperty("data").Deserialize<DroneTelemetryDataDto>(options);

            var droneTelemetry = new DroneTelemetryDTO
            {
                Gateway = gateway,
                Data = data
            };
            // _logger.LogInformation(JsonSerializer.Serialize(droneTelemetry, new JsonSerializerOptions
            // {
            //     WriteIndented = true
            // }));
            //
            await _hubContext.Clients.Group(topic.Split('/')[2]).SendAsync("ReceiveTelemetry", droneTelemetry);

        }
    }
}
