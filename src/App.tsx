import { DevTool } from "@hookform/devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";
import {
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  Divider,
  Editor,
  EditorComposer,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  ToolbarPlugin,
  UnderlineButton,
} from "verbum";

import { FbGroups } from "./components/FbGroups";
import { FbPages } from "./components/FbPages";
import SimpleEditor from "./components/SimpleEditor";
import { selectedFacebookIdsAtom } from "./store";
import logger from "./utils/logger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refer https://react-query.tanstack.com/guides/window-focus-refetching
      refetchOnWindowFocus: false,
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours, refer https://tanstack.com/query/v4/docs/plugins/persistQueryClient
      // suspense: true, // refer https://tanstack.com/query/v4/docs/guides/suspense
    },
  },
  // custom logger https://tanstack.com/query/v4/docs/guides/custom-logger
  logger: {
    log: (...args) => {
      logger.debug(args);
    },
    warn: (...args) => {
      logger.warn(args);
    },
    error: (...args) => {
      logger.error(args);
    },
  },
});

const NoteViewer = () => {
  const [tab, setTab] = useState<"group" | "page">("group");
  const [accessToken] = useLocalStorageState("accessToken", {
    defaultValue: "",
  });
  const [ids] = useAtom(selectedFacebookIdsAtom);

  const onChange = (editorState: string) => {
    logger.info(`onChange: ${editorState}`);
  };

  const isVerbumReady = false;

  return (
    <div className="flex flex-col mx-auto px-4 py-8">
      <div className="h-96 mx-auto">
        {/* TODO: support get value from editor when verbum is ready */}
        {isVerbumReady ? (
          <EditorComposer>
            <Editor hashtagsEnabled={true} onChange={onChange}>
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
        ) : (
          <SimpleEditor
            onSubmitHandler={(formData) => onChange(formData.body)}
          />
        )}
        {/* Show the selected page/group and submit button */}
        {ids.length > 0 && (
          <div className="flex flex-col items-center justify-center">
            {ids?.map((id) => (
              <a
                className="link link-accent"
                href={"https://facebook.com/" + id.split("|")[0]}
                rel="noopener noreferrer"
                target="_blank"
                key={id}
              >
                <h2 className="card-title">{id}</h2>
              </a>
            ))}
            <button className="btn">Publish</button>
          </div>
        )}
      </div>
      <div className="tabs">
        <a
          onClick={() => setTab("group")}
          className={
            tab === "group" ? "tab tab-lifted tab-active" : "tab tab-lifted"
          }
        >
          My Groups
        </a>
        <a
          onClick={() => setTab("page")}
          className={
            tab === "page" ? "tab tab-lifted tab-active" : "tab tab-lifted"
          }
        >
          My Pages
        </a>
      </div>
      <div className="mt-2 bg-base-200 py-2">
        {tab === "group" ? (
          <FbGroups accessToken={accessToken} />
        ) : (
          <FbPages accessToken={accessToken} />
        )}
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

            <div className="tooltip" data-tip="Create a new access token">
              <a
                rel="noopener noreferrer"
                className="btn btn-info"
                target="_blank"
                href="https://developers.facebook.com/tools/accesstoken/"
              >
                Generate
              </a>
            </div>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Place your access token"
            defaultValue={accessToken}
            {...register("accessToken", {
              required: true,
            })}
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
  const { reset } = useQueryErrorResetBoundary();
  const [route, setRoute] = useState<"main" | "form" | "editor">("main");
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              There was an error!
              <button className="btn" onClick={() => resetErrorBoundary()}>
                Try again
              </button>
            </div>
          )}
        >
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
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
