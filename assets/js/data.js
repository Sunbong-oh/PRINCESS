/* Princess Talk — story & question data
   6명 공주 × 4장 그림 = 24장, 공주마다 정확히 10문항, 총 60문항 (문항마다 4살·6살·8살 3단계).
   12살 모드는 새 문항을 만들지 않고 8살 문장을 그대로 씁니다 — 선택지 없이 바로 말하는 모드라
   (app.js에서 item.q[state.level] || item.q[8] 로 폴백) 60문항 모두 12살에서도 나옵니다.
   한 판은 고른 공주 한 명의 10문항을 전부 섞어서 내고, 다른 공주 문항은 섞지 않습니다.
   (6명 × 10문항 = 60문항을 공주를 바꿔 가며 겹치지 않고 다 풀 수 있습니다.)

   · 그림 속 사실은 이미지 생성 프롬프트와 이전 검증 기록으로 확인한 것만 씁니다.
   · 개수 세기 문항은 '화면에 크게 보이는 사물'만 씁니다 — 백설공주 컵 5개(탁자 위 한 줄),
     인어공주 진주 3개(손에 든 조개 안) 두 곳뿐입니다.
     사과 바구니(sw-3-apples)와 바닷속 물고기(lm-1-fish)는 화면에서 작거나 가려져 아이가
     세기 어렵다는 지적에 따라, 개수 대신 한눈에 보이는 '무엇인가요' 질문으로 바꿉니다.
   · 문제 화면은 그림을 object-fit:contain으로 '원본 전체'를 보여줍니다.
     그래서 가장자리·아랫부분에 있는 작은 디테일을 정답으로 삼는 질문은 피해야 합니다.
   · 잠자는 숲속의 공주 숲 장면(sb-2-forest)은 토끼 그림이 아니라 아기천사처럼 보이는
     작은 요정이 보인다는 피드백이 있어, 토끼/동물 개수 문항을 모두 빼고 숲·장미로만 묻습니다.
   · 4살 보기는 관사 A/An을 붙이지 않은 단어 하나로 씁니다. (A ball → Ball)
*/

const LEVELS = [4, 6, 8, 12];

const STICKERS = ['👑', '⭐', '💎', '🌸', '🦋', '🍎', '🌟', '🎀'];

