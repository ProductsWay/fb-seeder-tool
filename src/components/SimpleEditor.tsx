import { DevTool } from "@hookform/devtools";
import { RichTextEditor } from "@mantine/rte";
import { Controller, useForm } from "react-hook-form";

type Props = {
  onSubmitHandler: (data: FormValues) => void;
  hasSelected: boolean;
};

type FormValues = {
  body: string;
};

const SimpleEditor = ({ onSubmitHandler, hasSelected }: Props) => {
  const { handleSubmit, control } = useForm<FormValues>();
  const onSubmit = handleSubmit((data: FormValues) => onSubmitHandler(data));
  return (
    <div className="max-h-96 overflow-auto">
      <DevTool control={control} placement={"top-right"} />
      <form className="container" onSubmit={onSubmit}>
        <Controller
          name="body"
          control={control}
          render={({ field }) => <RichTextEditor {...field} />}
        />

        <div className="w-full mt-4 form-control">
          {hasSelected && (
            <button className="btn" type="submit">
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SimpleEditor;
