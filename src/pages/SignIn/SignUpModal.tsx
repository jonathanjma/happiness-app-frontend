import { useState } from "react";
import { useMutation } from "react-query";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";
import { Constants, MutationKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Token } from "../../data/models/Token";
import { User } from "../../data/models/User";

export default function SignUpModal({ id }: { id: string; }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSnapshot, setPasswordSnapshot] = useState("");
  const [hasError, setHasError] = useState(false);

  const { api } = useApi();
  const { getUserFromToken } = useUser();

  /*
  yes there's repeated code, but we looked into abstracting mutation at the 
  beginning of Happiness App V2.0 and could not find a good solution.
  Using React query in this manner is the best way to get consistent and high
  quality interaction for the user, although it is a bit verbose.
  */
  const loginMutation = useMutation({
    mutationKey: [MutationKeys.LOG_IN, username, passwordSnapshot],
    mutationFn: () =>
      api.post<Token>(
        "/token/",
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${passwordSnapshot}`)}`,
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

  const createAccountMutation = useMutation({
    mutationKey: [MutationKeys.CREATE_ACCOUNT, username, password, email],
    mutationFn: async () => {
      setPasswordSnapshot(password);
      return (await api.post<User>("/user/", {
        username: username,
        password: password,
        email: email
      })).data;
    },
    onSuccess: () => {
      loginMutation.mutate();
    },
    onError: () => {
      setHasError(true);
    }
  });


  return (
    <ClosableModal id={id} leftContent={<h4>Sign Up</h4>}>
      <Row className="w-[500px] gap-1 my-4">
        <p>Already have an account?</p>
        <p
          className="underline text-secondary hover:cursor-pointer font-semibold"
          onClick={() => { console.log("TODO open login modal"); }}>
          Log In
        </p>
      </Row>
      <div className="bg-gray-100 w-full h-[1px]" />
      <Column className="gap-4 my-6">
        <TextArea
          title="Username"
          value={username}
          onChangeValue={setUsername}
        />
        <TextArea
          title="Email Address"
          value={email}
          onChangeValue={setEmail}
        />
        <TextArea
          title="Password:"
          value={password}
          onChangeValue={setPassword}
        />
        <TextArea
          title="Confirm Password:"
          value={confirmPassword}
          onChangeValue={setConfirmPassword}
          onEnterPressed={() => {
            createAccountMutation.mutate();
          }}
        />
      </Column>
      <Button
        size="LARGE"
        label="Create Account"
        onClick={() => {
          createAccountMutation.mutate();
        }}
      />
    </ClosableModal>
  );
}

