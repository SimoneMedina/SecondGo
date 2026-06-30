using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurante_GR07.Models;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Restaurante_GR07.Controllers
{
    [Authorize]
    public class TiendaController : Controller
    {
        private readonly RestauranteContext _context;

        public TiendaController(RestauranteContext context)
        {
            _context = context;
        }

        [HttpGet("Tienda")]
        [HttpGet("Tiendas")]
        [HttpGet("Tienda/Index")]
        [HttpGet("Tiendas/Index")]
        public async Task<IActionResult> Index()
        {
            var tiendas = await _context.Tiendas
                .OrderBy(t => t.nombre_local)
                .ToListAsync();

            return View(tiendas);
        }

        [HttpGet("Tienda/MiTienda")]
        public async Task<IActionResult> MiTienda()
        {
            var idUsuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(idUsuario))
            {
                return RedirectToAction("Login", "Account");
            }

            var tienda = await _context.Tiendas
                .Include(t => t.Productos)
                .FirstOrDefaultAsync(t => t.id_vendedor == idUsuario);

            if (tienda == null)
            {
                return RedirectToAction(nameof(Crear));
            }

            return RedirectToAction(nameof(Feed), new { id = tienda.usuario_tienda });
        }

        [HttpGet("Tienda/Feed/{id}")]
        [HttpGet("Tiendas/Feed/{id}")]
        public async Task<IActionResult> Feed(string id)
        {
            if (string.IsNullOrEmpty(id))
                return NotFound();

            var tienda = await _context.Tiendas
                .Include(t => t.Productos)
                .FirstOrDefaultAsync(t => t.usuario_tienda == id);

            if (tienda == null)
                return NotFound();

            return View(tienda);
        }

        [HttpGet("Tienda/Crear")]
        public IActionResult Crear()
        {
            var nuevaTienda = new Tienda();
            return View(nuevaTienda);
        }

        [HttpPost("Tienda/Crear")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Crear(Tienda tienda, IFormFile logoArchivo)
        {
            var idUsuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(idUsuario))
            {
                return RedirectToAction("Login", "Account");
            }

            var existeTienda = await _context.Tiendas.AnyAsync(t => t.id_vendedor == idUsuario);
            if (existeTienda)
            {
                TempData["Error"] = "Ya tienes una tienda registrada.";
                return RedirectToAction(nameof(MiTienda));
            }

            var existeVendedor = await _context.Vendedores.AnyAsync(v => v.id_vendedor == idUsuario);
            if (!existeVendedor)
            {
                var nuevoVendedor = new Vendedor
                {
                    id_vendedor = idUsuario
                };
                _context.Vendedores.Add(nuevoVendedor);
                await _context.SaveChangesAsync();
            }

            tienda.id_vendedor = idUsuario;
            tienda.usuario_tienda = idUsuario;
            tienda.fecha_creacion_tienda = DateTime.Now;

            ModelState.Remove(nameof(Tienda.logo_local));
            ModelState.Remove(nameof(Tienda.usuario_tienda));
            ModelState.Remove(nameof(Tienda.id_vendedor));
            ModelState.Remove(nameof(Tienda.Vendedor));
            ModelState.Remove(nameof(Tienda.Productos));

            if (logoArchivo != null && logoArchivo.Length > 0)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    await logoArchivo.CopyToAsync(ms);
                    tienda.logo_local = ms.ToArray();
                }
            }

            if (!ModelState.IsValid)
                return View(tienda);

            _context.Tiendas.Add(tienda);
            await _context.SaveChangesAsync();

            TempData["Exito"] = "La tienda fue registrada correctamente.";
            return RedirectToAction(nameof(Feed), new { id = tienda.usuario_tienda });
        }

        [HttpPost("Tienda/Editar/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Editar(string id, Tienda tienda, IFormFile logoArchivo)
        {
            if (id != tienda.usuario_tienda)
                return NotFound();

            var tiendaDB = await _context.Tiendas
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.usuario_tienda == id);

            if (tiendaDB == null)
                return NotFound();

            tienda.id_vendedor = tiendaDB.id_vendedor;
            tienda.fecha_creacion_tienda = tiendaDB.fecha_creacion_tienda;

            ModelState.Remove(nameof(Tienda.logo_local));
            ModelState.Remove(nameof(Tienda.usuario_tienda));
            ModelState.Remove(nameof(Tienda.id_vendedor));
            ModelState.Remove(nameof(Tienda.Vendedor));
            ModelState.Remove(nameof(Tienda.Productos));

            if (logoArchivo != null && logoArchivo.Length > 0)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    await logoArchivo.CopyToAsync(ms);
                    tienda.logo_local = ms.ToArray();
                }
            }
            else
            {
                tienda.logo_local = tiendaDB.logo_local;
            }

            if (!ModelState.IsValid)
                return View(tienda);

            _context.Update(tienda);
            await _context.SaveChangesAsync();

            TempData["Exito"] = "La tienda fue actualizada.";
            return RedirectToAction(nameof(Feed), new { id = tienda.usuario_tienda });
        }

        [HttpGet("Tienda/Eliminar/{id}")]
        public async Task<IActionResult> Eliminar(string id)
        {
            var tienda = await _context.Tiendas
                .FirstOrDefaultAsync(t => t.usuario_tienda == id);

            if (tienda == null)
                return NotFound();

            return View(tienda);
        }

        [HttpPost("Tienda/Eliminar/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EliminarConfirmado(string id)
        {
            var tienda = await _context.Tiendas
                .Include(t => t.Productos)
                .FirstOrDefaultAsync(t => t.usuario_tienda == id);

            if (tienda == null)
                return NotFound();

            if (tienda.Productos != null && tienda.Productos.Any())
            {
                _context.Productos.RemoveRange(tienda.Productos);
            }

            _context.Tiendas.Remove(tienda);
            await _context.SaveChangesAsync();

            TempData["Exito"] = "La tienda fue eliminada.";
            return RedirectToAction(nameof(Index));
        }
    }
}