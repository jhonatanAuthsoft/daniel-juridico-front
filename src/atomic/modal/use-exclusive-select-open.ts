import { useCallback, useEffect, useId, useState } from 'react';

type Listener = (activeId: string | null) => void;

let activeSelectModalId: string | null = null;
const listeners = new Set<Listener>();

function publish(nextId: string | null) {
  activeSelectModalId = nextId;
  for (const listener of listeners) {
    listener(nextId);
  }
}

/**
 * Ensures only one select / multi-select sheet is open at a time.
 * Opening another instance closes the previous one.
 */
export function useExclusiveSelectOpen() {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const listener: Listener = (nextId) => {
      if (nextId !== id) {
        setIsOpen(false);
      }
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (activeSelectModalId === id) {
        publish(null);
      }
    };
  }, [id]);

  const requestOpen = useCallback(() => {
    publish(id);
    setIsOpen(true);
  }, [id]);

  const requestClose = useCallback(() => {
    setIsOpen(false);
    if (activeSelectModalId === id) {
      publish(null);
    }
  }, [id]);

  return { isOpen, requestOpen, requestClose };
}

/** Closes whichever select sheet is currently open (e.g. before showing help). */
export function closeAnySelectModal() {
  if (activeSelectModalId != null) {
    publish(null);
  }
}
