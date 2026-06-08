import { getInitials } from "@/utils/formatters";
import Badge from "@/components/ui/Badge";
import { ROLE_COLORS } from "@/utils/constants";
import { MapPin, Calendar, Mail } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  role?: string;
  subtitle?: string;
  bio?: string;
  location?: string;
  email?: string;
  session?: string;
  avatarUrl?: string;
  actions?: React.ReactNode;
}

export default function ProfileHeader({
  name,
  role,
  subtitle,
  bio,
  location,
  email,
  session,
  avatarUrl,
  actions,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
            {getInitials(name)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            {role && (
              <Badge variant={ROLE_COLORS[role] ? undefined : "default"} className={ROLE_COLORS[role]}>
                {role}
              </Badge>
            )}
          </div>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {bio && <p className="mt-3 text-sm text-gray-600 leading-relaxed">{bio}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {location}
              </span>
            )}
            {email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {email}
              </span>
            )}
            {session && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {session}
              </span>
            )}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
