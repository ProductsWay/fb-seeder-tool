import { DevTool } from "@hookform/devtools";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

const NoteViewer = () => {
  return (
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
  );
};

type FormValues = {
  firstName: string;
  lastName: string;
};

function EditorForm() {
  const { register, handleSubmit, control } = useForm<FormValues>();

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className="min-h-screen bg-base-200">
      <DevTool control={control} placement={"top-right"} />

      <form className="container max-w-md p-4" onSubmit={onSubmit}>
        <div className="w-full max-w-xs form-control">
          <label className="label">
            <span className="label-text">First name</span>
          </label>
          <input className="w-full max-w-xs input" {...register("firstName")} />
        </div>
        <div className="w-full max-w-xs form-control">
          <label className="label">
            <span className="label-text">Last name</span>
          </label>
          <input className="w-full max-w-xs input" {...register("lastName")} />
        </div>
        <div className="w-full max-w-xs mt-4 form-control">
          <button className="btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function Welcome({ onClick }: { onClick: () => void }) {
  return (
    <div className="min-h-screen hero bg-base-200">
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
    <div>
      <div className="navbar bg-base-100">
        <a className="text-xl normal-case btn btn-ghost">
          FB Seeder - Effortless Facebook Seeding
        </a>
      </div>

      {route === "editor" && <NoteViewer />}
      {route === "form" && <EditorForm />}
      {route === "main" && <Welcome onClick={() => setRoute("editor")} />}

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
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <button
          onClick={() => setRoute("form")}
          className={route === "form" ? "active" : ""}
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
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
