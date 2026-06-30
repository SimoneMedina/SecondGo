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
    public class ProductosController : Controller
    {
        private readonly RestauranteContext _context;

        public ProductosController(RestauranteContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var productos = await _context.Productos.Include(p => p.Tienda).ToListAsync();
            return View(productos);
        }

        [HttpGet("Productos/Previsualizar/{id}")]
        public async Task<IActionResult> Previsualizar(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            var producto = await _context.Productos
                .Include(p => p.Tienda)
                .FirstOrDefaultAsync(p => p.id_producto == id);

            if (producto == null) return NotFound();

            return View(producto);
        }

        [HttpGet("Productos/Crear")]
        public IActionResult Crear()
        {
            return View();
        }

        [HttpPost("Productos/Crear")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Crear(Producto producto, IFormFile fotoArchivo)
        {
            var ultimoProducto = await _context.Productos
                .OrderByDescending(p => p.id_producto)
                .FirstOrDefaultAsync();

            int siguienteNumero = 1;
            if (ultimoProducto != null && ultimoProducto.id_producto.StartsWith("PROD"))
            {
                if (int.TryParse(ultimoProducto.id_producto.Substring(4), out int ultimoNumero))
                {
                    siguienteNumero = ultimoNumero + 1;
                }
            }

            producto.id_producto = $"PROD{siguienteNumero:D3}";
            producto.usuario_tienda = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            ModelState.Remove("id_producto");
            ModelState.Remove("foto_producto");
            ModelState.Remove("usuario_tienda");
            ModelState.Remove("Tienda");

            if (fotoArchivo != null && fotoArchivo.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await fotoArchivo.CopyToAsync(memoryStream);
                    producto.foto_producto = memoryStream.ToArray();
                }
            }
            else
            {
                ModelState.AddModelError("foto_producto", "La foto es obligatoria.");
            }

            if (ModelState.IsValid)
            {
                producto.fecha_publicacion_producto = DateTime.Now;
                _context.Productos.Add(producto);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            return View(producto);
        }

        [HttpGet("Productos/Editar/{id}")]
        public async Task<IActionResult> Editar(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();
            return View(producto);
        }

        [HttpPost("Productos/Editar/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Editar(string id, Producto producto, IFormFile? fotoArchivo)
        {
            if (id != producto.id_producto) return NotFound();

            ModelState.Remove("foto_producto");
            ModelState.Remove("usuario_tienda");
            ModelState.Remove("Tienda");

            if (ModelState.IsValid)
            {
                try
                {
                    var productoExistente = await _context.Productos.AsNoTracking().FirstOrDefaultAsync(p => p.id_producto == id);
                    if (productoExistente == null) return NotFound();

                    producto.usuario_tienda = productoExistente.usuario_tienda;

                    if (fotoArchivo != null && fotoArchivo.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            await fotoArchivo.CopyToAsync(ms);
                            producto.foto_producto = ms.ToArray();
                        }
                    }
                    else
                    {
                        producto.foto_producto = productoExistente.foto_producto;
                    }

                    _context.Update(producto);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Productos.Any(p => p.id_producto == producto.id_producto)) return NotFound();
                    throw;
                }
            }
            return View(producto);
        }

        [HttpGet("Productos/Eliminar/{id}")]
        public async Task<IActionResult> Eliminar(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.id_producto == id);
            if (producto == null) return NotFound();
            return View(producto);
        }

        [HttpPost("Productos/Eliminar/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EliminarConfirmado(string id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();
            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}