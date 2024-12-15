import { useEffect } from 'react';
import { toast } from 'sonner';
import { useModel } from './useModel';

export const useModelInitialization = () => {
  const {
    setInitialModel,
    setModifierModel,
    setDescriptiveModel,
    setImageModel,
  } = useModel();

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
};
