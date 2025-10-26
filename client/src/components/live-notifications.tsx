import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "trade" | "join" | "profit";
  message: string;
  icon: typeof TrendingUp;
}

const sampleNotifications: Omit<Notification, "id">[] = [
  { type: "trade", message: "SPY breaking $580 resistance - Calls heating up", icon: TrendingUp },
  { type: "join", message: "Michael T. from Texas just joined", icon: Users },
  { type: "profit", message: "Brandon closed NVDA for +$1,890", icon: DollarSign },
  { type: "trade", message: "TSLA reclaiming VWAP on 15min - momentum building", icon: Bell },
  { type: "join", message: "Emma K. from California became a member", icon: Users },
  { type: "profit", message: "Marcus banked +$2,140 on QQQ 0DTE", icon: DollarSign },
  { type: "trade", message: "SPX $6050C looking prime - volume increasing", icon: TrendingUp },
  { type: "join", message: "David R. from Florida joined", icon: Users },
  { type: "profit", message: "Jessica secured +$975 on SPY scalp", icon: DollarSign },
  { type: "trade", message: "AMD holding key support at $128 - watching for bounce", icon: Bell },
  { type: "join", message: "Ryan M. from New York just subscribed", icon: Users },
  { type: "profit", message: "Tyler made +$640 on AAPL puts", icon: DollarSign },
  { type: "trade", message: "MSFT consolidating near $440 - breakout setup forming", icon: TrendingUp },
  { type: "join", message: "Ashley P. from Georgia joined the group", icon: Users },
  { type: "profit", message: "Carlos locked in +$1,520 on SPX spreads", icon: DollarSign },
  { type: "trade", message: "META testing resistance at $620 - high volume", icon: Bell },
  { type: "join", message: "Jordan L. from Arizona became a member", icon: Users },
  { type: "profit", message: "Samantha closed TSLA for +$2,350 profit", icon: DollarSign },
  { type: "trade", message: "QQQ $500C getting unusual activity - watching closely", icon: TrendingUp },
  { type: "profit", message: "Kevin banked +$890 on AMD calls", icon: DollarSign },
  { type: "join", message: "Nicole B. from Illinois just joined", icon: Users },
  { type: "trade", message: "GOOGL breaking daily high - momentum play active", icon: Bell },
  { type: "profit", message: "Derek secured +$1,675 on SPY day trade", icon: DollarSign },
  { type: "join", message: "Chris W. from Washington joined", icon: Users },
  { type: "profit", message: "Melissa made +$785 on NVDA scalp", icon: DollarSign },
];

export function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("notifications-dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    let visibilityTimeout: NodeJS.Timeout | null = null;
    let hideTimeout: NodeJS.Timeout | null = null;

    const showRandomNotification = () => {
      if (isDismissed) return;

      const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...randomNotif,
      };

      setNotifications([newNotification]);
      setVisible(true);

      visibilityTimeout = setTimeout(() => {
        setVisible(false);
        hideTimeout = setTimeout(() => setNotifications([]), 500);
      }, 5000);
    };

    const interval = setInterval(showRandomNotification, 15000);
    showRandomNotification();

    return () => {
      clearInterval(interval);
      if (visibilityTimeout) clearTimeout(visibilityTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setVisible(false);
    sessionStorage.setItem("notifications-dismissed", "true");
  };

  if (notifications.length === 0 || isDismissed) return null;

  return (
    <div
      className={`fixed top-20 right-6 z-40 max-w-sm transition-all duration-500 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      {notifications.map((notif) => {
        const Icon = notif.icon;
        return (
          <Card
            key={notif.id}
            className="p-4 bg-card/95 backdrop-blur-sm border-2 shadow-lg hover-elevate"
            data-testid={`notification-${notif.type}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {notif.type === "trade" && "Live Trade"}
                      {notif.type === "join" && "New Member"}
                      {notif.type === "profit" && "Profit Alert"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Just now</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 shrink-0"
                    onClick={handleDismiss}
                    data-testid="button-dismiss-notifications"
                  >
                    <span className="text-xs">✕</span>
                  </Button>
                </div>
                <p className="text-sm font-medium leading-tight">{notif.message}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
