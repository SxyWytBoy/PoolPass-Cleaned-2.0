import React from 'react';
import { cn } from '@/lib/utils';

interface PersonAvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

/** A round profile photo that falls back to the person's initials. */
const PersonAvatar = ({ name, src, className }: PersonAvatarProps) => {
  const [failed, setFailed] = React.useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={cn('rounded-full bg-pool-light text-pool-primary font-semibold flex items-center justify-center', className)}
    >
      {initials || '?'}
    </div>
  );
};

export default PersonAvatar;
