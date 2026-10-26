import { useCallback } from "react";
import { useNavigate } from "react-router";
import { generatePath, getLocalePathFromPathname } from "@orderly.network/i18n";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { perpRoute, type RouteOption } from "@orderly.network/types";
import { PathEnum } from "../constant";
import { getPerpSymbol } from "../perpSymbolStorage";

export function useNav() {
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        window.open(option.href, "_blank", "noopener,noreferrer");
        return;
      }

      const hashStart = option.href.indexOf("#");
      const pathWithSearch =
        hashStart < 0 ? option.href : option.href.slice(0, hashStart);
      const hash =
        hashStart < 0 ? window.location.hash : option.href.slice(hashStart);
      const queryStart = pathWithSearch.indexOf("?");
      const pathname =
        queryStart < 0 ? pathWithSearch : pathWithSearch.slice(0, queryStart);
      const search =
        queryStart < 0
          ? window.location.search
          : pathWithSearch.slice(queryStart);

      // if href not equal to the route path, we need to convert it to the route path
      const routeMap = {
        [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
        [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
      } as Record<string, string>;

      const path =
        pathname === "/"
          ? perpRoute(getPerpSymbol()).href
          : routeMap[pathname] || pathname;
      const href = generatePath({
        path,
        locale:
          getLocalePathFromPathname(window.location.pathname) ?? undefined,
        search,
      });
      navigate(`${href}${hash}`, { replace: option.replace });
    },
    [navigate],
  );

  return { onRouteChange };
}
