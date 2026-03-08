import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import CreatePostCard from '@/components/CreatePostCard';
import RightSidebar from '@/components/RightSidebar';
import { usePosts } from '@/hooks/usePosts';

const Index = () => {
  const { postsQuery } = usePosts();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto flex">
        <Sidebar />
        
        <main className="flex-1 py-4 px-2 md:px-6 mx-auto">
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-sm overflow-hidden shadow-material-1 bg-card text-sm">
              <button className="circle-tab active">All</button>
              <button className="circle-tab">Family</button>
              <button className="circle-tab">Friends</button>
              <button className="circle-tab">More ▾</button>
            </div>
          </div>
          
          <CreatePostCard />
          
          <div className="space-y-4">
            {postsQuery.isLoading && (
              <p className="text-center text-muted-foreground">Loading posts...</p>
            )}
            {postsQuery.data?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No posts yet. Be the first to share something!</p>
            )}
            {postsQuery.data?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
