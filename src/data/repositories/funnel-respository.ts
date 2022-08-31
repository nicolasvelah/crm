import FunnelQueryProvider, {
  ByChannels,
  FunnelInput, GET_FUNNEL_BY_CONSESIONAIRE_AND_SUCURSAL
} from '../providers/apollo/queries/funnel';
import apolloClient from '../providers/apollo';
import FunnelRepositoryInterface from '../repositories-interfaces/funnel-repository-interface';

export default class FunnelRespository implements FunnelRepositoryInterface {
  funnelQueryProvider: FunnelQueryProvider;

  constructor(funnelQueryProvider: FunnelQueryProvider) {
    this.funnelQueryProvider = funnelQueryProvider;
  }
  
  getTotalFunnel(
    id: number | null,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getTotalFunnel(id, firstDate, secondDate);
  }

  getChannelFunnel(
    firstDate: string,
    secondDate: string,
    channel:string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getChannelFunnel(firstDate, secondDate, channel);
  }

  getChannelJefe(
    firstDate: string,
    secondDate: string,
    channel:string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getChannelJefe(firstDate, secondDate, channel);
  }

  getChannelAsesor(
    id: number,
    firstDate: string,
    secondDate: string,
    channel:string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getChannelAsesor(id, firstDate, secondDate, channel);
  }

  getSucursalFunnel(
    firstDate: string,
    secondDate: string,
    concessionaire:string, 
    sucursal:string, 
    brands:string|null, 
  ): Promise<FunnelInput[] | null> {
   return this.funnelQueryProvider.getSucursalFunnel(firstDate, secondDate, concessionaire, sucursal, brands);
  }

  getFunnelReferentialBrand(
    brand: string,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getFunnelReferentialBrand(brand, firstDate, secondDate);
  }

  getChannelFunnelReferential(
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getChannelFunnelReferential(firstDate, secondDate, channel);
  }

  getChannelJefeReferential(
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getChannelJefeReferential(firstDate, secondDate, channel);
  }

  getChannelAsesorReferential(
    id: number,
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getChannelAsesorReferential(id, firstDate, secondDate, channel);
  }

  getSucursalFunnelReferential(
    firstDate: string,
    secondDate: string,
    concessionaire:string,
    sucursal:string,
    brand:string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getSucursalFunnelReferential(firstDate, secondDate, concessionaire, sucursal, brand);
  }

  getFunnel(
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getFunnel(firstDate, secondDate);
  }

  getFunnelByConsesionaireAndSucursal = async (
    consesionario: string,
    sucursal: string,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> => {
    return this.funnelQueryProvider.getFunnelByConsesionaireAndSucursal(
      consesionario,
      sucursal,
      firstDate,
      secondDate
    );
  };

  getFunnelByAsesor(
    id: number,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getFunnelByAsesor(id, firstDate, secondDate);
  }

  getFunnelByBrands(
    brand: string,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> {
    return this.funnelQueryProvider.getFunnelByBrands(brand, firstDate, secondDate);
  }

  getByChannel(
    firstDate: string,
    secondDate: string
  ): Promise<ByChannels[] | null> {
    return this.funnelQueryProvider.getByChannel(firstDate, secondDate);
  }
}
