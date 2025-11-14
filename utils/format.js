// utils/format.js

/**
 * Convierte un número en formato legible con puntos de miles.
 * Ejemplo: 33407000 -> "33.407.000"
 * Si el valor no es numérico, devuelve "0"
 */
function formatCoins(amount) {
  if (isNaN(amount)) return '0';
  return amount.toLocaleString('es-ES');
}

module.exports = { formatCoins };
