import { useEffect } from "react";
import { useParams } from "react-router";
import { TradingPage } from "@orderly.network/trading";
import { BaseLayout } from "../../components/layout";
import { useOrderlyConfig } from "../../hooks/useOrderlyConfig";
import { setPerpSymbol } from "../../perpSymbolStorage";

export default function PerpPage() {
  const { symbol } = useParams();
  const config = useOrderlyConfig();

  useEffect(() => {
    if (symbol) setPerpSymbol(symbol);
  }, [symbol]);

  if (!symbol) return null;

  return (
    <BaseLayout>
      <TradingPage
        symbol={symbol}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </BaseLayout>
  );
}
