import { Button } from '@/components/ui/button'
import { useDeleteMediaMutation } from '@/redux/service/media'
import { IMedia } from '@/redux/service/media/type'
import {  LoaderCircle, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

type Props = {
  media: IMedia
}
const ImageCard = ({ media }: Props) => {
  const [deleteMedia, { isLoading }] = useDeleteMediaMutation()

  const handleDelete = async () => {
    try {
      await deleteMedia(media._id).unwrap()
      toast.success("Delete Successfull")
    } catch (err: any) {

      let errorMessage = "Something went wrong.";

      if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  }

  return (
    <div className="group relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="aspect-square relative">
        <Button type='button' size={'icon'} onClick={handleDelete} disabled={isLoading} className='scale-0 group-hover:scale-100 absolute z-10 right-3 top-3'>
          {
            isLoading ? 
            <LoaderCircle className='animate-spin' /> : 
           <Trash2 /> 
          }
        </Button>
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
          Extension: {media.extension}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Size: {(media.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  )
}

export default ImageCard