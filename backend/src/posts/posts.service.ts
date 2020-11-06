import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { Post } from '../schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
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
    return await this.postModel.updateOne(
      { _id: postId },
      { content, updatedTime: new Date() },
    );
  }
}
