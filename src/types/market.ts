
export interface MarketPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdate: string;
  unit: string;
  currency: string;
  memberStateCode?: string;
  memberStateName?: string;
  marketName?: string;
  stageName?: string;
  weekNumber?: number;
  referencePeriod?: string;
}

export interface EUCerealPrice {
  memberStateCode: string;
  memberStateName: string;
  beginDate: string;
  endDate: string;
  referencePeriod: string;
  weekNumber: number;
  price: string;
  unit: string;
  productName: string;
  productCode?: string;
  marketName: string;
  marketCode?: string;
  stageName: string;
  stageCode?: string;
}

export interface ProductMapping {
  romanian_name: string;
  romanian_symbol: string;
  eu_product_code: string;
  eu_product_name: string;
}
