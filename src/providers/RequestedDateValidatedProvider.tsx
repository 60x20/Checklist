import { createContext } from 'react';
import { useParams } from 'react-router-dom';

// helpers
import {
  type FullDateStr,
  validateUnitsFromDate,
} from '../helpers/validateUnitsFromDate';

// types
import type ChildrenProp from '../custom-types/ChildrenProp';

// custom hooks
import useSafeContext from '../custom-hooks/useSafeContext';

const requestedDateValidatedContext = createContext<PartialFullDateStr | null>(
  null,
);

type PartialFullDateStr = Partial<FullDateStr>;

const invalidFullDate: PartialFullDateStr = {
  // year: undefined,
  // month: undefined,
  // day: undefined,
};

export default function RequestedDateValidatedProvider({
  children,
}: ChildrenProp) {
  const requestedDateAsParams = useParams();
  const { year, month, day } = requestedDateAsParams;
  // if any of them are undefined, validation will throw, so immediately return {}; can happen because of menu
  const requestedDateValidated =
    year && month && day
      ? validateUnitsFromDate({ year, month, day })
      : invalidFullDate;

  return (
    <requestedDateValidatedContext.Provider value={requestedDateValidated}>
      {children}
    </requestedDateValidatedContext.Provider>
  );
}

export function useRequestedDateValidatedContext() {
  return useSafeContext(requestedDateValidatedContext);
}
