import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService, Item } from '../../services/item.service';
import { AIService } from '../../services/ai.service';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-form.component.html'
})
export class ItemFormComponent implements OnInit {
  item: Item = {
    nombre: '',
    categoria: '',
    cantidad: 0,
    descripcion: ''
  };
  
  isEdit: boolean = false;
  itemId?: number;
  isClassifying: boolean = false;

  constructor(
    private itemService: ItemService,
    private aiService: AIService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.itemId = Number(id);
      this.loadItem(this.itemId);
    }
  }

  loadItem(id: number): void {
    this.itemService.getById(id).subscribe({
      next: (data) => {
        this.item = data;
      },
      error: (error) => {
        console.error('Error cargando producto:', error);
        alert('Error al cargar el producto');
      }
    });
  }

  // NUEVA FUNCIÓN: Clasificación automática con IA
  autoClassify(): void {
    if (!this.item.nombre && !this.item.descripcion) {
      alert('Por favor ingresa al menos el nombre del producto para clasificación automática');
      return;
    }

    this.isClassifying = true;
    
    this.aiService.classifyProduct(this.item.nombre, this.item.descripcion).subscribe({
      next: (categoria) => {
        this.item.categoria = categoria;
        this.isClassifying = false;
      },
      error: (error) => {
        console.error('Error en clasificación:', error);
        this.isClassifying = false;
        alert('Error en clasificación automática');
      }
    });
  }

  onSubmit(): void {
    if (this.isEdit && this.itemId) {
      this.itemService.update(this.itemId, this.item).subscribe({
        next: () => {
          alert('Producto actualizado correctamente!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error actualizando producto:', error);
          alert('Error al actualizar el producto');
        }
      });
    } else {
      this.itemService.create(this.item).subscribe({
        next: () => {
          alert('Producto agregado correctamente!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error al agregar producto:', error);
          alert('Error al agregar el producto');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
