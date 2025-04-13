// contexts
import { useRefContext } from '../providers/RefProvider';

function Footer() {
  const {
    refs: { footerRef },
  } = useRefContext();

  return <footer ref={footerRef}></footer>;
}

export default Footer;
