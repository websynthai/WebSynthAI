'use client';

import { getUIProfile } from '@/actions/ui/get-uis';
import { getUser } from '@/actions/user';
import ProjectCard from '@/components/project-card';
import LoadingSkeleton from '@/components/project-skeleton';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import type { UI } from '@/types/user';
import { Box, CalendarDays, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string | null;
  username: string;
  createdAt: Date;
  imageUrl: string | null;
  uiCount: number;
  subPromptCount: number;
}

const EmptyState = ({ mode }: { mode: string }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
    <Box className="h-12 w-12 text-muted-foreground/50 mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-2">No UIs found</h3>
    <p className="text-sm text-muted-foreground max-w-[500px]">
      {mode === 'ownUI'
        ? "This user hasn't created any UIs yet."
        : "This user hasn't liked any UIs yet."}
    </p>
  </div>
);

export default function ProfilePage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = use(props.params);
  const [mode, setMode] = useState<string>('ownUI');
  const [uis, setUis] = useState<UI[]>([]);
  const [start, setStart] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [maxReached, setMaxReached] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const limit = 9;
  const router = useRouter();
  const { username } = params;

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const userObj = await getUser(username);
      if (!userObj) {
        toast.warning('User not found');
      }
      setUser(userObj);
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    if (!user) return;

    const fetchUIs = async () => {
      setIsLoading(true);
      const fetchedUIs = await getUIProfile(user?.id, start, limit, mode);
      if (fetchedUIs.length === 0) {
        setMaxReached(true);
      }
      if (start === 0) {
        setUis(fetchedUIs);
      } else {
        setUis((prevUis) => [...prevUis, ...fetchedUIs]);
      }
      setIsLoading(false);
    };

    fetchUIs();
  }, [mode, start, user]);

  const handleTabChange = (value: string) => {
    setMaxReached(false);
    setUis([]);
    setMode(value);
    setStart(0);
  };

  const handleLoadMore = useCallback(() => {
    if (!maxReached) {
      setStart((prevStart) => prevStart + limit);
    }
  }, [maxReached]);

  useEffect(() => {
    if (isLoading) return;
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      if (bottom && !isLoading) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore, isLoading]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-start gap-8">
              <Avatar
                onClick={() => router.push(`/generations/${user?.username}`)}
                className="h-32 w-32 border-2 border-border cursor-pointer"
              >
                <AvatarImage src={user?.imageUrl || ''} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-semibold text-foreground">
                    {user?.name}
                  </h2>
                  <p className="text-lg text-muted-foreground flex items-center mt-2">
                    <UserIcon className="mr-2 h-5 w-5" />@{user?.username}
                  </p>
                  <p className="text-muted-foreground flex items-center mt-2">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Joined {user?.createdAt.toLocaleDateString()}
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">UI Generated</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {user?.uiCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Subprompts</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {user?.subPromptCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          defaultValue={mode}
          className="w-full mt-8"
          onValueChange={handleTabChange}
        >
          <TabsList className="h-9 bg-muted/60 backdrop-blur-sm rounded-lg p-1">
            <TabsTrigger
              value="ownUI"
              className="relative h-7 rounded-md px-3 text-sm font-medium transition-all"
            >
              User UIs
            </TabsTrigger>
            <TabsTrigger
              value="likedUI"
              className="relative h-7 rounded-md px-3 text-sm font-medium transition-all"
            >
              Liked UIs
            </TabsTrigger>
          </TabsList>

          <TabsContent value={mode} className="mt-6">
            <div className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
              {isLoading ? (
                <LoadingSkeleton />
              ) : uis.length === 0 ? (
                <EmptyState mode={mode} />
              ) : (
                uis.map((ui) => (
                  <ProjectCard
                    key={ui.id}
                    ui={ui}
                    onClick={() => router.push(`/ui/${ui.id}`)}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
