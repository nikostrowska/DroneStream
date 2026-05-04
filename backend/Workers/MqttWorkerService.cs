using MQTTnet;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using backend.Services;


namespace backend.Workers
{
    public class MqttWorkerService : BackgroundService
    {
        private readonly ILogger<MqttWorkerService> _logger;
        private IMqttClient? _mqttClient;
        private readonly IDroneTelemetry _telemetryService;

        public MqttWorkerService(ILogger<MqttWorkerService> logger, IHubContext<DroneTelemetryHub> hubContext, IDroneTelemetry telemetryService)
        {
            _logger = logger;
            _telemetryService = telemetryService;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogWarning("background task start");
            var mqttFactory = new MqttClientFactory();
            _mqttClient = mqttFactory.CreateMqttClient();
            var id = Guid.NewGuid().ToString();

            _mqttClient.ApplicationMessageReceivedAsync += OnMessage;

            var mqttClientOptions = new MqttClientOptionsBuilder()
            .WithTcpServer("emqx", 1883)
            .Build();
            // do łączenia sie z publicznym emqx
            // var mqttClientOptions = new MqttClientOptionsBuilder().WithWebSocketServer(o =>o.WithUri("wss://broker.emqx.io:8084/mqtt"))
            // .WithCleanSession()
            // .WithClientId(id)
            // .WithTlsOptions(o => o.UseTls())
            // .Build();
            _ = Task.Run(
            async () =>
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        if (!await _mqttClient.TryPingAsync())
                        {
                            await _mqttClient.ConnectAsync(mqttClientOptions, stoppingToken);

                            _logger.LogInformation("Połączono z brokerem");
                            await _mqttClient.SubscribeAsync("thing/product/+/osd");
                            _logger.LogInformation("Nasłuchiwanie");
                            
                        }
                    }
                    catch(Exception ex)
                    {
                        _logger.LogWarning("Rozłączono z brokerem{Message}",ex.Message);
                    }
                    finally
                    {
                        await Task.Delay(TimeSpan.FromSeconds(5));
                    }
                }
            });

            await Task.Delay(Timeout.Infinite, stoppingToken);

        }

        private async Task OnMessage(MqttApplicationMessageReceivedEventArgs e)
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = e.ApplicationMessage.ConvertPayloadToString();


            _logger.LogInformation("odebrano [{topic}: {payload}]", topic, payload);
            await _telemetryService.HandleMessage(topic, payload);
        }
    }
}