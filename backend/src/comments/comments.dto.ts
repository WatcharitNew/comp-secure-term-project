export class CreateCommentDto {
  readonly content: string;
  readonly userId: string;
  readonly postId: string;
}

export class UpdateCommentDto {
  readonly content: string;
}
