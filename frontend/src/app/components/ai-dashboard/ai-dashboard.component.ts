import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemService, Item } from '../../services/item.service';
import { AIService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ai-dashboard.component.html'
})
export class AiDashboardComponent implements OnInit {

  items: Item[] = [];
  suggestions: any[] = [];
  analysis: any = {
    totalProducts: 0,
    totalStock: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    healthStatus: "Cargando...",
    recommendation: "..."
  };

  loading: boolean = false;

  constructor(
    private itemService: ItemService,
    private aiService: AIService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loadAIAnalysis();
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading = false;
      }
    });
  }

  loadAIAnalysis(): void {

    // Solicitar sugerencias IA
    this.aiService.getRestockSuggestions(this.items).subscribe({
      next: (res) => {
        console.log("📌 Respuesta IA Sugerencias:", res);

        try {
          this.suggestions = typeof res === 'string' ? JSON.parse(res) : res;
        } catch {
          this.suggestions = [];
        }

        console.log("➡️ Sugerencias formateadas:", this.suggestions);
      },
      error: (err) => {
        console.error("❌ Error IA Sugerencias:", err);
        this.suggestions = [];
      }
    });

    // Solicitar análisis IA
    this.aiService.getInventoryAnalysis(this.items).subscribe({
      next: (analysis) => {
        console.log("📊 Análisis Predictivo:", analysis);

        this.analysis = {
          totalProducts: analysis.totalProducts ?? 0,
          totalStock: analysis.totalStock ?? 0,
          lowStockItems: analysis.lowStockItems ?? 0,
          outOfStockItems: analysis.outOfStockItems ?? 0,
          healthStatus: analysis.healthStatus ?? "Desconocido",
          recommendation: analysis.recommendation ?? "Sin datos"
        };
      },
      error: (err) => {
        console.error("❌ Error IA Analysis:", err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  confirmOrder(sug: any): void {
    const item = this.items.find(i => i.nombre === sug.item);
    if (!item) return;

    const newStock = item.cantidad + sug.recommendedQuantity;

    this.itemService.update(item.id!, { ...item, cantidad: newStock }).subscribe(() => {
      alert(`Pedido registrado. Se agregaron ${sug.recommendedQuantity} unidades a: ${item.nombre}`);
      this.loadData();
    });
  }

  getStatusCardClass(status: string): string {
    switch (status) {
      case 'Crítico': return 'bg-danger text-white';
    }
    switch (status) {
      case 'Precaución': return 'bg-warning text-dark';
    }
    switch (status) {
      case 'Bueno': return 'bg-info text-white';
    }
    switch (status) {
      case 'Excelente': return 'bg-success text-white';
    }
    return 'bg-light text-dark';
  }
}
