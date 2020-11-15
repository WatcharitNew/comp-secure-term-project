import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';
import { Comment } from '../schemas/comment.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly userService: UsersService,
  ) {}

  async get(): Promise<Comment[]> {
    return await this.commentModel.find(
      {},
      ['_id', 'content', 'displayName', 'userId', 'createdTime', 'postId'],
      {
        sort: {
          createdTime: 1,
        },
      },
    );
  }

  async create(createCommentDto: CreateCommentDto): Promise<{ _id: string }> {
    const { content, userId, postId } = createCommentDto;
    const commentToCreate = {
      content,
      userId,
      postId,
      createdTime: new Date(),
      updatedTime: new Date(),
      displayName: await this.userService.getDisplayNameByUserId(userId),
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
    return await this.commentModel.findOneAndUpdate(
      { _id: commentId },
      { content, updatedTime: new Date() },
      { new: true },
    );
  }

  async delete(commentId: string): Promise<{ deletedCount: number }> {
    const deletedComment = await this.commentModel.deleteOne({
      _id: commentId,
    });
    return { deletedCount: deletedComment.deletedCount };
  }

  async getCommentUserIdByCommentId(commentId: string): Promise<string> {
    const comment = await this.commentModel.findOne({ _id: commentId }).exec();
    return comment.userId;
  }
}
