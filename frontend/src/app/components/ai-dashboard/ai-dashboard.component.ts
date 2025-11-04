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
  analysis: any = {};
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
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading = false;
      }
    });
  }

  loadAIAnalysis(): void {
    // Cargar sugerencias de reabastecimiento
    this.aiService.getRestockSuggestions(this.items).subscribe({
      next: (suggestions) => {
        this.suggestions = suggestions;
      }
    });

    // Cargar análisis del inventario
    this.aiService.getInventoryAnalysis(this.items).subscribe({
      next: (analysis) => {
        this.analysis = analysis;
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Alta': return 'bg-danger';
      case 'Media': return 'bg-warning';
      case 'Baja': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  getStatusCardClass(status: string): string {
    switch (status) {
      case 'Crítico': return 'bg-danger text-white';
      case 'Precaución': return 'bg-warning text-dark';
      case 'Bueno': return 'bg-info text-white';
      case 'Excelente': return 'bg-success text-white';
      default: return 'bg-light text-dark';
    }
  }

  getAlertClass(priority: string): string {
    switch (priority) {
      case 'Alta': return 'alert-danger';
      case 'Media': return 'alert-warning';
      case 'Baja': return 'alert-info';
      default: return 'alert-secondary';
    }
  }
}
