export const generateSmsCode = (): number => {
  return Math.floor(Math.random() * 10000);
};
