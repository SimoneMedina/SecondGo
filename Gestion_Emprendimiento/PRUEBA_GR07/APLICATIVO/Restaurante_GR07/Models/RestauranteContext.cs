using Microsoft.EntityFrameworkCore;

namespace Restaurante_GR07.Models
{
    public class RestauranteContext : DbContext
    {
        public RestauranteContext(DbContextOptions<RestauranteContext> options) : base(options) { }

       public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Vendedor> Vendedores { get; set; }
        public DbSet<Comprador> Compradores { get; set; }
        public DbSet<Tienda> Tiendas { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Reseña> Reseñas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>()
                .HasKey(u => u.id_usuario);

            modelBuilder.Entity<Usuario>()
                .Property(u => u.id_usuario)
                .HasMaxLength(25)
                .ValueGeneratedNever();

            modelBuilder.Entity<Vendedor>()
                .HasKey(v => v.id_vendedor);

            modelBuilder.Entity<Vendedor>()
                .HasOne(v => v.Usuario)
                .WithOne()
                .HasForeignKey<Vendedor>(v => v.id_vendedor)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comprador>()
                .HasKey(c => c.id_comprador);

            modelBuilder.Entity<Comprador>()
                .HasOne(c => c.Usuario)
                .WithOne()
                .HasForeignKey<Comprador>(c => c.id_comprador)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Tienda>()
                .ToTable("Empresas");

            modelBuilder.Entity<Tienda>()
                .HasKey(e => e.usuario_tienda);

            modelBuilder.Entity<Tienda>()
                .Property(e => e.usuario_tienda)
                .HasMaxLength(50);

            modelBuilder.Entity<Tienda>()
                .HasOne(e => e.Vendedor)
                .WithOne(v => v.Tienda)
                .HasForeignKey<Tienda>(e => e.id_vendedor)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Producto>()
                .HasKey(p => p.id_producto);

            modelBuilder.Entity<Producto>()
                .Property(p => p.id_producto)
                .HasMaxLength(25)
                .ValueGeneratedNever();

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Tienda)
                .WithMany(e => e.Productos)
                .HasForeignKey(p => p.usuario_tienda)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Reseña>()
                .HasKey(r => r.id_reseña);
            modelBuilder.Entity<Vendedor>().HasData(
                new Vendedor { id_vendedor = "david_p" },
                new Vendedor { id_vendedor = "simo" }
);

            modelBuilder.Entity<Usuario>().HasData(
                new Usuario
                {
                    id_usuario = "david_p",
                    nombres_usuario = "David",
                    apellidos_usuario = "Pilatasig",
                    correo_usuario = "david.pilatasig@restaurante.com",
                    contrasena_usuario = BCrypt.Net.BCrypt.HashPassword("Empleado2026"),
                    ubicacion_usuario = 0.0f
                },
                new Usuario
                {
                    id_usuario = "simo",
                    nombres_usuario = "Simoné",
                    apellidos_usuario = "Medina",
                    correo_usuario = "administrador@restaurante.com",
                    contrasena_usuario = BCrypt.Net.BCrypt.HashPassword("administrador123"),
                    ubicacion_usuario = 0.0f
                }
            );
        }
    }
}