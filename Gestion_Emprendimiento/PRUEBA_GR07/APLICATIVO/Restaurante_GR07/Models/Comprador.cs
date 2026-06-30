using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Restaurante_GR07.Models
{
    public class Comprador
    {
        [Key]
        [StringLength(25)]
        public string id_comprador { get; set; }

        [ForeignKey("id_comprador")]
        public virtual Usuario? Usuario { get; set; }

        public virtual ICollection<Producto> ProductosSolicitados { get; set; } = new List<Producto>();
    }
}