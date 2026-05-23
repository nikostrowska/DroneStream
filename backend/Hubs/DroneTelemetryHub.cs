using Microsoft.AspNetCore.SignalR;
using backend.Models;
using backend.Services;
using Microsoft.Extensions.Caching.Memory;
using backend.DTOs;

namespace backend.Hubs
{
    public class DroneTelemetryHub(DroneStatusService statusService, IMemoryCache cache) : Hub
    {
        private readonly DroneStatusService _statusService = statusService;

        public async Task SubscribeTopic(string SerialNumber)
        {
            var normalized = SerialNumber?.Trim();
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return;
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, normalized);

            if (cache.TryGetValue(normalized, out DroneTelemetryDTO? cachedData))
            {
                await Clients.All.SendAsync("PilotTelemetry", cachedData);
            }

        }

        public async Task UnsubscribeTopic(string SerialNumber)
        {
            var normalized = SerialNumber?.Trim();
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return;
            }

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, normalized);
        }

        public async Task SendTelemetry(Models.DroneTelemetry data)
        {
            _statusService.UpdateActivity(data.SerialNumber);
            await Clients.All.SendAsync("ReceiveTelemetry", data);
            if (cache.TryGetValue(data.SerialNumber, out DroneTelemetryDTO? cachedData))
            {
                await Clients.All.SendAsync("PilotTelemetry", cachedData);
            }
        }
    }
}
