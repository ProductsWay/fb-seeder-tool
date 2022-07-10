import { DevTool } from "@hookform/devtools";
import { invoke } from "@tauri-apps/api";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";
import {
  EditorComposer,
  Editor,
  ToolbarPlugin,
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  UnderlineButton,
  Divider,
} from "verbum";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refer https://react-query.tanstack.com/guides/window-focus-refetching
      refetchOnWindowFocus: false,
    },
  },
});

async function getFacebookPages(token: string, after = "") {
  const response = await invoke<string>("fb_pages", { token, after });
  const { data, paging } = JSON.parse(response);

  return {
    pages: data as Array<{
      id: number;
      name: string;
      link: string;
      description?: string;
      picture?: {
        data?: {
          url?: string;
        };
      };
    }>,
    nextCursor: paging?.cursors?.after,
  };
}

const NoteViewer = () => {
  const [accessToken] = useLocalStorageState("accessToken", {
    defaultValue: "",
  });

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
    <div className="flex flex-col mx-auto">
      <div className="h-96 mx-auto">
        <EditorComposer>
          <Editor hashtagsEnabled={true}>
            <ToolbarPlugin defaultFontSize="20px">
              <FontFamilyDropdown />
              <FontSizeDropdown />
              <Divider />
              <BoldButton />
              <ItalicButton />
              <UnderlineButton />
              <CodeFormatButton />
              <InsertLinkButton />
              <TextColorPicker />
              <BackgroundColorPicker />
              <TextFormatDropdown />
              <Divider />
              <InsertDropdown enablePoll={true} />
              <Divider />
              <AlignDropdown />
            </ToolbarPlugin>
          </Editor>
        </EditorComposer>
      </div>
      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-center items-center mb-20">
        {/* Show all pages */}
        {(data?.pages ?? []).map((group, index) => (
          <React.Fragment key={index}>
            {group.pages.map((page) => (
              <div
                key={page.id}
                className="mx-auto card card-side w-full h-44 bg-base-100 shadow-xl"
              >
                {page.picture?.data?.url && (
                  <figure>
                    <img src={page.picture?.data?.url} alt={page.name} />
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title">{page.name}</h2>
                  <p className="text-clip overflow-hidden">
                    {page.description}
                  </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Select</button>
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
    </div>
  );
};

type FormValues = {
  firstName: string;
  lastName: string;
  accessToken: string;
};

function SettingForm({
  onSubmitHandler,
}: {
  onSubmitHandler: (data: FormValues) => void;
}) {
  const { register, handleSubmit, control, watch } = useForm<FormValues>();
  const [accessToken, setAccessToken] = useLocalStorageState("accessToken", {
    defaultValue: "",
  });
  const onSubmit = handleSubmit((data: FormValues) => onSubmitHandler(data));

  const token = watch("accessToken");

  useEffect(() => {
    setAccessToken(token);
  }, [token]);

  return (
    <div className="justify-center h-64 items-center flex flex-col mx-auto">
      <DevTool control={control} placement={"top-right"} />
      <form className="container max-w-md p-4" onSubmit={onSubmit}>
        <div className="w-full form-control">
          <label className="label">
            <span className="label-text">Access Token</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Place your access token"
            defaultValue={accessToken}
            {...register("accessToken")}
          />
        </div>

        <div className="w-full mt-4 form-control">
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function Welcome({ onClick }: { onClick: () => void }) {
  return (
    <div className="min-h-screen hero">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">Effortless Facebook Seeding Tool</p>
          <button onClick={onClick} className="btn btn-primary">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState<"main" | "form" | "editor">("main");
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full min-h-screen bg-base-200">
        <div className="navbar bg-base-100">
          <a className="text-xl normal-case btn btn-ghost">
            FB Seeder - Effortless Facebook Seeding
          </a>
        </div>

        {route === "editor" && <NoteViewer />}
        {route === "form" && (
          <SettingForm onSubmitHandler={() => setRoute("editor")} />
        )}
        {route === "main" && <Welcome onClick={() => setRoute("form")} />}

        <div className="btm-nav">
          <button
            onClick={() => setRoute("main")}
            className={route === "main" ? "active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button
            onClick={() => setRoute("editor")}
            className={route === "editor" ? "active" : ""}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => setRoute("form")}
            className={route === "form" ? "active" : ""}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
