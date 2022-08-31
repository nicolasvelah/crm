import React, {
  useState,
  FunctionComponent,
  useEffect,
  useContext,
} from 'react';
import { InputNumber, Button, message } from 'antd';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import { SaveOutlined } from '@ant-design/icons';
import { ClientLeadContext } from '../../../components/GetClientData';

const Registration: FunctionComponent<{
  quouteRepository: QuotesRepository;
  idQuote: number;
  registration?: number | null;
  setVehiclesToShow: Function;
}> = ({ quouteRepository, idQuote, registration, setVehiclesToShow }) => {
  const { setLead } = useContext(ClientLeadContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [matricula, setMatricula] = useState<number | null>(null);

  useEffect(() => {
    setMatricula(typeof registration === 'number' ? registration : null);
  }, []);

  const saveRegistration = async () => {
    setLoading(true);
    const resp = quouteRepository.updateQuoteRegisterValue(idQuote, matricula!);
    if (resp) {
      message.success('Información actualizada');
      if (setLead) {
        setLead((prevState: any) => {
          const copiaLead = prevState;
          const indexQuote = copiaLead.quotes?.findIndex(
            (quo: any) => quo.id === idQuote
          );
          if (typeof indexQuote === 'number' && indexQuote > -1) {
            copiaLead.quotes[indexQuote].registration = matricula!;
            return { ...copiaLead };
          }
          return prevState;
        });
        setVehiclesToShow((prevState: any) => {
          const copia = prevState;
         //console.log('copia', copia)
          const index = (copia as any[]).findIndex((quo) => quo.id === idQuote);
         //console.log({index});
          if (typeof index === 'number' && index > -1) {
            copia[index].registration = matricula!;
            return [...copia];
          }
          return prevState;
        });
      }
    } else {
      message.error('Algo falló, vuelve a intentarlo');
    }
    setLoading(false);
  };
  return (
    <div style={{ display: 'flex' }}>
      <InputNumber
        disabled={loading}
        min={0}
        value={typeof matricula === 'number' ? matricula : undefined}
        onChange={(val) => {
          if (typeof val !== 'number') {
            setMatricula(null);
          } else {
            setMatricula(val);
          }
        }}
        formatter={(value) =>
          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
        parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
      />
      <Button
        type="primary"
        icon={<SaveOutlined />}
        disabled={typeof matricula !== 'number'}
        onClick={saveRegistration}
        loading={loading}
      />
    </div>
  );
};

export default Registration;
