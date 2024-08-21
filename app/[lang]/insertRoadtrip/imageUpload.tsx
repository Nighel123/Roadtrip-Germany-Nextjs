"use client";

import { handleChangeFileType, RoadtripDisplay } from "lib/definitions";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { Dict } from "../dictionaries";

const style = {
  width: "100%",
};

const ImageUpload = ({
  roadtrip,
  handleChangeFile,
  dict,
}: {
  handleChangeFile: handleChangeFileType;
  roadtrip: RoadtripDisplay | null;
  dict: Dict;
}) => {
  const { insertRoadtrip } = dict;
  const [preview, setPreview] = useState(
    roadtrip ? roadtrip.image_url : "/images/profilePrev.jpg"
  );
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const onClickInput = () => {
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
        data-testid="file"
        hidden
        ref={hiddenInputRef}
        onChange={onChangeFile}
      />
      <Image
        src={insertRoadtrip.uploadImageButton}
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
