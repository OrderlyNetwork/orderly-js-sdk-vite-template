import { GeneralLeaderboardWidget } from "@orderly.network/trading-leaderboard";
import { BaseLayout } from "../../components/layout";
import { PathEnum } from "../../constant";

export default function LeaderboardPage() {
  return (
    <BaseLayout initialMenu={PathEnum.Leaderboard}>
      <div className="oui-py-6 oui-px-4 lg:oui-px-6 xl:oui-pl-4 lx:oui-pr-6">
        <GeneralLeaderboardWidget />
      </div>
    </BaseLayout>
  );
}
