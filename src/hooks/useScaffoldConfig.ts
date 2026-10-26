import { useMemo } from "react";
import { useFeatureEnabled } from "@orderly.network/react-app";
import { PathEnum } from "../constant";
import { useOrderlyConfig } from "./useOrderlyConfig";

/** Layouts render below OrderlyAppProvider; provider setup must not read its flags. */
export function useScaffoldConfig() {
  const { scaffold } = useOrderlyConfig();
  const predictionEnabled = useFeatureEnabled("prediction");

  return useMemo(
    () => ({
      ...scaffold,
      mainNavProps: {
        ...scaffold.mainNavProps,
        leftNav: {
          ...scaffold.mainNavProps.leftNav,
          menus: scaffold.mainNavProps.leftNav?.menus?.filter(
            (item) => predictionEnabled || item.href !== PathEnum.Prediction,
          ),
        },
      },
    }),
    [predictionEnabled, scaffold],
  );
}
