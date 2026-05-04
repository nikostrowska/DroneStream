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
    }
}