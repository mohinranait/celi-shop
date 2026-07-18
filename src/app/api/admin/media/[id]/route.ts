import connectDB from "@/lib/db";
import { applyCloudinaryConfig } from "@/lib/loudinary";
import Media from "@/models/media";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await applyCloudinaryConfig()

    const { id } = await  params;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // create media entry in database
    const media = await Media.findByIdAndDelete(id);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete existing media from Cloudinary
    // console.log({media});
    
    if (media?.public_id) {
      // console.log("media pub_id", media?.public_id);
      await cloudinary.uploader.destroy(media.public_id);
    }
    
    
    return NextResponse.json({ message: 'Media deleted successfully', success: true, });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

