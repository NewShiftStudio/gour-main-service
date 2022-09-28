export const generateSmsCode = (): number => {
  const CODE_LENGTH = 4;
  return +new Array(CODE_LENGTH)
    .fill(0)
    .map(() => Math.floor(Math.random() * (10 - 1) + 1))
    .join('');
};
