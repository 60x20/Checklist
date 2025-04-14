// contexts
import { useRefContext } from '../providers/RefProvider';

export default function Footer() {
  const {
    refs: { footerRef },
  } = useRefContext();

  return <footer ref={footerRef}></footer>;
}
