import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { User, UserStats } from "../../data/models/User";
import PostIcon from "../../assets/post.svg";
import TableIcon from "../../assets/table.svg";
import GraphIcon from "../../assets/graph.svg";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import { TabButton, TabPanel } from "../../components/Tabs";
import ToastMessage from "../../components/ToastMessage";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Happiness } from "../../data/models/Happiness";
import CalendarPanel from "./CalendarPanel";
import TimelinePanel from "./TimelinePanel";
import GraphPanel from "./GraphPanel";

export default function Profile() {
  const { api } = useApi();
  const { userID: uid } = useParams();
  const { user, getUserFromToken } = useUser();
  const [pfpError, setPfpError] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Happiness>();

  const userId = parseInt(uid!);
  const loggedInUser = userId === user!.id;

  const { isLoading, data, isError } = useQuery<User>({
    queryKey: ["fetchUser", userId],
    queryFn: () => api.get<User>("/user/" + userId).then((res) => res.data),
    enabled: !loggedInUser,
  });

  const userStats = useQuery<UserStats>({
    queryKey: ["fetchUserStats", userId],
    queryFn: () =>
      api
        .get<UserStats>("/user/count/?user_id=" + userId)
        .then((res) => res.data),
  });

  const changePfp = useMutation({
    mutationFn: (formData: FormData) => api.post("/user/pfp/", formData),
    onError: () => {
      setPfpError(true);
    },
    onSuccess: () => {
      setPfpError(false);
      toast.custom(
        <ToastMessage message="✅ Successfully Changed Profile Picture" />,
      );
      // update pfp image on page
      getUserFromToken();
    },
  });

  const handlePfpUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // make API request when image selected
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      changePfp.mutate(formData);
    }
  };

  return (
    <Row className="mt-16 justify-center">
      <div className="lg:w-3/4">
        {isLoading ? (
          <Spinner className="ml-8" />
        ) : (
          <>
            {isError ? (
              <p className="text-gray-400">Error: Could not load profile.</p>
            ) : (
              <>
                <div className="mx-8">
                  <Row className="mb-6 gap-x-6">
                    <img
                      className="max-h-[96px] min-w-[96px] rounded-full"
                      src={
                        loggedInUser
                          ? user!.profile_picture
                          : data!.profile_picture
                      }
                      alt="profile"
                    />
                    <Column className="gap-y-1">
                      <h2>{loggedInUser ? user!.username : data!.username}</h2>
                      {userStats.isLoading ? (
                        <Spinner variaton="SMALL" />
                      ) : (
                        <p className="font-normal text-gray-600">
                          {`Groups: ${userStats.data!.groups} | Entries: ${
                            userStats.data!.entries
                          }`}
                        </p>
                      )}
                      <p className="font-normal text-gray-600">
                        {"Member Since: " +
                          new Date(
                            loggedInUser ? user!.created : data!.created,
                          ).toLocaleString("en-us", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                          })}
                      </p>
                    </Column>
                    <div className="flex-grow"></div>
                    {loggedInUser && (
                      <div>
                        <Button
                          label="Change Photo"
                          variation="FILLED"
                          fileInput={true}
                          onFileChange={handlePfpUpload}
                          icon={
                            changePfp.isLoading ? (
                              <Spinner variaton="SMALL" />
                            ) : undefined
                          }
                        />
                        {pfpError && (
                          <p className="mt-2 font-normal text-error">
                            Must be image <br /> and &lt; 10MB
                          </p>
                        )}
                      </div>
                    )}
                  </Row>
                  <div>
                    <nav aria-label="Tabs" role="tablist">
                      <TabButton index={1} icon={PostIcon} title="TIMELINE" />
                      <TabButton index={2} icon={TableIcon} title="CALENDAR" />
                      <TabButton index={3} icon={GraphIcon} title="GRAPH" />
                    </nav>
                  </div>
                </div>
                <div className="feed_height2">
                  <TabPanel index={1}>
                    <TimelinePanel
                      userId={userId}
                      setEntry={setSelectedEntry}
                    />
                  </TabPanel>
                  <TabPanel index={2}>
                    <CalendarPanel
                      userId={userId}
                      setEntry={setSelectedEntry}
                    />
                  </TabPanel>
                  <TabPanel index={3}>
                    <GraphPanel
                      userId={userId}
                      selectedEntry={selectedEntry}
                      setEntry={setSelectedEntry}
                    />
                  </TabPanel>
                </div>
              </>
            )}
          </>
        )}
        {selectedEntry && (
          <HappinessViewerModal
            happiness={selectedEntry}
            id="happiness-viewer"
          />
        )}
      </div>
    </Row>
  );
}
