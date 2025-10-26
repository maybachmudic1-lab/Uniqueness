import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TradingUpdate {
  id: string;
  trader: string;
  ticker: string;
  profit: string;
  time: string;
}

const tradingUpdates: TradingUpdate[] = [
  { id: "1", trader: "Alex M.", ticker: "SPY", profit: "+$1,240", time: "2m ago" },
  { id: "2", trader: "Sarah K.", ticker: "NVDA", profit: "+$890", time: "5m ago" },
  { id: "3", trader: "Mike R.", ticker: "TSLA", profit: "+$2,100", time: "8m ago" },
  { id: "4", trader: "Jennifer L.", ticker: "AAPL", profit: "+$650", time: "12m ago" },
  { id: "5", trader: "David P.", ticker: "AMD", profit: "+$1,450", time: "15m ago" },
  { id: "6", trader: "Rachel W.", ticker: "MSFT", profit: "+$980", time: "18m ago" },
  { id: "7", trader: "Chris T.", ticker: "META", profit: "+$1,720", time: "22m ago" },
  { id: "8", trader: "Amanda H.", ticker: "GOOGL", profit: "+$840", time: "25m ago" },
  { id: "9", trader: "Kevin N.", ticker: "SPY", profit: "+$1,580", time: "28m ago" },
  { id: "10", trader: "Lisa B.", ticker: "QQQ", profit: "+$925", time: "31m ago" },
];

export function LiveTradingFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tradingUpdates.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentUpdate = tradingUpdates[currentIndex];

  return (
    <Card className="border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 animate-glow-pulse" data-testid="card-live-trading-feed">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="animate-pulse" data-testid="badge-live">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping inline-block" />
            LIVE
          </Badge>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground">{currentUpdate.time}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{currentUpdate.trader} just closed</p>
          <p className="text-xl font-bold">
            <span className="text-primary">{currentUpdate.ticker}</span> options
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-green-500" data-testid="text-live-profit">
            {currentUpdate.profit}
          </p>
          <p className="text-xs text-muted-foreground">Profit</p>
        </div>
      </div>
    </Card>
  );
}
