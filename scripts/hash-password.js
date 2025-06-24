// scripts/hash-password.js
import bcrypt from 'bcryptjs';
const password = 'password123'; // Le mot de passe en clair
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hash);
  // Copiez ce hash et mettez à jour la base de données manuellement
});