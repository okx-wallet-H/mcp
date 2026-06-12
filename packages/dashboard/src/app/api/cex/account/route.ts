import { getBalance, getPositions, getAccountConfig, hasCredentials } from "@/lib/okx-api";

export async function GET() {
  if (hasCredentials()) {
    try {
      const [balance, positions, config] = await Promise.all([getBalance(), getPositions(), getAccountConfig()]);
      const usdt = (balance as Array<{ ccy: string; availBal: string; frozenBal: string; eq: string }>).find(b => b.ccy === "USDT");
      return Response.json({
        balance: {
          totalEquity: usdt ? +usdt.eq : 0,
          available: usdt ? +usdt.availBal : 0,
          frozen: usdt ? +usdt.frozenBal : 0,
        },
        positions,
        accountConfig: config,
      });
    } catch (e) { console.error("OKX account failed, using mock:", e); }
  }

  // Fallback mock
  return Response.json({
    balance: { totalEquity: 45832.91, available: 12345.67, frozen: 33487.24 },
    positions: [
      { instId:"BTC-USDT-SWAP",side:"long",qty:0.15,avgPx:64200,markPx:65234,upl:155.10,lever:10 },
      { instId:"ETH-USDT-SWAP",side:"long",qty:2.5,avgPx:3380,markPx:3422,upl:105.00,lever:5 },
      { instId:"SOL-USDT-SWAP",side:"short",qty:50,avgPx:148,markPx:143,upl:250.00,lever:3 },
    ],
    accountConfig: { uid:"okx_user_001",acctLv:"3",posMode:"long_short_mode" },
  });
}
