/**
 * Helper script to generate a bcrypt password hash for the admin account.
 *
 * Usage:
 *   node scripts/generate-password-hash.js "YourStrongPassword123"
 *
 * Copy the printed hash into your .env file as ADMIN_PASSWORD_HASH.
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('\nPlease provide a password to hash.');
  console.error('Usage: node scripts/generate-password-hash.js "YourStrongPassword123"\n');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('\nYour bcrypt password hash (copy this into ADMIN_PASSWORD_HASH in .env):\n');
console.log(hash);
console.log('');
