import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, ExternalLink } from "lucide-react";
import type { Stock } from "@shared/schema";

export default function Watchlist() {
  const { data: stocks, isLoading, error } = useQuery<Stock[]>({
    queryKey: ["/api/watchlist"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load market data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Live Market Watchlist
          </h1>
          <p className="text-xl text-muted-foreground">
            Track popular stocks and their real-time performance
          </p>
        </div>

        {/* Stocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks?.map((stock) => (
            <Card
              key={stock.id}
              className="border-card-border hover-elevate transition-all"
              data-testid={`card-stock-${stock.symbol}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black text-primary" data-testid={`text-symbol-${stock.symbol}`}>
                      {stock.symbol}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`text-name-${stock.symbol}`}>{stock.name}</p>
                  </div>
                  <Badge
                    variant={stock.changePercent >= 0 ? "default" : "destructive"}
                    className="font-bold"
                    data-testid={`badge-change-${stock.symbol}`}
                  >
                    {stock.changePercent >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {stock.changePercent >= 0 ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-4xl font-black" data-testid={`text-price-${stock.symbol}`}>
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className={`text-sm font-semibold ${
                    stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                  }`} data-testid={`text-change-${stock.symbol}`}>
                    {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                  </div>
                </div>

                {stock.news && stock.news.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Latest News
                    </p>
                    <div className="space-y-2">
                      {stock.news.slice(0, 2).map((item, idx) => (
                        <a
                          key={idx}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm hover:text-primary transition-colors group"
                          data-testid={`link-news-${stock.symbol}-${idx}`}
                        >
                          <div className="flex items-start gap-2">
                            <ExternalLink className="w-3 h-3 mt-1 shrink-0 opacity-50 group-hover:opacity-100" />
                            <span className="line-clamp-2 leading-tight">{item.headline}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="border-card-border bg-muted/30">
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> Market data is provided for informational purposes only. 
              Always do your own research before making any trading decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
