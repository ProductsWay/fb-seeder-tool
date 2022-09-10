import { Select } from "@mantine/core";
import useLocalStorageState from "use-local-storage-state";

export default function AssignTag() {
  const [tags] = useLocalStorageState("list", {
    defaultValue: "",
  });
  return (
    <Select
      placeholder="Pick one"
      data={tags.split(",").map((item) => ({ value: item, label: item }))}
    />
  );
}
