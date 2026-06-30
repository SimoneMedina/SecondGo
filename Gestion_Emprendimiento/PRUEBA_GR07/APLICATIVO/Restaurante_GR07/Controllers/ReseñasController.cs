using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurante_GR07.Models;
using System.Threading.Tasks;

namespace Restaurante_GR07.Controllers
{
    public class ReseñasController : Controller
    {
        private readonly RestauranteContext _context;

        public ReseñasController(RestauranteContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var historialResenas = await _context.Reseñas
                .Include(r => r.Comprador)
                .Include(r => r.Empresa)
                .ToListAsync();

            return View(historialResenas);
        }

        public async Task<IActionResult> Ver(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var reseñasTienda = await _context.Reseñas
                .Where(r => r.usuario_tienda == id)
                .Include(r => r.Comprador)
                .ToListAsync();

            return View(reseñasTienda);
        }

        public IActionResult Crear()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Crear(Reseña reseña)
        {
            if (ModelState.IsValid)
            {
                _context.Add(reseña);
                await _context.SaveChangesAsync();
                TempData["Exito"] = "Tu opinión ha sido publicada.";
                return RedirectToAction(nameof(Index));
            }
            return View(reseña);
        }

        public async Task<IActionResult> Eliminar(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var reseña = await _context.Reseñas
                .FirstOrDefaultAsync(m => m.id_reseña == id);

            if (reseña == null)
            {
                return NotFound();
            }

            return View(reseña);
        }

        [HttpPost, ActionName("Eliminar")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EliminarConfirmado(string id)
        {
            var reseña = await _context.Reseñas.FindAsync(id);
            if (reseña != null)
            {
                _context.Reseñas.Remove(reseña);
                await _context.SaveChangesAsync();
                TempData["Exito"] = "La reseña fue retirada.";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}