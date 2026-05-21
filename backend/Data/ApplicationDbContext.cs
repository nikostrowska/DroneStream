using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Drone> DroneTable => Set<Drone>();
    public DbSet<User> UserTable => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Drone>(e =>
        {
            e.HasKey(d => d.Id);
            e.Property(d => d.Name).IsRequired().HasMaxLength(50);
            e.Property(d => d.Model).HasMaxLength(50);
            e.Property(d => d.SerialNumber).IsRequired().HasMaxLength(25);
            e.HasIndex(d => d.SerialNumber).IsUnique();
        });

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.Property(u => u.email).IsRequired();
            e.HasIndex(u => u.email).IsUnique();
            e.Property(u => u.hashedPassword).IsRequired();
        });
    }
}