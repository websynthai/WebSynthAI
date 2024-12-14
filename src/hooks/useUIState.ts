import { create } from 'zustand';

interface UIInput {
  input: string;
  imageBase64: string;
  loading: boolean;
  uiType: string;
  setInput: (val: string) => void;
  setLoading: (val: boolean) => void;
  setImageBase64: (val: string) => void;
  setUIType: (val: string) => void;
}

export const useUIState = create<UIInput>((set) => ({
  input: '',
  imageBase64: '',
  loading: false,
  uiType: 'shadcn-react',
  setInput: (val) => set(() => ({ input: val })),
  setLoading: (val) => set(() => ({ loading: val })),
  setImageBase64: (val) => set(() => ({ imageBase64: val })),
  setUIType: (val) => set(() => ({ uiType: val })),
}));
