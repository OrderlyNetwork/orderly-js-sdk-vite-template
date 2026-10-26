import { useEffect } from "react";
import { useParams } from "react-router";
import { PredictionPage } from "@orderly.network/prediction";
import { useFeatureEnabled } from "@orderly.network/react-app";
import { perpRoute } from "@orderly.network/types";
import { BaseLayout } from "../../components/layout";
import { useNav } from "../../hooks/useNav";
import { getPerpSymbol } from "../../perpSymbolStorage";

export default function PredictionRoute() {
  const { symbol } = useParams();
  const enabled = useFeatureEnabled("prediction");
  const { onRouteChange } = useNav();

  useEffect(() => {
    if (!enabled) onRouteChange(perpRoute(getPerpSymbol(), { replace: true }));
  }, [enabled, onRouteChange]);

  return enabled ? (
    <BaseLayout>
      <PredictionPage symbol={symbol} />
    </BaseLayout>
  ) : null;
}
