// ╔═══════════════════════════════════════════════════════════════╗
// ║ TORMENTA 20 — Limpar Classes Variantes do Compêndio            ║
// ║ (Só execute se você rodou o 17-importar-classes-variantes      ║
// ║  de uma versão anterior e quer remover as entradas avulsas.)   ║
// ║                                                                ║
// ║ As 14 variantes de Heróis de Arton agora são SUBCLASSES das    ║
// ║ classes-base, não entradas próprias no compêndio. Este script  ║
// ║ remove do pack `tormenta20.classes` os documentos cujos nomes  ║
// ║ batem com variantes.                                           ║
// ╚═══════════════════════════════════════════════════════════════╝

const PACK_NAME = "tormenta20.classes";
const VARIANT_NAMES = [
  "Alquimista", "Atleta", "Burguês", "Duelista", "Ermitão", "Inovador",
  "Machado de Pedra", "Magimarcialista", "Necromante", "Santo", "Seteiro",
  "Usurpador", "Vassalo", "Ventanista"
];

async function limparVariantes() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) {
    ui.notifications.error(`Pack ${PACK_NAME} não encontrado!`);
    return;
  }

  const wasLocked = pack.locked;
  if (wasLocked) await pack.configure({ locked: false });

  let removidos = 0;
  for (const name of VARIANT_NAMES) {
    const entry = pack.index.find(e => e.name === name);
    if (entry) {
      const doc = await pack.getDocument(entry._id);
      await doc.delete();
      removidos++;
      console.log(`[T20] Removido do compêndio: ${name}`);
    }
  }

  if (wasLocked) await pack.configure({ locked: true });

  if (removidos === 0) {
    ui.notifications.info(`Nenhuma variante encontrada no compêndio — já está limpo.`);
  } else {
    ui.notifications.info(`${removidos} variante(s) removida(s) do compêndio de classes. As variantes agora vivem como subclasses das classes-base.`);
  }
}

limparVariantes();
