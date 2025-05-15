
import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import CreatePostCard from '@/components/CreatePostCard';
import RightSidebar from '@/components/RightSidebar';
import { mockPosts } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      
      <div className="flex-1 container mx-auto flex">
        <Sidebar />
        
        <main className="flex-1 py-4 px-2 md:px-6 max-w-3xl mx-auto">
          <div className="flex justify-between mb-3">
            <div className="flex gap-2">
              <button className="px-4 py-1 bg-white rounded-full border text-sm font-medium hover:bg-gray-50">All</button>
              <button className="px-4 py-1 bg-white rounded-full border text-sm font-medium hover:bg-gray-50">All but work</button>
              <button className="px-4 py-1 bg-white rounded-full border text-sm font-medium hover:bg-gray-50">Friends</button>
              <button className="px-4 py-1 bg-white rounded-full border text-sm font-medium hover:bg-gray-50">Family</button>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <button className="p-1 hover:bg-gray-200 rounded">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10m0 0L8 14m4-4l4 4" /></svg>
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9l-7 7-7-7" /></svg>
              </button>
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
