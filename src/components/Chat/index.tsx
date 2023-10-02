import {
  useCreateRoomMutation,
  useGetMessageQuery,
  useGetRoomsQuery,
  useSaveChatMutation,
  useUpdateRoomMutation,
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
import Link from "next/link";
import { useClickOutside } from "@/utils/hooks";

const CHAT_URL = process.env.NEXT_PUBLIC_API_CHAT_URL;
const Chat = () => {
  const [chat, setChat] = useState<any>({
    text: "",
  });
  const socketClient = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<any>();
  const [setSendOrSeen, setSentOrSeen] = useState<"Sent" | "Seen" | "">("");
  const [roomId, setRoomId] = useState<any>();
  const router = useRouter();
  const [createRoom] = useCreateRoomMutation();
  const [saveChat] = useSaveChatMutation();
  const [uploadFile, setUploadFile] = useState<File[]>([]);
  const [chatArr, setChatArr] = useState<any[]>([]);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const [updateRoom] = useUpdateRoomMutation();
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

  const { data: roomsData, refetch: refetchRoom } = useGetRoomsQuery(
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
    if (typeof window !== "undefined") {
      window?.addEventListener("keydown", (e: any) => {
        if (e.key === "Escape") {
          hide();
        }
      });
    }
  }, []);

  const onCreateRoom = async (body: any) => {
    const response: any = await createRoom(body).unwrap();
    return response;
  };

  useEffect(() => {
    socketClient.current = io(String(process.env.NEXT_PUBLIC_API_CHAT_URL), {
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
      socketClient.current.on("messages-back", (message: any) => {
        setChatArr((prev) => [
          ...prev,
          {
            ...message,
            self: message.userId === currentUser.id,
          },
        ]);
      });
      updateRoom({
        roomId: roomId?._id,
        ...(currentUser.type === "player"
          ? { newGuestMessages: 0 }
          : { newUserMessages: 0 }),
      })
        .unwrap()
        .then((result) => {
          refetchRoom();
        });
    }
    socketClient?.current?.on("new-message", (message: any) => {
      refetchRoom();
    });
  }, [roomId, currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      if (currentUser?.type === "player") {
        console.log("vao day");

        socketClient.current.emit("add-user", {
          roomId: roomId?._id,
          userData: currentUser.id,
        });
      } else {
        if (roomsData && roomsData?.data?.length) {
          roomsData?.data?.map((item: any) =>
            socketClient.current.emit("add-user", {
              roomId: item?._id,
              userData: currentUser.id,
            })
          );
        }
      }
    }
  }, [currentUser, roomsData, roomId]);

  const handleChangeText = (e: any) => {
    setChat((prev: any) => ({
      ...prev,
      text: e?.target?.value,
    }));
  };

  const handleChat = async () => {
    if (Boolean(chat.text.trim() || uploadFile.length > 0)) {
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

      const room = roomsData?.data?.find(
        (item: any) => item._id === roomId._id
      );

      await updateRoom({
        roomId: roomId?._id,
        ...(currentUser.type === "player"
          ? { newUserMessages: room?.newUserMessages + 1 }
          : { newGuestMessages: room?.newGuestMessages + 1 }),
      })
        .unwrap()
        .then((data) => {
          socketClient.current.emit("new-messages", {
            [`${String(roomId._id)}`]: {
              roomId: roomId._id,
              newUserMessages: data?.data?.newUserMessages,
              newGuestMessages: data?.data?.newGuestMessages,
            },
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
    if (e.key === "Enter" && !e.shiftKey) {
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

  const onFocus = async () => {
    await updateRoom({
      roomId: roomId?._id,
      ...(currentUser.type === "player"
        ? { newGuestMessages: 0 }
        : { newUserMessages: 0 }),
    })
      .unwrap()
      .then((result) => {
        refetchRoom();
      });
  };

  useClickOutside(emojiRef, hide);

  return (
    <Container
      sx={{
        marginTop: 10,
        height: "calc(100vh - 90px)",
        display: "flex",
        padding: "10px 0",
        position: "relative",
        zIndex: "100",
      }}
      ref={parentRef}
    >
      <Box width="240px" maxWidth="100%" borderRight="1px solid gray">
        {roomsData?.data?.map((item: any, index: number) => (
          <Box
            key={index}
            onClick={() => onJoinRoom(item)}
            sx={{ background: "linear-gradient(to right, #5baddd, #b6e3f5)" }}
            marginRight="20px"
            padding="8px 12px"
            borderRadius="8px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="4px"
          >
            <Typography
              flex={1}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {currentUser?.type === "player"
                ? item?.guess?.name
                : item?.username}
            </Typography>
            {(currentUser?.type === "player"
              ? !!item?.newGuestMessages
              : !!item?.newUserMessages) && (
              <Typography
                textAlign="center"
                lineHeight="32px"
                height="32px"
                width="32px"
                borderRadius="100%"
                color="#fff"
                sx={{ background: "red" }}
              >
                {currentUser?.type === "player"
                  ? item?.newGuestMessages
                  : item?.newUserMessages}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex="1"
        gap={1}
        height="calc(100vh - 170px)"
      >
        <Box flex="1" height="100%" flexShrink={0}>
          <div
            ref={scrollingDivRef}
            style={{
              maxHeight: "100%",
              overflow: "auto",
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
                    {chat?.image?.map((image: any, index: any) => (
                      <Box
                        width={"33%"}
                        borderRadius={"8px"}
                        overflow="hidden"
                        height={120}
                        key={index}
                      >
                        <Link
                          href={`${CHAT_URL}/${image}`}
                          rel="noopener noreferrer"
                          target="_blank"
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
                            src={`${CHAT_URL}/${image}`}
                          />
                        </Link>
                      </Box>
                    ))}
                  </Box>
                  {index === chatArr.length - 1 && chat?.self && setSendOrSeen}
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
          zIndex={1}
        >
          {visible && (
            <div style={{ position: "absolute", bottom: "72px", left: "40px" }}>
              <Picker
                onEmojiSelect={handleSelectEmoji}
                theme="light"
                previewPosition="none"
              />
            </div>
          )}
          <div onClick={toggle} ref={emojiRef}>
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
              onFocus={onFocus}
              multiline={false}
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

// .unwrap()
// .then((data) => {
//   if (roomId?._id && data && data?.data?.length > 0) {
//     const room = data?.data?.find(
//       (item: any) => item._id === roomId._id
//     );
//     if (currentUser.type === "player") {
//       if (room.newUserMessages === 0) {
//         return setSentOrSeen("Seen");
//       }
//       return setSentOrSeen("Sent");
//     }
//     if (currentUser.type !== "player") {
//       if (room.newGuestMessages === 0) {
//         setSentOrSeen("Seen");
//       }
//       setSentOrSeen("Sent");
//     }
//   }
// });
