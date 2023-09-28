import {
  useCreateRoomMutation,
  useGetRoomsQuery,
} from "@/services/chatService";
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";

const AgentChat = ({ currentUser, onSetChatArr, socketClient }: any) => {
  const [userRoom, setUserRoom] = useState<any>();
  const { data } = useGetRoomsQuery(
    {
      username: currentUser?.username,
      id: currentUser?.id,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !(currentUser?.id && Boolean(currentUser?.type === "agent")),
    }
  );

  useEffect(() => {
    userRoom &&
      socketClient &&
      socketClient?.current?.emit("add-user", {
        roomId: userRoom._id,
        userData: currentUser.id,
      });
  }, [userRoom, socketClient]);

  const onJoinRoom = (item: any) => {
    setUserRoom(item);
  };

  return (
    <div>
      {data?.data?.map((item: any, index: number) => {
        return (
          <div key={index} onClick={() => onJoinRoom(item)}>
            {item.userId}
          </div>
        );
      })}
    </div>
  );
};

export default AgentChat;
