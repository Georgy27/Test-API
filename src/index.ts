require("dotenv").config();
import "reflect-metadata";
import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { DataSource } from "typeorm";
import { UserEntity } from "./entities/User";

const main = async () => {
  try {
    const AppDataSource = new DataSource({
      type: "postgres",
      database: process.env.DB_NAME,
      entities: [UserEntity],
      logging: true,
      synchronize: true,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    await AppDataSource.initialize();
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver],
        validate: false,
      }),
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await apolloServer.start();
    const app: Express = express();

    apolloServer.applyMiddleware({ app });

    app.get("/", (req, res) => {
      res.send("hello world");
    });

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

main();
