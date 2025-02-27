// src/resolvers/health.resolver.ts
import { Query, Resolver } from "type-graphql";

@Resolver()
export class HealthResolver {
  @Query(() => String)
  health() {
    return "OK";
  }
}