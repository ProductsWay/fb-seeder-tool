import { useAtom } from "jotai";
import React from "react";
import { useInfiniteQuery } from "react-query";

import { selectedFacebookIdsAtom } from "../store";
import { getFacebookPages } from "../utils/api";

export const FbPages = ({ accessToken }: { accessToken: string }) => {
  const [ids, setIds] = useAtom(selectedFacebookIdsAtom);
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
    ["fb-pages", accessToken],
    ({ pageParam }) => getFacebookPages(accessToken, pageParam),
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
          {currentGroup.pages.map((page) => (
            <div
              key={page.id}
              className="mx-auto card card-side w-full h-44 bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <a
                  className="link link-accent"
                  href={"https://facebook.com/" + page.id}
                  target="_blank"
                >
                  <h2 className="card-title">{page.page_token}</h2>
                </a>
                <div className="card-actions justify-end">
                  <button
                    onClick={() =>
                      setIds(
                        ids.includes(page.id)
                          ? ids.filter((id) => id !== page.id)
                          : [...ids, page.id]
                      )
                    }
                    className="btn btn-primary"
                  >
                    {ids.includes(page.id) ? "Remove" : "Add"}
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
