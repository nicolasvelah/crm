/* eslint-disable react/jsx-no-target-blank */
import React, { FunctionComponent, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Button, Checkbox, Input, message } from 'antd';
import Get from '../utils/Get';
import { Dependencies } from '../dependency-injection';
import DeliveryRepository from '../data/providers/apollo/mutations/delivery';
import { LoadingModal } from './Inquiry/components/SelectVehicleInquiry';

interface Data {
  name: string;
  url: string;
  walletState: string;
}
const DocumentsVerify: FunctionComponent<{
  documents: any;
  status: boolean;
}> = ({ documents, status }) => {
  const deliveryRepository = Get.find<DeliveryRepository>(
    Dependencies.delivery
  );

  /// Para poder hacer la reactividad necesito setear el prop. Para ellos es necesario un nuevo estado
  const [documentsToCheck, setDocumentsToCheck] = useState<any>(null);
  const [load, setLoad] = useState<boolean>(false);
  useEffect(() => {
    if (documents && documents.documents) {
      setDocumentsToCheck(documents);
    }
  }, []);

  const onChangeDocument = async (e: any, nameDocument: string) => {
    setLoad(true);
    const idDelivery = documents.id;
    const walletState = String(e.target.checked);
    const deliveryDocument: any = await deliveryRepository.updateVerifyDocuments(
      nameDocument,
      idDelivery,
      walletState
    );
    if (deliveryDocument) {
      message.success('Documento actualizado');
      setDocumentsToCheck((prevState: any) => {
        if (prevState && prevState.documents) {
          const copy = { ...prevState };
          const newDocuments = prevState.documents.map((docs: any) => {
            if (docs.name === nameDocument) {
              return { ...docs, walletState };
            }
            return docs;
          });
          copy.documents = newDocuments;
          return copy;
        }
        return prevState;
      });
    } else {
      message.error('No se pudo actualizar el documento');
    }
    setLoad(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {documentsToCheck && documentsToCheck.documents !== null ? (
        <div>
          {documentsToCheck.documents.map((data: any, index: number) => (
            <div key={index}>
              {data.url && data.url !== 'null' && (
                <div key={index} className="flex flex-row justify-start mt-5">
                  <div className="" style={{ width: 300 }}>
                    <Checkbox
                      disabled={!status}
                      onChange={(e) => {
                        onChangeDocument(e, data.name);
                      }}
                      defaultChecked={data.walletState === 'true'}
                      checked={data.walletState === 'true'}
                      //value={data.name}
                    >
                      {data.name}
                    </Checkbox>
                  </div>
                  {data.invoice === 'invoice' ? (
                    <div className="">
                      <Input disabled value={data.url} />
                    </div>
                  ) : (
                    <div className="">
                      <a href={`${data.url}`} target="_blank">
                        <Button className="text-red-400 button-red mr-2">
                          Ver
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>Sin datos</div>
      )}
      <LoadingModal view={load} />
    </div>
  );
};

export default DocumentsVerify;
