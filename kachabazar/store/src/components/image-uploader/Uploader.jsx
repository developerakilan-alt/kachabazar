import React, { useRef, useState } from "react";
import axios from "axios";
import { FiUploadCloud } from "react-icons/fi";
import { notifyError } from "@utils/toast";

const Uploader = ({ setImageUrl, imageUrl, multiple }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (uploading) return;

    if (multiple && Array.isArray(imageUrl) && imageUrl.length >= 4) {
      return notifyError("Maximum 4 images can be uploaded!");
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = () => {
      axios({
        url: "/api/uploads/image",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          image: reader.result,
          fileName: file.name,
          folder: "profile",
        },
      })
        .then((res) => {
          const url = res.data.relativeUrl;
          if (multiple) {
            setImageUrl((prev) => [...(prev || []), url]);
          } else {
            setImageUrl(url);
          }
          setPreview(null);
        })
        .catch((err) => {
          console.log(err);
          notifyError("Failed to upload image");
          setPreview(null);
        })
        .finally(() => setUploading(false));
    };
    reader.onerror = () => {
      notifyError("Failed to read file");
      setPreview(null);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (multiple) {
      Array.from(files).forEach(handleFile);
    } else {
      handleFile(files[0]);
    }
    e.target.value = "";
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const displayUrl = !multiple && (preview || imageUrl);

  return (
    <div className="w-full text-center">
      <div
        className="px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md cursor-pointer"
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple || false}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-primary" />
        </span>
        <p className="text-sm mt-2">
          {uploading ? "Uploading..." : "Drag or click to upload"}
        </p>
        <em className="text-xs text-muted-foreground">
          (Only *.jpeg, *.png, *.webp images will be accepted)
        </em>
      </div>
      <aside className="flex flex-row flex-wrap mt-4">
        {multiple && Array.isArray(imageUrl)
          ? imageUrl.map((img, i) => (
              <img
                key={i}
                className="inline-flex border rounded-md border-border w-24 max-h-24 p-2"
                src={img}
                alt=""
              />
            ))
          : displayUrl ? (
              <img
                className="inline-flex border rounded-md border-border w-24 max-h-24 p-2"
                src={displayUrl}
                alt=""
              />
            ) : null}
      </aside>
    </div>
  );
};

export default Uploader;
