import {
  HiBadgeCheck,
  HiBeaker,
  HiBookOpen,
  HiChat,
  HiCheck,
  HiCheckCircle,
  HiClipboardList,
  HiDocumentText,
  HiEmojiHappy,
  HiFire,
  HiHeart,
  HiLightBulb,
  HiLightningBolt,
  HiLockClosed,
  HiMoon,
  HiOfficeBuilding,
  HiSparkles,
  HiStar,
  HiSun,
  HiTrendingUp,
  HiUser,
  HiUserGroup,
  HiViewBoards,
} from 'react-icons/hi';
import {
  HiOutlineFaceFrown,
  HiOutlineFaceSmile,
} from 'react-icons/hi2';

const ICONS = {
  home: HiViewBoards,
  mood: HiEmojiHappy,
  sleep: HiMoon,
  water: HiBeaker,
  exercise: HiTrendingUp,
  challenge: HiLightningBolt,
  badge: HiBadgeCheck,
  stats: HiClipboardList,
  chat: HiChat,
  profile: HiUser,
  settings: HiClipboardList,
  fire: HiFire,
  star: HiStar,
  check: HiCheckCircle,
  lock: HiLockClosed,
  quote: HiDocumentText,
  level: HiTrendingUp,
  journal: HiDocumentText,
  login: HiCheck,
  streak7: HiFire,
  streak30: HiStar,
  moodMaster: HiOutlineFaceSmile,
  waterHero: HiBeaker,
  sleepChampion: HiMoon,
  fitness: HiTrendingUp,
  healthyWeek: HiSparkles,
  golden: HiStar,
  challengeStarter: HiLightningBolt,
  challengePro: HiLightningBolt,
  very_happy: HiOutlineFaceSmile,
  happy: HiOutlineFaceSmile,
  neutral: HiUser,
  sad: HiOutlineFaceFrown,
  very_sad: HiOutlineFaceFrown,
  stressed: HiLightningBolt,
  walking: HiTrendingUp,
  running: HiTrendingUp,
  gym: HiOfficeBuilding,
  cycling: HiTrendingUp,
  football: HiTrendingUp,
  basketball: HiTrendingUp,
  swimming: HiBeaker,
  other: HiLightBulb,
  hydration: HiBeaker,
  activity: HiTrendingUp,
  mind: HiBookOpen,
  social: HiUserGroup,
  nutrition: HiHeart,
  read: HiBookOpen,
  meditate: HiMoon,
  outside: HiSun,
};

export function AppIcon({ name, className = 'w-5 h-5' }) {
  const Icon = ICONS[name] || HiLightBulb;
  return <Icon className={className} aria-hidden="true" />;
}

export function IconBox({ name, className = 'w-9 h-9', iconClass = 'w-4 h-4' }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-stone-200/70 dark:bg-stone-700/50 text-stone-600 dark:text-stone-300 ${className}`}
    >
      <AppIcon name={name} className={iconClass} />
    </span>
  );
}

export const AVATAR_COLORS = [
  { id: 'slate', bg: 'bg-slate-600', label: 'Slate' },
  { id: 'indigo', bg: 'bg-indigo-600', label: 'Indigo' },
  { id: 'teal', bg: 'bg-teal-600', label: 'Teal' },
  { id: 'rose', bg: 'bg-rose-600', label: 'Rose' },
  { id: 'amber', bg: 'bg-amber-600', label: 'Amber' },
  { id: 'sky', bg: 'bg-sky-600', label: 'Sky' },
];

export function getAvatarColor(id) {
  return AVATAR_COLORS.find((c) => c.id === id) || AVATAR_COLORS[1];
}

export function UserAvatar({ name, colorId = 'indigo', size = 'lg' }) {
  const color = getAvatarColor(colorId);
  const initial = (name || 'U').charAt(0).toUpperCase();
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl' };
  return (
    <div
      className={`${sizes[size]} ${color.bg} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initial}
    </div>
  );
}
