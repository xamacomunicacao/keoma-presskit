?---
name: construtor-sites-3d
description: >
  Recebe um arquivo de vídeo (ex: animação de desmontagem/montagem de produto, transformação antes/depois) e constrói um site com qualidade de produção com animações controladas por scroll. O vídeo avança e retrocede conforme o usuário rola a página, criando um efeito dramático estilo Apple ("scroll-stopping"). Utiliza extração de quadros via FFmpeg, renderização baseada em canvas e técnicas modernas de scroll. Inclui: fundo de estrelas animado, cartões de anotação com parada ("snap-stop"), seção de especificações com animação numérica, barra de navegação com transformação em pílula, tela de carregamento e total responsividade móvel. Acione quando o usuário disser "animação 3D", "site com scroll", "video no scroll", "animação estilo Apple", ou fornecer um vídeo pedindo para controlá-lo no scroll.
---

# Criador de Animações 3D — Sites com Vídeos Controlados por Scroll

Você pega um arquivo de vídeo e constrói um site com qualidade de produção onde a reprodução do vídeo é controlada pela posição do scroll — criando um efeito dramático "scroll-stopping" estilo Apple.

O usuário fornece o vídeo. Você cuida de tudo: extração dos quadros (frames), construção do site, preenchimento do conteúdo e a disponibilização local para pré-visualização.

---

## Passo 0: A Entrevista (OBRIGATÓRIO)

Antes de tocar em qualquer código ou extrair qualquer quadro, faça estas perguntas ao usuário.
Não pule esta etapa — o site inteiro é construído a partir destas respostas.

### Perguntas Obrigatórias

Faça estas perguntas naturalmente, não como um interrogatório numerado:

1. **Nome da marca** — "Qual é a marca ou nome do produto para este site?"
2. **Logotipo** — "Você tem um arquivo de logotipo que eu possa usar? (De preferência SVG ou PNG)"
3. **Cor de destaque** — "Qual é sua cor de destaque principal? (código hex, ou descreva e eu sugerirei opções)"
4. **Cor de fundo** — "Qual a cor de fundo? (fundos escuros funcionam melhor para este efeito)"
5. **Vibe geral** — "Qual o estilo que você busca? (ex: lançamento de tecnologia premium, luxo, divertido, minimalista, ousado)"

### Obtenção de Conteúdo

Pergunte como eles desejam fornecer o conteúdo do site:

- **Opção A: A partir de um site existente** — "Compartilhe a URL e eu vou extrair o conteúdo real (nome do produto, recursos, especificações, textos)."
- **Opção B: Colar aqui** — "Cole as descrições do produto, lista de recursos, especificações, depoimentos — o que você tiver."

Se fornecerem uma URL, use a ferramenta disponível (`read_url_content` ou `search_web`) para recuperar a página e extrair as descrições relevantes, detalhes do produto, recursos, especificações e qualquer outro conteúdo utilizável.

### Seções Opcionais

Pergunte se eles querem incluir estas seções:

- **Depoimentos** — "Deseja uma seção de depoimentos? Forneça-os ou eu vou extrair da URL que você compartilhou."
- **Confete** — "Deseja um efeito de explosão de confete em algum lugar? (ex: ao clicar no botão CTA)"
- **Card Scanner** — "Deseja uma seção de exibição de partículas 3D? (Baseado em Three.js — bom para exibir um cartão, dispositivo ou objeto)"

Inclua estas apenas se o usuário optar explicitamente.

---

## Pré-requisitos

- **FFmpeg** deve estar instalado (`brew install ffmpeg` se não estiver)
- O usuário fornece um arquivo de vídeo (MP4, MOV, WebM, etc.)
- O vídeo deve ser relativamente curto (3 a 10 segundos é o ideal)
- **O primeiro quadro (frame) do vídeo DEVE ter um fundo branco.** Se não tiver, avise o usuário e peça um novo vídeo ou uma imagem hero separada com fundo branco.

---

## Design System (Construído a partir das Respostas do Usuário)

Assim que a entrevista for concluída, construa o sistema de design:

