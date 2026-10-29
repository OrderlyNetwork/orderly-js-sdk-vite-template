import { ComponentType, lazy, Suspense } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { PortfolioLayout, TradingRewardsLayout } from "./components/layout";
import { OrderlyProvider } from "./components/orderlyProvider";
import {
  PageLoading,
  PerpsRedirect,
  AffiliateRedirect,
  LegacyPredictionRedirect,
} from "./routes";

const lazyImportPage = (
  importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
): ComponentType<Record<string, unknown>> => {
  const LazyComponent = lazy(importFn);
  const WrappedComponent = (props: Record<string, unknown>) => (
    <Suspense fallback={<PageLoading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  return WrappedComponent;
};

const AnnouncementPage = lazyImportPage(
  () => import("./pages/announcement/page"),
);

const PerpPage = lazyImportPage(() => import("./pages/perp/page"));
const PredictionPage = lazyImportPage(() => import("./pages/prediction/page"));

const PortfolioPage = lazyImportPage(() => import("./pages/portfolio/page"));
const PositionsPage = lazyImportPage(
  () => import("./pages/portfolio/positions/page"),
);
const OrdersPage = lazyImportPage(
  () => import("./pages/portfolio/orders/page"),
);
const AssetsPage = lazyImportPage(
  () => import("./pages/portfolio/assets/page"),
);
const FeeTierPage = lazyImportPage(() => import("./pages/portfolio/fee/page"));
const APIKeyPage = lazyImportPage(
  () => import("./pages/portfolio/api-key/page"),
);
const SettingsPage = lazyImportPage(
  () => import("./pages/portfolio/setting/page"),
);
const HistoryPage = lazyImportPage(
  () => import("./pages/portfolio/history/page"),
);

const MarketsPage = lazyImportPage(() => import("./pages/markets/page"));
const LeaderboardPage = lazyImportPage(
  () => import("./pages/leaderboard/page"),
);

const AffiliatePage = lazyImportPage(
  () => import("./pages/rewards/affiliate/page"),
);

export const baseRoutes: RouteObject[] = [
  { path: "announcement/:slug?", element: <AnnouncementPage /> },
  {
    path: "perp",
    children: [
      {
        index: true,
        element: <PerpsRedirect />,
      },
      {
        path: ":symbol",
        element: <PerpPage />,
      },
    ],
  },
  {
    path: "prediction/:symbol?",
    element: <LegacyPredictionRedirect />,
  },
  {
    path: "predict/:symbol?",
    element: <PredictionPage />,
  },
  {
    path: "portfolio",
    element: <PortfolioLayout />,
    children: [
      {
        index: true,
        element: <PortfolioPage />,
      },
      {
        path: "positions",
        element: <PositionsPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "assets",
        element: <AssetsPage />,
      },
      {
        path: "fee",
        element: <FeeTierPage />,
      },
      {
        path: "api-key",
        element: <APIKeyPage />,
      },
      {
        path: "setting",
        element: <SettingsPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
    ],
  },
  {
    path: "markets",
    element: <MarketsPage />,
  },
  {
    path: "leaderboard",
    element: <LeaderboardPage />,
  },
  {
    path: "rewards",
    element: <TradingRewardsLayout />,
    children: [
      {
        index: true,
        // /rewards => /rewards/affiliate
        element: <AffiliateRedirect />,
      },
      {
        path: "affiliate",
        element: <AffiliatePage />,
      },
    ],
  },
];

export function createAppRouter(routes: RouteObject[] = baseRoutes) {
  return createBrowserRouter([
    {
      path: "/",
      element: <OrderlyProvider />,
      children: [
        { index: true, element: <PerpsRedirect /> },
        {
          path: ":lang",
          children: [{ index: true, element: <PerpsRedirect /> }, ...routes],
        },
      ],
    },
  ]);
}
