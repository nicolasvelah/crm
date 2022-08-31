import React, { FunctionComponent, useEffect, useState } from 'react';
import { Alert, Divider, Timeline } from 'antd';
import moment from 'moment';
import milisecondsToDate from '../../utils/milisecondsToDate';
import { getNextTracing, outTime } from '../Follow/TimeLine';
import Get from '../../utils/Get';
import TracingsRepository from '../../data/repositories/tracings-repository';
import { Dependencies } from '../../dependency-injection';
import Tracings from '../../data/models/Tracings';
import Loading from '../Loading';

const BusinessHistory: FunctionComponent<{
  prospectIdentification?: string;
  getNextTracingProps?: Function
}> = ({ prospectIdentification, getNextTracingProps }) => {
  /******************************HOOKS*****************************************/

  const tracingsRepository = Get.find<TracingsRepository>(
    Dependencies.tracings
  );

  const [allTracingaDB, setAllTracingaDB] = useState<Tracings[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /******************************GENERALFUNCTIONAPI****************************/

  const setTracingsByUserAndClient = async (identificationInput: string) => {
    setLoading(true);
    const dataAPI : Tracings[] | null = await tracingsRepository
        .getTracingsByUserAndClient(identificationInput);
    if (dataAPI && dataAPI.length > 0) {
      dataAPI!.sort((a, b) => {
        return moment(milisecondsToDate(
          a.executionDate!, 'YYYY/MM/DD HH:mm:ss'
        )).diff(milisecondsToDate(
            b.executionDate!, 'YYYY/MM/DD HH:mm:ss'
          ))
      });
      setAllTracingaDB(dataAPI!);
      getNextTracingProps!(getNextTracing(dataAPI));
      setLoading(false);
      return 'ok';
    }
    setLoading(false);
    return 'El prospecto no tiene seguimientos';
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      await setTracingsByUserAndClient(prospectIdentification!);
    };
    componentdidmount();
  }, []);

  /*******************************RETURN***************************************/

  return (
   
    <div className="">
      <div className="text-center mb-5">
        <span>
          {moment()
            .startOf('month')
            .add(-3, 'month')
            .format('YYYY/MM/DD')}
        </span>
        <span> - {moment()
          .endOf('month')
          .add(3, 'month')
          .format('YYYY/MM/DD')}
        </span>
      </div>
      <Timeline mode="alternate">
        {allTracingaDB && allTracingaDB.length > 0 ?
            allTracingaDB.map((data, index) => (
              <Timeline.Item
                color={data.closeDate ? 'blue' : outTime(data.executionDate!)
                  ? 'red'
                  : 'green'}
                label={milisecondsToDate(
                  data.executionDate!, 'YYYY/MM/DD HH:mm:ss'
                )}
                key={`index_${index}`}
              >
                {data.motive}
              </Timeline.Item>
            )) : 
            <Alert 
              className="mt-5 text-center" 
              message="El prospecto no tiene seguimientos" 
              type="warning"
            />}
      </Timeline>
      <Loading
        visible={loading}
      />
    </div>
  );
};

export default BusinessHistory;
