import {
  useCreateRoomMutation,
  useGetMessageQuery,
  useGetRoomsQuery,
  useSaveChatMutation,
} from "@/services/chatService";
import { useCheckUserMutation } from "@/services/gamesService";
import { useModal } from "@/utils/hooks";
import Picker from "@emoji-mart/react";
import { EmojiEmotions, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import UploadFile from "../UploadFile";
const Chat = () => {
  const [chat, setChat] = useState<any>({
    text: "",
  });
  const socketClient = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<any>();
  const [roomId, setRoomId] = useState<any>();
  const router = useRouter();
  const [createRoom] = useCreateRoomMutation();
  const [saveChat] = useSaveChatMutation();
  const [uploadFile, setUploadFile] = useState<File[]>([]);
  const [chatArr, setChatArr] = useState<any[]>([]);

  const [checkUser] = useCheckUserMutation();
  const { visible, toggle, hide } = useModal();
  const { data } = useGetMessageQuery(
    {
      id: currentUser?.id === "player" ? currentUser?.id : roomId?.userId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !(currentUser?.id && roomId?._id),
    }
  );
  const { data: roomsData } = useGetRoomsQuery(
    {
      username: currentUser?.username,
      id: currentUser?.id,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !currentUser?.id,
    }
  );

  const scrollingDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollingDivRef.current) {
      scrollingDivRef.current.scrollTop = scrollingDivRef.current.scrollHeight;
    }
  }, [chatArr]);

  useEffect(() => {
    if (!localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY || "")) {
      router.push("/login");
    } else {
      const localStorageData = JSON.parse(
        localStorage.getItem(
          process.env.NEXT_PUBLIC_LOCALHOST_KEY || ""
        ) as string
      );
      checkUser({ id: localStorageData?.id })
        .unwrap()
        .then((result) => {
          if (result) {
            return setCurrentUser(result.data);
          }
        });
    }
  }, []);

  const onCreateRoom = async (body: any) => {
    const response: any = await createRoom(body).unwrap();
    return response;
  };

  useEffect(() => {
    // socketClient.current = io("http://localhost:8080", {
    socketClient.current = io("https://chat-service-backend.onrender.com", {
      withCredentials: true,
    });
    if (currentUser) {
      if (currentUser.type === "player") {
        onCreateRoom({ ...currentUser }).then((result) => {
          setRoomId(result.data);
        });
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (data) {
      setChatArr((prev: any) => {
        return [
          ...data?.data?.map((item: any) => {
            return {
              ...item,
              self: item.userId === currentUser.id,
            };
          }),
          ...prev,
        ];
      });
    }
  }, [data, currentUser]);

  useEffect(() => {
    if (roomId?._id) {
      socketClient.current.emit("add-user", {
        roomId: roomId?._id,
        userData: currentUser.id,
      });
      socketClient.current.on("messages-back", (message: any) => {
        console.log(message);

        setChatArr((prev) => [
          ...prev,
          {
            ...message,
            self: message.userId === currentUser.id,
          },
        ]);
      });
    }
  }, [roomId]);

  const handleChangeText = (e: any) => {
    setChat((prev: any) => ({
      ...prev,
      text: e?.target?.value,
    }));
  };

  const handleChat = async () => {
    if (chat.text || uploadFile.length > 0) {
      const data: any = {
        text: chat.text,
        image: uploadFile,
        userId: currentUser.id,
        oldText: "",
        hasRead: false,
        isUpdated: false,
        isReply: false,
        status: "pending",
        roomId: roomId?._id,
      };
      const { image, ...rest } = data;
      const formData = new FormData();
      image.forEach((item: any) => formData.append("image", item));
      Object.keys(rest).forEach((item) => formData.append(item, data[item]));
      await saveChat(formData)
        .unwrap()
        .then((data) => {
          socketClient.current.emit("messages", {
            ...data.data,
          });
        });
      setChat((prev: any) => ({
        ...prev,
        text: "",
      }));
      setUploadFile([]);
      hide();
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      await handleChat();
    }
  };

  const handleSelectEmoji = (value: any) => {
    setChat((prev: any) => ({
      ...prev,
      text: prev.text + value.native,
    }));
  };

  const onJoinRoom = (item: any) => {
    setRoomId(item);
  };

  return (
    <Container
      sx={{
        marginTop: 10,
        height: "calc(100vh - 80px)",
        display: "flex",
        padding: "10px 0",
      }}
    >
      <Box width="200px" maxWidth="100%" borderRight="1px solid gray">
        {roomsData?.data?.map((item: any, index: number) => (
          <Box
            key={index}
            onClick={() => onJoinRoom(item)}
            sx={{ background: "linear-gradient(to right, #5baddd, #b6e3f5)" }}
            marginRight="20px"
            padding="8px 12px"
            borderRadius="8px"
          >
            <Typography>
              {currentUser?.type === "player"
                ? item?.guess?.name
                : item?.username}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        flex="1"
        gap={1}
      >
        <Box>
          <div
            ref={scrollingDivRef}
            style={{
              maxHeight: "100%",
              overflow: "auto",
              height: "calc(100vh - 80px - 90px)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {chatArr.map((chat: any, index: number) => (
              <Box
                textAlign={`${chat?.self ? "right" : "left"}`}
                width="100%"
                display="grid"
                gridTemplateColumns="1fr 1fr"
                gap={1.5}
                key={index}
              >
                <Box
                  gridColumn={chat?.self ? "2" : "1"}
                  display="flex"
                  flexDirection="column"
                  gap={0.5}
                  paddingX={2}
                  width="100%"
                >
                  {chat?.text && (
                    <Box
                      display="flex"
                      justifyContent={`${chat?.self ? "end" : "start"}`}
                    >
                      <Typography
                        width="max-content"
                        padding={"8px 16px"}
                        sx={{ background: "#5eb3ec" }}
                        color={"#fff"}
                        borderRadius={8}
                      >
                        {chat?.text}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent={`${chat?.self ? "flex-end" : "flex-start"}`}
                    gap={1}
                  >
                    {chat?.image?.map((image1: any, index: any) => (
                      <Box
                        width={"33%"}
                        borderRadius={"8px"}
                        overflow="hidden"
                        height={120}
                        key={index}
                      >
                        <Image
                          alt="123"
                          width={200}
                          height={300}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            maxWidth: "100%",
                          }}
                          src={`http://localhost:8080/${image1}`}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </div>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap="8px"
          paddingX={2}
          position="relative"
        >
          {visible && (
            <div style={{ position: "absolute", bottom: "72px", left: "40px" }}>
              <Picker
                onEmojiSelect={handleSelectEmoji}
                theme="light"
                previewPosition="none"
                navPosition="none"
              />
            </div>
          )}
          <div onClick={toggle}>
            <EmojiEmotions />
          </div>
          <UploadFile uploadFile={uploadFile} onSetUploadFile={setUploadFile} />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flex="1"
            gap="8px"
          >
            <CustomTextField
              value={chat?.text}
              onChange={handleChangeText}
              onKeyDown={handleKeyDown}
              fullWidth
              sx={{ borderRadius: "20%" }}
            />
            <Button
              onClick={handleChat}
              sx={{
                height: "40px",
                background: "#2c99e2",
                minWidth: "unset",
                borderRadius: "100%",
                width: "40px",
              }}
            >
              <Send style={{ color: "#fff" }} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat;

const CustomTextField = styled(TextField)(
  ({ theme }) => `
  .MuiInputBase-root {
    border-radius: 50px
  }
`
);
