import { useCallback } from "react";
import { useNavigate } from "react-router";
import { generatePath, getLocalePathFromPathname } from "@orderly.network/i18n";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { perpRoute, type RouteOption } from "@orderly.network/types";
import { PathEnum } from "../constant";
import { migratePredictionPath } from "../navigationPaths";
import { getPerpSymbol } from "../perpSymbolStorage";

export function useNav() {
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        window.open(option.href, "_blank", "noopener,noreferrer");
        return;
      }

      const announcementNavigation = option.scope === "announcement";
      const hashStart = option.href.indexOf("#");
      const pathWithSearch =
        hashStart < 0 ? option.href : option.href.slice(0, hashStart);
      const hash =
        hashStart < 0
          ? announcementNavigation
            ? ""
            : window.location.hash
          : option.href.slice(hashStart);
      const queryStart = pathWithSearch.indexOf("?");
      const pathname =
        queryStart < 0 ? pathWithSearch : pathWithSearch.slice(0, queryStart);
      const search =
        queryStart < 0
          ? announcementNavigation
            ? "?"
            : window.location.search
          : pathWithSearch.slice(queryStart);

      // if href not equal to the route path, we need to convert it to the route path
      const routeMap = {
        [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
        [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
      } as Record<string, string>;

      const path =
        pathname === "/"
          ? perpRoute(getPerpSymbol()).href
          : migratePredictionPath(routeMap[pathname] || pathname);
      const href = generatePath({
        path,
        locale:
          getLocalePathFromPathname(window.location.pathname) ?? undefined,
        search,
      });
      const destination = href.endsWith("?") ? href.slice(0, -1) : href;
      navigate(`${destination}${hash}`, { replace: option.replace });
    },
    [navigate],
  );

  return { onRouteChange };
}
