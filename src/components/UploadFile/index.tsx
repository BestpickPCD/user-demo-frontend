import { AttachFile, Image as MUIImage } from "@mui/icons-material";
import { Box, Container, Typography, styled } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
interface UploadFileProps {
  type: "images" | "files";
  convertedFiles: {
    files: any[];
    images: any[];
  };
  onSetUploadFile: (file: [File]) => void;
  onConvertedFile: (
    value: React.SetStateAction<{
      files: any[];
      images: any[];
    }>
  ) => void;
}

const fileFormatAccepted = ["csv", "xlsx", "xls", "docx", "text", "txt"];

const UploadFile = ({
  type = "images",
  convertedFiles,
  onSetUploadFile,
  onConvertedFile,
}: UploadFileProps): JSX.Element => {
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

  useEffect(() => {
    if (convertedFiles) {
      if (!convertedFiles.files && !convertedFiles.images) {
        setFiles([]);
      }
    }
  }, [convertedFiles]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      acceptedFiles.forEach((file: File) => {
        if (type === "images") {
          const reader = new FileReader();
          reader.onabort = () => console.log("file reading was aborted");
          reader.onerror = () => console.log("file reading has failed");

          reader.onload = () => {
            setFiles((prev) => [...prev, file]);
          };
          // reader.readAsArrayBuffer(file);
          reader.onloadend = () => {
            onConvertedFile((prev) => ({
              ...prev,
              images: [...prev.images, reader?.result],
            }));
          };
          reader.readAsDataURL(file);
        } else {
          const fileFormat = file?.name?.split(".")?.pop();
          if (fileFormat) {
            if (fileFormatAccepted.includes(fileFormat)) {
              setFiles((prev) => {
                return [...prev, file];
              });

              onConvertedFile &&
                onConvertedFile((rest: any) => ({
                  ...rest,
                  files: [...files, file].map((item) => item.name).slice(),
                }));
            }
          }
        }
      });
    },
    [type, files]
  );

  useEffect(() => {
    onSetUploadFile(files as any);
  }, [files]);

  const acceptMemo = useMemo(() => {
    const acceptedFiles = fileFormatAccepted.map((item) => `.${item}`);
    if (type === "images") {
      return { "image/*": [] } as Accept;
    }
    return {
      "text/plain": acceptedFiles,
      "application/vnd.ms-excel": acceptedFiles,
    };
  }, [type]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { ...acceptMemo },
  });

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} multiple={true} />
        {type === "files" ? <AttachFile /> : <MUIImage />}
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
