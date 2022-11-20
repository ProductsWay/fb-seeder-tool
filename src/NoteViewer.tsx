import { useAtom } from "jotai";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

import { FbGroups } from "./components/FbGroups";
import { FbPages } from "./components/FbPages";
import SimpleEditor from "./components/SimpleEditor";
import { Stats } from "./components/Stats";
import { isSelected, selectedFacebookIdsAtom } from "./store";
import logger from "./utils/logger";

export function NoteViewer({ onSubmit }: { onSubmit: (msg: string) => void }) {
  const [tab, setTab] = useState<"group" | "page">("group");
  const [ids, setIds] = useAtom(selectedFacebookIdsAtom);
  const [pages] = useLocalStorageState("pages", {
    defaultValue: [],
  });
  const [groups] = useLocalStorageState("groups", {
    defaultValue: [],
  });

  return (
    <div className="flex flex-col py-8 px-4 mx-auto">
      <div className="flex flex-row gap-2 py-8 px-4 mx-auto">
        <Stats totalGroups={groups.length} totalPages={pages.length} />

        <div className="flex flex-col">
          <SimpleEditor
            onSubmitHandler={(formData) => onSubmit(formData.body)}
            hasSelected={ids.length > 0}
          />
          {/* Show the selected page/group and submit button */}
          <div className="grid grid-cols-2 gap-4">
            {ids.length > 0 &&
              ids?.map((id) => (
                <div key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      logger.info(id);
                      const [groupId, groupName] = id.split("|");
                      const group: { id: number; name: string } = {
                        id: Number(groupId),
                        name: groupName,
                      };
                      setIds(
                        isSelected(ids, group)
                          ? ids.filter(
                              (fid) => fid !== `${group.id}|${group.name}`
                            )
                          : [...ids, `${group.id}|${group.name}`]
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-4 h-4 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                  <a
                    className="link link-accent"
                    href={"https://facebook.com/" + id.split("|")[0]}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="badge">{id.split("|")[1]}</span>
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="tabs">
        <a
          onClick={() => setTab("group")}
          className={
            tab === "group" ? "tab tab-active tab-lifted" : "tab tab-lifted"
          }
        >
          My Groups
        </a>
        <a
          onClick={() => setTab("page")}
          className={
            tab === "page" ? "tab tab-active tab-lifted" : "tab tab-lifted"
          }
        >
          My Pages
        </a>
      </div>
      <div className="py-2 mt-2 bg-base-200">
        {tab === "group" ? (
          <FbGroups groups={groups} />
        ) : (
          <FbPages pages={pages} />
        )}
      </div>
    </div>
  );
}
