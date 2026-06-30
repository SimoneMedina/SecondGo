using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurante_GR07.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "id_usuario",
                keyValue: "david_p",
                column: "contrasena_usuario",
                value: "$2a$11$uN21HEICqIMZK8ytNzLfd.YVgBKfEI5w2cf8h.8cM49eP7LzObL/2");

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "id_usuario",
                keyValue: "simo",
                column: "contrasena_usuario",
                value: "$2a$11$kxZDb0HapyuOWH3VrbVCge3ZIXH40O3J2PF1/SC737bm5kHOUcMei");

            migrationBuilder.InsertData(
                table: "Vendedores",
                column: "id_vendedor",
                values: new object[]
                {
                    "david_p",
                    "simo"
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Vendedores",
                keyColumn: "id_vendedor",
                keyValue: "david_p");

            migrationBuilder.DeleteData(
                table: "Vendedores",
                keyColumn: "id_vendedor",
                keyValue: "simo");

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "id_usuario",
                keyValue: "david_p",
                column: "contrasena_usuario",
                value: "$2a$11$fcd6W4lBL10IgehkzNmivebuENPGs0KgpFqu84OmxqjkUG4rFwVO.");

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "id_usuario",
                keyValue: "simo",
                column: "contrasena_usuario",
                value: "$2a$11$oxwk0QJ.kzCEVC0riW23zehnrfb9wp/4fJGAfyV8Z8mIOXz5RiHhS");
        }
    }
}
