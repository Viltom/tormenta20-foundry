# Scripts de importação — Tormenta 20

Rode cada script como Macro (tipo Script) dentro do Foundry, apenas 1x cada,
para popular os compêndios.

## Ordem recomendada para 1ª instalação

1. `01-importar-armas.js`
2. `02-importar-armaduras.js`
3. `03-importar-poderes.js`
4. `04-importar-itens.js`
5. `08-importar-TODAS-magias-F12.js`
6. `09-importar-racas.js`
7. `10-importar-classes.js`
8. `11-importar-origens.js`
9. `12-popular-dano-magias.js`
10. `13-importar-racas-extras.js`
11. `14-importar-classes-extras.js`
12. `15-importar-origens-extras.js`
13. `16-importar-armas-extras.js`
14. `17-limpar-variantes-do-compendio.js`  ← **só se rodou versão anterior do script**
15. `18-importar-poderes-concedidos.js`
16. `19-importar-poderes-extras.js`
17. `20-importar-distincoes.js`
18. `21-importar-bestiario.js`  ← bestiário de NPCs (139 criaturas)
19. `22-corrigir-magias-do-compendio.js`  ← correções em magias existentes (opcional)
20. `23-atualizar-magias-classes.js`  ← **v0.8.0**: atualiza descrições das 6 classes conjuradoras (ler "Novidades da v0.8.0")

## Novidades da v0.8.0 (Integração de Combate + Condições Visuais + Magias por Nível)

### 1. Iniciativa integrada ao Combat Tracker

A rolagem de iniciativa agora conversa com a aba de **Combat Encounters** (rodapé
direito do Foundry) em ambas as direções:

- `CONFIG.Combat.initiative.formula = "1d20 + @pericias.iniciativa.total"` é
  registrado no `init` hook — o botão `⟳ Roll All` / `Roll NPCs` do tracker
  passa a usar a perícia Iniciativa do T20 (mod Des + treino + bônus), em vez
  do fallback genérico `1d20`.
- O botão **🎯 Rolar Iniciativa** dentro da ficha (PJ e NPC) detecta se o
  ator está em `game.combat` e, se sim, preenche a coluna de iniciativa no
  tracker via `Combat#rollInitiative`. Se não houver combate ativo, cai pro
  chat como antes.
- Arrastar um token pra o tracker, ou o próprio Foundry iniciando turnos,
  usa a fórmula correta.

Fluxo lógico (tradução Roll20 → Foundry): no Roll20 a iniciativa era um
botão de macro que empurrava pro "Turn Order" via API. No Foundry a gente
só precisa registrar `CONFIG.Combat.initiative` e o core faz o resto —
o `Actor#getRollData()` já expõe `pericias.iniciativa.total` e o mecanismo
nativo do tracker resolve `@pericias.iniciativa.total` na fórmula.

### 2. Condições como Status Effects (ícones no token + HUD)

As 34 condições T20 (`abalado`, `apavorado`, `em chamas`, `sangrando`, …)
agora são **`CONFIG.statusEffects` oficiais do Foundry**, com ícones nativos
`icons/svg/*`. Consequências:

- Ícones aparecem **sobre o token** na cena quando a condição está ativa.
- O **HUD do token** (clique direito no token) mostra a paleta das 34
  condições — você pode aplicar/remover clicando nos ícones.
- A lista no **Combat Tracker** exibe os ícones de condição ao lado do nome.

**Sincronização bidirecional (sem loop):**
- Marcar o checkbox na aba "Condições" da ficha → `updateActor` hook
  aplica/remove o status effect → token exibe o ícone.
- Clicar no ícone no HUD do token → `create/deleteActiveEffect` hooks
  refletem o estado em `system.condicoes.<key>` → checkbox na ficha
  atualiza sozinho.

**Importante sobre a mecânica:** os ActiveEffects criados pelas condições
T20 são **marcadores visuais** (sem `changes`). A lógica numérica (-2 em
perícias, -5 em atributos etc.) continua em `prepareDerivedData` lendo
`system.condicoes.<key>` — não há dupla aplicação de modificadores.

Se você tem personagens antigos com condições já marcadas na ficha e quer
"propagar" os ícones pro token sem precisar mexer em cada checkbox, rode
no console F12:
```js
await game.tormenta20.syncAllConditions(actor);  // ou canvas.tokens.controlled[0].actor
```

