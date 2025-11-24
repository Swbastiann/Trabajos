import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Laptop', description: 'Nombre del ítem' })
  nombre: string;

  @ApiProperty({ example: 'Tecnología', description: 'Categoría del ítem' })
  categoria: string;

  @ApiProperty({ example: 10, description: 'Cantidad en inventario' })
  cantidad: number;

  @ApiProperty({ example: 'Computador portátil HP', description: 'Descripción del ítem' })
  descripcion: string;

  @ApiProperty()
  marca: string;
}

export class UpdateItemDto extends CreateItemDto {}
