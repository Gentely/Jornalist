import { SITE } from "@/lib/constants";

// Floating WhatsApp on ALL pages — bottom-LEFT as requested
export default function WhatsAppFloat() {
  return (
    <a
      href={`${SITE.whatsappUrl}?text=${encodeURIComponent("مرحباً منصة Journalist، أريد الاستفسار عن بحث علمي")}`}
      target="_blank" rel="noreferrer" aria-label="تواصل واتساب 00218918199601"
      className="fixed bottom-5 left-5 z-50 group flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-4 pr-3 py-3 shadow-[0_12px_32px_-8px_rgba(37,211,102,.7)] hover:bg-[#128C7E] transition-all hover:scale-[1.03]"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden><path d="M16 .5C7.6.5.7 7.3.7 15.8c0 2.9.8 5.7 2.3 8.1L.6 31.5l7.8-2.3a15.2 15.2 0 0 0 7.6 1.9c8.5 0 15.3-6.8 15.3-15.3C31.3 7.3 24.5.5 16 .5Zm8.9 22.2c-.4 1.1-2.3 2.1-3.2 2.2-.8.1-1.9.4-6.3-1.3-5.3-2.1-8.7-7.6-9-8-.2-.3-2.1-2.8-2.1-5.4 0-2.5 1.3-3.8 1.8-4.3.5-.5 1.1-.6 1.4-.6h1c.3 0 .8-.1 1.2 1 .4 1.1 1.5 3.6 1.6 3.9.1.3.2.6 0 1-.6 1.4-1.3 1.7-1 2.4.8 1.6 3.4 3.2 4.5 3.4.6.1.9-.2 1.2-.7l1-1.4c.3-.5.7-.4 1.1-.3l3.9 1.9c.5.2.8.4.9.6 0 .2 0 .9-.4 1.5Z"/></svg>
      <span className="hidden sm:block text-sm font-black leading-tight">واتساب<br /><span dir="ltr" className="text-[11px] font-bold opacity-95">{SITE.whatsappDisplay}</span></span>
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse border-2 border-white" />
    </a>
  );
}
export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <svg viewBox="0 0 32 32" className={`${className} fill-current`} aria-hidden><path d="M16 .5C7.6.5.7 7.3.7 15.8c0 2.9.8 5.7 2.3 8.1L.6 31.5l7.8-2.3a15.2 15.2 0 0 0 7.6 1.9c8.5 0 15.3-6.8 15.3-15.3C31.3 7.3 24.5.5 16 .5Zm8.9 22.2c-.4 1.1-2.3 2.1-3.2 2.2-.8.1-1.9.4-6.3-1.3-5.3-2.1-8.7-7.6-9-8-.2-.3-2.1-2.8-2.1-5.4 0-2.5 1.3-3.8 1.8-4.3.5-.5 1.1-.6 1.4-.6h1c.3 0 .8-.1 1.2 1 .4 1.1 1.5 3.6 1.6 3.9.1.3.2.6 0 1-.6 1.4-1.3 1.7-1 2.4.8 1.6 3.4 3.2 4.5 3.4.6.1.9-.2 1.2-.7l1-1.4c.3-.5.7-.4 1.1-.3l3.9 1.9c.5.2.8.4.9.6 0 .2 0 .9-.4 1.5Z"/></svg>;
}