### 3. Magias conhecidas por nível nas 6 classes conjuradoras

Cada classe conjuradora agora descreve explicitamente na descrição:

- **Arcanista**: 3 magias no 1º, +1/nv (Feiticeiro só ímpares; Mago começa
  com 4 e ganha +1 por novo círculo).
- **Bardo**: 2 magias no 1º, +1 por nível **par** (2º, 4º, 6º…).
- **Clérigo**: 3 magias no 1º, +1/nv.
- **Druida**: 2 magias no 1º, +1 por nível **par**.
- **Frade** (Deuses de Arton): 3 magias no 1º, +1/nv.
- **Místico** (Classes Novas): 3 magias no 1º, +1/nv (até 4º círculo).

Se você já tem o compêndio `tormenta20.classes` importado e **não** quer
reimportar tudo, rode apenas `23-atualizar-magias-classes.js` no console
F12. Idempotente, só mexe em `system.descricao` e `system.acao` dos itens
das 6 classes listadas acima.

Se você vai instalar o sistema do zero, os scripts 10 e 14 já vêm com
essas descrições atualizadas — o script 23 é desnecessário nesse caso.

## Novidades da v0.7.0 (Multiclasse + Variantes como Subclasses + Firelink)

### 1. Multiclasse — campo CLASSE do cabeçalho

**Não há campo duplicado.** Clique no campo `CLASSE` do cabeçalho abre o
**Gerenciador de Classes**, onde você pode:

- Ver todas as classes que o personagem tem (cada uma com seu nível)
- Adicionar nova classe (botão "+ Adicionar Classe")
- Editar o nível de cada classe (campo Nv inline, 1-20)
- Escolher/trocar subtipo de cada classe
- Marcar qual é a principal (⭐) — usada pras proficiências e ficha
- Remover uma classe (mín. 1 sempre)

O campo `CLASSE` no cabeçalho continua mostrando o nome da **classe principal**
(primeira/estrela). O campo `NÍVEL` passa a ser a **soma de todos os níveis**
de classes (ex: Inventor 5 + Ladino 3 → Nível 8).

**Cálculo de PV/PM** segue T20 RAW (pág. 90-91):
```
PV = Σ [nivelClasse × (pvClasse + modCon)] + bonusPV
PM = Σ [nivelClasse × pmClasse] + modAtrChave + bonusPM
```

### 2. Classes Variantes de Heróis de Arton — agora SUBCLASSES

As 14 Classes Variantes (Alquimista, Atleta, Burguês, Duelista, Ermitão,
Inovador, Machado de Pedra, Magimarcialista, Necromante, Santo, Seteiro,
Usurpador, Vassalo, Ventanista) agora aparecem no campo **SUB** da classe-base
correspondente, marcadas com badge **VARIANTE** vermelha.

Exemplo: ao selecionar classe **Inventor**, o campo SUB mostra:
- "Alquimista" (VARIANTE) → Heróis de Arton

Tabela de overrides de stats (as 4 variantes que alteram PV/PM da base):

| Variante        | Base      | PV     | PM    | Observação         |
|-----------------|-----------|--------|-------|--------------------|
| Burguês         | Nobre     | 12+3   | 4/nv  | ⚠ PV reduzido      |
| Ermitão         | Druida    | 12+3   | 4/nv  | ⚠ PV reduzido      |
| Magimarcialista | Bardo     | 16+4   | 4/nv  | ⚠ PV aumentado     |
| Santo           | Paladino  | 20+5   | 4/nv  | ⚠ PM aumentado     |

O sistema aplica o override automaticamente em `prepareDerivedData` quando
a entrada de classe tem essa subclasse.

**As outras 10 variantes** (Alquimista, Atleta, Duelista, Inovador, Machado de
Pedra, Necromante, Seteiro, Usurpador, Vassalo, Ventanista) usam os mesmos
PV/PM da classe-base — a diferença delas é mecânica/narrativa, não de stats.

### 3. Plano de fundo Firelink

A imagem `assets/firelink-bg.png` é aplicada automaticamente em:
- Fundo global do Foundry (`body.system-tormenta20`) — aparece sempre que
  não há canvas/cena cobrindo
- Atrás do painel "JOGO PAUSADO" (com overlay semi-transparente)
- Tela de setup/login inicial

