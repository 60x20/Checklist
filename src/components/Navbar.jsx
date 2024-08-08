import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react';
import { menuStateContext } from '../providers/MenuStateProvider';

const Navbar = () => {
  const { menuState, toggleMenuState } = useContext(menuStateContext);
  
  return (
    <nav id="top-navigation-bar">
      <h2>Checklist</h2>
      <button
        onClick={() => toggleMenuState()}
        title={menuState ? "Close menu" : "Open menu"}
        aria-expanded={menuState}
        aria-controls="menu"
        type="button"
      >
        { menuState
          ? <FontAwesomeIcon icon={faXmark} />
          : <FontAwesomeIcon icon={faBars} />
        }
      </button>
    </nav>
  );
};
 
export default Navbar;