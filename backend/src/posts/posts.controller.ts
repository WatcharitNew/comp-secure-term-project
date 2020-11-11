import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { AuthGuard } from '@nestjs/passport';
import { PostGuard } from 'src/guard/post.guard';
import { LoadUser } from 'src/decorator/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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

  @UseGuards(AuthGuard(), PostGuard)
  @Put('test')
  async test(@LoadUser() user) {
    console.log('success', user);
    return true;
  }
}
