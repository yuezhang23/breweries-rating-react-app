import { useSelector } from "react-redux";
import { ProjectState } from "../store";

function Home() {

  const { currentUser } = useSelector((state: ProjectState) => state.userReducer.currentUser);
  
  return (
    <div className="container-fluid">
      Temp Home
    </div>
  );
}

export default Home;
  