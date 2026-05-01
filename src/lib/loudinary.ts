
import AppModel from '@/models/app-config';
import { v2 as cloudinary } from 'cloudinary';


export const applyCloudinaryConfig = async () => {
  const config = await AppModel.findOne();

  if (!config || !config.cloudinary?.status) {
    throw new Error("Cloudinary is not configured or disabled");
  }

  return cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.key,
    api_secret: config.cloudinary.secret,
  });
};