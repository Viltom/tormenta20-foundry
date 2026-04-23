// ========================================================
// T20 — Condições (Status Effects)
//
// Registra as 34 condições do Tormenta 20 como status effects
// oficiais do Foundry (CONFIG.statusEffects). Os ícones aparecem:
//   • No HUD do token (clique direito no token)
//   • Sobre o token na cena
//   • Na lista do Combat Tracker
//
// SINCRONIZAÇÃO BIDIRECIONAL:
//   1. Checkbox na ficha → system.condicoes.X muda → aplica/remove
//      o status effect no ator → token exibe ícone.
//   2. Jogador clica ícone no HUD do token → Foundry aplica/remove
//      ActiveEffect com `statuses: [id]` → nós refletimos de volta
//      para system.condicoes.X → ficha re-renderiza.
//
// A mecânica numérica (-2 em perícias etc.) continua centralizada
// em T20Actor.prepareDerivedData (que lê system.condicoes.X). Os
// ActiveEffects criados aqui NÃO têm `changes` — são apenas
// marcadores visuais. Isso evita dupla aplicação de modificadores.
// ========================================================

/**
 * Mapa canônico: chave em `system.condicoes.<key>`  →  definição do status.
 *
 * O `id` é usado pelo Foundry (`actor.statuses` é um Set de ids) e deve
 * ser estável e único. Usamos prefixo "t20-" para evitar colisão com
 * qualquer status core do Foundry.
 *
 * O `icon` usa caminhos nativos `icons/svg/*` que sempre existem na
 * build do Foundry — sem dependências externas.
 */
export const T20_CONDITIONS = [
  { key: "abalado",       id: "t20-abalado",       label: "Abalado",       icon: "icons/svg/terror.svg" },
  { key: "agarrado",      id: "t20-agarrado",      label: "Agarrado",      icon: "icons/svg/net.svg" },
  { key: "alquebrado",    id: "t20-alquebrado",    label: "Alquebrado",    icon: "icons/svg/degen.svg" },
  { key: "apavorado",     id: "t20-apavorado",     label: "Apavorado",     icon: "icons/svg/terror.svg" },
  { key: "atordoado",     id: "t20-atordoado",     label: "Atordoado",     icon: "icons/svg/daze.svg" },
  { key: "caido",         id: "t20-caido",         label: "Caído",         icon: "icons/svg/falling.svg" },
  { key: "cego",          id: "t20-cego",          label: "Cego",          icon: "icons/svg/blind.svg" },
  { key: "confuso",       id: "t20-confuso",       label: "Confuso",       icon: "icons/svg/stoned.svg" },
  { key: "debilitado",    id: "t20-debilitado",    label: "Debilitado",    icon: "icons/svg/downgrade.svg" },
  { key: "desprevenido",  id: "t20-desprevenido",  label: "Desprevenido",  icon: "icons/svg/target.svg" },
  { key: "doente",        id: "t20-doente",        label: "Doente",        icon: "icons/svg/biohazard.svg" },
  { key: "emChamas",      id: "t20-em-chamas",     label: "Em Chamas",     icon: "icons/svg/fire.svg" },
  { key: "enfeiticado",   id: "t20-enfeiticado",   label: "Enfeitiçado",   icon: "icons/svg/aura.svg" },
  { key: "enjoado",       id: "t20-enjoado",       label: "Enjoado",       icon: "icons/svg/acid.svg" },
  { key: "enredado",      id: "t20-enredado",      label: "Enredado",      icon: "icons/svg/net.svg" },
  { key: "envenenado",    id: "t20-envenenado",    label: "Envenenado",    icon: "icons/svg/poison.svg" },
  { key: "esmorecido",    id: "t20-esmorecido",    label: "Esmorecido",    icon: "icons/svg/downgrade.svg" },
  { key: "exausto",       id: "t20-exausto",       label: "Exausto",       icon: "icons/svg/unconscious.svg" },
  { key: "fascinado",     id: "t20-fascinado",     label: "Fascinado",     icon: "icons/svg/eye.svg" },
  { key: "fatigado",      id: "t20-fatigado",      label: "Fatigado",      icon: "icons/svg/sleep.svg" },
  { key: "fraco",         id: "t20-fraco",         label: "Fraco",         icon: "icons/svg/down.svg" },
  { key: "frustrado",     id: "t20-frustrado",     label: "Frustrado",     icon: "icons/svg/down.svg" },
  { key: "imovel",        id: "t20-imovel",        label: "Imóvel",        icon: "icons/svg/mountain.svg" },
  { key: "inconsciente",  id: "t20-inconsciente",  label: "Inconsciente",  icon: "icons/svg/unconscious.svg" },
  { key: "indefeso",      id: "t20-indefeso",      label: "Indefeso",      icon: "icons/svg/skull.svg" },
  { key: "lento",         id: "t20-lento",         label: "Lento",         icon: "icons/svg/clockwork.svg" },
  { key: "ofuscado",      id: "t20-ofuscado",      label: "Ofuscado",      icon: "icons/svg/sun.svg" },
  { key: "paralizado",    id: "t20-paralizado",    label: "Paralizado",    icon: "icons/svg/paralysis.svg" },
  { key: "pasmo",         id: "t20-pasmo",         label: "Pasmo",         icon: "icons/svg/daze.svg" },
  { key: "petrificacao",  id: "t20-petrificacao",  label: "Petrificação",  icon: "icons/svg/statue.svg" },
  { key: "sangrando",     id: "t20-sangrando",     label: "Sangrando",     icon: "icons/svg/blood.svg" },
  { key: "surdo",         id: "t20-surdo",         label: "Surdo",         icon: "icons/svg/deaf.svg" },
  { key: "surpreendido",  id: "t20-surpreendido",  label: "Surpreendido",  icon: "icons/svg/stoned.svg" },
  { key: "vulneravel",    id: "t20-vulneravel",    label: "Vulnerável",    icon: "icons/svg/shield-slash.svg" },
];

