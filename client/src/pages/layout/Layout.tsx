import Header from '../../components/general/Header';
import { Outlet } from 'react-router';
import type { IUser } from '../../../../server/src/db/model/userModel';
import type { Credentials } from '@/common/commonTypes';


type Props = {
    user: IUser | null;
    onLogout: () => void;
    onLogin: (credentials: Credentials) => Promise<void>;
    onRegister: (user: Omit<IUser, '_id'>) => Promise<void>,
}

export default function Layout({user, onLogout, onLogin, onRegister}: Props) {
  return (
    <div className='Layout w-full h-full flex flex-col bg-background text-foreground '>
      <Header onLogout={onLogout} user={user} onLogin={onLogin} onRegister={onRegister}/>
      <div className="w-full h-full overflow-x-hidden overflow-y-auto p-5">
        <Outlet/>
      </div>
    </div>
  )
}
