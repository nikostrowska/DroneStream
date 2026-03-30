namespace DroneStream.Models;

// This model represents only rarely changing information about the drone.
public class Drone
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public bool IsOnline { get; set; } = false;
    public DateTime? LastActivity { get; set; }
}