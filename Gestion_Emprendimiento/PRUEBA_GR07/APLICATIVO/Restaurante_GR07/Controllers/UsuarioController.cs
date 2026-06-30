using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurante_GR07.Models;
using System.Threading.Tasks;

namespace Restaurante_GR07.Controllers
{
    [Authorize]
    public class UsuariosController : Controller
    {
        private readonly RestauranteContext _context;

        public UsuariosController(RestauranteContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var usuarios = await _context.Usuarios.ToListAsync();
            return View(usuarios);
        }
    }
}