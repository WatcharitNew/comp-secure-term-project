import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto, PostDto } from './posts.dto';
import { Post } from '../schemas/post.schema';
import { Comment } from '../schemas/comment.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly userService: UsersService,
  ) {}

  async get(): Promise<any[]> {
    return await this.postModel.find(
      {},
      ['_id', 'content', 'displayName', 'userId', 'createdTime'],
      {
        sort: {
          createdTime: -1,
        },
      },
    );
  }

  async create(createPostDto: CreatePostDto): Promise<{ _id: string }> {
    const { content, userId } = createPostDto;
    const postToCreate = {
      content,
      userId,
      createdTime: new Date(),
      updatedTime: new Date(),
      displayName: await this.userService.getDisplayNameByUserId(userId),
    };
    const createdPost = new this.postModel(postToCreate);
    createdPost.save();
    return { _id: createdPost._id };
  }

  async update(postId: string, updatePostDto: PostDto): Promise<any> {
    const { content } = updatePostDto;
    return await this.postModel.findOneAndUpdate(
      { _id: postId },
      { content, updatedTime: new Date() },
      { new: true },
    );
  }

  async delete(
    postId: string,
  ): Promise<{ deletedCount: number; deletedCommentsCount: number }> {
    const deletedPost = await this.postModel.deleteOne({ _id: postId });
    const deletedComments = await this.commentModel.deleteMany({ postId });
    return {
      deletedCount: deletedPost.deletedCount,
      deletedCommentsCount: deletedComments.deletedCount,
    };
  }

  async getPostUserIdByPostId(postId: string): Promise<string> {
    const post = await this.postModel.findOne({ _id: postId }).exec();
    return post.userId;
  }
}
