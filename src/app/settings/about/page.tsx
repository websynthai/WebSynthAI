import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, Code, Github, Globe, Rocket } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About | Settings',
  description: 'Information about the application and company.',
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card shadow-sm border border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold text-foreground">
              About v0.diy
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Generate UI with ShadcnUI/NextUI from text prompts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border group hover:bg-muted/70 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Version
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                1.0.0
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border group hover:bg-muted/70 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                Dec 15, 2024
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold text-foreground">
              Project Information
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            v0.diy is a platform that allows you to generate UI with
            ShadcnUI/NextUI from text prompts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>Repository</span>
              </h3>
              <Link
                href="https://github.com/sujalxplores/v0.diy"
                className="group flex items-center space-x-3 p-4 rounded-lg bg-muted/50 border border-border
                  hover:bg-muted/70 hover:border-primary/20 transition-all duration-200"
              >
                <div className="p-2 rounded-md bg-background border border-border group-hover:border-primary/20 transition-colors">
                  <Github className="h-4 w-4 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  sujalxplores/v0.diy
                </span>
              </Link>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                <Rocket className="w-4 h-4" />
                <span>Mission</span>
              </h3>
              <div className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors duration-200">
                <p className="text-sm text-foreground leading-relaxed">
                  To make UI development smooth and efficient through AI-powered
                  text-to-UI generation. Our platform empowers developers to
                  create beautiful interfaces faster than ever before.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Code className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-medium text-primary">
                    Open Source
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Built with transparency and community collaboration in mind.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-medium text-primary">
                    Community Driven
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Shaped by feedback and contributions from developers
                  worldwide.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
