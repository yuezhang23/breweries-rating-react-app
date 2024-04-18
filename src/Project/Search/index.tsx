import { useState } from "react";

function Search() {
  const [search, setSearch] = useState('');
  const [markers, setMarkers] = useState([]);

  const handleSearch = async () => {
  };

  return (
    <div className="container-fluid">
      <div className="row p-2">
        <input className="form-control mb-2" placeholder='Search for a brewery' value={search} 
          onChange={(e) => {setSearch(e.target.value)}}/>
      </div>
      <div className="row">
      </div>

    </div>
  );

}

export default Search;