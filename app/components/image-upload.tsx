import { CloudArrowUpIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function ImageUpload({
  image,
  imageDescription,
}: {
  image: string;
  imageDescription: string;
}) {
  const [preview, setPreview] = useState("");
  return (
    <div className="w-28">
      {preview || image ? (
        <div>
          <img
            alt={imageDescription || ""}
            src={preview ? preview : image}
            className="mx-auto rounded-full w-20 h-20 object-cover"
          />
        </div>
      ) : null}

      <label htmlFor="file">
        {preview || image ? (
          <div className="cursor-pointer mb-2 text-sm text-gray-600 text-center font-bold text-center">
            replace image
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center  cursor-pointer">
            <CloudArrowUpIcon className="w-20 text-gray-800" />
            <span className="mb-2 text-sm text-gray-600 text-center">
              <span className="font-semibold block">
                {image ? "Replace  image" : "Add image"}{" "}
              </span>
            </span>
          </div>
        )}
        <input
          id="file"
          type="file"
          name="image"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setPreview(URL.createObjectURL(e?.target?.files[0]));
            }
          }}
        />
      </label>
    </div>
  );
}
