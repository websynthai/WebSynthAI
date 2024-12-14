import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export const metadata = {
  title: 'About | Settings',
  description: 'Information about the application and company.',
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About</h1>

      <Card className="text-center">
        <CardHeader>
          <CardTitle>v0.diy</CardTitle>
          <CardDescription>
            Generate UI with ShadcnUI/NextUI from text prompts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Version:</strong> 1.0.0
          </p>
          <p>
            <strong>Last Updated:</strong> Sep 18, 2024
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Info</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p>
            <strong>Github: </strong>
            <Link href="https://git.new/v0.diy">
              https://github.com/sujalxplores/v0.diy
            </Link>
          </p>
          <p>
            <strong>Mission:</strong>To make ui development smooth.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
