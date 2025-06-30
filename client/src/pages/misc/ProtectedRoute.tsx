import { useEffect, useState } from "react";
import type ApiClient from "../../services/apiClient";
import { Navigate, Outlet } from "react-router";
import type { HTTPResponse } from "../../common/commonTypes";
import type { IUser } from "../../../../server/src/db/model/userModel";

type ProtectedRouteProps = {
  isAllowed?: boolean,
  user?: IUser,
  redirectPath?: string, 
  apiClient: ApiClient;
}

export default function ProtectedRoute ({ isAllowed, user, apiClient, redirectPath='/' }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const validate = async () => {
      try {
        const data: HTTPResponse = await apiClient.validateToken();
        console.log(data);
        if(data.new_access_token !== undefined) {
          
          apiClient.setToken(data.new_access_token);  
        }
        setAuthorized(true);
      } catch (e) {
        console.error((e as Error).message);
      } finally {
        setLoading(false);
      }
    } 
    validate();
  }, [])
  

  if (loading) return <h1>Checking auth...</h1>

  if (!authorized) return <h1>Not authorized!</h1>

  if (isAllowed !== undefined && !isAllowed) return <Navigate to={redirectPath} replace />;
  
  if (!user) return <Navigate to={redirectPath} replace/>

  return (
    <Outlet/>
  )
}