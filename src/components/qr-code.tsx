"use client";

import { QRCodeSVG } from "qrcode.react";

export function QrCode({ value, size = 220 }: { value: string; size?: number }) {
  return (
    <div className="inline-block rounded-lg bg-white p-3 shadow-sm">
      <QRCodeSVG value={value} size={size} />
    </div>
  );
}
