import { useState } from "react";
import { useUser } from "../../contexts/UserProvider";
import { User } from "../../data/models/User";

import EntriesIcon from "../../assets/book.svg?react";
import JournalIcon from "../../assets/encrypted.svg?react";
import StatsIcon from "../../assets/graph.svg?react";
import GroupsIcon from "../../assets/groups.svg?react";
import SettingsIcon from "../../assets/settings.svg?react";
import LinkButton from "../../components/LinkButton";
import HappinessForm from "./HappinessForm";

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

  return (
    <>
      <div className="flex w-full">
        <div
          id="docs-sidebar"
          className="transition-all duration-300 transform hidden top-0 left-0 bottom-0 z-[60] w-[320px] bg-light_yellow border-gray-200 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="m-4">
            <div className="m-4">
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
              <HappinessForm />

              <nav className="w-full">
                {navConfig.map((entry, index) => {
                  return (
                    <div key={index}>
                      <LinkButton
                        icon={<img src={entry.icon} />}
                        label={entry.title}
                        onClick={() => setSelect(entry.title)}
                        href={entry.route}
                        className={
                          "w-full " + (select === entry.title)
                            ? "bg-medium_yellow"
                            : "bg-light_yellow"
                        }
                      />
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
        <div>{element}</div>
      </div>
    </>
  );
}
