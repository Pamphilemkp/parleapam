import {createAvatar} from '@dicebear/core';
import {botttsNeutral, initials} from '@dicebear/collection';
import {cn} from '@/lib/utils';
import {AvatarFallback, Avatar, AvatarImage} from '@/components/ui/avatar';

interface GeneratedAvatarProps {
  className?: string;
    seed?: string;
    variant?: 'initials' | 'bottsNeutral';
}
export const  GeneratedAvatar =({
  className,
  seed,
  variant,
}: GeneratedAvatarProps) => {
  let avatar;
  if (variant === 'bottsNeutral') {
    avatar = createAvatar(botttsNeutral, {
      seed, 
})
}
 else{
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }
return (
    <Avatar className={cn('h-10 w-10', className)}>
        <AvatarImage src={avatar.toDataUri()} alt="Avatar"/>
        <AvatarFallback className="bg-muted">
            {seed?.charAt(0).toUpperCase()}
        </AvatarFallback>
    </Avatar>
    )

};
