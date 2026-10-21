# Cómo añadir una lección
1. Copia `content/_template.json` a `content/<nivel>/<id>.json` (por ejemplo `content/a1/a1-03.json`). El nombre debe ser `<id>.json`.
2. Reglas de calidad:
   - Una **meta concreta** ("Puedo…"), no una lista de temas.
   - Texto casi totalmente comprensible (~95% de palabras conocidas) para ese nivel.
   - Una sola idea gramatical, explicada en español con ejemplos.
   - Un "caution" con un falso amigo o error típico de hispanohablantes.
   - Mínimo 4 palabras de vocabulario, 2 preguntas y una tarea de escritura con modelo.
   - Material original: nada copiado de libros ni de otras apps.
3. Ejecuta `npm run build:index && npm test`.
4. Abre un pull request. Se agradece especialmente la revisión de profesores de inglés.
