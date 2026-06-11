using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class DroneRepository : IDroneRepository
{
    private readonly ApplicationDbContext _db;

    public DroneRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Drone>> GetAllAsync()
        => await _db.DroneTable.ToListAsync();

    public async Task<Drone?> GetByIdAsync(Guid id)
        => await _db.DroneTable.FindAsync(id);

    public async Task<Drone?> GetBySerialNumberAsync(string serialNumber)
    {
        if (string.IsNullOrWhiteSpace(serialNumber))
        {
            return null;
        }

        var normalized = serialNumber.Trim();
        return await _db.DroneTable.FirstOrDefaultAsync(d => d.SerialNumber == normalized);
    }

    public async Task<Drone> AddDroneAsync(Drone drone)
    {
        drone.SerialNumber = drone.SerialNumber.Trim();
        _db.DroneTable.Add(drone);
        await _db.SaveChangesAsync();
        return drone;
    }

    public async Task<Drone> UpdateDroneAsync(Drone drone)
    {
        _db.DroneTable.Update(drone);
        await _db.SaveChangesAsync();
        return drone;
    }

    public async Task<bool> UpdateStatusAsync(string serialNumber, bool isOnline, DateTime? lastActivity)
    {
        if (string.IsNullOrWhiteSpace(serialNumber))
        {
            return false;
        }

        var normalized = serialNumber.Trim();
        var drone = await GetBySerialNumberAsync(normalized);
        if (drone == null)
        {
            Console.WriteLine($"Drone with serial {normalized} not found in DB");
            return false;
        }

        drone.IsOnline = isOnline;
        if (lastActivity.HasValue && (!drone.LastActivity.HasValue || lastActivity.Value > drone.LastActivity.Value))
        {
            drone.LastActivity = lastActivity;
        }

        _db.DroneTable.Update(drone);
        await _db.SaveChangesAsync();
        Console.WriteLine($"Updated drone {normalized} to online={isOnline}, lastActivity={lastActivity}");
        return true;
    }

    public async Task<bool> DeleteDroneAsync(Guid id)
    {
        var drone = await _db.DroneTable.FindAsync(id);
        if (drone == null)
            return false;

        _db.DroneTable.Remove(drone);
        await _db.SaveChangesAsync();
        return true;
    }
}