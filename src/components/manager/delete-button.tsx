"use client";

export function DeleteButton({
  action,
  label = "Löschen",
  confirmText = "Wirklich löschen?",
}: {
  action: () => void;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(confirmText)) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm text-red-400 hover:underline">
        {label}
      </button>
    </form>
  );
}
