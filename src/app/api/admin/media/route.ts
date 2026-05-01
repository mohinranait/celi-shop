import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";

import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import { applyCloudinaryConfig } from "@/lib/loudinary";
import connectDB from "@/lib/db";
import Media from "@/models/media";
import { getAuthUser } from "@/lib/authUser";



export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const tempFilePath = path.join(os.tmpdir(), `${nanoid()}_${file.name}`);
    await writeFile(tempFilePath, buffer);

    
    await applyCloudinaryConfig()

    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "celi-app",
    });


    const { format, width, height, bytes: iBytes, secure_url, public_id } = result;

    await connectDB();
    const newMedia = await Media.create({
      fileUrl: secure_url,
      width,
      height,
      extension: format,
      size: iBytes,
      public_id,
      secure_url,
    })


    return NextResponse.json({
      success: true,
      payload: {
        file: newMedia,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}


// Get all images API
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await applyCloudinaryConfig()
    const decoded = await getAuthUser() as { id: string; phone: string };

    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Fetch media data
    const medias = await Media.find({});

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        medias,
      },
    });
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    await applyCloudinaryConfig()
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    // create media entry in database
    const media = await Media.findByIdAndDelete(id);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete existing media from Cloudinary
    if (media?.public_id) {
      await cloudinary.uploader.destroy(media.public_id);
    }
    
    
    return NextResponse.json({ message: 'Media deleted successfully', success: true, });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}