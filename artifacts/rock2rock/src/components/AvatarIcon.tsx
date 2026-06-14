import {
  Sparkles, Flame, Mountain, Crown, Eye,
  Star, Gem, Snowflake, Moon, Leaf, Bot,
  LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Sparkles, Flame, Mountain, Crown, Eye,
  Star, Gem, Snowflake, Moon, Leaf, Bot,
};

interface AvatarIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function AvatarIcon({ name, size = 28, className = "" }: AvatarIconProps) {
  const Icon = ICON_MAP[name] ?? Star;
  return <Icon size={size} className={className} />;
}
