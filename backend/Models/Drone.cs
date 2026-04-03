namespace DroneStream.Models;

// This model represents only rarely changing information about the drone.
public class Drone
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public bool IsOnline { get; set; } = false;
    public DateTime? LastActivity { get; set; }

    // User input
    public string Name { get; set; } = string.Empty;
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
}