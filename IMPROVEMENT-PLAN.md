# Plan de Mejoras — Claude Certified Architect Training App

> Fecha de evaluacion: 2026-04-18
> Basado en: Investigacion del examen CCA Foundations, pruebas funcionales de la app desplegada, y analisis del codigo fuente.

---

## Contexto del Examen CCA

- **60 preguntas**, 120 minutos, proctored
- **Passing score**: 720 (escala 100-1000)
- **5 dominios**: D1 Agentic (27%), D2 Tool/MCP (18%), D3 Claude Code (20%), D4 Prompt (20%), D5 Context (15%)
- **6 escenarios**: El examen selecciona 4 al azar y TODAS las preguntas estan ancladas a esos escenarios
- **Escenarios oficiales**: Customer Support Resolution Agent, Code Generation with Claude Code, Multi-Agent Research System, Developer Productivity with Claude, Claude Code for CI/CD, Structured Data Extraction

---

## Estado Actual del Sistema

| Metrica | Valor |
|---------|-------|
| Temas de estudio (Learn) | 39 temas con contenido detallado |
| Preguntas de practica | 328 scenario-based |
| Dominios cubiertos | 5/5 (100%) |
| Escenarios CCA cubiertos | 6/6 pero con 1-2 preguntas cada uno |
| Distribucion vs pesos del examen | Alineada correctamente |

---

## P0 — Critico (Bloquea la utilidad como simulador de examen)

### P0.1 — Expandir preguntas ancladas a los 6 escenarios CCA

**Problema**: El examen real ancla TODAS las preguntas a 4 de 6 escenarios. El sistema tiene 328 preguntas pero solo 1-2 usan los nombres exactos de los escenarios oficiales. La mayoria usa escenarios propios que, aunque validos para aprender, no replican la experiencia real.

**Requisitos**:
1. Crear un minimo de **15 preguntas por escenario oficial** (90 nuevas en total)
2. Las preguntas de cada escenario deben cruzar multiples dominios, tal como en el examen real
3. Cada escenario debe tener preguntas que cubran al menos 3 de los 5 dominios
4. Mantener la estructura existente: `scenario`, `question`, `options`, `correct_answer`, `explanation`, `why_others_wrong`, `doc_reference`, `skilljar_ref`

**Distribucion sugerida por escenario**:

| Escenario | D1 | D2 | D3 | D4 | D5 | Total |
|-----------|----|----|----|----|-----|-------|
| Customer Support Resolution Agent | 4 | 3 | 2 | 3 | 3 | 15 |
| Code Generation with Claude Code | 2 | 2 | 5 | 3 | 3 | 15 |
| Multi-Agent Research System | 5 | 3 | 2 | 2 | 3 | 15 |
| Developer Productivity with Claude | 2 | 3 | 4 | 3 | 3 | 15 |
| Claude Code for CI/CD | 3 | 2 | 5 | 2 | 3 | 15 |
| Structured Data Extraction | 2 | 3 | 1 | 5 | 4 | 15 |

> **FUENTES REQUERIDAS**: Todas las preguntas nuevas deben estar respaldadas por hechos verificables de:
> - Documentacion oficial de Anthropic: https://docs.anthropic.com/
> - Documentacion de Claude Code: https://docs.anthropic.com/en/docs/claude-code
> - Especificacion MCP: https://modelcontextprotocol.io/
> - Cursos de Anthropic Academy en Skilljar (ver nota de acceso abajo)
>
> Cada pregunta debe incluir `doc_reference` con quote exacta y `doc_status` verificado.
>
> **ACCESO A SKILLJAR**: Para verificar contenido de los 13 cursos de Anthropic Academy, se necesita usar el MCP de Playwright para navegar a Skilljar. Avisar al usuario para que se loguee manualmente antes de scrapear contenido. Los cursos son gratuitos pero requieren cuenta del Claude Partner Network.

---

### P0.2 — Timer y scoring realista en modo examen

**Problema**: El examen real tiene 120 minutos y scoring en escala 100-1000 con passing score de 720. Sin timer ni scoring, el estudiante no puede evaluar si esta preparado.

**Requisitos**:
1. Agregar timer countdown de 120 minutos visible durante el examen
2. El timer debe ser configurable (60, 90, 120 min) para practica progresiva
3. Implementar scoring en escala 100-1000 al finalizar:
   - Formula sugerida: `score = 100 + (correctas / total) * 900`
   - Mostrar claramente si PASO (>= 720) o NO PASO (< 720)
