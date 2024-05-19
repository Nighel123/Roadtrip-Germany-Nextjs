import Image from "next/image";

const style = {
  width: "100%",
};

const ImageUpload = () => {
  return (
    <div className="imageUpload">
      <Image
        src="/profilePrev.jpg"
        id="imagePreview"
        alt="preview"
        width={282}
        height={425}
        style={style}
      />
      <input
        src="/insertRoadtrip/BilderHochladen.jpg"
        type="image"
        alt="imageUpload"
        style={style}
      />
    </div>
  );
};

export default ImageUpload;
