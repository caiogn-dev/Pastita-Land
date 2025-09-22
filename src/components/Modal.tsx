// src/components/Modal.tsx
"use client";
import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-zinc-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
          >
            Fechar
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}