import React, { useState, useRef } from 'react';
import { Image, Smile, Users, MapPin, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';

const CreatePostCard = () => {
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();
  const { createPost } = usePosts();
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!postText.trim() && !selectedImage) return;
    createPost.mutate(
      { content: postText, imageFile: selectedImage || undefined },
      { onSuccess: () => { setPostText(''); removeImage(); } }
    );
  };
  
  return (
    <Card className="material-card bg-card mb-5 overflow-hidden max-w-2xl mx-auto">
      <div className="p-4 pb-2">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shadow-material-1">
            <AvatarImage src={profile?.avatar_url || '/placeholder.svg'} alt="Profile" />
            <AvatarFallback className="bg-secondary text-secondary-foreground">{profile?.display_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-muted rounded-sm p-2">
            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share what's new..."
              className="resize-none border-none focus-visible:ring-0 p-0 h-16 text-base bg-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {imagePreview && (
          <div className="mt-3 relative inline-block">
            <img src={imagePreview} alt="Preview" className="max-h-48 rounded-sm shadow-material-1" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => fileInputRef.current?.click()}>
            <Image className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={(!postText.trim() && !selectedImage) || createPost.isPending}
          variant="material"
          size="sm"
        >
          {createPost.isPending ? 'Sharing...' : 'Share'}
        </Button>
      </div>
    </Card>
  );
};

export default CreatePostCard;
