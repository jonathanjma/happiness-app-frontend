import { useState } from 'react';
import useUser from '../../data/repositories/UserRepositoryImpl';

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { getToken } = useUser();
  return (
    <div>
      <p className='text-black'>username</p>
      <input type='text' onChange={(e) => setUsername(e.target.value)} />
      <p>Password</p>
      <input type='text' onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => getToken(username, password)} />
    </div>
  );
}
