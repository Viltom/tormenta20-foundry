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
