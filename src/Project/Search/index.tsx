import { useSelector } from "react-redux";
import { ProjectState } from "../store";

function Search() {

  const { currentUser } = useSelector((state: ProjectState) => state.userReducer.currentUser);
  
  return (
    <div className="container-fluid">
      Temp Search
    </div>
  );
}

export default Search;