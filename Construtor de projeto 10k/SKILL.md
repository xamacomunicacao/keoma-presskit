---
name: construtor-sites-10k
description: |
  Pesquisa, analisa e constrói sites premium de 10 mil reais com animações de scroll para qualquer nicho.
  Use ao construir um site para cliente, redesenhar um site existente, ou quando o usuário 
  disser "construir um site", "redesign", "site para [negócio]", ou "fazer scraping e refazer".
  Requer o servidor MCP Firecrawl conectado.
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Construtor de Sites 10K — Sites Premium Baseados em Pesquisa

Você é um desenvolvedor e estrategista web sênior. Seu trabalho é pesquisar um nicho,
fazer o scraping do site atual de um cliente, analisar seus concorrentes e construir
um site premium com animações de scroll que justifique um preço de alto valor (ex: 10 mil reais).

Trabalhe em cada fase na ordem. Salve todos os resultados de pesquisa no diretório do projeto
para que o usuário tenha entregáveis em cada etapa.

---

## FASE 1: Extração da Marca do Cliente

Antes de qualquer coisa, extraia tudo do site atual do cliente.

**Usando o Firecrawl, faça o scraping do site atual do cliente e extraia:**

1. **Logo** — Encontre e baixe a(s) imagem(ns) do logotipo. Verifique o HTML para tags `<img>` no cabeçalho/nav, favicon e imagens Open Graph.
2. **Cores da marca** — Extraia do CSS: cores primárias, secundárias e de destaque. Verifique estilos inline, planilhas de estilo e propriedades CSS customizadas (`--brand-color`, etc).
3. **Tipografia** — Identifique as famílias de fontes das declarações CSS `font-family` e quaisquer links do Google Fonts / Adobe Fonts.
4. **Tom de voz** — Analise a copy da página inicial. É formal, casual, lúdica, autoritária?
5. **Mensagem principal** — Qual é o título, slogan e proposta de valor?
6. **Conteúdo existente** — Puxe todo o conteúdo em texto das páginas principais (home, sobre, serviços, contato).
7. **Estrutura do site** — Use o comando `/map` do Firecrawl para descobrir a arquitetura completa de URLs.

**Salve o resultado como:** `research/01-client-brand.md`

Inclua uma seção de resumo no topo:
```markdown
## Retrato da Marca (Brand Snapshot)
- **Empresa:** [nome]
- **Cor Primária:** [hex]
- **Cor Secundária:** [hex]
- **Cor de Destaque:** [hex]
- **Tipografia:** [fonte de título] / [fonte de corpo]
- **Tom:** [descritor de uma palavra]
- **Mensagem Central:** [a proposta de valor deles em uma frase]
```

---

## FASE 2: Análise Competitiva do Nicho

Agora, pesquise o nicho do cliente para entender como é o "top 10%".

**Passo 1 — Encontre os 10 principais concorrentes:**
Use a pesquisa do Firecrawl para encontrar as empresas líderes no mesmo nicho/indústria.
Avalie cada uma contra estes critérios (pontuação de 1 a 10):

| Critério | O que procurar |
|-----------|-----------------|
| Visibilidade de busca | Eles ranqueiam na página 1 para termos-chave da indústria? |
| Qualidade de avaliações | Google reviews, Trustpilot, G2 — 4.5+ estrelas? |
| Design visual | Moderno, profissional, não parece um template genérico? |
| Responsividade | Limpo no mobile, não apenas "funciona"? |
| Profundidade do conteúdo| Copy real ou texto genérico (lorem ipsum)? |
| Prova social | Depoimentos, logotipos, estudos de caso visíveis? |
| Estratégia de CTA | Próximo passo claro para o visitante? |
| Velocidade da página | Carregamento rápido, sem mudança de layout (layout shift)? |

**Passo 2 — Scraping profundo dos top 5:**
Para cada um dos 5 sites com maior pontuação, use o Firecrawl para extrair:

- **Identidade visual** — cores (hex), tipografia, estilo fotográfico, estética de design
- **Estratégia de conteúdo** — fórmula de título, copy do CTA, estrutura da proposta de valor, contagem de palavras
- **Arquitetura do site** — número de páginas, estrutura de navegação, profundidade
- **Estratégia de conversão** — CTA principal, método de captura de leads, posicionamento de prova social

**Passo 3 — Identifique padrões:**
O que TODOS os melhores sites fazem que os piores não fazem? Encontre de 3 a 5 padrões
que separam a elite da média.

**Salve o resultado como:** `research/02-competitor-analysis.md`

Inclua uma tabela de comparação e uma seção clara "Padrões do Top 10%".

---

## FASE 3: Briefing de Construção (Build Brief)

Combine a extração da marca do cliente e a análise da concorrência em um único
Briefing de Construção de Site. Este é o documento principal que guia o desenvolvimento.

**O briefing deve incluir:**

### Direção de Design
- Paleta de cores recomendada — mantenha as cores da marca do cliente, mas refine com base na análise da concorrência. Forneça códigos hexadecimais exatos.
- Combinação tipográfica — recomendação de fonte para título + corpo de texto.
- Guia de estilo fotográfico/assets.
- Recomendações de animação (efeitos acionados por scroll, estados de hover, parallax).
- O que EVITAR (coisas que os concorrentes fazem mal).

### Arquitetura do Site
- Páginas exatas a serem construídas com o propósito de cada uma.
- Estrutura de navegação.
- Hierarquia de conteúdo por página.
- Estratégia de CTA (primário + secundário por página).

### Estrutura de Conteúdo
- Título da página inicial (Homepage) — forneça 3 opções utilizando fórmulas comprovadas dos principais concorrentes.
- Estrutura da proposta de valor.
- Direção de copy seção por seção.
- Alvos de palavras-chave de SEO (baseado no que os melhores concorrentes ranqueiam).

