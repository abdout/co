"use client";

import { useCurrentUser } from "@/components/auth/use-current-user";
import { UserInfo } from "@/components/auth/user-info";



const ClientPage = () => {
  const user = useCurrentUser();

  return ( 
    <UserInfo
      label=""
      user={user}
    />
   );
}
 
export default ClientPage;