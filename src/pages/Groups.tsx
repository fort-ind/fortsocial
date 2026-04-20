import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useGroups } from '@/hooks/useGroups';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Users, Lock, Mail } from 'lucide-react';
import { GroupVisibility } from '@/hooks/useGroups';

const VisibilityIcon = ({ v }: { v: GroupVisibility }) => {
  if (v === 'public') return <Users className="w-3 h-3" />;
  if (v === 'private') return <Lock className="w-3 h-3" />;
  return <Mail className="w-3 h-3" />;
};

const Groups = () => {
  const navigate = useNavigate();
  const { allGroupsQuery, myGroupsQuery, myInvitesQuery, createGroup, joinGroup, acceptInvite, declineInvite } = useGroups();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [visibility, setVisibility] = useState<GroupVisibility>('public');

  const handleCreate = async () => {
    if (!name.trim()) return;
    const g = await createGroup.mutateAsync({ name: name.trim(), description: desc.trim() || undefined, visibility });
    setOpen(false);
    setName(''); setDesc(''); setVisibility('public');
    navigate(`/groups/${g.id}`);
  };

  const myGroupIds = new Set((myGroupsQuery.data ?? []).map((g: any) => g.id));
  const allGroups = allGroupsQuery.data ?? [];
  const invites = myInvitesQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Groups</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1" /> New group</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create group</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
                </div>
                <div>
                  <Label>Visibility</Label>
                  <Select value={visibility} onValueChange={(v) => setVisibility(v as GroupVisibility)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public — anyone can join</SelectItem>
                      <SelectItem value="private">Private — visible, request to join</SelectItem>
                      <SelectItem value="invite_only">Invite only — hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={createGroup.isPending}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {invites.length > 0 && (
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Pending invitations</h2>
            <div className="space-y-2">
              {invites.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between">
                  <span className="text-sm"><strong>{inv.groups?.name}</strong></span>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => acceptInvite.mutate({ groupId: inv.group_id, inviteId: inv.id })}>Accept</Button>
                    <Button size="sm" variant="ghost" onClick={() => declineInvite.mutate(inv.id)}>Decline</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <section>
          <h2 className="font-semibold mb-2">Your groups</h2>
          {(myGroupsQuery.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">You haven't joined any groups yet.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(myGroupsQuery.data ?? []).map((g: any) => (
              <Card key={g.id} className="p-4 cursor-pointer hover:shadow-md" onClick={() => navigate(`/groups/${g.id}`)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{g.name}</h3>
                  <Badge variant="outline" className="gap-1"><VisibilityIcon v={g.visibility} /> {g.visibility}</Badge>
                </div>
                {g.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{g.description}</p>}
                <p className="text-xs text-muted-foreground mt-2">Role: {g.role}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Discover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allGroups.filter((g) => !myGroupIds.has(g.id)).map((g) => (
              <Card key={g.id} className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium cursor-pointer" onClick={() => navigate(`/groups/${g.id}`)}>{g.name}</h3>
                  <Badge variant="outline" className="gap-1"><VisibilityIcon v={g.visibility} /> {g.visibility}</Badge>
                </div>
                {g.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{g.description}</p>}
                {g.visibility === 'public' && (
                  <Button size="sm" className="mt-2" onClick={() => joinGroup.mutate(g.id)}>Join</Button>
                )}
              </Card>
            ))}
            {allGroups.filter((g) => !myGroupIds.has(g.id)).length === 0 && (
              <p className="text-sm text-muted-foreground">No other groups to discover.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Groups;
