'use client';
import { createSubPrompt } from '@/actions/ui/create-subprompt';
import { deleteUI } from '@/actions/ui/delete-ui';
import { getCodeFromId } from '@/actions/ui/get-code';
import { getUI } from '@/actions/ui/get-uis';
import { updateSubPrompt } from '@/actions/ui/update-subprompt';
import { updateUI } from '@/actions/ui/update-ui';
import Sidebar from '@/components/sidebar';
import { Button, Card, Input } from '@/components/ui';
import UIBody from '@/components/ui-body';
import UIHeader from '@/components/ui-header';
import UIRigthHeader from '@/components/ui-right-header';
import { useClientMode } from '@/hooks/useMode';
import { useModel } from '@/hooks/useModel';
import { useUIState } from '@/hooks/useUIState';
import { isParent } from '@/lib/helper';
import { isModelSupported } from '@/lib/supportedllm';
import html2canvas from 'html2canvas';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import type { ImperativePanelGroupHandle } from 'react-resizable-panels';
import { toast } from 'sonner';

type SubPrompt = {
  id: string;
  UIId: string;
  SUBId: string;
  createdAt: Date;
  subPrompt: string;
  codeId: string;
  modelId?: string | null;
  code?: string;
};

const UI = (props: { params: Promise<any> }) => {
  const params = use(props.params);
  const ref = useRef<ImperativePanelGroupHandle>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();
  const { modifierModel, descriptiveModel, initialModel, imageModel } =
    useModel();
  const { preciseMode, balancedMode, creativeMode } = useClientMode();
  const [modesFound, setModesFound] = useState({
    precise: false,
    balanced: false,
    creative: false,
  });

  const [selectedVersion, setSelectedVersion] = useState({
    prompt: '',
    subid: '',
    modelId: '',
    createdAt: '',
  });
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('precise');
  const [loading, setLoading] = useState(false);
  const [backendCheck, setBackendCheck] = useState(0);
  const uiid = params.uiid;
  const [ui, setUi] = useState<{
    user?:
      | {
          username: string;
          imageUrl: string;
        }
      | undefined;
    subPrompts: {
      id: string;
      UIId: string;
      SUBId: string;
      createdAt: Date;
      subPrompt: string;
      codeId: string;
      modelId?: string;
      code: string;
    }[][];
    id: string;
    userId: string;
    prompt: string;
    img: string;
    createdAt: Date;
    uiType: string;
    likesCount: number;
    viewCount: number;
    forkedFrom: string | null;
  } | null>(null);

  const [uiState, setUiState] = useState<{
    [key: string]: {
      loading: boolean;
      code: string;
    };
  }>({
    precise: {
      loading: false,
      code: '',
    },
    balanced: {
      loading: false,
      code: '',
    },
    creative: {
      loading: false,
      code: '',
    },
  });

  const modeMap: { [key: number]: string } = {
    0: 'Precise',
    1: 'Balanced',
    2: 'Creative',
  };

  const { input, setInput, imageBase64, setImageBase64 } = useUIState();

  const getCode = async (id: string, iidx: number, jidx: number) => {
    try {
      const code = await getCodeFromId(id);
      setUi((prevUi) => {
        if (prevUi) {
          const updatedSubPrompts = [...prevUi.subPrompts];
          updatedSubPrompts[iidx][jidx].code = code || '';
          return {
            ...prevUi,
            subPrompts: updatedSubPrompts,
          };
        }
        return prevUi;
      });
      return code;
    } catch (error) {
      console.error('Error fetching code:', error);
      toast.error(
        `Failed to fetch code for ${modeMap[jidx]}. Please try again.`,
      );
      return '';
    }
  };

  const setVersion = async (subid: string) => {
    try {
      if (!ui || ui.subPrompts.length === 0) return;
      const i = ui.subPrompts.findIndex(
        (subPrompts) =>
          subPrompts.findIndex((subPrompt) => subPrompt.SUBId === subid) !== -1,
      );
      const subPrompt = ui?.subPrompts[i];
      if (!subPrompt) return;

      setSelectedVersion({
        prompt: subPrompt[0].subPrompt,
        subid: subid,
        modelId: subPrompt[0].modelId || '',
        createdAt: subPrompt[0].createdAt?.toLocaleString(),
      });

      let preciseCode = subPrompt[0].code;
      if (preciseCode === '') {
        setUiState((preUIState) => ({
          ...preUIState,
          precise: {
            ...preUIState.precise,
            loading: true,
          },
        }));
        preciseCode = (await getCode(subPrompt[0].codeId, i, 0)) || '';
      }
      setUiState({
        precise: {
          loading: false,
          code: preciseCode || '',
        },
        balanced: {
          loading: false,
          code: subPrompt[1]?.code || '',
        },
        creative: {
          loading: false,
          code: subPrompt[2]?.code || '',
        },
      });
      setMode('precise');
      if (preciseCode) {
        setCode(preciseCode);
      }
    } catch (error) {
      console.error('Error in setVersion:', error);
      toast.error('Failed to set version. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUI = async () => {
      try {
        setBackendCheck(0);
        const fetchedUI = await getUI(uiid);

        if (!fetchedUI) {
          console.error('Fetched UI is null or undefined.');
          toast.error('Failed to fetch UI. Redirecting to home page.');
          router.push('/');
          return;
        }

        const subPrompts = fetchedUI.subPrompts || [];

        if (!subPrompts.find((sp) => sp.SUBId.startsWith('a-0'))) {
          const filterfetchedUI = {
            ...fetchedUI,
            subPrompts: [],
          };
          setUi({
            ...filterfetchedUI,
            forkedFrom: filterfetchedUI.forkedFrom || '',
            user: {
              ...filterfetchedUI.user,
              imageUrl: filterfetchedUI.user.imageUrl || '',
            },
          });
          setBackendCheck(1);
          return;
        }

        const subPromptMap: { [key: string]: SubPrompt } = {
          'a-0':
            subPrompts.find((sp) => sp.SUBId.startsWith('a-0')) ||
            ({} as SubPrompt),
          'b-0':
            subPrompts.find((sp) => sp.SUBId.startsWith('b-0')) ||
            ({} as SubPrompt),
          'c-0':
            subPrompts.find((sp) => sp.SUBId.startsWith('c-0')) ||
            ({} as SubPrompt),
        };

        setModesFound((prevmodesFound) => {
          const modesFound = prevmodesFound;
          if (Object.keys(subPromptMap['a-0']).length > 0) {
            modesFound.precise = true;
          }
          if (Object.keys(subPromptMap['b-0']).length > 0) {
            modesFound.balanced = true;
          }
          if (Object.keys(subPromptMap['c-0']).length > 0) {
            modesFound.creative = true;
          }
          return modesFound;
        });

        const groupedSubPrompts = [
          [
            {
              ...subPromptMap['a-0'],
              id: `${subPromptMap['a-0']?.id || 'empty'}-precise`,
              code: '',
            },
            {
              ...subPromptMap['b-0'],
              id: `${subPromptMap['b-0'].id || 'empty'}-balanced`,
              code: '',
            },
            {
              ...subPromptMap['c-0'],
              id: `${subPromptMap['c-0'].id || 'empty'}-creative`,
              code: '',
            },
          ] as {
            id: string;
            UIId: string;
            SUBId: string;
            createdAt: Date;
            subPrompt: string;
            codeId: string;
            modelId?: string;
            code: string;
          }[],
        ];

        const remainingSubPrompts = subPrompts.filter(
          (subPromptObj) =>
            !['a-0', 'b-0', 'c-0'].some((prefix) =>
              subPromptObj.SUBId.startsWith(prefix),
            ),
        );

        const sortedRemainingSubPrompts = remainingSubPrompts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        const combinedSubPrompts = [
          ...groupedSubPrompts,
          ...sortedRemainingSubPrompts.map(
            (subPrompt) =>
              [
                {
                  ...subPrompt,
                  code: '',
                },
              ] as {
                id: string;
                UIId: string;
                SUBId: string;
                createdAt: Date;
                subPrompt: string;
                codeId: string;
                modelId?: string;
                code: string;
              }[],
          ),
        ];

        const filterfetchedUI = {
          ...fetchedUI,
          subPrompts: combinedSubPrompts,
        };
        setUi({
          ...filterfetchedUI,
          forkedFrom: filterfetchedUI.forkedFrom || '',
          user: {
            ...filterfetchedUI.user,
            imageUrl: filterfetchedUI.user.imageUrl || '',
          },
        });
        setBackendCheck(1);
      } catch (error) {
        console.error('Error fetching UI:', error);
        toast.error('Failed to fetch UI. Please try again.');
      }
    };

    fetchUI();
  }, [uiid, router]);

  useEffect(() => {
    const incView = async () => {
      await fetch('/api/view-increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uiid: uiid }),
      });
    };
    incView();
  }, []);

  useEffect(() => {
    if (backendCheck === 0) return;
    if (ui?.subPrompts.length === 0) {
      setSelectedVersion({
        prompt: ui?.prompt || '',
        subid: '0',
        modelId: initialModel,
        createdAt: ui?.createdAt?.toLocaleString(),
      });
    } else {
      const lastGeneratedSubPrompt =
        ui?.subPrompts[ui?.subPrompts.length - 1][0];
      if (lastGeneratedSubPrompt) {
        setVersion(lastGeneratedSubPrompt.SUBId);
      }
    }
    if (input !== '') {
      setPrompt(input);
    }
  }, [backendCheck]);

  useEffect(() => {
    if (input !== '' && prompt !== '') {
      setInput('');
      if (imageBase64 !== '') {
        generateCodeFromScreenshot();
      } else {
        generateCode();
      }
    }
  }, [input, prompt]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !loading) {
        event.preventDefault();
        generateCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!uiState[mode].loading) {
      setCode(uiState[mode].code);
    }
  }, [
    mode,
    uiState,
    uiState.balanced.loading,
    uiState.creative.loading,
    uiState.precise.loading,
  ]);

  const getIdxFromMode = (mode: string) => {
    if (mode === 'precise') {
      return 0;
    }
    if (mode === 'balanced') {
      return 1;
    }
    if (mode === 'creative') {
      return 2;
    }
  };

  useEffect(() => {
    if (['precise', 'balanced', 'creative'].includes(mode)) {
      setCode(uiState[mode].code);
      const idx = getIdxFromMode(mode);
      const selectedSubPrompt = ui?.subPrompts.find(
        (subPrompts) =>
          subPrompts.findIndex(
            (subPrompt) => subPrompt.SUBId === selectedVersion.subid,
          ) !== -1,
      );

      if (
        !selectedSubPrompt ||
        !selectedSubPrompt[0] == null ||
        !selectedSubPrompt[0]?.SUBId
      ) {
        return;
      }

      const index = idx ?? 0;
      setSelectedVersion({
        prompt: selectedSubPrompt[index].subPrompt,
        subid: selectedSubPrompt[index].SUBId,
        modelId: selectedSubPrompt[index].modelId || '',
        createdAt: selectedSubPrompt[index].createdAt?.toLocaleString(),
      });
    }
  }, [mode]);

  const setPanelView = (view: string) => {
    const panel = ref.current;
    if (!panel) return;
    if (view === 'desktop') panel.setLayout([0, 100, 0]);
    else if (view === 'tablet') panel.setLayout([27, 46, 27]);
    else if (view === 'phone') panel.setLayout([38, 24, 38]);
  };

  const generatePreciseCode = async () => {
    try {
      // Debug logging
      console.log('Starting generatePreciseCode with:', {
        prompt,
        uiid,
        initialModel,
        uiType: ui?.uiType,
      });

      setUiState((preuis) => ({
        ...preuis,
        precise: {
          ...preuis.precise,
          loading: true,
        },
      }));

      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeDescription: prompt,
          modelId: initialModel,
          uiType: ui?.uiType,
        }),
      });

      // Debug logging
      console.log('API response status:', res.status);

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const response = await res.json();

      // Debug logging
      console.log('API response:', {
        success: response.success,
        hasCode: !!response.code,
        codeLength: response.code?.length,
      });

      if (!response.success || !response.code) {
        throw new Error(response.error || 'Invalid response from API');
      }

      setUiState((preuis) => ({
        ...preuis,
        precise: {
          code: response.code,
          loading: false,
        },
      }));

      // Validate inputs
      if (!uiid || !prompt || !response.code || !initialModel) {
        const missingParams = {
          uiid: !uiid,
          prompt: !prompt,
          code: !response.code,
          model: !initialModel,
        };
        console.error('Missing parameters:', missingParams);
        throw new Error(
          `Missing required parameters: ${Object.keys(missingParams)
            .filter(Boolean)
            .join(', ')}`,
        );
      }

      const subPromptText = `precise-${prompt}`;
      const parentSUBId = 'a-0';

      // Debug logging
      console.log('Calling createSubPrompt with:', {
        subPromptText,
        uiid,
        parentSUBId,
        codeLength: response.code.length,
        initialModel,
      });

      const result = await createSubPrompt(
        subPromptText,
        uiid,
        parentSUBId,
        response.code,
        initialModel,
      );

      // Debug logging
      console.log('createSubPrompt result:', result);

      if (!result || !result.data || !result.codeData) {
        throw new Error('Invalid response from createSubPrompt');
      }

      return {
        id: result.data.id,
        SUBId: result.data.SUBId,
        subPrompt: result.data.subPrompt,
        code: result.codeData.code,
        codeId: result.data.codeId,
        modelId: result.data.modelId,
      };
    } catch (error) {
      console.error('Error in generatePreciseCode:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate code',
      );
      setUiState((preuis) => ({
        ...preuis,
        precise: {
          ...preuis.precise,
          loading: false,
        },
      }));
      throw error;
    }
  };

  const generateCreativeCode = async () => {
    try {
      setUiState((preuis) => ({
        ...preuis,
        creative: {
          ...preuis.creative,
          loading: true,
        },
      }));

      const description = await fetch('/api/page_description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeCommand: prompt,
          type: 'creative',
          modelId: descriptiveModel,
        }),
      });

      if (!description.ok) {
        throw new Error('Failed to generate page description');
      }

      const pageDescription = await description.json();
      const codeDescription = `${prompt}
			 -----
			 Focus on features like
			 ${pageDescription}
			`;

      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeDescription,
          modelId: initialModel,
          uiType: ui?.uiType,
        }),
      });

      const response = await res.json();

      if (!res.ok || response.error) {
        throw new Error(response.details || 'Failed to generate creative code');
      }

      if (!response.code || typeof response.code !== 'string') {
        throw new Error('Invalid response format from code generation');
      }

      setUiState((preuis) => ({
        ...preuis,
        creative: {
          code: response.code,
          loading: false,
        },
      }));

      const subPrompt = `creative-${prompt}`;
      const parentSUBId = 'c-0';

      try {
        const data = await createSubPrompt(
          subPrompt,
          uiid,
          parentSUBId,
          response.code,
          initialModel,
        );

        if (!data || !data.data || !data.codeData) {
          throw new Error('Failed to create subprompt');
        }

        return {
          id: data.data.id,
          SUBId: data.data.SUBId,
          subPrompt: data.data.subPrompt,
          code: data.codeData.code,
          codeId: data.data.codeId,
          modelId: data.data.modelId,
        };
      } catch (subPromptError) {
        console.error('Error creating subprompt:', subPromptError);
        toast.error('Failed to save generated code. Please try again.');
        throw subPromptError;
      }
    } catch (error) {
      console.error('Error generating creative code:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate creative code',
      );
      setUiState((preuis) => ({
        ...preuis,
        creative: {
          ...preuis.creative,
          loading: false,
        },
      }));
      throw error;
    }
  };

  const generateBalancedCode = async () => {
    try {
      setUiState((preuis) => ({
        ...preuis,
        balanced: {
          ...preuis.balanced,
          loading: true,
        },
      }));

      const description = await fetch('/api/page_description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeCommand: prompt,
          type: 'balanced',
          modelId: descriptiveModel,
        }),
      });

      if (!description.ok) {
        throw new Error('Failed to generate page description');
      }

      const pageDescription = await description.json();
      const codeDescription = `${prompt}
			 -----
			 Focus on features like
			 ${pageDescription}
			`;

      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeDescription,
          modelId: initialModel,
          uiType: ui?.uiType,
        }),
      });

      const response = await res.json();

      if (!res.ok || response.error) {
        throw new Error(response.details || 'Failed to generate balanced code');
      }

      if (!response.code || typeof response.code !== 'string') {
        throw new Error('Invalid response format from code generation');
      }

      setUiState((preuis) => ({
        ...preuis,
        balanced: {
          code: response.code,
          loading: false,
        },
      }));

      const subPrompt = `balanced-${prompt}`;
      const parentSUBId = 'b-0';

      try {
        const data = await createSubPrompt(
          subPrompt,
          uiid,
          parentSUBId,
          response.code,
          initialModel,
        );

        if (!data || !data.data || !data.codeData) {
          throw new Error('Failed to create subprompt');
        }

        return {
          id: data.data.id,
          SUBId: data.data.SUBId,
          subPrompt: data.data.subPrompt,
          code: data.codeData.code,
          codeId: data.data.codeId,
          modelId: data.data.modelId,
        };
      } catch (subPromptError) {
        console.error('Error creating subprompt:', subPromptError);
        toast.error('Failed to save generated code. Please try again.');
        throw subPromptError;
      }
    } catch (error) {
      console.error('Error generating balanced code:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate balanced code',
      );
      setUiState((preuis) => ({
        ...preuis,
        balanced: {
          ...preuis.balanced,
          loading: false,
        },
      }));
      throw error;
    }
  };

  const generateModifiedCode = async () => {
    try {
      setUiState((preuis) => ({
        ...preuis,
        precise: {
          ...preuis.precise,
          loading: true,
        },
      }));

      const res = await fetch('/api/modifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modifyDescription: prompt,
          precode: uiState[mode]?.code,
          modelId: modifierModel,
          uiType: ui?.uiType,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate modified code');
      }

      const response = await res.json();

      if (response === 'Error') {
        setUiState((preuis) => ({
          ...preuis,
          precise: {
            code: 'Error',
            loading: false,
          },
        }));
        toast.error('Error modifying code');
        router.push('/');
        return;
      }

      setUiState((preuis) => ({
        ...preuis,
        precise: {
          code: response,
          loading: false,
        },
      }));

      const subPrompt = prompt;
      const data = await createSubPrompt(
        subPrompt,
        uiid,
        selectedVersion.subid,
        response,
        modifierModel,
      );

      return {
        id: data.data.id,
        SUBId: data.data.SUBId,
        subPrompt: data.data.subPrompt,
        code: data.codeData.code,
        codeId: data.data.codeId,
        modelId: data.data.modelId,
      };
    } catch (error) {
      console.error('Error generating modified code:', error);
      toast.error(
        'Failed to generate modified code. Please try again with another model.',
      );
      setUiState((preuis) => ({
        ...preuis,
        precise: {
          ...preuis.precise,
          loading: false,
        },
      }));
      throw error; // Re-throw the error to be caught by the caller
    }
  };

  const reGenerateModifiedCode = async () => {
    try {
      if (!selectedVersion.subid) return;

      const parent = isParent(selectedVersion.subid, ui?.subPrompts);
      if (parent) {
        toast.error('Cannot regenerate parent subprompt');
        return;
      }

      setUiState((preuis) => ({
        ...preuis,
        precise: {
          ...preuis.precise,
          loading: true,
        },
      }));

      const res = await fetch('/api/modifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modifyDescription: selectedVersion.prompt,
          precode: uiState[mode]?.code,
          modelId: modifierModel,
          uiType: ui?.uiType,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to regenerate modified code');
      }

      const response = await res.json();

      if (response === 'Error') {
        setUiState((preuis) => ({
          ...preuis,
          precise: {
            code: 'Error',
            loading: false,
          },
        }));
        toast.error('Error modifying code');
        router.push('/');
        return;
      }

      setUiState((preuis) => ({
        ...preuis,
        precise: {
          code: response,
          loading: false,
        },
      }));

      const data = await updateSubPrompt(
        uiid,
        response,
        modifierModel,
        selectedVersion.subid,
      );

      if (!data) {
        toast.error('Error regenerating modified code');
        return;
      }

      return {
        id: data.data.id,
        SUBId: data.data.SUBId,
        subPrompt: data.data.subPrompt,
        code: data.codeData.code,
        codeId: data.data.codeId,
        modelId: data.data.modelId,
      };
    } catch (error) {
      console.error('Error regenerating modified code:', error);
      toast.error('Failed to regenerate modified code. Please try again.');
      setUiState((preuis) => ({
        ...preuis,
        precise: {
          ...preuis.precise,
          loading: false,
        },
      }));
      throw error;
    }
  };

  const generateScreenCode = async () => {
    try {
      setUiState((preuis) => ({
        ...preuis,
        precise: {
          ...preuis.precise,
          loading: true,
        },
      }));

      toast.success(
        'Generating code from screenshot. This may take a few seconds.',
      );

      const propertiesResponse = await fetch('/api/element-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refine: false,
          imageBase64: imageBase64,
          imageModelId: imageModel,
        }),
      });

      if (!propertiesResponse.ok) {
        throw new Error('Failed to generate properties from screenshot');
      }

      toast.success('Properties generated from screenshot.');

      const properties = await propertiesResponse.json();

      const res = await fetch('/api/generate-code-from-screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          imageBase64: imageBase64,
          properties: properties,
          modelId: initialModel,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate code from screenshot');
      }

      const response = await res.json();

      setUiState((preuis) => ({
        ...preuis,
        precise: {
          code: response,
          loading: false,
        },
      }));

      const subPrompt = `precise-${prompt}`;
      const parentSUBId = 'a-0';
      const data = await createSubPrompt(
        subPrompt,
        uiid,
        parentSUBId,
        response,
        `${imageModel}|${initialModel}`,
      );

      return {
        id: data.data.id,
        SUBId: data.data.SUBId,
        subPrompt: data.data.subPrompt,
        code: data.codeData.code,
        codeId: data.data.codeId,
        modelId: data.data.modelId,
      };
    } catch (error) {
      console.error('Error generating code from screenshot:', error);
      toast.error(
        'Failed to generate code from screenshot. Please try again with another model.',
      );
      setUiState((preuis) => ({
        ...preuis,
        precise: {
          ...preuis.precise,
          loading: false,
        },
      }));
      throw error;
    }
  };

  const generateCodeFromScreenshot = async () => {
    if (status !== 'authenticated') return;
    if (ui?.userId !== userId) return;
    if (prompt === '') return;
    setLoading(true);

    let promises: Promise<
      | {
          id: string;
          SUBId: string;
          subPrompt: string;
          code: string;
          codeId: string;
        }
      | undefined
    >[];

    const previousSubId = selectedVersion.subid;

    if (!isModelSupported(imageModel)) {
      toast.error('ImageModel not supported! Choose another model');
      router.push('/settings/llm');
      return;
    }

    promises = [generateScreenCode()];

    try {
      const resolved = await Promise.allSettled(promises);

      const successfulResults = resolved
        .filter(
          (
            result,
          ): result is PromiseFulfilledResult<
            | {
                id: string;
                SUBId: string;
                subPrompt: string;
                code: string;
                codeId: string;
                modelId?: string;
              }
            | undefined
          > => result.status === 'fulfilled' && result.value !== undefined,
        )
        .map((result) => result.value);

      if (successfulResults.length === 0) {
        throw new Error('All code generation attempts failed');
      }

      setUi((prevUi) => {
        if (prevUi) {
          const updatedSubPrompts = [...prevUi.subPrompts];

          // TODO when it is image generation handle this in a better way
          updatedSubPrompts.push([
            {
              id: successfulResults[0]?.id || '',
              UIId: uiid,
              SUBId: successfulResults[0]?.SUBId || '',
              createdAt: new Date(),
              subPrompt: successfulResults[0]?.subPrompt || '',
              codeId: successfulResults[0]?.codeId || '',
              modelId: successfulResults[0]?.modelId || '',
              code: successfulResults[0]?.code || '',
            },
            {
              id: '',
              UIId: uiid,
              SUBId: 'b-0',
              createdAt: new Date(),
              subPrompt: '',
              codeId: '',
              modelId: '',
              code: '',
            },
            {
              id: '',
              UIId: uiid,
              SUBId: 'c-0',
              createdAt: new Date(),
              subPrompt: '',
              codeId: '',
              modelId: '',
              code: '',
            },
          ]);
          setMode('precise');

          return {
            ...prevUi,
            subPrompts: updatedSubPrompts,
          };
        }
        return prevUi;
      });
      setPrompt('');
      setSelectedVersion({
        prompt: prompt,
        subid: successfulResults[0]?.SUBId || '',
        modelId: successfulResults[0]?.modelId || '',
        createdAt: selectedVersion.createdAt,
      });
      setLoading(false);
      setImageBase64('');
      capture();
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error(
        'Failed to generate code. Please try again with another model.',
      );
      setLoading(false);
      setVersion(previousSubId);
    }
  };

  const generateCode = async () => {
    if (status !== 'authenticated') return;
    if (ui?.userId !== userId) return;
    if (prompt === '') return;
    setLoading(true);

    let promises: Promise<
      | {
          id: string;
          SUBId: string;
          subPrompt: string;
          code: string;
          codeId: string;
        }
      | undefined
    >[] = [];

    const previousSubId = selectedVersion.subid;

    if (ui?.subPrompts.length === 0) {
      if (!isModelSupported(initialModel)) {
        toast.error('InitialModel not supported! Choose another model');
        router.push('/settings/llm');
        return;
      }
      if (!isModelSupported(descriptiveModel)) {
        toast.error('DescriptiveModel not supported! Choose another model');
        router.push('/settings/llm');
        return;
      }

      const modes = {
        precise: false,
        balanced: false,
        creative: false,
      };

      if (preciseMode) {
        promises.push(generatePreciseCode());
        modes.precise = true;
      }
      if (balancedMode) {
        promises.push(generateBalancedCode());
        modes.balanced = true;
      }
      if (creativeMode) {
        promises.push(generateCreativeCode());
        modes.creative = true;
      }

      setModesFound(modes);
    } else {
      if (!isModelSupported(modifierModel)) {
        toast.error('ModifierModel not supported! Choose another model');
        router.push('/settings/llm');
        return;
      }
      setSelectedVersion({
        prompt: prompt,
        subid: '1',
        modelId: modifierModel,
        createdAt: new Date().toLocaleString(),
      });
      promises = [generateModifiedCode()];
    }

    try {
      const resolved = await Promise.allSettled(promises);

      const successfulResults = resolved
        .filter(
          (
            result,
          ): result is PromiseFulfilledResult<
            | {
                id: string;
                SUBId: string;
                subPrompt: string;
                code: string;
                codeId: string;
                modelId?: string;
              }
            | undefined
          > => result.status === 'fulfilled' && result.value !== undefined,
        )
        .map((result) => result.value);

      if (successfulResults.length === 0) {
        if (ui?.subPrompts.length === 0) {
          toast.error(
            'All code generation attempts failed. Please try again with another model.',
          );
          if (userId) {
            await deleteUI(uiid, userId);
            router.push('/');
          }
        }
        throw new Error('All code generation attempts failed');
      }

      setUi((prevUi) => {
        if (prevUi) {
          const updatedSubPrompts = [...prevUi.subPrompts];

          if (ui?.subPrompts.length === 0) {
            updatedSubPrompts.push(
              successfulResults.map((result) => ({
                id: result?.id || '',
                UIId: uiid,
                SUBId: result?.SUBId || '',
                createdAt: new Date(),
                subPrompt: result?.subPrompt || '',
                codeId: result?.codeId || '',
                modelId: result?.modelId || '',
                code: result?.code || '',
              })),
            );
          } else {
            updatedSubPrompts.push([
              {
                id: successfulResults[0]?.id || '',
                UIId: uiid,
                SUBId: successfulResults[0]?.SUBId || '',
                createdAt: new Date(),
                subPrompt: successfulResults[0]?.subPrompt || '',
                codeId: successfulResults[0]?.codeId || '',
                modelId: successfulResults[0]?.modelId || '',
                code: successfulResults[0]?.code || '',
              },
            ]);
            setMode('precise');
          }

          return {
            ...prevUi,
            subPrompts: updatedSubPrompts,
          };
        }
        return prevUi;
      });
      setPrompt('');
      setSelectedVersion({
        prompt: prompt,
        subid: successfulResults[0]?.SUBId || '',
        modelId: successfulResults[0]?.modelId || '',
        createdAt: selectedVersion.createdAt,
      });
      setLoading(false);
      capture();
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error(
        'Failed to generate code. Please try again with another model.',
      );
      setLoading(false);
      setVersion(previousSubId);
    }
  };

  const regenerateCode = async () => {
    if (userId !== ui?.userId) {
      toast.warning('Fork the UI to modify the code');
      return;
    }
    if (loading) return;
    if (!isModelSupported(modifierModel)) {
      toast.error('ModifierModel not supported! Choose another model');
      router.push('/settings/llm');
      return;
    }
    setLoading(true);
    const previousSubId = selectedVersion.subid;
    try {
      const result = await reGenerateModifiedCode();
      if (result) {
        setUi((prevUi) => {
          if (prevUi) {
            const updatedSubPrompts = prevUi.subPrompts.map((subPromptArray) =>
              subPromptArray.map((subPrompt) =>
                subPrompt.SUBId === result.SUBId
                  ? {
                      ...subPrompt,
                      code: result.code,
                    }
                  : subPrompt,
              ),
            );

            return {
              ...prevUi,
              subPrompts: updatedSubPrompts,
            };
          }
          return prevUi;
        });
        setSelectedVersion({
          prompt: result.subPrompt || '',
          subid: result.SUBId || '',
          modelId: result.modelId || '',
          createdAt: new Date().toLocaleString(),
        });
        setCode(result.code);
        capture();
      }
    } catch (error) {
      console.error('Error regenerating code:', error);
      toast.error('Failed to regenerate code. Please try again.');
      setVersion(previousSubId);
    } finally {
      setLoading(false);
    }
  };

  const capture = async () => {
    try {
      const captureDiv = document.getElementById('captureDiv');
      if (!captureDiv) return;
      const canvas = await html2canvas(captureDiv, {
        scrollY: -window.scrollY,
        useCORS: true,
      });
      const dataUrl2 = canvas.toDataURL('image/jpeg');

      const img = new Image();
      img.src = dataUrl2;

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 1200;
        const scaleFactor = width / img.width;
        const height = img.height * scaleFactor;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const resizedDataURL = canvas.toDataURL('image/jpeg');

        await updateUI(uiid, { img: resizedDataURL });
      };

      img.onerror = (error) => {
        console.error('Error loading the image:', error);
        toast.error('Failed to load image. Please try again.');
      };
    } catch (error) {
      console.error('Error during capture:', error);
      toast.error('Failed to capture UI. Please try again.');
    }
  };

  console.info(ui);

  return (
    <div className="overflow-hidden h-screen">
      <UIHeader
        loading={loading}
        mainPrompt={ui?.prompt || ''}
        uiId={uiid}
        forkedFrom={ui?.forkedFrom ?? ''}
      />
      <div className="flex flex-1 flex-row gap-3 bg-white border-t lg:border-t-0 p-4 pb-2 pt-3 lg:pt-0">
        <Sidebar
          subid={selectedVersion.subid}
          setVersion={setVersion}
          subPrompts={ui?.subPrompts}
        />
        <div className="flex-1">
          <Card className="flex flex-col bg-secondary">
            <div className="flex justify-between items-center">
              <UIRigthHeader
                modelId={selectedVersion.modelId}
                createdAt={selectedVersion.createdAt}
                UIId={uiid}
                uiType={ui?.uiType || 'shadcn-react'}
                views={ui?.viewCount || 0}
                subid={selectedVersion.subid}
                userimg={ui?.user?.imageUrl || ''}
                subPrompt={selectedVersion.prompt}
                setPanelView={setPanelView}
                uiState={uiState}
                setMode={setMode}
                mode={mode}
                code={code}
                modesFound={modesFound}
                regenerateCode={regenerateCode}
                isLastSubprompt={
                  !!(
                    (
                      selectedVersion?.subid &&
                      !selectedVersion.subid.endsWith('0')
                    )
                    // && selectedVersion.subid === ui?.subPrompts[ui.subPrompts.length - 1][0].SUBId
                  )
                }
              />
            </div>
            <UIBody
              isloading={uiState[mode || 'precise'].loading}
              code={code}
              uiType={ui?.uiType || 'shadcn-react'}
              ref={ref}
              captureRef={captureRef}
            />
          </Card>
          {status === 'authenticated' && ui?.userId === userId && (
            <form
              className="flex w-full max-w-lg m-auto mt-2 relative"
              onSubmit={async (e) => {
                e.preventDefault();
                if (loading) return;
                await generateCode();
              }}
            >
              <Input
                disabled={loading}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                type="text"
                placeholder="Make my ui more beautiful..."
                className="w-full pr-12 px-3 py-2 text-sm
                  text-foreground placeholder:text-muted-foreground
                  bg-background/50
                  border border-input hover:border-ring
                  rounded-md transition-colors duration-200"
                autoComplete="off"
                spellCheck={false}
              />
              <Button
                className="absolute right-0 top-0"
                disabled={loading}
                variant="ghost"
                size="icon"
                type="submit"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UI;