4. Mostrar desglose de score por dominio al finalizar
5. Al agotarse el timer, finalizar automaticamente y calcular score con lo respondido
6. Las preguntas no respondidas cuentan como incorrectas (igual que el examen real — no hay penalizacion por adivinar)

**Notas de implementacion**:
- El timer debe persistir si el usuario navega entre preguntas dentro del examen
- Mostrar warning visual cuando queden 10 y 5 minutos

---

### P0.3 — Persistencia del estado del examen

**Problema**: Al navegar a Learn, Roadmap o Performance durante un examen activo, se pierde todo el progreso. Esto es frustrante y no refleja la experiencia real (donde no puedes salir).

**Requisitos**:
1. El estado del examen debe persistirse en backend (ya existe tabla `exam_attempts`)
2. Si el usuario navega fuera del examen, mostrar dialog de confirmacion: "Tienes un examen en curso. Salir terminara el examen. Continuar?"
3. Opcion A: bloquear navegacion durante examen activo
4. Opcion B: permitir salir pero terminar el examen automaticamente
5. Al volver a Practice con un examen en curso, ofrecer retomar o iniciar nuevo

---

## P1 — Importante (Mejora significativa de la experiencia de estudio)

### P1.1 — Modo "Practice by Scenario"

**Problema**: El examen real agrupa preguntas por escenario. El sistema solo permite filtrar por dominio, no por escenario.

**Requisitos**:
1. En la pantalla de Practice, agregar toggle: "By Domain" | "By Scenario"
2. En modo "By Scenario", mostrar los 6 escenarios CCA como opciones seleccionables
3. Permitir seleccionar 4 escenarios (como el examen real) o cualquier combinacion
4. Las preguntas filtradas deben venir de los escenarios seleccionados, cruzando dominios
5. Requiere completar P0.1 primero (necesita suficientes preguntas por escenario)

---

### P1.2 — Repaso de errores post-examen

**Problema**: Despues de terminar un examen, no hay forma de revisar solo las preguntas falladas. El repaso de errores es el metodo de estudio mas efectivo.

**Requisitos**:
1. Al finalizar un examen, mostrar pantalla de resultados con:
   - Score total y por dominio
   - Lista de preguntas con indicador correcto/incorrecto
   - Boton "Review Wrong Answers" que filtra solo las falladas
2. En modo review, mostrar cada pregunta fallada con:
   - La respuesta que eligio el usuario (marcada en rojo)
   - La respuesta correcta (marcada en verde)
   - Explicacion completa y why_others_wrong
3. Opcion "Retry Wrong Questions" que genera un mini-examen solo con las falladas
4. Guardar historial: en Performance, mostrar las preguntas que falla recurrentemente

---

### P1.3 — Contenido faltante en Learn Topics

**Problema**: Algunos subtemas especificos del examen no tienen cobertura suficiente en el contenido de Learn.

**Subtemas a reforzar**:

#### D4 — Pydantic validation patterns
- Validate-retry loops con Pydantic
- JSON Schema generation desde modelos Pydantic como single source of truth
- Diferencia entre validacion estructural y semantica con Pydantic

#### D4 — Batch API detalles operativos
- Uso de `custom_id` para correlacionar request/response
- Estrategia de re-submit: identificar fallos por `custom_id`, modificar estrategia, re-enviar solo los fallidos
- Ventana de procesamiento de 24 horas sin SLA
- Ahorro del 50% vs synchronous

#### D5 — Confidence calibration
- Field-level confidence scores en output
- Calibracion usando labeled validation sets
- Stratified random sampling para auditar incluso extracciones de alta confianza
- Analisis de accuracy por tipo de documento + segmento de campo

#### D5 — Coverage annotations
- Formato especifico con `PARTIAL COVERAGE` y notas de timeout
- Provenance tracking con source_url, publication_date, confidence

#### D1 — Stop reason values completos
- Documentar los 8 valores: `end_turn`, `tool_use`, `max_tokens`, `stop_sequence`, `model_context_window_exceeded`, `compaction`, `pause_turn`, `refusal`
- Actualmente los topics solo cubren 4-6

> **FUENTES REQUERIDAS**: Todo contenido nuevo debe extraerse de:
> - API Reference oficial: https://docs.anthropic.com/en/api/messages
> - Claude Code docs: https://docs.anthropic.com/en/docs/claude-code
> - Anthropic Cookbook: https://github.com/anthropics/anthropic-cookbook
> - Cursos Skilljar de Anthropic Academy (requiere login via Playwright — avisar al usuario)
>
> **VERIFICACION**: Cada fact nuevo debe incluirse con su source URL. Si un concepto no se puede verificar en fuentes oficiales, marcarlo como `doc_status: "INFERRED"` y NO incluirlo en Key Exam Facts.

