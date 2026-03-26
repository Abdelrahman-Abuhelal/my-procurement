import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { CatalogService } from './catalog.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
  };
};

@Controller('items')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  async create(
    @Body() createCatalogItemDto: CreateCatalogItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.catalogService.create(createCatalogItemDto, req.user.userId);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.catalogService.findAll(search);
  }
}
