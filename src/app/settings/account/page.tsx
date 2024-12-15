'use client';
import { signOutGithub } from '@/actions/auth/sign-out';
import { Badge, Button } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { data } = useSession();
  const user = data?.user;
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutGithub();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        Please sign in to view your account details.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-semibold text-foreground">
            Profile Information
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            View and manage your account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {/* Profile Header Section */}
          <div className="flex items-center space-x-6 pb-6 border-b border-border">
            <Avatar className="h-24 w-24 border-2 border-border ring-2 ring-background">
              <AvatarImage
                src={user.imageUrl || ''}
                alt={user.name || 'User'}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                {user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </Label>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Username
                </Label>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-sm font-medium text-foreground">
                    @{user.username}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </Label>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-sm font-medium text-foreground">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Account ID
                </Label>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-sm font-mono text-foreground">
                    {user.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-border pt-6">
          <Button onClick={handleSignOut} variant="destructive">
            Sign out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
