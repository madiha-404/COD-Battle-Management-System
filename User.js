import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  selectedCharacter: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', default: null },
  loadout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Weapon' }],
  loadouts: { type: Array, default: [] },
  stats: {
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    rank: { type: String, default: 'Rookie' },
  },
  avatar: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);