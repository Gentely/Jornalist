"use client";

/**
 * ============================================================================
 *  CRITICAL COMPONENT — Hidden Bank Details
 *  Bank account / IBAN numbers exist ONLY inside this file and render ONLY
 *  inside this Dialog. They are never printed on any page directly.
 * ============================================================================
 */

import * as React from "react";
import { Check, Copy, Landmark, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ⛔ Private to this dialog — do not export, do not reuse elsewhere.
const ACCOUNT_HOLDER = "محمد احمد محمد";
const ACCOUNT_NUMBER = "033201000192652";
const IBAN = "LY78002033033201000192652";
const BANK_LINE = "مصرف الجمهورية - المدينة - صبراتة";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = value; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); return true; } catch { return false; }
    finally { document.body.removeChild(ta); }
  }
}

function CopyIconButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button" aria-label={label} title={label}
      onClick={async () => { if (await copyText(value)) { setCopied(true); setTimeout(() => setCopied(false), 1800); } }}
      className={cn("shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg border transition", copied ? "bg-green-600 border-green-600 text-white" : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50")}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function CopyFooterButton({ value, children }: { value: string; children: React.ReactNode }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button type="button" variant={copied ? "whatsapp" : "outline"} size="sm"
      onClick={async () => { if (await copyText(value)) { setCopied(true); setTimeout(() => setCopied(false), 1800); } }}>
      {copied ? <Check /> : <Copy />} {copied ? "تم النسخ ✓" : children}
    </Button>
  );
}

function BankRow({ label, value, copyLabel, dirLtr = false }: { label: string; value: string; copyLabel: string; dirLtr?: boolean }) {
  return (
    <div className="rounded-xl bg-white/80 border border-blue-100 px-4 py-3">
      <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
      <div className="flex items-center justify-between gap-3">
        <p dir={dirLtr ? "ltr" : undefined} className={cn("font-black text-navy-900 break-all text-[15px] sm:text-base", dirLtr && "text-left tracking-wide font-mono")}>{value}</p>
        <CopyIconButton value={value} label={copyLabel} />
      </div>
    </div>
  );
}

export default function BankAccountDialog({
  className, size = "default",
}: { className?: string; size?: "default" | "sm" | "lg" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Exact trigger required by spec — no bank data on the page itself */}
        <Button type="button" variant="outline" size={size} className={className}>
          <Landmark /> حساب الدفع
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        {/* Light-blue panel (#EFF6FF) matching the supplied design */}
        <div className="bg-[#EFF6FF] p-6 sm:p-7">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-soft"><Landmark className="h-5 w-5" /></span>
              <div>
                <DialogTitle>بيانات الحساب</DialogTitle>
                <DialogDescription className="mt-1">حوّل مبلغ طلبك ثم ارفع صورة إيصال التحويل</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-white/80 border border-blue-100 px-4 py-3">
              <p className="text-xs font-bold text-slate-500 mb-1">اسم صاحب الحساب</p>
              <p className="font-black text-navy-900 text-[15px] sm:text-base">{ACCOUNT_HOLDER}</p>
            </div>

            <BankRow label="رقم الحساب" value={ACCOUNT_NUMBER} copyLabel="نسخ رقم الحساب" dirLtr />
            <BankRow label="رقم الايبان" value={IBAN} copyLabel="نسخ الايبان" dirLtr />
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-blue-900/80">
            <ShieldCheck className="h-4 w-4 mt-1 shrink-0" />
            تأكد من نسخ الرقم كما هو دون مسافات، ثم أرسل الإيصال من صفحة إتمام الطلب ليتم اعتماد طلبك وفتح التحميل.
          </p>
        </div>

        <div className="p-5 sm:px-7 bg-white">
          <p className="text-sm font-bold text-navy-900 mb-4">المصرف: <span className="font-black">{BANK_LINE}</span></p>
          <DialogFooter className="sm:justify-start flex-wrap">
            <CopyFooterButton value={ACCOUNT_NUMBER}>نسخ رقم الحساب</CopyFooterButton>
            <CopyFooterButton value={IBAN}>نسخ الايبان</CopyFooterButton>
            <DialogClose asChild>
              <Button type="button" size="sm" className="sm:me-auto">تم</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
