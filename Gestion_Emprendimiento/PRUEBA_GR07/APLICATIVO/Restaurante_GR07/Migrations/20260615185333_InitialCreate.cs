using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Restaurante_GR07.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    id_usuario = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    nombres_usuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    apellidos_usuario = table.Column<string>(type: "nvarchar(51)", maxLength: 51, nullable: false),
                    correo_usuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    contrasena_usuario = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ubicacion_usuario = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.id_usuario);
                });

            migrationBuilder.CreateTable(
                name: "Compradores",
                columns: table => new
                {
                    id_comprador = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Compradores", x => x.id_comprador);
                    table.ForeignKey(
                        name: "FK_Compradores_Usuarios_id_comprador",
                        column: x => x.id_comprador,
                        principalTable: "Usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vendedores",
                columns: table => new
                {
                    id_vendedor = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendedores", x => x.id_vendedor);
                    table.ForeignKey(
                        name: "FK_Vendedores_Usuarios_id_vendedor",
                        column: x => x.id_vendedor,
                        principalTable: "Usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Empresas",
                columns: table => new
                {
                    usuario_tienda = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    nombre_local = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    descripcion_tienda = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    fecha_creacion_tienda = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ubicacion_tienda = table.Column<float>(type: "real", nullable: false),
                    logo_local = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ruc_local = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: true),
                    id_vendedor = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empresas", x => x.usuario_tienda);
                    table.ForeignKey(
                        name: "FK_Empresas_Vendedores_id_vendedor",
                        column: x => x.id_vendedor,
                        principalTable: "Vendedores",
                        principalColumn: "id_vendedor",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Productos",
                columns: table => new
                {
                    id_producto = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    nombre_producto = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    descripcion_producto = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    fecha_publicacion_producto = table.Column<DateTime>(type: "datetime2", nullable: false),
                    color_producto = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    talla_producto = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    dimensiones_producto = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    foto_producto = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    estado_producto = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    usuario_tienda = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Compradorid_comprador = table.Column<string>(type: "nvarchar(25)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Productos", x => x.id_producto);
                    table.ForeignKey(
                        name: "FK_Productos_Compradores_Compradorid_comprador",
                        column: x => x.Compradorid_comprador,
                        principalTable: "Compradores",
                        principalColumn: "id_comprador");
                    table.ForeignKey(
                        name: "FK_Productos_Empresas_usuario_tienda",
                        column: x => x.usuario_tienda,
                        principalTable: "Empresas",
                        principalColumn: "usuario_tienda",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reseñas",
                columns: table => new
                {
                    id_reseña = table.Column<string>(type: "nvarchar(18)", maxLength: 18, nullable: false),
                    calificacion_reseña = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    valor_reseña = table.Column<float>(type: "real", nullable: false),
                    descripcion_reseña = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    id_comprador = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    usuario_tienda = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reseñas", x => x.id_reseña);
                    table.ForeignKey(
                        name: "FK_Reseñas_Compradores_id_comprador",
                        column: x => x.id_comprador,
                        principalTable: "Compradores",
                        principalColumn: "id_comprador",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reseñas_Empresas_usuario_tienda",
                        column: x => x.usuario_tienda,
                        principalTable: "Empresas",
                        principalColumn: "usuario_tienda",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "id_usuario", "apellidos_usuario", "contrasena_usuario", "correo_usuario", "nombres_usuario", "ubicacion_usuario" },
                values: new object[,]
                {
                    { "david_p", "Pilatasig", "$2a$11$fcd6W4lBL10IgehkzNmivebuENPGs0KgpFqu84OmxqjkUG4rFwVO.", "david.pilatasig@restaurante.com", "David", 0f },
                    { "simo", "Medina", "$2a$11$oxwk0QJ.kzCEVC0riW23zehnrfb9wp/4fJGAfyV8Z8mIOXz5RiHhS", "administrador@restaurante.com", "Simoné", 0f }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Empresas_id_vendedor",
                table: "Empresas",
                column: "id_vendedor",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Productos_Compradorid_comprador",
                table: "Productos",
                column: "Compradorid_comprador");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_usuario_tienda",
                table: "Productos",
                column: "usuario_tienda");

            migrationBuilder.CreateIndex(
                name: "IX_Reseñas_id_comprador",
                table: "Reseñas",
                column: "id_comprador");

            migrationBuilder.CreateIndex(
                name: "IX_Reseñas_usuario_tienda",
                table: "Reseñas",
                column: "usuario_tienda");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Productos");

            migrationBuilder.DropTable(
                name: "Reseñas");

            migrationBuilder.DropTable(
                name: "Compradores");

            migrationBuilder.DropTable(
                name: "Empresas");

            migrationBuilder.DropTable(
                name: "Vendedores");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
