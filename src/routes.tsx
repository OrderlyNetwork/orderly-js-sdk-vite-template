import { Navigate, RouterProvider, useLocation } from "react-router";
import { generatePath, getLocalePathFromPathname } from "@orderly.network/i18n";
import { perpRoute } from "@orderly.network/types";
import { Spinner } from "@orderly.network/ui";
import type { createAppRouter } from "./appRouter";
import { migratePredictionPath } from "./navigationPaths";
import { getPerpSymbol } from "./perpSymbolStorage";

export const PageLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Spinner />
    </div>
  );
};

export function LegacyPredictionRedirect() {
  const { pathname, search, hash } = useLocation();
  return (
    <Navigate
      to={`${migratePredictionPath(pathname)}${search}${hash}`}
      replace
    />
  );
}

export function PerpsRedirect() {
  const { pathname, search, hash } = useLocation();
  const href = generatePath({
    path: perpRoute(getPerpSymbol()).href,
    locale: getLocalePathFromPathname(pathname) ?? undefined,
    search,
  });
  return <Navigate to={`${href}${hash}`} replace />;
}

export function AffiliateRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`affiliate${search}${hash}`} replace />;
}

export default function AppRoute({
  router,
}: {
  router: ReturnType<typeof createAppRouter>;
}) {
  return <RouterProvider router={router} />;
}
