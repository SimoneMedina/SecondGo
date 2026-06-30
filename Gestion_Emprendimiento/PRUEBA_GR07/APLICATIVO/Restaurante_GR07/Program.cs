using Restaurante_GR07.Models;
using Microsoft.EntityFrameworkCore;
// 1. AGREGA ESTE USING PARA LAS COOKIES
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<RestauranteContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("conexion")));

// 2. CONFIGURACIÓN DEL MANEJADOR DE AUTENTICACIÓN POR COOKIES
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Si alguien no logueado intenta entrar a otra página, lo bota aquí
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60); // Duración de la sesión activa
    });

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 3.Primero saber quién eres (Authentication) y luego qué puedes hacer (Authorization)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();