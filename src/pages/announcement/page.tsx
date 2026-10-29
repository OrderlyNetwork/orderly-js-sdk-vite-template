import { useParams } from "react-router";
import { AnnouncementCenterPage } from "@orderly.network/ui-notification";
import { BaseLayout } from "../../components/layout";
import { PathEnum } from "../../constant";
import { useAnnouncementLayout } from "../../hooks/useAnnouncementLayout";

export default function AnnouncementPage() {
  const { slug } = useParams();
  const layoutProps = useAnnouncementLayout();
  return (
    <BaseLayout initialMenu={PathEnum.Announcement} {...layoutProps}>
      <AnnouncementCenterPage slug={slug} />
    </BaseLayout>
  );
}