/** Lookup rápido: key do system → entrada. */
const KEY_TO_COND = Object.fromEntries(T20_CONDITIONS.map(c => [c.key, c]));
/** Lookup rápido: id do status → entrada. */
const ID_TO_COND = Object.fromEntries(T20_CONDITIONS.map(c => [c.id, c]));

/** Set de ids pra checagem rápida "é uma condição T20?" */
const T20_STATUS_IDS = new Set(T20_CONDITIONS.map(c => c.id));

/**
 * Chamado no init hook — substitui CONFIG.statusEffects pelas condições T20.
 * Mantemos apenas "dead" do core (útil p/ marcar morto/derrotado no Combat Tracker).
 */
export function registerT20StatusEffects() {
  // Preserva "dead" do core (usado pelo Combat Tracker e HUD de token).
  const coreDead = (CONFIG.statusEffects ?? []).find(s => s.id === "dead");

  CONFIG.statusEffects = [
    ...(coreDead ? [coreDead] : [{
      id: "dead",
      name: "EFFECT.StatusDead",
      img: "icons/svg/skull.svg",
    }]),
    ...T20_CONDITIONS.map(c => ({
      id: c.id,
      name: `T20 — ${c.label}`,
      img: c.icon,
    })),
  ];

  // Status da "morte" também usado quando PV = 0
  CONFIG.specialStatusEffects = CONFIG.specialStatusEffects ?? {};
  CONFIG.specialStatusEffects.DEFEATED = "dead";

  console.log(`T20 | ${T20_CONDITIONS.length} condições registradas como status effects.`);
}

/**
 * Sincronização: ficha → token.
 *
 * Quando o usuário marca/desmarca o checkbox na aba "Condições" da ficha,
 * `system.condicoes.<key>` muda. Disparamos isso via hook `updateActor` e
 * aplicamos/removemos o status effect correspondente, o que faz o Foundry
 * renderizar/remover o ícone no token automaticamente.
 *
 * `options._t20SyncingCondition` evita loop infinito com o hook
 * `applyActiveEffect` abaixo.
 */
