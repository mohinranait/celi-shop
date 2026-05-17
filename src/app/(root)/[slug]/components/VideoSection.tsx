"use client";


import VideoPlayer from "./VideoPlayer";

const VideoSection = ({ url}:{url:string}) => {

  // const getYoutubeThumbnail = (url: string) => {
  //   try {
  //     const urlObj = new URL(url);
  //     const urlId = urlObj.searchParams.get("v");

  //     if (!urlId) return null;

  //     return `https://img.youtube.com/vi/${urlId}/maxresdefault.jpg`;
  //   } catch {
  //     return null;
  //   }
  // };

  

  // const thumbnailUrl =
  //   getYoutubeThumbnail(url);

  // if (!thumbnailUrl) return null;

  return (
    <div className="relative h-75 overflow-hidden rounded-md md:h-130">
      <VideoPlayer src={url} loop={false} muted={true} playing={false} controls={false} className="h-75 md:h-130 rounded-md" />
  
    </div>
  );
};

export default VideoSection;