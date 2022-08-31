import { ByChannels, FunnelInput } from '../providers/apollo/queries/funnel';

export default interface FunnelRepositoryInterface {
  getFunnel(firstDate: string,
    secondDate: string): Promise<FunnelInput[] | null>;

  getTotalFunnel(
    id: number | null,
    firstDate: string,
    secondDate: string): Promise<FunnelInput[] | null>;

  getChannelFunnel(
    firstDate: string,
    secondDate: string,
    channel: string): Promise<FunnelInput[] | null>;

  getChannelJefe(
    firstDate: string,
    secondDate: string,
    channel: string): Promise<FunnelInput[] | null>;

  getChannelAsesor(
    id: number,
    firstDate: string,
    secondDate: string,
    channel: string): Promise<FunnelInput[] | null>;

  getSucursalFunnel(
    firstDate: string,
    secondDate: string,
    concessionaire: string,
    sucursal: string,
    brands: string | null): Promise<FunnelInput[] | null>;

  getFunnelReferentialBrand(
    brand: string,
    firstDate: string,
    secondDate: string): Promise<FunnelInput[] | null>;

  getSucursalFunnelReferential(
    firstDate: string,
    secondDate: string,
    concessionaire: string,
    sucursal: string,
    brand: string): Promise<FunnelInput[] | null>;

  getChannelFunnelReferential(
    firstDate: string,
    secondDate: string,
    channel: string): Promise<FunnelInput[] | null>;

  getChannelJefeReferential(
    firstDate: string,
    secondDate: string,
    channel: string): Promise<FunnelInput[] | null>;
    
  getChannelAsesorReferential(
    id: number,
    firstDate: string,
    secondDate: string,
    channel: string): Promise<FunnelInput[] | null>;

  getFunnelByConsesionaireAndSucursal(
    consesionario: string,
    sucursal: string,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null>;

  getFunnelByAsesor(
    id: number,
    firstDate: string,
    secondDate: string): Promise<FunnelInput[] | null>;

  getFunnelByBrands(
    brand: string,
    firstDate: string,
    secondDate: string): Promise<FunnelInput[] | null>;

  getByChannel(firstDate: string,
    secondDate: string): Promise<ByChannels[] | null>;
}
