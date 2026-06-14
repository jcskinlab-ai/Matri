# JC Medical.cl — Sistema de Marca para Feed Premium

Sistema de identidad visual para el feed de Instagram de **JC Medical.cl**, clínica de
medicina estética facial y corporal en **Talca, Región del Maule, Chile**. Rostro de la
marca: **Juan Claudio Parra**, enfermero universitario.

El objetivo de este sistema es **migrar el feed del blanco crudo actual a una base de
gris claro frío con más personalidad y autoridad**, manteniendo la elegancia serif de la
marca e incorporando una segunda voz en carbón profundo para contenido editorial.

> **Propuesta de valor:** cambios sutiles, armónicos y naturales. Profesional, cercano y
> serio. Seguridad clínica + buen gusto visual. Público: principalmente mujeres de Talca y
> alrededores que buscan verse más frescas y descansadas sin perder su esencia.

---

## Fuentes y materiales recibidos
- **Feed actual** (captura de perfil `@jcmedical.cl`) — blanco crudo, serif elegante, fichas de producto y antes/después.
- **Plantilla Rino** (`uploads/plantilla rino.png`, `uploads/Rino Final.png`) — antes/después con banda navy + monograma.
- **Referencias de color** (`uploads/IMG_4016–4021`) — eudermis lab, TradeMedical "CERRAMOS", PDRN, Revoloré, "Bioestimulación Avanzada": estética en carbón/gris oscuro, editorial y premium.
- **Foto de perfil** (`uploads/foto presentacion jc.jpg`) — Juan con uniforme azul, brazos cruzados.
- **Logo** (`uploads/JC.PNG`) — monograma serif "JC" con jeringa formando la diagonal.
- **Referencia de estilo:** Instagram `@dispolabaesthetics` (no accesible directamente; usada como guía de minimalismo editorial). Las plantillas son **originales**, no copian su diseño.

---

## Decisiones de dirección (confirmadas con el cliente)
| Tema | Decisión |
|---|---|
| Base del feed | **Gris claro frío** (Grey 200 · `#CDD1D5`) reemplaza el blanco crudo |
| Temperatura | **Fría / clínica** |
| Tipografía | Decisión del estudio → **serif elegante + sans de autoridad** |
| Acento | Decisión del estudio → **acero clínico** + cielo solo para CTA |
| Fondos | Decisión del estudio → **plano en claro, con luz superior en carbón** |
| Variaciones | **2 direcciones** para comparar (Claro vs Carbón) |

---

## CONTENT FUNDAMENTALS — cómo se escribe
- **Idioma:** español de Chile, trato de **tú** ("Agenda tu evaluación", "Armoniza tu perfil").
- **Tono:** profesional, cercano y sereno. Educativo, nunca sensacionalista. Transmite criterio clínico.
- **Casing:** nombres de tratamiento en **serif** con may/min naturales o mayúsculas espaciadas (BOTOX, SCULPTRA). Eyebrows y etiquetas en **MAYÚSCULAS espaciadas**. Cuerpo en minúscula, peso light.
- **Beneficios > características:** "verse más descansada", "suaviza líneas de expresión", "perfila sin cirugía", "mejora firmeza y calidad de piel". Siempre se cierra el énfasis con **resultados naturales / sin cirugía / de forma sutil**.
- **Llamados a la acción:** breves y consistentes — *"Agenda tu evaluación"*, *"Disponible en @jcmedical.cl"*.
- **Emoji:** **no.** La marca es premium y clínica; no usa emoji ni unicode decorativo.
- **Voz de Juan:** autoridad + cercanía. "Criterio clínico, resultados naturales."

---

