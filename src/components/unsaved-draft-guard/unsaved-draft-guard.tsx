import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { UnsavedDraftLeaveModal } from './unsaved-draft-leave-modal.component';

export type UnsavedDraftController = {
  itemLabel: string;
  hasUnsavedDraft: () => boolean;
  discardUnsavedDraft: () => void;
};

type UnsavedDraftContextValue = {
  register: (controller: UnsavedDraftController | null) => void;
  requestLeave: (proceed: () => void) => void;
};

const UnsavedDraftContext = createContext<UnsavedDraftContextValue | null>(null);

export function UnsavedDraftProvider({ children }: { children: ReactNode }) {
  const controllerRef = useRef<UnsavedDraftController | null>(null);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);
  const [itemLabel, setItemLabel] = useState('informação');

  const register = useCallback((controller: UnsavedDraftController | null) => {
    controllerRef.current = controller;
  }, []);

  const requestLeave = useCallback((proceed: () => void) => {
    const controller = controllerRef.current;
    if (controller?.hasUnsavedDraft()) {
      setItemLabel(controller.itemLabel);
      setPendingLeave(() => proceed);
      return;
    }
    controller?.discardUnsavedDraft();
    proceed();
  }, []);

  const confirmLeave = useCallback(() => {
    controllerRef.current?.discardUnsavedDraft();
    const proceed = pendingLeave;
    setPendingLeave(null);
    proceed?.();
  }, [pendingLeave]);

  const cancelLeave = useCallback(() => {
    setPendingLeave(null);
  }, []);

  const value = useMemo(
    () => ({ register, requestLeave }),
    [register, requestLeave],
  );

  return (
    <UnsavedDraftContext.Provider value={value}>
      {children}
      <UnsavedDraftLeaveModal
        itemLabel={itemLabel}
        onCancel={cancelLeave}
        onConfirm={confirmLeave}
        visible={pendingLeave != null}
      />
    </UnsavedDraftContext.Provider>
  );
}

export function useRegisterUnsavedDraft(controller: UnsavedDraftController) {
  const context = useContext(UnsavedDraftContext);
  const controllerRef = useRef(controller);
  controllerRef.current = controller;

  useEffect(() => {
    if (!context) {
      return;
    }
    context.register({
      get itemLabel() {
        return controllerRef.current.itemLabel;
      },
      hasUnsavedDraft: () => controllerRef.current.hasUnsavedDraft(),
      discardUnsavedDraft: () => controllerRef.current.discardUnsavedDraft(),
    });
    return () => context.register(null);
  }, [context]);
}

export function useUnsavedDraftLeave() {
  const context = useContext(UnsavedDraftContext);
  return context?.requestLeave ?? ((proceed: () => void) => proceed());
}
