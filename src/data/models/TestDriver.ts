import Quotes from './Quotes';
import Leads from './Leads';

export interface Drivers {
  name: string;

  lastName: string;

  validLicense: Boolean;
}

export default class TestDriver {
  id?: number;

  testDrivePrint?: boolean | null;

  codeVehicle?: string | null;

  brandVehicle?: string;

  vin?: string | null;

  drivers?: Drivers[];

  dateCreatedTestDriver?: string;

  dateUpdateTestDriver?: string | null;

  dateTestDriver?: string;

  dateTestConfirmation?: string | null;

  startKm?: number | null;

  endKm?: number | null;

  observations?: string | null;

  confirmTestDrive?: boolean | null;

  urlImageVehicle?: string | null;

  modelVehicle?: string | null;

  yearVehicle?: number | null;

  colorVehicle?: string | null;

  priceVehicle?: number | null;

  leads?: Leads | null;
}
