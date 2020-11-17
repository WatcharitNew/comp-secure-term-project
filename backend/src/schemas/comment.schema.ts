import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop()
  content: string;

  @Prop()
  createdTime: Date;

  @Prop()
  updatedTime: Date;

  @Prop()
  userId: string;

  @Prop()
  postId: string;

  @Prop()
  displayName: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
