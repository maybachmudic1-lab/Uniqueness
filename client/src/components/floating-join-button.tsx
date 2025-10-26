import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useTikTokBrowser } from "@/hooks/use-tiktok-browser";

export function FloatingJoinButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { isTikTok } = useTikTokBrowser();

  useEffect(() => {
    const delay = isTikTok ? 45000 : 20000;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isTikTok]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
      <Button
        size="lg"
        className="rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:scale-110 transition-transform duration-300 px-6 py-6"
        data-testid="button-floating-join"
        asChild
      >
        <a href="https://t.me/thewealthprince0" target="_blank" rel="noopener noreferrer">
          <MessageCircle className="w-6 h-6 mr-2" />
          <span className="font-bold">Join Now</span>
        </a>
      </Button>
    </div>
  );
}
