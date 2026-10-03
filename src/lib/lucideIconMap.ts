import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BadgeDollarSign,
  Briefcase,
  CheckCircle,
  Circle,
  Clock,
  CreditCard,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  Heart,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Palette,
  Phone,
  Printer,
  Scan,
  Send,
  Shield,
  Smartphone,
  Star,
  Target,
  ThumbsUp,
  User,
  Users,
  Wifi,
  Zap,
} from 'lucide-react';

/**
 * Explicit registry of every icon name the app can resolve dynamically
 * (admin icon pickers, DB-stored icon names, category/fallback icons).
 *
 * Replaces `import * as LucideIcons from 'lucide-react'` namespace lookups,
 * which forced the bundler to include the entire lucide-react icon set.
 */
export const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
  Award,
  BadgeDollarSign,
  Briefcase,
  CheckCircle,
  Circle,
  Clock,
  CreditCard,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  Heart,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Palette,
  Phone,
  Printer,
  Scan,
  Send,
  Shield,
  Smartphone,
  Star,
  Target,
  ThumbsUp,
  User,
  Users,
  Wifi,
  Zap,
};

/** Resolve a stored/picked icon name to a component, with a safe fallback. */
export const getLucideIcon = (
  iconName?: string | null,
  fallback: LucideIcon = Star
): LucideIcon => (iconName ? LUCIDE_ICON_MAP[iconName] || fallback : fallback);
