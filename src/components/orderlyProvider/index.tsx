import { Outlet } from "react-router";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { useNav } from "../../hooks/useNav";
import { useOrderlyConfig } from "../../hooks/useOrderlyConfig";
import { usePageTitle } from "../../hooks/usePageTitle";
import { OrderlyLocaleProvider } from "./orderlyLocaleProvider";

export const OrderlyProvider = () => {
  const config = useOrderlyConfig();
  const { onRouteChange } = useNav();
  usePageTitle();

  return (
    <OrderlyLocaleProvider>
      <WalletConnectorProvider>
        <OrderlyAppProvider
          brokerId="orderly"
          brokerName="Orderly"
          networkId="testnet"
          appIcons={config.orderlyAppProvider.appIcons}
          onRouteChange={onRouteChange}
        >
          <Outlet />
        </OrderlyAppProvider>
      </WalletConnectorProvider>
    </OrderlyLocaleProvider>
  );
};
