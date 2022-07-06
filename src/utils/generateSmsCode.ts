export const generateSmsCode = (): number => {
  return Math.round(Math.random() * 10000);
};
