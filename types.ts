
export enum AppView {
  DASHBOARD = 'dashboard',
  CHALLENGES = 'challenges',
  EARN_SURVEYS = 'earn_surveys',
  UPLOAD = 'upload',
  PROFILE = 'profile',
  WALLET = 'wallet',
  ADMIN = 'admin',
  CHAT = 'chat'
}

export type ChallengeCategory = 'Physical' | 'Creative' | 'Virtual' | 'Daily' | 'Special';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  points_reward: number;
  image_url: string;
  requires_gps?: boolean;
  is_active: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  exp: number;
  points: number;
  walletBalance: number;
  streak: number;
  isAdmin: boolean;
  email?: string;
  phone?: string;
  yape_number?: string;
  plin_number?: string;
}

export interface RewardHistory {
  id: string;
  user_id: string;
  reward_amount: number;
  provider: string;
  status: 'completed' | 'pending';
  created_at: string;
  transaction_id?: string;
}

export interface Proof {
  id: string;
  user_id: string;
  challenge_id: string;
  photo_url: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  location?: { lat: number; lng: number };
}
