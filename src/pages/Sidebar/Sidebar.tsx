import { useState } from "react";
import { useUser } from "../../contexts/UserProvider";
import { User } from "../../data/models/User";

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
    { title: "Journal", route: "/journal", icon: JournalIcon },
    { title: "Stats", route: "/statistics", icon: StatsIcon },
    { title: "Groups", route: "/groups", icon: GroupsIcon },
    { title: "Settings", route: "/settings", icon: SettingsIcon },
  ];

  const [select, setSelect] = useState("Entries");

  const { height } = useWindowDimensions();

  return (
    <>
      <div className="flex w-full">
        <div
          id="docs-sidebar"
          className="transition-all duration-300 transform hidden top-0 left-0 bottom-0 z-[60] min-w-[320px] bg-light_yellow border-gray-200 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="h-full flex flex-col">
            <div className="m-4 grow flex flex-col">
              <div className="m-4 grow flex flex-col">
                <div className="mb-1 text-sm font-semibold text-black">
                  Account
                </div>
                <a
                  className="flex-none dark:text-white"
                  href={"/profile/" + user!.id}
                >
                  <div className="mb-6 rounded-xl flex items-center">
                    <div
                      className="items-center mr-2"
                      onClick={() => setSelect("")}
                    >
                      <img
                        className="mx-3 justify-center max-w-[40px] max-h-[40px] block mx-auto rounded-full sm:mx-0 sm:shrink-0"
                        src={user!.profile_picture}
                        alt="profile"
                      />
                    </div>
                    <div className="text-black mr-2">
                      <div className="font-semibold text-base">
                        {user!.username}
                      </div>
                      <div className="text-xs">
                        Logging since {user!.created.substring(0, 4)}
                      </div>
                    </div>
                    <button
                      className={
                        "w-3/10 text-sm text-brown border border-brown shadow-lg font-semibold rounded-lg text-sm py-1 px-3 outline-none text-center ml-1.5 min-w-[78px]"
                      }
                      onClick={useUser().logoutUser}
                    >
                      <label>Log Out</label>
                    </button>
                  </div>
                </a>
                <HappinessForm height={height} />
                <div className="flex flex-col grow">
                  <nav className="w-full grow relative">
                    {navConfig.map((entry, index) => {
                      return (
                        <div key={index} className={"w-full"}>
                          <LinkButton
                            icon={<img src={entry.icon} />}
                            label={entry.title}
                            onClick={() => setSelect(entry.title)}
                            href={entry.route}
                            className={
                              "mt-2 hover:bg-medium_yellow " +
                              (select === entry.title
                                ? "bg-medium_yellow text-brown"
                                : "bg-light_yellow text-dark_gray") +
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
        <div>{element}</div>
      </div>
    </>
  );
}
