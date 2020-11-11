import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop()
  content: string;

  @Prop()
  createdTime: Date;

  @Prop()
  updatedTime: Date;

  @Prop()
  userId: string;

  @Prop()
  userName: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
