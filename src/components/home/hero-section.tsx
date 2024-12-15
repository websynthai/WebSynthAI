const HeroSection = () => {
  return (
    <>
      <div className="flex items-center gap-2 font-bold text-5xl">
        <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 animate-gradient bg-[length:200%_auto] bg-clip-text text-transparent">
          Think.
        </span>
        <span className="bg-gradient-to-r from-violet-500 via-violet-400 to-violet-500 animate-gradient bg-[length:200%_auto] bg-clip-text text-transparent">
          Build.
        </span>
        <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 animate-gradient bg-[length:200%_auto] bg-clip-text text-transparent">
          Ship.
        </span>
      </div>
      <p className="text-center text-gray-600 dark:text-gray-300">
        🪄 Magically convert prompts into polished UI components using shadcn &
        NextUI
      </p>
    </>
  );
};

export default HeroSection;
