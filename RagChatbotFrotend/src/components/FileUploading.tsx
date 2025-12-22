import { useState } from "react";
import { uploading } from "../apiconfig/api";

const FilesUploading: React.FC = () => {

  const [files, setFiles] = useState<FileList | null>(null);

  const handleFile = async () => {

    if (!files) {
      alert("Please select a file first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("myFile", files[0]);

      const resp = await uploading(formData);
      console.log("File upload response", resp);

    } catch (error) {
      console.log("File upload error", error);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  }

  return <>

    <div className="flex items-center gap-2">
      <input
        className="border rounded-full p-2"
        type="file" onChange={handleFileChange} />
      <button onClick={handleFile} className=" text-white bg-blue-500 rounded-full hover:bg-black p-3">
        <strong>Upload File</strong>
      </button>
    </div>
  </>

}

export default FilesUploading