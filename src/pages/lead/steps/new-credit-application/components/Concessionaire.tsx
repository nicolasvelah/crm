import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';
import ItemForm from './ItemForm';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
} from '../new-credit-controller';

const Concessionaire: FunctionComponent<{ clientPhone?: string, isFleet?: boolean }> = ({
  clientPhone,
  isFleet
}) => {
  //const [forceupdate, setForceUpdate] = useState(false);
  const value: any = useContext(GlobalNewCreditContext);
  const { store }: { store: NewCreditGlobalState } = value;
  /*   useEffect(() => {
    //console.log('store Concesionare', store.applicant);
    setForceUpdate((prevState) => !prevState);
  }, [store]); */

  return (
    <div>
      <ItemForm
        title="Concesionario"
        val={store.applicant.concessionaire ?? 'N/A'}
      />
      <ItemForm title="Sucursal" val={store.applicant.sucursal ?? 'N/A'} />
      <ItemForm
        title="Asesor Comercial"
        val={store.applicant.businessAdvisor!}
      />
      <ItemForm title="Lugar y fecha" val={store.applicant.placeAndDate!} />
      {clientPhone && <ItemForm title="Celular" val={clientPhone} />}
      <ItemForm title="Tipo de cotización" val={isFleet ? 'Flota' : 'Cotización'} />
    </div>
  );
};

export default Concessionaire;
