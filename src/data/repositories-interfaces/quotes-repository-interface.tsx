import Quotes from '../models/Quotes';
/* eslint-disable semi */

import {
  QuotesInput,
  QuoteUpdateInput,
  AccesoriesInput,
  QuotePreOwnedInput,
  ChosenEntityInput,
} from '../providers/apollo/mutations/quotes';

export default interface QuotesRepositoryInterface {
  createQuote(quoteInsert: QuotesInput, idLead: number): Promise<Quotes | null>;

  getQuotesByLead(idLead: number): Promise<Quotes[] | null>;

  getClosedQuote(idLead: number): Promise<any>;

  saveDocument(document: string, id: number, isFleet?: boolean): Promise<boolean>;

  sendToFyI(idQuoute: number, isFleet?: boolean): Promise<{ ok: boolean; message: string }>;

  selectQuoteForClousure(idLead: number, idQuoute: number): Promise<boolean>;

  updateQuote(id: number, quoteUpdate: QuoteUpdateInput): Promise<boolean>;

  updateQuoteAppraisal(
    id: number,
    quoteUpdate: QuotePreOwnedInput
  ): Promise<boolean>;

  getQuotesWithCredits(
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null>;

  getQuoteById(id: number): Promise<Quotes | null>;
  getQuoteObjectivesByIdAdviser(
    id: number,
    firstDate: string,
    secondDate: string
  ): Promise<Quotes[] | null>;
  
  getQuoteObjectives(
    firstDate: string,
    secondDate: string
  ): Promise<Quotes[] | null>;

  getQuoteObjectivesAccessories(
    firstDate: string,
    secondDate: string,
    counted: number, 
    credit: number
  ): Promise<Quotes[] | null>;

  getQuoteObjectivesAllies(
    firstDate: string,
    secondDate: string,
    counted: number, 
    credit: number
  ): Promise<Quotes[] | null>;

  getQuoteObjectivesAccessoriesByIdAdviser(
    id:number,
    firstDate: string,
    secondDate: string,
    counted: number, 
    credit: number
  ): Promise<Quotes[] | null>;

  getQuoteObjectivesAlliesByIdAdviser(
    id:number,
    firstDate: string,
    secondDate: string,
    counted: number, 
    credit: number
  ): Promise<Quotes[] | null>;

  getQuotesByDates(
    firstDate: string,
    secondDate: string,
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null>;

  getMechanicalAppraisal(
    firstDate: string,
    secondDate: string
  ): Promise<Quotes[] | null>;

  getAppraisal(values: {
    identificationClient: string | null;
    firstDate: string | null;
    secondDate: string | null;
    concessionaireInput: string | null;
    sucursalInput: string | null;
  }): Promise<Quotes[] | null>;

  getQuotesByAsesorOrProspect(
    lastname: string,
    userorclient: number,
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null>;

  getQuotesCredits(values: {
    identificationClient: string | null;
    firstDate: string | null;
    secondDate: string | null;
    concessionaireInput: string | null;
    sucursalInput: string | null;
  }): Promise<Quotes[] | null>;

  updateAccesoriesByIdQuote(
    idQuote: number,
    accesories: AccesoriesInput[]
  ): Promise<boolean>;

  updateServicesByIdQuote(idQuote: number, services: any[]): Promise<boolean>;

  updateQuoteRegisterValue(
    id: number,
    registrationvalue: number
  ): Promise<boolean>;

  updateQuoteDiscount(id: number, discount: number): Promise<boolean>;

  updateChosenEntityByIdQuote(
    idQuote: number,
    chosenEntityInput: ChosenEntityInput
  ): Promise<boolean>;

  verifyVINs(idQuotes: number[]): Promise<any>;
}
