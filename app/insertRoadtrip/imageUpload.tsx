"use client";

import { handleChangeFileType } from "app/lib/definitions";
import Image from "next/image";
import { ChangeEvent, MouseEvent, useRef, useState } from "react";

const style = {
  width: "100%",
};

const ImageUpload = ({
  handleChangeFile,
}: {
  handleChangeFile: handleChangeFileType;
}) => {
  const [preview, setPreview] = useState("/profilePrev.jpg");
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const onClickInput = (event: MouseEvent<HTMLImageElement>) => {
    hiddenInputRef.current?.click();
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const urlImage = URL.createObjectURL(file);
    setPreview(urlImage);
    handleChangeFile(event);
  };

  /* todo: only be able to select one image! */
  return (
    <div className="imageUpload">
      <Image
        src={preview}
        id="imagePreview"
        alt="preview"
        width={282}
        height={425}
        style={style}
      />
      <input
        type="file"
        name="file"
        hidden
        ref={hiddenInputRef}
        onChange={onChangeFile}
      />
      <Image
        src="/insertRoadtrip/BilderHochladen.jpg"
        alt="imageUpload"
        style={style}
        onClick={onClickInput}
        width={1259}
        height={370}
      />
    </div>
  );
};

export default ImageUpload;
