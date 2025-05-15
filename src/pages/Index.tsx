
import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import CreatePostCard from '@/components/CreatePostCard';
import RightSidebar from '@/components/RightSidebar';
import { mockPosts } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar />
      
      <div className="flex-1 container mx-auto flex">
        <Sidebar />
        
        <main className="flex-1 py-4 px-2 md:px-6 mx-auto">
          <div className="flex justify-center mb-3">
            <div className="inline-flex rounded-full overflow-hidden bg-white border border-gray-200 text-sm">
              <button className="px-4 py-1 font-medium bg-blue-500 text-white">All</button>
              <button className="px-4 py-1 font-medium hover:bg-gray-50">Family</button>
              <button className="px-4 py-1 font-medium hover:bg-gray-50">Friends</button>
              <button className="px-4 py-1 font-medium hover:bg-gray-50">More ▾</button>
            </div>
          </div>
          
          <CreatePostCard />
          
          <div className="space-y-5">
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
