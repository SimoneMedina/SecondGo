using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Restaurante_GR07.Models
{
    public class Tienda
    {
        [Key]
        [StringLength(50)]
        public string usuario_tienda { get; set; }

        [Required]
        [StringLength(50)]
        public string nombre_local { get; set; }

        [Required]
        [StringLength(250)]
        public string descripcion_tienda { get; set; }

        [Required]
        public DateTime fecha_creacion_tienda { get; set; }

        [Required]
        public float ubicacion_tienda { get; set; }

        public byte[]? logo_local { get; set; }

        [StringLength(13)]
        public string? ruc_local { get; set; }

        [Required]
        [StringLength(25)]
        public string id_vendedor { get; set; }

        [ForeignKey("id_vendedor")]
        public virtual Vendedor? Vendedor { get; set; }

        public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }
}