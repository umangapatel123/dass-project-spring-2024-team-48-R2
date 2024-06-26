import React, { useState, useEffect, useRef } from "react";
import './Chat.css';
import axios from 'axios';

export default function Chat() {
    const [convo, setConvo] = useState([
        { user: 'Bot', text: "Hey! It's ColdBot here, whaddya want to know?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const convoRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            console.time('Getting Queries');
            const response = await axios.get('https://bed2bkcc2b.execute-api.ap-south-1.amazonaws.com/api/queries');
            console.timeEnd('Getting Queries');
            const array = JSON.parse(response.data);
            array.sort((a, b) => new Date(a.time) - new Date(b.time));
            const queries = array.map((item) => ({
                user: item.username,
                text: item.query,
            }));
            setConvo((prevConvo) => [...prevConvo, ...queries]);
        }
        fetchData();
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const input = userInput;

        if (input === '') {
            return;
        }
        setConvo((prevConvo) => [
            ...prevConvo,
            { user: 'User', text: input },
        ]);

        setUserInput('');

        console.time('Saving User Query');
        const response1 = await fetch('https://bed2bkcc2b.execute-api.ap-south-1.amazonaws.com/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                queryid: Math.floor(Math.random() * 1000000).toString(),
                username: 'User',
                query: input,
                time: new Date().toISOString(),
            }),
        });
        console.timeEnd('Saving User Query');

        // const response = await axios.get('https://bed2bkcc2b.execute-api.ap-south-1.amazonaws.com/api/random');
        console.time('Getting Bot Response');
        const response = await axios.get('https://bed2bkcc2b.execute-api.ap-south-1.amazonaws.com/api/random');
        console.timeEnd('Getting Bot Response');
        console.log(response);
        console.log(response.data);
        const botResponse = JSON.parse(response.data).response;
        setConvo((prevConvo) => [
            ...prevConvo,
            { user: 'Bot', text: botResponse },
        ]);


        console.time('Saving Bot Query');
        const response2 = await fetch('https://bed2bkcc2b.execute-api.ap-south-1.amazonaws.com/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                queryid: Math.floor(Math.random() * 1000000).toString(),
                username: 'Bot',
                query: botResponse,
                time: new Date().toISOString(),
            }),
        });
        console.timeEnd('Saving Bot Query');
    };

    useEffect(() => {
        if (convoRef.current) {
            convoRef.current.scrollTop = convoRef.current.scrollHeight;
        }
    }, [convo]);

    return (
        <div className="chatbot-container">
            <div id="header">
                <h1>Chat with ColdBot now!</h1>
            </div>
            <div id="chatbox">
                <div id="convo" ref={convoRef}>
                    {convo.map((message, index) => (
                        <div 
                            key={index} 
                            className={`chatbot-message ${message.user === 'Bot' ? 'chatbot' : 'user-message'}`}
                        >
                            <p className="chatbot-text">{message.text}</p>
                        </div>
                    ))}
                </div>
                <form id="user-input" autoComplete="off" onSubmit={handleFormSubmit}>
                    <div className="input-container">
                        <input 
                            id="user-input-field" 
                            type="text" 
                            placeholder="Type your message here" 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button 
                            id="submit-button" 
                            type="submit"
                        >
                            <img className="send-img" src="send-message.svg" alt="Send"/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
