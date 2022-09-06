import { NodeEnv } from '../types/App';

export const getRequiredEnvsByNodeEnv = (
  envs: { [key in NodeEnv | 'common']?: string[] },
  nodeEnv: NodeEnv,
): string[] => {
  const { common = [] } = envs;
  const envsByNodeEnv = envs[nodeEnv] || [];
  return [...common, ...envsByNodeEnv];
};
