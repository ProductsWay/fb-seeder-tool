import { useAtom } from "jotai";
import React from "react";
import { useInfiniteQuery } from "react-query";

import {
  favoriteFacebookIdsAtom,
  isSelected,
  selectedFacebookIdsAtom,
} from "../store";
import { getFacebookGroup } from "../utils/api";

export const FbGroups = ({ accessToken }: { accessToken: string }) => {
  const [ids, setIds] = useAtom(selectedFacebookIdsAtom);
  const [favoriteIds, setFavoriteIds] = useAtom(favoriteFacebookIdsAtom);

  const {
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    data,
  } = useInfiniteQuery(
    ["fb-groups", accessToken],
    ({ pageParam }) => getFacebookGroup(accessToken, pageParam),
    {
      enabled: accessToken !== "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (status === "loading" || isLoading)
    return (
      <div className="justify-center h-screen items-center flex mx-auto">
        <progress className="progress w-56"></progress>
      </div>
    );

  if (error)
    return (
      <div className="justify-center h-screen items-center flex mx-auto">
        <p>{`An error has occurred: ${(error as Error).message}`}</p>
      </div>
    );

  return (
    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-center items-center mb-20">
      {/* Show all pages */}
      {(data?.pages ?? []).map((currentGroup, index) => (
        <React.Fragment key={index}>
          {currentGroup.groups.map((group) => (
            <div
              key={group.id}
              className={
                favoriteIds.includes(group.id)
                  ? "mx-auto card card-side w-full h-44 bg-yellow-200 shadow-xl"
                  : "mx-auto card card-side w-full h-44 bg-base-100 shadow-xl"
              }
            >
              <div>
                <button
                  onClick={() =>
                    setFavoriteIds(
                      favoriteIds.includes(group.id)
                        ? favoriteIds.filter((id) => id !== group.id)
                        : [...favoriteIds, group.id]
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
              <div className="card-body">
                <a
                  className="link link-accent"
                  href={"https://facebook.com/" + group.id}
                  target="_blank"
                >
                  <h2 className="card-title">{group.name}</h2>
                </a>

                <p className="text-clip overflow-hidden">{group.description}</p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() =>
                      setIds(
                        isSelected(ids, group)
                          ? ids.filter(
                              (id) => id !== `${group.id}|${group.name}`
                            )
                          : [...ids, `${group.id}|${group.name}`]
                      )
                    }
                    className="btn btn-primary"
                  >
                    {isSelected(ids, group) ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
      <div className="mx-auto mt-4 card w-full bg-base-100 shadow-xl mb-24">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="btn btn-secondary"
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>

      {isFetching ? (
        <div className="justify-center h-screen items-center flex mx-auto">
          <progress className="progress w-56">Refreshing...</progress>
        </div>
      ) : null}
    </div>
  );
};
