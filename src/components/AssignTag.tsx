import { Select } from "@mantine/core";
import useLocalStorageState from "use-local-storage-state";

export default function AssignTag() {
  const [tags] = useLocalStorageState("list", {
    defaultValue: "",
  });
  return (
    <div className="ml-2 flex pt-2">
      <Select
        placeholder="Select tag"
        className="h-8"
        data={tags.split(",").map((item) => ({ value: item, label: item }))}
      />
    </div>
  );
}
