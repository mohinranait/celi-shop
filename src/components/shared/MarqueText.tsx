'use client';

import { useGetAppSettingQuery } from "@/redux/service/setting";
import Marquee from "react-fast-marquee";

const MarqueText =  () => {

   const {data:appSetting} = useGetAppSettingQuery()


  return (
    <>
      {appSetting?.marque ? (
        <div className="h-8 bg-foreground  text-background py-2 px-4 text-sm flex items-center justify-center ">
          <Marquee
            speed={40}
            gradient={false}
            pauseOnHover={true}
            pauseOnClick={true}
          >
            <span className="mr-32  md:mr-12 lg:mr-16 xl:mr-20">
              {appSetting?.marque}
            </span>
          </Marquee>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default MarqueText;