/* eslint-disable react/jsx-no-target-blank */
import React, { FunctionComponent, useState, useRef } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Message } from '../../../libs/signaling';
import UploadFileChat from '../../../components/UploadFileChat';

const Chat: FunctionComponent<{
  arrayMessages: Message[];
  sendMessage: (value: string, type: 'file' | 'text') => void;
  isClient?: boolean;
}> = ({ arrayMessages, sendMessage, isClient }) => {
  const inputEl = useRef(null);
  const [messageText, setMessageText] = useState<string>('');

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueText = event.target.value;
    //console.log('event.target.value', valueText);
    if (valueText !== '') {
      setMessageText(valueText);
    } else {
      setMessageText('');
    }
  };

  const handleSetMessage = (typeMessage: 'text' | 'file', message?: string) => {
    sendMessage(message ?? messageText, typeMessage);
    if (!message) {
      setMessageText('');
    }

    const elmnt = document.getElementById('to-scroll');
    if (elmnt) {
      elmnt.scrollIntoView();
    }
  };

  return (
    <div id="chat">
      <div className="chat-messages-container">
        {arrayMessages.map((item, index) => (
          <MessageItem
            key={index}
            message={item}
            isMyMessage={!!isClient === item.isClient}
          />
        ))}
        <div id="to-scroll" ref={inputEl} />
      </div>

      <div className="chat-buttons-container">
        <Input
          placeholder="Escribir"
          onChange={onChangeText}
          value={messageText}
          onPressEnter={(e) => {
            handleSetMessage('text');
          }}
        />
        <UploadFileChat
          maxSize={2}
          onFileUploaded={(url) => {
            console.log('URL desde CHAT:', url);
            handleSetMessage('file', url);
          }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={() => {
            handleSetMessage('text');
          }}
        />
      </div>
    </div>
  );
};

const MessageItem: FunctionComponent<{
  message: Message;
  isMyMessage: boolean;
}> = ({ message, isMyMessage }) => {
  return (
    <div className="message">
      <div
        className={`message-container ${
          !isMyMessage ? 'no-my-message' : 'my-message'
        }`}
      >
        {message.type === 'text' ? (
          <span className="message-container_text">{message.message}</span>
        ) : (
          <a href={`${message.message}`} target="_blank">
            <Button type="link">Ver archivo</Button>
          </a>
        )}

        <b className="message-container_date">{message.date}</b>
      </div>
    </div>
  );
};

export default Chat;
