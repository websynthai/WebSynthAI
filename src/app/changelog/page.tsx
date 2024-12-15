'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  type Change,
  type ChangeType,
  type Version,
  commitChanges,
} from '@/lib/changelogs';
import { motion } from 'framer-motion';
import { Book, Bug, GitCommit, InfoIcon, Star, Zap } from 'lucide-react';
import { useEffect } from 'react';

const ChangelogCards = ({ commitChanges }: { commitChanges: Version[] }) => {
  const groupChangesByType = (changes: Change[]) => {
    return changes.reduce(
      (acc, change) => {
        if (!acc[change.type]) {
          acc[change.type] = [];
        }
        acc[change.type].push(change.description);
        return acc;
      },
      {} as Record<ChangeType, string[]>,
    );
  };

  const getIcon = (type: ChangeType) => {
    const iconClass = 'h-4 w-4 mr-2 flex-shrink-0';
    switch (type) {
      case 'feature':
        return <Star className={`${iconClass} text-yellow-500`} />;
      case 'improvement':
        return <Zap className={`${iconClass} text-blue-500`} />;
      case 'bugfix':
        return <Bug className={`${iconClass} text-red-500`} />;
      case 'other':
        return <Book className={`${iconClass} text-purple-500`} />;
    }
  };

  const getBadgeColor = (type: ChangeType) => {
    switch (type) {
      case 'feature':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'improvement':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'bugfix':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'other':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return commitChanges.map((release, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-8 relative pl-8"
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
      <div className="relative">
        <div className="flex items-center mb-4">
          <div className="absolute -left-[2.25rem] w-5 h-5 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center">
            <GitCommit className="h-3 w-3 text-primary" />
          </div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-foreground">
              Version {release.version}
            </h2>
            <Badge variant="secondary" className="text-xs font-mono">
              {release.date}
            </Badge>
          </div>
        </div>

        <Card className="bg-card shadow-sm border border-border transition-all duration-200 hover:shadow-md">
          <div className="p-6 space-y-6">
            {Object.entries(groupChangesByType(release.changes)).map(
              ([type, descriptions], typeIndex) => (
                <div key={typeIndex}>
                  <div className="flex items-center space-x-2 mb-3">
                    {getIcon(type as ChangeType)}
                    <h3
                      className={`text-sm font-semibold capitalize ${getBadgeColor(
                        type as ChangeType,
                      )}`}
                    >
                      {type === 'bugfix' ? 'Bug Fixes' : `${type}s`}
                    </h3>
                  </div>
                  <ul className="space-y-3 ml-6">
                    {descriptions.map((description, descIndex) => (
                      <motion.li
                        key={descIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: typeIndex * 0.1 + descIndex * 0.05,
                        }}
                        className="relative"
                      >
                        <div className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-muted-foreground/20" />
                        <span className="text-sm text-muted-foreground">
                          {description}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  ));
};

export default function Changelog() {
  useEffect(() => {
    localStorage.setItem('clv', new Date().toISOString());
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Changelog</h1>
          <p className="text-sm text-muted-foreground">
            Track all the updates and improvements to our platform
          </p>
        </div>

        <Card className="border-l-4 border-l-yellow-500 bg-card shadow-sm">
          <div className="p-4 flex items-start space-x-3">
            <InfoIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                AI-Generated Changelogs
              </p>
              <p className="text-sm text-muted-foreground">
                These changelogs are automatically generated using AI analysis
                of repository commit messages.
              </p>
            </div>
          </div>
        </Card>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="pr-4">
            <ChangelogCards commitChanges={commitChanges} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
