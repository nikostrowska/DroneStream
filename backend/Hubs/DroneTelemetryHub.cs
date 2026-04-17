using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class DroneTelemetryHub : Hub
    {
        
        public async Task JoinTopic(string droneSn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, droneSn);
        }
    }
}