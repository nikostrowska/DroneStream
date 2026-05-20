using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.DTOs;

namespace backend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetById(Guid id);
        Task<User?> GetByEmail(string email);
        Task<User> Create(User user);
        Task<bool> Delete(Guid id);
    }
}