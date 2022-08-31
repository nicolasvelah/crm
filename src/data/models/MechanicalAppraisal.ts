export interface AuctionBuyerData {
  name?: String;
}

export default interface MechanicalAppraisal {
  id?: number;
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  auctionBestOffert?: number;
  auctionBuyerData?: any;
  userComment?: string;
  clientResponse?: number;
  clientComment?: string;
  updateAt?: string;
  createdAt?: string;
}
