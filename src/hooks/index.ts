import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Weapon, Character } from '@/types';

// ── Weapons ──────────────────────────────────────────────
export function useWeapons(tier?: string, category?: string) {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeapons = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (tier && tier !== 'all') params.tier = tier;
      if (category && category !== 'all') params.category = category;

      const { data } = await axios.get('/api/weapons', { params });
      setWeapons(data.data.weapons);
    } catch {
      setError('Failed to load weapons');
    } finally {
      setLoading(false);
    }
  }, [tier, category]);

  useEffect(() => { fetchWeapons(); }, [fetchWeapons]);

  return { weapons, loading, error, refetch: fetchWeapons };
}

export function useWeapon(id: string) {
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        const { data } = await axios.get(`/api/weapons/${id}`);
        setWeapon(data.data.weapon);
      } catch {
        setError('Weapon not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchWeapon();
  }, [id]);

  return { weapon, loading, error };
}

// ── Characters ────────────────────────────────────────────
export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/characters');
      setCharacters(data.data.characters);
    } catch {
      setError('Failed to load characters');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCharacters(); }, [fetchCharacters]);

  return { characters, loading, error, refetch: fetchCharacters };
}

// ── Loadout ──────────────────────────────────────────────
export function useLoadout() {
  const [loadout, setLoadout] = useState<Weapon[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLoadout = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/loadout');
      setLoadout(data.data.loadout);
      setSelectedCharacter(data.data.selectedCharacter);
    } catch {
      // not logged in
    } finally {
      setLoading(false);
    }
  }, []);

  const addWeapon = async (weaponId: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('/api/loadout', {
        action: 'add-weapon',
        weaponId,
      });
      if (data.success) {
        toast.success('Added to loadout!');
        await fetchLoadout();
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Failed to add weapon');
      }
      return false;
    }
  };

  const removeWeapon = async (weaponId: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('/api/loadout', {
        action: 'remove-weapon',
        weaponId,
      });
      if (data.success) {
        toast.success('Removed from loadout');
        await fetchLoadout();
        return true;
      }
      return false;
    } catch {
      toast.error('Failed to remove weapon');
      return false;
    }
  };

  const selectCharacter = async (characterId: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('/api/loadout', {
        action: 'set-character',
        characterId,
      });
      if (data.success) {
        setSelectedCharacter(data.data.selectedCharacter);
        toast.success('Character selected!');
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Failed to select character');
      }
      return false;
    }
  };

  useEffect(() => { fetchLoadout(); }, [fetchLoadout]);

  return { loadout, selectedCharacter, loading, addWeapon, removeWeapon, selectCharacter, refetch: fetchLoadout };
}

// ── Admin ───────────────────────────────────────────────
export function useAdminStats() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/admin');
        setStats(data.data.stats);
        setRecentUsers(data.data.recentUsers);
      } catch {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { stats, recentUsers, loading };
}
