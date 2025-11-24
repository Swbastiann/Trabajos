import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './item.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemService.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreateItemDto })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateItemDto })
  update(@Param('id') id: number, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.itemService.remove(id);
  }

  @Post('suggest-category')
  @ApiBody({ type: CreateItemDto })
  suggestCategory(@Body() createItemDto: CreateItemDto) {
    return this.itemService.suggestCategory(createItemDto);
  }
}
