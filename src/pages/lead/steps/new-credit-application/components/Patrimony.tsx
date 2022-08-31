import React, { FunctionComponent, useContext } from 'react';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';

import ItemForm from './ItemForm';

const Patrimony: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3 w-1/2">
      <div className="font-black text-xl text-gray-900 my-2">Patrimonio</div>
      <div className="mt-2 w-full">
        <ItemForm
          title="Activos"
          val={
            store.property.house +
            store.property.others +
            store.property.vehicle
          }
          adorno="$"
        />

        <ItemForm
          title="Pasivos"
          val={
            store.passives.debtsToPay +
            store.passives.others +
            store.passives.creditCards
          }
          adorno="$"
        />
        <ItemForm
          title="Total"
          val={
            store.property.house +
            store.property.others +
            store.property.vehicle -
            (store.passives.debtsToPay +
              store.passives.others +
              store.passives.creditCards)
          }
          adorno="$"
        />
      </div>
    </div>
  );
};

export default Patrimony;
