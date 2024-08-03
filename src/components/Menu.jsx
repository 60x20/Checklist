import { Link, useNavigate } from "react-router-dom";
import { menuStateContext } from "../layouts/RootLayout";
import { useContext } from "react";

const Menu = () => {
  const navigate = useNavigate();
  function goToRequestedDateHandler(e) {
    navigate(e.currentTarget.value.replaceAll('-', '/'));
  }

  const { menuState } = useContext(menuStateContext);

  return (
    <>
    { menuState ? (
    <aside role="menu" id="menu">
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
    </aside>
    ) : false }
    </>
  );
};

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

const dateOfToday = returnCurrentDate();

export default Menu;