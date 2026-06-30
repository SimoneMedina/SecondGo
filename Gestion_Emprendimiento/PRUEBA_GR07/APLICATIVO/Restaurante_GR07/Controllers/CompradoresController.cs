using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurante_GR07.Models;
using System.Threading.Tasks;

namespace Restaurante_GR07.Controllers
{
    [Authorize]
    public class CompradoresController : Controller
    {
        private readonly RestauranteContext _context;

        public CompradoresController(RestauranteContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var compradores = await _context.Compradores
                .Include(c => c.Usuario)
                .ToListAsync();
            return View(compradores);
        }
    }
}