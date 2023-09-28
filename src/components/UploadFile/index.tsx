import { Image as MUIImage } from "@mui/icons-material";
import { Box, ImageList, ImageListItem } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
interface UploadFileProps {
  uploadFile: File[];
  onSetUploadFile: (file: [File]) => void;
}
const UploadFile = ({
  uploadFile = [],
  onSetUploadFile,
}: UploadFileProps): JSX.Element => {
  const [imageUrl, setImageUrl] = useState<any>([]);
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        setFiles((prev) => [...prev, file]);
      };
      // reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        setImageUrl((prev: any) => [...prev, reader?.result] as any);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  useEffect(() => {
    onSetUploadFile(files as any);
  }, [files]);

  useEffect(() => {
    if (uploadFile.length && typeof uploadFile[0] === "string") {
      setImageUrl(uploadFile.map((file: any) => file) as any);
    }
    uploadFile.length === 0 && setImageUrl([]);
  }, [uploadFile]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} multiple={true} />
        <MUIImage />
      </Box>
      {imageUrl && (
        <ImageList
          cols={3}
          rowHeight={100}
          sx={{
            margin: "8px 0",
            position: "absolute",
            bottom: 60,
            left: "20px",
          }}
        >
          {imageUrl.map((image: string | undefined, index: number) => (
            <ImageListItem
              key={index}
              sx={{
                height: "100px",
                width: "100px",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <img
                src={image}
                alt="Uploaded Image"
                style={{
                  height: "100px",
                  width: "100px",
                  objectFit: "cover",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default UploadFile;

// const UploadContainer = styled(Container)`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 20px;
//   border-width: 2px;
//   border-radius: 2px;
//   border-color: #eeeeee;
//   border-style: dashed;
//   background-color: #fafafa;
//   color: #bdbdbd;
//   outline: none;
//   transition: border 0.24s ease-in-out;
//   cursor: pointer;
//   &:focus {
//     border-color: #2196f3;
//   }
// `;
