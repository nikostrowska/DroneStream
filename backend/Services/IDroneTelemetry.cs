using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MQTTnet.Packets;

namespace backend.Services
{
    public interface IDroneTelemetry
    {
        Task HandleMessage(string topic, string payload);
    }
}