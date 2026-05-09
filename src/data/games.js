const asset = (name) => `/assets/source/${name}`

export const games = [
  {
    id: 'gobang',
    title: '五子棋',
    genre: 'Classic',
    likes: '联机',
    image: asset('source-216-6bf5f499f6c1.png'),
    description: '经典五子棋对战，两名玩家轮流落子，先将五颗棋子连成一线者获胜。支持在线联机对战。',
    serverGame: true,
  },
  {
    id: 'doudizhu',
    title: '斗地主',
    genre: 'Card',
    likes: '联机',
    image: asset('source-217-a9e92b686207.png'),
    description: '经典三人斗地主，三人轮流出牌，先出完手牌的玩家获胜。支持在线联机对战。',
    serverGame: true,
  },
  {
    id: 'hexa-stack',
    title: 'Hexa Stack',
    genre: 'Puzzle',
    likes: '32.8K',
    image: asset('source-056-dcec98e8097e.png'),
    hero: asset('source-059-d6c230747afb.png'),
    description:
      'Hexa Stack is a puzzle game built around hexagon tiles, color sorting, matching, and stacking. Plan ahead, keep open space on the board, and use boosters when the layout gets tight.',
  },
  { id: 'ultimate-sudoku', title: 'Ultimate Sudoku', genre: 'Puzzle', likes: '11.7K', image: asset('source-205-27845c0a6fd1.png') },
  { id: 'cube-merge-2048', title: '2048 Cube Merge', genre: 'Match', likes: '5.2K', image: asset('source-206-32f14f554950.png') },
  { id: 'mega-shark', title: 'Mega Shark', genre: 'Adventure', likes: '20.9K', image: asset('source-207-eb8853fee25d.png') },
  { id: 'cornhole-league', title: 'Cornhole League', genre: 'Sports', likes: '3.8K', image: asset('source-208-4c96209cad63.png') },
  { id: 'planet-chaos', title: 'Planet Chaos', genre: 'Racing', likes: '6.9K', image: asset('source-209-40ddf17699c8.png') },
  { id: 'mess-on-the-ranch', title: 'Mess on the Ranch', genre: 'Family', likes: '1.1K', image: asset('source-210-7f843791568c.png') },
  { id: 'guess-the-drawing', title: 'Guess the Drawing', genre: 'Classic', likes: '3.7K', image: asset('source-211-2ee028409ed5.png') },
  { id: 'diamond-rush-2', title: 'Diamond Rush 2', genre: 'Match', likes: '492', image: asset('source-212-ef1dbc101fbd.png') },
  { id: 'steal-brainrot-online', title: 'Steal Brainrot Online', genre: 'Adventure', likes: '397.2K', image: asset('source-213-01028728e743.png') },
  { id: 'unblock-frvr', title: 'Unblock FRVR', genre: 'Puzzle', likes: '533', image: asset('source-214-6d3f9a34ecdd.png') },
  { id: 'idle-boxing-tycoon', title: 'Idle Boxing Tycoon', genre: 'Strategy', likes: '7.3K', image: asset('source-215-5bc1bdf04a3f.png') },
  { id: 'align-4-big', title: 'Align 4 BIG', genre: 'Family', likes: '7.1K', image: asset('source-216-6bf5f499f6c1.png') },
  { id: 'card-scramble', title: "Card Scramble: Viola's Diner", genre: 'Card', likes: '424', image: asset('source-217-a9e92b686207.png') },
  { id: 'age-of-tanks', title: 'Age of Tanks', genre: 'Strategy', likes: '8.1K', image: asset('source-218-8ebeb43f85d0.png') },
  { id: 'jungle-jewels', title: 'Jungle Jewels', genre: 'Arcade', likes: '1.1K', image: asset('source-219-42e83030ace2.png') },
  { id: 'football-king-fn', title: 'Football King FN', genre: 'Sports', likes: '7.7K', image: asset('source-220-60b86d2b948c.png') },
  { id: 'drifting-master', title: 'Drifting Master', genre: 'Arcade', likes: '9.5K', image: asset('source-221-cc2b7694796d.png') },
  { id: 'crazy-king-of-soccer', title: 'Crazy King of Soccer', genre: 'Sports', likes: '7.3K', image: asset('source-222-0416810d74b9.png') },
  { id: 'basketball-arcade', title: 'Basketball Arcade', genre: 'Sports', likes: '3.6K', image: asset('source-226-e4d77188a12f.png') },
  { id: 'solitaire-social', title: 'Solitaire Social', genre: 'Card', likes: '1.4K', image: asset('source-231-bd2be247e866.png') },
  { id: 'amazing-freecell', title: 'Amazing FreeCell Solitaire', genre: 'Classic', likes: '1.6K', image: asset('source-232-ee74d1c4fef0.png') },
  { id: 'survivor-legend', title: 'Survivor Legend', genre: 'Adventure', likes: '3K', image: asset('source-233-db334373e72d.png') },
  { id: 'pirates-buccaneer-path', title: 'Pirates: Buccaneer Path', genre: 'Adventure', likes: '876', image: asset('source-234-ac52ced2570d.png') },
  { id: 'tennis-play', title: 'Tennis Play', genre: 'Sports', likes: '4.3K', image: asset('source-235-a95e0811e39a.png') },
  { id: 'block-legends-frvr', title: 'Block Legends FRVR', genre: 'Puzzle', likes: '377', image: asset('source-236-7f01bd8e219b.png') },
  { id: 'shoot-the-bottle', title: 'Shoot The Bottle', genre: 'Shooter', likes: '17.4K', image: asset('source-239-92800a19935e.png') },
]

export const categories = ['All', 'Puzzle', 'Arcade', 'Adventure', 'Sports', 'Card', 'Strategy', 'Family']

export function findGame(id) {
  return games.find((game) => game.id === id) || games[0]
}
