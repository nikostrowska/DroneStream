using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;

        public AuthController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserIn userIn)
        {
            var user = await _userService.Register(userIn);
            return Ok(new UserOut(user.Id, user.email));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserIn userIn)
        {
            var token = await _userService.Login(userIn);
            return Ok(new TokenOut(token));
        }
    }
}