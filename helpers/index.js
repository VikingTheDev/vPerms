const { permSetup } = require ("../src/config.perms.json")

module.exports = {
    buildPerms: function (userRoles) {
        let perms = { category: {}, subcategory: {}};
        for(const categories in permSetup) {
            for(const subcategories in permSetup[categories]) {
                if(typeof permSetup[categories][subcategories] === 'string') {
                    for (let i = 0; i < userRoles.length; i++) {
                        if (permSetup[categories][subcategories] == userRoles[i]) {
                            if(!perms[categories]) {
                                perms[categories] ={};
                            }
                            perms[categories][subcategories] = true;
                            perms.category[categories] = true;
                        }
                    }
                } else {
                    for(const roles in permSetup[categories][subcategories]) {
                        for (let i = 0; i < userRoles.length; i++) {
                            if (permSetup[categories][subcategories][roles] == userRoles[i]) {
                                if (!perms[categories]) {
                                    perms[categories] = {};
                                }
                                if(!perms[categories][subcategories]) {
                                    perms[categories][subcategories] = {};
                                }
                                perms[categories][subcategories][roles] = true;
                                perms.subcategory[subcategories] = true;
                                perms.category[categories] = true;
                            }
                        }
                    }
                }
            }
        }
        for(const categories in permSetup) {
            if(!perms[categories]) {
                perms[categories] = {};
            }
            for(const subcategories in permSetup[categories]) {
                if(typeof permSetup[categories][subcategories] === 'string') {
                    if(!perms[categories][subcategories]) {
                        perms[categories][subcategories] = false;
                    }
                    if(!perms.category[categories]) {
                        perms.category[categories] = false;
                    }
                } else {
                    for(const roles in permSetup[categories][subcategories]) {
                        if(!perms[categories][subcategories]) {
                            perms[categories][subcategories] = {};
                        }
                        if(!perms[categories][subcategories][roles]) {
                            perms[categories][subcategories][roles] = false;
                        }
                        if(!perms.category[categories]) {
                            perms.category[categories] = false;
                        }
                        if(!perms.subcategory[subcategories]) {
                            perms.subcategory[subcategories] = false;
                        }
                    }
                }
            }
        }
        return perms;
    },
    getIdentifiers: function (source) {
        let numOfIds = GetNumPlayerIdentifiers(source);
        if (numOfIds != 0) {
            let identifiers = {};
            for (let i = 0; i < numOfIds; i++) {
                let a = GetPlayerIdentifier(source, i);
                let b = a.toString().split(':');
                let name = b[0];
                identifiers[name] = b[1];
            }   
            return identifiers;
        } else {
            return false;
        }
    }
}