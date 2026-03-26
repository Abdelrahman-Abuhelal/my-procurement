import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatalogItem, CatalogItemDocument } from './schemas/catalog-item.schema';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(CatalogItem.name)
    private catalogItemModel: Model<CatalogItemDocument>,
  ) {}

  async create(
    createCatalogItemDto: CreateCatalogItemDto,
    userId: string,
  ): Promise<CatalogItem> {
    const createdItem = new this.catalogItemModel({
      ...createCatalogItemDto,
      createdBy: userId,
    });
    return createdItem.save();
  }

  async findAll(search?: string): Promise<CatalogItem[]> {
    const query: Record<string, unknown> = {};

    if (search?.trim()) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    return this.catalogItemModel.find(query).sort({ createdAt: -1 }).exec();
  }
}
