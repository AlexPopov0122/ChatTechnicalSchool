import {useDispatch, useSelector} from "react-redux";
import {TState} from "../redux/redux-store";
import React, {useEffect, useRef, useState} from "react";
import {ChatMessageAPIType} from "./ChatAPI";
import {sendMessage, startMessagesListening, stopMessagesListening} from "./ChatReducer";
import {Button, Flex} from "antd";
import cl from "./ChatPage.module.css"
import {NavLink, Outlet, redirect, useNavigate} from "react-router-dom";

const ChatPage: React.FC = () => {
    return <Flex vertical={false} justify={"center"} style={{margin: "30px 0"}}>
        <Chat/>
    </Flex>
}

const Chat: React.FC = () => {

    const dispatch = useDispatch()

    const status = useSelector((state: TState) => state.chat.status)

    useEffect(() => {
        // @ts-ignore
        dispatch(startMessagesListening())
        return () => {
        // @ts-ignore
            dispatch(stopMessagesListening())
        }
    }, [])

    return <div>
        {status === 'error' && <div>Some error occured. Please refresh the page</div>}
        <>
            <Messages/>
            <AddMessageForm/>
        </>
    </div>
}

const Messages: React.FC<{}> = ({}) => {
    const messages = useSelector((state: TState) => state.chat.messages)
    const messagesAnchorRef = useRef<HTMLDivElement>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true)

    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        if (Math.abs( (element.scrollHeight - element.scrollTop) - element.clientHeight ) < 300)
        {
            !isAutoScroll && setIsAutoScroll(true)
        } else {
            isAutoScroll && setIsAutoScroll(false)
        }
    }

    useEffect(() => {
        if (isAutoScroll) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
        }
    }, [messages])

    return <div className={cl.mainBlock} style={{height: '700px', overflowY: 'auto'}} onScroll={scrollHandler}>
        {messages.map((m: any) => <Message key={m.id} message={m}/>)}
        <div ref={messagesAnchorRef}></div>
    </div>
}


const Message: React.FC<{ message: ChatMessageAPIType }> = React.memo( ({message}) => {

    const avatarStyle: React.CSSProperties = {
        width: '45px',
        borderRadius: "50%",
        color: "blue"
    };

    return <div style={{borderBottom: "1px solid #eeeeee"}}>
        <Flex vertical={false} align={"center"} gap={"20px"} style={{margin: "15px"}}>
            <img src={message.photo} style={avatarStyle}/> <span style={{color: "#0879b1", fontWeight: "bold"}}>{message.userName}</span>
        </Flex>
        <div style={{textAlign: "start",  margin: "20px 15px", fontSize: "14px"}}>
            {message.message}
        </div>
    </div>
})


const AddMessageForm: React.FC<{}> = () => {
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()

    const status = useSelector((state: TState) => state.chat.status)


    const sendMessageHandler = () => {
        if (!message) {
            return
        }
        // @ts-ignore
        dispatch(sendMessage(message))
        setMessage('')
    }

    return <div style={{ textAlign: "left"}}>
        <span>
        <textarea placeholder='Write your message' className={cl.textarea} onChange={(e) => setMessage(e.currentTarget.value)} value={message}></textarea>
        <Button type={"primary"} className={cl.button} disabled={status !== 'ready'} onClick={sendMessageHandler}>Отправить</Button>
        </span>
        <div className={cl.backButton}>
            <NavLink to={"/"}><Button type={"primary"}>Назад</Button></NavLink>
        </div>
    </div>
}

export default ChatPage