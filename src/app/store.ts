import { AuthService } from "@/services/authService";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { GamesService } from "@/services/gamesService";
import { ChatService } from "@/services/chatService";
import commonSlice from "./slices/commonSlices";
export const store = configureStore({
  reducer: {
    common: commonSlice,
    [AuthService.reducerPath]: AuthService.reducer,
    [GamesService.reducerPath]: GamesService.reducer,
    [ChatService.reducerPath]: ChatService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthService.middleware,
      GamesService.middleware,
      ChatService.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
