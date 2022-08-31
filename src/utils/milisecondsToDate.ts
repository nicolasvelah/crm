import moment from 'moment';

const milisecondsToDate = (dateInMiliseconds: string, format?: string): string => {
  const date = moment(new Date(parseInt(dateInMiliseconds)).toISOString())
    .format(format ?? 'DD/MM/YYYY hh:mm:ss');
  return date;
};

export default milisecondsToDate;
