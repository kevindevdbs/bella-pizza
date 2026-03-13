"use client"

import { useEffect, useState } from "react";

export default function Dashboard() {

    const [token , setToken] = useState<string | null >("")
   

    useEffect(()=>{
        const savedToken = localStorage.getItem("token");
         setToken(savedToken);
    },[])


 return (
   <div>
    {token}
   </div>
 );
}