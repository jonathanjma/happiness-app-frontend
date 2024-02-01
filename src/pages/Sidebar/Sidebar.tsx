import { useState } from "react";
import ArrowDownIcon from "../../assets/ArrowDownIcon";
import EntriesIcon from "../../assets/book.svg";
import JournalIcon from "../../assets/encrypted.svg";
import StatsIcon from "../../assets/graph.svg";
import GroupsIcon from "../../assets/groups.svg";
import SettingsIcon from "../../assets/settings.svg";
import LinkButton from "../../components/LinkButton";
import { useUser } from "../../contexts/UserProvider";
import { useWindowDimensions } from "../../utils";
import HappinessForm from "./HappinessForm";

export default function Sidebar({ element }: { element: React.ReactElement }) {
  const { user } = useUser();

  const [dropdownState, setDropdownState] = useState(false);

  const navConfig = [
    { title: "Entries", route: "/home", icon: EntriesIcon },
    { title: "Private Entries", route: "/journal", icon: JournalIcon },
    { title: "Stats", route: "/statistics", icon: StatsIcon },
    { title: "Groups", route: "/groups", icon: GroupsIcon },
    { title: "Settings", route: "/settings", icon: SettingsIcon },
  ];

  const { height } = useWindowDimensions();

  return (
    <div className="flex w-full">
      <div
        id="docs-sidebar"
        className="scrollbar-y scroll-hidden bottom-0 left-0 top-0 z-[60] h-screen min-w-[320px] max-w-[320px] transform overflow-y-auto border-gray-200 bg-light_yellow transition-all duration-300 lg:bottom-0 lg:right-auto lg:block lg:translate-x-0"
      >
        <div className="flex h-full flex-col">
          <div className="m-4 flex grow flex-col">
            <div className="relative m-4 flex grow flex-col">
              <div
                className={
                  "mb-6 flex w-full select-none items-center space-x-4 rounded-xl p-1 pr-4 hover:cursor-pointer hover:bg-medium_yellow" +
                  (dropdownState ? " bg-yellow shadow-md1" : "")
                }
                onClick={() => setDropdownState(!dropdownState)}
              >
                <div className="items-center">
                  <img
                    className="mx-auto block max-h-[32px] max-w-[32px] justify-center rounded-full sm:mx-0 sm:shrink-0"
                    src={user!.profile_picture}
                    alt="profile"
                  />
                </div>
                <div className="text-secondary">
                  <div className="text-base font-semibold">
                    {user!.username}
                  </div>
                  <div className="text-xs text-gray-400">
                    Logging since {user!.created.substring(0, 4)}
                  </div>
                </div>
                <div className="flex flex-1" />
                <div>{<ArrowDownIcon />}</div>
              </div>
              {dropdownState ? (
                <>
                  <div className="absolute top-11 mt-2 w-full rounded-xl border border-gray-200 shadow-xl">
                    <LinkButton
                      label={"Profile"}
                      href={"/profile/" + user!.id}
                      selectedClass={[
                        "bg-yellow font-semibold text-secondary shadow-md1",
                        "bg-white font-medium text-gray-600",
                      ]}
                      className={
                        "rounded-b-none bg-white hover:bg-medium_yellow hover:shadow-md1"
                      }
                    />
                    <button
                      className={
                        "flex w-full flex-row rounded-b-xl bg-white py-3 pl-3 pr-4.5 font-medium text-gray-600 outline-none hover:bg-medium_yellow hover:shadow-md1"
                      }
                      onClick={useUser().logoutUser}
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
              <HappinessForm height={height} />
              <div className="flex grow flex-col">
                <nav className="relative w-full grow">
                  {navConfig.map((entry) => {
                    return (
                      <div key={entry.route} className={"w-full"}>
                        <LinkButton
                          icon={<img src={entry.icon} />}
                          label={entry.title}
                          href={entry.route}
                          selectedClass={[
                            "bg-yellow font-semibold text-secondary shadow-md1 ",
                            "font-medium text-gray-600 ",
                          ]}
                          className={
                            "mt-2 hover:bg-medium_yellow hover:shadow-md1 " +
                            (entry.title === "Settings" && height >= 750
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
