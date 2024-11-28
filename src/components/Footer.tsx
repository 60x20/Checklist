// contexts
import { useRefContext } from '../providers/RefProvider';

const Footer = () => {
  const {
    refs: { footerRef },
  } = useRefContext();

  return <footer ref={footerRef}></footer>;
};

export default Footer;
