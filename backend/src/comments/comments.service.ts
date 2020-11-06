import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';
import { Comment } from '../schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async get(): Promise<Comment[]> {
    return await this.commentModel.find();
  }

  async create(createCommentDto: CreateCommentDto): Promise<{ _id: string }> {
    const { content, userId, postId } = createCommentDto;
    const commentToCreate = {
      content,
      userId,
      postId,
      createdTime: new Date(),
      updatedTime: new Date(),
    };
    const createdComment = new this.commentModel(commentToCreate);
    createdComment.save();
    return { _id: createdComment._id };
  }

  async update(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<any> {
    const { content } = updateCommentDto;
    return await this.commentModel.updateOne(
      { _id: commentId },
      { content, updatedTime: new Date() },
    );
  }
}
