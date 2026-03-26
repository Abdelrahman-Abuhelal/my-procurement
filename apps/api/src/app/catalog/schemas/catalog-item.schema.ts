import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type CatalogItemDocument = CatalogItem & Document;

@Schema({ timestamps: true })
export class CatalogItem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;
}

export const CatalogItemSchema = SchemaFactory.createForClass(CatalogItem);
