using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DroneController : ControllerBase
{
    private readonly IDroneService _service;

    public DroneController(IDroneService service)
    {
        _service = service;
    }

    // GET /api/drone
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var drones = await _service.GetAllAsync();
        return Ok(drones);
    }

    // GET /api/drone/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var drone = await _service.GetByIdAsync(id);
        return drone is null ? NotFound() : Ok(drone);
    }

    // POST /api/drone
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AddDroneDTO request)
    {
        var created = await _service.AddDroneAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/drone/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDroneDTO request)
    {
        var updated = await _service.UpdateDroneAsync(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE /api/drone/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteDroneAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}