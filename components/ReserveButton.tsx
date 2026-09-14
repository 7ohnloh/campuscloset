"use client";

import { useState } from "react";

export function ReserveButton({ sellerName, meetup }: { sellerName: string; meetup: string }) {
  const [reserved, setReserved] = useState(false);
  return (
    <div className="flex-1">
      <button
        type="button"
        onClick={() => setReserved(true)}
        disabled={reserved}
        className="w-full rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:bg-muted"
      >
        {reserved ? "Reserved (simulated)" : "Reserve & arrange meetup"}
      </button>
      {reserved && (
        <p className="mt-2 text-xs text-muted" role="status">
          Demo only: nothing was sent or charged. In a real app, {sellerName} would get a request to meet at {meetup}.
        </p>
      )}
    </div>
  );
}
