import { Avatar, Opponent } from "../context/GameContext";

export const MALE_AVATARS: Avatar[] = [
  { id: "m1", name: "Nebula",  icon: "Sparkles", gradient: "from-cyan-900 to-blue-950",    gender: "male" },
  { id: "m2", name: "Plasma",  icon: "Flame",     gradient: "from-red-900 to-orange-950",   gender: "male" },
  { id: "m3", name: "Terra",   icon: "Mountain",  gradient: "from-emerald-900 to-teal-950", gender: "male" },
  { id: "m4", name: "Aureus",  icon: "Crown",     gradient: "from-amber-800 to-yellow-950", gender: "male" },
  { id: "m5", name: "Void",    icon: "Eye",       gradient: "from-violet-900 to-purple-950",gender: "male" },
];

export const FEMALE_AVATARS: Avatar[] = [
  { id: "f1", name: "Stella",  icon: "Star",      gradient: "from-rose-900 to-pink-950",    gender: "female" },
  { id: "f2", name: "Nova",    icon: "Gem",       gradient: "from-blue-800 to-indigo-950",  gender: "female" },
  { id: "f3", name: "Glacia",  icon: "Snowflake", gradient: "from-sky-800 to-cyan-950",     gender: "female" },
  { id: "f4", name: "Luna",    icon: "Moon",      gradient: "from-slate-800 to-gray-950",   gender: "female" },
  { id: "f5", name: "Flora",   icon: "Leaf",      gradient: "from-fuchsia-900 to-purple-950",gender: "female" },
];

export const MOCK_LEADERBOARD: Opponent[] = [
  { name: "Jahazaib Ali",  region: "ASIA", avatar: MALE_AVATARS[0],   score: 9540 },
  { name: "Sanjay",        region: "ASIA", avatar: MALE_AVATARS[1],   score: 8230 },
  { name: "Umer Samoon",   region: "ASIA", avatar: MALE_AVATARS[2],   score: 7800 },
  { name: "Rohit Lal",     region: "ASIA", avatar: MALE_AVATARS[3],   score: 7200 },
  { name: "Jeelan Raza",   region: "ASIA", avatar: MALE_AVATARS[4],   score: 6500 },
  { name: "M. Hafi",       region: "ASIA", avatar: FEMALE_AVATARS[0], score: 6100 },
  { name: "Waqar A.P",     region: "ASIA", avatar: FEMALE_AVATARS[1], score: 5900 },
  { name: "Sooraj Kumar",  region: "ASIA", avatar: FEMALE_AVATARS[2], score: 5400 },
  { name: "Sikander Khan", region: "ASIA", avatar: FEMALE_AVATARS[3], score: 4800 },
  { name: "M. Muaaz",      region: "ASIA", avatar: FEMALE_AVATARS[4], score: 4200 },
];
