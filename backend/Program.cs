using backend.Hubs;
using backend.Services;
using backend.Workers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddHostedService<MqttWorkerService>();
builder.Services.AddSingleton<IDroneTelemetry, DroneTelemetry>();
builder.Services.AddSignalR();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.WithOrigins("http://127.0.0.1:4000", "http://localhost:4000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors();
app.MapHub<DroneTelemetryHub>("droneTelemetryHub");
app.MapControllers();
app.Run();