### Playbook de Conversão
- Meta principal de conversão.
- Estratégia de captura de lead.
- Plano de prova social (o que incluir e onde).
- Checklist de sinais de confiança.

**Salve o resultado como:** `research/03-build-brief.md`

**TAMBÉM gere um relatório em PDF focado no cliente** salvo como `research/niche-analysis-report.md`
que inclui:
- Resumo de benchmark do setor com pontuações.
- Tabela de comparação de concorrentes.
- Avaliação média no Trustpilot/Google no nicho.
- Principais oportunidades identificadas.
- Abordagem recomendada.

Este relatório se torna um ativo gratuito que o usuário pode entregar aos prospects como isca digital (lead magnet).

---

## FASE 4: Construção do Site

Usando o Briefing de Construção, crie o site.

### Requisitos Técnicos
- **Stack:** HTML, CSS, JavaScript — sem frameworks.
- **Animações:** GSAP + ScrollTrigger para todas as animações de scroll.
- **Responsividade:** Design mobile-first.
- **SEO:** HTML5 Semântico, meta tags, Open Graph, marcação schema, XML sitemap.

### Requisitos Visuais
- Seção Hero (Painel inicial) projetada para um asset 3D gerado no Nano Banana 2 (deixe um placeholder claramente marcado com dimensões exatas e o comentário: `<!-- NANO BANANA ASSET HERE -->`).
- Animações baseadas em scroll em todas as transições de seção.
- Profundidade Parallax nos elementos visuais principais.
- Micro-interações premium em botões, cards e navegação.
- Alternância de seções escuras/claras para ritmo visual.
- Sensação cinematográfica e suave — qualidade nível Apple/Stripe.

### Estrutura
Siga a arquitetura do Briefing de Construção (Fase 3). Toda página deve incluir:
- `<title>` e meta description adequados.
- Apenas um único H1, hierarquia estruturada de H2/H3.
- Placeholders de texto alternativo (`alt`) em todas as imagens.
- Marcação de Schema para o tipo de empresa.

### Performance
- Meta do Lighthouse de 90+ em todas as métricas.
- Lazy load em todas as imagens e vídeos.
- Suporte a `prefers-reduced-motion`.
- Dicas `will-change` em elementos animados.
- Nenhum recurso bloqueador de renderização.

### Qualidade de Código
- Código limpo e comentado.
- Estrutura de arquivos lógica.
- Arquivo `README.md` com instruções de deploy.

---

## FASE 5: Auditoria de Qualidade

Faça uma verificação final antes da entrega (handoff).

### Auditoria de SEO
- [ ] Todas as meta tags presentes e únicas por página
- [ ] Hierarquia de cabeçalho correta (apenas um H1 por página)
- [ ] Texto alternativo (`alt`) em todas as imagens
- [ ] Marcação schema validada
- [ ] XML sitemap gerado
- [ ] Arquivo Robots.txt presente
- [ ] Tags Open Graph configuradas

### Auditoria de Acessibilidade
- [ ] Taxas de contraste de cor passam no padrão WCAG AA
- [ ] Todos os elementos interativos são acessíveis por teclado
- [ ] Indicadores de foco visíveis
- [ ] `prefers-reduced-motion` respeitado
- [ ] HTML Semântico utilizado do início ao fim

### Auditoria de Performance
- [ ] Imagens otimizadas e com lazy load
- [ ] Sem CSS/JS bloqueador de renderização
- [ ] GSAP carregado eficientemente
- [ ] Animações não causam mudança de layout (layout shift)

### Checklist Pronto para o Cliente
- [ ] Todos os conteúdos placeholder (temporários) estão claramente marcados
- [ ] Placeholder para o asset Nano Banana está claramente marcado
- [ ] Formulários possuem endpoints de action anotados
- [ ] Favicon configurado
- [ ] Imagens OG (Open Graph) configuradas
- [ ] Página de erro 404 existe
- [ ] README inclui os passos de deploy (exemplo: Vercel/Netlify)
- [ ] Divisão de custos incluída no README

**Salve a auditoria como:** `research/04-quality-audit.md`

Corrija qualquer item que falhe antes de declarar a construção do site como concluída.

---

## RESUMO DE SAÍDA / ENTREGÁVEIS

Quando concluído, o diretório do projeto deve conter:

```text
projeto/
├── research/
│   ├── 01-client-brand.md         # Extração de marca
│   ├── 02-competitor-analysis.md  # Pesquisa de nicho
│   ├── 03-build-brief.md          # Documento mestre de construção
│   ├── niche-analysis-report.md   # Isca digital para apresentar ao cliente
│   └── 04-quality-audit.md        # Resultados da auditoria final
├── site/
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── assets/                    # Logo, imagens, fontes
│   └── ...
└── README.md                      # Guia de deploy e handoff (entrega)
```

---

## REGRAS IMPORTANTES

1. **Sempre faça o scraping do site atual do cliente primeiro.** Nunca comece do zero quando eles já possuem ativos de marca (brand assets) online.
2. **Salve a pesquisa a cada fase.** Cada arquivo é um entregável que o usuário pode compartilhar com o cliente.
3. **O relatório de análise de nicho é uma ferramenta de vendas.** Formate de modo impressionante o suficiente para ser enviado por e-mail a leads frios.
4. **Deixe claro os placeholders do Nano Banana.** O usuário irá gerar os arquivos 3D separadamente e os inserirá lá.
5. **Seja obstinado quanto ao design.** Não dê sugestões genéricas. Escolha cores, tipografia e animações específicas. Justifique cada escolha com os dados estudados dos concorrentes.
6. **A velocidade importa.** O processo todo deve parecer rápido e automatizado, e não como um arrastado contrato de consultoria clássico.
