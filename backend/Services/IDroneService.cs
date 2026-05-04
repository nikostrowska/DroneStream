using backend.DTOs;

namespace backend.Services;

public interface IDroneService
{
    Task<IEnumerable<DroneDTO>> GetAllAsync();
    Task<DroneDTO?> GetByIdAsync(Guid id);
    Task<DroneDTO> AddDroneAsync(AddDroneDTO request);
    Task<DroneDTO?> UpdateDroneAsync(Guid id, UpdateDroneDTO request);
    Task<bool> DeleteDroneAsync(Guid id);
}