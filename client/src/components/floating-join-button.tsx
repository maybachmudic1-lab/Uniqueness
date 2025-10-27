import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { TelegramContactModal } from "@/components/telegram-contact-modal";

export function FloatingJoinButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  useEffect(() => {
    const delay = 20000;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const handleClick = () => {
    setShowTelegramModal(true);
  };

  const telegramUsername = "@thewealthprince0";
  const telegramUrl = "https://t.me/thewealthprince0";

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
        <Button
          size="lg"
          className="rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:scale-110 transition-transform duration-300 px-6 py-6"
          data-testid="button-floating-join"
          onClick={handleClick}
        >
          <MessageCircle className="w-6 h-6 mr-2" />
          <span className="font-bold">Join Now</span>
        </Button>
      </div>

      <TelegramContactModal
        open={showTelegramModal}
        onOpenChange={setShowTelegramModal}
        telegramUsername={telegramUsername}
        telegramUrl={telegramUrl}
      />
    </>
  );
}
