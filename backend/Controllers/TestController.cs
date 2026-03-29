using Microsoft.AspNetCore.Mvc;


namespace DroneStream.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult GetTest()
    {
        return Ok(new { message = "Wow! API działa)" });
    }
}