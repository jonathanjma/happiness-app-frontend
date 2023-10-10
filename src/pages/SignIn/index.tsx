import { useState } from 'react';
import { useUser } from '../../contexts/UserProvider';

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useUser();
  return (
    <div>
      <p className='text-black'>username</p>
      <input type='text' onChange={(e) => setUsername(e.target.value)} />
      <p>Password</p>
      <input type='text' onChange={(e) => setPassword(e.target.value)} />
      <button className='self-start'
        onClick={() => loginUser(username, password)}>
        Log in
      </button>
    </div>
  );
}