---

### P1.4 — Anti-patterns como contenido explicito

**Problema**: El examen pregunta frecuentemente "cual es el anti-pattern" o "que NO deberia hacer". Los anti-patterns estan dispersos en el contenido pero no son facilmente localizables.

**Requisitos**:
1. Agregar seccion "Common Anti-Patterns" en cada topic de Learn donde aplique
2. Usar un callout visual distintivo (diferente a Key Exam Facts y Design Principle)
3. Anti-patterns prioritarios por dominio:

**D1 — Agentic Architecture**:
- Parsing assistant text for completion signals (usar `stop_reason` en su lugar)
- Using iteration limits as primary stopping mechanism
- Not sending full conversation history between requests
- Infinite retries inside subagents
- Aborting entire workflow on single subagent failure
- Generic "unavailable" error without context
- Silent error suppression (empty response = success)

**D2 — Tool Design & MCP**:
- Tool descriptions vagas o ambiguas que causan misrouting
- Demasiadas tools (18+) que reducen confiabilidad
- No distinguir entre access failures y valid empty results
- Marcar campos como `required` cuando la info no siempre esta disponible (causa fabricacion)

**D3 — Claude Code Config**:
- CLAUDE.md monolitico en vez de modular con `@path` y `.claude/rules/`
- Usar planning mode para single-file fixes con stack trace claro
- Ejecutar Claude Code en CI sin flag `-p` (se cuelga esperando input interactivo)
- Resumir sesiones con resultados stale sin verificar

**D4 — Prompt Engineering**:
- Instrucciones vagas ("be more conservative") en vez de criterios explicitos
- Retry loops para informacion que no existe en el documento
- Self-review en la misma instancia (sesgo de confirmacion)

**D5 — Context Management**:
- Summarizar numeros, porcentajes y fechas (se pierden en compresion)
- No usar extracted facts block persistente fuera del historial resumido
- No delegar a subagents para proteger el context del coordinador
- Usar sentiment analysis o model confidence como trigger de escalation

> **FUENTES REQUERIDAS**: Los anti-patterns deben extraerse de:
> - Documentacion oficial (secciones "best practices" y "common mistakes")
> - Guia de estudio verificada: https://github.com/paullarionov/claude-certified-architect/blob/main/guide_en.MD
> - Anthropic Cookbook examples
> - Skilljar courses (requiere login via Playwright — avisar al usuario)
>
> Cada anti-pattern debe tener un source verificable. No inventar anti-patterns que no esten documentados.

---

## P2 — Nice-to-have (Mejora la experiencia de estudio avanzado)

### P2.1 — Decision Trees / Quick Reference Cards

**Problema**: El examen tiene muchas preguntas "cuando usarias X vs Y". Tener decision trees listos para repasar acelera la preparacion.

**Requisitos**:
1. Crear componente visual "Decision Tree" reutilizable
2. Implementar las siguientes decision trees como seccion al final de los topics relevantes:

| Decision Tree | Topic donde va | Criterio clave |
|---------------|----------------|----------------|
| Hooks vs Prompts vs strict:true | d1-programmatic-enforcement | Critical business rule? -> Hook. Preference? -> Prompt. Schema? -> strict |
| Planning Mode vs Direct Execution | d3-plan-mode | 45+ files o multiple approaches? -> Planning. Single file + clear trace? -> Direct |
| Batch API vs Synchronous | d4-batch-processing | Developer waiting? -> Sync. 24h OK + bulk? -> Batch |
| Few-shot vs Textual Description | d4-few-shot | Ambiguous scenario or output format? -> Few-shot. General guidance? -> Text |
| When to Escalate | d5-escalation | Explicit request? -> Immediate. Policy gap? -> Escalate. Sentiment? -> NO |
| New Session vs Resume | d3-cli | Results stale? -> New session. Context fresh? -> Resume |
| Subagent vs Inline | d5-subagent-context | Verbose discovery? -> Subagent. Quick lookup? -> Inline |

> **FUENTES REQUERIDAS**: Cada decision tree debe estar respaldado por la documentacion oficial o los cursos de Skilljar. Los criterios de decision deben ser verificables, no opiniones.

---

### P2.2 — Flashcards / Key Facts Mode

