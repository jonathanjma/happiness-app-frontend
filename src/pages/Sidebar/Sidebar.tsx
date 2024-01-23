import { useState } from "react";
import { useUser } from "../../contexts/UserProvider";

import EntriesIcon from "../../assets/book.svg";
import JournalIcon from "../../assets/encrypted.svg";
import StatsIcon from "../../assets/graph.svg";
import GroupsIcon from "../../assets/groups.svg";
import SettingsIcon from "../../assets/settings.svg";
import LinkButton from "../../components/LinkButton";
import HappinessForm from "./HappinessForm";
import { useWindowDimensions } from "../../utils";

export default function Sidebar({ element }: { element: React.ReactElement }) {
  const { user } = useUser();

  const navConfig = [
    { title: "Entries", route: "/home", icon: EntriesIcon },
    { title: "Private Entries", route: "/journal", icon: JournalIcon },
    { title: "Stats", route: "/statistics", icon: StatsIcon },
    { title: "Groups", route: "/groups", icon: GroupsIcon },
    { title: "Settings", route: "/settings", icon: SettingsIcon },
  ];

  const [selectedLink, setSelectedLink] = useState("");

  const { height } = useWindowDimensions();

  return (
    <div className="flex w-full">
      <div
        id="docs-sidebar"
        className="scrollbar-y scroll-hidden bottom-0 left-0 top-0 z-[60] h-screen min-w-[320px] max-w-[320px] transform overflow-y-auto border-gray-200 bg-light_yellow transition-all duration-300 lg:bottom-0 lg:right-auto lg:block lg:translate-x-0"
      >
        <div className="flex h-full flex-col">
          <div className="m-4 flex grow flex-col">
            <div className="m-4 flex grow flex-col">
              <div className="mb-1 text-sm font-semibold text-dark_gray">
                Account
              </div>
              <a className="flex-none" href={"/profile/" + user!.id}>
                <div className="mb-6 flex items-center rounded-xl">
                  <div
                    className="mr-2 items-center"
                    onClick={() => setSelectedLink("")}
                  >
                    <img
                      className="mx-3 mx-auto block max-h-[40px] max-w-[40px] justify-center rounded-full sm:mx-0 sm:shrink-0"
                      src={user!.profile_picture}
                      alt="profile"
                    />
                  </div>
                  <div className="mr-2 text-secondary">
                    <div className="text-base font-semibold">
                      {user!.username}
                    </div>
                    <div className="text-xs text-light_gray">
                      Logging since {user!.created.substring(0, 4)}
                    </div>
                  </div>
                  <button
                    className={
                      "w-3/10 ml-1.5 min-w-[78px] rounded-lg border border-secondary px-3 py-1 text-center text-sm font-semibold text-secondary shadow-md1 outline-none"
                    }
                    onClick={useUser().logoutUser}
                  >
                    <label>Log Out</label>
                  </button>
                </div>
              </a>
              <HappinessForm height={height} />
              <div className="flex grow flex-col">
                <nav className="relative w-full grow">
                  {navConfig.map((entry, index) => {
                    return (
                      <div key={entry.route} className={"w-full"}>
                        <LinkButton
                          icon={<img src={entry.icon} />}
                          label={entry.title}
                          onClick={() => setSelectedLink(entry.title)}
                          href={entry.route}
                          selectedClass={[
                            "bg-yellow font-semibold text-secondary shadow-md1 ",
                            "bg-light_yellow font-medium text-dark_gray ",
                          ]}
                          className={
                            "mt-2 hover:bg-medium_yellow hover:shadow-md1 " +
                            (entry.title === "Settings" && height >= 780
                              ? " absolute bottom-0 w-[256px]"
                              : "")
                          }
                        />
                      </div>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen w-full overflow-y-auto">{element}</div>
    </div>
  );
}
