/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, FunctionComponent } from 'react';
import { message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CRMRepository from '../data/repositories/CRM-repository';
import { Dependencies } from '../dependency-injection';
import Get from '../utils/Get';

const idFile = 'file_chat';

const UploadFileChat: FunctionComponent<{
  maxSize: number;
  onFileUploaded: (url: string) => void;
}> = ({ maxSize, onFileUploaded }) => {
  const [uploading, setUploading] = useState<boolean>(false);

  const onPickedFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      // check the max file size

      const fileSize = file.size / 1024 / 1024;
      if (fileSize > maxSize!) {
        message.error(`Tamaño max. ${maxSize} MB`);
        return;
      }
      setUploading(true);
      //upload the image
      const repo = Get.find<CRMRepository>(Dependencies.CRM);
      const url = await repo.uploadFile({ file, metadata: {} });
      setUploading(false);
      if (url) {
        // if the image was loaded
        if (onFileUploaded) {
          onFileUploaded(url);
        }
      } else {
        message.error('No se pudo subir el archivo');
      }
    }
  };
  return (
    <div style={{ marginLeft: 5 }}>
      <input
        onChange={onPickedFile}
        type="file"
        id={idFile}
        style={{ display: 'none' }}
      />
      <label
        htmlFor={idFile}
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          backgroundColor: '#40a9ff',
          cursor: 'pointer',
        }}
      >
        <UploadOutlined style={{ color: '#fff' }} />
      </label>
    </div>
  );
};

export default UploadFileChat;
