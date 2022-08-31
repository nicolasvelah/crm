import React, { FunctionComponent, useState, useRef } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Message } from '../../../libs/signaling';

const Chat: FunctionComponent<{
  arrayMessages: Message[];
  sendMessage: (value: string) => void;
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
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={() => {
            sendMessage(messageText);
            setMessageText('');
            /* const arreglo: any = inputEl.current;
           //console.log('arreglo', arreglo);
            if (arreglo) {
              arreglo.scrollIntoView({ behavior: 'smooth' });
            } */
            const elmnt = document.getElementById('to-scroll');
            if (elmnt) {
              elmnt.scrollIntoView();
            }
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
        <span className="message-container_text">{message.message}</span>
        <b className="message-container_date">{message.date}</b>
      </div>
    </div>
  );
};

export default Chat;