- **Fontes**: Space Grotesk (títulos), Archivo (corpo), JetBrains Mono (código)
- **Cor de destaque (Accent)**: Da resposta do usuário — usada em botões, brilhos, barras de progresso, destaques
- **Cor de fundo**: Da resposta do usuário — usada no body, seções
- **Cores de texto**: Derivadas do fundo — fundo escuro recebe texto principal branco + secundário suave; fundo claro recebe principal escuro + secundário suave
- **Seleção de texto**: Fundo da cor de destaque com texto contrastante
- **Barra de rolagem (Scrollbar)**: Trilha escura com controle (thumb) em gradiente usando a cor de destaque, com brilho ao passar o mouse
- **Cards**: Glass-morphism (Morfismo de vidro) — fundo semi-transparente, borda sutil, `backdrop-filter: blur(20px)`, `border-radius: 20px`
- **Botões**: Primário = fundo da cor de destaque com texto contrastante + brilho (glow); Secundário = transparente com borda
- **Efeitos**: Esferas flutuantes ao fundo (tons da cor de destaque, desfocados), sobreposição de grade sutil, céu estrelado animado
- **Nome e logotipo da marca**: Usado na barra de navegação, rodapé, loader e onde a marca aparecer.

---

## O Processo de Construção

### Passo 1: Analisar o Vídeo

```bash
ffprobe -v quiet -print_format json -show_streams -show_format "{CAMINHO_DO_VIDEO}"
```

Extraia duraçao, fps, resolução, total de quadros. O ideal é mirar de 60 a 150 quadros no total.

### Passo 2: Extrair Quadros (Frames)

```bash
mkdir -p "{DIRETORIO_DE_SAIDA}/frames"
ffmpeg -i "{CAMINHO_DO_VIDEO}" -vf "fps={TARGET_FPS},scale=1920:-2" -q:v 2 "{DIRETORIO_DE_SAIDA}/frames/frame_%04d.jpg"
```

Use `-q:v 2` para JPEG de alta qualidade. Use JPEG e não PNG para obter arquivos menores.

### Passo 3: Construir o Site

Crie um único arquivo HTML. O site contém estas seções (de cima para baixo):

1. **Céu Estrelado (Starscape)** — Canvas fixo atrás de tudo com ~180 estrelas cintilantes animadas
2. **Carregador (Loader)** — Tela cheia com o logotipo da marca, texto "Loading" e barra de progresso com cor de destaque
3. **Barra de Progresso do Scroll** — Posição fixa no topo, gradiente de destaque, 3px de altura
4. **Navbar** — Logotipo da marca + nome, transforma-se de largura total para uma pílula centralizada durante o scroll
5. **Hero** — Título, subtítulo, botões CTA, dica de scroll, esferas de fundo + grade
6. **Animação de Scroll** — Canvas com 'position: sticky' exibindo a sequência de quadros, cartões de anotação com parada ("snap-stop")
7. **Especificações (Specs)** — Quatro números estatísticos com animação de contagem ao rolar
8. **Recursos (Features)** — Cartões com glass-morphism em formato de grid
9. **CTA** — Seção de Call to Action (chamada para ação)
10. **Depoimentos (Testimonials)** — *(apenas se optado)* Cartões horizontais que deslizam ao arrastar
11. **Card Scanner** — *(apenas se optado)* Exibição de partículas em Three.js
12. **Rodapé (Footer)** — Nome da marca e links

**Para a implementação exata de CSS/JS de cada seção**, leia `references/sections-guide.md`.
Esse arquivo contém o código completo para cada seção — estrutura, estilo, JavaScript, adaptações móveis e padrões de animação.

### Passo 4: Padrões-Chave de Implementação

**Renderização de Canvas com suporte a Retina:**
```javascript
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';
```

**Desenho preenchendo a tela (desktop) — contido com zoom (mobile):**
No desktop, use aproximação "cover-fit" para que o quadro preencha de ponta a ponta. No mobile, use "contain-fit" ligeiramente com zoom para que o objeto permaneça centralizado e visível.

**Cartões de anotação com parada (snap-stop scroll):**
Os cartões de anotação aparecem em pontos específicos do progresso do scroll (atributos data-show/data-hide).
O scroll CONGELA brevemente na posição de cada cartão — criando um efeito em sequência onde cada cartão surge assim que rolar a página para. Usa-se snap baseado em JS: detecta quando o progresso entra em uma zona de parada ("snap zone"), rola para a posição exata, trava o 'overflow' do body por ~600ms, e em seguida solta.
A quantidade de cartões de anotação é flexível — combine-a com o conteúdo fornecido pelo usuário.

**Transformação da Navbar (scroll-to-pill):**
A barra de navegação inicia com largura total, e, ao rolar, diminui para um formato de pílula centralizada (max-width ~820px) com cantos arredondados e fundo glass-morphism.

