import mitt from "mitt";

type Events = {
  group: string;
  page: string;
};

const emitter = mitt<Events>(); // inferred as Emitter<Events>

export default emitter;
