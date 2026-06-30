using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurante_GR07.Models
{
    public class Reseña
    {
        [Key]
        [StringLength(18)]
        public string id_reseña { get; set; }

        [Required]
        [StringLength(15)]
        public string calificacion_reseña { get; set; }

        [Required]
        public float valor_reseña { get; set; }

        [Required]
        [StringLength(250)]
        public string descripcion_reseña { get; set; }

        [Required]
        [StringLength(25)]
        public string id_comprador { get; set; }

        [ForeignKey("id_comprador")]
        public virtual Comprador? Comprador { get; set; }

        [Required]
        [StringLength(50)]
        public string usuario_tienda { get; set; }

        [ForeignKey("usuario_tienda")]
        public virtual Tienda? Empresa { get; set; }
    }
}