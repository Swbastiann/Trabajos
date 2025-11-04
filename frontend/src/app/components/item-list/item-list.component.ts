import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemService, Item } from '../../services/item.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        console.log('Items cargados:', data);
      },
      error: (error) => {
        console.error('Error cargando items:', error);
      }
    });
  }

  deleteItem(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.itemService.delete(id).subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.loadItems(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error eliminando producto:', error);
          alert('Error al eliminar el producto');
        }
      });
    }
  }
}
