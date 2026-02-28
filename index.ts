export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  stats?: {
    kills: number;
    deaths: number;
    wins: number;
    matches: number;
    rank: string;
  };
}