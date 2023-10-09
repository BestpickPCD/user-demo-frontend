import {
  useCreateRoomMutation,
  useGetMessageQuery,
  useGetRoomsQuery,
  useUpdateRoomMutation,
} from "@/services/chatService";
import { useCheckUserMutation } from "@/services/gamesService";

import { FilePresent } from "@mui/icons-material";
import { Box, Container, Tooltip, Typography, styled } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import BottomHandler from "./BottomHandler";
import Sended from "./Sended";
import Modals from "../Modals";
import ImageModal from "./ImageModal";

const CHAT_URL = process.env.NEXT_PUBLIC_API_CHAT_URL;
const Chat = () => {
  const socketClient = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<any>();
  const [imageLink, setImageLink] = useState<string>("");
  const [sentOrSeen, setSentOrSeen] = useState<"Sent" | "Seen" | "">("");
  const [roomId, setRoomId] = useState<any>();
  const router = useRouter();
  const [createRoom] = useCreateRoomMutation();

  const [chatArr, setChatArr] = useState<any[]>([]);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [updateRoom] = useUpdateRoomMutation();
  const [checkUser] = useCheckUserMutation();

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
  }, []);

  useEffect(() => {
    socketClient.current = io(String(process.env.NEXT_PUBLIC_API_CHAT_URL));
    if (currentUser) {
      const onCreateRoom = async (body: any) => {
        const response: any = await createRoom(body).unwrap();
        return response;
      };
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
        console.log(message);

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
        .then(() => {
          refetchRoom()
            .unwrap()
            .then((roomsData) => {
              if (roomsData?.data?.length > 0) {
                const room = roomsData?.data?.find(
                  (item: any) => item._id === roomId?._id
                );
                socketClient.current.emit("sent-or-seen", {
                  roomId: room?._id,
                  newGuestMessages:
                    currentUser.type === "player" ? 0 : room?.newGuestMessages,
                  newUserMessages:
                    currentUser.type === "agent" ? 0 : room?.newUserMessages,
                });
              }
            });
        });
    }
    socketClient?.current?.on("new-message", (message: any) => {
      refetchRoom();
    });
    if (currentUser) {
      socketClient?.current?.on("sent-or-seen", (data: any) => {
        setSentOrSeen(() => {
          if (currentUser?.type === "player") {
            if (data?.newUserMessages > 0) {
              return "Sent";
            }
            return "Seen";
          }
          if (data?.newGuestMessages > 0) {
            return "Sent";
          }
          return "Seen";
        });
      });
    }
  }, [roomId, currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      if (currentUser?.type === "player") {
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

  const onJoinRoom = (item: any) => {
    setRoomId(item);
  };

  const onOpenImageModal = (link: string) => {
    setImageLink(link);
  };
  console.log(imageLink);

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
      <Box width="20%" minWidth="200px" borderRight="1px solid gray">
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
            height="48px"
            maxHeight="48px"
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
      <Box width="80%" gap={1} height="calc(100vh - 170px)">
        <Box height="100%">
          <Box
            ref={scrollingDivRef}
            style={{
              height: "100%",
              maxHeight: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {chatArr.map((chat: any, index: number) => (
              <Box
                textAlign={`${chat?.self ? "right" : "left"}`}
                width="100%"
                key={index}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={0}
                  paddingX={2}
                  width="100%"
                  alignItems={`${chat?.self ? "flex-end" : "flex-start"}`}
                >
                  <Box width="80%" maxWidth="80%">
                    {chat?.text && (
                      <Tooltip
                        title={moment(chat.createdAt).format("HH:mm DD/MM")}
                        placement="left"
                        arrow
                      >
                        <Typography
                          width="max-content"
                          maxWidth="80%"
                          padding={"8px 20px"}
                          sx={{
                            background: "#5eb3ec",
                            float: chat?.self ? "right" : "left",
                          }}
                          color={"#fff"}
                          borderRadius={6}
                          textAlign={`${chat?.self ? "left" : "right"}`}
                        >
                          {chat?.text}
                        </Typography>
                      </Tooltip>
                    )}
                    <Tooltip
                      title={moment(chat.createdAt).format("HH:mm DD/MM")}
                      placement="left"
                      arrow
                    >
                      <Box
                        display="flex"
                        justifyContent={`${chat?.self ? "right" : "left"}`}
                        gap={0.5}
                        sx={{ float: chat?.self ? "right" : "left" }}
                      >
                        {chat?.images?.map((image: any, index: any) => (
                          <Box
                            borderRadius={"8px"}
                            overflow="hidden"
                            height={120}
                            key={`images-${index}`}
                            onClick={() =>
                              onOpenImageModal(`${CHAT_URL}/${image}`)
                            }
                          >
                            <Image
                              src={`${CHAT_URL}/${image}`}
                              alt="Upload image"
                              height={100}
                              width={100}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                              crossOrigin="anonymous"
                            />
                          </Box>
                        ))}
                        {chat?.files?.map((file: any, index: any) => (
                          <Link
                            href={`${CHAT_URL}/${file.path}`}
                            rel="noopener noreferrer"
                            target="_blank"
                            key={index}
                          >
                            <Box
                              key={index}
                              display="flex"
                              alignItems="center"
                              gap="4px"
                              padding={2}
                              borderRadius={2}
                              bgcolor="#ccc"
                            >
                              <FilePresent />
                              {file.name}
                            </Box>
                          </Link>
                        ))}
                      </Box>
                    </Tooltip>
                  </Box>
                  {index === chatArr.length - 1 && chat?.self && (
                    <Typography color="#B0B3B8" fontSize="14px">
                      <Sended
                        currentUser={currentUser}
                        socketClient={socketClient?.current}
                        chatArr={chatArr}
                        roomId={roomId}
                        sentOrSeen={sentOrSeen}
                      />
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          <BottomHandler
            currentUser={currentUser}
            roomId={roomId}
            socketClient={socketClient}
            roomsData={roomsData}
            updateRoom={updateRoom}
            refetchRoom={refetchRoom}
          />
        </Box>
      </Box>
      <ImageModal
        imageLink={imageLink}
        open={!!imageLink}
        onClose={() => setImageLink("")}
      />
    </Container>
  );
};

export default Chat;