## VISUAL FOUNDATIONS
- **Color:** neutros **fríos**. Base clara `#CDD1D5`; carbón profundo `#14171C`; navy tinta `#121A26` (del monograma y el uniforme) para bandas y fondos serios. Acento **acero `#6E8CA6`**; **acero luminoso `#8AA4BC`** para el CTA "Agenda tu evaluación" (frío, sin azul cielo).
- **Tipografía:** **Cormorant Garamond** (serif display de alto contraste) para nombres de tratamiento, hero y frases; **Jost** (sans geométrica) para eyebrows en mayúsculas, titulares de autoridad y cuerpo en light.
- **Espacio:** mucho aire. Escala base 8 (8/16/24/32/48/64/96). Márgenes generosos (≈6% del ancho en posts).
- **Fondos:** en claro, gris plano y limpio. En carbón, **degradado de luz superior** (radial sutil arriba-derecha) inspirado en las referencias eudermis/bioestimulación, más un **grano** muy tenue (opacidad 5%).
- **Animación:** sin animaciones en los posts (son estáticos). El lienzo de presentación usa transiciones suaves del componente.
- **Hover / press:** N/A en posts; en componentes UI, hover = un paso más oscuro del acero, sin sombras llamativas.
- **Bordes / filetes:** hairlines de 1px a baja opacidad (`rgba(20,23,28,.22)` sobre claro / `rgba(245,246,247,.22)` sobre oscuro). Divisor vertical blanco fino en antes/después.
- **Sombras:** suaves y frías, solo en presentación (`0 24px 60px -28px rgba(18,26,38,.45)`). En el feed los posts van a sangre, sin sombra.
- **Esquinas:** posts a sangre (sin radio). Píldoras = full pill. Cajas internas = radio 8px.
- **Imágenes:** retratos y antes/después a color natural, frío-neutro. En carrusel/portada, fotos en **escala de grises + contraste** bajo velo oscuro. Nada cálido ni saturado.
- **Etiquetas:** píldoras `ANTES` / `DESPUÉS` en navy translúcido con blur; o contorno blanco sobre foto.
- **Transparencia / blur:** solo en píldoras sobre foto (backdrop-blur) y en el índice de carrusel.
- **Layout:** banda inferior fija en antes/después; eyebrow arriba + serif al centro/abajo en fichas; cita centrada en frase; foto a sangre con velo inferior en retrato.

---

## ICONOGRAPHY
- La marca **no usa un sistema de íconos propio ni emoji.** Su lenguaje es tipográfico y fotográfico.
- El único símbolo de marca es el **monograma JC con jeringa** (ver `assets/`).
- Para los pocos íconos funcionales necesarios (teléfono, ubicación, Instagram en la plantilla CTA, y la flecha del carrusel) se usan **íconos de línea fina estilo Lucide** dibujados inline en SVG, con grosor 1.6 y trazo redondeado, en color acero. **Sustitución señalada:** no había set de íconos provisto; Lucide es el match más cercano al trazo limpio y delgado de la marca. Si prefieres otro set, avísame.
- No se usan íconos de relleno, ni íconos de colores, ni unicode decorativo.

---

## ÍNDICE DE ARCHIVOS
| Archivo | Qué contiene |
|---|---|
| `JC Medical Feed.html` | **Entregable principal** — lienzo con las 2 direcciones (Claro / Carbón), mosaicos 3×3 y todas las plantillas. |
| `colors_and_type.css` | Tokens de color y tipografía (variables CSS) + estilos semánticos. |
| `feed/posts.jsx` | Componentes React de cada plantilla (parametrizados por `surface`). |
| `feed/posts.css` | Estilos de las plantillas (todo en `cqw` para escalar). |
| `feed/design-canvas.jsx` | Componente de lienzo (starter). |
| `preview/*.html` | Tarjetas del Design System (colores, tipografía, componentes, marca). |
| `assets/` | Logos (navy / blanco / taupe), retrato de Juan, recortes antes/después. |
| `SKILL.md` | Definición de skill para uso en Claude Code / Agent Skills. |

### Plantillas incluidas
Antes/Después · Ficha de tratamiento · Carrusel (portada + slide) · Frase de marca ·
Promoción · Retrato profesional · Agenda tu evaluación (CTA).

---

## NOTAS / SUSTITUCIONES
- **Tipografías:** se desconocen las fuentes exactas del feed actual (probablemente de pago). Se sustituyeron por **Cormorant Garamond** (serif) y **Jost** (sans) desde Google Fonts como el match más cercano. *Si tienes los archivos de fuente originales, envíamelos y los integro.*
- **Fotos de producto:** las fichas usan un **placeholder elegante** ("Foto producto"); falta material fotográfico limpio de los productos (Sculptra, Botox, Juvederm, etc.). *Envía fotos de producto sobre fondo neutro para completarlas.*
