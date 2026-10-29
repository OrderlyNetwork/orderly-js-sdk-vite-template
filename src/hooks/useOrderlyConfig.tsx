import { useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { AppLogos } from "@orderly.network/react-app";
import { TradingPageProps } from "@orderly.network/trading";
import {
  AffiliateIcon,
  AssetIcon,
  BarChartIcon,
  BellIcon,
  EarnIcon,
  LeaderboardActiveIcon,
  LeaderboardInactiveIcon,
  MarketsActiveIcon,
  MarketsInactiveIcon,
  PersonIcon,
  PortfolioActiveIcon,
  PortfolioInactiveIcon,
  PredictionIcon,
  SettingFillIcon,
  SheetTitle,
  TradingActiveIcon,
  TradingIcon,
  TradingInactiveIcon,
} from "@orderly.network/ui";
import {
  BottomNavProps,
  FooterProps,
  MainNavWidgetProps,
} from "@orderly.network/ui-scaffold";
import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";
import TradeMenu from "../components/layout/customTradeSubMenu";
import { PathEnum } from "../constant";

export type OrderlyConfig = {
  orderlyAppProvider: {
    appIcons: AppLogos;
  };
  scaffold: {
    mainNavProps: MainNavWidgetProps;
    footerProps: FooterProps;
    bottomNavProps: BottomNavProps;
  };
  tradingPage: {
    tradingViewConfig: TradingPageProps["tradingViewConfig"];
    sharePnLConfig: TradingPageProps["sharePnLConfig"];
  };
};

const APP_ICONS: AppLogos = {
  main: {
    component: (
      <img
        className="orderly-app-logo"
        alt="Orderly logo"
        src="/images/orderly-logo.svg"
        style={{ width: 100, height: 40 }}
      />
    ),
  },
  secondary: {
    img: "/images/orderly-logo-secondary.svg",
  },
};

const FOOTER_PROPS: FooterProps = {
  telegramUrl: "https://orderly.network",
  discordUrl: "https://discord.com/invite/orderlynetwork",
  twitterUrl: "https://twitter.com/OrderlyNetwork",
};

const TRADING_VIEW_CONFIG: TradingPageProps["tradingViewConfig"] = {
  library_path: "",
};

const SHARE_PNL_CONFIG: TradingPageProps["sharePnLConfig"] = {
  backgroundImages: [
    "/images/pnl/poster_bg_1.png",
    "/images/pnl/poster_bg_2.png",
    "/images/pnl/poster_bg_3.png",
    "/images/pnl/poster_bg_4.png",
  ],
  color: "rgba(255, 255, 255, 0.98)",
  profitColor: "rgba(41, 223, 169, 1)",
  lossColor: "rgba(245, 97, 139, 1)",
  brandColor: "rgba(255, 255, 255, 0.98)",
  refLink: "https://orderly.network",
  refSlogan: "Orderly referral",
};

export const useOrderlyConfig = () => {
  const { t } = useTranslation();

  return useMemo<OrderlyConfig>(() => {
    return {
      scaffold: {
        mainNavProps: {
          mainMenus: [
            {
              name: t("common.trading"),
              href: PathEnum.Root,
              activeHrefs: [PathEnum.Prediction],
              isHomePageInMobile: true,
              customSubMenuRender: () => <TradeMenu />,
            },
            { name: t("common.portfolio"), href: PathEnum.Portfolio },
            { name: t("common.markets"), href: PathEnum.Markets },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: PathEnum.Leaderboard,
            },
            {
              name: t("tradingRewards.rewards"),
              href: PathEnum.Rewards,
              children: [
                {
                  name: t("common.affiliate"),
                  href: PathEnum.RewardsAffiliate,
                  tag: t("extend.affiliate.tag"),
                  description: t("extend.affiliate.description"),
                },
                {
                  name: t("extend.staking"),
                  href: "https://app.orderly.network/staking",
                  description: t("extend.staking.description"),
                  target: "_blank",
                  icon: <OrderlyIcon size={14} />,
                  activeIcon: <OrderlyActiveIcon size={14} />,
                },
              ],
            },
          ],
          initialMenu: PathEnum.Root,
          leftNav: {
            leading: <SheetTitle className="oui-sr-only">Orderly</SheetTitle>,
            menus: [
              {
                name: t("common.perps"),
                href: PathEnum.Root,
                icon: <TradingIcon />,
              },
              {
                name: t("common.predict"),
                href: PathEnum.Prediction,
                icon: <PredictionIcon size={20} monochrome />,
              },
              {
                name: t("common.portfolio"),
                href: PathEnum.Portfolio,
                icon: <PersonIcon />,
              },
              {
                name: t("common.markets"),
                href: PathEnum.Markets,
                icon: <BarChartIcon />,
              },
              {
                name: t("tradingLeaderboard.leaderboard"),
                href: PathEnum.Leaderboard,
                icon: <LeaderboardInactiveIcon />,
              },
              {
                name: t("notification.announcements"),
                href: PathEnum.Announcement,
                icon: (
                  <BellIcon color="inherit" opacity={0.8} viewBox="0 0 20 20" />
                ),
              },
              {
                name: t("common.assets"),
                href: PathEnum.Assets,
                icon: <AssetIcon />,
              },
              {
                name: t("affiliate.referral"),
                href: PathEnum.RewardsAffiliate,
                icon: <AffiliateIcon />,
                onlyInMainAccount: true,
              },
              {
                name: t("portfolio.setting"),
                href: PathEnum.Setting,
                icon: <SettingFillIcon color="white" opacity={0.8} />,
              },
              {
                name: t("extend.staking"),
                href: "https://app.orderly.network/staking",
                icon: <EarnIcon />,
                target: "_blank",
              },
              {
                name: t("portfolio.feeTier"),
                href: PathEnum.FeeTier,
                isSecondary: true,
              },
              {
                name: t("portfolio.apiKeys"),
                href: PathEnum.ApiKey,
                isSecondary: true,
              },
            ],
            ...FOOTER_PROPS,
          },
        },
        footerProps: FOOTER_PROPS,
        bottomNavProps: {
          mainMenus: [
            {
              name: t("common.markets"),
              href: PathEnum.Markets,
              activeIcon: <MarketsActiveIcon />,
              inactiveIcon: <MarketsInactiveIcon />,
            },
            {
              name: t("common.trading"),
              href: PathEnum.Root,
              activeIcon: <TradingActiveIcon />,
              inactiveIcon: <TradingInactiveIcon />,
            },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: PathEnum.Leaderboard,
              activeIcon: <LeaderboardActiveIcon />,
              inactiveIcon: <LeaderboardInactiveIcon />,
            },
            {
              name: t("common.portfolio"),
              href: PathEnum.Portfolio,
              activeIcon: <PortfolioActiveIcon />,
              inactiveIcon: <PortfolioInactiveIcon />,
            },
          ],
        },
      },
      orderlyAppProvider: {
        appIcons: APP_ICONS,
      },
      tradingPage: {
        tradingViewConfig: TRADING_VIEW_CONFIG,
        sharePnLConfig: SHARE_PNL_CONFIG,
      },
    };
  }, [t]);
};
