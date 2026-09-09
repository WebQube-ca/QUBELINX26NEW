"use client";

import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, QrCode, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { displayUrl, publicUrl } from "@/lib/urls";

export function ShareQrDialog({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const url = publicUrl(username);
  const pretty = displayUrl(username);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({
        title: "My QubeLinx",
        text: "Check out my QubeLinx",
        url,
      });
    } else {
      await copy();
    }
  }

  function downloadQr() {
    const svg = document.getElementById("qlx-qr");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `qubelinx-${username}.svg`;
    a.click();
    URL.revokeObjectURL(href);
    toast.success("QR code downloaded");
  }

  return (
    <Dialog>
      <DialogTrigger
        className="inline-flex h-8 w-full items-center justify-start gap-2 rounded-xl border border-border bg-background px-3 text-sm hover:bg-muted"
      >
        <QrCode className="h-4 w-4" />
        Share & QR
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your QubeLinx</DialogTitle>
          <DialogDescription>
            Copy your link, share natively, or download a QR code.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border">
            <QRCodeSVG id="qlx-qr" value={url} size={180} level="M" />
          </div>
          <div className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-center text-sm">
            {pretty}
          </div>
          <div className="grid w-full grid-cols-3 gap-2">
            <Button variant="outline" className="rounded-xl" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={nativeShare}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={downloadQr}>
              <QrCode className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
