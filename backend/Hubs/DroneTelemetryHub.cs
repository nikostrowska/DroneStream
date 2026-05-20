using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

using backend.DTOs;
namespace backend.Hubs
{
    public class DroneTelemetryHub(IMemoryCache cache) : Hub
    {


        public async Task SubscribeTopic(string SerialNumber)
        {
            var normalized = SerialNumber?.Trim();
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, normalized);
        }

        public async Task UnsubscribeTopic(string SerialNumber)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, droneSn);
            if (cache.TryGetValue(droneSn, out DroneTelemetryDTO? cachedData))
            {
                await Clients.Group(droneSn).SendAsync("ReceiveTelemetry", cachedData);

            }
            var normalized = SerialNumber?.Trim();
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return;
            }

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, normalized);
        }

        public async Task SendTelemetry(backend.Models.DroneTelemetry data)
        {
            await Clients.All.SendAsync("ReceiveTelemetry", data);
        }
    }
}
