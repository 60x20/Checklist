import { useContext } from 'react';

export default function useSafeContext<ContextValueType>(
  context: React.Context<ContextValueType>,
) {
  const contextValue = useContext(context);
  if (contextValue) return contextValue;
  throw new Error('context value is null');
}
