using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class DroneService : IDroneService
{
    private readonly IDroneRepository _repo;

    public DroneService(IDroneRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<DroneDTO>> GetAllAsync()
    {
        var drones = await _repo.GetAllAsync();

        return drones.Select(ToDto);
    }

    public async Task<DroneDTO?> GetByIdAsync(Guid id)
    {
        var drone = await _repo.GetByIdAsync(id);
        return drone == null ? null : ToDto(drone);
    }

    public async Task<DroneDTO> AddDroneAsync(AddDroneDTO request)
    {
        var drone = new Drone
        {
            Name = request.Name,
            Model = request.Model,
            SerialNumber = request.SerialNumber.Trim(),
            IsOnline = false,
            LastActivity = null
        };
        var newDrone = await _repo.AddDroneAsync(drone);
        return ToDto(newDrone);
    }

    public async Task<DroneDTO?> UpdateDroneAsync(Guid id, UpdateDroneDTO request)
    {
        var drone = await _repo.GetByIdAsync(id);
        if (drone == null) return null;

        if (request.Name != null) drone.Name = request.Name;
        if (request.Model != null) drone.Model = request.Model;
        if (request.SerialNumber != null) drone.SerialNumber = request.SerialNumber.Trim();

        var updatedDrone = await _repo.UpdateDroneAsync(drone);
        return ToDto(updatedDrone);
    }

    public async Task<bool> UpdateDroneStatusAsync(string serialNumber, bool isOnline, DateTime? lastActivity)
    {
        return await _repo.UpdateStatusAsync(serialNumber, isOnline, lastActivity);
    }

    public async Task<bool> DeleteDroneAsync(Guid id)
    {
        return await _repo.DeleteDroneAsync(id);
    }

    private DroneDTO ToDto(Drone drone)
    {
        return new DroneDTO(
            drone.Id,
            drone.Name,
            drone.Model,
            drone.SerialNumber,
            drone.IsOnline,
            drone.LastActivity
        );
    }

}