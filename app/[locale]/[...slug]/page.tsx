"use client";
import { useEffect, useState } from "react";
import { isNull } from "lodash";
import { getLandingPage } from "@/loaders";
import RenderComponents from "@/RenderComponents";
import { Page } from "@/types";
import { isDataInLiveEdit } from "@/utils";
import { NotFoundComponent, PageWrapper } from "@/components";
import { onEntryChange } from "@/config";
import useRouterHook from "@/hooks/useRouterHook";
import useScreenSize from "@/hooks/useScreenSize";
import { getMobileView } from "@/utils/getMobileView";

export default function LandingPage() {
  const [data, setData] = useState<Page.LandingPage["entry"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { path, locale } = useRouterHook();
  const screenSize = useScreenSize();
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(path);
        let res = await getLandingPage(path, locale);
        console.log(res);
        if (screenSize === "mobile") {
            res=getMobileView('components', res)
          console.log("mobile");
        }
        setData(res);
        if (!res && !isNull(res)) {
          throw "404";
        }
      } catch (err) {
        console.error("Error while fetching Landing page : ", err);
        setLoading(false);
      }
    };
    onEntryChange(fetchData);
  }, [path, screenSize]);

  return (
    <>
      {data ? (
        <PageWrapper {...data} contentType="landing_page">
          {data?.components && Object.keys(data.components)?.length ? (
            <RenderComponents components={data?.components} />
          ) : (
            ""
          )}
        </PageWrapper>
      ) : (
        <>{!loading && !isDataInLiveEdit() && <NotFoundComponent />}</>
      )}
    </>
  );
}
