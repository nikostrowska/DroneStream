using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using backend.Hubs;
using backend.Repositories;
using backend.Services;

namespace backend.Workers
{
    public class DroneMonitorWorker : BackgroundService
    {
        private readonly DroneStatusService _statusService;
        private readonly IHubContext<DroneTelemetryHub> _hubContext;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DroneMonitorWorker> _logger;

        public DroneMonitorWorker(
            DroneStatusService statusService,
            IHubContext<DroneTelemetryHub> hubContext,
            IServiceProvider serviceProvider,
            ILogger<DroneMonitorWorker> logger)
        {
            _statusService = statusService;
            _hubContext = hubContext;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var changes = _statusService.GetStatusChanges(5);

                if (changes.Any())
                {
                    _logger.LogInformation("Detected {Count} status changes", changes.Count);
                }

                foreach (var (sn, isOnline, lastSeen) in changes)
                {
                    using var scope = _serviceProvider.CreateScope();
                    var repository = scope.ServiceProvider.GetRequiredService<IDroneRepository>();
                    var updated = await repository.UpdateStatusAsync(sn, isOnline, lastSeen);
                    _logger.LogInformation("Updated drone {SerialNumber} status to {IsOnline}, DB update: {Updated}", sn, isOnline, updated);

                    await _hubContext.Clients.All.SendAsync("DroneStatusUpdated", sn, isOnline);
                }

                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}