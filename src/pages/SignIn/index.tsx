import React, { useState } from 'react'
import { useRepo } from '../../contexts/RepoProvider';

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {userRepo} = useRepo();
  return (
    <div>
      <p>username</p>
      <input type='text' onChange={(e) => setUsername(e.target.value)} />
      <p>Password</p>
      <input type='text' onChange={(e) => setPassword(e.target.value)} />
      <button  onClick={() => userRepo.getToken(username, password)}/>
    </div>
  )
}
