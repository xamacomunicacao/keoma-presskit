---
name: gerador-de-imagem
description: >
  Gera 3 prompts de IA coordenados para criação de vídeo de parada de rolagem (scroll-stopping): (1) foto do produto/objeto limpa em fundo branco puro 16:9, (2) versão desconstruída/explodida do mesmo objeto, e (3) uma transição de vídeo animando entre o estado montado e desconstruído. Funciona com qualquer gerador de IA (Midjourney, Flux, DALL-E, etc.) e qualquer modelo de vídeo (Runway, Kling, Pika, Higgsfield, etc.). Entrega através de uma página HTML premium com navegação em abas, botões de cópia em um clique e animação de confetes. Acione quando o usuário disser "gerador de imagens", "prompt para scroll", "prompt de desconstrução", "prompt de vista explodida", "prompt de animação de produto", "prompts para assets", ou pedir prompts para criar vídeos "scroll-stopping" de imagens de objetos.
---

# Gerador de Imagem — Criador de Prompts Scroll-Stop

Você gera um conjunto coordenado de **3 prompts** que trabalham em conjunto para produzir conteúdos em vídeo impressionantes estilo "scroll-stopping": uma foto de produto limpa no branco, sua versão desconstruída/explodida e uma transição de vídeo entre eles.

Após gerar os prompts, você os entrega em uma linda página HTML com navegação em abas, botões de cópia com um clique e animação de confete — para que o usuário possa colar cada prompt instantaneamente na sua ferramenta de IA favorita.

---

## O Processo

### Passo 1: Confirmar o Objeto

Pergunte ao usuário para qual objeto ou assunto ele deseja os prompts (caso não tenha especificado).

**Bons assuntos para scroll-stop incluem:**
- Produtos tecnológicos — laptops, celulares, fones, câmeras, drones
- Moda/luxo — tênis, relógios, bolsas, óculos escuros
- Veículos — carros, bicicletas, motocicletas
- Comidas e bebidas — vitaminas, coquetéis, pratos empratados
- Serviços/transformações — estados "antes/depois" (ex: piscina suja-para-limpa, reformas, maquiagens)
- Qualquer produto com componentes internos interessantes ou estados visuais dramáticos

Use **laptop** como padrão caso o usuário não especifique.

**Importante:** Determine se o objeto é um **produto com componentes internos** (use abordagem de desconstrução/vista explodida) ou uma **transformação/serviço** (use os estados de antes/depois). Isso muda a forma como os Prompts A, B e C serão escritos.

---

### Passo 2: Gerar o Prompt A — A Foto Herói (Hero Shot)

Esta é a imagem principal, limpa. **Sempre com fundo puramente branco.**

**Para produtos (abordagem de desconstrução):**

```
PROMPT A — ASSEMBLED SHOT

Professional product photography of a [OBJECT] centered in frame, shot from a [ANGLE] angle.
Clean white background (#FFFFFF), soft studio lighting with subtle shadows beneath the object.
The [OBJECT] is pristine, brand-new, fully assembled and complete.

Photorealistic rendering, 16:9 aspect ratio, product catalog quality. Sharp focus across the
entire object, subtle reflections on glossy surfaces. Minimal, elegant, Apple-style product
photography. No text, no logos, no other objects in frame.

Shot on Phase One IQ4 150MP, 120mm macro lens, f/8, studio strobe lighting with large softbox
above and white bounce cards on sides. Ultra-sharp detail, 8K quality downsampled to 4K.
```

**Para transformações (abordagem antes/depois):**

```
PROMPT A — "BEFORE" STATE

Professional photography of a [OBJECT IN BEFORE STATE] centered in frame, shot from a [ANGLE]
angle. Clean white background (#FFFFFF) or white void environment extending to infinity.
[Describe the "before" state in vivid detail — textures, colors, condition, mood].

Photorealistic rendering, 16:9 aspect ratio. [Add state-specific details: grime, wear, mess,
disrepair, etc.]. Dramatic but clean composition — the subject is the only thing in frame.

Shot on Phase One IQ4 150MP, 120mm macro lens, f/8, studio strobe lighting. Ultra-sharp detail.
```

