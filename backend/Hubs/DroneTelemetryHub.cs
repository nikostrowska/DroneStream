
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class DroneTelemetryHub : Hub
    {
        public async Task SubscribeTopic(string droneSn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, droneSn);
        }
        public async Task UnsubscribeTopic(string droneSn)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, droneSn);
        }
    }
}
