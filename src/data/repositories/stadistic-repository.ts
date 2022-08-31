import StadisticQueryProvider, { StaidsticInputType } from '../providers/apollo/queries/stadistic';

export default class StadisticRepository {
  stadisticQueryProvider: StadisticQueryProvider;
  
  constructor(stadisticQueryProvider: StadisticQueryProvider) {
    this.stadisticQueryProvider = stadisticQueryProvider;
  }
  getLeadByMonth(
  ): Promise<StaidsticInputType[] | null> {
    return this.stadisticQueryProvider.getLeadByMonth();
  }
  getSaleDown(
  ): Promise<StaidsticInputType[] | null> {
    return this.stadisticQueryProvider.getSaleDown();
  }
}
