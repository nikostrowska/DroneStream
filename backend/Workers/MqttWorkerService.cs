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

            _mqttClient.ApplicationMessageReceivedAsync += OnMessage;
            _mqttClient.DisconnectedAsync += OnDisconnected;
            var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("emqx", 1883).Build();
            while(!_mqttClient.IsConnected){                
                try
                {
                    await _mqttClient.ConnectAsync(mqttClientOptions, stoppingToken);   
                }
                catch
                {
                    await Task.Delay(5000, stoppingToken);
                }
            }
            _logger.LogInformation("Połączono z brokerem");
            await _mqttClient.SubscribeAsync("thing/product/+/osd");
            _logger.LogInformation("Nasłuchiwanie");

            await Task.Delay(Timeout.Infinite, stoppingToken);

        }

        private async Task OnDisconnected(MqttClientDisconnectedEventArgs e)
        {
            _logger.LogWarning("Rozlaczono z brokerem!");

            await Task.Delay(5000);

            try
            {
                await _mqttClient!.ReconnectAsync();
                _logger.LogInformation("Polaczono ponownie");
                await _mqttClient.SubscribeAsync("thing/product/+/osd");
                
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Nie udało się połączyć ponownie");
            }
        }

        private async Task OnMessage(MqttApplicationMessageReceivedEventArgs e)
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = e.ApplicationMessage.ConvertPayloadToString();

            await _telemetryService.HandleMessage(topic, payload);

            _logger.LogInformation("odebrano [{topic}: {payload}]", topic, payload);
        }
    }
}