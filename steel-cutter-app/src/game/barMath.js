export function getUsed(assigns, barRem, sw) {
  let u = 0;
  for (let i = 0; i < assigns.length; i++) {
    u += assigns[i].length;
    if (!(i === assigns.length - 1 && barRem - u === 0)) u += sw;
  }
  return u;
}

export function getUsedForAdd(assigns, sw) {
  return assigns.reduce((s, a) => s + a.length + sw, 0);
}

export function canFitPiece(assigns, newLen, barRem, sw) {
  return newLen <= barRem - getUsedForAdd(assigns, sw);
}
