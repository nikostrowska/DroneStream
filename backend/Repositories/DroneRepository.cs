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
        => await _db.DroneTable.FirstOrDefaultAsync(d => d.SerialNumber == serialNumber);

    public async Task<Drone> AddDroneAsync(Drone drone)
    {
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