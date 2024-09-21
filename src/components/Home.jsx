import { Link } from "react-router-dom";
import { useContext } from "react";

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";

// helpers
import { monthNames } from "../helpers/validateUnitsFromDate";

const Home = () => {
  const currentDate = useContext(currentDateContext);
  
  return (
    <div id="home">
      <h1>Today: <Link to={currentDate.YMD.replaceAll('-', '/')}>
      <time dateTime={currentDate.YMD}>
      {`${currentDate.date.day} ${monthNames[parseInt(currentDate.date.month, 10)]} ${currentDate.date.year}`}
      </time>
      </Link></h1>
    </div>
  );
}
 
export default Home;