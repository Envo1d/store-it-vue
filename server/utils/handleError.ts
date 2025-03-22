export const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};
