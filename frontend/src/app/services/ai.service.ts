import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Item } from './item.service';

@Injectable({
  providedIn: 'root'
})
export class AIService {

  private API_URL = 'http://localhost:3000/api/ai';

  constructor(private http: HttpClient) { }

  // 1. CLASIFICACIÓN AUTOMÁTICA DE PRODUCTOS (🔥 ahora usando IA real en el backend)
  classifyProduct(nombre: string, marca: string): Observable<string> {
  const body = { nombre, marca };
  return this.http.post(
    `${this.API_URL}/classify-product`,
    body,
    { responseType: 'text' } // <--- muy importante
  );
  }

  // 2. SUGERENCIAS DE REABASTECIMIENTO (simulado, por ahora)
  getRestockSuggestions(items: Item[]): Observable<any[]> {
    const suggestions = [];
    
    for (const item of items) {
      if (item.cantidad === 0) {
        suggestions.push({
          item: item.nombre,
          suggestion: '❌ PRODUCTO AGOTADO - Reabastecer urgentemente',
          priority: 'Alta',
          recommendedQuantity: 20
        });
      } else if (item.cantidad <= 5) {
        suggestions.push({
          item: item.nombre,
          suggestion: '⚠️ STOCK BAJO - Considerar reabastecimiento',
          priority: 'Media',
          recommendedQuantity: 15
        });
      } else if (item.cantidad <= 10) {
        suggestions.push({
          item: item.nombre,
          suggestion: '📊 Stock moderado - Monitorear',
          priority: 'Baja',
          recommendedQuantity: 10
        });
      }
    }
    
    return of(suggestions);
  }

  // 3. ANÁLISIS PREDICTIVO (simulado, por ahora)
  getInventoryAnalysis(items: Item[]): Observable<any> {
    const totalItems = items.length;
    const totalStock = items.reduce((sum, item) => sum + item.cantidad, 0);
    const lowStockItems = items.filter(item => item.cantidad <= 5).length;
    const outOfStockItems = items.filter(item => item.cantidad === 0).length;
    
    let healthStatus = 'Excelente';
    if (outOfStockItems > 0) healthStatus = 'Crítico';
    else if (lowStockItems > totalItems * 0.3) healthStatus = 'Precaución';
    else if (lowStockItems > 0) healthStatus = 'Bueno';

    return of({
      totalProducts: totalItems,
      totalStock: totalStock,
      lowStockItems: lowStockItems,
      outOfStockItems: outOfStockItems,
      healthStatus: healthStatus,
      recommendation: this.getHealthRecommendation(healthStatus, outOfStockItems, lowStockItems)
    });
  }

  private getHealthRecommendation(healthStatus: string, outOfStock: number, lowStock: number): string {
    switch (healthStatus) {
      case 'Crítico':
        return `🚨 ${outOfStock} productos agotados. Reabastecimiento inmediato necesario.`;
      case 'Precaución':
        return `⚠️ ${lowStock} productos con stock bajo. Planificar reabastecimiento.`;
      case 'Bueno':
        return `✅ Inventario en buen estado. Monitorear productos con stock bajo.`;
      default:
        return `🎉 Inventario excelente. Continuar con gestión actual.`;
    }
  }
}
