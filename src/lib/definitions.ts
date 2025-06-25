// src/lib/definitions.ts
export type User = {
  id: string; // UUID
  name: string;
  email: string;
  password: string; // Ce sera le hash
  // image_url?: string; // Si vous ajoutez des avatars utilisateurs
  // role?: 'admin' | 'user'; // Si vous avez des rôles
};