using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurante_GR07.Models
{
    public class Producto
    {
        [Key]
        [StringLength(25)]
        public string id_producto { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string nombre_producto { get; set; } = string.Empty;

        [Required]
        [StringLength(250)]
        public string descripcion_producto { get; set; } = string.Empty;

        [Required]
        public DateTime fecha_publicacion_producto { get; set; }

        [Required]
        [StringLength(15)]
        public string color_producto { get; set; } = string.Empty;

        [StringLength(25)]
        public string? talla_producto { get; set; }

        [Required]
        [StringLength(25)]
        public string dimensiones_producto { get; set; } = string.Empty;

        public byte[]? foto_producto { get; set; }

        [Required]
        [StringLength(15)]
        public string estado_producto { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string usuario_tienda { get; set; } = string.Empty;

        [ForeignKey(nameof(usuario_tienda))]
        public virtual Tienda? Tienda { get; set; }
    }
}