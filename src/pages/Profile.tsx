import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2, Music } from 'lucide-react';

const MOODS = [
  { value: '', label: 'No mood' },
  { value: '😊', label: '😊 Happy' },
  { value: '😢', label: '😢 Sad' },
  { value: '😍', label: '😍 In love' },
  { value: '😎', label: '😎 Cool' },
  { value: '🤒', label: '🤒 Sick' },
  { value: '💤', label: '💤 Sleepy' },
  { value: '🍔', label: '🍔 Hungry' },
  { value: '🎉', label: '🎉 Celebrating' },
  { value: '🚧', label: '🚧 Busy' },
  { value: '🙅', label: '🙅 Away' },
];

const Profile = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [mood, setMood] = useState('');
  const [nowPlaying, setNowPlaying] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setHandle(profile.handle || '');
      setBio(profile.bio || '');
      setPersonalMessage((profile as any).personal_message || '');
      setMood((profile as any).mood || '');
      setNowPlaying((profile as any).now_playing || '');
      setIsPrivate(!!(profile as any).is_private);
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return avatarUrl;
    const ext = avatarFile.name.split('.').pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, avatarFile, { upsert: true });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!user) return;
    if (!displayName.trim()) {
      toast.error('Display name is required');
      return;
    }
    setSaving(true);
    try {
      const newAvatarUrl = await uploadAvatar();
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          handle: handle.trim() || null,
          bio: bio.trim() || null,
          avatar_url: newAvatarUrl,
          personal_message: personalMessage.trim() || null,
          mood: mood || null,
          now_playing: nowPlaying.trim() || null,
          is_private: isPrivate,
        })
        .eq('id', user.id);
      if (error) throw error;
      toast.success('Profile updated');
      setAvatarFile(null);
      setAvatarPreview(null);
      setAvatarUrl(newAvatarUrl);
      await refreshProfile();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = (displayName || 'U').slice(0, 2).toUpperCase();
  const previewUrl = avatarPreview || avatarUrl || undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Edit profile</h1>
            <p className="text-sm text-muted-foreground">Update how others see you on fort.social.</p>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={previewUrl} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" /> Change avatar
              </Button>
              <p className="text-xs text-muted-foreground mt-1">PNG or JPG, up to 5MB.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={50} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handle">Handle</Label>
            <Input id="handle" value={handle} onChange={(e) => setHandle(e.target.value.replace(/\s+/g, ''))} maxLength={30} placeholder="yourhandle" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalMessage">Personal message</Label>
            <Input
              id="personalMessage"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              maxLength={130}
              placeholder="What's on your mind?"
            />
            <p className="text-xs text-muted-foreground">Shown next to your name, MSN-style.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Mood</Label>
            <Select value={mood || 'none'} onValueChange={(v) => setMood(v === 'none' ? '' : v)}>
              <SelectTrigger id="mood"><SelectValue placeholder="Pick a mood" /></SelectTrigger>
              <SelectContent>
                {MOODS.map((m) => (
                  <SelectItem key={m.value || 'none'} value={m.value || 'none'}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nowPlaying"><Music className="w-3 h-3 inline mr-1" /> Now playing</Label>
            <Input
              id="nowPlaying"
              value={nowPlaying}
              onChange={(e) => setNowPlaying(e.target.value)}
              maxLength={120}
              placeholder="Artist — Track"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} rows={4} placeholder="Tell people a bit about yourself..." />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/280</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="private">Private account</Label>
              <p className="text-xs text-muted-foreground">Followers must be approved.</p>
            </div>
            <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