**Problema**: Para repaso rapido antes del examen, los "Key Exam Facts" estan enterrados al final de cada topic.

**Requisitos**:
1. Crear vista "Flashcards" accesible desde el nav o desde cada topic
2. Extraer todos los Key Exam Facts de los 39 topics
3. Mostrar en formato flashcard: front = pregunta/concepto, back = fact
4. Permitir marcar como "Known" o "Review Again"
5. Algoritmo de spaced repetition basico: mostrar mas frecuentemente los marcados "Review Again"

---

### P2.3 — Exam History y Trend en Performance

**Problema**: Performance esta vacio hasta completar un examen. Deberia mostrar tendencias.

**Requisitos**:
1. Grafico de linea mostrando score a lo largo del tiempo
2. Heatmap por dominio mostrando fortalezas/debilidades
3. "Weakest Topics" rankeados por porcentaje de error
4. Comparacion con passing score (720) como linea de referencia
5. Recomendacion automatica: "Focus on D2 Tool Design — your weakest domain"

---

## P3 — Polish (Calidad y experiencia)

### P3.1 — Arreglar errores de consola JavaScript

**Problema**: Durante las pruebas se observaron 3 errores de consola. Deberian ser 0.

**Requisitos**:
1. Identificar y corregir todos los errores de consola
2. Verificar en navegacion entre todas las secciones: Learn, Roadmap, Practice, Performance
3. Verificar con y sin usuario logueado

---

### P3.2 — Responsive y accesibilidad

**Requisitos**:
1. Verificar que el Roadmap sea usable en tablets (actualmente el mapa interactivo puede ser dificil en pantallas pequenas)
2. Asegurar que las preguntas de Practice sean legibles en movil
3. Agregar keyboard navigation en el examen (A/B/C/D para seleccionar, Enter para confirmar)
4. Contraste de texto suficiente en el tema oscuro (verificar contra WCAG AA)

---

### P3.3 — Search mejorado en Learn

**Requisitos**:
1. El search actual filtra por nombre de topic
2. Agregar busqueda full-text dentro del contenido de los topics
3. Mostrar snippets del match en los resultados
4. Permitir buscar por Key Concept tags

---

### P3.4 — Export de notas

**Requisitos**:
1. Permitir exportar todas las notas del usuario como markdown
2. Incluir el nombre del topic y dominio en cada nota exportada
3. Util para imprimir o tener como referencia offline

---

## Protocolo de Verificacion de Fuentes

Toda informacion factual agregada al sistema (preguntas, contenido de Learn, anti-patterns, decision trees) DEBE seguir este protocolo:

### Fuentes Aceptadas (Tier 1 — verdad absoluta)
1. **Anthropic API Docs**: https://docs.anthropic.com/
2. **Claude Code Docs**: https://docs.anthropic.com/en/docs/claude-code
3. **MCP Specification**: https://modelcontextprotocol.io/
4. **Anthropic Cookbook**: https://github.com/anthropics/anthropic-cookbook
5. **Anthropic Academy (Skilljar)**: Cursos oficiales de preparacion

### Fuentes Aceptadas (Tier 2 — contexto y clarificacion)
6. **Guias verificadas de la comunidad** que citan fuentes Tier 1
7. **Claude Certifications** (claudecertifications.com) — cross-reference con Tier 1

### Fuentes NO aceptadas
- Blog posts sin citas a documentacion oficial
- Respuestas de foros (Stack Overflow, Reddit) sin verificacion
- Contenido generado por AI sin fact-checking
- Experiencia anecdotica o "segun mi experiencia"

### Proceso de verificacion
1. Cada fact nuevo debe tener un `doc_reference` con `source` (URL) y `quote` (texto exacto)
2. Si el fact viene de Skilljar, incluir `skilljar_ref` con `course`, `lesson`, y `url`
3. Facts que no se pueden verificar en Tier 1 deben marcarse como `doc_status: "INFERRED"`
4. Facts marcados INFERRED no deben aparecer en "Key Exam Facts" de los topics

### Acceso a Skilljar
Los 13 cursos de Anthropic Academy en Skilljar son la fuente mas directa para el contenido del examen. Para acceder:
1. Usar el MCP de Playwright para navegar a la plataforma Skilljar
2. **IMPORTANTE**: Avisar al usuario para que se loguee manualmente — las credenciales del Claude Partner Network son personales y no deben automatizarse
3. Una vez logueado, se puede scrapear el contenido de los cursos para verificar facts
4. Los cursos gratuitos cubren los 5 dominios y son la base directa del examen
