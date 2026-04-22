// ================================================================
// 12-popular-dano-magias.js
// Macro para Foundry VTT — Execute no console (F12) ou como Macro
//
// Popula os campos "dano" e "tipoDano" em todas as magias do
// compêndio tormenta20.magias que causam dano, conforme o livro
// T20 Jogo do Ano.
//
// INSTRUÇÕES:
// 1. Abra o Foundry e vá para F12 → Console
// 2. Cole todo este script e pressione Enter
// 3. Aguarde as notificações de progresso
// ================================================================

(async () => {
  // ── Mapa: nome da magia → { dano, tipoDano } ──
  // Valores são o dano BASE da magia (sem aprimoramentos)
  const SPELL_DAMAGE = {
    // ═══ 1º CÍRCULO ═══
    "Adaga Mental":           { dano: "2d6",       tipoDano: "psíquico" },
    "Arma Espiritual":        { dano: "2d6+2",     tipoDano: "essência" },
    "Despedaçar":             { dano: "1d8+1",     tipoDano: "impacto" },
    "Explosão de Chamas":     { dano: "2d6",       tipoDano: "fogo" },
    "Infligir Ferimentos":    { dano: "2d8+2",     tipoDano: "trevas" },
    "Seta Infalível de Talude": { dano: "2d4+2",   tipoDano: "essência" },
    "Toque Chocante":         { dano: "2d8+2",     tipoDano: "eletricidade" },
    "Curar Ferimentos":       { dano: "2d8+2",     tipoDano: "" },  // cura, não dano

    // ═══ 2º CÍRCULO ═══
    "Bola de Fogo":           { dano: "6d6",       tipoDano: "fogo" },
    "Crânio Voador de Vladislav": { dano: "4d8+4", tipoDano: "trevas" },
    "Flecha Ácida":           { dano: "4d6",       tipoDano: "ácido" },
    "Miasma Mefítico":        { dano: "4d6",       tipoDano: "ácido" },
    "Raio Solar":             { dano: "4d8",       tipoDano: "luz" },
    "Relâmpago":              { dano: "6d6",       tipoDano: "eletricidade" },
    "Soco de Arsenal":        { dano: "4d6",       tipoDano: "impacto" },
    "Sopro das Uivantes":     { dano: "4d6",       tipoDano: "frio" },
    "Toque Vampírico":        { dano: "6d6",       tipoDano: "trevas" },
    "Enxame de Pestes":       { dano: "2d12",      tipoDano: "corte" },
    "Tempestade Divina":      { dano: "2d6",       tipoDano: "eletricidade" },

    // ═══ 3º CÍRCULO ═══
    "Coluna de Chamas":       { dano: "6d6+6d6",   tipoDano: "fogo" },
    "Enxame Rubro de Ichabod": { dano: "4d12",     tipoDano: "ácido" },
    "Erupção Glacial":        { dano: "4d6+4d6",   tipoDano: "frio" },
    "Ferver Sangue":          { dano: "4d8",       tipoDano: "fogo" },
    "Lança Ígnea de Aleph":   { dano: "4d6+4d6",   tipoDano: "fogo" },
    "Muralha Elemental":      { dano: "4d6",       tipoDano: "fogo" },
    "Poeira da Podridão":     { dano: "4d6",       tipoDano: "trevas" },
    "Sopro da Salvação":      { dano: "2d8+4",     tipoDano: "" },  // cura

    // ═══ 4º CÍRCULO ═══
    "Cólera de Azgher":       { dano: "10d6",      tipoDano: "fogo" },
    "Desintegrar":            { dano: "10d12",     tipoDano: "essência" },
    "Furacão":                { dano: "10d6",      tipoDano: "impacto" },
    "Raio Polar":             { dano: "10d8",      tipoDano: "frio" },
    "Relâmpago Flamejante de Thundar": { dano: "6d6+6d6", tipoDano: "eletricidade" },
    "Círculo da Restauração": { dano: "3d8+3",     tipoDano: "" },  // cura

    // ═══ 5º CÍRCULO ═══
    "Barragem Elemental de Vectorius": { dano: "6d6", tipoDano: "essência" },
    "Chuva de Meteoros":      { dano: "15d6+15d6", tipoDano: "fogo" },
    "Toque da Morte":         { dano: "10d8+10",   tipoDano: "trevas" },
    "Destruição":             { dano: "15d6",      tipoDano: "essência" },
    "Terremoto":              { dano: "12d6",      tipoDano: "impacto" },
    "Segunda Chance":         { dano: "200",       tipoDano: "" },  // cura 200 PV
    "Buraco Negro":           { dano: "",          tipoDano: "" },  // sem dano direto
  };

  // ── Desbloquear e atualizar compêndio ──
  const packId = "tormenta20.magias";
  const pack = game.packs.get(packId);
  if (!pack) {
    ui.notifications.error("Compêndio tormenta20.magias não encontrado!");
    return;
  }

  // Desbloquear
  await pack.configure({ locked: false });
  ui.notifications.info("Compêndio desbloqueado. Processando magias...");

  const documents = await pack.getDocuments();
  let updated = 0;
  let skipped = 0;

  for (const doc of documents) {
    const data = SPELL_DAMAGE[doc.name];
    if (data) {
      await doc.update({
        "system.dano": data.dano,
        "system.tipoDano": data.tipoDano,
      });
      updated++;
      console.log(`T20 | ✓ ${doc.name} → dano: ${data.dano} (${data.tipoDano || "—"})`);
    } else {
      skipped++;
    }
  }

  // Rebloquear
  await pack.configure({ locked: true });

  ui.notifications.info(
    `Dano populado em ${updated} magias (${skipped} sem dano definido). Compêndio rebloqueado.`
  );
  console.log(`T20 | Concluído: ${updated} atualizadas, ${skipped} sem dano no mapa.`);
})();
