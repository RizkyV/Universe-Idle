enum Type {
  Tank = 'Tank',
  Fighter = 'Fighter',
  Support = 'Support'
}

enum Sort {
  speed = 'Speed',
}

interface User {
  collection?: Unit[];
  team?: Team;
}

interface Fight {
  friendlyTeam: Team;
  enemyTeam: Team;
  //team: Team; where the team has a state determining if it is friendly or enemy
  isOver?: boolean;
  friendlyWon?: boolean;
}

interface Team {
  frontline: Unit[];
  backline: Unit[];
  leader?: Unit;
}

interface Unit {
  name?: string;
  type?: Type;
  baseStats?: Stats; //The base values that are not altered
  stats?: Stats; //the stats with modifiers
  level?: number;
  xp?: number;
  traits?: Trait[];
  links?: Link[];
  special?: {};
  leader?: {}; //Leader ability - each team has a leader
  state?: State;
}

interface State {
  isDead?: boolean;
  isFrontline?: boolean;
  isFriendly?: boolean;
}

interface Stats {
  //base stats range from 1 to 100
  health?: number;
  attack?: number;
  guard?: number;
  heal?: number; //how much it heals per attack
  speed?: number; //order of attacks / how often a unit attacks
  special?: number; //how much special per attack
  specialLimit?: number; //how much special is needed to trigger special move
  startingSpecial?: number; //how much special the unit starts with
  elusiveness?: number; //makes a unit less likely to be targeted - can also be used to make a unit more likely to be targeted (tank)
  dodge?: number; //determines how likely a unit is to dodge an attack
  //resistances
}

interface Link {
  name?: string;
  boosts?: Boost[];
  //Main 3 levels of links
  //1. Universe
  //2. Faction
  //3. Characteristic (stretchy, rager, etc.)
}
//collection boosts and team boosts (team only activates from members in team)
interface Boost {
  threshhold?: number;
  interval?: number;
  ability?: Ability;
  //2 different types
  //interval boost every x
  //specific boost at threshold x
}

interface Trait {
  name?: string;
  ability?: Ability;
}

interface Ability {
  targets?: Target[];
  effect?: Effect;
  trigger?: Trigger;
}

interface Target {
  onlyFriendly?: boolean;
  onlyEnemy?: boolean;
  targetAll?: boolean; //still respects friendly or enemy
  targets?: number; //how many targets - used mostly for non-specific targets
  islink?: boolean;
  isType?: boolean;
  value?: Link | Type;
}

interface Effect {
  stat?: string;
  isFlat?: boolean;
  modifier?: number;
}

interface Trigger {
  constant?: boolean;
  onAttack?: boolean;
  onDeath?: boolean;
  onFriendlyDeath?: boolean;
  onEnemyDeath?: boolean;
  onKill?: boolean;
  everyTurn?: boolean;
}

//global modifiers
interface Modifier {
  name?: string;
  ability?: Ability;
}

const units: Unit[] = [
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
      { name: 'Villain'},
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
    traits: [
    ],
    links: [
    ],
    special: {}
  }
];

const traits: Trait[] = [
  {
    name: 'Intimidate',
    ability: {
      targets: [
        { onlyEnemy: true, targetAll: true }
      ],
      effect: { stat: 'attack', isFlat: true, modifier: -5 }
    }
  }
]

const links: Link[] = [
  //Stretchy: Mister Fantastic, Buu
  //Alien: Goku - aliens to their world
  //Rager: Broly, Hulk
  //Villain: Buu, Broly
  //Hero: Goku, Mister Fantastic, Hulk, Spider-Man
]

console.log(units);
console.log(traits);
console.log(links);