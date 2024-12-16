import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowUpRight, Bot, Clock, InfoIcon } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
        <Card className="bg-card shadow-sm border border-border overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/50">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-foreground">
                System Maintenance
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              We're enhancing our AI capabilities to serve you better
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary/80 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border group hover:bg-muted/70 transition-colors duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Estimated Duration
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  In Progress
                </span>
              </div>
              <div className="text-center space-y-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  2 Hours
                </span>
                <div className="text-xs text-muted-foreground">
                  Approximate completion time
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/50 p-4 rounded-lg flex items-start space-x-2 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">System Upgrade in Progress</p>
                <p className="text-blue-800/80 dark:text-blue-300/80">
                  Our team is working diligently to implement advanced features
                  and improve system performance.
                </p>
              </div>
            </div>

            <a
              href="https://status.yourdomain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 hover:border-primary/20 transition-all duration-200"
            >
              <div className="p-2 rounded-md bg-background border border-border group-hover:border-primary/20 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                View System Status
              </span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
