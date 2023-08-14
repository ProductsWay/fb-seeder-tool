import { MultiSelect } from "@mantine/core";

import logger from "../utils/logger";

type Props = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onBlur: (evt: any) => void;
};

export default function Tags({ value, onChange, onBlur }: Props) {
  logger.info("Tags", value);
  const data =
    value.length > 0
      ? value.split(",").map((item) => ({ value: item, label: item }))
      : [];

  return (
    <MultiSelect
      creatable
      searchable
      label="Tags"
      data={data}
      defaultValue={value.split(",")}
      placeholder="Select Tags"
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
