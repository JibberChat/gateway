import { Kind, ValueNode } from "graphql";

import { CustomScalar, Scalar } from "@nestjs/graphql";

@Scalar("Date", () => Date)
export class DateScalar implements CustomScalar<number | string, Date> {
  description = "Date custom scalar type";

  parseValue(inputValue: unknown): Date {
    if (typeof inputValue === "number") {
      return new Date(inputValue);
    }
    if (typeof inputValue === "string") {
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    throw new Error("Invalid input for DateScalar. Expected a number or valid ISO date string.");
  }

  serialize(value: unknown): number {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === "string") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.getTime();
      }
    }
    throw new Error("Invalid value for DateScalar. Expected a Date.");
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return null;
  }
}
