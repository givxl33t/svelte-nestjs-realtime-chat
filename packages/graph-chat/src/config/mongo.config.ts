import { registerAs } from "@nestjs/config";

export default registerAs('mongodb', () => {
  const { MONGO_URI } = process.env;

  return {
    uri: `${MONGO_URI}`,
  }
});