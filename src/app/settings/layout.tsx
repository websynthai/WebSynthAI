'use client';
import SettingsSidebar from '@/components/settings-sidebar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/');
    }
  }, [status]);

  return (
    <div className="p-10 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="flex">
        <SettingsSidebar />
        <div className="flex-1 ml-8">{children}</div>
      </div>
    </div>
  );
}