/* Q(text, answer, opts, keys, ko) — keys의 각 묶음에서 하나씩 들리면 정답으로 인정 */
function Q(text, answer, opts, keys, ko) {
  return { text: text, answer: answer, opts: opts, keys: keys, ko: ko };
}

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
          4: Q('What color is her dress?', 'Blue',
               ['Blue', 'Red', 'Yellow'],
               [['blue']],
               '그녀의 드레스는 무슨 색일까요?'),
          6: Q('What color is her dress?', 'Blue dress',
               ['Blue dress', 'Pink dress', 'Green dress'],
               [['blue'], ['dress']],
               '그녀의 드레스는 무슨 색일까요?'),
          8: Q('What color is her dress?', 'She is wearing a blue dress.',
               ['She is wearing a blue dress.', 'She is wearing a pink dress.', 'She is wearing a green dress.'],
               [['blue'], ['dress'], ['wear']],
               '그녀의 드레스는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('What color is her hair?', 'Black',
               ['Black', 'Brown', 'Red'],
               [['black']],
               '그녀의 머리카락은 무슨 색일까요?'),
          6: Q('What color is her hair?', 'Black hair',
               ['Black hair', 'Brown hair', 'Red hair'],
               [['black'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?'),
          8: Q('What color is her hair?', 'She has black hair with a red ribbon.',
               ['She has black hair with a red ribbon.', 'She has brown hair with a blue ribbon.', 'She has yellow hair with a green ribbon.'],
               [['black'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('What is she looking at?', 'Mirror',
               ['Mirror', 'Clock', 'Book'],
               [['mirror', 'glass']],
               '그녀는 무엇을 보고 있나요?'),
          6: Q('What is she looking at?', 'Magic mirror',
               ['Magic mirror', 'Magic wand', 'Magic castle'],
               [['mirror'], ['magic']],
               '그녀는 무엇을 보고 있나요?'),
          8: Q('What is she looking at?', 'She is looking at a magic mirror.',
               ['She is looking at a magic mirror.', 'She is looking at a magic wand.', 'She is looking at a magic castle.'],
               [['look'], ['mirror']],
               '그녀는 무엇을 보고 있나요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('What color is the mirror?', 'Gold',
               ['Gold', 'Brown', 'Blue'],
               [['gold', 'golden']],
               '거울은 무슨 색일까요?'),
          6: Q('What color is the mirror?', 'Golden mirror',
               ['Golden mirror', 'Brown mirror', 'Blue mirror'],
               [['gold', 'golden'], ['mirror']],
               '거울은 무슨 색일까요?'),
          8: Q('What color is the magic mirror?', 'The magic mirror is golden.',
               ['The magic mirror is golden.', 'The magic mirror is green.', 'The magic mirror is black.'],
               [['mirror'], ['gold', 'golden']],
               '마법의 거울은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('How many cups are on the table?', 'Five',
               ['Three', 'Five', 'Seven'],
               [['five', '5']],
               '탁자 위에 컵이 몇 개 있나요?'),
          6: Q('How many cups are on the table?', 'Five cups',
               ['Three cups', 'Five cups', 'Seven cups'],
               [['five', '5'], ['cup', 'mug']],
               '탁자 위에 컵이 몇 개 있나요?'),
          8: Q('How many cups are on the table?', 'There are five cups on the table.',
               ['There are three cups on the table.', 'There are five cups on the table.', 'There are seven cups on the table.'],
               [['five', '5'], ['cup', 'mug']],
               '탁자 위에 컵이 몇 개 있나요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('Who is behind the table?', 'Dwarfs',
               ['Dwarfs', 'Cats', 'Kings'],
               [['dwarf', 'dwarfs']],
               '탁자 뒤에는 누가 있나요?'),
          6: Q('Who is behind the table?', 'Four dwarfs',
               ['Four dwarfs', 'Four cats', 'Four kings'],
               [['dwarf', 'dwarfs']],
               '탁자 뒤에는 누가 있나요?'),
          8: Q('Who is behind the table?', 'Four dwarfs are behind the table.',
               ['Four dwarfs are behind the table.', 'Four cats are behind the table.', 'Four kings are behind the table.'],
               [['dwarf', 'dwarfs']],
               '탁자 뒤에는 누가 있나요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '사과를 건네는 할머니',
        q: {
          4: Q('What is she holding?', 'Apple',
               ['Apple', 'Cup', 'Shoe'],
               [['apple']],
               '할머니가 손에 들고 있는 것은 무엇인가요?'),
          6: Q('What is the old woman holding?', 'Big red apple',
               ['Big red apple', 'Big red cup', 'Big red shoe'],
               [['apple']],
               '할머니가 손에 들고 있는 것은 무엇인가요?'),
          8: Q('What is the old woman holding out to her?', 'She is holding out a big red apple.',
               ['She is holding out a big red apple.', 'She is holding out a big red cup.', 'She is holding out a big red shoe.'],
               [['apple']],
               '할머니가 무엇을 건네고 있나요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('What color are the apples?', 'Red',
               ['Red', 'Green', 'Blue'],
               [['red']],
               '사과는 무슨 색일까요?'),
          6: Q('What color are the apples?', 'Red apples',
               ['Red apples', 'Green apples', 'Blue apples'],
               [['red'], ['apple']],
               '사과는 무슨 색일까요?'),
          8: Q('What color are the apples in her basket?', 'The apples in her basket are red.',
               ['The apples in her basket are red.', 'The apples in her basket are green.', 'The apples in her basket are blue.'],
               [['apple'], ['red']],
               '바구니 안의 사과는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('Where are the cups?', 'On the table',
               ['On the table', 'On the bed', 'On the floor'],
               [['table']],
               '컵은 어디에 있나요?'),
          6: Q('Where are the cups?', 'They are on the table',
               ['They are on the table', 'They are on the bed', 'They are on the floor'],
               [['table']],
               '컵은 어디에 있나요?'),
          8: Q('Where are the cups?', 'The cups are on the table.',
               ['The cups are on the table.', 'The cups are on the bed.', 'The cups are on the floor.'],
               [['table']],
               '컵은 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '사과 바구니',
        q: {
          4: Q('What is in the basket?', 'Apples',
               ['Apples', 'Pears', 'Flowers'],
               [['apple']],
               '바구니 안에는 무엇이 있나요?'),
          6: Q('What is in the basket?', 'Red apples',
               ['Red apples', 'Green pears', 'Pink flowers'],
               [['apple']],
               '바구니 안에는 무엇이 있나요?'),
          8: Q('What is in the basket?', 'There are red apples in the basket.',
               ['There are red apples in the basket.', 'There are green pears in the basket.', 'There are pink flowers in the basket.'],
               [['apple']],
               '바구니 안에는 무엇이 있나요?')
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
          4: Q('What is she holding?', 'Shoe',
               ['Shoe', 'Flower', 'Crown'],
               [['shoe', 'slipper', 'glass']],
               '그녀는 무엇을 들고 있나요?'),
          6: Q('What is she holding?', 'Glass slipper',
               ['Glass slipper', 'Glass crown', 'Glass wand'],
               [['slipper', 'shoe']],
               '그녀는 무엇을 들고 있나요?'),
          8: Q('What is she holding in her hand?', 'She is holding a glass slipper.',
               ['She is holding a glass slipper.', 'She is holding a golden crown.', 'She is holding a pink flower.'],
               [['slipper', 'shoe']],
               '그녀는 무엇을 들고 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What color is her dress?', 'Blue',
               ['Blue', 'Pink', 'Green'],
               [['blue']],
               '그녀의 드레스는 무슨 색일까요?'),
          6: Q('What color is her dress?', 'Blue dress',
               ['Blue dress', 'Pink dress', 'Green dress'],
               [['blue'], ['dress']],
               '그녀의 드레스는 무슨 색일까요?'),
          8: Q('What color is her dress?', 'She is wearing a light blue dress.',
               ['She is wearing a light blue dress.', 'She is wearing a pink dress.', 'She is wearing a green dress.'],
               [['blue'], ['dress'], ['wear']],
               '그녀의 드레스는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('What is the carriage made of?', 'Pumpkin',
               ['Pumpkin', 'Lemon', 'Apple'],
               [['pumpkin']],
               '마차는 무엇으로 만들어졌나요?'),
          6: Q('What is the carriage made of?', 'Big pumpkin',
               ['Big pumpkin', 'Big apple', 'Big shell'],
               [['pumpkin']],
               '마차는 무엇으로 만들어졌나요?'),
          8: Q('What is the carriage made of?', 'The carriage is made of a big pumpkin.',
               ['The carriage is made of a big pumpkin.', 'The carriage is made of wood.', 'The carriage is made of glass.'],
               [['pumpkin']],
               '마차는 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('What color is the carriage?', 'Orange',
               ['Orange', 'Blue', 'White'],
               [['orange', 'gold', 'golden']],
               '마차는 무슨 색일까요?'),
          6: Q('What color is the carriage?', 'Orange carriage',
               ['Orange carriage', 'Blue carriage', 'White carriage'],
               [['orange', 'pumpkin']],
               '마차는 무슨 색일까요?'),
          8: Q('What color is the pumpkin carriage?', 'The pumpkin carriage is orange.',
               ['The pumpkin carriage is orange.', 'The pumpkin carriage is blue.', 'The pumpkin carriage is white.'],
               [['carriage', 'pumpkin'], ['orange']],
               '호박 마차는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('Where is she dancing?', 'In the castle',
               ['In the castle', 'In the forest', 'On the beach'],
               [['castle', 'palace', 'ballroom']],
               '그녀는 어디에서 춤추고 있나요?'),
          6: Q('Where is she dancing?', 'In the castle ballroom',
               ['In the castle ballroom', 'In the forest garden', 'On the sunny beach'],
               [['castle', 'palace', 'ballroom']],
               '그녀는 어디에서 춤추고 있나요?'),
          8: Q('Where is she dancing?', 'She is dancing in the castle ballroom.',
               ['She is dancing in the castle ballroom.', 'She is dancing in the forest.', 'She is dancing on the beach.'],
               [['danc'], ['castle', 'palace', 'ballroom']],
               '그녀는 어디에서 춤추고 있나요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('What color are the flowers?', 'Pink',
               ['Pink', 'Black', 'Brown'],
               [['pink']],
               '꽃은 무슨 색일까요?'),
          6: Q('What is in the windows?', 'Pink flowers',
               ['Pink flowers', 'Red apples', 'Green frogs'],
               [['pink'], ['flower']],
               '창문에는 무엇이 있나요?'),
          8: Q('What can you see in the tall windows?', 'There are pink flowers in the windows.',
               ['There are pink flowers in the windows.', 'There are red apples in the windows.', 'There are green frogs in the windows.'],
               [['pink'], ['flower']],
               '높은 창문에 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('What did she leave on the stairs?', 'Shoe',
               ['Shoe', 'Wand', 'Apple'],
               [['shoe', 'slipper', 'glass']],
               '그녀가 계단에 두고 간 것은 무엇인가요?'),
          6: Q('What did she leave on the stairs?', 'Glass slipper',
               ['Glass slipper', 'Golden crown', 'Pink fan'],
               [['slipper', 'shoe']],
               '그녀가 계단에 두고 간 것은 무엇인가요?'),
          8: Q('What did she leave on the stairs?', 'She left a glass slipper on the stairs.',
               ['She left a glass slipper on the stairs.', 'She left her crown on the stairs.', 'She left her bag on the stairs.'],
               [['slipper', 'shoe']],
               '그녀가 계단에 두고 간 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('What time is it?', 'Twelve',
               ['Twelve', 'Three', 'Six'],
               [['twelve', '12']],
               '지금은 몇 시인가요?'),
          6: Q('What time is it?', "Twelve o'clock",
               ["Twelve o'clock", "Three o'clock", "Six o'clock"],
               [['twelve', '12']],
               '지금은 몇 시인가요?'),
          8: Q('What time does the big clock show?', "The big clock shows twelve o'clock.",
               ["The big clock shows twelve o'clock.", "The big clock shows three o'clock.", "The big clock shows six o'clock."],
               [['twelve', '12']],
               '큰 시계는 몇 시를 가리키나요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('Where are the flowers?', 'In the windows',
               ['In the windows', 'On the floor', 'On the table'],
               [['window']],
               '꽃은 어디에 있나요?'),
          6: Q('Where are the flowers?', 'In the tall windows',
               ['In the tall windows', 'On the floor', 'On the table'],
               [['window']],
               '꽃은 어디에 있나요?'),
          8: Q('Where are the pink flowers?', 'The pink flowers are in the tall windows.',
               ['The pink flowers are in the tall windows.', 'The pink flowers are on the floor.', 'The pink flowers are on the table.'],
               [['window']],
               '분홍 꽃은 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What is the slipper made of?', 'Glass',
               ['Glass', 'Wood', 'Paper'],
               [['glass']],
               '유리구두는 무엇으로 만들어졌나요?'),
          6: Q('What is the slipper made of?', 'Clear glass',
               ['Clear glass', 'Brown wood', 'White paper'],
               [['glass']],
               '유리구두는 무엇으로 만들어졌나요?'),
          8: Q('What is the glass slipper made of?', 'It is made of glass.',
               ['It is made of glass.', 'It is made of wood.', 'It is made of paper.'],
               [['glass']],
               '유리구두는 무엇으로 만들어졌나요?')
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
          4: Q('What color is her hair?', 'Red',
               ['Red', 'Blue', 'Green'],
               [['red']],
               '그녀의 머리카락은 무슨 색일까요?'),
          6: Q('What color is her hair?', 'Red hair',
               ['Red hair', 'Blue hair', 'Green hair'],
               [['red'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?'),
          8: Q('What color is her hair?', 'She has long red hair.',
               ['She has long red hair.', 'She has short black hair.', 'She has long blue hair.'],
               [['red'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('What is she?', 'Mermaid',
               ['Mermaid', 'Bird', 'Cat'],
               [['Mermaid']],
               '그녀는 무엇인가요?'),
          6: Q('What is she?', 'Mermaid',
               ['Mermaid', 'Bird', 'Cat'],
               [['Mermaid']],
               '그녀는 무엇인가요?'),
          8: Q('What is she?', 'She is a little mermaid.',
               ['She is a little mermaid.', 'She is a little bird.', 'She is a little cat.'],
               [['Mermaid']],
               '그녀는 무엇인가요?')
        }
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('Where does she live?', 'Sea',
               ['Sea', 'Tree', 'Snow'],
               [['sea', 'ocean', 'water']],
               '그녀는 어디에 살까요?'),
          6: Q('Where does she live?', 'In the sea',
               ['In the sea', 'In a tree', 'In the snow'],
               [['sea', 'ocean']],
               '그녀는 어디에 살까요?'),
          8: Q('Where does she live?', 'She lives in the sea.',
               ['She lives in the sea.', 'She lives in a tree.', 'She lives in the snow.'],
               [['sea', 'ocean']],
               '그녀는 어디에 살까요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What is swimming with her?', 'Fish',
               ['Fish', 'Bird', 'Cat'],
               [['fish']],
               '그녀와 함께 헤엄치는 것은 무엇인가요?'),
          6: Q('What is swimming with her?', 'Little fish',
               ['Little fish', 'Little birds', 'Little cats'],
               [['fish']],
               '그녀와 함께 헤엄치는 것은 무엇인가요?'),
          8: Q('What is swimming with her in the sea?', 'Little fish are swimming with her.',
               ['Little fish are swimming with her.', 'Little birds are swimming with her.', 'Little cats are swimming with her.'],
               [['fish']],
               '바다에서 그녀와 함께 헤엄치는 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What color is the coral?', 'Pink',
               ['Pink', 'Black', 'Grey'],
               [['pink']],
               '산호초는 무슨 색일까요?'),
          6: Q('What color is the coral?', 'Pink coral',
               ['Pink coral', 'Black coral', 'Grey coral'],
               [['pink'], ['coral']],
               '산호초는 무슨 색일까요?'),
          8: Q('What color is the coral?', 'The coral is pink and purple.',
               ['The coral is pink and purple.', 'The coral is black and white.', 'The coral is grey and brown.'],
               [['coral'], ['pink', 'purple']],
               '산호초는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('What is she holding?', 'Shell',
               ['Shell', 'Fish', 'Cup'],
               [['shell']],
               '그녀는 무엇을 들고 있나요?'),
          6: Q('What is she holding?', 'Big pink shell',
               ['Big pink shell', 'Little blue fish', 'Golden crown'],
               [['shell']],
               '그녀는 무엇을 들고 있나요?'),
          8: Q('What is she holding in her hands?', 'She is holding a big pink shell with pearls.',
               ['She is holding a big pink shell with pearls.', 'She is holding a shiny golden crown.', 'She is holding a little blue fish.'],
               [['shell']],
               '그녀는 무엇을 들고 있나요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('How many pearls are in the shell?', 'Three',
               ['Two', 'Three', 'Four'],
               [['three', '3']],
               '조개 안에 진주가 몇 개 있나요?'),
          6: Q('How many pearls are in the shell?', 'Three pearls',
               ['Two pearls', 'Three pearls', 'Four pearls'],
               [['three', '3'], ['pearl']],
               '조개 안에 진주가 몇 개 있나요?'),
          8: Q('How many white pearls are in the shell?', 'There are three white pearls in the shell.',
               ['There are two white pearls in the shell.', 'There are three white pearls in the shell.', 'There are four white pearls in the shell.'],
               [['three', '3'], ['pearl']],
               '조개 안에 진주가 몇 개 있나요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What can you see on the cliff?', 'Castle',
               ['Castle', 'Boat', 'School'],
               [['castle', 'palace']],
               '절벽 위에 무엇이 보이나요?'),
          6: Q('What is on the cliff?', 'White castle',
               ['White castle', 'Big boat', 'Tall tree'],
               [['castle', 'palace']],
               '절벽 위에 무엇이 보이나요?'),
          8: Q('What is on the cliff behind her?', 'There is a white castle on the cliff.',
               ['There is a white castle on the cliff.', 'There is a small boat on the cliff.', 'There is a tall tree on the cliff.'],
               [['castle', 'palace']],
               '그녀 뒤 절벽 위에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What color is the sky?', 'Pink',
               ['Pink', 'Blue', 'Black'],
               [['pink']],
               '하늘은 무슨 색일까요?'),
          6: Q('What color is the sky?', 'Pink sky',
               ['Pink sky', 'Blue sky', 'Black sky'],
               [['pink'], ['sky']],
               '하늘은 무슨 색일까요?'),
          8: Q('What color is the sky at sunset?', 'The sky is pink and gold.',
               ['The sky is pink and gold.', 'The sky is blue and grey.', 'The sky is black and white.'],
               [['sky'], ['pink', 'gold']],
               '해질녘 하늘은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What color is the castle?', 'White',
               ['White', 'Black', 'Brown'],
               [['white']],
               '성은 무슨 색일까요?'),
          6: Q('What color is the castle?', 'White castle',
               ['White castle', 'Black castle', 'Brown castle'],
               [['white']],
               '성은 무슨 색일까요?'),
          8: Q('What color is the castle on the cliff?', 'The castle is white.',
               ['The castle is white.', 'The castle is black.', 'The castle is brown.'],
               [['castle'], ['white']],
               '절벽 위의 성은 무슨 색일까요?')
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
          4: Q('What color is her dress?', 'Purple',
               ['Purple', 'Orange', 'Green'],
               [['purple', 'violet', 'lavender']],
               '그녀의 드레스는 무슨 색일까요?'),
          6: Q('What color is her dress?', 'Purple dress',
               ['Purple dress', 'Orange dress', 'Green dress'],
               [['purple', 'violet'], ['dress']],
               '그녀의 드레스는 무슨 색일까요?'),
          8: Q('What color is her dress?', 'She is wearing a purple dress.',
               ['She is wearing a purple dress.', 'She is wearing an orange dress.', 'She is wearing a green dress.'],
               [['purple', 'violet'], ['dress'], ['wear']],
               '그녀의 드레스는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What color is her hair?', 'Brown',
               ['Brown', 'Black', 'Red'],
               [['brown']],
               '그녀의 머리카락은 무슨 색일까요?'),
          6: Q('What color is her hair?', 'Brown hair',
               ['Brown hair', 'Black hair', 'Red hair'],
               [['brown'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?'),
          8: Q('What color is her hair?', 'She has brown hair with red roses.',
               ['She has brown hair with red roses.', 'She has black hair with blue stars.', 'She has yellow hair with pink shells.'],
               [['brown'], ['hair']],
               '그녀의 머리카락은 무슨 색이고 무엇이 꽂혀 있나요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('What is she touching?', 'Wheel',
               ['Wheel', 'Ball', 'Lamp'],
               [['wheel']],
               '그녀는 무엇을 만지고 있나요?'),
          6: Q('What is she touching?', 'Spinning wheel',
               ['Spinning wheel', 'Silver ball', 'Golden lamp'],
               [['wheel']],
               '그녀는 무엇을 만지고 있나요?'),
          8: Q('What is she touching?', 'She is touching an old spinning wheel.',
               ['She is touching an old spinning wheel.', 'She is touching a silver ball.', 'She is touching a golden lamp.'],
               [['wheel'], ['touch']],
               '그녀는 무엇을 만지고 있나요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('What room is she in?', 'Tower',
               ['Tower', 'Cave', 'Boat'],
               [['tower']],
               '그녀는 어느 방에 있나요?'),
          6: Q('Where is she?', 'In a tower room',
               ['In a tower room', 'In a dark cave', 'On a small boat'],
               [['tower']],
               '그녀는 어디에 있나요?'),
          8: Q('Where is she?', 'She is in a tower room.',
               ['She is in a tower room.', 'She is in a dark cave.', 'She is on a small boat.'],
               [['tower']],
               '그녀는 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('Where is she?', 'Forest',
               ['Forest', 'Snow', 'Sea'],
               [['forest', 'wood']],
               '그녀는 어디에 있나요?'),
          6: Q('Where is she laughing?', 'In the forest',
               ['In the forest', 'In the snow', 'In the sea'],
               [['forest', 'wood', 'woods']],
               '그녀는 어디에서 웃고 있나요?'),
          8: Q('Where is she laughing?', 'She is laughing in the forest.',
               ['She is laughing in the forest.', 'She is laughing in the snow.', 'She is laughing in the sea.'],
               [['forest', 'wood']],
               '그녀는 어디에서 웃고 있나요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('What is in her hair?', 'Roses',
               ['Roses', 'Stars', 'Shells'],
               [['rose', 'flower']],
               '그녀의 머리에는 무엇이 있나요?'),
          6: Q('What is in her hair?', 'Red roses',
               ['Red roses', 'Blue stars', 'Pink shells'],
               [['rose', 'flower']],
               '그녀의 머리에는 무엇이 있나요?'),
          8: Q('What is in her hair?', 'She has red roses in her hair.',
               ['She has red roses in her hair.', 'She has blue stars in her hair.', 'She has pink shells in her hair.'],
               [['rose', 'flower']],
               '그녀의 머리에는 무엇이 꽂혀 있나요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What flowers are around her?', 'Roses',
               ['Roses', 'Tulips', 'Daisies'],
               [['rose']],
               '그녀 주변에 어떤 꽃이 있나요?'),
          6: Q('What flowers are around her?', 'Pink roses',
               ['Pink roses', 'Yellow tulips', 'White daisies'],
               [['rose']],
               '그녀 주변에 어떤 꽃이 있나요?'),
          8: Q('What is all around her in the garden?', 'There are pink roses all around her.',
               ['There are pink roses all around her.', 'There are yellow tulips all around her.', 'There are white daisies all around her.'],
               [['rose']],
               '정원에서 그녀 주변에 무엇이 가득하나요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('Where are the roses?', 'In the garden',
               ['In the garden', 'In the kitchen', 'In the school'],
               [['garden']],
               '장미는 어디에 있나요?'),
          6: Q('Where are the roses?', 'In a rose garden',
               ['In a rose garden', 'In a dark cave', 'On a small boat'],
               [['garden', 'rose']],
               '장미는 어디에 있나요?'),
          8: Q('Where is she at sunrise?', 'She is in a rose garden at sunrise.',
               ['She is in a rose garden at sunrise.', 'She is in a dark cave at sunrise.', 'She is on a small boat at sunrise.'],
               [['garden']],
               '해가 뜰 때 그녀는 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('What is she doing?', 'Laughing',
               ['Laughing', 'Sleeping', 'Crying'],
               [['laugh']],
               '그녀는 무엇을 하고 있나요?'),
          6: Q('What is she doing in the forest?', 'She is laughing',
               ['She is laughing', 'She is sleeping', 'She is crying'],
               [['laugh']],
               '그녀는 숲에서 무엇을 하고 있나요?'),
          8: Q('What is she doing in the forest?', 'She is laughing in the forest.',
               ['She is laughing in the forest.', 'She is sleeping in the forest.', 'She is crying in the forest.'],
               [['laugh']],
               '그녀는 숲에서 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What color are the roses?', 'Pink',
               ['Pink', 'Yellow', 'Blue'],
               [['pink']],
               '장미는 무슨 색일까요?'),
          6: Q('What color are the roses around her?', 'Pink roses',
               ['Pink roses', 'Yellow roses', 'Blue roses'],
               [['pink'], ['rose']],
               '그녀 주변의 장미는 무슨 색일까요?'),
          8: Q('What color are the roses around her?', 'The roses around her are pink.',
               ['The roses around her are pink.', 'The roses around her are yellow.', 'The roses around her are blue.'],
               [['rose'], ['pink']],
               '그녀 주변의 장미는 무슨 색일까요?')
        }
      }
    ]
  },

  {
    id: 'el',
    name: 'The Snow Queen',
    nameKo: '눈의 여왕',
    cardNameKo: '눈의 여왕 엘사',   /* 첫 화면 카드에만 쓰는 이름 (문제·결과 제목은 nameKo) */
    title: 'The Ice Castle',
    titleKo: '얼음 성',
    color: '#63b8ff',
    items: [
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What is on her head?', 'Crown',
               ['Crown', 'Hat', 'Flower'],
               [['crown', 'tiara']],
               '그녀의 머리 위에 무엇이 있나요?'),
          6: Q('What is on her head?', 'Ice crown',
               ['Ice crown', 'Big hat', 'Red flower'],
               [['crown', 'tiara']],
               '그녀의 머리 위에 무엇이 있나요?'),
          8: Q('What is on her head?', 'She is wearing an ice crown.',
               ['She is wearing an ice crown.', 'She is wearing a big hat.', 'She is wearing a red flower.'],
               [['crown', 'tiara']],
               '그녀의 머리 위에 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What color is her dress?', 'Blue',
               ['Blue', 'Red', 'Yellow'],
               [['blue']],
               '그녀의 드레스는 무슨 색일까요?'),
          6: Q('What color is her dress?', 'Icy blue dress',
               ['Icy blue dress', 'Red dress', 'Yellow dress'],
               [['blue'], ['dress']],
               '그녀의 드레스는 무슨 색일까요?'),
          8: Q('What color is her dress?', 'She is wearing an icy blue dress.',
               ['She is wearing an icy blue dress.', 'She is wearing a red dress.', 'She is wearing a yellow dress.'],
               [['blue'], ['dress'], ['wear']],
               '그녀의 드레스는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('Who is she?', 'Snow Queen',
               ['Snow Queen', 'Snow White', 'Cinderella'],
               [['queen', 'elsa']],
               '그녀는 누구인가요?'),
          6: Q('Who is she?', 'She is the Snow Queen',
               ['She is the Snow Queen', 'She is Snow White', 'She is Cinderella'],
               [['queen', 'elsa']],
               '그녀는 누구인가요?'),
          8: Q('Who is she?', 'She is the Snow Queen of the ice castle.',
               ['She is the Snow Queen of the ice castle.', 'She is Snow White of the forest cottage.', 'She is Cinderella of the palace.'],
               [['queen', 'elsa']],
               '그녀는 누구인가요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q('What is beside her?', 'Snowman',
               ['Snowman', 'Snowball', 'Boat'],
               [['snowman']],
               '그녀 옆에 무엇이 있나요?'),
          6: Q('What is beside her in the snow?', 'Happy snowman',
               ['Happy snowman', 'Big snow castle', 'Small boat'],
               [['snowman']],
               '눈 속에서 그녀 옆에 무엇이 있나요?'),
          8: Q('What is beside her in the snow?', 'There is a happy snowman beside her.',
               ['There is a happy snowman beside her.', 'There is a big snow castle beside her.', 'There is a small boat beside her.'],
               [['snowman']],
               '눈 속에서 그녀 옆에 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q("What is the snowman's nose?", 'Carrot',
               ['Carrot', 'Apple', 'Flower'],
               [['carrot']],
               '눈사람의 코는 무엇인가요?'),
          6: Q("What is the snowman's nose?", 'Carrot nose',
               ['Carrot nose', 'Apple nose', 'Flower nose'],
               [['carrot']],
               '눈사람의 코는 무엇인가요?'),
          8: Q('What does the snowman have for a nose?', 'The snowman has a carrot nose.',
               ['The snowman has a carrot nose.', 'The snowman has an apple nose.', 'The snowman has a flower nose.'],
               [['carrot']],
               '눈사람의 코는 무엇인가요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('What is the palace made of?', 'Ice',
               ['Ice', 'Wood', 'Sand'],
               [['ice']],
               '이 궁전은 무엇으로 만들어졌나요?'),
          6: Q('What is the palace made of?', 'Clear ice',
               ['Clear ice', 'Brown wood', 'Soft sand'],
               [['ice']],
               '이 궁전은 무엇으로 만들어졌나요?'),
          8: Q('What is the palace made of?', 'The palace is made of clear ice.',
               ['The palace is made of clear ice.', 'The palace is made of brown wood.', 'The palace is made of soft sand.'],
               [['ice']],
               '이 궁전은 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('What is falling in the castle?', 'Snow',
               ['Snow', 'Rain', 'Leaves'],
               [['snow', 'snowflake']],
               '성 안에 무엇이 내리고 있나요?'),
          6: Q('What is falling in the castle?', 'Snowflakes',
               ['Snowflakes', 'Raindrops', 'Leaves'],
               [['snow', 'snowflake']],
               '성 안에 무엇이 내리고 있나요?'),
          8: Q('What is falling inside the ice castle?', 'Snowflakes are falling inside the ice castle.',
               ['Snowflakes are falling inside the ice castle.', 'Raindrops are falling inside the ice castle.', 'Leaves are falling inside the ice castle.'],
               [['snow', 'snowflake']],
               '얼음 성 안에 무엇이 내리고 있나요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('What color are the lights in the sky?', 'Green',
               ['Green', 'Red', 'Yellow'],
               [['green']],
               '하늘의 빛은 무슨 색일까요?'),
          6: Q('What color are the lights in the sky?', 'Green lights',
               ['Green lights', 'Red lights', 'Yellow lights'],
               [['green'], ['light']],
               '하늘의 빛은 무슨 색일까요?'),
          8: Q('What can you see in the night sky?', 'The lights in the sky are green and purple.',
               ['The lights in the sky are green and purple.', 'The lights in the sky are red and orange.', 'The lights in the sky are black and white.'],
               [['light', 'aurora', 'northern']],
               '밤하늘에 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('Where is she?', 'Mountain',
               ['Mountain', 'Beach', 'Desert'],
               [['mountain']],
               '그녀는 어디에 있나요?'),
          6: Q('Where is she?', 'On a snowy mountain',
               ['On a snowy mountain', 'On a sunny beach', 'In a hot desert'],
               [['mountain']],
               '그녀는 어디에 있나요?'),
          8: Q('Where is she standing?', 'She is standing on a snowy mountain.',
               ['She is standing on a snowy mountain.', 'She is standing on a sunny beach.', 'She is standing in a hot desert.'],
               [['mountain']],
               '그녀는 어디에 서 있나요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q('What color is the snow?', 'White',
               ['White', 'Brown', 'Green'],
               [['white']],
               '눈은 무슨 색일까요?'),
          6: Q('What color is the snow?', 'White snow',
               ['White snow', 'Brown snow', 'Green snow'],
               [['white'], ['snow']],
               '눈은 무슨 색일까요?'),
          8: Q('What color is the snow?', 'The snow is white.',
               ['The snow is white.', 'The snow is brown.', 'The snow is green.'],
               [['snow'], ['white']],
               '눈은 무슨 색일까요?')
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
          4: Q('What color is her dress?', 'Purple',
               ['Purple', 'Brown', 'Grey'],
               [['purple', 'violet', 'lavender']],
               '그녀의 드레스는 무슨 색일까요?'),
          6: Q('What color is her dress?', 'Purple dress',
               ['Purple dress', 'Brown dress', 'Grey dress'],
               [['purple', 'violet'], ['dress']],
               '그녀의 드레스는 무슨 색일까요?'),
          8: Q('What color is her dress?', 'She is wearing a purple dress.',
               ['She is wearing a purple dress.', 'She is wearing a brown dress.', 'She is wearing a grey dress.'],
               [['purple', 'violet'], ['dress'], ['wear']],
               '그녀의 드레스는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What color is her hair?', 'Gold',
               ['Gold', 'Black', 'Brown'],
               [['gold', 'golden', 'blonde', 'yellow']],
               '그녀의 머리카락은 무슨 색일까요?'),
          6: Q('What color is her hair?', 'Long golden hair',
               ['Long golden hair', 'Short black hair', 'Short brown hair'],
               [['gold', 'golden', 'blonde', 'yellow'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?'),
          8: Q('What color is her hair?', 'She has long golden hair with flowers.',
               ['She has long golden hair with flowers.', 'She has short black hair with flowers.', 'She has short brown hair with flowers.'],
               [['gold', 'golden', 'blonde', 'yellow'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('Where does she live?', 'Tower',
               ['Tower', 'Cave', 'Boat'],
               [['tower']],
               '그녀는 어디에 살고 있나요?'),
          6: Q('Where does she live?', 'In a tall tower',
               ['In a tall tower', 'In a dark cave', 'In a small boat'],
               [['tower']],
               '그녀는 어디에 살고 있나요?'),
          8: Q('Where does she live?', 'She lives in a tall stone tower.',
               ['She lives in a tall stone tower.', 'She lives in a dark cave.', 'She lives in a small boat.'],
               [['tower']],
               '그녀는 어디에 살고 있나요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What can she see below?', 'Forest',
               ['Forest', 'Sea', 'Desert'],
               [['forest', 'wood']],
               '그녀 아래로 무엇이 보이나요?'),
          6: Q('What can she see below?', 'Green forest',
               ['Green forest', 'Blue sea', 'Yellow desert'],
               [['forest', 'wood']],
               '그녀 아래로 무엇이 보이나요?'),
          8: Q('What can she see below the tower?', 'She can see a green forest below.',
               ['She can see a green forest below.', 'She can see a blue sea below.', 'She can see a yellow desert below.'],
               [['forest', 'wood']],
               '탑 아래로 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What color is her little friend?', 'Green',
               ['Green', 'Pink', 'Blue'],
               [['green']],
               '작은 친구는 무슨 색일까요?'),
          6: Q('What color is her little friend?', 'Green frog',
               ['Green frog', 'Pink pig', 'Blue bird'],
               [['green'], ['frog']],
               '작은 친구는 무슨 색일까요?'),
          8: Q('What is her little friend?', 'Her little friend is a green frog.',
               ['Her little friend is a green frog.', 'Her little friend is a pink pig.', 'Her little friend is a blue bird.'],
               [['frog']],
               '그녀의 작은 친구는 무엇인가요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What is she doing?', 'Painting',
               ['Painting', 'Sleeping', 'Swimming'],
               [['paint', 'draw']],
               '그녀는 무엇을 하고 있나요?'),
          6: Q('What is she doing?', 'She is painting',
               ['She is painting', 'She is sleeping', 'She is swimming'],
               [['paint', 'draw']],
               '그녀는 무엇을 하고 있나요?'),
          8: Q('What is she doing in the meadow?', 'She is painting a picture.',
               ['She is painting a picture.', 'She is sleeping in the grass.', 'She is swimming in the river.'],
               [['paint', 'draw']],
               '들판에서 그녀는 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What is flying in the sky?', 'Lanterns',
               ['Lanterns', 'Birds', 'Kites'],
               [['lantern', 'light']],
               '하늘로 날아가는 것은 무엇인가요?'),
          6: Q('What is flying in the sky?', 'Many lanterns',
               ['Many lanterns', 'Many birds', 'Many kites'],
               [['lantern']],
               '하늘로 날아가는 것은 무엇인가요?'),
          8: Q('What is flying in the sky?', 'Many glowing lanterns are flying in the sky.',
               ['Many glowing lanterns are flying in the sky.', 'Many birds are flying in the sky.', 'Many kites are flying in the sky.'],
               [['lantern']],
               '하늘로 날아가는 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('Where is she?', 'Boat',
               ['Boat', 'Car', 'Train'],
               [['boat', 'ship']],
               '그녀는 어디에 있나요?'),
          6: Q('Where is she?', 'In a small boat',
               ['In a small boat', 'In a big car', 'On a fast train'],
               [['boat', 'ship']],
               '그녀는 어디에 있나요?'),
          8: Q('Where is she sitting?', 'She is sitting in a small boat.',
               ['She is sitting in a small boat.', 'She is sitting in a big car.', 'She is sitting on a fast train.'],
               [['boat', 'ship']],
               '그녀는 어디에 앉아 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What is in her hair?', 'Flowers',
               ['Flowers', 'Stars', 'Shells'],
               [['flower']],
               '그녀의 머리에는 무엇이 있나요?'),
          6: Q('What is in her hair?', 'Little flowers',
               ['Little flowers', 'Little stars', 'Little shells'],
               [['flower']],
               '그녀의 머리에는 무엇이 있나요?'),
          8: Q('What is in her hair?', 'She has flowers in her hair.',
               ['She has flowers in her hair.', 'She has stars in her hair.', 'She has shells in her hair.'],
               [['flower']],
               '그녀의 머리에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('Where is she painting?', 'Meadow',
               ['Meadow', 'Beach', 'Kitchen'],
               [['meadow']],
               '그녀는 어디에서 그림을 그리나요?'),
          6: Q('Where is she painting?', 'In a meadow',
               ['In a meadow', 'On a beach', 'In a kitchen'],
               [['meadow']],
               '그녀는 어디에서 그림을 그리나요?'),
          8: Q('Where is she painting a picture?', 'She is painting in the meadow.',
               ['She is painting in the meadow.', 'She is painting on the beach.', 'She is painting in the kitchen.'],
               [['meadow']],
               '그녀는 어디에서 그림을 그리나요?')
        }
      }
    ]
  }
];
