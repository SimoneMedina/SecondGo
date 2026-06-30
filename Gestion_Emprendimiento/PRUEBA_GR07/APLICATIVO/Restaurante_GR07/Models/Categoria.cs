using System.ComponentModel.DataAnnotations;

namespace Restaurante_GR07.Models
{
    public class Categoria
    {
        [Key]
        [StringLength(6)]
        public string id_categoria { get; set; }

        [Required]
        [StringLength(15)]
        public string nombre_categoria { get; set; }

        public virtual ICollection<Producto> Platos { get; set; } = new List<Producto>();
    }
}
