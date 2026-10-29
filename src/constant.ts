import enLocale from "@orderly.network/i18n/locales/en.json";

export enum PathEnum {
  Root = "/",
  Perp = "/perp",
  Prediction = "/predict",
  Announcement = "/announcement",

  Portfolio = "/portfolio",
  Positions = "/portfolio/positions",
  Orders = "/portfolio/orders",
  Assets = "/portfolio/assets",
  FeeTier = "/portfolio/fee",
  ApiKey = "/portfolio/api-key",
  Setting = "/portfolio/setting",
  History = "/portfolio/history",

  Markets = "/markets",
  Leaderboard = "/leaderboard",

  Rewards = "/rewards",
  RewardsTrading = "/rewards/trading",
  RewardsAffiliate = "/rewards/affiliate",
}

export const PageTitleMap = {
  [PathEnum.Announcement]: enLocale["notification.centerTitle"],
  [PathEnum.Prediction]: "Predict",
  [PathEnum.Portfolio]: "Portfolio",
  [PathEnum.FeeTier]: "Fee tier",
  [PathEnum.ApiKey]: "API keys",
  [PathEnum.Orders]: "Orders",
  [PathEnum.Assets]: "Assets",
  [PathEnum.Positions]: "Positions",
  [PathEnum.Setting]: "Settings",
  [PathEnum.History]: "History",
  [PathEnum.Markets]: "Markets",
  [PathEnum.Leaderboard]: "Leaderboard",
  [PathEnum.RewardsTrading]: "Trading Rewards",
  [PathEnum.RewardsAffiliate]: "Affiliate program",
};
