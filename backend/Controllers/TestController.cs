using Microsoft.AspNetCore.Mvc;


namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult GetTest()
    {
        return Ok(new { message = "Wow! API działa" });
    }
}