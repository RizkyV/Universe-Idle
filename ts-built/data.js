var Type;
(function (Type) {
    Type["Tank"] = "Tank";
    Type["Fighter"] = "Fighter";
    Type["Support"] = "Support";
})(Type || (Type = {}));
var Sort;
(function (Sort) {
    Sort["speed"] = "Speed";
})(Sort || (Sort = {}));
var units = [
    {
        name: 'Goku, Savior of Earth',
        type: Type.Fighter,
        baseStats: { health: 100, attack: 70, guard: 30, speed: 80, special: 12, specialLimit: 100, startingSpecial: 0 },
        level: 1,
        xp: 0,
        traits: [
            { name: 'Intimidate' }
        ],
        links: [
            { name: 'Dragon Ball' },
            { name: 'Saiyan' },
            { name: 'Alien' },
        ],
        special: {}
    },
    {
        name: 'Buu',
        type: Type.Tank,
        baseStats: { health: 150, attack: 50, guard: 20, speed: 70, special: 12, specialLimit: 100, startingSpecial: 0 },
        level: 1,
        xp: 0,
        traits: [
            { name: 'Intimidate' }
        ],
        links: [
            { name: 'Dragon Ball' },
            { name: 'Villain' },
            { name: 'Stretchy' },
        ],
        special: {}
    },
    {
        name: 'Mister Fantastic',
        type: Type.Fighter,
        baseStats: { health: 80, attack: 40, guard: 10, speed: 65, special: 12, specialLimit: 100, startingSpecial: 0 },
        level: 1,
        xp: 0,
        traits: [
            { name: 'Intimidate' }
        ],
        links: [
            { name: 'Fantastic Four' },
            { name: 'Stretchy' },
        ],
        special: {}
    },
    {
        name: 'Broly',
        type: Type.Fighter,
        baseStats: { health: 80, attack: 40, guard: 10, speed: 60, special: 12, specialLimit: 100, startingSpecial: 0 },
        level: 1,
        xp: 0,
        traits: [
            { name: 'Intimidate' }
        ],
        links: [
            { name: 'Dragon Ball' },
            { name: 'Rager' },
        ],
        special: {}
    },
    {
        name: 'Hulk',
        type: Type.Tank,
        baseStats: { health: 80, attack: 30, guard: 10, speed: 50, special: 12, specialLimit: 100, startingSpecial: 0 },
        level: 1,
        xp: 0,
        traits: [
            { name: 'Intimidate' }
        ],
        links: [
            { name: 'Avengers' },
            { name: 'Rager' },
        ],
        special: {}
    },
    {
        name: 'Spider-Man',
        type: Type.Fighter,
        baseStats: { health: 80, attack: 50, guard: 10, speed: 80, special: 12, specialLimit: 100, startingSpecial: 0 },
        level: 1,
        xp: 0,
        traits: [
            { name: 'Intimidate' }
        ],
        links: [
            { name: 'Marvel' },
            { name: 'Spider' },
        ],
        special: {}
    },
    {
        name: 'Grunt',
        type: Type.Fighter,
        baseStats: { health: 200, attack: 20, guard: 10, speed: 40, special: 12, specialLimit: 100, startingSpecial: 0 },
        level: 1,
        xp: 0,
        traits: [],
        links: [],
        special: {}
    }
];
var traits = [
    {
        name: 'Intimidate',
        ability: {
            targets: [
                { onlyEnemy: true, targetAll: true }
            ],
            effect: { stat: 'attack', isFlat: true, modifier: -5 }
        }
    }
];
var links = [
//Stretchy: Mister Fantastic, Buu
//Alien: Goku - aliens to their world
//Rager: Broly, Hulk
//Villain: Buu, Broly
//Hero: Goku, Mister Fantastic, Hulk, Spider-Man
];
console.log(units);
console.log(traits);
console.log(links);
