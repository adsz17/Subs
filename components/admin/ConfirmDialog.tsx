"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        <p className="mb-4 text-sm text-gray-600">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md border px-3 py-1 text-sm">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