**Animação de Contagem (Count-up):**
Os números nas especificações animam de 0 até o valor alvo com suavização 'easeOutExpo', em sequência com atraso de 200ms entre eles. Os números recebem um pulso de brilho da cor de destaque durante a contagem. Acionado via IntersectionObserver.

**Céu Estrelado animado:**
Um canvas fixo atrás do resto com ~180 estrelas que derivam lentamente e cintilam. Cada estrela tem velocidade de derivação aleatória, velocidade/fase de cintilação e opacidade. Cria um fundo sutil com vida.

### Passo 5: Personalizar o Conteúdo

Todo o conteúdo vem da entrevista (Passo 0). Use a verdadeira marca, os detalhes reais do produto e o texto real — nunca use um texto genérico (Lorem ipsum). Se o conteúdo vier de uma URL, use o texto daquele site. Preencha:

- Títulos e subtítulos Hero
- Rótulos dos cartões de anotação, descrições e estatísticas
- Números e rótulos das especificações (Specs)
- Cartões de recursos (Features)
- Texto do CTA
- Depoimentos (se inclusos)

### Passo 6: Servir & Testar

```bash
cd "{DIRETORIO_DE_SAIDA}" && python3 -m http.server 8080
```

Abra `http://localhost:8080` e faça testes. Em seguida, abra a URL no navegador para o usuário ver.

---

## Responsividade Mobile (Dispositivos Móveis)

Principais adaptações para mobile:

- **Cartões de anotação**: Design compacto em uma única linha — esconda parágrafos, números e rótulos. Mostre apenas o número do cartão + título numa linha flex. Posicione no fundo da área de visualização (`bottom: 1.5vh`)
- **Altura da animação ao rolar (Scroll animation)**: `350vh` no desktop, `300vh` no tablet, `250vh` no celular
- **Navbar**: Esconda os links, exiba apenas o logo + pílula (pill shape)
- **Depoimentos** (se inclusos): Scroll sensível ao toque, centralizando no cartão (snap)
- **Cartões de Recursos**: Empilhados numa única coluna
- **Especificações (Specs)**: Grid 2x2 no mobile

---

## Melhores Práticas

1. **`requestAnimationFrame` para desenho** — Nunca desenhe diretamente no handler de 'scroll'
2. **`{ passive: true }` no evento de scroll** — Ativa otimizações de scroll no navegador
3. **Canvas com `devicePixelRatio`** — Nitidez em telas Retina
4. **Pré-carregar todos os quadros (frames)** — Nenhuma falha/pulo durante a rolagem inicial
5. **Eliminação de quadros duplicados (Deduplication)** — Apenas chame `drawFrame` quando o índice do quadro de fato mudar
6. **Não usar `scroll-behavior: smooth`** — Interferiria no mapeamento preciso dos quadros no scroll
7. **Sem bibliotecas JS pesadas** — Somente Vanilla JS puro, com exceção do Three.js para o Card Scanner (apenas se incluso)
8. **Canvas 'Sticky'** — `position: sticky` na tela do vídeo mantém o canvas fixado enquanto o container do scroll se move
9. **Primeiro frame branco** — O vídeo obrigatoriamente deve ter um início com fundo totalmente branco limpo

---

## Recuperação de Erros

| Problema | Solução |
|---|---|
| FFmpeg não está instalado | Peça ao usuário para executar `brew install ffmpeg` |
| Quadros não carregam | Verifique caminhos e certifique-se de iniciar o servidor local (não servem via file://) |
| A Animação engasga | Reduza o número de quadros, use arquivos JPEG no lugar de PNG, verifique os tamanhos dos arquivos (< 100KB cada) |
| Canvas embaçado | Assegure-se de que o escalonamento via `devicePixelRatio` está sendo aplicado corretamente |
| Sensação de Scroll rápida ou lerda demais | Ajuste a altura do `.scroll-animation` (200vh=rápido, 500vh=devagar, 800vh=cinematográfico) |
| Cartões de anotação mobile sobrepõem os conteúdos | Use design compacto de uma linha e posicione em `bottom: 1.5vh` |
| Parada do scroll ("snap-stop") bizarra | Reduza `HOLD_DURATION` para 400ms ou aumente a `SNAP_ZONE` |
| Estrelas muito claras/escuras | Adéque a opacidade no starscape canvas (o padrão é 0.6) |
| Primeiro quadro não é branco | Peça ao usuário para re-exportar o vídeo com um quadro limpo (branco) de abertura |
| Vídeo muito longo (>10s) | Recomende cortar de 3 a 6 segundos para melhorar o desempenho no scroll |
