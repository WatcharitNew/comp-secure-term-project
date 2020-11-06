import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async get() {
    return await this.postsService.get();
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }

  @Post(':postId')
  async update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  async delete(@Param('postId') postId: string) {
    return await this.postsService.delete(postId);
  }
}
