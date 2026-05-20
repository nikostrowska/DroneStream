using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;

        public UserService(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<User> Register(UserIn userIn)
        {
            var existing = await _userRepository.GetByEmail(userIn.email);
            if (existing is not null)
            {
                throw new InvalidOperationException("Email already in use");
            }
            var user = new User
            {
                email = userIn.email,
                hashedPassword = BCrypt.Net.BCrypt.HashPassword(userIn.password)
            };

            return await _userRepository.Create(user);
        }

        public async Task<string> Login(UserIn userIn)
        {
            var user = await _userRepository.GetByEmail(userIn.email);
            if (user is null || !BCrypt.Net.BCrypt.Verify(userIn.password, user.hashedPassword))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }
            return _jwtService.GenereteToken(user);
        }
    }
}