import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatEngineCore from 'chat-engine';
import axios from 'axios';
import Clippy from 'react-clippy';

const now = new Date().getTime();
const username = ['user', now].join('-');

const ChatClient = ChatEngineCore.create({
    publishKey: 'pub-c-e1295433-4475-476d-9e37-4bdb84dacba0',
    subscribeKey: 'sub-c-890a0b26-6451-11e8-90b6-8e3ee2a92f04'
}, {
    globalChannel: 'watson-assistant'
});

const ChatBot = ChatEngineCore.create({
    publishKey: 'pub-c-e1295433-4475-476d-9e37-4bdb84dacba0',
    subscribeKey: 'sub-c-890a0b26-6451-11e8-90b6-8e3ee2a92f04'
}, {
    globalChannel: 'watson-assistant'
});

ChatClient.connect(username, {
    signedOnTime: now
});

ChatBot.connect(`${now}bot`, {
    signedOnTime: now
});

class Chat extends React.Component{

    constructor() {
        super();
        this.chat = new ChatClient.Chat(`${now}chat`);
        this.bot = new ChatBot.Chat(`${now}chat`);

        this.state = {
            reply: 'Ask Me Something!',
            chatInput: '',
            animation: 'Congratulate'
        };
    }

    setChatInput = (event) => {
        this.setState({
             chatInput: event.target.value
        });
    }

    sendChat = () => {

        if (this.state.chatInput) {
            this.chat.emit('message', {
                text: this.state.chatInput,
                channel: `${now}chat`
            });
            this.setState({ chatInput: '' })
            this.setState({
                animation: 'Processing',
                reply: ''
            });
        }
    }

    componentDidMount() {

        this.chat.on('message', (payload) => {
            const reply = payload;
            this.setState({ reply });
        });
        this.bot.on('message', (payload) => {
            axios.get(`https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-890a0b26-6451-11e8-90b6-8e3ee2a92f04/chat?question=${payload.data.text}`)
            .then(response => {
                this.setState({
                    animation: 'Writing',
                    reply: response.data
                });
            });
        });

    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.sendChat();
        }
    }

    render() {
        return ( 
            <div>
                <Clippy
                    actor={ 'Clippy' } 
                    animation={ this.state.animation }
                    speak={ this.state.reply } />
                <input id = "chat-input"
                    type = "text"
                    name = ""
                    value = { this.state.chatInput } onChange = { this.setChatInput } onKeyPress = { this.handleKeyPress } /> 
                <input type = "button"
                onClick = { this.sendChat } value = "Send Chat" />
            </div>
        );
    }
}

ChatClient.on('$.ready', () => {

    ReactDOM.render( 
        <Chat /> ,
        document.getElementById('root')
    );

});

ChatBot.on('$.ready', () => {

    ReactDOM.render( 
        <Chat /> ,
        document.getElementById('root')
    );

});