import { StaidsticInputType } from '../providers/apollo/queries/stadistic';

export default interface StadisticRepository{
  getLeadByMonth(): Promise<StaidsticInputType[] | null> ;
  getSaleDown(): Promise<StaidsticInputType[] | null> ;
}
