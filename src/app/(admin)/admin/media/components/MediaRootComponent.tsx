'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadMedia from "./UploadMedia"
import { useGetMediasQuery } from "@/redux/service/media"
import ImageCard from "./ImageCard"
const MediaRootComponent = () => {
  const { data } = useGetMediasQuery('');
  const medias = data?.data.medias || []

  return (
    <div className="max-w-7xl mx-auto  space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Images</h1>
          <p className="text-muted-foreground text-sm">
            Manage your images easily
          </p>
        </div>
      </div>
      <div>
        <Tabs defaultValue="all-media" className="">
          <TabsList>
            <TabsTrigger value="all-media">All Media</TabsTrigger>
            <TabsTrigger value="upload">Upload Media</TabsTrigger>
          </TabsList>
          <TabsContent value="all-media">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {
                medias?.map((img) => <ImageCard key={img._id} media={img} />)
              }
            </div>
          </TabsContent>
          <TabsContent value="upload">
            <UploadMedia />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MediaRootComponent