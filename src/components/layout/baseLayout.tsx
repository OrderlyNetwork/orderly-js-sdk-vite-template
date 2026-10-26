import { FC } from "react";
import { Scaffold, ScaffoldProps } from "@orderly.network/ui-scaffold";
import { PathEnum } from "../../constant";
import { useNav } from "../../hooks/useNav";
import { useScaffoldConfig } from "../../hooks/useScaffoldConfig";

export type BaseLayoutProps = {
  children: React.ReactNode;
  initialMenu?: string;
  classNames?: ScaffoldProps["classNames"];
};
export const BaseLayout: FC<BaseLayoutProps> = (props) => {
  const config = useScaffoldConfig();

  const { onRouteChange } = useNav();

  return (
    <Scaffold
      mainNavProps={{
        ...config.mainNavProps,
        initialMenu: props.initialMenu || PathEnum.Root,
      }}
      footerProps={config.footerProps}
      bottomNavProps={config.bottomNavProps}
      routerAdapter={{
        onRouteChange,
      }}
      classNames={props.classNames}
    >
      {props.children}
    </Scaffold>
  );
};
