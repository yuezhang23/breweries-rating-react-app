import * as client from "./client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

interface LoggingProps {
    children: any;  
}

function Logging({ children }: LoggingProps ) {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    
    const fetchCurrentUser = async () => {
        const user = await client.profile();
        dispatch(setCurrentUser(user));
        setLoading(false);
    }
    useEffect(() => {
        fetchCurrentUser();
    }, [])
    return <> {!loading && children} </>
}

export default Logging;