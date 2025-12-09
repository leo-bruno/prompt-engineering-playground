# Excel Processing Prompt (PedsQL / Survey Average Calculation)

This prompt can be reused to process any Excel file containing survey-style responses, applying normalization and average-score calculations.

---

## Prompt

Quiero procesar un fichero Excel que contiene un cuestionario, donde cada columna corresponde a una respuesta.  
Debes realizar lo siguiente:

1. **Mapear las respuestas** según estos valores:  
   - Nunca → 100  
   - Casi Nunca → 75  
   - A veces → 50  
   - A menudo → 25  
   - Casi Siempre → 0  

2. **Normalizar el texto** de cada celda:  
   - Eliminar espacios al inicio y al final.  
   - Convertir múltiples espacios internos en uno solo.  
   - Por lo tanto, respuestas como “A  menudo” o “  Casi   Siempre ” deben contar como válidas.

3. **Calcular una nueva columna llamada “Average”** donde:  
   - Solo se incluyen en la media las celdas con alguna de las respuestas válidas.  
   - Las respuestas válidas que valen 0 (como Casi Siempre) **sí** cuentan en la media.  
   - Las celdas vacías o con texto no reconocido **no se suman** y **no cuentan** para el denominador.

4. **Generar un nuevo fichero Excel**, manteniendo todas las columnas originales y añadiendo la columna “Average”.

Cuando te pase el fichero, simplemente aplícalo todo con estas reglas.

---

## Categoría sugerida

**Automatización con Excel → Data Processing**
