import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'di7o64yak', 
  api_key: '395578341736788', 
  api_secret: 'q0YjYx7CGDsVUO1doSMFfFaVfTg' 
});

const uploadImg = (fileToUploads) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUploads, { resource_type: "auto" }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: result.secure_url,
                });
            }
        });
    });
};


export {uploadImg};