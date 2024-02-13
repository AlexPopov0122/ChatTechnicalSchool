import {v1} from 'uuid'
import {ActionsTypes, BaseThunkType} from "../redux/redux-store";
import {chatAPI, ChatMessageAPIType, StatusType} from "./ChatAPI";
import {Dispatch} from "@reduxjs/toolkit";


type InitialStateType = typeof initialState
type ActionsType = ActionsTypes<typeof actions>
// @ts-ignore
type ThunkType = BaseThunkType<ActionsType | ReturnType<typeof stopSubmit>>
type ChatMessageType = ChatMessageAPIType & { id: string }


let initialState = {
    messages: [] as ChatMessageType[],
    status: 'pending' as StatusType
}

let chatReducer = (state = initialState, action: any): InitialStateType => {
    switch (action.type) {
        case 'SN/auth/MESSAGES_RECEIVED':
            return {
                ...state,
                messages: [...state.messages, ...action.payload.messages.map((m: any) => ({...m, id: v1()}))]
            }
        case 'SN/auth/STATUS_CHANGED':
            return {
                ...state,
                status: action.payload.status,
            }
        default:
            return state
    }
}

export const actions = {
    messagesReceived: (messages: ChatMessageAPIType[]) => ({
        type: 'SN/auth/MESSAGES_RECEIVED', payload: {messages}
    } as const),
    statusChanged: (status: StatusType) => ({
        type: 'SN/auth/STATUS_CHANGED', payload: {status}
    } as const)
}


let _newMessageHandler: ((messages: ChatMessageAPIType[]) => void) | null = null
const newMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_newMessageHandler === null) {
        _newMessageHandler = (messages) => {
            dispatch(actions.messagesReceived(messages))
        }
    }

    return _newMessageHandler
}

let _statusChangedHandler: ((status: StatusType) => void) | null = null
const statusChangedHandlerCreator = (dispatch: Dispatch) => {
    if (_statusChangedHandler === null) {
        _statusChangedHandler = (status) => {
            dispatch(actions.statusChanged(status))
        }
    }

    return _statusChangedHandler
}

export const startMessagesListening = (): ThunkType => async (dispatch) => {
    chatAPI.subscribe('messages-received', newMessageHandlerCreator(dispatch))
    chatAPI.subscribe('status-changed', statusChangedHandlerCreator(dispatch))
// @ts-ignore
    chatAPI.start()
}


export const stopMessagesListening = (): ThunkType => async (dispatch) => {
    chatAPI.unsubscribe('messages-received', newMessageHandlerCreator(dispatch))
    chatAPI.unsubscribe('status-changed', statusChangedHandlerCreator(dispatch))

    chatAPI.stop()
}

export const sendMessage = (message: string): ThunkType => async () => {
    chatAPI.sendMessage(message)
}


export default chatReducer