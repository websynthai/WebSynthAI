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
import {
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
        <div className="w-full max-w-2xl h-auto items-center flex flex-col space-y-6">
          <p className="font-bold text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient bg-[length:200%_auto] bg-clip-text text-transparent">
            Think. Build. Ship.
          </p>
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
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>

                    {selectedImage && (
                      <div className="flex items-center gap-1 bg-muted/50 rounded-md px-2 py-1">
                        <Image
                          width={16}
                          height={16}
                          src={imageBase64}
                          alt="Preview"
                          className="rounded"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeImage}
                          className="h-4 w-4 p-0 hover:bg-transparent text-muted-foreground"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="h-6 w-px bg-border" />

                  <div className="flex items-center gap-2 flex-1">
                    <Select onValueChange={setUIType} value={uiType}>
                      <SelectTrigger className="h-8 w-[110px] border-none bg-transparent">
                        <SelectValue placeholder="Framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shadcn-react">Shadcn/UI</SelectItem>
                        <SelectItem value="nextui-react">Next UI</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="ionicons">
                      <SelectTrigger className="h-8 w-[100px] border-none bg-transparent">
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
                      variant="ghost"
                      size="sm"
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
                      <SendHorizontal className="h-4 w-4" />
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
