import { Kind, ValueNode } from "graphql";

import { CustomScalar, Scalar } from "@nestjs/graphql";

@Scalar("Date", () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = "Date custom scalar type";

  parseValue(inputValue: unknown): Date {
    if (typeof inputValue === "number") {
      return new Date(inputValue);
    }
    throw new Error("Invalid input for DateScalar. Expected a number.");
  }

  serialize(value: unknown): number {
    if (value instanceof Date) {
      return value.getTime();
    }
    throw new Error("Invalid value for DateScalar. Expected a Date.");
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  }
}
