import React from 'react'
import image from "./helpers/oldFon.png"
import "./App.css"
import ChatPage from "./Chat/ChatPage";
import {HashRouter, Link, Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/redux-store";


function App() {
    return (
        <Provider store={store}>
        <HashRouter>
            <div className="App">

                <div>
                    <Routes>
                        <Route path="*" element={<div>
                            <img src={image} alt="background image"/>
                            <Link to='/chat'><button className={'chatButton'}>Чат студентов</button></Link>
                        </div>}/>
                        <Route path="/chat/*" element={<ChatPage/>}/>
                    </Routes>
                </div>
            </div>
        </HashRouter>
        </Provider>
    );
}

export default App;
