using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class UserIn
    {
        [Required] public string email = string.Empty;
        [Required] public string password = string.Empty;
    }
}