
import { Challenge, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Explorador Sandia',
  username: '@nuevo_explorador',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuestNet',
  level: 1,
  exp: 0,
  points: 0,
  walletBalance: 0.00,
  streak: 0,
  isAdmin: false
};

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Catarata Wayra Phawchinta',
    description: 'Captura la majestuosidad de la caída de agua en Wayra Phawchinta. Sube una foto en la base de la catarata para validar tu visita.',
    category: 'Physical',
    points_reward: 20,
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
    requires_gps: true,
    is_active: true
  },
  {
    id: 'c2',
    title: 'Centro Arqueológico CH\'UNCHU LAQAYA',
    description: 'Explora las ruinas ancestrales de Ch\'unchu Laqaya. Tómate una foto junto a las estructuras principales de piedra.',
    category: 'Physical',
    points_reward: 20,
    image_url: 'https://images.unsplash.com/photo-1581010866019-907fd9f0c7ee?q=80&w=800&auto=format&fit=crop',
    requires_gps: true,
    is_active: true
  },
  {
    id: 'c3',
    title: 'Sitio Arqueológico de Maukallacta',
    description: 'Visita el sitio arqueológico de Maukallacta y documenta la historia milenaria de nuestra región con una fotografía panorámica.',
    category: 'Physical',
    points_reward: 20,
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    requires_gps: true,
    is_active: true
  },
  {
    id: 'c4',
    title: 'Aguas Termales de Cuyocuyo',
    description: 'Relájate en las famosas aguas termales de Cuyocuyo. Comparte una foto de los pozos naturales para completar este reto.',
    category: 'Physical',
    points_reward: 20,
    image_url: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=800&auto=format&fit=crop',
    requires_gps: true,
    is_active: true
  }
];

export const MOCK_FEED = [
  {
    id: 'p1',
    username: '@arivera_sandia',
    userAvatar: 'https://picsum.photos/seed/alex/200',
    challengeTitle: 'Catarata Wayra Phawchinta',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
    likes: 35,
    comments: 8,
    caption: '¡Impresionante la fuerza del agua en Wayra Phawchinta! Sandia nunca deja de sorprenderme.',
    timestamp: 'HACE 1 HORA'
  }
];

export const CONVERSION_RATE = 1000; // 1000 puntos = S/ 1.00
export const MIN_WITHDRAWAL_LEVEL = 10;

// CONFIGURACIÓN DE PUBLICIDAD
export const ENABLE_ADS = true; // Cambiar a false para desactivar toda la publicidad
