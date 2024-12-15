'use client';

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
import { useModelInitialization } from '@/hooks/useModelInitialization';
import { useUIGenerator } from '@/hooks/useUIGenerator';
import { useUIState } from '@/hooks/useUIState';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  Image as ImageIcon,
  InfoIcon,
  LoaderCircle,
  Lock,
  PaperclipIcon,
  Settings2,
  X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const PromptInput = () => {
  const router = useRouter();
  const { toggle } = useAuthModal();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { generateUI, loading } = useUIGenerator({
    userId,
    status,
    toggle,
  });
  useModelInitialization();

  const { input, setInput, imageBase64, setImageBase64, uiType, setUIType } =
    useUIState();

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateUI();
    }
  };

  return (
    <>
      <Card
        className="w-full bg-background/50 backdrop-blur-sm shadow-md
        overflow-hidden border-0
        ring-2 ring-border/50
        transition-all duration-200
        relative"
      >
        <div className="flex flex-col">
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
                className="bg-background/50 relative text-gray-600 border-b"
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
                      <span className="sr-only">Remove Image</span>
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

          <div className="h-[150px] relative">
            <div className="absolute inset-0 bottom-[52px] overflow-auto">
              <Textarea
                value={input}
                placeholder="Describe your UI component..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-3
                  text-foreground placeholder:text-muted-foreground
                  outline-none focus:ring-0
                  resize-none min-h-full rounded-none border-none border-0
                  focus-visible:ring-0
                  transition-colors duration-200
                  "
                autoFocus
                spellCheck={false}
              />
            </div>

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
                  >
                    <PaperclipIcon className="h-4 w-4" />
                    <span className="sr-only">Upload Image</span>
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
                  >
                    <Settings2 className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </div>

                <Button onClick={generateUI} size="icon" variant="outline">
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                  <span className="sr-only">Generate UI</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {selectedImage && (
        <div
          className="flex items-center gap-2 p-2 text-sm rounded-md
          bg-muted/50 text-foreground/80
          dark:bg-background/50 dark:text-foreground/70
          border border-border/50"
        >
          <InfoIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <p>
            Image to code is in Beta. It doesn&apos;t support ShadcnUI/NextUI
            yet.
          </p>
        </div>
      )}
    </>
  );
};

export default PromptInput;
