import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/firebase";

export function WhatsAppFab({ message = "Hello M.A.T.Furniture, I'd like to know more about your collection." }: { message?: string }) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-gold hover:scale-105 transition-transform"
    >
      <MessageCircle size={26} strokeWidth={2.2} />
    </a>
  );
}
