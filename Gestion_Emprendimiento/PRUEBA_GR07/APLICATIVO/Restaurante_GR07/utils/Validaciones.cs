namespace Restaurante_GR07.utils
{
    public static class Validaciones
    {
        public static bool ValidarRuc(string ruc)
        {
            if (string.IsNullOrWhiteSpace(ruc))
                return false;

            if (ruc.Length != 13 || !ruc.All(char.IsDigit))
                return false;

            int provincia = int.Parse(ruc.Substring(0, 2));

            if (provincia < 1 || provincia > 24)
                return false;

            string establecimiento = ruc.Substring(10, 3);

            if (establecimiento == "000")
                return false;

            int tercerDigito = int.Parse(ruc[2].ToString());

            // Persona natural
            if (tercerDigito >= 0 && tercerDigito <= 5)
            {
                return ValidarCedula(ruc.Substring(0, 10));
            }

            // Entidad pública
            if (tercerDigito == 6)
            {
                int[] coef = { 3, 2, 7, 6, 5, 4, 3, 2 };

                int suma = 0;

                for (int i = 0; i < 8; i++)
                {
                    suma += int.Parse(ruc[i].ToString()) * coef[i];
                }

                int verificador = 11 - (suma % 11);

                if (verificador == 11)
                    verificador = 0;

                if (verificador == 10)
                    return false;

                return verificador == int.Parse(ruc[8].ToString());
            }

            // Sociedad privada
            if (tercerDigito == 9)
            {
                int[] coef = { 4, 3, 2, 7, 6, 5, 4, 3, 2 };

                int suma = 0;

                for (int i = 0; i < 9; i++)
                {
                    suma += int.Parse(ruc[i].ToString()) * coef[i];
                }

                int verificador = 11 - (suma % 11);

                if (verificador == 11)
                    verificador = 0;

                if (verificador == 10)
                    return false;

                return verificador == int.Parse(ruc[9].ToString());
            }

            return false;
        }

        public static bool ValidarCedula(string cedula)
        {
            if (cedula.Length != 10 || !cedula.All(char.IsDigit))
                return false;

            int provincia = int.Parse(cedula.Substring(0, 2));

            if (provincia < 1 || provincia > 24)
                return false;

            int tercerDigito = int.Parse(cedula[2].ToString());

            if (tercerDigito > 5)
                return false;

            int suma = 0;

            for (int i = 0; i < 9; i++)
            {
                int numero = int.Parse(cedula[i].ToString());

                if (i % 2 == 0)
                {
                    numero *= 2;

                    if (numero > 9)
                        numero -= 9;
                }

                suma += numero;
            }

            int digitoCalculado =
                (10 - (suma % 10)) % 10;

            int digitoVerificador =
                int.Parse(cedula[9].ToString());

            return digitoCalculado == digitoVerificador;
        }

        public static bool validarNumeroPositivo(decimal numero)
        {
            return numero > 0;
        }

        public static bool validarNumeroPositivo(double numero)
        {
            return numero > 0;
        }
    }
}