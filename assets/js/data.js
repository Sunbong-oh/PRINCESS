/* Princess Talk — story & question data
   6명 공주 × 4장 그림 = 24장, 총 50문항 (문항마다 4살·6살·8살 3단계).

   · 그림 속 사실은 이미지 생성 프롬프트와 이전 검증 기록으로 확인한 것만 씁니다.
     (백설공주 컵 5개·사과 3개, 인어공주 물고기 5마리·진주 3개만 개수 세기)
   · 잠자는 숲속의 공주 숲 장면(sb-2-forest)은 토끼 그림이 아니라 아기천사처럼 보이는
     작은 요정이 보인다는 피드백이 있어, 토끼/동물 개수 문항을 모두 빼고 숲·장미로만 묻습니다.
   · 4살 보기는 관사 A/An을 붙이지 않은 단어 하나로 씁니다. (A ball → Ball)
*/

const LEVELS = [4, 6, 8];

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
          4: Q('Who is behind the table?', 'Gnomes',
               ['Gnomes', 'Cats', 'Kings'],
               [['gnome', 'dwarf']],
               '탁자 뒤에는 누가 있나요?'),
          6: Q('Who is behind the table?', 'Little gnomes',
               ['Little gnomes', 'Little cats', 'Little kings'],
               [['gnome', 'dwarf']],
               '탁자 뒤에는 누가 있나요?'),
          8: Q('Who is behind the table?', 'The little gnomes are behind the table.',
               ['The little gnomes are behind the table.', 'The little cats are behind the table.', 'The little kings are behind the table.'],
               [['gnome', 'dwarf']],
               '탁자 뒤에는 누가 있나요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('How many apples are in the basket?', 'Three',
               ['Two', 'Three', 'Four'],
               [['three', '3']],
               '바구니 안에 사과가 몇 개 있나요?'),
          6: Q('How many apples are in the basket?', 'Three apples',
               ['Two apples', 'Three apples', 'Four apples'],
               [['three', '3'], ['apple']],
               '바구니 안에 사과가 몇 개 있나요?'),
          8: Q('How many apples are in her basket?', 'There are three apples in her basket.',
               ['There are two apples in her basket.', 'There are three apples in her basket.', 'There are four apples in her basket.'],
               [['three', '3'], ['apple']],
               '바구니 안에 사과가 몇 개 있나요?')
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
          4: Q('How many fish are with her?', 'Five',
               ['Three', 'Five', 'Six'],
               [['five', '5']],
               '물고기가 몇 마리 있나요?'),
          6: Q('How many fish are with her?', 'Five fish',
               ['Three fish', 'Five fish', 'Six fish'],
               [['five', '5'], ['fish']],
               '물고기가 몇 마리 있나요?'),
          8: Q('How many fish are swimming with her?', 'There are five fish swimming with her.',
               ['There are three fish swimming with her.', 'There are five fish swimming with her.', 'There are six fish swimming with her.'],
               [['five', '5'], ['fish']],
               '물고기가 몇 마리 있나요?')
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
          4: Q('Where is she?', 'Tower',
               ['Tower', 'Cave', 'Boat'],
               [['tower']],
               '그녀는 어디에 있나요?'),
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
          4: Q('Where is she?', 'Garden',
               ['Garden', 'Kitchen', 'School'],
               [['garden']],
               '그녀는 어디에 있나요?'),
          6: Q('Where is she?', 'In a rose garden',
               ['In a rose garden', 'In a dark cave', 'On a small boat'],
               [['garden', 'rose']],
               '그녀는 어디에 있나요?'),
          8: Q('Where is she at sunrise?', 'She is in a rose garden at sunrise.',
               ['She is in a rose garden at sunrise.', 'She is in a dark cave at sunrise.', 'She is on a small boat at sunrise.'],
               [['garden']],
               '해가 뜰 때 그녀는 어디에 있나요?')
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
               [['gold', 'golden', 'blonde']],
               '그녀의 머리카락은 무슨 색일까요?'),
          6: Q('What color is her hair?', 'Long golden hair',
               ['Long golden hair', 'Short black hair', 'Short brown hair'],
               [['gold', 'golden', 'blonde'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?'),
          8: Q('What color is her hair?', 'She has long golden hair with flowers.',
               ['She has long golden hair with flowers.', 'She has short black hair with flowers.', 'She has short brown hair with flowers.'],
               [['gold', 'golden', 'blonde'], ['hair']],
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
      }
    ]
  }
];
