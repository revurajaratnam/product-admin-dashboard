const KEY = "pad_overlay";

function readOverlay() {
  if (typeof window === "undefined") {
    return { added: [], edited: {}, deleted: [] };
  }
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { added: [], edited: {}, deleted: [] };
    const parsed = JSON.parse(raw);
    return {
      added: parsed.added || [],
      edited: parsed.edited || {},
      deleted: parsed.deleted || [],
    };
  } catch {
    return { added: [], edited: {}, deleted: [] };
  }
}

function writeOverlay(overlay) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(overlay));
}

export function recordAdded(product) {
  const overlay = readOverlay();
  const localId = Date.now();
  const withId = { ...product, id: localId, __local: true };
  overlay.added = [withId, ...overlay.added];
  writeOverlay(overlay);
  return withId;
}

export function recordEdited(id, patch) {
  const overlay = readOverlay();
  overlay.edited = { ...overlay.edited, [id]: { ...overlay.edited[id], ...patch, id } };
  overlay.added = overlay.added.map((p) =>
    String(p.id) === String(id) ? { ...p, ...patch } : p
  );
  writeOverlay(overlay);
}

export function recordDeleted(id) {
  const overlay = readOverlay();
  if (!overlay.deleted.includes(id)) overlay.deleted = [...overlay.deleted, id];
  overlay.added = overlay.added.filter((p) => String(p.id) !== String(id));
  writeOverlay(overlay);
}

function applyEditsAndFilterDeleted(products, overlay) {
  return products
    .filter((p) => !overlay.deleted.some((id) => String(id) === String(p.id)))
    .map((p) => (overlay.edited[p.id] ? { ...p, ...overlay.edited[p.id] } : p));
}

export function applyOverlayToList(apiResult, { skip }) {
  const overlay = readOverlay();
  let products = applyEditsAndFilterDeleted(apiResult.products, overlay);
  let total = apiResult.total;

  const removedCount = apiResult.products.length - products.length;
  total = Math.max(0, total - removedCount);

  if (skip === 0 && overlay.added.length > 0) {
    products = [...overlay.added, ...products];
    total += overlay.added.length;
  }

  return { ...apiResult, products, total };
}

export function applyOverlayToProduct(product) {
  if (!product) return product;
  const overlay = readOverlay();
  if (overlay.deleted.some((id) => String(id) === String(product.id))) return null;
  return overlay.edited[product.id] ? { ...product, ...overlay.edited[product.id] } : product;
}

export function findLocalProduct(id) {
  const overlay = readOverlay();
  return overlay.added.find((p) => String(p.id) === String(id)) || null;
}
