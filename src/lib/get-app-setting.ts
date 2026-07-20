import { IAppSettings } from "@/models/app-setting";
import { cache } from "react";
import { fetchData } from "./fetch-data";

export const getAppSetting = cache(async () => {
  return await fetchData<IAppSettings>(
    {
      api: "admin/setting",
      revalidate: 60 * 60,
    },
    1
  );
});