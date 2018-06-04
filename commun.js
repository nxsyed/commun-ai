"use strict";

let ChatEngineCore = require('chat-engine');
let typingIndicator = require('chat-engine-typing-indicator');


var ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-c-e1295433-4475-476d-9e37-4bdb84dacba0',
    subscribeKey: 'sub-c-890a0b26-6451-11e8-90b6-8e3ee2a92f04'
}, {
    globalChannel: 'assistant',
    debug: false
});

ChatEngine.connect('assistnant', { username: 'Commun' }, 'auth-key');

var chats = {};

ChatEngine.onAny((a) => {
    console.log(a)
})

ChatEngine.on('$.ready', (data) => {

    let me = data.me;

    me.direct.on('$.invite', (payload) => {

        var chat = chats[payload.data.channel];

        if (!chat) {

            chats[payload.data.channel] = new ChatEngine.Chat(payload.data.channel);

            chat = chats[payload.data.channel];

            chat.plugin(typingIndicator({
                timeout: 5000
            }));

            chat.emit('message', {
                text: 'hey, how can I help you?'
            });

            chat.on('message', (payload) => {

                if (payload.sender.uuid !== me.uuid) { // add to github issues

                    setTimeout((argument) => {

                        chat.typingIndicator.startTyping();

                        setTimeout((argument) => {

                            chat.emit('message', {
                                text: 'hey there ' + payload.sender.state.username
                            });

                            chat.typingIndicator.stopTyping(); // add this to plugin middleware

                        }, 1000);

                    }, 500);

                }

            });

        }

    });

});