import { IMedia } from '@/redux/service/media/type'
import Image from 'next/image'
import React from 'react'

type Props = {
  media: IMedia
}
const ImageCard = ({ media }: Props) => {
  return (
    <div className="group relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="aspect-square relative">
        {media.fileUrl ? (

          <Image
            src={media.fileUrl}
            alt={"Image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-xs text-gray-500">ছবি লোড হয়নি</span>
          </div>
        )}

      </div>

      {/* Info Footer */}
      <div className="p-2 bg-white dark:bg-gray-900">
        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
          Extension:{media.extension}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {(media.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  )
}

export default ImageCard