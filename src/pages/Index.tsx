
import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import CreatePostCard from '@/components/CreatePostCard';
import RightSidebar from '@/components/RightSidebar';
import { mockPosts } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 flex">
        <Sidebar />
        
        <main className="flex-1 py-4 px-2 md:px-6 max-w-3xl mx-auto">
          <CreatePostCard />
          
          <div className="space-y-4">
            {mockPosts.map((post) => (
              <PostCard 
                key={post.id}
                user={post.user}
                content={post.content}
                engagement={post.engagement}
              />
            ))}
          </div>
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
