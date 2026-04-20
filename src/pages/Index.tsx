import React, { useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import CreatePostCard from '@/components/CreatePostCard';
import RightSidebar from '@/components/RightSidebar';
import { usePosts } from '@/hooks/usePosts';
import { useFollows } from '@/hooks/useFollows';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user } = useAuth();
  const { postsQuery } = usePosts();
  const { followingIdsQuery, pendingIncomingQuery, acceptFollow, rejectFollow } = useFollows();

  const followingIds = useMemo(() => {
    const ids = new Set<string>();
    (followingIdsQuery.data ?? []).forEach((r: any) => {
      if (r.status === 'accepted') ids.add(r.following_id);
    });
    if (user) ids.add(user.id);
    return ids;
  }, [followingIdsQuery.data, user]);

  const allPosts = postsQuery.data ?? [];
  const followingPosts = allPosts.filter((p) => followingIds.has(p.user_id));
  const pendingIncoming = pendingIncomingQuery.data ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 container mx-auto flex">
        <Sidebar />

        <main className="flex-1 py-4 px-2 md:px-6 mx-auto max-w-2xl w-full">
          {pendingIncoming.length > 0 && (
            <Card className="p-3 mb-4 bg-card">
              <p className="text-sm font-medium mb-2">Follow requests</p>
              <div className="space-y-2">
                {pendingIncoming.map((req: any) => (
                  <div key={req.id} className="flex items-center justify-between text-sm">
                    <span>
                      <strong>{req.profiles?.display_name}</strong>{' '}
                      <span className="text-muted-foreground">@{req.profiles?.handle}</span>
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => acceptFollow.mutate(req.id)}>Accept</Button>
                      <Button size="sm" variant="ghost" onClick={() => rejectFollow.mutate(req.id)}>
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <CreatePostCard />

          <Tabs defaultValue="following" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="following" className="space-y-4 mt-4">
              {postsQuery.isLoading && (
                <p className="text-center text-muted-foreground">Loading…</p>
              )}
              {!postsQuery.isLoading && followingPosts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Follow some people to see their posts here.
                </p>
              )}
              {followingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>

            <TabsContent value="discover" className="space-y-4 mt-4">
              {postsQuery.isLoading && (
                <p className="text-center text-muted-foreground">Loading…</p>
              )}
              {!postsQuery.isLoading && allPosts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No posts yet.</p>
              )}
              {allPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
