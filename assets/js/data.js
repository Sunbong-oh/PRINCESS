/* Princess Talk — story & question data
   Every question/answer pair was checked against the actual illustration. */

const LEVELS = [4, 6, 8];

const STICKERS = ['👑', '⭐', '💎', '🌸', '🦋', '🍎', '🌟', '🎀'];

const PRINCESSES = [
  {
    id: 'sw',
    name: 'Snow White',
    nameKo: '백설공주',
    title: 'The Magic Mirror',
    titleKo: '마법의 거울',
    color: '#6f7ffb',
    items: [
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: { text: 'What color is her dress?', answer: 'Blue',
               opts: ['Blue', 'Red', 'Yellow'],
               keys: [['blue']],
               ko: '그녀의 드레스는 무슨 색일까요?' },
          6: { text: 'What color is her dress?', answer: 'A blue dress',
               opts: ['A blue dress', 'A pink dress', 'A green dress'],
               keys: [['blue'], ['dress']],
               ko: '그녀의 드레스는 무슨 색일까요?' },
          8: { text: 'What color is her dress?', answer: 'She is wearing a blue dress.',
               opts: ['She is wearing a blue dress.', 'She is wearing a red dress.', 'She is wearing a white dress.'],
               keys: [['blue'], ['dress']],
               ko: '그녀의 드레스는 무슨 색일까요?' }
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: { text: 'What is she looking at?', answer: 'A mirror',
               opts: ['A mirror', 'A clock', 'A book'],
               keys: [['mirror', 'glass']],
               ko: '그녀는 무엇을 보고 있나요?' },
          6: { text: 'What is she looking at?', answer: 'A magic mirror',
               opts: ['A magic mirror', 'A magic wand', 'A magic castle'],
               keys: [['mirror'], ['magic']],
               ko: '그녀는 무엇을 보고 있나요?' },
          8: { text: 'What is she looking at?', answer: 'She is looking at a magic mirror.',
               opts: ['She is looking at a magic mirror.', 'She is looking at a golden key.', 'She is looking at a red apple.'],
               keys: [['look'], ['mirror']],
               ko: '그녀는 무엇을 보고 있나요?' }
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: { text: 'How many cups are on the table?', answer: 'Five',
               opts: ['Three', 'Five', 'Seven'],
               keys: [['five', '5']],
               ko: '탁자 위에 컵이 몇 개 있나요?' },
          6: { text: 'How many cups are on the table?', answer: 'Five cups',
               opts: ['Three cups', 'Five cups', 'Seven cups'],
               keys: [['five', '5'], ['cup', 'mug']],
               ko: '탁자 위에 컵이 몇 개 있나요?' },
          8: { text: 'How many cups are on the table?', answer: 'There are five cups on the table.',
               opts: ['There are three cups on the table.', 'There are five cups on the table.', 'There are seven cups on the table.'],
               keys: [['five', '5'], ['cup', 'mug']],
               ko: '탁자 위에 컵이 몇 개 있나요?' }
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: { text: 'How many apples are in the basket?', answer: 'Three',
               opts: ['Two', 'Three', 'Four'],
               keys: [['three', '3']],
               ko: '바구니 안에 사과가 몇 개 있나요?' },
          6: { text: 'How many apples are in the basket?', answer: 'Three apples',
               opts: ['Two apples', 'Three apples', 'Four apples'],
               keys: [['three', '3'], ['apple']],
               ko: '바구니 안에 사과가 몇 개 있나요?' },
          8: { text: 'How many apples are in her basket?', answer: 'There are three apples in her basket.',
               opts: ['There are two apples in her basket.', 'There are three apples in her basket.', 'There are four apples in her basket.'],
               keys: [['three', '3'], ['apple']],
               ko: '바구니 안에 사과가 몇 개 있나요?' }
        }
      }
    ]
  },

  {
    id: 'ci',
    name: 'Cinderella',
    nameKo: '신데렐라',
    title: 'The Midnight Ball',
    titleKo: '자정의 무도회',
    color: '#5aa9ff',
    items: [
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: { text: 'What is she holding?', answer: 'A shoe',
               opts: ['A shoe', 'A flower', 'A crown'],
               keys: [['shoe', 'slipper', 'glass']],
               ko: '그녀는 무엇을 들고 있나요?' },
          6: { text: 'What is she holding?', answer: 'A glass slipper',
               opts: ['A glass slipper', 'A glass crown', 'A glass wand'],
               keys: [['slipper', 'shoe']],
               ko: '그녀는 무엇을 들고 있나요?' },
          8: { text: 'What is she holding in her hand?', answer: 'She is holding a glass slipper.',
               opts: ['She is holding a glass slipper.', 'She is holding a golden crown.', 'She is holding a pink flower.'],
               keys: [['slipper', 'shoe']],
               ko: '그녀는 무엇을 들고 있나요?' }
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: { text: 'What is the carriage made of?', answer: 'A pumpkin',
               opts: ['A pumpkin', 'A lemon', 'An apple'],
               keys: [['pumpkin']],
               ko: '마차는 무엇으로 만들어졌나요?' },
          6: { text: 'What is the carriage made of?', answer: 'A big pumpkin',
               opts: ['A big pumpkin', 'A big apple', 'A big shell'],
               keys: [['pumpkin']],
               ko: '마차는 무엇으로 만들어졌나요?' },
          8: { text: 'What is the carriage made of?', answer: 'The carriage is made of a big pumpkin.',
               opts: ['The carriage is made of a big pumpkin.', 'The carriage is made of wood.', 'The carriage is made of glass.'],
               keys: [['pumpkin']],
               ko: '마차는 무엇으로 만들어졌나요?' }
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: { text: 'Where is she dancing?', answer: 'In the castle',
               opts: ['In the castle', 'In the forest', 'On the beach'],
               keys: [['castle', 'palace', 'ballroom', 'ball']],
               ko: '그녀는 어디에서 춤추고 있나요?' },
          6: { text: 'Where is she dancing?', answer: 'In the castle ballroom',
               opts: ['In the castle ballroom', 'In the forest garden', 'On the sunny beach'],
               keys: [['castle', 'palace', 'ballroom']],
               ko: '그녀는 어디에서 춤추고 있나요?' },
          8: { text: 'Where is she dancing?', answer: 'She is dancing in the castle ballroom.',
               opts: ['She is dancing in the castle ballroom.', 'She is dancing in the forest.', 'She is dancing on the beach.'],
               keys: [['danc'], ['castle', 'palace', 'ballroom']],
               ko: '그녀는 어디에서 춤추고 있나요?' }
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: { text: 'What did she leave on the stairs?', answer: 'A shoe',
               opts: ['A shoe', 'A wand', 'An apple'],
               keys: [['shoe', 'slipper', 'glass']],
               ko: '그녀가 계단에 두고 간 것은 무엇인가요?' },
          6: { text: 'What did she leave on the stairs?', answer: 'A glass slipper',
               opts: ['A glass slipper', 'A golden crown', 'A pink fan'],
               keys: [['slipper', 'shoe']],
               ko: '그녀가 계단에 두고 간 것은 무엇인가요?' },
          8: { text: 'What did she leave on the stairs?', answer: 'She left a glass slipper on the stairs.',
               opts: ['She left a glass slipper on the stairs.', 'She left her crown on the stairs.', 'She left her bag on the stairs.'],
               keys: [['slipper', 'shoe']],
               ko: '그녀가 계단에 두고 간 것은 무엇인가요?' }
        }
      }
    ]
  },

  {
    id: 'lm',
    name: 'The Little Mermaid',
    nameKo: '인어공주',
    title: 'Under the Sea',
    titleKo: '바닷속 이야기',
    color: '#3fc7c0',
    items: [
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: { text: 'What color is her hair?', answer: 'Red',
               opts: ['Red', 'Blue', 'Green'],
               keys: [['red']],
               ko: '그녀의 머리카락은 무슨 색일까요?' },
          6: { text: 'What color is her hair?', answer: 'Red hair',
               opts: ['Red hair', 'Blue hair', 'Green hair'],
               keys: [['red'], ['hair']],
               ko: '그녀의 머리카락은 무슨 색일까요?' },
          8: { text: 'What color is her hair?', answer: 'She has long red hair.',
               opts: ['She has long red hair.', 'She has short black hair.', 'She has long blue hair.'],
               keys: [['red'], ['hair']],
               ko: '그녀의 머리카락은 무슨 색일까요?' }
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: { text: 'How many fish are with her?', answer: 'Five',
               opts: ['Three', 'Five', 'Six'],
               keys: [['five', '5']],
               ko: '물고기가 몇 마리 있나요?' },
          6: { text: 'How many fish are with her?', answer: 'Five fish',
               opts: ['Three fish', 'Five fish', 'Six fish'],
               keys: [['five', '5'], ['fish']],
               ko: '물고기가 몇 마리 있나요?' },
          8: { text: 'How many fish are swimming with her?', answer: 'There are five fish swimming with her.',
               opts: ['There are three fish swimming with her.', 'There are five fish swimming with her.', 'There are six fish swimming with her.'],
               keys: [['five', '5'], ['fish']],
               ko: '물고기가 몇 마리 있나요?' }
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: { text: 'What is she holding?', answer: 'A shell',
               opts: ['A shell', 'A fish', 'A cup'],
               keys: [['shell']],
               ko: '그녀는 무엇을 들고 있나요?' },
          6: { text: 'What is she holding?', answer: 'A big pink shell',
               opts: ['A big pink shell', 'A little blue fish', 'A golden crown'],
               keys: [['shell']],
               ko: '그녀는 무엇을 들고 있나요?' },
          8: { text: 'What is she holding in her hands?', answer: 'She is holding a big pink shell with pearls.',
               opts: ['She is holding a big pink shell with pearls.', 'She is holding a shiny golden crown.', 'She is holding a little blue fish.'],
               keys: [['shell']],
               ko: '그녀는 무엇을 들고 있나요?' }
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: { text: 'What can you see on the cliff?', answer: 'A castle',
               opts: ['A castle', 'A boat', 'A school'],
               keys: [['castle', 'palace']],
               ko: '절벽 위에 무엇이 보이나요?' },
          6: { text: 'What is on the cliff?', answer: 'A white castle',
               opts: ['A white castle', 'A big boat', 'A tall tree'],
               keys: [['castle', 'palace']],
               ko: '절벽 위에 무엇이 보이나요?' },
          8: { text: 'What is on the cliff behind her?', answer: 'There is a white castle on the cliff.',
               opts: ['There is a white castle on the cliff.', 'There is a small boat on the cliff.', 'There is a tall tree on the cliff.'],
               keys: [['castle', 'palace']],
               ko: '절벽 위에 무엇이 보이나요?' }
        }
      }
    ]
  },

  {
    id: 'sb',
    name: 'Sleeping Beauty',
    nameKo: '잠자는 숲속의 공주',
    title: 'The Rose Garden',
    titleKo: '장미 정원',
    color: '#b07cff',
    items: [
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: { text: 'What color is her dress?', answer: 'Purple',
               opts: ['Purple', 'Orange', 'Green'],
               keys: [['purple', 'violet', 'lavender']],
               ko: '그녀의 드레스는 무슨 색일까요?' },
          6: { text: 'What color is her dress?', answer: 'A purple dress',
               opts: ['A purple dress', 'An orange dress', 'A green dress'],
               keys: [['purple', 'violet'], ['dress']],
               ko: '그녀의 드레스는 무슨 색일까요?' },
          8: { text: 'What color is her dress?', answer: 'She is wearing a purple dress.',
               opts: ['She is wearing a purple dress.', 'She is wearing an orange dress.', 'She is wearing a green dress.'],
               keys: [['purple', 'violet'], ['dress']],
               ko: '그녀의 드레스는 무슨 색일까요?' }
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: { text: 'What is she touching?', answer: 'A wheel',
               opts: ['A wheel', 'A ball', 'A lamp'],
               keys: [['wheel']],
               ko: '그녀는 무엇을 만지고 있나요?' },
          6: { text: 'What is she touching?', answer: 'A spinning wheel',
               opts: ['A spinning wheel', 'A silver ball', 'A golden lamp'],
               keys: [['wheel']],
               ko: '그녀는 무엇을 만지고 있나요?' },
          8: { text: 'What is she touching?', answer: 'She is touching an old spinning wheel.',
               opts: ['She is touching an old spinning wheel.', 'She is touching a silver ball.', 'She is touching a golden lamp.'],
               keys: [['wheel'], ['touch']],
               ko: '그녀는 무엇을 만지고 있나요?' }
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속 친구들',
        q: {
          4: { text: 'How many rabbits are on the grass?', answer: 'Three',
               opts: ['Two', 'Three', 'Four'],
               keys: [['three', '3']],
               ko: '풀밭에 토끼가 몇 마리 있나요?' },
          6: { text: 'How many rabbits are on the grass?', answer: 'Three rabbits',
               opts: ['Two rabbits', 'Three rabbits', 'Four rabbits'],
               keys: [['three', '3'], ['rabbit', 'bunny']],
               ko: '풀밭에 토끼가 몇 마리 있나요?' },
          8: { text: 'How many white rabbits are on the grass?', answer: 'There are three white rabbits on the grass.',
               opts: ['There are two white rabbits on the grass.', 'There are three white rabbits on the grass.', 'There are four white rabbits on the grass.'],
               keys: [['three', '3'], ['rabbit', 'bunny']],
               ko: '풀밭에 토끼가 몇 마리 있나요?' }
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: { text: 'What flowers are around her?', answer: 'Roses',
               opts: ['Roses', 'Tulips', 'Daisies'],
               keys: [['rose']],
               ko: '그녀 주변에 어떤 꽃이 있나요?' },
          6: { text: 'What flowers are around her?', answer: 'Pink roses',
               opts: ['Pink roses', 'Yellow tulips', 'White daisies'],
               keys: [['rose']],
               ko: '그녀 주변에 어떤 꽃이 있나요?' },
          8: { text: 'What is all around her in the garden?', answer: 'There are pink roses all around her.',
               opts: ['There are pink roses all around her.', 'There are yellow tulips all around her.', 'There are white daisies all around her.'],
               keys: [['rose']],
               ko: '그녀 주변에 어떤 꽃이 있나요?' }
        }
      }
    ]
  },

  {
    id: 'el',
    name: 'The Snow Queen',
    nameKo: '눈의 여왕',
    title: 'The Ice Castle',
    titleKo: '얼음 성',
    color: '#63b8ff',
    items: [
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: { text: 'What is on her head?', answer: 'A crown',
               opts: ['A crown', 'A hat', 'A flower'],
               keys: [['crown', 'tiara']],
               ko: '그녀의 머리 위에 무엇이 있나요?' },
          6: { text: 'What is on her head?', answer: 'An ice crown',
               opts: ['An ice crown', 'A big hat', 'A red flower'],
               keys: [['crown', 'tiara']],
               ko: '그녀의 머리 위에 무엇이 있나요?' },
          8: { text: 'What is on her head?', answer: 'She is wearing an ice crown.',
               opts: ['She is wearing an ice crown.', 'She is wearing a big hat.', 'She is wearing a red flower.'],
               keys: [['crown', 'tiara']],
               ko: '그녀의 머리 위에 무엇이 있나요?' }
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: { text: 'What did she build?', answer: 'A snowman',
               opts: ['A snowman', 'A snowball', 'A boat'],
               keys: [['snowman']],
               ko: '그녀는 무엇을 만들었나요?' },
          6: { text: 'What did she make in the snow?', answer: 'A happy snowman',
               opts: ['A happy snowman', 'A snow castle', 'A snow rabbit'],
               keys: [['snowman']],
               ko: '그녀는 무엇을 만들었나요?' },
          8: { text: 'What did she make in the snow?', answer: 'She made a happy snowman in the snow.',
               opts: ['She made a happy snowman in the snow.', 'She made a snow castle in the snow.', 'She made a snow rabbit in the snow.'],
               keys: [['snowman'], ['made', 'make', 'build']],
               ko: '그녀는 무엇을 만들었나요?' }
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: { text: 'What is the palace made of?', answer: 'Ice',
               opts: ['Ice', 'Wood', 'Sand'],
               keys: [['ice']],
               ko: '이 궁전은 무엇으로 만들어졌나요?' },
          6: { text: 'What is the palace made of?', answer: 'Clear ice',
               opts: ['Clear ice', 'Brown wood', 'Soft sand'],
               keys: [['ice']],
               ko: '이 궁전은 무엇으로 만들어졌나요?' },
          8: { text: 'What is the palace made of?', answer: 'The palace is made of clear ice.',
               opts: ['The palace is made of clear ice.', 'The palace is made of brown wood.', 'The palace is made of soft sand.'],
               keys: [['ice']],
               ko: '이 궁전은 무엇으로 만들어졌나요?' }
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: { text: 'What color are the lights in the sky?', answer: 'Green',
               opts: ['Green', 'Red', 'Yellow'],
               keys: [['green']],
               ko: '하늘의 빛은 무슨 색일까요?' },
          6: { text: 'What color are the lights in the sky?', answer: 'Green lights',
               opts: ['Green lights', 'Red lights', 'Yellow lights'],
               keys: [['green'], ['light']],
               ko: '하늘의 빛은 무슨 색일까요?' },
          8: { text: 'What can you see in the night sky?', answer: 'The lights in the sky are green and purple.',
               opts: ['The lights in the sky are green and purple.', 'The lights in the sky are red and orange.', 'The lights in the sky are black and white.'],
               keys: [['light', 'aurora', 'northern']],
               ko: '밤하늘에 무엇이 보이나요?' }
        }
      }
    ]
  },

  {
    id: 'ra',
    name: 'Rapunzel',
    nameKo: '라푼젤',
    title: 'The Lantern Sky',
    titleKo: '등불 하늘',
    color: '#a97bff',
    items: [
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: { text: 'What color is her dress?', answer: 'Purple',
               opts: ['Purple', 'Brown', 'Grey'],
               keys: [['purple', 'violet', 'lavender']],
               ko: '그녀의 드레스는 무슨 색일까요?' },
          6: { text: 'What color is her dress?', answer: 'A purple dress',
               opts: ['A purple dress', 'A brown dress', 'A grey dress'],
               keys: [['purple', 'violet'], ['dress']],
               ko: '그녀의 드레스는 무슨 색일까요?' },
          8: { text: 'What color is her dress?', answer: 'She is wearing a purple dress.',
               opts: ['She is wearing a purple dress.', 'She is wearing a brown dress.', 'She is wearing a grey dress.'],
               keys: [['purple', 'violet'], ['dress']],
               ko: '그녀의 드레스는 무슨 색일까요?' }
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: { text: 'Where does she live?', answer: 'In a tower',
               opts: ['In a tower', 'In a cave', 'In a boat'],
               keys: [['tower']],
               ko: '그녀는 어디에 살고 있나요?' },
          6: { text: 'Where does she live?', answer: 'In a tall tower',
               opts: ['In a tall tower', 'In a dark cave', 'In a small boat'],
               keys: [['tower']],
               ko: '그녀는 어디에 살고 있나요?' },
          8: { text: 'Where does she live?', answer: 'She lives in a tall stone tower.',
               opts: ['She lives in a tall stone tower.', 'She lives in a dark cave.', 'She lives in a small boat.'],
               keys: [['tower'], ['live']],
               ko: '그녀는 어디에 살고 있나요?' }
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: { text: 'What color is her little friend?', answer: 'Green',
               opts: ['Green', 'Pink', 'Blue'],
               keys: [['green']],
               ko: '작은 친구는 무슨 색일까요?' },
          6: { text: 'What color is her little friend?', answer: 'A green frog',
               opts: ['A green frog', 'A pink pig', 'A blue bird'],
               keys: [['green'], ['frog']],
               ko: '작은 친구는 무슨 색일까요?' },
          8: { text: 'What is her little friend?', answer: 'Her little friend is a green frog.',
               opts: ['Her little friend is a green frog.', 'Her little friend is a pink pig.', 'Her little friend is a blue bird.'],
               keys: [['frog']],
               ko: '그녀의 작은 친구는 무엇인가요?' }
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: { text: 'What is flying in the sky?', answer: 'Lanterns',
               opts: ['Lanterns', 'Birds', 'Kites'],
               keys: [['lantern', 'light']],
               ko: '하늘로 날아가는 것은 무엇인가요?' },
          6: { text: 'What is flying in the sky?', answer: 'Many lanterns',
               opts: ['Many lanterns', 'Many birds', 'Many kites'],
               keys: [['lantern']],
               ko: '하늘로 날아가는 것은 무엇인가요?' },
          8: { text: 'What is flying in the sky?', answer: 'Many glowing lanterns are flying in the sky.',
               opts: ['Many glowing lanterns are flying in the sky.', 'Many birds are flying in the sky.', 'Many kites are flying in the sky.'],
               keys: [['lantern']],
               ko: '하늘로 날아가는 것은 무엇인가요?' }
        }
      }
    ]
  }
];
