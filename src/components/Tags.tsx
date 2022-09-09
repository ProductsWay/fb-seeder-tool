import { MultiSelect } from "@mantine/core";

import logger from "../utils/logger";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur: (evt: any) => void;
};

export default function Tags({ value, onChange, onBlur }: Props) {
  logger.info("Tags", value);
  const data =
    value.length > 0
      ? value.split(",").map((item) => ({ value: item, label: item }))
      : [];

  return (
    <MultiSelect
      label="Tags"
      data={data}
      defaultValue={value.split(",")}
      placeholder="Select Tags"
      creatable
      searchable
      getCreateLabel={(query) => `+ Create ${query}`}
      onChange={(selectedValue) => {
        onChange(selectedValue.join(","));
      }}
      onBlur={onBlur}
      onCreate={(query) => {
        const item = { value: query, label: query };
        onChange([value, query].join(","));
        return item;
      }}
    />
  );
}
