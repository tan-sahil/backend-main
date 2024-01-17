/**cloudinary file over here is added in utility section as this will be used many imes like in user want to save pdf 
* he can use this service , if user want to save photoo again he can use this service so there are many use cases 
we can sasy thats why we are keeping it in the util section and nothing fency;
 */

/** this is written on assumption that we have file already available on the server or local storage once file is saved
 * in cloudinary it will be saved
 */
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
          

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
      });



// function for cloudinary upload, since it take time therefore async and can fail so will be wrapped in try catch;

const cloudinaryUploader = async (fileUploadPath) =>{
    try {
        if(!fileUploadPath) return null;
       const response = await  cloudinary.uploader.upload(fileUploadPath, {
            resource_type : 'auto'   // letting it decide by itself ki file ka type kya hai
            
        })
        /** url hai jo public hai */
        console.log("url of the cloudinary ", response.url);
        console.log("the complete response we got after uploading on cloudinary ", response);
        /** public file save ko unlik kr rhe hai */
        fs.unlinkSync(fileUploadPath)
        return response;
    } catch (error) {
        /** reaching here can point to two things first that file upload failed  and will have to unlink locally saved
         * file for cleaning purposes
         * unlinkSync mean that it must take place 
         */
        fs.unlinkSync(fileUploadPath)
        return null;
    }
}

export {cloudinaryUploader};