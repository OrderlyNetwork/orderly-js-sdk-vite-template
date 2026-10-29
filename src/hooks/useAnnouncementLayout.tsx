import { useLocation, useParams } from "react-router";
import { useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import { ChevronLeftIcon, Flex, Text, useScreen } from "@orderly.network/ui";
import { PathEnum } from "../constant";

export function useAnnouncementLayout() {
  const { slug } = useParams();
  const { search } = useLocation();
  const { onRouteChange } = useAppContext();
  const { t } = useTranslation();
  const { isMobile } = useScreen();

  const onBack = () => {
    const params = new URLSearchParams(search);
    params.delete("is_official");
    if (!slug) {
      params.delete("category");
      params.delete("source");
      params.delete("page");
    }
    const path = slug ? PathEnum.Announcement : PathEnum.Root;
    const query = params.toString();
    onRouteChange?.({
      href: query ? `${path}?${query}` : path,
      name: slug ? "announcement" : "perp",
      scope: "announcement",
    });
  };

  const topBar = isMobile ? (
    <Flex
      role="navigation"
      width="100%"
      height={44}
      px={3}
      itemAlign="center"
      justify="center"
      className="oui-relative"
    >
      <button
        type="button"
        onClick={onBack}
        className="oui-absolute oui-start-4 oui-flex oui-size-8 oui-items-center oui-justify-center oui-rounded oui-text-base-contrast-54"
      >
        <ChevronLeftIcon
          size={24}
          color="inherit"
          opacity={1}
          className="rtl:oui-rotate-180"
        />
      </button>
      <Text className="oui-text-base oui-font-bold oui-text-base-contrast">
        {t("notification.announcements")}
      </Text>
    </Flex>
  ) : undefined;

  return {
    topBar,
    classNames: {
      root: "lg:oui-overflow-y-scroll",
      content: isMobile
        ? "[&_.oui-announcement-center>h1]:oui-hidden [&_.oui-announcement-center]:oui-pt-0 [&_.oui-announcement-center>div]:oui-mt-0 [&_.oui-announcement-categories]:oui-py-2"
        : undefined,
    },
  };
}
