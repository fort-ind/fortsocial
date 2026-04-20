import { Button } from '@/components/ui/button';
import { useFollows } from '@/hooks/useFollows';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, UserMinus, Clock } from 'lucide-react';

interface FollowButtonProps {
  targetUserId: string;
  targetIsPrivate?: boolean;
  size?: 'sm' | 'default';
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId, targetIsPrivate, size = 'sm' }) => {
  const { user } = useAuth();
  const { relationQuery, follow, unfollow } = useFollows(targetUserId);

  if (!user || user.id === targetUserId) return null;

  const rel = relationQuery.data;
  const loading = relationQuery.isLoading || follow.isPending || unfollow.isPending;

  if (rel?.status === 'accepted') {
    return (
      <Button size={size} variant="outline" disabled={loading} onClick={() => unfollow.mutate(targetUserId)}>
        <UserMinus className="w-4 h-4 mr-1" /> Following
      </Button>
    );
  }
  if (rel?.status === 'pending') {
    return (
      <Button size={size} variant="outline" disabled={loading} onClick={() => unfollow.mutate(targetUserId)}>
        <Clock className="w-4 h-4 mr-1" /> Requested
      </Button>
    );
  }
  return (
    <Button
      size={size}
      disabled={loading}
      onClick={() => follow.mutate({ targetId: targetUserId, isPrivate: !!targetIsPrivate })}
    >
      <UserPlus className="w-4 h-4 mr-1" /> Follow
    </Button>
  );
};

export default FollowButton;
