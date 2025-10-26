import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from "@shared/schema";
import { generateRandomTestimonial, EXPANDED_WATCHLIST } from "./seed-data";

// Configure WebSocket for Neon database connection
// In development (Replit workspace): use ws library
// In production (Cloud Run): native WebSocket is available globally
if (process.env.NODE_ENV !== 'production') {
  // Development environment - configure ws library for Node.js
  neonConfig.webSocketConstructor = ws;
}
// Production: Native WebSocket is available, no configuration needed

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Seed the database with realistic initial data
export async function seedDatabase() {
  try {
    // Check if already seeded
    const existingStats = await db.query.stats.findFirst();
    if (existingStats) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database with realistic data...");

    // Insert stats
    await db.insert(schema.stats).values({
      memberCount: 1547,
      tradesCalled: 2489,
      avgProfit: 8734,
      winRate: 76,
      successRate: 89,
    });

    // Insert 100 realistic testimonials with unique names, dates, and ratings
    const testimonials = Array.from({ length: 100 }, (_, i) => generateRandomTestimonial(i));
    await db.insert(schema.testimonials).values(testimonials);

    // Insert expanded watchlist (20 stocks)
    await db.insert(schema.stocks).values(EXPANDED_WATCHLIST);

    // Insert realistic video lessons
    await db.insert(schema.videoLessons).values([
      {
        title: "Options Trading Fundamentals",
        description: "Master the basics of call and put options, Greeks, and how options contracts work.",
        duration: "45:23",
        category: "Beginner",
        locked: false,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Understanding the Greeks",
        description: "Deep dive into Delta, Gamma, Theta, and Vega - how they affect your positions.",
        duration: "38:15",
        category: "Beginner",
        locked: false,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Vertical Spread Strategies",
        description: "Learn to build bull call spreads and bear put spreads for defined risk trading.",
        duration: "52:40",
        category: "Intermediate",
        locked: false,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Iron Condors Masterclass",
        description: "Advanced strategy for range-bound markets. Maximize theta decay profit.",
        duration: "1:08:25",
        category: "Advanced",
        locked: true,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "0DTE Options Trading",
        description: "Same-day expiration trades on SPY and QQQ. High risk, high reward strategies.",
        duration: "42:18",
        category: "Advanced",
        locked: true,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Covered Call Strategy",
        description: "Generate monthly income from your stock holdings with this conservative strategy.",
        duration: "35:50",
        category: "Beginner",
        locked: false,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Put Credit Spreads",
        description: "Collect premium while defining your risk. Perfect for bullish bias trades.",
        duration: "44:33",
        category: "Intermediate",
        locked: false,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Technical Analysis for Options",
        description: "Use support, resistance, and indicators to time your options entries.",
        duration: "56:12",
        category: "Intermediate",
        locked: true,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Earnings Plays Strategy",
        description: "How to trade options around earnings announcements safely and profitably.",
        duration: "48:27",
        category: "Advanced",
        locked: true,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Position Sizing & Risk Management",
        description: "Critical lesson on protecting your capital and managing winners and losers.",
        duration: "39:55",
        category: "Beginner",
        locked: false,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Calendar Spreads Explained",
        description: "Profit from time decay differences between option expiration dates.",
        duration: "51:40",
        category: "Advanced",
        locked: true,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Butterfly Spreads Deep Dive",
        description: "Advanced multi-leg strategy for precise directional betting with limited risk.",
        duration: "1:02:18",
        category: "Advanced",
        locked: true,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Straddles and Strangles",
        description: "Profit from big moves in either direction. Perfect for high volatility events.",
        duration: "46:55",
        category: "Intermediate",
        locked: true,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Reading Options Chains",
        description: "Understand bid/ask, open interest, and volume to make smarter trades.",
        duration: "32:45",
        category: "Beginner",
        locked: false,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
      {
        title: "Volatility Trading Strategies",
        description: "How to use VIX and implied volatility to your advantage in options trading.",
        duration: "54:20",
        category: "Advanced",
        locked: true,
        thumbnail: null,
        videoUrl: null,
        youtubeId: null,
      },
    ]);

    // Insert training modules
    await db.insert(schema.modules).values([
      {
        title: "Introduction to Options",
        content: "Learn what options are, how they work, and why they're powerful trading instruments. Understand calls, puts, and basic contract mechanics.",
      },
      {
        title: "Options Greeks Mastery",
        content: "Master Delta, Gamma, Theta, Vega, and Rho. Understand how these metrics affect your positions and how to use them for better decisions.",
      },
      {
        title: "Basic Strategy Guide",
        content: "Learn covered calls, cash-secured puts, and protective puts. Build a foundation with these beginner-friendly strategies.",
      },
      {
        title: "Spread Strategies",
        content: "Vertical spreads, horizontal spreads, and diagonal spreads explained. Reduce risk while maintaining profit potential.",
      },
      {
        title: "Advanced Multi-Leg Strategies",
        content: "Iron condors, butterflies, and ratio spreads. Complex strategies for experienced traders seeking consistent income.",
      },
      {
        title: "Risk Management Essentials",
        content: "Position sizing, stop losses, and portfolio management. Protect your capital and stay in the game long-term.",
      },
    ]);

    // Insert glossary terms
    await db.insert(schema.glossaryTerms).values([
      { term: "Call Option", definition: "A contract giving the buyer the right, but not obligation, to purchase an asset at a specified price within a specific time period." },
      { term: "Put Option", definition: "A contract giving the buyer the right, but not obligation, to sell an asset at a specified price within a specific time period." },
      { term: "Strike Price", definition: "The predetermined price at which the option contract can be exercised." },
      { term: "Expiration Date", definition: "The last day an option contract can be exercised before it becomes worthless." },
      { term: "Premium", definition: "The price paid by the buyer to purchase an option contract." },
      { term: "In The Money (ITM)", definition: "An option that has intrinsic value. For calls, when stock price > strike price. For puts, when stock price < strike price." },
      { term: "Out of The Money (OTM)", definition: "An option with no intrinsic value. For calls, when stock price < strike price. For puts, when stock price > strike price." },
      { term: "At The Money (ATM)", definition: "An option whose strike price is equal or very close to the current stock price." },
      { term: "Delta", definition: "Measures the rate of change in an option's price relative to a $1 change in the underlying asset." },
      { term: "Gamma", definition: "Measures the rate of change in Delta for a $1 change in the underlying asset." },
      { term: "Theta", definition: "Measures the rate of decline in an option's value due to the passage of time (time decay)." },
      { term: "Vega", definition: "Measures sensitivity to volatility. Shows how much an option's price changes for a 1% change in implied volatility." },
      { term: "Implied Volatility", definition: "The market's forecast of a likely movement in the underlying asset's price, reflected in option prices." },
      { term: "Intrinsic Value", definition: "The actual value of an option if exercised immediately. Difference between stock price and strike price for ITM options." },
      { term: "Extrinsic Value", definition: "The portion of an option's price that exceeds its intrinsic value. Also called time value." },
      { term: "Covered Call", definition: "Strategy where you own the stock and sell call options against it to generate income from premiums." },
      { term: "Cash-Secured Put", definition: "Selling put options while holding enough cash to purchase the stock if assigned." },
      { term: "Vertical Spread", definition: "Buying and selling options of the same type with the same expiration but different strike prices." },
      { term: "Iron Condor", definition: "Advanced strategy combining a bear call spread and bull put spread to profit from low volatility." },
      { term: "Assignment", definition: "When an option seller is required to fulfill their obligation (sell stock for calls, buy stock for puts)." },
    ]);

    console.log("Database seeded successfully with 100 unique testimonials and expanded watchlist!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
