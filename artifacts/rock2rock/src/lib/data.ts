import { Avatar, Opponent } from "../context/GameContext";

export const MALE_AVATARS: Avatar[] = [
  { id: "m1", name: "Nebula", emoji: "🌌", gradient: "from-cyan-900 to-blue-950", gender: "male" },
  { id: "m2", name: "Plasma", emoji: "🔥", gradient: "from-red-900 to-orange-950", gender: "male" },
  { id: "m3", name: "Terra", emoji: "🪨", gradient: "from-emerald-900 to-teal-950", gender: "male" },
  { id: "m4", name: "Aureus", emoji: "⚔️", gradient: "from-amber-800 to-yellow-950", gender: "male" },
  { id: "m5", name: "Void", emoji: "🌊", gradient: "from-violet-900 to-purple-950", gender: "male" },
];

export const FEMALE_AVATARS: Avatar[] = [
  { id: "f1", name: "Stella", emoji: "🌠", gradient: "from-rose-900 to-pink-950", gender: "female" },
  { id: "f2", name: "Nova", emoji: "💠", gradient: "from-blue-800 to-indigo-950", gender: "female" },
  { id: "f3", name: "Glacia", emoji: "❄️", gradient: "from-sky-800 to-cyan-950", gender: "female" },
  { id: "f4", name: "Luna", emoji: "🌙", gradient: "from-slate-800 to-gray-950", gender: "female" },
  { id: "f5", name: "Flora", emoji: "🌸", gradient: "from-fuchsia-900 to-purple-950", gender: "female" },
];

export const MOCK_LEADERBOARD: Opponent[] = [
  { name: "CosmicKing", region: "NA", avatar: MALE_AVATARS[0], score: 9540 },
  { name: "StarDust", region: "EU", avatar: FEMALE_AVATARS[1], score: 8230 },
  { name: "MeteorStrike", region: "ASIA", avatar: MALE_AVATARS[1], score: 7800 },
  { name: "LunarEclipse", region: "NA", avatar: FEMALE_AVATARS[3], score: 7200 },
  { name: "DarkMatter", region: "SA", avatar: MALE_AVATARS[4], score: 6500 },
  { name: "SuperNova", region: "OCE", avatar: FEMALE_AVATARS[0], score: 6100 },
  { name: "SolarFlare", region: "EU", avatar: MALE_AVATARS[2], score: 5900 },
  { name: "AstroBlade", region: "ASIA", avatar: MALE_AVATARS[3], score: 5400 },
  { name: "CometTail", region: "NA", avatar: FEMALE_AVATARS[2], score: 4800 },
  { name: "GalaxyQueen", region: "SA", avatar: FEMALE_AVATARS[4], score: 4200 },
];
