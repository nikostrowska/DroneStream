using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

using backend.DTOs;
namespace backend.Hubs
{
    public class DroneTelemetryHub(IMemoryCache cache) : Hub
    {
        public async Task SubscribeTopic(string droneSn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, droneSn);
            if (cache.TryGetValue(droneSn, out DroneTelemetryDTO? cachedData))
            {
                await Clients.Group(droneSn).SendAsync("ReceiveTelemetry", cachedData);

            }
        }
        public async Task UnsubscribeTopic(string droneSn)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, droneSn);
        }
    }
}
