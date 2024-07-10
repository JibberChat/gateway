import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { GetUserEntity } from "@modules/user/entities/user.entity";

export const GetUser = createParamDecorator((_data: unknown, context: ExecutionContext): GetUserEntity => {
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext().req;

  if (req.user) return req.user as GetUserEntity;

  throw new NotFoundException();
});
