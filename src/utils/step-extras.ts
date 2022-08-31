import Leads from '../data/models/Leads';
import Quotes from '../data/models/Quotes';

const switchStepToNumber = (step: string) => {
  switch (step) {
    case 'inquiry':
      return 0;
    case 'demonstration':
      return 1;
    default:
      return -1;
  }
};

export const verifyStatusPrebill = (lead: Leads | null): boolean => {
  const quotesWithVin: number[] = [];
  const quotesInClosed: Quotes[] = [];

  const quotesCreditInClosed: Quotes[] = [];
  const quotesCreditInClosedWithFinancial: Quotes[] = [];

  const idsQuotesFleet = lead?.leadsQuoteFinancial?.quotes?.map((q) => q.id!);

  // eslint-disable-next-line no-unused-expressions
  lead?.quotes?.forEach((q) => {
    if (q.vimVehiculo) {
      quotesWithVin.push(q.id!);
    }
    if (q.closed) {
      quotesInClosed.push(q);
    }
    const quoteNotFleet = !idsQuotesFleet?.includes(q.id!);
    if (q.closed && q.type === 'credit' && quoteNotFleet) {
      quotesCreditInClosed.push(q);
    }
    if (q.closed && q.type === 'credit' && q.quoteFinancial && quoteNotFleet) {
      const quotesFinancials = q.quoteFinancial.filter((qf) => qf.selected);
      if (quotesFinancials.length > 0) {
        quotesCreditInClosedWithFinancial.push(q);
      }
    }
  });

  const logicQuotes = quotesWithVin.length === quotesInClosed.length;
  // console.log('logicQuotes -->', { quotesWithVin, quotesInClosed });
  if (!logicQuotes) return false;

  const logicQuotesTwo =
    quotesCreditInClosed.length === quotesCreditInClosedWithFinancial.length;
  /*   console.log('logicQuotesTwo -->', {
    quotesCreditInClosed,
    quotesCreditInClosedWithFinancial,
  }); */
  if (!logicQuotesTwo) return false;

  const quotesFleetInClosed = quotesInClosed.filter(
    (q) => !!idsQuotesFleet?.includes(q.id!)
  );
  let okFleet = true;
  if (quotesFleetInClosed.length > 0) {
    const quoteWithChooseFinancial = lead?.leadsQuoteFinancial?.quoteFinancial?.find(
      (qF) => qF.selected
    );
    okFleet = !!quoteWithChooseFinancial;
  }

  const toPrebill = logicQuotes && logicQuotesTwo && okFleet;
  /* console.log('logic', {
    logicQuotes,
    logicQuotesTwo,
    okFleet,
  }); */

  return toPrebill;
};

export default switchStepToNumber;
