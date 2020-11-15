import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CommentsService } from 'src/comments/comments.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class CommentGuard implements CanActivate {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqUserId = request.user.userId;
    const isAdmin = await this.userService.isAdmin(reqUserId);
    if (isAdmin) return true;

    const commentId = request.params.commentId;
    const userId = await this.commentsService.getCommentUserIdByCommentId(
      commentId,
    );
    return userId === reqUserId;
  }
}