Todos os paths usam `/systems/tormenta20/assets/firelink-bg.png` (absoluto
pro servidor do Foundry), então funcionam independente de onde o CSS é
carregado.

### 4. Dice So Nice / Dice Tray

Adicionamos regras `!important` para garantir que os módulos externos
**Dice So Nice** e **Dice Tray/Calculator** não sejam escondidos por estilos
do sistema, incluindo estilização dark integrada nos botões da bandeja.

Se continuarem sem funcionar:
1. Confirme que os módulos estão **instalados e ativados** (Settings →
   Manage Modules)
2. No console F12, rode o diagnóstico:
   ```js
   console.log("DsN ativo:", game.modules.get("dice-so-nice")?.active);
   console.log("Dice Tray ativo:", game.modules.get("dice-calculator")?.active);
   console.log("WebGL OK:", !!document.createElement("canvas").getContext("webgl2"));
   console.log("Canvas DsN no DOM:", !!document.getElementById("dice-box-canvas"));
   ```
3. Se DsN estiver ativo mas os dados não renderizam, pode ser WebGL
   bloqueado no navegador (teste em Modo Anônimo sem extensões).

## Bestiário (v0.6.4 — Abril 2026)

O script `21-importar-bestiario.js` cria Actors tipo NPC no compêndio
`tormenta20.bestiario` a partir de 139 criaturas do Livro Básico (Cap. 7:
Ameaças) e do Deuses de Arton (servos divinos, avatares, aspectos).

### Correções na v0.6.4

- **PV/PM com separador de milhar** agora lidos corretamente. Avatares
  que ficavam com PV=1 ou PV=2 (porque o PDF usa "2.477" com ponto como
  separador de milhar português) agora têm os valores completos:
  Avatar de Aharadak 2477, Avatar de Nimb 4777, Avatar de Valkaria 3800,
  Dragão-Rei 1400, Thuwarokk 900, etc.
- **Resistências multi-linha** extraídas completas (antes vinha só a
  primeira palavra, agora "Imunidade a efeitos mentais e medo, Maior que
  a morte, Redução de dano 20")
- **Nomes truncados por preposição** reconstruídos ("Domínio sobre o
  Tempo", "Poder sobre a Realidade" em vez de só "Domínio"/"Poder")
- **Ações falsas** como `acao="Von CD 51 evita"` detectadas e revertidas
  para Passiva, com o texto empurrado de volta pra descrição
- **Sufixos CD/PM no nome** limpos ("Aura Aterradora Vontade CD 50
  evita" → nome "Aura Aterradora" com "(Vontade CD 50 evita)" na desc)
- **Habilidades-lore do livro** descartadas (insets tipo "Couro de
  Dragão" do Dragão-Rei, descrições de itens que viram pseudo-habilidade)
- **Thuwarokk**: contaminação de duas colunas do PDF (habilidades do
  Otyugh vazando) removida via override manual

### Correções mantidas das versões anteriores

- Perícias explícitas marcadas como treinadas com bônus ajustado
  conforme fórmula `atributo + treino(ND) + bonus = total`
- Magias de listas `•` vão para aba Magias, não Habilidades
- Habilidades-fantasma (nomes "No", "O", "Se", "Uma" etc.) mescladas
- Validação final impede items com `name=""` chegarem ao Foundry

### Como funciona

Usa o mesmo `parseStatblock()` da ficha de NPC + um pós-processador que
resolve ambiguidades do PDF. Resultado: ataques são items `arma` com
`ataqueNatural:true` e `ignoraAtributoDano:true`, habilidades viram
`habilidade`, magias tentam linkar com `tormenta20.magias` (fallback pra
magia em branco).

**Importante:** rode o `08-importar-TODAS-magias-F12.js` ANTES do
bestiário para que as magias dos conjuradores (Necromante, Capelão,
Dragão Adulto etc.) sejam linkadas ao compêndio em vez de criadas em
branco.

Idempotente — rodar duas vezes remove os Actors antigos e recria.

### Revisão manual ainda necessária

22 criaturas não tiveram ataques extraídos pelo parser (formato de
ataque exótico — swarms, multi-attack em tabela, avatares conjuradores
puros). Lista completa aparece no console do Foundry durante a
importação. Você pode abrir a ficha e adicionar os ataques na mão pela
aba Combate.
