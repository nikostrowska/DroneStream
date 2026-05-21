using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record UserIn(
    [Required] string email,
    [Required] string password
);
