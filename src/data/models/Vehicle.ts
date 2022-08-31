export interface Vehicle {
  description: any;
  brand: string;
  model: string;
  year: number;
  value: number;
  totalServices: number | null;
  totalAccesories: number | null;
  valueExtraEsKit: number;
  plazo?: number;
  entrada?: number;
  tasa?: number;
  financing?: number;
  monthlyPayments?: number;
}
