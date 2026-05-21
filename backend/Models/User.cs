using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string email { get; set; } = string.Empty;
    public string hashedPassword { get; set; } = string.Empty;
}