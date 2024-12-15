import Header from '@/components/header';
import HomeUICards from '@/components/home-uis';
import HeroSection from '@/components/home/hero-section';
import PromptInput from '@/components/prompt-input';
import Suggestions from '@/components/suggestions';

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center mt-16">
        <div className="w-full max-w-2xl h-auto items-center flex flex-col space-y-4">
          <HeroSection />
          <PromptInput />
          <Suggestions />
        </div>
      </div>
      <HomeUICards />
    </>
  );
}
