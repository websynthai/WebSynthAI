'use client';

import { getUIHome } from '@/actions/ui/get-uis';
import ProjectCard from '@/components/project-card';
import type { UI } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HomeUICards = () => {
  const router = useRouter();
  const [uis, setUis] = useState<UI[]>([]);

  useEffect(() => {
    const fetchUIs = async () => {
      const fetchedUIs = await getUIHome();
      setUis(fetchedUIs);
    };

    fetchUIs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {uis.map((ui) => (
          <ProjectCard
            key={ui.id}
            ui={ui}
            onClick={() => router.push(`ui/${ui.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeUICards;
