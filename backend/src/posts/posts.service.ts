import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { Post } from '../schemas/post.schema';
import { Comment } from '../schemas/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async get(): Promise<Post[]> {
    return await this.postModel.find();
  }

  async create(createPostDto: CreatePostDto): Promise<{ _id: string }> {
    const { content, userId } = createPostDto;
    const postToCreate = {
      content,
      userId,
      createdTime: new Date(),
      updatedTime: new Date(),
    };
    const createdPost = new this.postModel(postToCreate);
    createdPost.save();
    return { _id: createdPost._id };
  }

  async update(postId: string, updatePostDto: UpdatePostDto): Promise<any> {
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
}
