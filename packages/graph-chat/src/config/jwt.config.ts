import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {
  const { JWT_SECRET } = process.env;

  return {
    secret: `${JWT_SECRET}`,
  }
});