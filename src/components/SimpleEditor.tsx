import { DevTool } from "@hookform/devtools";
import { RichTextEditor } from "@mantine/rte";
import { Controller, useForm } from "react-hook-form";

type Props = {
  readonly onSubmitHandler: (data: FormValues) => void;
  readonly hasSelected: boolean;
};

type FormValues = {
  body: string;
};

function SimpleEditor({ onSubmitHandler, hasSelected }: Props) {
  const { handleSubmit, control } = useForm<FormValues>();
  const onSubmit = handleSubmit((data: FormValues) => {
    onSubmitHandler(data);
  });
  return (
    <div className="overflow-auto w-2/3 max-h-96">
      <DevTool control={control} placement="top-right" />
      <form className="container" onSubmit={onSubmit}>
        <Controller
          name="body"
          control={control}
          render={({ field }) => <RichTextEditor {...field} />}
        />

        <div className="mt-4 w-full form-control">
          {hasSelected && (
            <button className="btn" type="submit">
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default SimpleEditor;
