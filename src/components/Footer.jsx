import { useContext } from "react";

// contexts
import { refContext } from "../providers/RefProvider";

const Footer = () => {
  const {refs: { footerRef }} = useContext(refContext);

  return (<footer ref={footerRef}></footer>);
};
 
export default Footer;