using System.ComponentModel.DataAnnotations;

namespace Restaurante_GR07.Models
{
    public class Usuario
    {
        [Key]
        [StringLength(25)]
        public string id_usuario { get; set; }

        [Required]
        [StringLength(50)]
        public string nombres_usuario { get; set; }

        [Required]
        [StringLength(51)]
        public string apellidos_usuario { get; set; }

        [Required]
        [StringLength(50)]
        [EmailAddress]
        public string correo_usuario { get; set; }

        [Required]
        [StringLength(100)]
        public string contrasena_usuario { get; set; }

        [Required]
        public float ubicacion_usuario { get; set; }
    }
}