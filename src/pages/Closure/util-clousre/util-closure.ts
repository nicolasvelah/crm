import { Services } from '../../../data/models/Quotes';
import { ServiceWithType } from '../components/Closure';

export const formatServices = (services: Services[]): ServiceWithType[] => {
  const myServices: ServiceWithType[] = [];
  services!.forEach((serviceGroup) => {
    //console.log({ serviceGroup });
    Object.keys(serviceGroup).forEach((key) => {
      const respaldo: any = serviceGroup;
      if (key !== '__typename') {
        //console.log({ key }, respaldo[key]);
        const groupSer: any = respaldo[key];
        //console.log('groupSer', groupSer);
        groupSer.forEach((serviceItem: any) => {
          myServices.push({
            ...serviceItem,
            type: key,
            value: serviceItem.value ?? 0,
          });
        });
      }
    });
  });
  //console.log({ myServices });
  return myServices;
};
