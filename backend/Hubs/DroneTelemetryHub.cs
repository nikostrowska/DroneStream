
using Microsoft.AspNetCore.SignalR;
using backend.Models;
using backend.Services;

namespace backend.Hubs
{
    public class DroneTelemetryHub : Hub
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
