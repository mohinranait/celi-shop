"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { ReactPlayerProps } from "react-player/types";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

type Props = ReactPlayerProps & {
  className?: string;
};

const VideoPlayer = ({
  src,
  className,
  ...props
}: Props) => {
  return (
    <div className={cn("video-player", className)}>
      <ReactPlayer
        src={src}
        className="overflow-hidden"
        width="100%"
        height="100%"
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;