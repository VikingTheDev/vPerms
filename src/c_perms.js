let firstSpawn = true;

on('playerSpawned', () => {
  if (firstSpawn) {
    emitNet('vPerms:playerSpawned');
  }
  firstSpawn = false;
});
