import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useGroup, useGroups } from '@/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lock, Mail, Users, UserPlus, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groupQuery, membersQuery, myMembershipQuery, postsQuery, createGroupPost, inviteUser } = useGroup(id);
  const { joinGroup, leaveGroup } = useGroups();

  const [content, setContent] = useState('');
  const [inviteHandle, setInviteHandle] = useState('');

  const group = groupQuery.data;
  const membership = myMembershipQuery.data;
  const isMember = !!membership;
  const isAdmin = membership?.role === 'owner' || membership?.role === 'admin';

  if (groupQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center mt-10 text-muted-foreground">Loading…</p>
      </div>
    );
  }
  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <p className="text-muted-foreground">Group not found or you don't have access.</p>
          <Button variant="ghost" onClick={() => navigate('/groups')} className="mt-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to groups
          </Button>
        </div>
      </div>
    );
  }

  const VisibilityIcon = group.visibility === 'public' ? Users : group.visibility === 'private' ? Lock : Mail;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate('/groups')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> All groups
        </Button>

        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                <Badge variant="outline" className="gap-1"><VisibilityIcon className="w-3 h-3" /> {group.visibility}</Badge>
              </div>
              {group.description && <p className="text-sm text-muted-foreground mt-1">{group.description}</p>}
            </div>
            <div className="flex gap-2">
              {!isMember && group.visibility === 'public' && (
                <Button onClick={() => joinGroup.mutate(group.id)}>
                  <UserPlus className="w-4 h-4 mr-1" /> Join
                </Button>
              )}
              {isMember && membership.role !== 'owner' && (
                <Button variant="outline" onClick={() => { leaveGroup.mutate(group.id); navigate('/groups'); }}>
                  <LogOut className="w-4 h-4 mr-1" /> Leave
                </Button>
              )}
            </div>
          </div>
        </Card>

        {isAdmin && (
          <Card className="p-4">
            <p className="text-sm font-medium mb-2">Invite by handle</p>
            <div className="flex gap-2">
              <Input
                placeholder="@handle"
                value={inviteHandle}
                onChange={(e) => setInviteHandle(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (!inviteHandle.trim()) return;
                  inviteUser.mutate(inviteHandle.trim());
                  setInviteHandle('');
                }}
              >
                Invite
              </Button>
            </div>
          </Card>
        )}

        {isMember && (
          <Card className="p-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Share something with ${group.name}…`}
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={() => {
                  if (!content.trim()) return;
                  createGroupPost.mutate(content.trim());
                  setContent('');
                }}
                disabled={createGroupPost.isPending}
              >
                Post
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {(postsQuery.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No posts in this group yet.</p>
          )}
          {(postsQuery.data ?? []).map((p: any) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={p.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{p.profiles?.display_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{p.profiles?.display_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</p>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{p.content}</p>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <h2 className="font-semibold mb-2">Members ({(membersQuery.data ?? []).length})</h2>
          <div className="flex flex-wrap gap-2">
            {(membersQuery.data ?? []).map((m: any) => (
              <div key={m.id} className="flex items-center gap-2 bg-muted rounded-md px-2 py-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={m.profiles?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">{m.profiles?.display_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{m.profiles?.display_name}</span>
                {m.role !== 'member' && <Badge variant="secondary" className="text-[10px]">{m.role}</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GroupDetail;
