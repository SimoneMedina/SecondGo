using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Restaurante_GR07.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Restaurante_GR07.Controllers
{
    public class AccountController : Controller
    {
        private readonly RestauranteContext _context;

        public AccountController(RestauranteContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string correo, string password)
        {
            if (string.IsNullOrEmpty(correo) || string.IsNullOrEmpty(password))
            {
                ViewBag.Error = "Por favor, llene todos los campos.";
                return View();
            }

            var usuarioDb = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.correo_usuario.ToLower() == correo.ToLower());

            if (usuarioDb == null || !BCrypt.Net.BCrypt.Verify(password, usuarioDb.contrasena_usuario))
            {
                ViewBag.Error = "Correo o contraseña incorrectos.";
                return View();
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuarioDb.id_usuario),
                new Claim(ClaimTypes.Name, $"{usuarioDb.nombres_usuario} {usuarioDb.apellidos_usuario}"),
                new Claim(ClaimTypes.Email, usuarioDb.correo_usuario)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }
    }
}