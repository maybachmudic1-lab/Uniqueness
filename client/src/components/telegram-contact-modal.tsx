import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TelegramContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  telegramUsername: string;
  telegramUrl: string;
}

export function TelegramContactModal({ open, onOpenChange, telegramUsername, telegramUrl }: TelegramContactModalProps) {
  const { toast } = useToast();

  const copyUsername = () => {
    navigator.clipboard.writeText(telegramUsername);
    toast({
      title: "Copied!",
      description: "Telegram username copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-telegram-contact">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Contact a Mentor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <p className="text-center text-muted-foreground">
            Some platforms block direct links. Please use an option below:
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Option 1: Copy Telegram Username</h3>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={telegramUsername}
                  className="text-center font-mono"
                  data-testid="input-telegram-username"
                />
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={copyUsername}
                  data-testid="button-copy-telegram"
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg">Option 2: Use Direct Link</h3>
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
                asChild
                data-testid="button-open-telegram"
              >
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                  Open on Telegram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
