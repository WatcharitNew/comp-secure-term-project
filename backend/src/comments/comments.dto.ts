export class CreateCommentDto {
  readonly content: string;
  readonly userId: string;
  readonly postId: string;
}

export class UpdateCommentDto {
  readonly content: string;
}

export class CommentDto {
  readonly content: string;
  readonly postId: string;
}
