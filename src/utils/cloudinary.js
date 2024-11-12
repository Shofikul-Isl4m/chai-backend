import {v2 as cloudinary} from "cloudinary"
import {extractPublicId} from "cloudinary-build-url"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        // Step 1: Get resource details to identify resource type
        const resourceInfo = await cloudinary.api.resource(publicId);
        const resourceType = resourceInfo.resource_type; // This can be 'image', 'video', or 'raw'

        // Step 2: Delete the file with the identified resource type
        const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

        
        
        return response;
    } catch (error) {
        console.error("Error managing file on Cloudinary:", error);
        return null;
    }
};



export {
    uploadOnCloudinary,
    deleteInCloudinary
}