import pino from "pino";

const logger = pino({
  prettyPrint: {
    levelFirst: true,
  },
});

export default logger;
