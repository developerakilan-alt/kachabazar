import requests from "./httpService";

const UploadServices = {
  uploadImage: async (body) => {
    return requests.post("/uploads/image", body);
  },
};

export default UploadServices;
