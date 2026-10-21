# English Real

App web (sin backend, sin cuentas) para aprender inglés desde cero hasta B2 y más allá, **sin rachas, sin puntos y sin compras dentro de la app**. El progreso es "lo que ya puedes hacer", no un contador.

## Cómo funciona cada lección
Escuchar y leer → vocabulario → gramática útil → comprensión → escribir tus propias frases. El vocabulario entra a un repaso espaciado donde tienes que *recordar* la palabra, no reconocerla. Detalles y fuentes en [docs/PEDAGOGY.md](docs/PEDAGOGY.md).

## Ejecutar en local
```bash
npm run dev          # sirve la carpeta en http://localhost:8080 (requiere python3)
npm test             # valida el contenido y la sintaxis
npm run build:index  # regenera content/index.json tras añadir lecciones
```
Abrir `index.html` con doble clic no funciona: el navegador bloquea `fetch` en `file://`.

## Estructura
```
content/                 lecciones en JSON, una carpeta por nivel CEFR (a1, a2, b1, b2, c1)
content/placement.json   prueba de nivel
src/app.js               lógica (repaso espaciado, lecciones, progreso en localStorage)
scripts/                 validación y generación del índice
docs/PEDAGOGY.md        base pedagógica y fuentes
```

## Estado honesto
- Hoy hay 6 lecciones (A1 a B1 inicial). Es un prototipo, no un curso.
- Referencia de Cambridge: ~350–400 h guiadas para B1, ~500–600 para B2, ~700–800 para C1. Hacen falta decenas de lecciones por nivel.
- El audio usa la voz del navegador (TTS); falta audio humano grabado.
- No corrige escritura ni pronunciación automáticamente.

## Hoja de ruta
1. 40+ lecciones por nivel hasta B2, revisadas por profesores.
2. Audio humano grabado y dictados.
3. Repaso con FSRS en lugar de intervalos fijos.
4. Exportar/importar progreso y modo offline (PWA).
5. Corrección de escritura opcional con IA.

## Licencia
Código: MIT (ver `LICENSE`). Contenido de `content/`: se propone CC BY-SA 4.0; decide y ajusta antes de publicar.
