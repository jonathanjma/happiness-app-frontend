import React from "react";

export default function ToastMessage({ message }: { message: string }) {
  return (
    <div className="flex w-[400px] justify-center rounded-lg bg-light_yellow p-4">
      <p className="p-0 font-semibold text-secondary">{message}</p>
    </div>
  );
}
