// GET /api/onchain — Onchain DEX/DeFi data
export async function GET() {
  return Response.json({
    dexVolume24h: "$2.1B",
    defiTVL: "$4.8M",
    bridgeVolume24h: "$890K",
    chains: ["XLayer", "Solana", "Ethereum", "Base", "BSC", "Arbitrum", "Polygon"],
    protocols: [
      { name: "Polymarket", category: "Prediction", chains: ["Polygon"], volume24h: "$340M" },
      { name: "Aave", category: "Lending", chains: ["Ethereum","Arbitrum","Base"], tvl: "$22B" },
      { name: "Hyperliquid", category: "Perp DEX", chains: ["Arbitrum"], volume24h: "$1.5B" },
      { name: "PancakeSwap", category: "DEX", chains: ["BSC","Ethereum"], volume24h: "$280M" },
      { name: "Morpho", category: "Lending", chains: ["Ethereum","Base"], tvl: "$3.1B" },
      { name: "Raydium", category: "DEX", chains: ["Solana"], volume24h: "$450M" },
      { name: "Curve", category: "DEX", chains: ["Ethereum","Arbitrum"], tvl: "$1.6B" },
      { name: "Compound", category: "Lending", chains: ["Ethereum"], tvl: "$2.8B" },
      { name: "Pendle", category: "Yield", chains: ["Ethereum","Arbitrum"], tvl: "$1.2B" },
      { name: "Lido", category: "Staking", chains: ["Ethereum"], tvl: "$28B" },
      { name: "ether.fi", category: "Staking", chains: ["Ethereum"], tvl: "$5.4B" },
      { name: "GMX", category: "Perp DEX", chains: ["Arbitrum","Avalanche"], volume24h: "$120M" },
      { name: "Kamino", category: "DEX", chains: ["Solana"], tvl: "$580M" },
      { name: "Orca", category: "DEX", chains: ["Solana"], volume24h: "$95M" },
      { name: "Meteora", category: "DEX", chains: ["Solana"], volume24h: "$210M" },
      { name: "Clanker", category: "Token", chains: ["Base"], volume24h: "$15M" },
      { name: "pump.fun", category: "Launchpad", chains: ["Solana"], volume24h: "$180M" },
      { name: "Uniswap", category: "DEX", chains: ["Ethereum","Arbitrum","Base","Polygon"], volume24h: "$980M" },
    ],
  });
}
