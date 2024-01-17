import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import TextField from "../../components/TextField";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";
import { Constants } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Token } from "../../data/models/Token";

export default function LoginModal({ id, onCreateAccountClick, onForgotPassword }: {
  id: string;
  onCreateAccountClick: () => void;
  onForgotPassword: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const { getUserFromToken } = useUser();
  const { api } = useApi();

  const loginMutation = useMutation({
    mutationFn: () => api
      .post<Token>(
        "/token/",
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        },
      ).then((res) => res.data),
    onError: () => {
      setHasError(true);
    },
    onSuccess: (token: Token) => {
      localStorage.setItem(Constants.TOKEN, token.session_token);
      getUserFromToken();
    }
  });

  useEffect(() => {
    setHasError(false);
  }, [username, password]);

  const handleLogin = () => {
    if (!hasError) loginMutation.mutate();
  };


  return (
    <ClosableModal
      leftContent={<h4>Log In</h4>}
      id={id}
    >
      <Row className="gap-1 my-4 w-[436px]">
        <p>Don't have an account?</p>
        <p className="text-secondary underline hover:cursor-pointer font-semibold"
          onClick={onCreateAccountClick}>
          Create an account
        </p>
      </Row>
      <div className="bg-gray-100 h-[1px] w-full" />
      <div className="h-6" />
      <TextField
        label="Username"
        value={username}
        onChangeValue={setUsername}
        type="username"
      />
      <div className="h-4" />
      <TextField
        label="Password"
        value={password}
        onChangeValue={setPassword}
        type="password"
        onEnterPressed={handleLogin}
      />
      {hasError ? <p className="text-error my-4">
        Incorrect email, username or password.
      </p> : <div className="h-6" />}
      <Row className="gap-4">
        <Button
          label="Log In"
          size="LARGE"
          onClick={handleLogin}
          icon={loginMutation.isLoading ? <Spinner variaton="SMALL" /> : undefined}
        />
        <Button
          label="Forgot password?"
          variation="TEXT"
          onClick={onForgotPassword}
        />
      </Row>
    </ClosableModal>
  );
}
