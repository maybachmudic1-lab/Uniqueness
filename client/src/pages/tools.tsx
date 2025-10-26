import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, DollarSign, Percent, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Tools() {
  const [optionsCalc, setOptionsCalc] = useState({
    stockPrice: "",
    strikePrice: "",
    premium: "",
  });

  const [riskCalc, setRiskCalc] = useState({
    accountSize: "",
    riskPercent: "",
    entryPrice: "",
    stopLoss: "",
  });

  const [profitResult, setProfitResult] = useState<number | null>(null);
  const [positionSize, setPositionSize] = useState<number | null>(null);

  const calculateProfit = () => {
    const stock = parseFloat(optionsCalc.stockPrice);
    const strike = parseFloat(optionsCalc.strikePrice);
    const premium = parseFloat(optionsCalc.premium);
    
    if (isNaN(stock) || isNaN(strike) || isNaN(premium) || stock <= 0 || strike <= 0 || premium <= 0) {
      setProfitResult(null);
      return;
    }
    
    const intrinsicValue = Math.max(0, stock - strike);
    const profit = (intrinsicValue - premium) * 100;
    setProfitResult(profit);
  };

  const calculatePosition = () => {
    const account = parseFloat(riskCalc.accountSize);
    const risk = parseFloat(riskCalc.riskPercent);
    const entry = parseFloat(riskCalc.entryPrice);
    const stop = parseFloat(riskCalc.stopLoss);
    
    if (isNaN(account) || isNaN(risk) || isNaN(entry) || isNaN(stop) || 
        account <= 0 || risk <= 0 || risk > 100 || entry <= 0 || stop <= 0) {
      setPositionSize(null);
      return;
    }
    
    const riskPerShare = Math.abs(entry - stop);
    
    if (riskPerShare === 0) {
      setPositionSize(null);
      return;
    }
    
    const riskAmount = account * (risk / 100);
    const shares = Math.floor(riskAmount / riskPerShare);
    setPositionSize(shares);
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trading Tools & Calculators
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional trading calculators to help you make better decisions and manage risk effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Options Profit Calculator */}
          <Card className="border-card-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Options Profit Calculator</CardTitle>
                  <CardDescription className="mt-1">
                    Calculate potential profit/loss on your options trades
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stockPrice">Current Stock Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="stockPrice"
                    type="number"
                    placeholder="175.50"
                    className="pl-9"
                    value={optionsCalc.stockPrice}
                    onChange={(e) => setOptionsCalc({...optionsCalc, stockPrice: e.target.value})}
                    data-testid="input-stock-price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strikePrice">Strike Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="strikePrice"
                    type="number"
                    placeholder="170.00"
                    className="pl-9"
                    value={optionsCalc.strikePrice}
                    onChange={(e) => setOptionsCalc({...optionsCalc, strikePrice: e.target.value})}
                    data-testid="input-strike-price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premium">Premium Paid (per share)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="premium"
                    type="number"
                    placeholder="2.50"
                    className="pl-9"
                    value={optionsCalc.premium}
                    onChange={(e) => setOptionsCalc({...optionsCalc, premium: e.target.value})}
                    data-testid="input-premium"
                  />
                </div>
              </div>

              <Button onClick={calculateProfit} className="w-full gap-2" data-testid="button-calculate-profit">
                <Calculator className="w-4 h-4" />
                Calculate Profit/Loss
              </Button>

              {profitResult !== null && (
                <div className="p-4 rounded-lg bg-accent/50 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Estimated Profit/Loss</div>
                  <div className={`text-3xl font-black ${profitResult >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`} data-testid="text-profit-result">
                    {profitResult >= 0 ? '+' : ''}${profitResult.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Per 1 contract (100 shares)</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Position Size Calculator */}
          <Card className="border-card-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Position Size Calculator</CardTitle>
                  <CardDescription className="mt-1">
                    Determine the right position size based on your risk management rules
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountSize">Account Size</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="accountSize"
                    type="number"
                    placeholder="10000"
                    className="pl-9"
                    value={riskCalc.accountSize}
                    onChange={(e) => setRiskCalc({...riskCalc, accountSize: e.target.value})}
                    data-testid="input-account-size"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskPercent">Risk Per Trade (%)</Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="riskPercent"
                    type="number"
                    placeholder="1"
                    className="pl-9"
                    value={riskCalc.riskPercent}
                    onChange={(e) => setRiskCalc({...riskCalc, riskPercent: e.target.value})}
                    data-testid="input-risk-percent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="entryPrice"
                    type="number"
                    placeholder="50.00"
                    className="pl-9"
                    value={riskCalc.entryPrice}
                    onChange={(e) => setRiskCalc({...riskCalc, entryPrice: e.target.value})}
                    data-testid="input-entry-price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="stopLoss"
                    type="number"
                    placeholder="48.00"
                    className="pl-9"
                    value={riskCalc.stopLoss}
                    onChange={(e) => setRiskCalc({...riskCalc, stopLoss: e.target.value})}
                    data-testid="input-stop-loss"
                  />
                </div>
              </div>

              <Button onClick={calculatePosition} className="w-full gap-2" data-testid="button-calculate-position">
                <Calculator className="w-4 h-4" />
                Calculate Position Size
              </Button>

              {positionSize !== null && (
                <div className="p-4 rounded-lg bg-accent/50 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Recommended Position Size</div>
                  <div className="text-3xl font-black text-primary" data-testid="text-position-result">
                    {positionSize} shares
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Risk Amount: ${(parseFloat(riskCalc.accountSize) * (parseFloat(riskCalc.riskPercent) / 100)).toFixed(2)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Educational Note */}
        <Card className="border-card-border bg-muted/30">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Important Risk Disclaimer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These calculators are for educational purposes only and should not be considered financial advice. 
                  Always conduct your own research and consult with a licensed financial advisor before making trading decisions. 
                  Past performance does not guarantee future results. Trading involves substantial risk of loss.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-card-border hover-elevate">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">Pro Tip #1</Badge>
              <CardTitle className="text-lg">Never Risk More Than 1-2%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Professional traders never risk more than 1-2% of their account on a single trade. This ensures longevity even through losing streaks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-card-border hover-elevate">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">Pro Tip #2</Badge>
              <CardTitle className="text-lg">Know Your Stop Loss First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Always determine your stop loss BEFORE entering a trade. Your position size should be calculated based on your stop loss distance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-card-border hover-elevate">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">Pro Tip #3</Badge>
              <CardTitle className="text-lg">Aim for 2:1 Reward-Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Seek trades where your potential profit is at least 2x your potential loss. This positive risk-reward ratio is key to long-term profitability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
