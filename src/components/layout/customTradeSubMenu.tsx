import { useEffect, useState } from "react";
import { TradeSubMenuWidget } from "@orderly.network/markets";
import { PathEnum } from "../../constant";
import { usePathWithoutLang } from "../../hooks/usePathWithoutLang";

export default function TradeMenu() {
  const path = usePathWithoutLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isPrediction =
    path === PathEnum.Prediction || path.startsWith(`${PathEnum.Prediction}/`);
  const match = path.match(/^\/perp\/([^/]+)$/);
  let symbol: string | undefined;
  try {
    symbol = match ? decodeURIComponent(match[1]) : undefined;
  } catch {
    // Ignore malformed route encoding.
  }
  return mounted ? (
    <TradeSubMenuWidget
      activeKey={isPrediction ? "prediction" : "perps"}
      symbol={symbol}
    />
  ) : null;
}
