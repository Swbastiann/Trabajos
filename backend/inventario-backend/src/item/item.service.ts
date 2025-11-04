import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto, UpdateItemDto } from './item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: number): Promise<Item | null> {
    return await this.itemRepository.findOne({ where: { id } });
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const newItem = this.itemRepository.create(createItemDto);
    return await this.itemRepository.save(newItem);
  }
  
  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item | null> {
    await this.itemRepository.update(id, updateItemDto);
    return await this.itemRepository.findOne({ where: { id } });
  }
  
  async remove(id: number): Promise<void> {
    await this.itemRepository.delete(id);
  }

  async suggestCategory(createItemDto: CreateItemDto): Promise<{ categoria: string }> {
    // Lógica de IA simulada
    const { nombre, descripcion } = createItemDto;
    
    // Convertimos a minúsculas para hacer coincidencias
    const texto = (nombre + ' ' + descripcion).toLowerCase();
    
    // Mapeo de palabras clave a categorías
    const categoriasMap = {
      tecnologia: ['laptop', 'computador', 'teclado', 'mouse', 'monitor', 'tablet', 'smartphone'],
      oficina: ['escritorio', 'silla', 'papel', 'lapicero', 'clip'],
      hogar: ['cama', 'mesa', 'silla', 'sofá', 'almohada'],
      deporte: ['pelota', 'raqueta', 'zapatilla', 'gimnasio'],
      // ... más categorías y palabras clave
    };
    
    let categoriaSugerida = 'Otros'; // Categoría por defecto
    
    // Buscar en cada categoría
    for (const [categoria, palabras] of Object.entries(categoriasMap)) {
      if (palabras.some(palabra => texto.includes(palabra))) {
        categoriaSugerida = categoria;
        break;
      }
    }
    
    return { categoria: categoriaSugerida };
  }
  
}
