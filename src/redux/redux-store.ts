import chatReducer from "../Chat/ChatReducer";
import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";

const reducers = {
    chat: chatReducer
};


export const store = configureStore({
    reducer: {...reducers}
})
export type TState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type ActionsTypes<T> = T extends {[key: string]: (...arg: any[]) => infer U} ? U : never

export type BaseThunkType<A extends Action, R = void> = ThunkAction<R, TState, unknown, A>

// @ts-ignore
window.store = store;

export default store;