import { Image as MUIImage } from "@mui/icons-material";
import {
  Box,
  Container,
  ImageList,
  ImageListItem,
  Typography,
  styled,
} from "@mui/material";
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
  const [isDrops, setIsDrop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("dragover", (e) => {
        e.preventDefault();
        setIsDrop(true);
      });
      window.addEventListener("dragleave", () => {
        setIsDrop(false);
      });

      window.addEventListener("drop", () => {
        setIsDrop(false);
      });
    }
    return () => setIsDrop(false);
  }, []);

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
      {isDrops && (
        <UploadContainer {...getRootProps({ className: "dropzone" })}>
          <Box
            border={`1px dashed ${isDrops ? "#2196f3" : "#b4b7cf"}`}
            padding="36px 64px"
            className="box-inside"
          >
            <input {...getInputProps()} multiple={true} />
            <MUIImage
              sx={{
                width: "100%",
              }}
            />
            <Typography
              fontSize={25}
              marginTop={2}
              color={isDrops ? "#2196f3" : "#b4b7cf"}
            >
              Drop your pictures here
            </Typography>
          </Box>
        </UploadContainer>
      )}

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

const UploadContainer = styled(Container)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(56px);
  height: calc(100vh - 160px);
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border 0.24s ease-in-out;
  border-width: 2px;
  border-radius: 2px;
  border-color: #eeeeee;
  border-style: dashed;
  &:focus {
    border-color: #2196f3;
    .box-inside {
      border-color: #2196f3;
    }
  }
`;
