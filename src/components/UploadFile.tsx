/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Spin, Tag } from 'antd';
import React from 'react';
import CRMRepository from '../data/repositories/CRM-repository';
import { Dependencies } from '../dependency-injection';
import Get from '../utils/Get';

interface Props {
  id: string;
  uploadedFile: string | null;
  label: string;
  onFileUploaded?: (url: string) => void;
  optional?: boolean;
  maxSize?: number; // in mb
  loading?: boolean;
  disableUploadInput?: boolean;
}

export default class UploadFile extends React.PureComponent<Props> {
  static defaultProps = {
    optional: false,
    maxSize: 3, // 3 mb
  };
  state = { uploading: false };

  onView = () => {
    const { uploadedFile } = this.props;

    if (!uploadedFile) return;

    Modal.info({
      width: 992,
      centered: true,
      className: 'modal-without-icon',
      content: (
        <div>
          <iframe
            width="100%"
            src={uploadedFile}
            style={{ minHeight: '70vh', maxHeight: '70vh', overflowY: 'auto' }}
          />
        </div>
      ),
      okText: 'ACEPTAR',
    });
  };

  // when an image was picked
  onPickedFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      // check the max file size
      const { maxSize } = this.props;
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > maxSize!) {
        message.error(`Tamaño max. ${maxSize} MB`);
        return;
      }
      this.setState({ uploading: true });
      //upload the image
      const repo = Get.find<CRMRepository>(Dependencies.CRM);
      const url = await repo.uploadFile({ file, metadata: {} });
      this.setState({ uploading: false });
      if (url) {
        // if the image was loaded
        const { onFileUploaded } = this.props;
        if (onFileUploaded) {
          onFileUploaded(url);
        }
      } else {
        message.error('No se pudo subir el archivo');
      }
    }
  };

  render() {
    const { id, label, uploadedFile, optional, loading, disableUploadInput } =
      this.props;
    const { uploading } = this.state;

    const uploadInput = (
      <div>
        <input
          onChange={this.onPickedFile}
          type="file"
          id={id}
          style={{ display: 'none' }}
        />
        <label htmlFor={id}>
          <Tag className="py-1 px-2 cursor-pointer m-0">
            <UploadOutlined /> {uploadedFile ? '' : 'Cargar archivo'}
          </Tag>
        </label>
      </div>
    );
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <CheckCircleOutlined
            style={{ color: uploadedFile ? '#1890ff' : '#ccc', fontSize: 20 }}
          />
          <span className="ml-2 mx-1">{label}</span>
          {optional && (
            <span className="bold ml-2" style={{ color: '#ff0000' }}>
              *
            </span>
          )}
        </div>
        {!uploadedFile && !uploading && uploadInput}

        {(uploading || loading) && <Spin size="small" />}

        {uploadedFile && !uploading && (
          <div className="flex items-center">
            <Button className="mr-1" type="primary" onClick={this.onView}>
              Ver archivo
            </Button>
            {!disableUploadInput && uploadInput}
          </div>
        )}
      </div>
    );
  }
}
