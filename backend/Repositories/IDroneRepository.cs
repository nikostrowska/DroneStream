using backend.Models;

namespace backend.Repositories;

public interface IDroneRepository
{
    Task<IEnumerable<Drone>> GetAllAsync();
    Task<Drone?> GetByIdAsync(Guid id);
    Task<Drone?> GetBySerialNumberAsync(string serialNumber);
    Task<Drone> AddDroneAsync(Drone drone);
    Task<Drone> UpdateDroneAsync(Drone drone);
    Task<bool> DeleteDroneAsync(Guid id);
}