export const paginateData = <T>(data: T[], currentPage: number, pageSize: number): T[] => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return data.slice(startIndex, endIndex);
};

export const calculateAge = (birthDate: Date) => {
  const today = new Date();

  return (
    today.getFullYear() -
    birthDate.getFullYear() -
    (today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate())
      ? 1
      : 0)
  );
};

export const overDaysFromNow = (date: Date | string, threshold: number): boolean => {
  const validDate = date instanceof Date ? date : new Date(date);
  const differenceInDays =
    (new Date(validDate.toDateString()).getTime() - new Date(new Date().toDateString()).getTime()) / (1000 * 3600 * 24);

  return differenceInDays >= threshold;
};

export const getDateMinusDays = (date: string | Date, days: number): Date => {
  const validDate = date instanceof Date ? date : new Date(date);

  return new Date(validDate.getTime() - days * 24 * 60 * 60 * 1000);
};
