import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuState, setMenuState] = useState(!false);
  const navigate = useNavigate();  

  function goToRequestedDateHandler(e) {
    // console.log(e.currentTarget.value);
    navigate(e.currentTarget.value.replaceAll('-', '/'));
  }

  function returnCurrentDate() {
    const currentDate = new Date();
    
    const year = currentDate.getFullYear();
    // month is zero-indexed
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    return ({
      DMY: `${day}-${month}-${year}`,
      YMD: `${year}-${month}-${day}`
    });
  }
  
  const dateOfToday = useMemo(returnCurrentDate);
  return ( 
    <nav>
      <button
        onClick={() => setMenuState(!menuState)}
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
      <aside role="menu" id="menu">
        { menuState
          ? <>
            <h2>Previous Checklists</h2>
            {/* get previous checklists */}
            {[
              <p key={1}>checklist3</p>,
              <p key={2}>checklist2</p>,
              <p key={3}>checklist1</p>
            ]}
            <label>
              <span>go to: </span>
              <input 
                onChange={goToRequestedDateHandler}
                type="date"
                min="2000-01-01"
                defaultValue="2020-1-1"
                max="2100-12-31"
              />
            </label>
            <p><Link to={dateOfToday.YMD.replaceAll('-', '/')}>today: {dateOfToday.DMY}</Link></p>
            <p>all</p>
          </>
          : ''
        } 
      </aside>
    </nav>
  );
};
 
export default Navbar;