async function _onUpdateActor(actor, changes, options, userId) {
  // Só o usuário que fez a mudança sincroniza (evita N clientes fazendo o mesmo update).
  if (game.userId !== userId) return;
  if (options?._t20SyncingCondition) return;
  const condicoesChange = changes?.system?.condicoes;
  if (!condicoesChange || typeof condicoesChange !== "object") return;

  // Para cada condição que MUDOU neste update, sincroniza o status effect.
  for (const [key, newValue] of Object.entries(condicoesChange)) {
    const cond = KEY_TO_COND[key];
    if (!cond) continue;

    const shouldBeActive = !!newValue;
    const isActive = actor.statuses?.has(cond.id) ?? false;
    if (shouldBeActive === isActive) continue;

    try {
      // `toggleStatusEffect` existe em v11+. Sinaliza via options q foi uma
      // sincronização nossa, pra o hook create/delete não ecoar de volta.
      await actor.toggleStatusEffect(cond.id, {
        active: shouldBeActive,
        overlay: false,
      });
    } catch (err) {
      console.error(`T20 | Erro sincronizando condição ${cond.id}:`, err);
    }
  }
}

/**
 * Sincronização: token → ficha.
 *
 * Quando o GM/jogador clica num ícone no HUD do token, o Foundry cria/remove
 * um ActiveEffect com `statuses: [id]`. Interceptamos via hooks
 * `createActiveEffect` e `deleteActiveEffect` pra refletir o estado de volta
 * em `system.condicoes.<key>`, de modo que o checkbox na ficha também se atualize.
 *
 * Usamos o flag `_t20SyncingCondition` no update pra o hook `updateActor`
 * acima não tentar recriar o effect que acabou de ser criado/removido.
 */
async function _onActiveEffectChange(effect, options, userId, active) {
  if (game.userId !== userId) return;
  const actor = effect.parent;
  if (!(actor instanceof Actor)) return;

  // Descobre se o effect representa uma das nossas condições T20.
  // `effect.statuses` é um Set; pegamos o primeiro id que seja nossa.
  const statuses = effect.statuses ?? new Set();
  for (const id of statuses) {
    const cond = ID_TO_COND[id];
    if (!cond) continue;

    // Valor atual no sistema. Se bater com o estado do effect, nada a fazer.
    const current = !!foundry.utils.getProperty(actor, `system.condicoes.${cond.key}`);
    if (current === active) continue;

    try {
      await actor.update(
        { [`system.condicoes.${cond.key}`]: active },
        { _t20SyncingCondition: true },
      );
    } catch (err) {
      console.error(`T20 | Erro sincronizando effect ${cond.id} → ficha:`, err);
    }
  }
}

/**
 * Registra os hooks de sincronização. Chamar no hook `ready`.
 */
export function registerT20ConditionHooks() {
  Hooks.on("updateActor", _onUpdateActor);

  Hooks.on("createActiveEffect", (effect, options, userId) =>
    _onActiveEffectChange(effect, options, userId, true));

  Hooks.on("deleteActiveEffect", (effect, options, userId) =>
    _onActiveEffectChange(effect, options, userId, false));

  console.log("T20 | Hooks de sincronização de condições registrados.");
}

/**
 * Utilitário opcional para macros: dado um ator, garante que
 * TODOS os status effects visuais batam com o estado em system.condicoes.
 * Útil pra "reparar" atores legados que já tinham condições marcadas antes
 * desta atualização.
 *
 * Uso em macro:
 *   await game.tormenta20.syncAllConditions(actor)
 */
export async function syncAllConditionsToTokens(actor) {
  if (!actor) return;
  for (const cond of T20_CONDITIONS) {
    const shouldBeActive = !!foundry.utils.getProperty(actor, `system.condicoes.${cond.key}`);
    const isActive = actor.statuses?.has(cond.id) ?? false;
    if (shouldBeActive === isActive) continue;
    try {
      await actor.toggleStatusEffect(cond.id, {
        active: shouldBeActive,
        overlay: false,
      });
    } catch (err) {
      console.error(`T20 | Erro em syncAllConditionsToTokens para ${cond.id}:`, err);
    }
  }
  ui.notifications.info(`Condições sincronizadas em ${actor.name}.`);
}
