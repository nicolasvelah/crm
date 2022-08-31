import React, { FunctionComponent, useState, useContext } from 'react';
import { message, Upload } from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import {
  NewCreditGlobalState,
  GlobalNewCreditContext,
} from '../new-credit-controller';

const UploadDocument: FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [typeDocumnet, setTypeDocument] = useState<string | null>(null);
  const value: any = useContext(GlobalNewCreditContext);
  const {
    documentFile,
    setDocumentFile,
  }: { documentFile: string | null; setDocumentFile: Function } = value;

  const beforeUpload = (file: any) => {
    //console.log({ file });
    setTypeDocument(file.type);
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'application/pdf';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const getBase64 = (img: any, callback: any) => {
    //console.log({ img, callback });
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info: any) => {
    //console.log('handleChange', { info });
    if (info.file.status === 'uploading') {
      setLoading(true);
      //console.log('FIn handleChange');
    }
    if (info.file.status === 'done' || info.file.status === 'error') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imgUrl: any) => {
        //console.log('IMAGEEN', { imgUrl });

        setImageUrl(imgUrl);
        setDocumentFile(imgUrl);
        setLoading(false);
      });
    }
  };
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        typeDocumnet && typeDocumnet !== 'application/pdf' ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          <div style={{ width: '100%' }}>
            <CheckOutlined />
            <br />
            PDF
          </div>
        )
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default UploadDocument;
