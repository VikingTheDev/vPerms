const { buildPerms, getIdentifiers } = require("./helpers/index.js")

let playerPerms = new Map();

function getPerms (source, cb) {
    const ids = getIdentifiers(source);
    if (ids.discord) {
        exports.vConnect.getUserData(ids.discord, data => {
            const perms = buildPerms(data.roles);
            playerPerms.set(source, perms);
            cb(perms);
        });
    } else {
        const perms = buildPerms();
        playerPerms.set(source, perms);
        cb(perms);
    }
}

RegisterCommand('perms', (source) => {
    const src = source;
    getPerms(src, (perms) => {
        emitNet('vPerms:setPerms', src, perms);
    })
})

onNet('vPerms:playerSpawned', () => {
    const src = source;
    getPerms(src, (perms) => {
        emitNet('vPerms:setPerms', src, perms);
    });
});
  
onNet('vPerms:getPerms', (source, cb) => {
    getPerms(source, perms => {
        cb(perms);
    })
})
  
on('vConnect:guildMemberUpdate', ({ id }) => {
    playerPerms.forEach((v, k) => {
        const identifiers = getIdentifiers(k);
        if (identifiers.discord == id) {
            getPerms(k, (perms) => {
                emitNet('vPerms:setPerms', k, perms);
            });
        }
    });
});
  
on('playerDropped', () => {
    delete playerPerms[source];
});
  
exports('getPlayerPerms', (id) => {
    return playerPerms.get(id);
});