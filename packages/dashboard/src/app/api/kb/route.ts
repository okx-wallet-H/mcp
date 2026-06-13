// GET /api/kb — Knowledge Base mock data
export async function GET() {
  return Response.json({
    tools: [
      { name: "okx_get_ticker", category: "Market", module: "CEX", description: "获取实时行情" },
      { name: "okx_get_candles", category: "Market", module: "CEX", description: "获取K线数据" },
      { name: "okx_get_orderbook", category: "Market", module: "CEX", description: "获取订单簿深度" },
      { name: "okx_place_order", category: "Trade", module: "CEX", description: "下单" },
      { name: "okx_cancel_order", category: "Trade", module: "CEX", description: "撤单" },
      { name: "okx_get_positions", category: "Account", module: "CEX", description: "查询持仓" },
      { name: "okx_get_balance", category: "Account", module: "CEX", description: "查询余额" },
      { name: "okx_transfer", category: "Funds", module: "CEX", description: "资金划转" },
      { name: "okx_set_leverage", category: "Config", module: "CEX", description: "设置杠杆" },
      { name: "okx_get_funding_rate", category: "Market", module: "CEX", description: "资金费率" },
      { name: "okx_dex_swap", category: "Trade", module: "Onchain", description: "DEX聚合交易" },
      { name: "okx_dex_bridge", category: "Bridge", module: "Onchain", description: "跨链桥接" },
      { name: "okx_defi_invest", category: "DeFi", module: "Onchain", description: "DeFi投资" },
      { name: "okx_wallet_balance", category: "Account", module: "Wallet", description: "钱包余额" },
      { name: "okx_wallet_send", category: "Trade", module: "Wallet", description: "发送交易" },
    ],
    totalTools: 15,
    categories: ["Market","Trade","Account","Funds","Config","DeFi","Bridge"],
    modules: ["CEX","Onchain","Wallet"],
    qualityScore: 93,
  });
}
