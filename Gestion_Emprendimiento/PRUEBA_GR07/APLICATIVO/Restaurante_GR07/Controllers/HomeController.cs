using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Restaurante_GR07.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.NombreEmpleado = User.Identity.Name;
            ViewBag.Cargo = User.FindFirst(ClaimTypes.Role)?.Value;
            ViewBag.IdUsuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return View();
        }
    }
}