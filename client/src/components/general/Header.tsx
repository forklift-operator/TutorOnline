import {
  useNavigate,
} from "react-router";
import { Button } from "../ui/button";
import type { IUser } from "../../../../server/src/db/model/userModel";
import type { Credentials } from "@/common/commonTypes";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

type Props = {
    user: IUser | null;
    onLogout: () => void;
    onLogin: (credentials: Credentials) => Promise<void>;
    onRegister: (user: Omit<IUser, '_id'>) => Promise<void>,
}

export default function Header({ user, onLogout, onLogin, onRegister}: Props) {

  const navigate = useNavigate();

  return (
      <nav className='Header flex flex-row gap-4 justify-center p-5 shadow-xl'>
        <Button
            variant={window.location.pathname === '/' ? 'secondary' : 'default'}
            onClick={() => navigate('/')}>
              Home
        </Button>
        {user ? (
          <>
            <Button
                variant={window.location.pathname === '/courses' ? 'secondary' : 'default'}
                onClick={() => navigate('/courses')}>
                  Courses
            </Button>
            <Button
                variant={window.location.pathname === '/teachers' ? 'secondary' : 'default'}
                onClick={() => navigate('/teachers')}>
                  Teachers
            </Button>
            {user.roles.includes('admin') &&
                <Button
                    variant={window.location.pathname === '/users' ? 'secondary' : 'default'}
                    onClick={() => navigate('/users')}>
                      Users
                </Button>
            }
            <Button 
                variant={window.location.pathname === '/courses/my' ? 'secondary' : 'default'}
                onClick={() => navigate('/courses/my')}>
                  My Courses
            </Button>

            <Button variant={'destructive'} onClick={() => onLogout()}>Logout</Button>
          </>
        ) : (
          <>
            <Login onLogin={onLogin}/>
            <Register onRegister={onRegister}/>
          </>
        )}
      </nav>
  );
}