import Quotes from '../models/Quotes';
import QuotesMutationProvider, {
  QuotesInput,
  QuoteUpdateInput,
  AccesoriesInput,
  QuotePreOwnedInput,
  ChosenEntityInput,
} from '../providers/apollo/mutations/quotes';
import QuotesQueryProvider from '../providers/apollo/queries/quotes';
import QuotesRepositoryInterface from '../repositories-interfaces/quotes-repository-interface';

export default class QuotesRepository implements QuotesRepositoryInterface {
  quotesMutationProvider: QuotesMutationProvider;
  quotesQueryProvider: QuotesQueryProvider;

  constructor(
    quotesMutationProvider: QuotesMutationProvider,
    quotesProvider: QuotesQueryProvider
  ) {
    this.quotesMutationProvider = quotesMutationProvider;
    this.quotesQueryProvider = quotesProvider;
  }

  getClosedQuote(idLead: number): Promise<any> {
    return this.quotesQueryProvider.getClosedQuote(idLead);
  }

  createQuote(
    quoteInsert: QuotesInput,
    idLead: number
  ): Promise<Quotes | null> {
    return this.quotesMutationProvider.createQuote(quoteInsert, idLead);
  }

  getQuotesByLead(idLead: number): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuotesByLead(idLead);
  }

  saveDocument(document: string, id: number, isFleet?: boolean): Promise<boolean> {
    return this.quotesMutationProvider.saveDocument(document, id, isFleet);
  }

  sendToFyI(id: number, isFleet?: boolean): Promise<{ ok: boolean; message: string }> {
    return this.quotesMutationProvider.sendToFyI(id, isFleet);
  }

  selectQuoteForClousure(idLead: number, idQuoute: number): Promise<boolean> {
    return this.quotesMutationProvider.selectQuoteForClousure(idLead, idQuoute);
  }

  deleteQuoteForClousure(idLead: number, idQuoute: number): Promise<boolean> {
    return this.quotesMutationProvider.deleteQuoteForClousure(idLead, idQuoute);
  }

  updateQuote(id: number, quoteUpdate: QuoteUpdateInput): Promise<boolean> {
    return this.quotesMutationProvider.updateQuote(id, quoteUpdate);
  }

  updateQuoteAppraisal(
    id: number,
    quoteUpdate: QuotePreOwnedInput
  ): Promise<boolean> {
    return this.quotesMutationProvider.updateQuoteAppraisal(id, quoteUpdate);
  }

  updateQuoteReserveValue(
    id: number,
    reservationvalue: number
  ): Promise<boolean> {
    return this.quotesMutationProvider.updateQuoteReserveValue(
      id,
      reservationvalue
    );
  }

  updateQuoteRegisterValue(
    id: number,
    registrationvalue: number
  ): Promise<boolean> {
    return this.quotesMutationProvider.updateQuoteRegisterValue(
      id,
      registrationvalue
    );
  }

  updateQuoteDiscount(id: number, discount: number): Promise<boolean> {
    return this.quotesMutationProvider.updateQuoteDiscount(id, discount);
  }

  getQuotesWithCredits(
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuotesWithCredits(
      concessionaireInput,
      succursalInput
    );
  }
  getQuotesCredits(values: {
    identificationClient: string | null;
    firstDate: string | null;
    secondDate: string | null;
    concessionaireInput: string | null;
    sucursalInput: string | null;
  }): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuotesCredits(
      values.identificationClient,
      values.firstDate,
      values.secondDate,
      values.concessionaireInput,
      values.sucursalInput
    );
  }

  getQuoteById(id: number): Promise<Quotes | null> {
    return this.quotesQueryProvider.getQuoteById(id);
  }

  getQuoteObjectivesByIdAdviser(id: number, firstDate: string,
    secondDate: string,): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuoteObjectivesByIdAdviser(id, firstDate, secondDate);
  }

  getQuoteObjectives(firstDate: string,
    secondDate: string): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuoteObjectives(firstDate,
      secondDate);
  }

  getQuoteObjectivesAccessories(firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuoteObjectivesAccessories(firstDate,
      secondDate, counted, credit);
  }

  getQuoteObjectivesAllies(firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuoteObjectivesAllies(firstDate,
      secondDate, counted, credit);
  }


  getQuoteObjectivesAccessoriesByIdAdviser(id:number, firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuoteObjectivesAccessoriesByIdAdviser(id, firstDate,
      secondDate, counted, credit);
  }

  getQuoteObjectivesAlliesByIdAdviser(id:number, firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuoteObjectivesAlliesByIdAdviser(id, firstDate,
      secondDate, counted, credit);
  }


  getQuotesByDates(
    firstDate: string,
    secondDate: string,
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuotesByDates(
      firstDate,
      secondDate,
      concessionaireInput,
      succursalInput
    );
  }
  getMechanicalAppraisal(firstDate: string, secondDate: string): Promise<any> {
    return this.quotesQueryProvider.getMechanicalAppraisal(
      firstDate,
      secondDate
    );
  }

  getAppraisal(values: {
    identificationClient: string | null;
    firstDate: string | null;
    secondDate: string | null;
    concessionaireInput: string | null;
    sucursalInput: string | null;
  }): Promise<any> {
    return this.quotesQueryProvider.getAppraisal(
      values.identificationClient,
      values.firstDate,
      values.secondDate,
      values.concessionaireInput,
      values.sucursalInput
    );
  }

  getQuotesByAsesorOrProspect(
    lastname: string,
    userorclient: number,
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null> {
    return this.quotesQueryProvider.getQuotesByAsesorOrProspect(
      lastname,
      userorclient,
      concessionaireInput,
      succursalInput
    );
  }

  updateAccesoriesByIdQuote(
    idQuote: number,
    accesories: AccesoriesInput[]
  ): Promise<boolean> {
    return this.quotesMutationProvider.updateAccesoriesByIdQuote(
      idQuote,
      accesories
    );
  }

  updateServicesByIdQuote(idQuote: number, services: any[]): Promise<boolean> {
    return this.quotesMutationProvider.updateServicesByIdQuote(
      idQuote,
      services
    );
  }

  updateChosenEntityByIdQuote(
    idQuote: number,
    chosenEntityInput: ChosenEntityInput
  ): Promise<boolean> {
    return this.quotesMutationProvider.updateChosenEntityByIdQuote(
      idQuote,
      chosenEntityInput
    );
  }

  verifyVINs(idsQuote: number[]): Promise<any> {
    return this.quotesMutationProvider.verifyVINs(idsQuote);
  }
}
