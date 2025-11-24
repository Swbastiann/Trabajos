import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('classify-product')
  async classifyProduct(@Body() body: { nombre: string; marca: string }) {
    const { nombre, marca } = body;

    const prompt = `
    Eres un asistente que clasifica productos de inventario. 
    Solo necesitas el nombre y la marca del producto.
    Incluye siempre la marca exacta en la breve descripción.
    Devuelve únicamente la categoría y una breve descripción en el siguiente formato:
    Categoría – Breve descripción
    No agregues explicaciones ni preguntas adicionales.
    Ejemplo: Tecnología – Laptop Samsung compacta y portátil
    Nombre del producto: ${nombre}
    Marca: ${marca}
    `;

    const response = await this.aiService.askGroq([
      { role: 'user', content: prompt }
    ]);

    return response;
  }

  @Post('restock-suggestions')
  async restockSuggestions(@Body() items: any[]) {
    const prompt = `
    Eres un experto en inventario. Analiza los productos con su cantidad disponible
    y genera recomendaciones SOLO para los productos con stock bajo (≤ 10).

    Formato OBLIGATORIO de salida JSON:
    [
      {
        "item": "Nombre exacto del producto",
        "currentStock": 0,
        "priority": "Alta | Media | Baja",
        "suggestion": "Mensaje corto",
        "recommendedQuantity": 0
      }
    ]

    NO agregues comentarios, texto adicional ni explicaciones.
    Lista de productos:
    ${items.map(i => `${i.nombre} (${i.cantidad} unidades)`).join('\n')}
    `;

    const response = await this.aiService.askGroq([
      { role: 'system', content: 'Asistente experto en inventario, logística y decisiones de compra.' },
      { role: 'user', content: prompt }
    ]);

    let result;
    try {
      result = JSON.parse(response);
    } catch {
      result = [];
    }

    return result;
  }

  @Post('inventory-analysis')
  async inventoryAnalysis(@Body() items: any[]) {
    const prompt = `
    Eres un experto en gestión de inventarios y predicción de demanda. 
    Analiza la lista de productos y su stock considerando tendencias de venta, rotación de productos, frecuencia de reposición y necesidades de abastecimiento.

    Genera un análisis predictivo claro y breve, comprensible para alguien sin conocimientos técnicos.
    
    Formato obligatorio:

    {
      "predictiveInsights": [
        {
          "item": "",
          "category": "",
          "velocity": "Alto | Medio | Bajo",
          "lastRecommendedOrder": "",
          "priority": "Alta | Media | Baja",
          "note": ""
        }
      ],
      "topProductsByCategory": [
        {
          "category": "",
          "topItem": ""
        }
      ]
    }

    Datos:
    ${items.map(i => `${i.nombre} (${i.cantidad} unidades, categoría: ${i.categoria || 'sin categoría'})`).join('\n')}
    `;

    const response = await this.aiService.askGroq([
      { role: 'system', content: 'Asistente experto en inventario y predicción de demanda.' },
      { role: 'user', content: prompt }
    ]);

    let result;
    try {
      result = JSON.parse(response);
    } catch {
      result = { predictiveInsights: [], topProductsByCategory: [] };
    }

    return result;
  }
}
