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
    marca: '',
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

  // Clasificación automática con IA
  autoClassify(): void {
    if (!this.item.nombre || !this.item.marca) {
      alert('Por favor ingresa al menos el nombre y la marca del producto para clasificación automática');
      return;
    }

    this.isClassifying = true;

    this.aiService.classifyProduct(this.item.nombre, this.item.marca).subscribe({
      next: (res: string) => {
        const [categoria, descripcion] = res.split('–').map(s => s.trim());
        this.item.categoria = categoria || 'Sin categoría';
        this.item.descripcion = descripcion || '';
        this.isClassifying = false;
      },
      error: (error) => {
        console.error('Error en clasificación:', error);
        this.isClassifying = false;
        alert('Error en clasificación automática');
      }
    });
  }

  // Guardar o actualizar producto
  onSubmit(): void {
    if (this.isEdit && this.itemId) {
      this.itemService.update(this.itemId, this.item).subscribe({
        next: () => {
          alert('Producto actualizado correctamente!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          const msg = error.error?.message || 'Error al actualizar el producto';
          console.error('Error actualizando producto:', msg);
          alert(msg);
        }
      });
    } else {
      this.itemService.create(this.item).subscribe({
        next: () => {
          alert('Producto agregado correctamente!');
          this.router.navigate(['/']);
        },
        // ✅ Aquí está la modificación que pediste
        error: (error) => {
          const msg = error.error?.message || 'Error al agregar el producto';
          console.error('Error al agregar producto:', msg);
          alert(msg); // <-- muestra: "El producto X ya está registrado"
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
