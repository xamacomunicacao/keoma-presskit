# Diretrizes de Deploy Seguro e Otimização de Performance

Este documento estabelece o **modus operandi** obrigatório para qualquer alteração ou deploy em projetos de sites de alta performance em produção, visando estabilidade absoluta (Zero Downtime / Zero Flicker) e máxima satisfação do cliente.

---

## 📋 Checklist de Pré-Deploy e Revisão de Código

### 1. Auditoria de Sintaxe e Escopo (Anti-TDZ)
* **Regra**: Variáveis e constantes declaradas com `let` ou `const` **devem** ser posicionadas fisicamente antes de qualquer chamada a funções que as manipulem (evitando problemas com a *Temporal Dead Zone*).
* **Contexto**: Quando o navegador carrega arquivos instantaneamente a partir do cache, funções de callback (como `onload`) podem ser executadas imediatamente, disparando erros de inicialização (`ReferenceError`) caso a declaração esteja posicionada abaixo no arquivo.
* **Ação**: Mova variáveis globais de controle para o topo do bloco de lógica.

### 2. Renderização Protegida de Elementos (Anti-Flicker)
* **Regra**: Nunca limpe o canvas ou apague um elemento de mídia antes de garantir que o novo recurso esteja 100% carregado na memória do cliente.
* **Validação em Javascript**:
  ```javascript
  if (targetImg && targetImg.complete && targetImg.naturalWidth !== 0) {
      // 1. Limpa o canvas
      // 2. Desenha a nova imagem
  } else {
      // Mantém o estado/imagem anterior na tela para evitar piscadas em preto/branco
  }
  ```
* **Ação**: Implemente fallbacks que mantenham a última renderização válida ativa até o carregamento completo do próximo recurso.

### 3. Priorização de Carregamento (Otimização de Fila de Rede)
* **Regra**: Separe a carga inicial (Hero / Primeiro Frame / Logo Principal) da carga de animações complexas ou coleções de imagens.
* **Implementação**:
  * Carregue o primeiro elemento imediatamente.
  * Agende o carregamento dos frames ou assets restantes usando `setTimeout(() => { ... }, 150)` para evitar o congestionamento de conexões simultâneas do navegador (limite padrão de HTTP/1.1 de 6 conexões simultâneas).
* **Benefício**: Percepção de carregamento instantâneo para o usuário final.

### 4. Controle de Cache e Headers
* **Regra**: Configure cabeçalhos de cache persistentes (`Cache-Control`) para assets de imagem, vídeo e estilos em arquivos como `vercel.json` ou cabeçalhos do servidor Express para otimizar os retornos de CDNs.

### 5. Validação de Execução Local
* **Regra**: Sempre inicialize o servidor local e verifique a ausência de erros no console do terminal antes de consolidar e enviar as modificações.
* **Deploy**: Commits explicativos padronizados e push direto para a branch de produção via Git, monitorando a build.
