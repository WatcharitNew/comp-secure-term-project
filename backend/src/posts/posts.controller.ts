import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,

  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostGuard } from 'src/guard/post.guard';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard())
  @Get()
  async get() {
    return await this.postsService.get();
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }

  @UseGuards(AuthGuard(), PostGuard)
  @Post(':postId')
  async update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(postId, updatePostDto);
  }

  @UseGuards(AuthGuard(), PostGuard)
  @Delete(':postId')
  async delete(@Param('postId') postId: string) {
    return await this.postsService.delete(postId);
  }

  // @UseGuards(AuthGuard(), PostGuard)
  // @Put('test')
  // async test(@LoadUser() user) {
  //   console.log('success', user);
  //   return true;
  // }
}
