//collect gacha units
//multiple of the same unit can be prestiged
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
//constants
var frontLineChanceMultiplier = 1.5;
var tickRate = 1000;
//tracking
var frontTargets = 0;
var backTargets = 0;
var isFighting = false;
function determineTarget(team) {
    var aliveUnits = getTeamUnits(team, true);
    var backlineChance = 0;
    var frontlineChance = 0;
    aliveUnits.forEach(function (item) {
        if (item.state.isFrontline) {
            frontlineChance += frontLineChanceMultiplier;
        }
        else {
            backlineChance += 1;
        }
    });
    //Roll a number between 0 and the 2 chances put together
    //if the number is higher than the frontlinechance number, then it hits the backline
    var randomIndex = Math.random() * (frontlineChance + backlineChance);
    if (randomIndex <= frontlineChance) {
        frontTargets++;
        var units = getLineUnits(team.frontline, true);
        var randomIndex_1 = Math.floor(Math.random() * units.length);
        return units[randomIndex_1];
    }
    else {
        backTargets++;
        var units = getLineUnits(team.backline, true);
        var randomIndex_2 = Math.floor(Math.random() * units.length);
        return units[randomIndex_2];
    }
}
function attack(unit, enemyTeam, fight) {
    if (!fight.isOver) {
        var target = determineTarget(enemyTeam);
        if (target) {
            var damage = unit.stats.attack - target.stats.guard;
            console.info("".concat(unit.name, " is targeting ").concat(target.name, " for ").concat(unit.stats.attack, " atk, being blocked by ").concat(target.stats.guard, " guard, resulting in ").concat(damage, " damage"));
            if (damage > 0) {
                target.stats.health -= damage;
            }
        }
        checkState(fight);
    }
}
function getFightUnits(fight) {
    var units = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], fight.friendlyTeam.backline, true), fight.friendlyTeam.frontline, true), fight.enemyTeam.backline, true), fight.enemyTeam.frontline, true);
    return units;
}
function getTeamUnits(team, onlyAlive) {
    if (onlyAlive === void 0) { onlyAlive = false; }
    var units = __spreadArray(__spreadArray([], team.backline, true), team.frontline, true);
    if (onlyAlive) {
        units = units.filter(function (item) {
            return !item.state.isDead;
        });
    }
    return units;
}
function getLineUnits(line, onlyAlive) {
    if (onlyAlive === void 0) { onlyAlive = false; }
    var units = __spreadArray([], line, true);
    if (onlyAlive) {
        units = units.filter(function (item) {
            return !item.state.isDead;
        });
    }
    return units;
}
function checkState(fight) {
    var units = getFightUnits(fight);
    units.forEach(function (item) {
        if (item.stats.health < 0 && !item.state.isDead) {
            item.state.isDead = true;
            console.info(item.name + ' has died');
        }
    });
    var friendlyAlive = getTeamUnits(fight.friendlyTeam, true);
    console.debug(friendlyAlive);
    if (!friendlyAlive || friendlyAlive.length < 1) {
        console.info('all friendly units are dead');
        fight.isOver = true;
        fight.friendlyWon = false;
        stopFight();
    }
    var enemyAlive = getTeamUnits(fight.enemyTeam, true);
    console.debug(enemyAlive);
    if (!enemyAlive || enemyAlive.length < 1) {
        console.info('all enemy units are dead');
        fight.isOver = true;
        fight.friendlyWon = true;
        stopFight();
    }
}
function fightSetup(fight) {
    fight.friendlyTeam.frontline.forEach(function (item) {
        item.stats = __assign({}, item.baseStats);
        item.state = { isDead: false, isFriendly: true, isFrontline: true };
    });
    fight.friendlyTeam.backline.forEach(function (item) {
        item.stats = __assign({}, item.baseStats);
        item.state = { isDead: false, isFriendly: true, isFrontline: false };
    });
    fight.enemyTeam.frontline.forEach(function (item) {
        item.stats = __assign({}, item.baseStats);
        item.state = { isDead: false, isFriendly: false, isFrontline: true };
    });
    fight.enemyTeam.backline.forEach(function (item) {
        item.stats = __assign({}, item.baseStats);
        item.state = { isDead: false, isFriendly: false, isFrontline: false };
    });
    fight.friendlyWon = undefined;
    fight.isOver = false;
}
function processTick(fight) {
    console.info('tick');
    // attack in order of speed
    fight.friendlyTeam.frontline.forEach(function (item) {
        if (!item.state.isDead) {
            attack(item, enemyTeam, fight);
        }
    });
    fight.friendlyTeam.backline.forEach(function (item) {
        if (!item.state.isDead) {
            attack(item, enemyTeam, fight);
        }
    });
    fight.enemyTeam.frontline.forEach(function (item) {
        if (!item.state.isDead) {
            attack(item, friendlyTeam, fight);
        }
    });
    fight.enemyTeam.backline.forEach(function (item) {
        if (!item.state.isDead) {
            attack(item, friendlyTeam, fight);
        }
    });
    console.debug('friendly', fight.friendlyTeam);
    console.debug('enemy', fight.enemyTeam);
    if (fight.isOver) {
        console.info(fight.friendlyWon ? 'Fight won' : 'Fight lost');
    }
}
var friendlyTeam = { frontline: [__assign({}, units[0]), __assign({}, units[1]), __assign({}, units[2])], backline: [__assign({}, units[3]), __assign({}, units[4]), __assign({}, units[5])] };
var enemyTeam = { frontline: [__assign({}, units[6]), __assign({}, units[6]), __assign({}, units[6])], backline: [__assign({}, units[6]), __assign({}, units[6]), __assign({}, units[6])] };
var fight = { friendlyTeam: friendlyTeam, enemyTeam: enemyTeam };
fightSetup(fight);
//setup fight
//run fight
//fight ticks until the fight has a winner
//fight cleanup (reset state and stats)
//fight rewards / punishment
function startFight(fight) {
    isFighting = true;
    fightSetup(fight);
    var tick = function () {
        processTick(fight);
        if (!isFighting) {
            return;
        }
        setTimeout(tick, tickRate);
    };
    // Start the loop
    tick();
}
function stopFight() {
    isFighting = false;
}
window.onload = function () {
    var btn = document.getElementById('tick');
    btn.addEventListener('click', function () { return startFight(fight); });
    startFight(fight);
};
