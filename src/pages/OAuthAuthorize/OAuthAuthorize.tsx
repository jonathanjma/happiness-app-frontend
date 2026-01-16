import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import Button from "../../components/Button";
import { useMutation } from "react-query";
import { useApi } from "../../contexts/ApiProvider";
import Spinner from "../../components/Spinner";
import Row from "../../components/layout/Row";
import TextField from "../../components/TextField";

interface OAuthAuthorizeResponse {
  redirect_url: string;
}

export default function OAuthAuthorize() {
  const { api } = useApi();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  // Extract OAuth parameters from URL
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method") || "plain";

  useEffect(() => {
    // Redirect to home if required OAuth parameters are missing
    if (!clientId || !redirectUri) {
      navigate("/");
      return;
    }

    // Open modal when component mounts (similar to ResetPassword pattern)
    // HSOverlay may load asynchronously, so we check after DOM is ready
    const openModal = () => {
      const modalElement = document.querySelector("#oauth-authorize-modal");
      if (window.HSOverlay && modalElement) {
        window.HSOverlay.open(modalElement);
        return true;
      }
      return false;
    };

    // Try immediately
    if (openModal()) return;

    // If HSOverlay isn't ready, check after DOM updates (next frame)
    requestAnimationFrame(() => {
      if (openModal()) return;

      // Final check after a short delay (scripts usually load quickly)
      setTimeout(openModal, 200);
    });
  }, [clientId, redirectUri, navigate]);

  useEffect(() => {
    setHasError(false);
  }, [username, password]);

  const authorizeMutation = useMutation({
    mutationFn: () =>
      api
        .post<OAuthAuthorizeResponse>(
          "/mcp/oauth/authorize",
          {
            username: username,
            password: password,
            client_id: clientId,
            redirect_uri: redirectUri,
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res.data),
    onSuccess: (response: OAuthAuthorizeResponse) => {
      // Redirect to the redirect_uri with the authorization code
      window.location.href = response.redirect_url;
    },
    onError: () => {
      setHasError(true);
    },
  });

  const handleAuthorize = () => {
    if (!hasError && username && password) {
      authorizeMutation.mutate();
    }
  };

  const handleCreateAccount = () => {
    navigate("/");
  };

  const handleForgotPassword = () => {
    navigate("/");
  };

  return (
    <div className="h-screen w-screen bg-light_yellow">
      <Modal id="oauth-authorize-modal" className="[--overlay-backdrop:static]">
        <div>
          <h4>Authorize MCP Access</h4>
          <p className="mt-2 text-gray-600">
            Sign in to allow Claude (or other MCP client) to access your
            Happiness App data.
          </p>
          <Row className="my-4 w-[436px] gap-1">
            <p>Don't have an account?</p>
            <p
              className="font-semibold text-secondary underline hover:cursor-pointer"
              onClick={handleCreateAccount}
            >
              Create an account
            </p>
          </Row>
          <div className="h-[1px] w-full bg-gray-100" />
          <div className="h-6" />
          <TextField
            label="Username or Email"
            value={username}
            onChangeValue={setUsername}
            type="email"
            autocomplete="username"
            className="w-[250px]"
          />
          <div className="h-4" />
          <TextField
            label="Password"
            value={password}
            onChangeValue={setPassword}
            type="password"
            autocomplete="current-password"
            className="w-[250px]"
            onEnterPressed={handleAuthorize}
          />
          {hasError ? (
            <p className="my-4 text-error">
              Incorrect email, username or password.
            </p>
          ) : (
            <div className="h-6" />
          )}
          <Row className="gap-4">
            <Button
              label="Authorize"
              size="LARGE"
              onClick={handleAuthorize}
              icon={
                authorizeMutation.isLoading ? (
                  <Spinner variaton="SMALL" />
                ) : undefined
              }
            />
            <Button
              label="Forgot password?"
              variation="TEXT"
              onClick={handleForgotPassword}
            />
          </Row>
        </div>
      </Modal>
    </div>
  );
}
