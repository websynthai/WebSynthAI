'use client';

import { type LegacyRef, forwardRef } from 'react';
import type { ImperativePanelGroupHandle } from 'react-resizable-panels';
import PreviewScreen from './preview-screen';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './ui/resizable';

const UIBody = forwardRef(
  (
    props: {
      isloading: boolean;
      code: string;
      uiType: string;
      captureRef: LegacyRef<HTMLDivElement>;
    },
    ref: LegacyRef<ImperativePanelGroupHandle>,
  ) => {
    return (
      <div className="flex flex-1">
        <ResizablePanelGroup
          className="bg-white rounded-b-xl"
          ref={ref}
          direction="horizontal"
        >
          <ResizablePanel defaultSize={20} minSize={0} order={1} />
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={60}
            minSize={40}
            className="bg-secondary relative"
            order={2}
          >
            {props.isloading && (
              <div className="absolute z-10 opacity-20 w-full h-[75vh] gradient-animation shadow-lg" />
            )}
            <div
              id="captureDiv"
              ref={props.captureRef}
              className={`max-h-[75vh] h-[75vh] ${
                props.isloading ? 'overflow-y-hidden' : 'overflow-y-auto'
              }`}
            >
              <PreviewScreen html_code={props.code} uiType={props.uiType} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={0} order={3} />
        </ResizablePanelGroup>
      </div>
    );
  },
);

UIBody.displayName = 'UIBody';

export default UIBody;
