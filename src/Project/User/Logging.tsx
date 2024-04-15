import * as client from "./client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setCurrentUser } from "./reducer";

function Logging({ children } : {children: any}) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchUser = async() => {
    try {
      setLoading(false);
      const user = await client.profile();
      dispatch(setCurrentUser(user));
    } catch (error: any) {
      console.log(error.response.data)
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {!loading && children}
    </>
  );
}

export default Logging;