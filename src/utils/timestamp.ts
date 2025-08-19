export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const timestampToLocalDateAndTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};
