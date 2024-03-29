import { useAtom } from "jotai";

import {
  favoriteFacebookIdsAtom,
  isSelected,
  selectedFacebookIdsAtom,
} from "../store";
import { type FacebookGroupItem } from "../utils/api";
import emitter from "../utils/emitter";
import AssignTag from "./AssignTag";

// Only scan fb group or page once
export function FbGroups({ groups }: { readonly groups: FacebookGroupItem[] }) {
  const [ids, setIds] = useAtom(selectedFacebookIdsAtom);
  const [favoriteIds, setFavoriteIds] = useAtom(favoriteFacebookIdsAtom);

  if (groups.length === 0) {
    return <progress className="w-56 progress" />;
  }

  return (
    <div className="grid gap-3 justify-center items-center mb-20 w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Show all pages */}
      {groups.map((group) => (
        <div
          key={group.id}
          className={
            favoriteIds.includes(group.id)
              ? "card mx-auto w-full bg-yellow-200 shadow-xl"
              : "card mx-auto w-full bg-base-100 shadow-xl"
          }
        >
          <div>
            <button
              type="button"
              onClick={() => {
                emitter.emit("group", group.id.toString());
                setFavoriteIds(
                  favoriteIds.includes(group.id)
                    ? favoriteIds.filter((id) => id !== group.id)
                    : [...favoriteIds, group.id],
                );
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>
          {group.picture?.data?.url && (
            <figure>
              <img src={group.picture?.data?.url} alt={group.name} />
            </figure>
          )}
          <div className="items-center text-center card-body">
            <a
              className="link link-accent"
              href={"https://facebook.com/" + group.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              <h2 className="card-title">{group.name}</h2>
            </a>

            <div className="justify-end card-actions">
              <div className="flex flex-1 justify-end px-2">
                <div className="flex flex-col justify-center items-stretch mx-auto">
                  <a
                    className="btn btn-primary"
                    onClick={() => {
                      setIds(
                        isSelected(ids, group)
                          ? ids.filter(
                              (id) => id !== `${group.id}|${group.name}`,
                            )
                          : [...ids, `${group.id}|${group.name}`],
                      );
                    }}
                  >
                    {isSelected(ids, group) ? "Remove" : "Add"}
                  </a>
                  <AssignTag />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
