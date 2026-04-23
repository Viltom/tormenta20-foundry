# Changelog — Tormenta 20 Foundry VTT

## 0.8.0 — Integração de Combate + Condições Visuais + Magias por Nível

### 🎯 Iniciativa integrada ao Combat Tracker

- Registra `CONFIG.Combat.initiative.formula = "1d20 + @pericias.iniciativa.total"`
  no `init` hook. O botão `⟳ Roll All` / `Roll NPCs` do Combat Tracker passa
  a usar a perícia Iniciativa do T20 (mod Des + treino + bônus + globais)
  em vez do fallback genérico `1d20`.
- O botão **🎯 Rolar Iniciativa** da ficha (PJ e NPC) detecta se o ator está
  em `game.combat` e, nesse caso, preenche a coluna de iniciativa no tracker
  via `Combat#rollInitiative`. Fora de combate, mantém o comportamento
  antigo de rolar pro chat.
- Novo módulo: `module/combat.mjs` com `registerT20Initiative()` e
  `rollT20Initiative(actor, { reroll })`. Exposto em
  `game.tormenta20.rollInitiative`.

### 🎴 Condições como Status Effects (ícones no token + HUD + Combat Tracker)

- Novo módulo: `module/conditions.mjs` com as 34 condições T20 como
  `CONFIG.statusEffects`. Ícones usam exclusivamente caminhos nativos
  `icons/svg/*` — zero dependência externa.
- Ícones aparecem no token em cena, no HUD do token (clique direito) e na
  lista do Combat Tracker.
- Sincronização bidirecional checkbox-ficha ↔ ícone-token via hooks
  `updateActor` / `createActiveEffect` / `deleteActiveEffect`. Flag
  `_t20SyncingCondition` nas options previne loop.
- **Sem dupla aplicação de modificadores**: os `ActiveEffect` criados
  pelas condições T20 não têm `changes` — são marcadores visuais. A
  matemática (-2 em perícias, -5 em atributos etc.) continua em
  `T20Actor.prepareDerivedData` lendo `system.condicoes.<key>`.
- Novo utilitário: `game.tormenta20.syncAllConditions(actor)` para
  propagar condições de personagens legados para os tokens sem precisar
  re-marcar checkboxes.

### 📖 Magias conhecidas por nível nas classes conjuradoras

As 6 classes conjuradoras (Arcanista, Bardo, Clérigo, Druida, Frade,
Místico) agora descrevem explicitamente a progressão de magias:

| Classe      | 1º nível | Progressão                             | Círculo máx. |
|-------------|----------|----------------------------------------|--------------|
| Arcanista   | 3        | +1/nv (Feiticeiro: só ímpares)         | 5º (17º nv)  |
| Bardo       | 2        | +1 por nível PAR                       | 4º (14º nv)  |
| Clérigo     | 3        | +1/nv                                  | 5º (17º nv)  |
| Druida      | 2        | +1 por nível PAR                       | 4º (14º nv)  |
| Frade       | 3        | +1/nv                                  | 5º (17º nv)  |
| Místico     | 3        | +1/nv                                  | 4º (14º nv)  |

**Arquivos atualizados:**
- `scripts/10-importar-classes.js` (Arcanista, Bardo, Clérigo, Druida)
- `scripts/14-importar-classes-extras.js` (Frade, Místico)
- `scripts/23-atualizar-magias-classes.js` **(novo)** — atualiza só as
  descrições no compêndio existente, idempotente. Útil para quem já tem
  o compêndio importado.

### 🔧 Arquivos modificados

- `system.json` — versão bumped para 0.8.0
- `tormenta20.mjs` — imports dos novos módulos, chamadas nos hooks `init`
  e `ready`, APIs novas em `game.tormenta20`
- `module/actor/actor-sheet.mjs` — `_onRollIniciativa` delega a
  `rollT20Initiative`
- `module/actor/npc-sheet.mjs` — idem
- `scripts/LEIA-ME.md` — seção nova v0.8.0

### 🐛 Problemas resolvidos

Reportados em testes de comunidade na v0.7.4:

1. ❌ "A iniciativa rolada na ficha não interage com a aba de Combat
   Encounters, nem a aba com a ficha" → ✅ resolvido com
   `CONFIG.Combat.initiative` + `rollT20Initiative` delegando ao tracker.
2. ❌ "As condições funcionam na ficha mas não têm indicação visual
   no token nem no combat tracker" → ✅ resolvido com
   `CONFIG.statusEffects` + sync bidirecional.
3. ❌ "Não está discriminado em lugar algum quantas magias as classes
   conjuradoras podem pegar no 1º nível e nos subsequentes" → ✅
   resolvido com descrições expandidas das 6 classes conjuradoras
   (seção "MAGIAS CONHECIDAS" em cada uma).

---

## 0.7.x — Multiclasse, Variantes como Subclasses, Firelink

(Histórico anterior preservado em `scripts/LEIA-ME.md`.)
