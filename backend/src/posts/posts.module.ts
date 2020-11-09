import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from '../schemas/post.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    PassportModule.registerAsync({
      useFactory: () => ({
          defaultStrategy: 'jwt',
      }),
  }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