**Personalize de acordo com o objeto específico:**
- Auste o ângulo da câmera (vista 3/4 funciona melhor para a maioria dos produtos)
- Adicione detalhes materiais específicos (alumínio escovado, plástico fosco, textura de couro, gotas d'água, etc.)
- Especifique a exatidão daquele estado (laptop fechado vs aberto, visor de relógio, cor da água, etc.)
- **Mantenha-o no fundo branco** — isto é crítico para a construção do site final e para transições limpas.

*(Nota: os prompts gerados obrigatoriamente permanecem na língua inglesa para manter o melhor entendimento semântico pela IA durante a geração final.)*

---

### Passo 3: Gerar o Prompt B — O Ângulo Desconstruído / Transformado

**Para produtos (vista explodida):**

```
PROMPT B — DECONSTRUCTED / EXPLODED VIEW

Professional exploded-view product photography of a [OBJECT], deconstructed into its individual
components, all floating in space against a clean white background (#FFFFFF).

Every internal component is visible and separated: [LIST 8-15 SPECIFIC COMPONENTS].
Each piece floats with even spacing, maintaining the general spatial relationship of where
they sit in the assembled product. The arrangement follows a vertical or diagonal explosion axis.

Soft studio lighting with subtle shadows on each floating piece. Components are pristine and
detailed — you can see textures, screws, ribbon cables, circuit traces. The overall composition
maintains the silhouette/outline of the original object.

Photorealistic rendering, 16:9 aspect ratio, technical illustration meets product photography.
Shot on Phase One IQ4 150MP, focus-stacked for sharpness across all floating elements.
Same lighting setup as the assembled shot for visual continuity.
```

**Para transformações (estado final/depois):**

```
PROMPT B — "AFTER" STATE

Professional photography of a [OBJECT IN AFTER STATE] centered in frame, shot from the SAME
angle as Prompt A. Clean white background (#FFFFFF) or white void environment.
[Describe the "after" state in vivid detail — pristine, transformed, elevated].

The transformation should be dramatic and unmistakable. Same subject, same angle, completely
different condition. [Add state-specific details: gleaming surfaces, vibrant colors, perfection].

Photorealistic rendering, 16:9 aspect ratio. Same lighting, same camera position as Prompt A —
only the subject's state has changed. This visual continuity is essential for the video transition.
```

**Listas de Componentes para os produtos comuns:**

- **Laptop:** Aluminum unibody shell, LCD display panel with ribbon cable, keyboard deck, trackpad module with haptic engine, battery cells, logic board with visible chips, SSD module, fan assembly with heat pipe, speaker modules (L+R), hinge mechanism, bottom case, rubber feet and screws, WiFi antenna array, camera module
- **Celular:** Glass back panel, battery, OLED display, logic board, camera module array, SIM tray, speaker grille, Taptic engine, USB-C port assembly, antenna bands, frame/chassis, face ID sensor, wireless charging coil
- **Calçado:** Outer sole, midsole cushioning, insole, upper mesh/leather panels, tongue, laces, heel counter, toe cap, eyelets, stitching thread, branding elements
- **Alimentação:** Use estilo de "explosão" — vidro estilhaçado, erupção de líquido, ingredientes voando pra as bordas congelados. Liste guarnições, frutas, cubos de gelo, respingos. Foco no estilo fotografia alta-velocidade (1/10000s freeze).

Para outros objetos, pesquise ativamente e liste 8-15 componentes autênticos daquele elemento.

---

### Passo 4: Gerar o Prompt C — A Transição do Vídeo

```
PROMPT C — VIDEO TRANSITION (Start Frame -> End Frame)

START FRAME: [Describe Prompt A's final image — the assembled/before state on white background]

END FRAME: [Describe Prompt B's final image — the deconstructed/after state on white background]

TRANSITION: Smooth, satisfying [deconstruction/transformation] animation. The [object] begins
[in start state] and still. After a brief pause (0.5s), [describe the specific motion]:

[FOR PRODUCTS]: Pieces begin to separate — starting from the outer shell and progressively
revealing inner components. Each piece lifts and floats outward along clean, deliberate paths.
Movement is eased (slow-in, slow-out) with slight rotations on individual pieces to reveal
their 3D form. The separation happens over 2-3 seconds in a cascading sequence, not all at once.
Final floating arrangement holds for 1 second.

[FOR TRANSFORMATIONS]: The transformation happens progressively — [describe the specific
visual change: color shifting, grime dissolving, surfaces becoming pristine, etc.]. The change
sweeps across the subject in a satisfying reveal. Movement is smooth and deliberate.

STYLE: Photorealistic, white background throughout, consistent studio lighting. No camera
movement — locked-off tripod shot. The only motion is the [deconstruction/transformation].
Satisfying, ASMR-like precision. Think Apple product reveal meets engineering visualization.

DURATION: 5-6 seconds total.
ASPECT RATIO: 16:9
QUALITY: High fidelity, smooth 24fps or higher, no artifacts.
```

**Variações Sempre Ofertadas no Chat:**
- **Versão Reversa** — Começar desconstruído e no fim chegar nele montado (extremamente forte)
- **Versão de Loop** — Para a frente, depois para trás num ciclo perfeito sem fim
- **Câmera lenta** — A mesma animação num tempo de 8-10 segundos 

---

### Passo 5: Montar o HTML e Exibi-lo

Depois de gerar todos os 3 prompts, você os entregará através de uma página Premium interativa em HTML. **Esse HTML é a entrega principal da ferramenta.**

**Instrução de construção:**

1. Leia o modelo base da página visual (template HTML) que deverá estar em `assets/prompt-page-template.html` (neste diretório de skill)

2. Mude os atributos/variáveis (`placeholders`):
   - `{{OBJECT_NAME}}` — O título de destaque do assunto na página
   - `{{HEADING_LINE1}}` — primeira linha principal
   - `{{HEADING_LINE2}}` — segunda linha (destaque secundário / apagado)
   - `{{TAB_A_NAME}}` — Identificação na guia A
   - `{{TAB_A_SHORT}}` — guia A simplificada (celulares)
   - `{{TAB_B_NAME}}` — Identificação na guia B
   - `{{TAB_B_SHORT}}` — guia B (mobile)
   - `{{PROMPT_A}}` — String completa do Prompt A gerado (sem códigos HTML)
   - `{{PROMPT_B}}` — String do Prompt B
   - `{{PROMPT_C}}` — String do Prompt C 

3. **Super Importante**: Codifique ou Escape caracteres problemáticos nos domínios como `<` , `>` e `&` pelas respectivas entidades HTML válidas.

4. Salve e escreva sobre `prompts.html` diretamente na pasta (Current Working Directory).

5. Rode a ação no console para que o HTML abra de imediato no navegador: execute `open prompts.html` se for Mac (se MacOS) ou afins.

---

### Passo 6: Apresentação Alternativa em Texto (Via Chat)

Paralelamente, e depois da abertura de `prompts.html` fluir, entregue tudo bem formatado pelo texto do seu chat como "seguro". 

```
## Seus Prompts para a Animação Scroll-Stop: [NOME DO OBJETO]

### PROMPT A — [Produto Montado / Estado Base]
[Cole os dados abaixo em seu criador de imagem de IA setando a tela no 16:9]

{prompt A}

---

### PROMPT B — [Vista Explodida ou Configuração Transformada (Pós)]
[Gere agora nas mesmas dimensões de tela referencialando com "o peso máximo" a imagem retornada que gerou ali no Prompt A]

{prompt B}

---

### PROMPT C — A Transição Pelo Tempo (Prompt de Vídeo)
[Coloque a imagem do prompt A (início) e a B (fim do take) nos motores AI que transicionam frames para animador]

{prompt C}

---

### Recomendações e Dicas de Qualidade
- **Modelador de Imagens (Midjourney/Flux)**: Use 16:9 como aspecto mandatório. Qualidade e tamanho fotográfico. 
- **Modelador de Transições e Vid AI (Runway etc)**: 16:9, por via de 5-6 segundos estipulados na melhor qualidade de fluxo.
- **Dica de consistência Mestra**: Faça e refine muito a primeira cena (shot base hero limpa), e force a geração B (segunda cena a desconstruir) usando a primeira como referencial de força de consistência. As iluminações, tons e direção seguirão à risca dali por diante. 
```

---

## Melhores Práticas

1. **A Consistência é o pilar** — Ambas as imagens "antes" e "depois" devem ser lidas visualmente como a mesma matéria física/digital do assunto em pauta. Usa-se a exata mesma direção em materiais, refrações de luzes e cores.
2. **Sempre Fundo Branco** — #FFFFFF puramente limpo, desconsiderar de gerar reflexos dramáticos do chão de estúdios que baguncem as mesclagens nos scroll-stops webs, sem uso de vignette ou frames cinza.
3. **Mecânica realista dos componentes em detalhes** — Componentes genuínas listadas, e descrições dos serviços (antes e depois do material em limpeza ou pintura). 
4. **O prompt transicional (Vídeo)** — Funciona em base de "genéricos agnósticos" para ler o visual de cada cena de frame injetado para então a IA modeladora só entender o movimento cinemático dele — Runway, Pika, Kling, etc.
5. **Sempre oferte variação inversa num ciclo temporal** — Montagens (reversas) são tão atrativas esteticamente quanto desmontagens explosivas.
6. **A Página Interativa HTML é a sua Estrela de Palco Principal** — Toda a entrega que fizer se foca naquele momento em que criará aquele ambiente proponente do usuário navegar nas 3 etapas. 
7. **Modifique inteligentemente sua conduta entre serviços, alimentícios ou equipamentos (Framework Ágil)**.

---

## Recuperação no Caso Falhas Típicas

| Problema Ocasional | Solução / Procedimento a Alertar |
|---|---|
| A AI inventou e trouxe luz diferentonas depois | Escrever a especificação em correspondência "match exact lighting direction and intensity" no B para amarrar isso. |
| Ficou uma poeira de explosão difusa (A Desconstrução de forma muito aleatória/errada) | Recalcar termos cruciais com pesos nos prompts: "maintain spatial relationships" e delimitar que ocorrem "explosion along single axis". |
| Ao rolar, as mesclagens da transição ficam saltitantes e tremidas | Alerta a duração dos takes a subirem em 8-10 segundos e peça para impor mais peso nos conceitos "smooth eased motion" contidos do prompt motion. |
| Componentes não trouxeram texturas (plástico/metal parecendo CGI fraco) | Aplicar referências minuciosas na estética tipo "(brushed aluminum, matte black plastic, green PCB)". |
| O branco não finalizou como #FFFFFF | Ditar o prompt reiterando puridades fortes com "pure white #FFFFFF background, no gradient, no vignette" de maneira mandante final. |
| O HTML subiu de forma feia quebrado ou tags invadiram | O agente falhou em codificar entidades HTML como `<`, `>` ou `&`. Aplicar ou reler a filtragem sempre. |
| Entregador HTML não abre logo de cara | Exibir falha no log local e sugerir pelo seu script terminal para acionar a rota do `open` manualmente ou reajustar diretório base dele na raíz para ser visível de onde estão trabalhando . |
