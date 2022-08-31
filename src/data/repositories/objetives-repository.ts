import { GetObjectives, Objectives, ObjectivesAccessories, ObjectivesAllies } from '../models/Objectives';
import ObjectivesMutationProvider from '../providers/apollo/mutations/objectives';
import ObjectivesQueryProvider from '../providers/apollo/queries/objectives';
import ObjectivesRepositoryInterface from '../repositories-interfaces/objectives-respository-interfaces';

export default class ObjectivesRepository
  implements ObjectivesRepositoryInterface {
  objectivesQueryProvider: ObjectivesQueryProvider;
  objectivesMutationProvider: ObjectivesMutationProvider;

  constructor(
    objectivesQueryProvider: ObjectivesQueryProvider,
    objectivesMutationProvider: ObjectivesMutationProvider
  ) {
    this.objectivesQueryProvider = objectivesQueryProvider;
    this.objectivesMutationProvider = objectivesMutationProvider;
  }

  getObjectivesAdviser = async (): Promise<Objectives[] | []> => {
    return this.objectivesQueryProvider.getObjectivesAdviser();
  };

  getObjectivesAccessories = async (): Promise<ObjectivesAccessories[] | null> => {
    return this.objectivesQueryProvider.getObjectivesAccessories();
  };

  getObjectivesSalesResult = async (firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<Objectives[] | null> => {
    return this.objectivesQueryProvider.getObjectivesSalesResult(firstDate, secondDate, counted, credit);
  };

  getObjectivesAccessoriesResult = async (firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAccessories[] | null> => {
    return this.objectivesQueryProvider.getObjectivesAccessoriesResult(firstDate, secondDate, counted, credit);
  };

  getObjectivesAlliesResult = async (firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAllies[] | null> => {
    return this.objectivesQueryProvider.getObjectivesAlliesResult(firstDate, secondDate, counted, credit);
  };

  getObjectivesAccessoriesResultByIdAdviser = async (id:number, firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAccessories[] | null> => {
    return this.objectivesQueryProvider.getObjectivesAccessoriesResultByIdAdviser(id, firstDate, secondDate, counted, credit);
  };

  getObjectivesAlliesResultByIdAdviser = async (id:number, firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAllies[] | null> => {
    return this.objectivesQueryProvider.getObjectivesAlliesResultByIdAdviser(id, firstDate, secondDate, counted, credit);
  };

  getObjectivesAllies = async (): Promise<ObjectivesAllies[] | null> => {
    return this.objectivesQueryProvider.getObjectivesAllies();
  };

  getObjectivesByIdAdviser = async (id: number, firstDate: string,
    secondDate: string): Promise<Objectives[] | null> => {
    return this.objectivesQueryProvider.getObjectivesByIdAdviser(id, firstDate, secondDate);
  };

  getAllObjectives = async (
    idSucursal: number
  ): Promise<Objectives[] | null> => {
    return this.objectivesQueryProvider.getAllObjectives(idSucursal);
  };

  updateObjective = async (
    idObjective: number,
    amount: number,
    units: number
  ): Promise<boolean> => {
    return this.objectivesMutationProvider.updateObjective(
      idObjective,
      amount,
      units
    );
  };

  deleteObjective = async (idObjective: number): Promise<boolean> => {
    return this.objectivesMutationProvider.deleteObjective(idObjective);
  }
}
