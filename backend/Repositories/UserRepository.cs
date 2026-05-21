using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _db;
        public UserRepository(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task<User?> GetById(Guid id)
        {
            return await _db.UserTable.FindAsync(id);
        }
        public async Task<User?> GetByEmail(string email)
        {
            return await _db.UserTable.FirstOrDefaultAsync(u => u.email == email);
        }
        public async Task<User> Create(User user)
        {
            _db.UserTable.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }
        public async Task<bool> Delete(Guid id)
        {
            var user = await _db.UserTable.FindAsync(id);
            if (user is null) return false;
            _db.UserTable.Remove(user);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}