import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { useDropzone } from "react-dropzone";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";
import Pica from "pica";

// Internal imports
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError, notifySuccess } from "@/utils/toast";
import Container from "@/components/image-uploader/Container";
import UploadServices from "@/services/UploadServices";
import { normalizeImageUrl } from "@/utils/imageUtils";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const getUploadErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Failed to upload image";

const Uploader = ({
  setImageUrl,
  imageUrl,
  product,
  folder = "hautecouturejewellery",
  targetWidth = null,
  targetHeight = null,
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const pica = Pica(); // Initialize Pica instance
  const { globalSetting } = useUtilsFunction();

  const shouldResize =
    Number.isFinite(targetWidth) &&
    Number.isFinite(targetHeight) &&
    targetWidth > 0 &&
    targetHeight > 0;

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: product ? true : false,
    maxSize: 5242880, // 5 MB in bytes
    maxFiles: globalSetting?.number_of_image_per_product || 2,
    onDrop: async (acceptedFiles) => {
      const processedFiles = shouldResize
        ? await Promise.all(
            acceptedFiles.map((file) =>
              resizeImageToFixedDimensions(file, targetWidth, targetHeight),
            ),
          )
        : acceptedFiles;

      setFiles(
        processedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  const resizeImageToFixedDimensions = async (file, width, height) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    return new Promise((resolve) => {
      pica
        .resize(img, canvas, {
          unsharpAmount: 60,
          unsharpRadius: 0.5,
          unsharpThreshold: 1,
        })
        .then((result) => pica.toBlob(result, file.type, 0.95))
        .then((blob) => {
          const resizedFile = new File([blob], file.name, { type: file.type });
          resolve(resizedFile);
        });
    });
  };

  useEffect(() => {
    if (fileRejections && fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((e) => {
          if (e.code === "too-many-files") {
            notifyError(
              `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`,
            );
          } else if (e.code === "file-too-large") {
            notifyError(
              `File "${file.name}" is too large! Maximum size is 5 MB.`,
            );
          } else {
            notifyError(e.message);
          }
        });
      });
    }

    if (!files?.length) return;

    const uploadFiles = async () => {
      if (
        product &&
        imageUrl?.length + files?.length >
          globalSetting?.number_of_image_per_product
      ) {
        notifyError(
          `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`,
        );
        return;
      }

      try {
        setLoading(true);
        setError("Uploading....");

        const uploadedUrls = await Promise.all(
          files.map(async (file) => {
            const image = await fileToDataUrl(file);
            const res = await UploadServices.uploadImage({
              image,
              folder,
              fileName: file.name,
            });

            if (!res?.relativeUrl && !res?.secure_url) {
              throw new Error("Upload did not return an image URL");
            }

            return res.relativeUrl || res.secure_url;
          }),
        );

        notifySuccess("Image Uploaded successfully!");

        uploadedUrls.forEach((secureUrl) => {
          if (product) {
            setImageUrl((imgUrl) => [...imgUrl, secureUrl]);
          } else {
            setImageUrl(secureUrl);
          }
        });
      } catch (err) {
        console.error("err", err);
        notifyError(getUploadErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    uploadFiles();
  }, [files]);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-border w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  const handleRemoveImage = async (img) => {
    try {
      setLoading(false);
      notifyError("Image delete successfully!");
      if (product) {
        const result = imageUrl?.filter((i) => i !== img);
        setImageUrl(result);
      } else {
        setImageUrl("");
      }
    } catch (err) {
      console.error("err", err);
      notifyError(err?.message || "Failed to remove image");
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      <div
        className="border-2 border-border border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-primary" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-muted-foreground">{t("imageFormat")}</em>
      </div>

      <div className="text-primary">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {product ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !product && imageUrl ? (
          <div className="relative">
            <img
              className="inline-flex border rounded-md border-border w-24 max-h-24 p-2"
              src={normalizeImageUrl(imageUrl)}
              alt="product"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;
