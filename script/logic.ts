//collect gacha units
//multiple of the same unit can be prestiged

//constants
const frontLineChanceMultiplier = 1.5;
const tickRate = 1000;
//tracking
var frontTargets = 0;
var backTargets = 0;
var isFighting = false;


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

function attack(unit: Unit, enemyTeam: Team, fight?: Fight) {
    if (!fight.isOver) {
        const target = determineTarget(enemyTeam);
        if (target) {
            const damage = unit.stats.attack - target.stats.guard;
            console.info(`${unit.name} is targeting ${target.name} for ${unit.stats.attack} atk, being blocked by ${target.stats.guard} guard, resulting in ${damage} damage`);
            if (damage > 0) {
                target.stats.health -= damage;
            }
        }

        checkState(fight);
    }
}

function getFightUnits(fight: Fight, sort?: Sort) {
    const units = [...fight.friendlyTeam.backline, ...fight.friendlyTeam.frontline, ...fight.enemyTeam.backline, ...fight.enemyTeam.frontline];
    switch (sort) {
        case Sort.speed:
            units.sort((a, b) => {
                return b.stats.speed - a.stats.speed;
            });
            break;
        default:
            break;
    }
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
        console.info('all friendly units are dead');
        fight.isOver = true;
        fight.friendlyWon = false;
        stopFight();
    }

    var enemyAlive = getTeamUnits(fight.enemyTeam, true)
    console.debug(enemyAlive);
    if (!enemyAlive || enemyAlive.length < 1) {
        console.info('all enemy units are dead');
        fight.isOver = true;
        fight.friendlyWon = true;
        stopFight();
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
    const units = getFightUnits(fight, Sort.speed);
    units.forEach((item) => {
        if (!item.state.isDead) {
            if (item.state.isFriendly) {
                attack(item, fight.enemyTeam, fight);
            } else {
                attack(item, fight.friendlyTeam, fight);
            }
        }
    });
    console.debug('friendly', fight.friendlyTeam);
    console.debug('enemy', fight.enemyTeam);
    if (fight.isOver) {
        console.info(fight.friendlyWon ? 'Fight won' : 'Fight lost');
    }
}

//fight cleanup (reset state and stats)
//fight rewards / punishment

function startFight(fight: Fight) {
    isFighting = true;
    fightSetup(fight);
    const tick = () => {
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

window.onload = () => {
    const friendlyTeam: Team = { leader: { ...units[0] }, frontline: [{ ...units[0] }, { ...units[1] }, { ...units[2] }], backline: [{ ...units[3] }, { ...units[4] }, { ...units[5] }] };
    const enemyTeam: Team = { leader: { ...units[6] }, frontline: [{ ...units[6] }, { ...units[6] }, { ...units[6] }], backline: [{ ...units[6] }, { ...units[6] }, { ...units[6] }] };
    const fight: Fight = { friendlyTeam, enemyTeam, }

    const btn = document.getElementById('tick');
    btn.addEventListener('click', () => startFight(fight));

    startFight(fight);
}
