import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { UserEntity } from "../entities/User";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello(): string {
    return "Hello world";
  }

  @Query(() => [UserEntity])
  async users(): Promise<UserEntity[]> {
    return await UserEntity.find({
      order: {
        id: "ASC",
      },
    });
  }

  @Query(() => UserEntity, { nullable: true })
  async user(
    @Arg("id", () => Int)
    id: number
  ): Promise<UserEntity | null> {
    return await UserEntity.findOneBy({ id });
  }

  @Mutation(() => UserEntity)
  async createUser(
    @Arg("firstName", () => String)
    firstName: string,
    @Arg("lastName", () => String)
    lastName: string,
    @Arg("age", () => Int)
    age: number,
    @Arg("isFree", () => Boolean)
    isFree: boolean
  ): Promise<UserEntity> {
    return await UserEntity.create({ firstName, lastName, age, isFree }).save();
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id", () => Int)
    id: number
  ): Promise<boolean> {
    try {
      UserEntity.delete({ id });
      return true;
    } catch {
      return false;
    }
  }

  @Mutation(() => Boolean, { nullable: true })
  async updateUser(
    @Arg("id", () => Int)
    id: number,

    @Arg("firstName", () => String)
    firstName: string,

    @Arg("lastName", () => String)
    lastName: string,

    @Arg("age", () => Int)
    age: number,

    @Arg("isFree", () => Boolean)
    isFree?: boolean
  ): Promise<boolean | null> {
    const user = UserEntity.findOneBy({ id });
    if (!user) return null;

    try {
      await UserEntity.update({ id }, { isFree, firstName, lastName, age });
      return true;
    } catch {
      return false;
    }
  }
}
