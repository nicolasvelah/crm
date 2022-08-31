import { GetObjectives, Objectives, ObjectivesAccessories, ObjectivesAllies } from '../models/Objectives';

export default interface ObjectivesRepositoryInterface {
  getObjectivesAdviser(): Promise<Objectives[] | []>;
  getObjectivesAccessories(): Promise<ObjectivesAccessories[] | null>;
  getObjectivesAccessoriesResult(firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAccessories[] | null>;
  getObjectivesSalesResult(firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<Objectives[] | null>;
  getObjectivesAlliesResult(firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAllies[] | null>;
  getObjectivesAccessoriesResultByIdAdviser(id: number, firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAccessories[] | null>;
  getObjectivesAlliesResultByIdAdviser(id: number, firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAllies[] | null>;
  getObjectivesAllies(): Promise<ObjectivesAllies[] | null>;
  getObjectivesByIdAdviser(id: number, firstDate: string,
    secondDate: string): Promise<Objectives[] | null>;
  getAllObjectives(idSucursal: number): Promise<Objectives[] | null>;
  updateObjective(
    idObjective: number,
    amount: number,
    units: number
  ): Promise<boolean>;
  deleteObjective(idObjective: number): Promise<boolean>;
}
