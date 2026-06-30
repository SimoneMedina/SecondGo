using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurante_GR07.Models
{
    public class Vendedor
    {
        [Key]
        [StringLength(25)]
        public string id_vendedor { get; set; }

        [ForeignKey("id_vendedor")]
        public virtual Usuario? Usuario { get; set; }

        public virtual Tienda? Tienda { get; set; }
    }
}