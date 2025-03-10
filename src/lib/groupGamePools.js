export function groupGamePools(gamePools) {
  const type = [{ Free: [] }, { H2H: [] }, { VIP: [] }];
  type.forEach((e) => {
    gamePools.forEach((gamePool) => {
      if (gamePool.type === Object.keys(e)[0]) {
        e[Object.keys(e)[0]].push(gamePool);
      }
    });
  });
  type.forEach((e) => {
    e[Object.keys(e)[0]].sort((a, b) => parseInt(a.entryFee) - parseInt(b.entryFee));
  });
  return type;
}

// { Mega: [] }
