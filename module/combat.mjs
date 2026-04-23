// ========================================================
// T20 — Integração com Combat Tracker
//
// Configura a iniciativa do Foundry pra usar a perícia "Iniciativa"
// do Tormenta 20. A partir daí:
//   • O botão ⟳ (Roll Initiative) no Combat Tracker rola 1d20 + iniciativa
//     e preenche a coluna de iniciativa automaticamente.
//   • Arrastar um token pra o tracker usa a fórmula correta.
//   • O botão de "Rolar Iniciativa" na ficha (quando o ator está em combate)
//     também atualiza o tracker.
//
// FÓRMULA T20:
//   1d20 + iniciativa.total  (onde `total` = mod Des + treino + bônus)
//
// A perícia `iniciativa` já existe em system.pericias.iniciativa do
// template.json (PJ e NPC) — sem mudança de schema necessária.
// ========================================================

/**
 * Registra a fórmula de iniciativa no init hook. Isso faz o botão
 * "Roll Initiative" padrão do Combat Tracker rolar com a perícia T20.
 *
 * `getRollData()` em T20Actor já expõe `pericias.iniciativa.total`, então
 * a fórmula `@pericias.iniciativa.total` resolve corretamente.
 */
export function registerT20Initiative() {
  CONFIG.Combat.initiative = {
    formula: "1d20 + @pericias.iniciativa.total",
    decimals: 2,
  };
  console.log("T20 | Iniciativa do Combat Tracker configurada: 1d20 + iniciativa.total");
}

/**
 * Rola iniciativa do ator direto pro Combat Tracker (se o ator estiver em
 * combate) OU pro chat caso contrário. Usado pelos botões "Rolar Iniciativa"
 * na ficha e na npc-sheet.
 *
 * Vantagens em relação a só rolar pro chat:
 *   • Se o ator estiver em combate, o valor rolado aparece no tracker.
 *   • Usa o pipeline padrão do Foundry (Actor#rollInitiative), que dispara
 *     os hooks certos pra módulos como Combat Carousel, PopOut!, etc.
 *
 * @param {T20Actor} actor
 * @param {object} [opts]
 * @param {boolean} [opts.reroll=false]  Se true, re-rola mesmo se o combatant já tiver iniciativa.
 */
export async function rollT20Initiative(actor, { reroll = false } = {}) {
  if (!actor) return null;

  // Tenta achar combatant(s) deste ator no combate ativo.
  const combat = game.combat;
  const combatants = combat
    ? combat.combatants.filter(c => c.actor?.id === actor.id)
    : [];

  if (combatants.length > 0) {
    // Rola direto no tracker — o próprio Foundry usa a fórmula de
    // CONFIG.Combat.initiative (que configuramos acima).
    const ids = combatants.map(c => c.id);
    await combat.rollInitiative(ids, {
      rollMode: game.settings.get("core", "rollMode"),
      updateTurn: false,
    });
    return combat;
  }

  // Sem combate ativo — rola só pro chat, comportamento antigo.
  const total = actor.system?.pericias?.iniciativa?.total ?? 0;
  const roll = new Roll("1d20 + @t", { t: total });
  await roll.evaluate();
  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `<strong>Iniciativa</strong> (${total >= 0 ? "+" : ""}${total})`,
  });
  return roll;
}
