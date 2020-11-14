import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';
import { AuthGuard } from '@nestjs/passport';
import { CommentGuard } from 'src/guard/comment.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard())
  @Get()
  async get() {
    return await this.commentsService.get();
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @UseGuards(AuthGuard(), CommentGuard)
  @Post(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.update(commentId, updateCommentDto);
  }

  @UseGuards(AuthGuard(), CommentGuard)
  @Delete(':commentId')
  async delete(@Param('commentId') commentId: string) {
    return await this.commentsService.delete(commentId);
  }
}
