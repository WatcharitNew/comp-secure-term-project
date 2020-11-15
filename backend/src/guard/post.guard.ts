import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class PostGuard implements CanActivate {
    constructor(
        private readonly postsService: PostsService,
        private readonly userService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const reqUserId = request.user.userId;
      const isAdmin = await this.userService.isAdmin(reqUserId);
      if(isAdmin) return true;
      
      const postId = request.params.postId;
      const userId = await this.postsService.getPostUserIdByPostId(postId);
      return userId === reqUserId;
    }
}