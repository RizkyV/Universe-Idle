//team consists of 6 members - 3 in the frontline and 3 in the backline
//backline is less likely to be targeted

//collect gacha units
//multiple of the same unit can be prestiged

//tracking
var frontTargets = 0;
var backTargets = 0;
var isFighting = false;
//constants
const frontLineChanceMultiplier = 1.5;
const tickRate = 1000;

function determineTarget(team: Team): Unit {
    const aliveUnits = getTeamUnits(team, true);
    var backlineChance = 0;
    var frontlineChance = 0;
    aliveUnits.forEach((item) => {
        if (item.state.isFrontline) {
            frontlineChance += frontLineChanceMultiplier;
        } else {
            backlineChance += 1;
        }
    });
    //Roll a number between 0 and the 2 chances put together
    //if the number is higher than the frontlinechance number, then it hits the backline
    const randomIndex = Math.random() * (frontlineChance + backlineChance);
    if (randomIndex <= frontlineChance) {
        frontTargets++;
        var units = getLineUnits(team.frontline, true);
        const randomIndex = Math.floor(Math.random() * units.length);
        return units[randomIndex];
    } else {
        backTargets++;
        var units = getLineUnits(team.backline, true);
        const randomIndex = Math.floor(Math.random() * units.length);
        return units[randomIndex];
    }
}

function attack(unit: Unit, enemyTeam: Team) {
    const target = determineTarget(enemyTeam);
    if (target) {
        const damage = unit.stats.attack - target.stats.guard;
        console.info(unit.name + ' is targeting ' + target.name + ' for ' + unit.stats.attack + ' atk, being blocked by ' + target.stats.guard + ' guard, resulting in ' + damage + ' damage');
        console.info(`${unit.name} is targeting ${target.name} for ${unit.stats.attack} atk, being blocked by ${target.stats.guard} guard, resulting in ${damage} damage`);
        if (damage > 0) {
            target.stats.health -= damage;
        }
    }

    checkState(fight);
}

function getFightUnits(fight: Fight) {
    const units = [...fight.friendlyTeam.backline, ...fight.friendlyTeam.frontline, ...fight.enemyTeam.backline, ...fight.enemyTeam.frontline];
    return units;
}
function getTeamUnits(team: Team, onlyAlive: boolean = false) {
    var units = [...team.backline, ...team.frontline];
    if (onlyAlive) {
        units = units.filter((item) => {
            return !item.state.isDead;
        })
    }
    return units;
}
function getLineUnits(line: Unit[], onlyAlive: boolean = false) {
    var units = [...line];
    if (onlyAlive) {
        units = units.filter((item) => {
            return !item.state.isDead;
        })
    }
    return units;
}

function checkState(fight: Fight) {
    const units = getFightUnits(fight);
    units.forEach((item) => {
        if (item.stats.health < 0 && !item.state.isDead) {
            item.state.isDead = true;
            console.info(item.name + ' has died');
        }
    });
    var friendlyAlive = getTeamUnits(fight.friendlyTeam, true);
    console.debug(friendlyAlive);
    if (!friendlyAlive || friendlyAlive.length < 1) {
        console.log('all friendly units are dead');
        fight.isOver = true;
        fight.friendlyWon = false;
    }

    var enemyAlive = getTeamUnits(fight.enemyTeam, true)
    console.debug(enemyAlive);
    if (!enemyAlive || enemyAlive.length < 1) {
        console.log('all enemy units are dead');
        fight.isOver = true;
        fight.friendlyWon = true;
    }
}

function fightSetup(fight: Fight) {
    fight.friendlyTeam.frontline.forEach((item) => {
        item.stats = { ...item.baseStats };
        item.state = { isDead: false, isFriendly: true, isFrontline: true };
    });
    fight.friendlyTeam.backline.forEach((item) => {
        item.stats = { ...item.baseStats };
        item.state = { isDead: false, isFriendly: true, isFrontline: false };
    });
    fight.enemyTeam.frontline.forEach((item) => {
        item.stats = { ...item.baseStats };
        item.state = { isDead: false, isFriendly: false, isFrontline: true };
    });
    fight.enemyTeam.backline.forEach((item) => {
        item.stats = { ...item.baseStats };
        item.state = { isDead: false, isFriendly: false, isFrontline: false };
    });
    fight.friendlyWon = undefined;
    fight.isOver = false;
}

function processTick(fight: Fight) {
    console.info('tick');
    // attack in order of speed
    fight.friendlyTeam.frontline.forEach((item) => {
        if (!item.state.isDead) {
            attack(item, enemyTeam);
        }
    });
    fight.friendlyTeam.backline.forEach((item) => {
        if (!item.state.isDead) {
            attack(item, enemyTeam);
        }
    });
    fight.enemyTeam.frontline.forEach((item) => {
        if (!item.state.isDead) {
            attack(item, friendlyTeam);
        }
    });
    fight.enemyTeam.backline.forEach((item) => {
        if (!item.state.isDead) {
            attack(item, friendlyTeam);
        }
    });
    console.info('friendly', fight.friendlyTeam);
    console.info('enemy', fight.enemyTeam);
    if (fight.isOver) {
        console.debug(frontTargets);
        console.debug(backTargets);
        stopFight();
    }
    if (fight.isOver) {
        console.info(fight.friendlyWon ? 'Fight won' : 'Fight lost');
    }
}

const friendlyTeam: Team = { frontline: [{ ...units[0] }, { ...units[1] }, { ...units[2] }], backline: [{ ...units[3] }, { ...units[4] }, { ...units[5] }] };
const enemyTeam: Team = { frontline: [{ ...units[6] }, { ...units[6] }, { ...units[6] }], backline: [{ ...units[6] }, { ...units[6] }, { ...units[6] }] };
const fight: Fight = { friendlyTeam, enemyTeam }
fightSetup(fight);

//setup fight
//run fight
//fight ticks until the fight has a winner
//fight cleanup (reset state and stats)
//fight rewards / punishment

/**
 * Runs a tick function at a set interval.
 *
 * @param tickFunction The function to be executed at each tick.
 * @param intervalMs The interval between ticks in milliseconds.
 */
function startFight(fight: Fight) {
    fightSetup(fight);
    isFighting = true;
    const tick = () => {
        if (!isFighting) {
            return;
        }
        processTick(fight);
        setTimeout(tick, tickRate);
    };

    // Start the loop
    tick();
}

function stopFight() {
    isFighting = false;
}

window.onload = () => {
    const btn = document.getElementById('tick');
    btn.addEventListener('click', () => startFight(fight));

    //runs a tick per second and stops on fight end
    startFight(fight);
}
