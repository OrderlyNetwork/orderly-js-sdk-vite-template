const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { beforeEach, after, test } = require("node:test");
const ts = require("typescript");
const i18n = require("@orderly.network/i18n");
const utils = require("@orderly.network/utils");
const types = require("@orderly.network/types");

// Exercise host adapters with the installed SDK; replace router hooks, not SDK behavior.
function loadSource(file, mocks = {}) {
  const output = ts.transpileModule(
    fs.readFileSync(path.join(__dirname, "..", file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  const exports = {};
  new Function("require", "exports", output)((name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    return require(name);
  }, exports);
  return exports;
}

const initialWindow = global.window;
const initialStorage = global.localStorage;
const stored = new Map();
const navigations = [];
const opened = [];
const constants = loadSource("src/constant.ts");
const storage = loadSource("src/perpSymbolStorage.ts");
const navigationPaths = loadSource("src/navigationPaths.ts");
const nav = loadSource("src/hooks/useNav.ts", {
  react: { useCallback: (fn) => fn },
  "react-router": {
    useNavigate: () => (href, options) =>
      navigations.push({ href, ...options }),
  },
  "@orderly.network/portfolio": {
    PortfolioLeftSidebarPath: {
      FeeTier: "/portfolio/feeTier",
      ApiKey: "/portfolio/apiKey",
    },
  },
  "../constant": constants,
  "../navigationPaths": navigationPaths,
  "../perpSymbolStorage": storage,
});

beforeEach(() => {
  stored.clear();
  navigations.length = 0;
  opened.length = 0;
  global.localStorage = {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
    removeItem: (key) => stored.delete(key),
  };
  global.window = {
    location: {
      pathname: "/zh/predict",
      search: "?ref=demo",
      hash: "#account",
    },
    open: (...args) => opened.push(args),
  };
});
after(() => {
  if (initialWindow === undefined) delete global.window;
  else global.window = initialWindow;
  if (initialStorage === undefined) delete global.localStorage;
  else global.localStorage = initialStorage;
});

const navigate = (option) => nav.useNav().onRouteChange(option);

test("round navigation preserves URL locale, query, hash and replace", () => {
  navigate(
    types.predictionRoute("PERP_BTC5M2610261055_USDC", { replace: true }),
  );
  assert.deepEqual(navigations, [
    {
      href: "/zh/predict/PERP_BTC5M2610261055_USDC?ref=demo#account",
      replace: true,
    },
  ]);
});

test("destination query and hash replace independently, even with ? inside the hash", () => {
  navigate({ href: "/prediction?market=btc" });
  navigate({ href: "/prediction#round?details" });
  assert.equal(navigations[0].href, "/zh/predict?market=btc#account");
  assert.equal(navigations[1].href, "/zh/predict?ref=demo#round?details");
});

test("explicit empty query and hash clear inherited values", () => {
  navigate({ href: "/prediction?#" });
  const url = new URL(navigations[0].href, "http://localhost");
  assert.equal(url.search, "");
  assert.equal(url.hash, "");
});

test("Portfolio aliases also work when a destination has query and hash", () => {
  navigate({ href: "/portfolio/feeTier?tab=fees#tier" });
  navigate({ href: "/portfolio/apiKey" });
  assert.equal(navigations[0].href, "/zh/portfolio/fee?tab=fees#tier");
  assert.equal(navigations[1].href, "/zh/portfolio/api-key?ref=demo#account");
});

test("already localized destinations receive only one locale prefix", () => {
  navigate({ href: "/en/prediction" });
  assert.equal(navigations[0].href, "/en/predict?ref=demo#account");
});

test("external links preserve their destination without router navigation", () => {
  navigate({ href: "https://app.orderly.network/staking", target: "_blank" });
  assert.deepEqual(opened, [
    ["https://app.orderly.network/staking", "_blank", "noopener,noreferrer"],
  ]);
  assert.equal(navigations.length, 0);
});

test("root navigation restores the SDK-managed Perps market", () => {
  utils.setStoredPerpSymbol("PERP_SOL_USDC");
  navigate({ href: "/", replace: true });
  assert.deepEqual(navigations, [
    { href: "/zh/perp/PERP_SOL_USDC?ref=demo#account", replace: true },
  ]);
  assert.equal(utils.getStoredPerpSymbol(), "PERP_SOL_USDC");
});

test("Binary rounds cannot become the remembered Perps market", () => {
  stored.set(utils.PERP_SYMBOL_STORAGE_KEY, "PERP_BTC5M2610261055_USDC");
  assert.equal(storage.getPerpSymbol(), storage.DEFAULT_SYMBOL);
  assert.equal(stored.has(utils.PERP_SYMBOL_STORAGE_KEY), false);
  storage.setPerpSymbol("PERP_SOL_USDC");
  storage.setPerpSymbol("PERP_BTC5M2610261055_USDC");
  assert.equal(storage.getPerpSymbol(), "PERP_SOL_USDC");
});

test("blocked or missing browser storage falls back without throwing", () => {
  global.localStorage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
    removeItem() {
      throw new Error("blocked");
    },
  };
  assert.equal(storage.getPerpSymbol(), storage.DEFAULT_SYMBOL);
  assert.doesNotThrow(() => storage.setPerpSymbol("PERP_BTC_USDC"));
  delete global.localStorage;
  assert.equal(storage.getPerpSymbol(), storage.DEFAULT_SYMBOL);
});

test("all Perps entry redirects read current location and preference at render time", () => {
  const routeComponents = loadSource("src/routes.tsx", {
    "react-router": {
      Navigate: () => null,
      RouterProvider: () => null,
      useLocation: () => global.window.location,
    },
    "@orderly.network/ui": { Spinner: () => null },
    "./perpSymbolStorage": storage,
    "./navigationPaths": navigationPaths,
  });
  const routerModule = loadSource("src/appRouter.tsx", {
    "./routes": routeComponents,
    "react-router": {
      Navigate: () => null,
      RouterProvider: () => null,
      useLocation: () => global.window.location,
      createBrowserRouter: (routes) => routes,
    },
    "@orderly.network/ui": { Spinner: () => null },
    "./components/layout": {
      PortfolioLayout: () => null,
      TradingRewardsLayout: () => null,
    },
    "./components/orderlyProvider": { OrderlyProvider: () => null },
    "./perpSymbolStorage": storage,
    "./navigationPaths": navigationPaths,
  });
  const tree = routerModule.createAppRouter();
  const redirects = [
    tree[0].children[0],
    tree[0].children[1].children[0],
    routerModule.baseRoutes[0].children[0],
  ];
  for (const route of redirects) {
    let result = route.element.type();
    assert.equal(result.props.to, "/zh/perp/PERP_ETH_USDC?ref=demo#account");
    assert.equal(result.props.replace, true);
  }
  utils.setStoredPerpSymbol("PERP_SOL_USDC");
  global.window.location = {
    pathname: "/en",
    search: "?next=1",
    hash: "#wallet",
  };
  for (const route of redirects) {
    assert.equal(
      route.element.type().props.to,
      "/en/perp/PERP_SOL_USDC?next=1#wallet",
    );
  }
  assert.equal(
    routerModule.baseRoutes.filter((r) => r.path === "prediction/:symbol?")
      .length,
    1,
  );
});

test("Prediction passes the exact URL contract and falls back only when disabled", () => {
  let enabled = true;
  const effects = [];
  const page = loadSource("src/pages/prediction/page.tsx", {
    react: { useEffect: (fn) => effects.push(fn) },
    "react-router": {
      useParams: () => ({ symbol: "PERP_BTC5M2610261055_USDC" }),
    },
    "@orderly.network/prediction": { PredictionPage: () => null },
    "@orderly.network/react-app": { useFeatureEnabled: () => enabled },
    "../../components/layout": { BaseLayout: () => null },
    "../../hooks/useNav": nav,
    "../../perpSymbolStorage": storage,
  }).default;
  assert.equal(page().props.children.props.symbol, "PERP_BTC5M2610261055_USDC");
  effects.splice(0).forEach((fn) => fn());
  assert.equal(navigations.length, 0);
  enabled = false;
  assert.equal(page(), null);
  effects.splice(0).forEach((fn) => fn());
  assert.deepEqual(navigations, [
    { href: "/zh/perp/PERP_ETH_USDC?ref=demo#account", replace: true },
  ]);
});

test("Perps follows incoming URL params and delegates market navigation to the SDK", () => {
  let symbol = "PERP_ETH_USDC";
  const effects = [];
  const page = loadSource("src/pages/perp/page.tsx", {
    react: { useEffect: (fn) => effects.push(fn) },
    "react-router": { useParams: () => ({ symbol }) },
    "@orderly.network/trading": { TradingPage: () => null },
    "../../components/layout": { BaseLayout: () => null },
    "../../hooks/useOrderlyConfig": {
      useOrderlyConfig: () => ({ tradingPage: {} }),
    },
    "../../perpSymbolStorage": storage,
  }).default;
  assert.equal(page().props.children.props.symbol, "PERP_ETH_USDC");
  effects.splice(0).forEach((fn) => fn());
  symbol = "PERP_SOL_USDC";
  const tradingPage = page().props.children;
  assert.equal(tradingPage.props.symbol, "PERP_SOL_USDC");
  effects.splice(0).forEach((fn) => fn());
  assert.equal(storage.getPerpSymbol(), "PERP_SOL_USDC");
  assert.equal(tradingPage.props.onSymbolChange, undefined);
  assert.equal(navigations.length, 0);
});

test("bootstrap redirects unlocalized URLs before creating or mounting a router", () => {
  const redirects = [];
  const renders = [];
  let created = 0;
  const mocks = {
    "react-dom/client": {
      createRoot: () => ({ render: (value) => renders.push(value) }),
    },
    "./appRouter": {
      createAppRouter: () => {
        created++;
        return {};
      },
    },
    "./routes": { default: () => null },
    "./perpSymbolStorage": storage,
    "./navigationPaths": navigationPaths,
    "./styles/index.css": {},
  };
  global.window.location = {
    pathname: "/prediction/PERP_BTC5M2610261005_USDC",
    search: "?ref=demo",
    hash: "#account",
    replace: (url) => redirects.push(url),
  };
  loadSource("src/index.tsx", mocks);
  const locale = i18n.parseI18nLang(i18n.i18n.language);
  assert.deepEqual(redirects, [
    `/${locale}/predict/PERP_BTC5M2610261005_USDC?ref=demo#account`,
  ]);
  assert.equal(created, 0);
  assert.equal(renders.length, 0);
});

test("Portfolio leaves market navigation to the SDK and shares host PnL configuration", () => {
  const sharePnLConfig = {
    refLink: "https://orderly.network",
    backgroundImages: ["/images/pnl/poster_bg_1.png"],
  };
  const mocks = {
    "@orderly.network/portfolio": {
      PositionsModule: { PositionsPage: () => null },
      OrdersModule: { OrdersPage: () => null },
    },
    "@orderly.network/trading": {
      useTradingLocalStorage: () => ({
        pnlNotionalDecimalPrecision: 2,
        unPnlPriceBasis: "markPrice",
      }),
    },
    "@orderly.network/ui": { Box: () => null },
    "../../../hooks/useOrderlyConfig": {
      useOrderlyConfig: () => ({ tradingPage: { sharePnLConfig } }),
    },
  };
  const positions = loadSource(
    "src/pages/portfolio/positions/page.tsx",
    mocks,
  ).default().props.children;
  const orders = loadSource(
    "src/pages/portfolio/orders/page.tsx",
    mocks,
  ).default().props.children;
  assert.equal(positions.props.onSymbolChange, undefined);
  assert.equal(positions.props.onPredictionSelect, undefined);
  assert.equal(positions.props.sharePnLConfig, sharePnLConfig);
  assert.equal(orders.props.sharePnLConfig, sharePnLConfig);
  assert.equal(navigations.length, 0);
  assert.equal(stored.size, 0);
});

test("mobile navigation retains existing destinations and hides Prediction only when disabled", () => {
  const scaffold = {
    mainNavProps: {
      initialMenu: "/",
      leftNav: {
        menus: [
          { href: "/", name: "Trade" },
          { href: "/predict", name: "Predict" },
          { href: "/portfolio", name: "Portfolio" },
          { href: "/markets", name: "Markets" },
        ],
        twitterUrl: "https://twitter.com/OrderlyNetwork",
      },
    },
    bottomNavProps: {
      mainMenus: [
        { href: "/markets" },
        { href: "/" },
        { href: "/leaderboard" },
        { href: "/portfolio" },
      ],
    },
  };
  let enabled = true;
  const config = loadSource("src/hooks/useScaffoldConfig.ts", {
    react: { useMemo: (fn) => fn() },
    "@orderly.network/react-app": { useFeatureEnabled: () => enabled },
    "../constant": constants,
    "./useOrderlyConfig": { useOrderlyConfig: () => ({ scaffold }) },
  }).useScaffoldConfig;
  assert.equal(
    config().mainNavProps.leftNav.menus.filter(
      (item) => item.href === "/predict",
    ).length,
    1,
  );
  enabled = false;
  const disabled = config();
  assert.deepEqual(
    disabled.mainNavProps.leftNav.menus.map((item) => item.href),
    ["/", "/portfolio", "/markets"],
  );
  assert.equal(disabled.bottomNavProps, scaffold.bottomNavProps);
  assert.equal(
    disabled.mainNavProps.leftNav.twitterUrl,
    scaffold.mainNavProps.leftNav.twitterUrl,
  );
  assert.equal(scaffold.mainNavProps.leftNav.menus.length, 4);
  enabled = true;
  assert.equal(config().mainNavProps.leftNav.menus.length, 4);
});

test("page titles append the brand once across Perps, Prediction and Portfolio", () => {
  let path = "/perp/PERP_ETH_USDC";
  let symbol = "PERP_ETH_USDC";
  const originalDocument = global.document;
  global.document = { title: "" };
  try {
    const useTitle = loadSource("src/hooks/usePageTitle.ts", {
      react: { useEffect: (fn) => fn() },
      "react-router": { useParams: () => ({ symbol }) },
      "../constant": constants,
      "../utils": loadSource("src/utils.ts"),
      "./usePathWithoutLang": { usePathWithoutLang: () => path },
    }).usePageTitle;
    for (const [nextPath, nextSymbol, expected] of [
      ["/perp/PERP_ETH_USDC", "PERP_ETH_USDC", "ETH-PERP | Orderly"],
      ["/perp/PERP_BTC_USDC", "PERP_BTC_USDC", "BTC-PERP | Orderly"],
      ["/predict", undefined, "Predict | Orderly"],
      [
        "/predict/PERP_BTC5M2610261055_USDC",
        "PERP_BTC5M2610261055_USDC",
        "Predict | Orderly",
      ],
      ["/portfolio/positions", undefined, "Positions | Orderly"],
    ]) {
      path = nextPath;
      symbol = nextSymbol;
      useTitle();
      assert.equal(global.document.title, expected);
    }
  } finally {
    if (originalDocument === undefined) delete global.document;
    else global.document = originalDocument;
  }
});

test("Trade menu uses canonical paths and only forwards Perps symbols after mounting", () => {
  const React = require("react");
  const { act, create } = require("react-test-renderer");
  let path;
  const Widget = () => null;
  const menu = loadSource("src/components/layout/customTradeSubMenu.tsx", {
    "@orderly.network/markets": { TradeSubMenuWidget: Widget },
    "../../constant": constants,
    "../../hooks/usePathWithoutLang": { usePathWithoutLang: () => path },
  }).default;
  for (const [nextPath, expectedSymbol, activeKey] of [
    ["/perp/PERP_BTC_USDC", "PERP_BTC_USDC", "perps"],
    ["/predict", undefined, "prediction"],
    ["/predict/PERP_BTC5M2610261055_USDC", undefined, "prediction"],
    ["/markets", undefined, "perps"],
    ["/predictish", undefined, "perps"],
  ]) {
    path = nextPath;
    let root;
    act(() => {
      root = create(React.createElement(menu));
    });
    const props = root.root.findByType(Widget).props;
    assert.equal(props.symbol, expectedSymbol);
    assert.equal(props.activeKey, activeKey);
    act(() => root.unmount());
  }
});

test("legacy redirect preserves encoded paths and URL suffixes using replacement", () => {
  const routes = loadSource("src/routes.tsx", {
    "react-router": {
      Navigate: () => null,
      RouterProvider: () => null,
      useLocation: () => ({
        pathname: "/zh/prediction/BTC%2F5M%25",
        search: "?ref=demo",
        hash: "#orders",
      }),
    },
    "@orderly.network/ui": { Spinner: () => null },
    "./perpSymbolStorage": storage,
    "./navigationPaths": navigationPaths,
  });
  const result = routes.LegacyPredictionRedirect();
  assert.equal(result.props.to, "/zh/predict/BTC%2F5M%25?ref=demo#orders");
  assert.equal(result.props.replace, true);
});

test("legacy migration does not rewrite unrelated path segments", () => {
  for (const path of [
    "/predictionish",
    "/portfolio/prediction",
    "/predict/BTC",
  ]) {
    assert.equal(navigationPaths.migratePredictionPath(path), path);
  }
  assert.equal(
    navigationPaths.migratePredictionPath("/prediction/BTC%2F5M%25?x=1#orders"),
    "/predict/BTC%2F5M%25?x=1#orders",
  );
});
