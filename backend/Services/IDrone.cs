using backend.DTOs;

namespace backend.Services;

public interface IDrone
{
    Task<IEnumerable<DroneDTO>> GetAllAsync();
    Task<DroneDTO?> GetByIdAsync(Guid id);
    Task<DroneDTO> AddDroneAsync(AddDroneDTO add);
    Task<DroneDTO> UpdateDroneAsync(Guid id, UpdateDroneDTO update);
    Task<bool> DeleteDroneAsync(Guid id);
}