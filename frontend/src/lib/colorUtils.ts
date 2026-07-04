export function detectarGrupoColor(hex: string): string {
  const limpio = hex.replace('#', '');

  const r = parseInt(limpio.substring(0, 2), 16);
  const g = parseInt(limpio.substring(2, 4), 16);
  const b = parseInt(limpio.substring(4, 6), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta < 25 && max > 210) return 'claros';
  if (delta < 25 && max < 70) return 'oscuros';
  if (delta < 25) return 'neutros';

  if (r > 150 && g < 120 && b < 120) return 'calidos';
  if (r > 180 && g > 120 && b < 90) return 'calidos';
  if (b > 140 && r < 150) return 'frios';
  if (g > 120 && r < 170) return 'naturales';
  if (r > 120 && b > 120 && g < 130) return 'intensos';
  if (r > 90 && g > 50 && b < 90) return 'tierra';

  return 'neutros';
}

export function nombreColorBasico(hex: string): string {
  const limpio = hex.replace('#', '');

  const r = parseInt(limpio.substring(0, 2), 16);
  const g = parseInt(limpio.substring(2, 4), 16);
  const b = parseInt(limpio.substring(4, 6), 16);

  if (r > 225 && g > 225 && b > 225) return 'Blanco';
  if (r < 45 && g < 45 && b < 45) return 'Negro';
  if (Math.abs(r - g) < 25 && Math.abs(g - b) < 25) return 'Gris';
  if (r > 180 && g > 150 && b < 130) return 'Beige';
  if (r > 160 && g < 100 && b < 100) return 'Rojo';
  if (r > 200 && g > 100 && b > 130) return 'Rosado';
  if (r > 200 && g > 100 && b < 90) return 'Naranja';
  if (r > 200 && g > 180 && b < 100) return 'Amarillo';
  if (g > 120 && r < 160 && b < 160) return 'Verde';
  if (b > 140 && r < 160) return 'Azul';
  if (r > 120 && b > 120 && g < 140) return 'Morado';
  if (r > 90 && g > 50 && b < 90) return 'Marrón';

  return 'Mixto';
}