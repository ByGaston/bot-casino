// utils/permissions.js

// 🔒 Sistema de permisos basado en ROLE ID
// Usa el ID de rol que consideres "admin" en tu servidor.
// Ejemplo: process.env.ADMIN_ROLE_ID = '123456789012345678'

module.exports = {
  isAdminMessage(member) {
    if (!member) return false; // por si se ejecuta en DM

    // 1️⃣ Si el usuario tiene permiso ADMINISTRATOR global
    if (member.permissions && member.permissions.has('Administrator')) return true;

    // 2️⃣ Si el usuario tiene el rol con el ID definido en .env
    const adminRoleId = process.env.ADMIN_ROLE_ID;
    if (!adminRoleId) {
      console.warn('⚠️ Falta ADMIN_ROLE_ID en el archivo .env');
      return false;
    }

    return member.roles.cache.has(adminRoleId);
  }
};
