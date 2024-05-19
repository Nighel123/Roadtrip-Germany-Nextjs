import bilderHochladen from "./BilderHochladen.jpg";
import profilePicTemp from "../profilePrev.jpg";

const style = {
  width: "100%",
};

const ImageUpload = () => {
  return (
    <div className="imageUpload">
      <img src={profilePicTemp} id="imagePreview" alt="preview" style={style} />
      <input
        src={bilderHochladen}
        type="image"
        alt="imageUpload"
        style={style}
      />
    </div>
  );
};

export default ImageUpload;
