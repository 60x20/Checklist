import { useContext } from 'react';

// helpers
import { assertCondition } from '../helpers/utils';

export default function useSafeContext<ContextValueType>(
  context: React.Context<ContextValueType>,
) {
  const contextValue = useContext(context);
  assertCondition(
    contextValue !== null,
    'the provider initializes the context before any consumer can use it',
  );
  return contextValue;
}
