"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalType = "alert" | "confirm";

type ModalState = {
  open: boolean;
  type?: ModalType;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type ModalContextType = {
  showAlert: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string, title?: string, opts?: { confirmLabel?: string; cancelLabel?: string }) => Promise<boolean>;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>({ open: false });
  const resolverRef = useRef<((value?: any) => void) | null>(null);

  const hideModal = useCallback(() => {
    setState({ open: false });
    if (resolverRef.current) {
      // For alerts, resolve with undefined; for confirm, resolve false if not already resolved
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, []);

  const showAlert = useCallback((message: string, title?: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      resolverRef.current = (v?: any) => {
        resolverRef.current = null;
        resolve();
      };
      setState({
        open: true,
        type: "alert",
        title: title ?? "Notice",
        message,
        confirmLabel: "OK",
      });
    });
  }, []);

  const showConfirm = useCallback((message: string, title?: string, opts?: { confirmLabel?: string; cancelLabel?: string }): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = (value?: any) => {
        resolverRef.current = null;
        resolve(Boolean(value));
      };
      setState({
        open: true,
        type: "confirm",
        title: title ?? "Confirm",
        message,
        confirmLabel: opts?.confirmLabel ?? "Yes",
        cancelLabel: opts?.cancelLabel ?? "Cancel",
      });
    });
  }, []);

  // Handlers for buttons
  const onConfirm = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  }, []);

  const onCancel = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, []);

  const value = useMemo(() => ({ showAlert, showConfirm, hideModal }), [showAlert, showConfirm, hideModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {typeof window !== "undefined" && state.open && (
        <ModalPortal
          {...state}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </ModalContext.Provider>
  );
}

/* ---------- Modal UI (keeps Tailwind look & accessible) ---------- */

function ModalPortal({
  open,
  type,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ModalState & { onConfirm: () => void; onCancel: () => void }) {
  // Basic focus handling: focus confirm button when opened
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (open) {
      const prevActive = document.activeElement as HTMLElement | null;
      const timer = setTimeout(() => confirmRef.current?.focus(), 10);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onCancel();
        }
        if (e.key === "Enter" && type === "alert") {
          onConfirm();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", onKey);
        prevActive?.focus();
      };
    }
    return;
  }, [open, onCancel, onConfirm, type]);

  // small click-outside handler
  const backdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // For alerts, confirm on outside click; for confirm, treat as cancel
      if (type === "alert") onConfirm();
      else onCancel();
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-hidden={!open}
      onMouseDown={backdropClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 z-10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 id="modal-title" className="text-lg font-semibold mb-2">
          {title}
        </h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">
          {message}
        </div>

        <div className="flex justify-end gap-3">
          {type === "confirm" && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:opacity-90 transition"
            >
              {cancelLabel}
            </button>
          )}

          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] text-white font-semibold hover:opacity-95 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
