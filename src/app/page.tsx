'use client';

import { createUI } from '@/actions/ui/create-ui';
import Header from '@/components/header';
import HomeUICards from '@/components/home-uis';
import Suggestions from '@/components/suggestions';
import {
  Button,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useModel } from '@/hooks/useModel';
import { useUIState } from '@/hooks/useUIState';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  Image as ImageIcon,
  InfoIcon,
  LoaderCircle,
  Lock,
  SendHorizontal,
  Settings2,
  X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const {
    setInitialModel,
    setModifierModel,
    setDescriptiveModel,
    setImageModel,
  } = useModel();
  const {
    input,
    setInput,
    loading,
    setLoading,
    imageBase64,
    setImageBase64,
    uiType,
    setUIType,
  } = useUIState();
  const { toggle } = useAuthModal();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImageBase64('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateUI = async () => {
    if (!input) {
      toast.error('Please enter a message');
      return;
    }
    try {
      if (status === 'authenticated' && userId) {
        setLoading(true);
        const ui = await createUI(input, userId, uiType);
        router.push(`/ui/${ui.id}`);
        setLoading(false);
      } else {
        toggle();
      }
    } catch (_error) {
      toast.error('Failed to generate UI');
      setLoading(false);
    }
  };

  useEffect(() => {
    const cv = 3;
    const lv = Number.parseInt(localStorage.getItem('cv') || '0');
    if (lv < cv) {
      toast.info(
        'Changing default models to recommended models for better performance.',
      );
      setInitialModel('glhf:hf:meta-llama/Meta-Llama-3.1-405B-Instruct');
      setModifierModel('glhf:hf:meta-llama/Meta-Llama-3.1-70B-Instruct');
      setDescriptiveModel('glhf:hf:google/gemma-2-27b-it');
      setImageModel('mistral:pixtral-12b-2409');
      localStorage.setItem('cv', cv.toString());
    }
  }, [setDescriptiveModel, setImageModel, setInitialModel, setModifierModel]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateUI();
    }
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center mt-16">
        <div className="w-full max-w-2xl h-auto items-center flex flex-col space-y-4">
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
            🪄 Magically convert prompts into polished UI components using
            shadcn & NextUI
          </p>
          <Card
            className="w-full bg-background/50 backdrop-blur-sm border shadow-md
            overflow-hidden border-0
            ring-2 ring-primary/20
            transition-all duration-200
            hover:shadow-lg hover:bg-background/80
            dark:bg-background/20 dark:hover:bg-background/30
            dark:shadow-lg dark:shadow-primary/5"
          >
            <div className="relative">
              <AnimatePresence>
                {selectedImage && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      type: 'spring',
                      damping: 25,
                      stiffness: 200,
                    }}
                    className="bg-background/50 relative rounded-t-xl text-gray-600 ring-2 ring-primary/20 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="relative h-10 w-[150px] shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={removeImage}
                          className="rounded-full h-4 w-4 absolute top-[-5px] right-[-5px]"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                        <div className="inline-flex w-full cursor-pointer items-center gap-1 rounded-lg border border-border/50 bg-background/50 px-1 py-1 hover:bg-muted/70 transition-all duration-200">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted">
                            {imageBase64 ? (
                              <Image
                                width={32}
                                height={32}
                                src={imageBase64}
                                alt="Preview"
                                className="rounded-sm object-cover border border-border/50"
                              />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>

                          <div className="grid flex-1 gap-0.5 py-0.5 text-xs leading-none text-muted-foreground">
                            <div className="truncate font-medium pr-6">
                              {selectedImage.name}
                            </div>
                            <div className="text-xs text-muted-foreground font-normal">
                              {Math.round(selectedImage.size / 1024)}kb
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Textarea
                value={input}
                placeholder="Describe your UI component... (Press Enter to submit, Shift + Enter for new line)"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-3
                  text-foreground placeholder:text-muted-foreground
                  outline-none focus:ring-0
                  resize-none min-h-[140px] rounded-none border-none border-0
                  focus-visible:ring-0
                  transition-colors duration-200
                  hover:bg-muted/50"
                autoFocus
                spellCheck={false}
              />

              <div
                className="absolute bottom-0 left-0 right-0
                bg-background/80 backdrop-blur-sm border-t
                transition-all duration-200
                dark:bg-background/40 dark:border-border/50"
              >
                <div className="p-2 flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>

                    <Select onValueChange={setUIType} value={uiType}>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shadcn-react">Shadcn/UI</SelectItem>
                        <SelectItem value="nextui-react">Next UI</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="ionicons">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Icons" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ionicons">Ion Icons</SelectItem>
                        <SelectItem value="lucidereact" disabled>
                          <span className="flex items-center gap-2">
                            Lucide
                            <Lock className="h-3 w-3" />
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push('/settings/llm')}
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button onClick={generateUI} size="icon" variant="outline">
                    {loading ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {selectedImage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <InfoIcon className="h-4 w-4" />
              <p>
                Image to code is in Beta. It doesn&apos;t support
                ShadcnUI/NextUI yet.
              </p>
            </div>
          )}

          <Suggestions />
        </div>
      </div>
      <HomeUICards />
    </div>
  );
}
