/* Princess Talk — story & question data
   6명 공주 × 4장 그림 = 24장, 공주마다 정확히 40문항, 총 240문항 (문항마다 4살·6살·8살 3단계).
   12살 모드는 새 문항을 만들지 않고 8살 문장을 그대로 씁니다 — 선택지 없이 바로 말하는 모드라
   (app.js에서 item.q[state.level] || item.q[8] 로 폴백) 240문항 모두 12살에서도 나옵니다.
   한 판은 고른 공주 한 명의 40문항 중 아직 안 푼 10문제를 뽑아 냅니다.
   (4장 이미지당 정확히 10문항씩 — 4판(4일)을 놀면 40문항을 겹치지 않고 모두 풀 수 있습니다.)

   · 그림 속 사실은 이미지를 직접 눈으로 확인한 것만 씁니다 — 잘리거나 모호한 작은 디테일과
     어렵게 세는 개수는 정답으로 쓰지 않습니다.
   · 개수 세기 문항은 두 곳뿐입니다 — 백설공주 컵 5개(탁자 위 한 줄), 인어공주 진주 3개(손에 든 조개 안).
   · 문제 화면은 그림을 object-fit:contain으로 '원본 전체'를 보여줍니다.
     그래서 가장자리·아랫부분에 있는 작은 디테일을 정답으로 삼는 질문은 피해야 합니다.
   · 잠자는 숲속의 공주 숲 장면(sb-2-forest)은 토끼·동물 문항을 쓰지 않고 숲·요정·장미로만 묻습니다.
   · 4살 보기는 관사 A/An을 붙이지 않은 단어 하나로 씁니다. (A ball → Ball)
     문항마다 4살은 한 단어, 6살은 두세 단어, 8살은 문장으로 묻습니다.
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
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('What is on her head?', 'Bow',
               ['Bow', 'Hat', 'Crown'],
               [['bow', 'ribbon']],
               '그녀의 머리 위에는 무엇이 있나요?'),
          6: Q('What is on her head?', 'Red bow',
               ['Red bow', 'Blue bow', 'Green bow'],
               [['red'], ['bow', 'ribbon']],
               '그녀의 머리 위에는 무엇이 있나요?'),
          8: Q('What is on her head?', 'She has a red bow in her hair.',
               ['She has a red bow in her hair.', 'She has a blue hat in her hair.', 'She has a green crown in her hair.'],
               [['bow', 'ribbon'], ['red']],
               '그녀의 머리 위에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('What color is her apron?', 'White',
               ['White', 'Blue', 'Red'],
               [['white']],
               '그녀의 앞치마는 무슨 색일까요?'),
          6: Q('What color is her apron?', 'White apron',
               ['White apron', 'Brown apron', 'Black apron'],
               [['white'], ['apron']],
               '그녀의 앞치마는 무슨 색일까요?'),
          8: Q('What color is her apron?', 'She is wearing a white apron.',
               ['She is wearing a white apron.', 'She is wearing a brown apron.', 'She is wearing a black apron.'],
               [['apron'], ['white']],
               '그녀의 앞치마는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('What is she carrying?', 'Basket',
               ['Basket', 'Book', 'Shoe'],
               [['basket']],
               '그녀는 무엇을 들고 있나요?'),
          6: Q('What is she carrying?', 'Basket of apples',
               ['Basket of apples', 'Basket of eggs', 'Basket of flowers'],
               [['basket'], ['apple']],
               '그녀는 무엇을 들고 있나요?'),
          8: Q('What is she carrying?', 'She is carrying a basket of apples.',
               ['She is carrying a basket of apples.', 'She is carrying a basket of eggs.', 'She is carrying a basket of flowers.'],
               [['basket'], ['apple']],
               '그녀는 무엇을 들고 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('What is behind her?', 'House',
               ['House', 'Boat', 'Train'],
               [['house', 'cottage', 'home']],
               '그녀 뒤에는 무엇이 있나요?'),
          6: Q('What is behind her?', 'Little house',
               ['Little house', 'Big boat', 'Fast train'],
               [['house', 'cottage', 'home']],
               '그녀 뒤에는 무엇이 있나요?'),
          8: Q('What is behind her?', 'There is a little house behind her.',
               ['There is a little house behind her.', 'There is a big boat behind her.', 'There is a fast train behind her.'],
               [['house', 'cottage', 'home']],
               '그녀 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('What color is the door?', 'Brown',
               ['Brown', 'Blue', 'Pink'],
               [['brown', 'wood']],
               '문은 무슨 색일까요?'),
          6: Q('What color is the door?', 'Brown door',
               ['Brown door', 'Blue door', 'Pink door'],
               [['brown', 'wood'], ['door']],
               '문은 무슨 색일까요?'),
          8: Q('What color is the door of the house?', 'The door of the house is brown.',
               ['The door of the house is brown.', 'The door of the house is blue.', 'The door of the house is pink.'],
               [['door'], ['brown', 'wood']],
               '집 문은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('What color are the trees?', 'Green',
               ['Green', 'Yellow', 'Purple'],
               [['green']],
               '나무는 무슨 색일까요?'),
          6: Q('What color are the trees?', 'Green trees',
               ['Green trees', 'Yellow trees', 'Purple trees'],
               [['green'], ['tree']],
               '나무는 무슨 색일까요?'),
          8: Q('What color are the tall trees?', 'The tall trees are green.',
               ['The tall trees are green.', 'The tall trees are yellow.', 'The tall trees are purple.'],
               [['tree'], ['green']],
               '큰 나무들은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('Where is she walking?', 'On a path',
               ['On a path', 'On a boat', 'On a cloud'],
               [['path', 'road']],
               '그녀는 어디를 걷고 있나요?'),
          6: Q('Where is she walking?', 'On a stone path',
               ['On a stone path', 'On a small boat', 'On a soft cloud'],
               [['path', 'road']],
               '그녀는 어디를 걷고 있나요?'),
          8: Q('Where is she walking?', 'She is walking on a stone path.',
               ['She is walking on a stone path.', 'She is walking on a small boat.', 'She is walking on a soft cloud.'],
               [['path', 'road']],
               '그녀는 어디를 걷고 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sw.webp',
        scene: '공주',
        q: {
          4: Q('What color is the window?', 'Yellow',
               ['Yellow', 'Blue', 'Purple'],
               [['yellow']],
               '창문은 무슨 색 빛이 나나요?'),
          6: Q('What color is the window?', 'Yellow window',
               ['Yellow window', 'Blue window', 'Purple window'],
               [['yellow'], ['window']],
               '창문은 무슨 색 빛이 나나요?'),
          8: Q('What color is the little window?', 'The little window is yellow.',
               ['The little window is yellow.', 'The little window is blue.', 'The little window is purple.'],
               [['window'], ['yellow']],
               '작은 창문은 무슨 색 빛이 나나요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('What color is the jewel on the mirror?', 'Purple',
               ['Purple', 'Green', 'Orange'],
               [['purple', 'violet']],
               '거울 위의 보석은 무슨 색일까요?'),
          6: Q('What color is the jewel on the mirror?', 'Purple jewel',
               ['Purple jewel', 'Green jewel', 'Orange jewel'],
               [['purple', 'violet'], ['jewel', 'gem', 'stone']],
               '거울 위의 보석은 무슨 색일까요?'),
          8: Q('What color is the jewel on the mirror?', 'The jewel on the mirror is purple.',
               ['The jewel on the mirror is purple.', 'The jewel on the mirror is green.', 'The jewel on the mirror is orange.'],
               [['jewel', 'gem'], ['purple', 'violet']],
               '거울 위의 보석은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('What is burning beside the mirror?', 'Candle',
               ['Candle', 'Apple', 'Shoe'],
               [['candle', 'candles']],
               '거울 옆에서 무엇이 타고 있나요?'),
          6: Q('What is burning beside the mirror?', 'Tall candle',
               ['Tall candle', 'Big apple', 'Small shoe'],
               [['candle', 'candles']],
               '거울 옆에서 무엇이 타고 있나요?'),
          8: Q('What is burning beside the mirror?', 'The tall candle is burning beside the mirror.',
               ['The tall candle is burning beside the mirror.', 'The big apple is burning beside the mirror.', 'The small shoe is burning beside the mirror.'],
               [['candle', 'candles']],
               '거울 옆에서 무엇이 타고 있나요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('What is behind the mirror?', 'Curtain',
               ['Curtain', 'Door', 'Tree'],
               [['curtain']],
               '거울 뒤에는 무엇이 있나요?'),
          6: Q('What is behind the mirror?', 'Purple curtain',
               ['Purple curtain', 'Brown door', 'Green tree'],
               [['purple', 'violet'], ['curtain']],
               '거울 뒤에는 무엇이 있나요?'),
          8: Q('What is behind the magic mirror?', 'There is a purple curtain behind the magic mirror.',
               ['There is a purple curtain behind the magic mirror.', 'There is a brown door behind the magic mirror.', 'There is a green tree behind the magic mirror.'],
               [['curtain'], ['purple', 'violet']],
               '마법의 거울 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('What is on the small table?', 'Box',
               ['Box', 'Cup', 'Hat'],
               [['box', 'chest']],
               '작은 탁자 위에는 무엇이 있나요?'),
          6: Q('What is on the small table?', 'Treasure box',
               ['Treasure box', 'Little cup', 'Big hat'],
               [['box', 'chest']],
               '작은 탁자 위에는 무엇이 있나요?'),
          8: Q('What is on the small table?', 'There is a treasure box on the small table.',
               ['There is a treasure box on the small table.', 'There is a little cup on the small table.', 'There is a big hat on the small table.'],
               [['box', 'chest'], ['table']],
               '작은 탁자 위에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('Who is in the mirror?', 'Girl',
               ['Girl', 'Cat', 'Bird'],
               [['girl', 'princess', 'woman']],
               '거울 안에는 누가 있나요?'),
          6: Q('Who is in the mirror?', 'Pretty girl',
               ['Pretty girl', 'Little cat', 'Blue bird'],
               [['girl', 'princess'], ['pretty', 'beautiful']],
               '거울 안에는 누가 있나요?'),
          8: Q('Who can she see in the mirror?', 'She can see a pretty girl in the mirror.',
               ['She can see a pretty girl in the mirror.', 'She can see a little cat in the mirror.', 'She can see a blue bird in the mirror.'],
               [['girl', 'princess']],
               '거울 안에서 누가 보이나요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('What color is the wall?', 'Grey',
               ['Grey', 'Pink', 'Orange'],
               [['grey', 'gray']],
               '벽은 무슨 색일까요?'),
          6: Q('What color is the wall?', 'Grey stone',
               ['Grey stone', 'Pink stone', 'Orange stone'],
               [['grey', 'gray'], ['stone', 'wall']],
               '벽은 무슨 색일까요?'),
          8: Q('What is the wall made of?', 'The wall is made of grey stone.',
               ['The wall is made of grey stone.', 'The wall is made of pink stone.', 'The wall is made of orange stone.'],
               [['wall'], ['grey', 'gray', 'stone']],
               '벽은 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('Is her dress long or short?', 'Long',
               ['Long', 'Short', 'Tiny'],
               [['long']],
               '그녀의 드레스는 길까요, 짧을까요?'),
          6: Q('Is her dress long or short?', 'Long dress',
               ['Long dress', 'Short dress', 'Tiny dress'],
               [['long'], ['dress']],
               '그녀의 드레스는 길까요, 짧을까요?'),
          8: Q('Is her dress long or short?', 'She is wearing a long dress.',
               ['She is wearing a long dress.', 'She is wearing a short dress.', 'She is wearing a tiny dress.'],
               [['long'], ['dress']],
               '그녀의 드레스는 길까요, 짧을까요?')
        }
      },
      {
        img: 'assets/img/sw-1-mirror.webp',
        scene: '마법의 거울',
        q: {
          4: Q('Where is the mirror?', 'In a room',
               ['In a room', 'In the sea', 'In the sky'],
               [['room', 'house']],
               '거울은 어디에 있나요?'),
          6: Q('Where is the mirror?', 'In a dark room',
               ['In a dark room', 'In the blue sea', 'In the sky'],
               [['room', 'house']],
               '거울은 어디에 있나요?'),
          8: Q('Where is the magic mirror?', 'The magic mirror is in a dark room.',
               ['The magic mirror is in a dark room.', 'The magic mirror is in the blue sea.', 'The magic mirror is in the sky.'],
               [['mirror'], ['room', 'house']],
               '마법의 거울은 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('What color is the mug in the middle?', 'Blue',
               ['Blue', 'Red', 'Green'],
               [['blue']],
               '가운데 컵은 무슨 색일까요?'),
          6: Q('What color is the mug in the middle?', 'Blue mug',
               ['Blue mug', 'Red mug', 'Green mug'],
               [['blue'], ['mug', 'cup']],
               '가운데 컵은 무슨 색일까요?'),
          8: Q('What color is the mug in the middle?', 'The mug in the middle is blue.',
               ['The mug in the middle is blue.', 'The mug in the middle is red.', 'The mug in the middle is green.'],
               [['mug', 'cup'], ['blue']],
               '가운데 컵은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('What color is her bow?', 'Red',
               ['Red', 'Blue', 'Green'],
               [['red']],
               '그녀의 리본은 무슨 색일까요?'),
          6: Q('What color is her bow?', 'Red bow',
               ['Red bow', 'Blue bow', 'Green bow'],
               [['red'], ['bow', 'ribbon']],
               '그녀의 리본은 무슨 색일까요?'),
          8: Q('What color is the bow on her head?', 'The bow on her head is red.',
               ['The bow on her head is red.', 'The bow on her head is blue.', 'The bow on her head is green.'],
               [['bow', 'ribbon'], ['red']],
               '그녀 머리의 리본은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q("What color is the dwarf's beard?", 'White',
               ['White', 'Black', 'Red'],
               [['white']],
               '난쟁이의 수염은 무슨 색일까요?'),
          6: Q("What color is the dwarf's beard?", 'White beard',
               ['White beard', 'Black beard', 'Red beard'],
               [['white'], ['beard']],
               '난쟁이의 수염은 무슨 색일까요?'),
          8: Q("What color is the dwarfs' beard?", 'The dwarfs have long white beards.',
               ['The dwarfs have long white beards.', 'The dwarfs have long black beards.', 'The dwarfs have long red beards.'],
               [['beard'], ['white']],
               '난쟁이들의 수염은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('Where are they?', 'In a house',
               ['In a house', 'In a boat', 'In a cave'],
               [['house', 'cottage', 'home', 'room']],
               '그들은 어디에 있나요?'),
          6: Q('Where are they?', 'In a wooden house',
               ['In a wooden house', 'In a small boat', 'In a dark cave'],
               [['house', 'cottage', 'home']],
               '그들은 어디에 있나요?'),
          8: Q('Where are they?', 'They are in a wooden house.',
               ['They are in a wooden house.', 'They are in a small boat.', 'They are in a dark cave.'],
               [['house', 'cottage', 'home']],
               '그들은 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('What is behind the princess?', 'Window',
               ['Window', 'Door', 'Mirror'],
               [['window']],
               '공주 뒤에는 무엇이 있나요?'),
          6: Q('What is behind the princess?', 'Big window',
               ['Big window', 'Brown door', 'Golden mirror'],
               [['window']],
               '공주 뒤에는 무엇이 있나요?'),
          8: Q('What is behind the princess?', 'There is a big window behind the princess.',
               ['There is a big window behind the princess.', 'There is a brown door behind the princess.', 'There is a golden mirror behind the princess.'],
               [['window']],
               '공주 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('What color is the table?', 'Brown',
               ['Brown', 'Blue', 'Pink'],
               [['brown', 'wood']],
               '탁자는 무슨 색일까요?'),
          6: Q('What color is the table?', 'Brown table',
               ['Brown table', 'Blue table', 'Pink table'],
               [['brown', 'wood'], ['table']],
               '탁자는 무슨 색일까요?'),
          8: Q('What is the table made of?', 'The table is made of brown wood.',
               ['The table is made of brown wood.', 'The table is made of blue wood.', 'The table is made of pink wood.'],
               [['table'], ['brown', 'wood']],
               '탁자는 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/sw-2-mugs.webp',
        scene: '난쟁이 친구들',
        q: {
          4: Q('What is hanging on the wall?', 'Lantern',
               ['Lantern', 'Shoe', 'Book'],
               [['lantern', 'lamp', 'light']],
               '벽에 매달린 것은 무엇인가요?'),
          6: Q('What is hanging on the wall?', 'Little lantern',
               ['Little lantern', 'Small shoe', 'Big book'],
               [['lantern', 'lamp']],
               '벽에 매달린 것은 무엇인가요?'),
          8: Q('What is hanging on the wall?', 'The little lantern is hanging on the wall.',
               ['The little lantern is hanging on the wall.', 'The small shoe is hanging on the wall.', 'The big book is hanging on the wall.'],
               [['lantern', 'lamp'], ['wall']],
               '벽에 매달린 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('What can you see in the background?', 'House',
               ['House', 'Boat', 'Train'],
               [['house', 'cottage', 'home']],
               '뒤쪽 배경에 무엇이 보이나요?'),
          6: Q('What can you see in the background?', 'Little house',
               ['Little house', 'Big boat', 'Fast train'],
               [['house', 'cottage', 'home']],
               '뒤쪽 배경에 무엇이 보이나요?'),
          8: Q('What can you see in the background?', 'You can see a little house in the background.',
               ['You can see a little house in the background.', 'You can see a big boat in the background.', 'You can see a fast train in the background.'],
               [['house', 'cottage', 'home']],
               '뒤쪽 배경에 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('What is she doing?', 'Smiling',
               ['Smiling', 'Sleeping', 'Crying'],
               [['smil', 'happy']],
               '그녀는 무엇을 하고 있나요?'),
          6: Q('What is she doing?', 'She is smiling',
               ['She is smiling', 'She is sleeping', 'She is crying'],
               [['smil', 'happy']],
               '그녀는 무엇을 하고 있나요?'),
          8: Q('What is she doing?', 'She is smiling with an apple in her hand.',
               ['She is smiling with an apple in her hand.', 'She is sleeping with an apple in her hand.', 'She is crying with an apple in her hand.'],
               [['smil'], ['apple']],
               '그녀는 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('Where is the basket?', 'In her hand',
               ['In her hand', 'On her head', 'On the floor'],
               [['hand']],
               '바구니는 어디에 있나요?'),
          6: Q('Where is the basket?', 'In her hand',
               ['In her hand', 'On her head', 'On the floor'],
               [['hand']],
               '바구니는 어디에 있나요?'),
          8: Q('Where is the basket?', 'The basket is in her hand.',
               ['The basket is in her hand.', 'The basket is on her head.', 'The basket is on the floor.'],
               [['basket'], ['hand']],
               '바구니는 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('What is the weather like?', 'Sunny',
               ['Sunny', 'Rainy', 'Snowy'],
               [['sunny', 'sun', 'bright']],
               '날씨는 어떤가요?'),
          6: Q('What is the weather like?', 'Sunny day',
               ['Sunny day', 'Rainy day', 'Snowy day'],
               [['sunny', 'sun'], ['day']],
               '날씨는 어떤가요?'),
          8: Q('What is the weather like?', 'It is a sunny day.',
               ['It is a sunny day.', 'It is a rainy day.', 'It is a snowy day.'],
               [['sunny', 'sun']],
               '날씨는 어떤가요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('What is beside the house?', 'Flowers',
               ['Flowers', 'Cars', 'Snow'],
               [['flower']],
               '집 옆에는 무엇이 있나요?'),
          6: Q('What is beside the house?', 'Red flowers',
               ['Red flowers', 'Red cars', 'White snow'],
               [['red'], ['flower']],
               '집 옆에는 무엇이 있나요?'),
          8: Q('What is growing beside the house?', 'Red flowers are growing beside the house.',
               ['Red flowers are growing beside the house.', 'Red cars are standing beside the house.', 'White snow is falling beside the house.'],
               [['flower'], ['red']],
               '집 옆에는 무엇이 자라고 있나요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('What covers the house?', 'Leaves',
               ['Leaves', 'Snow', 'Sand'],
               [['leaf', 'leaves', 'vine', 'ivy']],
               '집을 덮고 있는 것은 무엇인가요?'),
          6: Q('What covers the house?', 'Green leaves',
               ['Green leaves', 'White snow', 'Yellow sand'],
               [['green'], ['leaf', 'leaves', 'vine', 'ivy']],
               '집을 덮고 있는 것은 무엇인가요?'),
          8: Q('What covers the wall of the house?', 'Green leaves cover the wall of the house.',
               ['Green leaves cover the wall of the house.', 'White snow covers the wall of the house.', 'Yellow sand covers the wall of the house.'],
               [['leaf', 'leaves', 'vine', 'ivy'], ['green']],
               '집 벽을 덮고 있는 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/sw-3-apples.webp',
        scene: '빨간 사과',
        q: {
          4: Q('What fruit is in her hand?', 'Apple',
               ['Apple', 'Pear', 'Banana'],
               [['apple']],
               '그녀의 손에 있는 과일은 무엇인가요?'),
          6: Q('What fruit is in her hand?', 'Red apple',
               ['Red apple', 'Green pear', 'Yellow banana'],
               [['apple']],
               '그녀의 손에 있는 과일은 무엇인가요?'),
          8: Q('What fruit is she holding up?', 'She is holding up a red apple.',
               ['She is holding up a red apple.', 'She is holding up a green pear.', 'She is holding up a yellow banana.'],
               [['apple']],
               '그녀가 들어 올린 과일은 무엇인가요?')
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
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What is on her head?', 'Tiara',
               ['Tiara', 'Hat', 'Shoe'],
               [['tiara', 'crown']],
               '그녀의 머리 위에는 무엇이 있나요?'),
          6: Q('What is on her head?', 'Blue tiara',
               ['Blue tiara', 'Red hat', 'Brown shoe'],
               [['blue'], ['tiara', 'crown']],
               '그녀의 머리 위에는 무엇이 있나요?'),
          8: Q('What is on her head?', 'She is wearing a blue tiara.',
               ['She is wearing a blue tiara.', 'She is wearing a red hat.', 'She is wearing a brown shoe.'],
               [['tiara', 'crown'], ['blue']],
               '그녀의 머리 위에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What can you see outside the window?', 'Castle',
               ['Castle', 'Boat', 'Train'],
               [['castle', 'palace']],
               '창밖으로 무엇이 보이나요?'),
          6: Q('What can you see outside the window?', 'Big castle',
               ['Big castle', 'Small boat', 'Fast train'],
               [['castle', 'palace']],
               '창밖으로 무엇이 보이나요?'),
          8: Q('What can you see outside the window?', 'She can see a big castle outside the window.',
               ['She can see a big castle outside the window.', 'She can see a small boat outside the window.', 'She can see a fast train outside the window.'],
               [['castle', 'palace'], ['window']],
               '창밖으로 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What is she wearing on her neck?', 'Necklace',
               ['Necklace', 'Scarf', 'Hat'],
               [['necklace']],
               '그녀의 목에는 무엇이 있나요?'),
          6: Q('What is she wearing on her neck?', 'Blue necklace',
               ['Blue necklace', 'Red scarf', 'Green hat'],
               [['blue'], ['necklace']],
               '그녀의 목에는 무엇이 있나요?'),
          8: Q('What is she wearing on her neck?', 'She is wearing a blue necklace.',
               ['She is wearing a blue necklace.', 'She is wearing a red scarf.', 'She is wearing a green hat.'],
               [['necklace'], ['blue']],
               '그녀의 목에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What is in the night sky?', 'Stars',
               ['Stars', 'Birds', 'Kites'],
               [['star']],
               '밤하늘에는 무엇이 있나요?'),
          6: Q('What is in the night sky?', 'Many stars',
               ['Many stars', 'Many birds', 'Many kites'],
               [['star']],
               '밤하늘에는 무엇이 있나요?'),
          8: Q('What is in the night sky?', 'There are many stars in the night sky.',
               ['There are many stars in the night sky.', 'There are many birds in the night sky.', 'There are many kites in the night sky.'],
               [['star'], ['sky']],
               '밤하늘에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What can you see on the left?', 'Flowers',
               ['Flowers', 'Apples', 'Candles'],
               [['flower', 'rose']],
               '왼쪽에는 무엇이 보이나요?'),
          6: Q('What can you see on the left?', 'Pink roses',
               ['Pink roses', 'Red apples', 'Tall candles'],
               [['pink'], ['rose', 'flower']],
               '왼쪽에는 무엇이 보이나요?'),
          8: Q('What can you see on the left?', 'There are pink roses on the left.',
               ['There are pink roses on the left.', 'There are red apples on the left.', 'There are tall candles on the left.'],
               [['rose', 'flower'], ['pink']],
               '왼쪽에는 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What is on the wall?', 'Mirror',
               ['Mirror', 'Clock', 'Door'],
               [['mirror']],
               '벽에는 무엇이 있나요?'),
          6: Q('What is on the wall?', 'Golden mirror',
               ['Golden mirror', 'Big clock', 'Brown door'],
               [['gold', 'golden'], ['mirror']],
               '벽에는 무엇이 있나요?'),
          8: Q('What is on the wall on the left?', 'There is a golden mirror on the wall.',
               ['There is a golden mirror on the wall.', 'There is a big clock on the wall.', 'There is a brown door on the wall.'],
               [['mirror'], ['gold', 'golden']],
               '왼쪽 벽에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ci.webp',
        scene: '공주',
        q: {
          4: Q('What is on her ears?', 'Earrings',
               ['Earrings', 'Glasses', 'Hat'],
               [['earring']],
               '그녀의 귀에는 무엇이 있나요?'),
          6: Q('What is on her ears?', 'Blue earrings',
               ['Blue earrings', 'Black glasses', 'Red hat'],
               [['blue'], ['earring']],
               '그녀의 귀에는 무엇이 있나요?'),
          8: Q('What is she wearing on her ears?', 'She is wearing blue earrings.',
               ['She is wearing blue earrings.', 'She is wearing black glasses.', 'She is wearing a red hat.'],
               [['earring'], ['blue']],
               '그녀의 귀에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('What is the big round thing in the sky?', 'Moon',
               ['Moon', 'Sun', 'Balloon'],
               [['moon']],
               '하늘에 있는 크고 둥근 것은 무엇인가요?'),
          6: Q('What is the big round thing in the sky?', 'Full moon',
               ['Full moon', 'Hot sun', 'Red balloon'],
               [['moon']],
               '하늘에 있는 크고 둥근 것은 무엇인가요?'),
          8: Q('What is the big round thing in the sky?', 'There is a full moon in the sky.',
               ['There is a full moon in the sky.', 'There is a hot sun in the sky.', 'There is a red balloon in the sky.'],
               [['moon'], ['sky']],
               '하늘에 있는 크고 둥근 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('What is beside the carriage door?', 'Steps',
               ['Steps', 'Bed', 'Boat'],
               [['step', 'stair']],
               '마차 문 옆에는 무엇이 있나요?'),
          6: Q('What is beside the carriage door?', 'Little steps',
               ['Little steps', 'Soft bed', 'Small boat'],
               [['step', 'stair']],
               '마차 문 옆에는 무엇이 있나요?'),
          8: Q('What is beside the carriage door?', 'There are little steps beside the carriage door.',
               ['There are little steps beside the carriage door.', 'There is a soft bed beside the carriage door.', 'There is a small boat beside the carriage door.'],
               [['step', 'stair'], ['carriage']],
               '마차 문 옆에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('Where is the castle?', 'On the hill',
               ['On the hill', 'In the sea', 'In a cave'],
               [['hill', 'mountain']],
               '성은 어디에 있나요?'),
          6: Q('Where is the castle?', 'On a hill',
               ['On a hill', 'In the sea', 'In a cave'],
               [['hill', 'mountain']],
               '성은 어디에 있나요?'),
          8: Q('Where is the castle?', 'The castle is on a hill.',
               ['The castle is on a hill.', 'The castle is in the sea.', 'The castle is in a cave.'],
               [['castle'], ['hill', 'mountain']],
               '성은 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('What is she touching?', 'Her dress',
               ['Her dress', 'Apple', 'Book'],
               [['dress', 'skirt', 'gown']],
               '그녀는 무엇을 만지고 있나요?'),
          6: Q('What is she touching?', 'Her blue dress',
               ['Her blue dress', 'Old book', 'Red apple'],
               [['dress', 'skirt'], ['blue']],
               '그녀는 무엇을 만지고 있나요?'),
          8: Q('What is she touching?', 'She is touching her blue dress.',
               ['She is touching her blue dress.', 'She is touching an old book.', 'She is touching a red apple.'],
               [['dress', 'skirt'], ['blue']],
               '그녀는 무엇을 만지고 있나요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('What time of day is it?', 'Night',
               ['Night', 'Morning', 'Noon'],
               [['night']],
               '지금은 언제인가요?'),
          6: Q('What time of day is it?', 'Night time',
               ['Night time', 'Morning time', 'Lunch time'],
               [['night']],
               '지금은 언제인가요?'),
          8: Q('What time of day is it?', 'It is night time.',
               ['It is night time.', 'It is morning time.', 'It is lunch time.'],
               [['night']],
               '지금은 언제인가요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('Who is standing in front of the carriage?', 'Cinderella',
               ['Cinderella', 'Snow White', 'Rapunzel'],
               [['cinderella']],
               '마차 앞에 서 있는 사람은 누구인가요?'),
          6: Q('Who is standing in front of the carriage?', 'Cinderella',
               ['Cinderella', 'Snow White', 'Rapunzel'],
               [['cinderella']],
               '마차 앞에 서 있는 사람은 누구인가요?'),
          8: Q('Who is standing in front of the carriage?', 'Cinderella is standing in front of the carriage.',
               ['Cinderella is standing in front of the carriage.', 'Snow White is standing in front of the carriage.', 'Rapunzel is standing in front of the carriage.'],
               [['cinderella']],
               '마차 앞에 서 있는 사람은 누구인가요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('What is behind her?', 'Castle',
               ['Castle', 'Forest', 'Beach'],
               [['castle', 'palace']],
               '그녀 뒤에는 무엇이 있나요?'),
          6: Q('What is behind her?', 'Blue castle',
               ['Blue castle', 'Green forest', 'Sunny beach'],
               [['castle', 'palace']],
               '그녀 뒤에는 무엇이 있나요?'),
          8: Q('What is behind her?', 'There is a castle behind her.',
               ['There is a castle behind her.', 'There is a forest behind her.', 'There is a beach behind her.'],
               [['castle', 'palace']],
               '그녀 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ci-1-carriage.webp',
        scene: '호박 마차',
        q: {
          4: Q('Where does the path lead?', 'To the castle',
               ['To the castle', 'To the sea', 'To the sky'],
               [['castle', 'palace']],
               '길은 어디로 이어지나요?'),
          6: Q('Where does the path lead?', 'To the castle gate',
               ['To the castle gate', 'To the deep sea', 'To the blue sky'],
               [['castle', 'palace']],
               '길은 어디로 이어지나요?'),
          8: Q('Where does the path lead?', 'The path leads to the castle.',
               ['The path leads to the castle.', 'The path leads to the deep sea.', 'The path leads to the blue sky.'],
               [['path'], ['castle', 'palace']],
               '길은 어디로 이어지나요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('What is hanging from the ceiling?', 'Chandelier',
               ['Chandelier', 'Star', 'Cloud'],
               [['chandelier', 'light', 'lamp']],
               '천장에 매달린 것은 무엇인가요?'),
          6: Q('What is hanging from the ceiling?', 'Golden chandelier',
               ['Golden chandelier', 'Little star', 'White cloud'],
               [['chandelier', 'light'], ['gold', 'golden']],
               '천장에 매달린 것은 무엇인가요?'),
          8: Q('What is hanging from the ceiling?', 'The golden chandelier is hanging from the ceiling.',
               ['The golden chandelier is hanging from the ceiling.', 'The little star is hanging from the ceiling.', 'The white cloud is hanging from the ceiling.'],
               [['chandelier', 'light'], ['ceiling'], ['gold', 'golden']],
               '천장에 매달린 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('What are the people doing?', 'Dancing',
               ['Dancing', 'Sleeping', 'Eating'],
               [['danc']],
               '사람들은 무엇을 하고 있나요?'),
          6: Q('What are the people doing?', 'Dancing together',
               ['Dancing together', 'Sleeping together', 'Eating together'],
               [['danc']],
               '사람들은 무엇을 하고 있나요?'),
          8: Q('What are the people doing?', 'The people are dancing together.',
               ['The people are dancing together.', 'The people are sleeping together.', 'The people are eating together.'],
               [['danc'], ['people']],
               '사람들은 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('What are the tall things in the hall?', 'Columns',
               ['Columns', 'Trees', 'Cars'],
               [['column', 'pillar']],
               '무도회장의 큰 기둥은 무엇인가요?'),
          6: Q('What are the tall things in the hall?', 'Tall columns',
               ['Tall columns', 'Tall trees', 'Big cars'],
               [['column', 'pillar']],
               '무도회장의 큰 기둥은 무엇인가요?'),
          8: Q('What are the tall things in the hall?', 'There are tall columns in the hall.',
               ['There are tall columns in the hall.', 'There are tall trees in the hall.', 'There are big cars in the hall.'],
               [['column', 'pillar'], ['hall']],
               '무도회장의 큰 기둥은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('What color are the lights?', 'Yellow',
               ['Yellow', 'Blue', 'Black'],
               [['yellow']],
               '불빛은 무슨 색일까요?'),
          6: Q('What color are the lights?', 'Yellow lights',
               ['Yellow lights', 'Blue lights', 'Black lights'],
               [['yellow'], ['light']],
               '불빛은 무슨 색일까요?'),
          8: Q('What color are the lights?', 'The lights are yellow and warm.',
               ['The lights are yellow and warm.', 'The lights are blue and cold.', 'The lights are black and dark.'],
               [['light'], ['yellow']],
               '불빛은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('What is the floor made of?', 'Stone',
               ['Stone', 'Grass', 'Sand'],
               [['stone', 'marble']],
               '바닥은 무엇으로 만들어졌나요?'),
          6: Q('What is the floor made of?', 'Stone floor',
               ['Stone floor', 'Green grass', 'Yellow sand'],
               [['stone', 'marble'], ['floor']],
               '바닥은 무엇으로 만들어졌나요?'),
          8: Q('What is the floor made of?', 'The floor is made of stone.',
               ['The floor is made of stone.', 'The floor is made of grass.', 'The floor is made of sand.'],
               [['floor'], ['stone', 'marble']],
               '바닥은 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('What is above the windows?', 'Flowers',
               ['Flowers', 'Stars', 'Clouds'],
               [['flower']],
               '창문 위에는 무엇이 있나요?'),
          6: Q('What is above the windows?', 'Pink flowers',
               ['Pink flowers', 'Yellow stars', 'White clouds'],
               [['pink'], ['flower']],
               '창문 위에는 무엇이 있나요?'),
          8: Q('What is above the tall windows?', 'There are pink flowers above the tall windows.',
               ['There are pink flowers above the tall windows.', 'There are yellow stars above the tall windows.', 'There are white clouds above the tall windows.'],
               [['flower'], ['window']],
               '높은 창문 위에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ci-2-ballroom.webp',
        scene: '성의 무도회장',
        q: {
          4: Q('What are the ladies wearing?', 'Dresses',
               ['Dresses', 'Coats', 'Hats'],
               [['dress', 'gown']],
               '여자들은 무엇을 입고 있나요?'),
          6: Q('What are the ladies wearing?', 'Long dresses',
               ['Long dresses', 'Warm coats', 'Big hats'],
               [['long'], ['dress', 'gown']],
               '여자들은 무엇을 입고 있나요?'),
          8: Q('What are the ladies wearing?', 'The ladies are wearing long dresses.',
               ['The ladies are wearing long dresses.', 'The ladies are wearing warm coats.', 'The ladies are wearing big hats.'],
               [['dress', 'gown'], ['long']],
               '여자들은 무엇을 입고 있나요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('Where is the glass slipper?', 'On the stairs',
               ['On the stairs', 'On the bed', 'In the water'],
               [['stair', 'step']],
               '유리구두는 어디에 있나요?'),
          6: Q('Where is the glass slipper?', 'On the stone stairs',
               ['On the stone stairs', 'On the soft bed', 'In the blue water'],
               [['stair', 'step']],
               '유리구두는 어디에 있나요?'),
          8: Q('Where is the glass slipper?', 'The glass slipper is on the stone stairs.',
               ['The glass slipper is on the stone stairs.', 'The glass slipper is on the soft bed.', 'The glass slipper is in the blue water.'],
               [['slipper', 'shoe'], ['stair', 'step']],
               '유리구두는 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('What color is the clock?', 'Gold',
               ['Gold', 'Blue', 'Green'],
               [['gold', 'golden']],
               '시계는 무슨 색일까요?'),
          6: Q('What color is the clock?', 'Golden clock',
               ['Golden clock', 'Blue clock', 'Green clock'],
               [['gold', 'golden'], ['clock']],
               '시계는 무슨 색일까요?'),
          8: Q('What color is the big clock?', 'The big clock is golden.',
               ['The big clock is golden.', 'The big clock is blue.', 'The big clock is green.'],
               [['clock'], ['gold', 'golden']],
               '큰 시계는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('What is she running down?', 'Stairs',
               ['Stairs', 'Hill', 'Road'],
               [['stair', 'step']],
               '그녀는 무엇을 내려가고 있나요?'),
          6: Q('What is she running down?', 'Stone stairs',
               ['Stone stairs', 'Green hill', 'Long road'],
               [['stair', 'step']],
               '그녀는 무엇을 내려가고 있나요?'),
          8: Q('What is she running down?', 'She is running down the stone stairs.',
               ['She is running down the stone stairs.', 'She is running down the green hill.', 'She is running down the long road.'],
               [['stair', 'step']],
               '그녀는 무엇을 내려가고 있나요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('What is on the lamppost?', 'Lamp',
               ['Lamp', 'Bird', 'Flag'],
               [['lamp', 'light', 'lantern']],
               '가로등 위에는 무엇이 있나요?'),
          6: Q('What is on the lamppost?', 'Bright lamp',
               ['Bright lamp', 'Little bird', 'Big flag'],
               [['lamp', 'light']],
               '가로등 위에는 무엇이 있나요?'),
          8: Q('What is on the lamppost?', 'There is a bright lamp on the lamppost.',
               ['There is a bright lamp on the lamppost.', 'There is a little bird on the lamppost.', 'There is a big flag on the lamppost.'],
               [['lamp', 'light'], ['lamppost']],
               '가로등 위에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('What color is the railing?', 'Grey',
               ['Grey', 'Red', 'Yellow'],
               [['grey', 'gray']],
               '난간은 무슨 색일까요?'),
          6: Q('What color is the railing?', 'Grey stone',
               ['Grey stone', 'Red stone', 'Yellow stone'],
               [['grey', 'gray'], ['stone']],
               '난간은 무슨 색일까요?'),
          8: Q('What is the railing made of?', 'The railing is made of grey stone.',
               ['The railing is made of grey stone.', 'The railing is made of red stone.', 'The railing is made of yellow stone.'],
               [['railing', 'stone'], ['grey', 'gray']],
               '난간은 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('Where is the moon?', 'In the sky',
               ['In the sky', 'In the sea', 'In a tree'],
               [['sky']],
               '달은 어디에 있나요?'),
          6: Q('Where is the moon?', 'In the night sky',
               ['In the night sky', 'In the blue sea', 'In a tall tree'],
               [['sky']],
               '달은 어디에 있나요?'),
          8: Q('Where is the moon?', 'The moon is in the night sky.',
               ['The moon is in the night sky.', 'The moon is in the blue sea.', 'The moon is in a tall tree.'],
               [['moon'], ['sky']],
               '달은 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('What is the castle made of?', 'Stone',
               ['Stone', 'Ice', 'Wood'],
               [['stone']],
               '성은 무엇으로 만들어졌나요?'),
          6: Q('What is the castle made of?', 'Stone castle',
               ['Stone castle', 'Ice castle', 'Wooden castle'],
               [['stone'], ['castle']],
               '성은 무엇으로 만들어졌나요?'),
          8: Q('What is the tall castle made of?', 'The tall castle is made of stone.',
               ['The tall castle is made of stone.', 'The tall castle is made of ice.', 'The tall castle is made of wood.'],
               [['castle'], ['stone']],
               '높은 성은 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/ci-3-midnight.webp',
        scene: '자정의 계단',
        q: {
          4: Q('What shape is the clock?', 'Round',
               ['Round', 'Square', 'Star'],
               [['round', 'circle']],
               '시계는 무슨 모양인가요?'),
          6: Q('What shape is the clock?', 'Round clock',
               ['Round clock', 'Square clock', 'Star clock'],
               [['round', 'circle'], ['clock']],
               '시계는 무슨 모양인가요?'),
          8: Q('What shape is the clock?', 'The clock is round.',
               ['The clock is round.', 'The clock is square.', 'The clock is a star.'],
               [['clock'], ['round', 'circle']],
               '시계는 무슨 모양인가요?')
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
          4: Q('What color is the sky?', 'Orange',
               ['Orange', 'Blue', 'Black'],
               [['orange']],
               '하늘은 무슨 색일까요?'),
          6: Q('What color is the sky?', 'Orange sky',
               ['Orange sky', 'Blue sky', 'Black sky'],
               [['orange'], ['sky']],
               '하늘은 무슨 색일까요?'),
          8: Q('What color is the sky at sunset?', 'The sky is orange and gold.',
               ['The sky is orange and gold.', 'The sky is blue and grey.', 'The sky is black and white.'],
               [['sky'], ['orange', 'gold']],
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
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('What is in her hair?', 'Pearls',
               ['Pearls', 'Stars', 'Leaves'],
               [['pearl']],
               '그녀의 머리에는 무엇이 있나요?'),
          6: Q('What is in her hair?', 'White pearls',
               ['White pearls', 'Blue stars', 'Green leaves'],
               [['white'], ['pearl']],
               '그녀의 머리에는 무엇이 있나요?'),
          8: Q('What is in her hair?', 'She has white pearls in her hair.',
               ['She has white pearls in her hair.', 'She has blue stars in her hair.', 'She has green leaves in her hair.'],
               [['pearl'], ['white']],
               '그녀의 머리에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('What is she wearing?', 'Dress',
               ['Dress', 'Coat', 'Hat'],
               [['dress', 'gown']],
               '그녀는 무엇을 입고 있나요?'),
          6: Q('What is she wearing?', 'Long dress',
               ['Long dress', 'Warm coat', 'Big hat'],
               [['long'], ['dress', 'gown']],
               '그녀는 무엇을 입고 있나요?'),
          8: Q('What is she wearing?', 'She is wearing a long shining dress.',
               ['She is wearing a long shining dress.', 'She is wearing a warm wool coat.', 'She is wearing a big straw hat.'],
               [['dress', 'gown'], ['long']],
               '그녀는 무엇을 입고 있나요?')
        }
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('What is beside her on the right?', 'Shell',
               ['Shell', 'Apple', 'Book'],
               [['shell']],
               '그녀의 오른쪽 옆에는 무엇이 있나요?'),
          6: Q('What is beside her on the right?', 'Big shell',
               ['Big shell', 'Red apple', 'Old book'],
               [['shell'], ['big', 'large']],
               '그녀의 오른쪽 옆에는 무엇이 있나요?'),
          8: Q('What is beside her on the right?', 'There is a big shell beside her.',
               ['There is a big shell beside her.', 'There is a red apple beside her.', 'There is an old book beside her.'],
               [['shell'], ['beside', 'next']],
               '그녀의 오른쪽 옆에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('What is behind her?', 'Palace',
               ['Palace', 'School', 'Shop'],
               [['palace', 'castle']],
               '그녀 뒤에는 무엇이 있나요?'),
          6: Q('What is behind her?', 'Underwater palace',
               ['Underwater palace', 'Little school', 'Small shop'],
               [['palace', 'castle']],
               '그녀 뒤에는 무엇이 있나요?'),
          8: Q('What is behind her?', 'There is an underwater palace behind her.',
               ['There is an underwater palace behind her.', 'There is a little school behind her.', 'There is a small shop behind her.'],
               [['palace', 'castle']],
               '그녀 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('What are the round things in the water?', 'Bubbles',
               ['Bubbles', 'Balloons', 'Stars'],
               [['bubble']],
               '물속의 동그란 것들은 무엇인가요?'),
          6: Q('What are the round things in the water?', 'Little bubbles',
               ['Little bubbles', 'Big balloons', 'Bright stars'],
               [['bubble']],
               '물속의 동그란 것들은 무엇인가요?'),
          8: Q('What are the round things in the water?', 'There are little bubbles in the water.',
               ['There are little bubbles in the water.', 'There are big balloons in the water.', 'There are bright stars in the water.'],
               [['bubble'], ['water']],
               '물속의 동그란 것들은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('What is on her ears?', 'Earrings',
               ['Earrings', 'Glasses', 'Hat'],
               [['earring']],
               '그녀의 귀에는 무엇이 있나요?'),
          6: Q('What is on her ears?', 'Pearl earrings',
               ['Pearl earrings', 'Black glasses', 'Red hat'],
               [['pearl'], ['earring']],
               '그녀의 귀에는 무엇이 있나요?'),
          8: Q('What is she wearing on her ears?', 'She is wearing pearl earrings.',
               ['She is wearing pearl earrings.', 'She is wearing black glasses.', 'She is wearing a red hat.'],
               [['pearl'], ['earring']],
               '그녀의 귀에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-lm.webp',
        scene: '공주',
        q: {
          4: Q('What color is the water?', 'Blue',
               ['Blue', 'Brown', 'Black'],
               [['blue']],
               '물은 무슨 색일까요?'),
          6: Q('What color is the water?', 'Blue water',
               ['Blue water', 'Brown water', 'Black water'],
               [['blue'], ['water']],
               '물은 무슨 색일까요?'),
          8: Q('What color is the water around her?', 'The water around her is blue.',
               ['The water around her is blue.', 'The water around her is brown.', 'The water around her is black.'],
               [['water'], ['blue']],
               '그녀 주변의 물은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What comes down from above?', 'Light',
               ['Light', 'Rain', 'Snow'],
               [['light', 'sun']],
               '위에서 무엇이 내려오나요?'),
          6: Q('What comes down from above?', 'Sun light',
               ['Sun light', 'Cold rain', 'White snow'],
               [['light', 'sun']],
               '위에서 무엇이 내려오나요?'),
          8: Q('What comes down from above?', 'Warm sun light comes down from above.',
               ['Warm sun light comes down from above.', 'Cold rain comes down from above.', 'White snow comes down from above.'],
               [['light', 'sun'], ['warm', 'bright']],
               '위에서 무엇이 내려오나요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What is at the bottom?', 'Sand',
               ['Sand', 'Grass', 'Snow'],
               [['sand']],
               '바닥에는 무엇이 있나요?'),
          6: Q('What is at the bottom?', 'White sand',
               ['White sand', 'Green grass', 'Cold snow'],
               [['white'], ['sand']],
               '바닥에는 무엇이 있나요?'),
          8: Q('What is at the bottom of the sea?', 'There is white sand at the bottom.',
               ['There is white sand at the bottom.', 'There is green grass at the bottom.', 'There is cold snow at the bottom.'],
               [['sand'], ['white']],
               '바다 바닥에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What is she doing?', 'Swimming',
               ['Swimming', 'Sleeping', 'Running'],
               [['swim']],
               '그녀는 무엇을 하고 있나요?'),
          6: Q('What is she doing?', 'Swimming in the sea',
               ['Swimming in the sea', 'Sleeping in a bed', 'Running on a road'],
               [['swim']],
               '그녀는 무엇을 하고 있나요?'),
          8: Q('What is she doing?', 'She is swimming in the sea.',
               ['She is swimming in the sea.', 'She is sleeping in a soft bed.', 'She is running on a long road.'],
               [['swim'], ['sea', 'water']],
               '그녀는 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What color is the fish at the bottom?', 'Purple',
               ['Purple', 'Orange', 'Yellow'],
               [['purple', 'violet']],
               '맨 아래 물고기는 무슨 색일까요?'),
          6: Q('What color is the fish at the bottom?', 'Purple fish',
               ['Purple fish', 'Orange fish', 'Yellow fish'],
               [['purple', 'violet'], ['fish']],
               '맨 아래 물고기는 무슨 색일까요?'),
          8: Q('What color is the fish at the bottom?', 'The fish at the bottom is purple.',
               ['The fish at the bottom is purple.', 'The fish at the bottom is orange.', 'The fish at the bottom is yellow.'],
               [['fish'], ['purple', 'violet']],
               '맨 아래 물고기는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What is on the rocks?', 'Coral',
               ['Coral', 'Flowers', 'Trees'],
               [['coral']],
               '바위 위에는 무엇이 있나요?'),
          6: Q('What is on the rocks?', 'Pink coral',
               ['Pink coral', 'Yellow flowers', 'Green trees'],
               [['pink'], ['coral']],
               '바위 위에는 무엇이 있나요?'),
          8: Q('What is growing on the rocks?', 'Pink coral is growing on the rocks.',
               ['Pink coral is growing on the rocks.', 'Yellow flowers are growing on the rocks.', 'Green trees are growing on the rocks.'],
               [['coral'], ['pink']],
               '바위 위에는 무엇이 자라고 있나요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What is on the sea floor?', 'Rocks',
               ['Rocks', 'Beds', 'Books'],
               [['rock', 'stone']],
               '바다 밑바닥에는 무엇이 있나요?'),
          6: Q('What is on the sea floor?', 'Grey rocks',
               ['Grey rocks', 'Soft beds', 'Big books'],
               [['grey', 'gray'], ['rock', 'stone']],
               '바다 밑바닥에는 무엇이 있나요?'),
          8: Q('What is on the sea floor?', 'There are grey rocks on the sea floor.',
               ['There are grey rocks on the sea floor.', 'There are soft beds on the sea floor.', 'There are big books on the sea floor.'],
               [['rock', 'stone'], ['grey', 'gray']],
               '바다 밑바닥에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('Where are the fish?', 'In the water',
               ['In the water', 'In a tree', 'In a house'],
               [['water', 'sea']],
               '물고기는 어디에 있나요?'),
          6: Q('Where are the fish?', 'In the blue water',
               ['In the blue water', 'In a tall tree', 'In a small house'],
               [['water', 'sea']],
               '물고기는 어디에 있나요?'),
          8: Q('Where are the fish swimming?', 'The fish are swimming in the blue water.',
               ['The fish are swimming in the blue water.', 'The fish are swimming in a tall tree.', 'The fish are swimming in a small house.'],
               [['fish'], ['water', 'sea']],
               '물고기는 어디에서 헤엄치고 있나요?')
        }
      },
      {
        img: 'assets/img/lm-1-fish.webp',
        scene: '산호초 친구들',
        q: {
          4: Q('What does she have on her dress?', 'Pearls',
               ['Pearls', 'Buttons', 'Stars'],
               [['pearl']],
               '그녀의 드레스에는 무엇이 붙어 있나요?'),
          6: Q('What does she have on her dress?', 'White pearls',
               ['White pearls', 'Black buttons', 'Yellow stars'],
               [['white'], ['pearl']],
               '그녀의 드레스에는 무엇이 붙어 있나요?'),
          8: Q('What does she have on her dress?', 'She has pearls on her dress.',
               ['She has pearls on her dress.', 'She has buttons on her dress.', 'She has stars on her dress.'],
               [['pearl'], ['dress']],
               '그녀의 드레스에는 무엇이 붙어 있나요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('What is in the treasure chest?', 'Gold',
               ['Gold', 'Shoes', 'Books'],
               [['gold', 'coin', 'treasure']],
               '보물 상자 안에는 무엇이 있나요?'),
          6: Q('What is in the treasure chest?', 'Gold coins',
               ['Gold coins', 'Old shoes', 'Big books'],
               [['gold', 'coin']],
               '보물 상자 안에는 무엇이 있나요?'),
          8: Q('What is in the treasure chest?', 'There is gold in the treasure chest.',
               ['There is gold in the treasure chest.', 'There are old shoes in the treasure chest.', 'There are big books in the treasure chest.'],
               [['gold', 'coin'], ['chest']],
               '보물 상자 안에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('What is on the sand?', 'Starfish',
               ['Starfish', 'Cup', 'Hat'],
               [['starfish', 'star fish']],
               '모래 위에는 무엇이 있나요?'),
          6: Q('What is on the sand?', 'Little starfish',
               ['Little starfish', 'Little cup', 'Little hat'],
               [['starfish']],
               '모래 위에는 무엇이 있나요?'),
          8: Q('What is on the sand?', 'There is a little starfish on the sand.',
               ['There is a little starfish on the sand.', 'There is a little cup on the sand.', 'There is a little hat on the sand.'],
               [['starfish'], ['sand']],
               '모래 위에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('What color is the shell she is holding?', 'Pink',
               ['Pink', 'Blue', 'Green'],
               [['pink']],
               '그녀가 든 조개는 무슨 색일까요?'),
          6: Q('What color is the shell she is holding?', 'Pink shell',
               ['Pink shell', 'Blue shell', 'Green shell'],
               [['pink'], ['shell']],
               '그녀가 든 조개는 무슨 색일까요?'),
          8: Q('What color is the shell in her hands?', 'The shell in her hands is pink.',
               ['The shell in her hands is pink.', 'The shell in her hands is blue.', 'The shell in her hands is green.'],
               [['shell'], ['pink']],
               '그녀가 든 조개는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('What is inside the shell?', 'Pearls',
               ['Pearls', 'Apples', 'Stones'],
               [['pearl']],
               '조개 안에는 무엇이 있나요?'),
          6: Q('What is inside the shell?', 'White pearls',
               ['White pearls', 'Red apples', 'Grey stones'],
               [['white'], ['pearl']],
               '조개 안에는 무엇이 있나요?'),
          8: Q('What is inside the big shell?', 'There are white pearls inside the big shell.',
               ['There are white pearls inside the big shell.', 'There are red apples inside the big shell.', 'There are grey stones inside the big shell.'],
               [['pearl'], ['shell']],
               '큰 조개 안에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('Is the treasure box open or closed?', 'Open',
               ['Open', 'Closed', 'Broken'],
               [['open']],
               '보물 상자는 열려 있나요, 닫혀 있나요?'),
          6: Q('Is the treasure box open or closed?', 'It is open',
               ['It is open', 'It is closed', 'It is broken'],
               [['open']],
               '보물 상자는 열려 있나요, 닫혀 있나요?'),
          8: Q('Is the treasure box open or closed?', 'The treasure box is open.',
               ['The treasure box is open.', 'The treasure box is closed.', 'The treasure box is broken.'],
               [['open'], ['treasure']],
               '보물 상자는 열려 있나요, 닫혀 있나요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('What color is the treasure chest?', 'Brown',
               ['Brown', 'Blue', 'White'],
               [['brown', 'wood']],
               '보물 상자는 무슨 색일까요?'),
          6: Q('What color is the treasure chest?', 'Brown chest',
               ['Brown chest', 'Blue chest', 'White chest'],
               [['brown', 'wood'], ['chest', 'box']],
               '보물 상자는 무슨 색일까요?'),
          8: Q('What color is the treasure chest?', 'The treasure chest is brown.',
               ['The treasure chest is brown.', 'The treasure chest is blue.', 'The treasure chest is white.'],
               [['chest'], ['brown', 'wood']],
               '보물 상자는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('What is the little blue animal on the left?', 'Fish',
               ['Fish', 'Bird', 'Cat'],
               [['fish']],
               '왼쪽의 작고 파란 동물은 무엇인가요?'),
          6: Q('What is the little blue animal on the left?', 'Little fish',
               ['Little fish', 'Little bird', 'Little cat'],
               [['fish']],
               '왼쪽의 작고 파란 동물은 무엇인가요?'),
          8: Q('What is the little blue animal on the left?', 'There is a little fish on the left.',
               ['There is a little fish on the left.', 'There is a little bird on the left.', 'There is a little cat on the left.'],
               [['fish']],
               '왼쪽의 작고 파란 동물은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/lm-2-treasure.webp',
        scene: '보물 상자',
        q: {
          4: Q('What color are the pearls?', 'White',
               ['White', 'Black', 'Green'],
               [['white']],
               '진주는 무슨 색일까요?'),
          6: Q('What color are the pearls?', 'White pearls',
               ['White pearls', 'Black pearls', 'Green pearls'],
               [['white'], ['pearl']],
               '진주는 무슨 색일까요?'),
          8: Q('What color are the pearls in the shell?', 'The pearls in the shell are white.',
               ['The pearls in the shell are white.', 'The pearls in the shell are black.', 'The pearls in the shell are green.'],
               [['pearl'], ['white']],
               '조개 안의 진주는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What is the sun doing?', 'Setting',
               ['Setting', 'Rising', 'Sleeping'],
               [['set', 'setting', 'down']],
               '해는 지금 무엇을 하고 있나요?'),
          6: Q('What is the sun doing?', 'The sun is setting',
               ['The sun is setting', 'The sun is rising', 'The sun is sleeping'],
               [['sun'], ['set']],
               '해는 지금 무엇을 하고 있나요?'),
          8: Q('What is the sun doing?', 'The sun is setting over the sea.',
               ['The sun is setting over the sea.', 'The sun is rising over the sea.', 'The sun is sleeping over the sea.'],
               [['sun'], ['set']],
               '해는 지금 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What color is the roof of the castle?', 'Red',
               ['Red', 'Green', 'Black'],
               [['red']],
               '성의 지붕은 무슨 색일까요?'),
          6: Q('What color is the roof of the castle?', 'Red roof',
               ['Red roof', 'Green roof', 'Black roof'],
               [['red'], ['roof']],
               '성의 지붕은 무슨 색일까요?'),
          8: Q('What color are the roofs of the castle?', 'The roofs of the castle are red.',
               ['The roofs of the castle are red.', 'The roofs of the castle are green.', 'The roofs of the castle are black.'],
               [['castle'], ['roof'], ['red']],
               '성의 지붕들은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What is growing on the cliff?', 'Trees',
               ['Trees', 'Cars', 'Beds'],
               [['tree']],
               '절벽 위에는 무엇이 자라고 있나요?'),
          6: Q('What is growing on the cliff?', 'Green trees',
               ['Green trees', 'Blue cars', 'Small beds'],
               [['green'], ['tree']],
               '절벽 위에는 무엇이 자라고 있나요?'),
          8: Q('What is growing on the cliff?', 'There are green trees on the cliff.',
               ['There are green trees on the cliff.', 'There are blue cars on the cliff.', 'There are small beds on the cliff.'],
               [['tree'], ['cliff']],
               '절벽 위에는 무엇이 자라고 있나요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What is she sitting on?', 'Rock',
               ['Rock', 'Chair', 'Bed'],
               [['rock', 'stone']],
               '그녀는 무엇 위에 앉아 있나요?'),
          6: Q('What is she sitting on?', 'Big rock',
               ['Big rock', 'Small chair', 'Soft bed'],
               [['rock', 'stone']],
               '그녀는 무엇 위에 앉아 있나요?'),
          8: Q('What is she sitting on?', 'She is sitting on a big rock.',
               ['She is sitting on a big rock.', 'She is sitting on a small chair.', 'She is sitting on a soft bed.'],
               [['rock', 'stone'], ['sit']],
               '그녀는 무엇 위에 앉아 있나요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What is the castle standing on?', 'Cliff',
               ['Cliff', 'Boat', 'Cloud'],
               [['cliff', 'rock']],
               '성은 무엇 위에 서 있나요?'),
          6: Q('What is the castle standing on?', 'High cliff',
               ['High cliff', 'Small boat', 'White cloud'],
               [['cliff', 'rock']],
               '성은 무엇 위에 서 있나요?'),
          8: Q('What is the castle standing on?', 'The castle is standing on a high cliff.',
               ['The castle is standing on a high cliff.', 'The castle is standing on a small boat.', 'The castle is standing on a white cloud.'],
               [['castle'], ['cliff', 'rock']],
               '성은 무엇 위에 서 있나요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What is below the castle?', 'The sea',
               ['The sea', 'The snow', 'The desert'],
               [['sea', 'water', 'ocean']],
               '성 아래에는 무엇이 있나요?'),
          6: Q('What is below the castle?', 'The blue sea',
               ['The blue sea', 'The white snow', 'The yellow desert'],
               [['blue'], ['sea', 'water']],
               '성 아래에는 무엇이 있나요?'),
          8: Q('What is below the castle?', 'The sea is below the castle.',
               ['The sea is below the castle.', 'The snow is below the castle.', 'The desert is below the castle.'],
               [['sea', 'water'], ['castle']],
               '성 아래에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/lm-3-castle.webp',
        scene: '바닷가 성',
        q: {
          4: Q('What is in the sky?', 'Clouds',
               ['Clouds', 'Snow', 'Sand'],
               [['cloud']],
               '하늘에는 무엇이 있나요?'),
          6: Q('What is in the sky?', 'Orange clouds',
               ['Orange clouds', 'White snow', 'Yellow sand'],
               [['orange'], ['cloud']],
               '하늘에는 무엇이 있나요?'),
          8: Q('What is in the sky?', 'There are orange clouds in the sky.',
               ['There are orange clouds in the sky.', 'There is white snow in the sky.', 'There is yellow sand in the sky.'],
               [['cloud'], ['sky']],
               '하늘에는 무엇이 있나요?')
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
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What is she doing on the bed?', 'Sleeping',
               ['Sleeping', 'Running', 'Eating'],
               [['sleep']],
               '침대에서 그녀는 무엇을 하고 있나요?'),
          6: Q('What is she doing on the bed?', 'She is sleeping',
               ['She is sleeping', 'She is running', 'She is eating'],
               [['sleep']],
               '침대에서 그녀는 무엇을 하고 있나요?'),
          8: Q('What is she doing on the bed?', 'She is sleeping on the bed.',
               ['She is sleeping on the bed.', 'She is running on the bed.', 'She is eating on the bed.'],
               [['sleep'], ['bed']],
               '침대에서 그녀는 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What is in her hand?', 'Rose',
               ['Rose', 'Cup', 'Shoe'],
               [['rose', 'flower']],
               '그녀의 손에는 무엇이 있나요?'),
          6: Q('What is in her hand?', 'Red rose',
               ['Red rose', 'Blue cup', 'Green shoe'],
               [['red'], ['rose', 'flower']],
               '그녀의 손에는 무엇이 있나요?'),
          8: Q('What is in her hand?', 'She is holding a red rose.',
               ['She is holding a red rose.', 'She is holding a blue cup.', 'She is holding a green shoe.'],
               [['rose', 'flower'], ['red']],
               '그녀의 손에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What color is the pillow?', 'Red',
               ['Red', 'Blue', 'Green'],
               [['red']],
               '베개는 무슨 색일까요?'),
          6: Q('What color is the pillow?', 'Red pillow',
               ['Red pillow', 'Blue pillow', 'Green pillow'],
               [['red'], ['pillow']],
               '베개는 무슨 색일까요?'),
          8: Q('What color is the pillow under her head?', 'The pillow under her head is red.',
               ['The pillow under her head is red.', 'The pillow under her head is blue.', 'The pillow under her head is green.'],
               [['pillow'], ['red']],
               '그녀 머리 밑의 베개는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What is outside the window?', 'Castle',
               ['Castle', 'Boat', 'Train'],
               [['castle', 'palace']],
               '창밖에는 무엇이 있나요?'),
          6: Q('What is outside the window?', 'Blue castle',
               ['Blue castle', 'Small boat', 'Fast train'],
               [['blue'], ['castle', 'palace']],
               '창밖에는 무엇이 있나요?'),
          8: Q('What is outside the window?', 'There is a castle outside the window.',
               ['There is a castle outside the window.', 'There is a small boat outside the window.', 'There is a fast train outside the window.'],
               [['castle', 'palace'], ['window']],
               '창밖에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What is burning beside her?', 'Candle',
               ['Candle', 'Fire', 'Lamp'],
               [['candle']],
               '그녀 옆에서 무엇이 타고 있나요?'),
          6: Q('What is burning beside her?', 'Tall candle',
               ['Tall candle', 'Big fire', 'Bright lamp'],
               [['candle']],
               '그녀 옆에서 무엇이 타고 있나요?'),
          8: Q('What is burning beside her?', 'There is a tall candle beside her.',
               ['There is a tall candle beside her.', 'There is a big fire beside her.', 'There is a bright lamp beside her.'],
               [['candle'], ['beside', 'next']],
               '그녀 옆에서 무엇이 타고 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What color are the flowers in the vase?', 'Pink',
               ['Pink', 'Blue', 'Green'],
               [['pink']],
               '꽃병 속 꽃은 무슨 색일까요?'),
          6: Q('What color are the flowers in the vase?', 'Pink roses',
               ['Pink roses', 'Blue roses', 'Green roses'],
               [['pink'], ['rose', 'flower']],
               '꽃병 속 꽃은 무슨 색일까요?'),
          8: Q('What color are the flowers in the vase?', 'The roses in the vase are pink.',
               ['The roses in the vase are pink.', 'The roses in the vase are blue.', 'The roses in the vase are green.'],
               [['rose', 'flower'], ['pink']],
               '꽃병 속 장미는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What is she lying on?', 'Bed',
               ['Bed', 'Chair', 'Tree'],
               [['bed']],
               '그녀는 무엇에 누워 있나요?'),
          6: Q('What is she lying on?', 'Soft bed',
               ['Soft bed', 'Wooden chair', 'Tall tree'],
               [['soft'], ['bed']],
               '그녀는 무엇에 누워 있나요?'),
          8: Q('What is she lying on?', 'She is lying on a soft bed.',
               ['She is lying on a soft bed.', 'She is lying on a wooden chair.', 'She is lying on a tall tree.'],
               [['bed'], ['soft']],
               '그녀는 무엇에 누워 있나요?')
        }
      },
      {
        img: 'assets/img/hero-sb.webp',
        scene: '공주',
        q: {
          4: Q('What is on her head?', 'Flowers',
               ['Flowers', 'Stars', 'Shells'],
               [['flower', 'rose']],
               '그녀의 머리에는 무엇이 있나요?'),
          6: Q('What is on her head?', 'Flower crown',
               ['Flower crown', 'Star crown', 'Shell crown'],
               [['flower'], ['crown']],
               '그녀의 머리에는 무엇이 있나요?'),
          8: Q('What is on her head?', 'She is wearing a flower crown.',
               ['She is wearing a flower crown.', 'She is wearing a star crown.', 'She is wearing a shell crown.'],
               [['flower'], ['crown']],
               '그녀의 머리에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('What color is the thread?', 'Gold',
               ['Gold', 'Blue', 'Black'],
               [['gold', 'golden']],
               '실은 무슨 색일까요?'),
          6: Q('What color is the thread?', 'Gold thread',
               ['Gold thread', 'Blue thread', 'Black thread'],
               [['gold', 'golden'], ['thread', 'yarn']],
               '실은 무슨 색일까요?'),
          8: Q('What color is the thread on the wheel?', 'The thread on the wheel is gold.',
               ['The thread on the wheel is gold.', 'The thread on the wheel is blue.', 'The thread on the wheel is black.'],
               [['thread', 'yarn'], ['gold', 'golden']],
               '물레 위의 실은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('What can you see through the tower window?', 'Sky',
               ['Sky', 'Sea', 'Snow'],
               [['sky']],
               '탑 창문 밖으로 무엇이 보이나요?'),
          6: Q('What can you see through the tower window?', 'Blue sky',
               ['Blue sky', 'Blue sea', 'White snow'],
               [['blue'], ['sky']],
               '탑 창문 밖으로 무엇이 보이나요?'),
          8: Q('What can you see through the tower window?', 'You can see the blue sky through the tower window.',
               ['You can see the blue sky through the tower window.', 'You can see the blue sea through the tower window.', 'You can see the white snow through the tower window.'],
               [['sky'], ['window']],
               '탑 창문 밖으로 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('What color is the curtain?', 'Purple',
               ['Purple', 'Orange', 'Green'],
               [['purple', 'violet']],
               '커튼은 무슨 색일까요?'),
          6: Q('What color is the curtain?', 'Purple curtain',
               ['Purple curtain', 'Orange curtain', 'Green curtain'],
               [['purple', 'violet'], ['curtain']],
               '커튼은 무슨 색일까요?'),
          8: Q('What color is the curtain?', 'The curtain is purple.',
               ['The curtain is purple.', 'The curtain is orange.', 'The curtain is green.'],
               [['curtain'], ['purple', 'violet']],
               '커튼은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('Where does the light come from?', 'The window',
               ['The window', 'The floor', 'The table'],
               [['window']],
               '빛은 어디에서 들어오나요?'),
          6: Q('Where does the light come from?', 'From the window',
               ['From the window', 'From the floor', 'From the table'],
               [['window']],
               '빛은 어디에서 들어오나요?'),
          8: Q('Where does the light come from?', 'The light comes from the window.',
               ['The light comes from the window.', 'The light comes from the floor.', 'The light comes from the table.'],
               [['light'], ['window']],
               '빛은 어디에서 들어오나요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('What is the spinning wheel made of?', 'Wood',
               ['Wood', 'Glass', 'Ice'],
               [['wood']],
               '물레는 무엇으로 만들어졌나요?'),
          6: Q('What is the spinning wheel made of?', 'Brown wood',
               ['Brown wood', 'Clear glass', 'White ice'],
               [['brown'], ['wood']],
               '물레는 무엇으로 만들어졌나요?'),
          8: Q('What is the spinning wheel made of?', 'The spinning wheel is made of wood.',
               ['The spinning wheel is made of wood.', 'The spinning wheel is made of glass.', 'The spinning wheel is made of ice.'],
               [['wheel'], ['wood']],
               '물레는 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('Where is the spinning wheel?', 'Next to her',
               ['Next to her', 'On her head', 'Under the bed'],
               [['next', 'beside', 'near']],
               '물레는 어디에 있나요?'),
          6: Q('Where is the spinning wheel?', 'Next to her',
               ['Next to her', 'On her head', 'Under the bed'],
               [['next', 'beside', 'near']],
               '물레는 어디에 있나요?'),
          8: Q('Where is the spinning wheel?', 'The spinning wheel is next to her.',
               ['The spinning wheel is next to her.', 'The spinning wheel is on her head.', 'The spinning wheel is under the bed.'],
               [['wheel'], ['next', 'beside', 'near']],
               '물레는 어디에 있나요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('What is the tower made of?', 'Stone',
               ['Stone', 'Wood', 'Paper'],
               [['stone']],
               '탑은 무엇으로 만들어졌나요?'),
          6: Q('What is the tower made of?', 'Grey stone',
               ['Grey stone', 'Brown wood', 'White paper'],
               [['grey', 'gray'], ['stone']],
               '탑은 무엇으로 만들어졌나요?'),
          8: Q('What is the tower room made of?', 'The tower room is made of stone.',
               ['The tower room is made of stone.', 'The tower room is made of wood.', 'The tower room is made of paper.'],
               [['tower'], ['stone']],
               '탑의 방은 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/sb-1-wheel.webp',
        scene: '물레',
        q: {
          4: Q('What does she do with the wheel?', 'Spin',
               ['Spin', 'Cook', 'Sing'],
               [['spin']],
               '그녀는 물레로 무엇을 하나요?'),
          6: Q('What does she do with the wheel?', 'She spins',
               ['She spins', 'She cooks', 'She sings'],
               [['spin']],
               '그녀는 물레로 무엇을 하나요?'),
          8: Q('What does she do with the spinning wheel?', 'She spins the wheel.',
               ['She spins the wheel.', 'She cooks on the wheel.', 'She sings to the wheel.'],
               [['spin'], ['wheel']],
               '그녀는 물레로 무엇을 하나요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('Who is flying around her?', 'Fairies',
               ['Fairies', 'Birds', 'Bees'],
               [['fairy', 'fairies']],
               '그녀 주변을 날고 있는 것은 무엇인가요?'),
          6: Q('Who is flying around her?', 'Little fairies',
               ['Little fairies', 'Little birds', 'Little bees'],
               [['fairy', 'fairies']],
               '그녀 주변을 날고 있는 것은 무엇인가요?'),
          8: Q('Who is flying around her?', 'Little fairies are flying around her.',
               ['Little fairies are flying around her.', 'Little birds are flying around her.', 'Little bees are flying around her.'],
               [['fairy', 'fairies'], ['fly', 'flying']],
               '그녀 주변을 날고 있는 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('What do the fairies have?', 'Wings',
               ['Wings', 'Hats', 'Shoes'],
               [['wing']],
               '요정들에게는 무엇이 있나요?'),
          6: Q('What do the fairies have?', 'Shining wings',
               ['Shining wings', 'Big hats', 'Red shoes'],
               [['shining', 'bright'], ['wing']],
               '요정들에게는 무엇이 있나요?'),
          8: Q('What do the little fairies have?', 'The little fairies have shining wings.',
               ['The little fairies have shining wings.', 'The little fairies have big hats.', 'The little fairies have red shoes.'],
               [['fairy', 'fairies'], ['wing']],
               '요정들에게는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('What color is the flower in her hand?', 'Red',
               ['Red', 'Blue', 'Green'],
               [['red']],
               '그녀 손의 꽃은 무슨 색일까요?'),
          6: Q('What color is the flower in her hand?', 'Red rose',
               ['Red rose', 'Blue rose', 'Green rose'],
               [['red'], ['rose', 'flower']],
               '그녀 손의 꽃은 무슨 색일까요?'),
          8: Q('What color is the flower in her hand?', 'The flower in her hand is red.',
               ['The flower in her hand is red.', 'The flower in her hand is blue.', 'The flower in her hand is green.'],
               [['flower', 'rose'], ['red']],
               '그녀 손의 꽃은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('What is coming through the trees?', 'Sunlight',
               ['Sunlight', 'Rain', 'Snow'],
               [['sun', 'light']],
               '나무 사이로 무엇이 들어오나요?'),
          6: Q('What is coming through the trees?', 'Warm sunlight',
               ['Warm sunlight', 'Cold rain', 'White snow'],
               [['warm'], ['sun', 'light']],
               '나무 사이로 무엇이 들어오나요?'),
          8: Q('What is coming through the trees?', 'Warm sunlight is coming through the trees.',
               ['Warm sunlight is coming through the trees.', 'Cold rain is coming through the trees.', 'White snow is coming through the trees.'],
               [['sun', 'light'], ['tree']],
               '나무 사이로 무엇이 들어오나요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('What is on the ground?', 'Flowers',
               ['Flowers', 'Water', 'Sand'],
               [['flower']],
               '땅에는 무엇이 있나요?'),
          6: Q('What is on the ground?', 'Small flowers',
               ['Small flowers', 'Blue water', 'Yellow sand'],
               [['small', 'little'], ['flower']],
               '땅에는 무엇이 있나요?'),
          8: Q('What is on the ground?', 'There are small flowers on the ground.',
               ['There are small flowers on the ground.', 'There is blue water on the ground.', 'There is yellow sand on the ground.'],
               [['flower'], ['ground']],
               '땅에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('What are the big things around her?', 'Trees',
               ['Trees', 'Houses', 'Cars'],
               [['tree']],
               '그녀 주변의 커다란 것은 무엇인가요?'),
          6: Q('What are the big things around her?', 'Big trees',
               ['Big trees', 'Tall houses', 'Fast cars'],
               [['big', 'tall'], ['tree']],
               '그녀 주변의 커다란 것은 무엇인가요?'),
          8: Q('What are the big things around her?', 'There are big trees around her.',
               ['There are big trees around her.', 'There are tall houses around her.', 'There are fast cars around her.'],
               [['tree']],
               '그녀 주변의 커다란 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/sb-2-forest.webp',
        scene: '숲속에서',
        q: {
          4: Q('Is the forest bright or dark?', 'Bright',
               ['Bright', 'Dark', 'Wet'],
               [['bright', 'light']],
               '숲은 밝은가요, 어두운가요?'),
          6: Q('Is the forest bright or dark?', 'Bright forest',
               ['Bright forest', 'Dark forest', 'Wet forest'],
               [['bright', 'light'], ['forest']],
               '숲은 밝은가요, 어두운가요?'),
          8: Q('Is the forest bright or dark?', 'The forest is bright with sunlight.',
               ['The forest is bright with sunlight.', 'The forest is dark with rain clouds.', 'The forest is wet with heavy rain.'],
               [['forest'], ['bright', 'sun']],
               '숲은 밝은가요, 어두운가요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What is behind her?', 'Arch',
               ['Arch', 'Boat', 'Car'],
               [['arch', 'gate', 'door']],
               '그녀 뒤에는 무엇이 있나요?'),
          6: Q('What is behind her?', 'Stone arch',
               ['Stone arch', 'Small boat', 'Fast car'],
               [['stone'], ['arch', 'gate']],
               '그녀 뒤에는 무엇이 있나요?'),
          8: Q('What is behind her?', 'There is a stone arch behind her.',
               ['There is a stone arch behind her.', 'There is a small boat behind her.', 'There is a fast car behind her.'],
               [['arch', 'gate'], ['stone']],
               '그녀 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What is falling around her?', 'Petals',
               ['Petals', 'Snow', 'Rain'],
               [['petal', 'leaf', 'leaves']],
               '그녀 주변에서 무엇이 떨어지고 있나요?'),
          6: Q('What is falling around her?', 'Rose petals',
               ['Rose petals', 'White snow', 'Cold rain'],
               [['petal'], ['rose', 'flower']],
               '그녀 주변에서 무엇이 떨어지고 있나요?'),
          8: Q('What is falling around her?', 'Rose petals are falling around her.',
               ['Rose petals are falling around her.', 'White snow is falling around her.', 'Cold rain is falling around her.'],
               [['petal'], ['rose', 'flower']],
               '그녀 주변에서 무엇이 떨어지고 있나요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What is she doing in the garden?', 'Dancing',
               ['Dancing', 'Sleeping', 'Eating'],
               [['danc']],
               '정원에서 그녀는 무엇을 하고 있나요?'),
          6: Q('What is she doing in the garden?', 'She is dancing',
               ['She is dancing', 'She is sleeping', 'She is eating'],
               [['danc']],
               '정원에서 그녀는 무엇을 하고 있나요?'),
          8: Q('What is she doing in the garden?', 'She is dancing in the rose garden.',
               ['She is dancing in the rose garden.', 'She is sleeping in the rose garden.', 'She is eating in the rose garden.'],
               [['danc'], ['garden']],
               '정원에서 그녀는 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What is in the sky?', 'The sun',
               ['The sun', 'The moon', 'The snow'],
               [['sun']],
               '하늘에는 무엇이 있나요?'),
          6: Q('What is in the sky?', 'The setting sun',
               ['The setting sun', 'The full moon', 'The white snow'],
               [['sun'], ['set']],
               '하늘에는 무엇이 있나요?'),
          8: Q('What is in the sky?', 'The sun is setting in the sky.',
               ['The sun is setting in the sky.', 'The moon is shining in the sky.', 'The snow is falling in the sky.'],
               [['sun'], ['sky']],
               '하늘에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What is the arch made of?', 'Stone',
               ['Stone', 'Wood', 'Paper'],
               [['stone']],
               '아치는 무엇으로 만들어졌나요?'),
          6: Q('What is the arch made of?', 'Grey stone',
               ['Grey stone', 'Brown wood', 'White paper'],
               [['grey', 'gray'], ['stone']],
               '아치는 무엇으로 만들어졌나요?'),
          8: Q('What is the arch made of?', 'The arch is made of stone.',
               ['The arch is made of stone.', 'The arch is made of wood.', 'The arch is made of paper.'],
               [['arch'], ['stone']],
               '아치는 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What color are the petals?', 'Pink',
               ['Pink', 'Blue', 'Black'],
               [['pink']],
               '꽃잎은 무슨 색일까요?'),
          6: Q('What color are the petals?', 'Pink petals',
               ['Pink petals', 'Blue petals', 'Black petals'],
               [['pink'], ['petal']],
               '꽃잎은 무슨 색일까요?'),
          8: Q('What color are the falling petals?', 'The falling petals are pink.',
               ['The falling petals are pink.', 'The falling petals are blue.', 'The falling petals are black.'],
               [['petal'], ['pink']],
               '떨어지는 꽃잎은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/sb-3-roses.webp',
        scene: '장미 정원',
        q: {
          4: Q('What color is the sky in the garden?', 'Orange',
               ['Orange', 'Blue', 'Black'],
               [['orange']],
               '정원의 하늘은 무슨 색일까요?'),
          6: Q('What color is the sky in the garden?', 'Orange sky',
               ['Orange sky', 'Blue sky', 'Black sky'],
               [['orange'], ['sky']],
               '정원의 하늘은 무슨 색일까요?'),
          8: Q('What color is the sky in the rose garden?', 'The sky is orange and gold at sunset.',
               ['The sky is orange and gold at sunset.', 'The sky is blue and grey at noon.', 'The sky is black and white at midnight.'],
               [['sky'], ['orange', 'gold']],
               '장미 정원의 하늘은 무슨 색일까요?')
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
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What is in her hand?', 'Snowflake',
               ['Snowflake', 'Apple', 'Cup'],
               [['snowflake', 'snow']],
               '그녀의 손에는 무엇이 있나요?'),
          6: Q('What is in her hand?', 'Big snowflake',
               ['Big snowflake', 'Red apple', 'Blue cup'],
               [['snowflake', 'snow']],
               '그녀의 손에는 무엇이 있나요?'),
          8: Q('What is in her hand?', 'She has a big snowflake in her hand.',
               ['She has a big snowflake in her hand.', 'She has a red apple in her hand.', 'She has a blue cup in her hand.'],
               [['snowflake', 'snow'], ['hand']],
               '그녀의 손에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What color is her hair?', 'White',
               ['White', 'Black', 'Red'],
               [['white', 'blonde', 'silver']],
               '그녀의 머리카락은 무슨 색일까요?'),
          6: Q('What color is her hair?', 'White hair',
               ['White hair', 'Black hair', 'Red hair'],
               [['white', 'blonde', 'silver'], ['hair']],
               '그녀의 머리카락은 무슨 색일까요?'),
          8: Q('What color is her hair?', 'She has long white hair.',
               ['She has long white hair.', 'She has long black hair.', 'She has long red hair.'],
               [['hair'], ['white', 'blonde', 'silver']],
               '그녀의 머리카락은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What is behind her?', 'Castle',
               ['Castle', 'Boat', 'Car'],
               [['castle', 'palace']],
               '그녀 뒤에는 무엇이 있나요?'),
          6: Q('What is behind her?', 'Ice castle',
               ['Ice castle', 'Small boat', 'Fast car'],
               [['ice'], ['castle', 'palace']],
               '그녀 뒤에는 무엇이 있나요?'),
          8: Q('What is behind her?', 'There is an ice castle behind her.',
               ['There is an ice castle behind her.', 'There is a small boat behind her.', 'There is a fast car behind her.'],
               [['castle', 'palace'], ['ice']],
               '그녀 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What is on the mountains?', 'Snow',
               ['Snow', 'Sand', 'Grass'],
               [['snow']],
               '산에는 무엇이 덮여 있나요?'),
          6: Q('What is on the mountains?', 'White snow',
               ['White snow', 'Yellow sand', 'Green grass'],
               [['white'], ['snow']],
               '산에는 무엇이 덮여 있나요?'),
          8: Q('What is on the mountains?', 'The mountains are covered with snow.',
               ['The mountains are covered with snow.', 'The mountains are covered with sand.', 'The mountains are covered with grass.'],
               [['mountain'], ['snow']],
               '산에는 무엇이 덮여 있나요?')
        }
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What trees are in the snow?', 'Trees',
               ['Trees', 'Flowers', 'Cars'],
               [['tree', 'pine']],
               '눈 속에 서 있는 것은 무엇인가요?'),
          6: Q('What trees are in the snow?', 'Pine trees',
               ['Pine trees', 'Red flowers', 'Blue cars'],
               [['tree', 'pine']],
               '눈 속에 서 있는 것은 무엇인가요?'),
          8: Q('What trees are in the snow?', 'There are pine trees in the snow.',
               ['There are pine trees in the snow.', 'There are red flowers in the snow.', 'There are blue cars in the snow.'],
               [['tree', 'pine'], ['snow']],
               '눈 속에 서 있는 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What is she standing on?', 'Balcony',
               ['Balcony', 'Boat', 'Bed'],
               [['balcony', 'terrace', 'ice']],
               '그녀는 무엇 위에 서 있나요?'),
          6: Q('What is she standing on?', 'Ice balcony',
               ['Ice balcony', 'Small boat', 'Soft bed'],
               [['balcony', 'terrace'], ['ice']],
               '그녀는 무엇 위에 서 있나요?'),
          8: Q('What is she standing on?', 'She is standing on an ice balcony.',
               ['She is standing on an ice balcony.', 'She is standing on a small boat.', 'She is standing on a soft bed.'],
               [['balcony', 'terrace'], ['ice']],
               '그녀는 무엇 위에 서 있나요?')
        }
      },
      {
        img: 'assets/img/hero-el.webp',
        scene: '공주',
        q: {
          4: Q('What color are her eyes?', 'Blue',
               ['Blue', 'Brown', 'Green'],
               [['blue']],
               '그녀의 눈은 무슨 색일까요?'),
          6: Q('What color are her eyes?', 'Blue eyes',
               ['Blue eyes', 'Brown eyes', 'Green eyes'],
               [['blue'], ['eye']],
               '그녀의 눈은 무슨 색일까요?'),
          8: Q('What color are her eyes?', 'She has blue eyes.',
               ['She has blue eyes.', 'She has brown eyes.', 'She has green eyes.'],
               [['eye'], ['blue']],
               '그녀의 눈은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q("What color is the snowman's nose?", 'Orange',
               ['Orange', 'Blue', 'Green'],
               [['orange']],
               '눈사람의 코는 무슨 색일까요?'),
          6: Q("What color is the snowman's nose?", 'Orange nose',
               ['Orange nose', 'Blue nose', 'Green nose'],
               [['orange'], ['nose']],
               '눈사람의 코는 무슨 색일까요?'),
          8: Q("What color is the snowman's nose?", 'The snowman has an orange nose.',
               ['The snowman has an orange nose.', 'The snowman has a blue nose.', 'The snowman has a green nose.'],
               [['snowman'], ['orange'], ['nose']],
               '눈사람의 코는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q('What is on the snowman?', 'Buttons',
               ['Buttons', 'Stars', 'Flowers'],
               [['button', 'coal']],
               '눈사람의 몸에는 무엇이 있나요?'),
          6: Q('What is on the snowman?', 'Black buttons',
               ['Black buttons', 'Yellow stars', 'Red flowers'],
               [['black'], ['button', 'coal']],
               '눈사람의 몸에는 무엇이 있나요?'),
          8: Q('What is on the snowman?', 'The snowman has black buttons.',
               ['The snowman has black buttons.', 'The snowman has yellow stars.', 'The snowman has red flowers.'],
               [['snowman'], ['button', 'coal']],
               '눈사람의 몸에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q('What does the snowman have for arms?', 'Sticks',
               ['Sticks', 'Paper', 'Rope'],
               [['stick', 'branch']],
               '눈사람의 팔은 무엇인가요?'),
          6: Q('What does the snowman have for arms?', 'Stick arms',
               ['Stick arms', 'Paper arms', 'Rope arms'],
               [['stick', 'branch'], ['arm']],
               '눈사람의 팔은 무엇인가요?'),
          8: Q('What does the snowman have for arms?', 'The snowman has stick arms.',
               ['The snowman has stick arms.', 'The snowman has paper arms.', 'The snowman has rope arms.'],
               [['snowman'], ['stick', 'branch']],
               '눈사람의 팔은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q('What is the snowman doing?', 'Smiling',
               ['Smiling', 'Sleeping', 'Crying'],
               [['smil', 'happy']],
               '눈사람은 무엇을 하고 있나요?'),
          6: Q('What is the snowman doing?', 'He is smiling',
               ['He is smiling', 'He is sleeping', 'He is crying'],
               [['smil', 'happy']],
               '눈사람은 무엇을 하고 있나요?'),
          8: Q('What is the snowman doing?', 'The snowman is smiling at her.',
               ['The snowman is smiling at her.', 'The snowman is sleeping at her.', 'The snowman is crying at her.'],
               [['snowman'], ['smil']],
               '눈사람은 무엇을 하고 있나요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q('What is falling in the air?', 'Snow',
               ['Snow', 'Rain', 'Leaves'],
               [['snow']],
               '하늘에서 무엇이 내리고 있나요?'),
          6: Q('What is falling in the air?', 'Soft snow',
               ['Soft snow', 'Cold rain', 'Green leaves'],
               [['soft'], ['snow']],
               '하늘에서 무엇이 내리고 있나요?'),
          8: Q('What is falling in the air?', 'Soft snow is falling in the air.',
               ['Soft snow is falling in the air.', 'Cold rain is falling in the air.', 'Green leaves are falling in the air.'],
               [['snow'], ['air', 'falling']],
               '하늘에서 무엇이 내리고 있나요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q('What is behind the snowman?', 'Mountains',
               ['Mountains', 'Buildings', 'Cars'],
               [['mountain']],
               '눈사람 뒤에는 무엇이 있나요?'),
          6: Q('What is behind the snowman?', 'Snowy mountains',
               ['Snowy mountains', 'Tall buildings', 'Fast cars'],
               [['snow'], ['mountain']],
               '눈사람 뒤에는 무엇이 있나요?'),
          8: Q('What is behind the snowman?', 'There are snowy mountains behind the snowman.',
               ['There are snowy mountains behind the snowman.', 'There are tall buildings behind the snowman.', 'There are fast cars behind the snowman.'],
               [['mountain'], ['snow']],
               '눈사람 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/el-1-snowman.webp',
        scene: '눈사람',
        q: {
          4: Q('What is on her ear?', 'Earrings',
               ['Earrings', 'Glasses', 'Hat'],
               [['earring', 'snowflake']],
               '그녀의 귀에는 무엇이 있나요?'),
          6: Q('What is on her ear?', 'Snowflake earrings',
               ['Snowflake earrings', 'Black glasses', 'Red hat'],
               [['snowflake'], ['earring']],
               '그녀의 귀에는 무엇이 있나요?'),
          8: Q('What is she wearing on her ear?', 'She is wearing snowflake earrings.',
               ['She is wearing snowflake earrings.', 'She is wearing black glasses.', 'She is wearing a red hat.'],
               [['snowflake'], ['earring']],
               '그녀의 귀에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('What is she touching?', 'Railing',
               ['Railing', 'Apple', 'Book'],
               [['rail', 'fence', 'banister']],
               '그녀는 무엇을 만지고 있나요?'),
          6: Q('What is she touching?', 'Ice railing',
               ['Ice railing', 'Red apple', 'Old book'],
               [['ice'], ['rail', 'fence']],
               '그녀는 무엇을 만지고 있나요?'),
          8: Q('What is she touching?', 'She is touching an ice railing.',
               ['She is touching an ice railing.', 'She is touching a red apple.', 'She is touching an old book.'],
               [['touch'], ['rail', 'fence', 'ice']],
               '그녀는 무엇을 만지고 있나요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('What are the tall things in the hall?', 'Columns',
               ['Columns', 'Trees', 'Cars'],
               [['column', 'pillar']],
               '성 안의 높은 기둥은 무엇인가요?'),
          6: Q('What are the tall things in the hall?', 'Ice columns',
               ['Ice columns', 'Tall trees', 'Big cars'],
               [['ice'], ['column', 'pillar']],
               '성 안의 높은 기둥은 무엇인가요?'),
          8: Q('What are the tall things in the hall?', 'There are tall ice columns in the hall.',
               ['There are tall ice columns in the hall.', 'There are tall trees in the hall.', 'There are big cars in the hall.'],
               [['column', 'pillar'], ['ice']],
               '성 안의 높은 기둥은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('What color is the ice?', 'Blue',
               ['Blue', 'Red', 'Black'],
               [['blue']],
               '얼음은 무슨 색일까요?'),
          6: Q('What color is the ice?', 'Blue ice',
               ['Blue ice', 'Red ice', 'Black ice'],
               [['blue'], ['ice']],
               '얼음은 무슨 색일까요?'),
          8: Q('What color is the ice in the hall?', 'The ice in the hall is blue.',
               ['The ice in the hall is blue.', 'The ice in the hall is red.', 'The ice in the hall is black.'],
               [['ice'], ['blue']],
               '성 안의 얼음은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('What is on the walls?', 'Snowflakes',
               ['Snowflakes', 'Stars', 'Apples'],
               [['snowflake']],
               '벽에는 무엇이 있나요?'),
          6: Q('What is on the walls?', 'Ice snowflakes',
               ['Ice snowflakes', 'Golden stars', 'Red apples'],
               [['snowflake'], ['ice']],
               '벽에는 무엇이 있나요?'),
          8: Q('What is on the walls?', 'There are snowflakes on the walls.',
               ['There are snowflakes on the walls.', 'There are golden stars on the walls.', 'There are red apples on the walls.'],
               [['snowflake'], ['wall']],
               '벽에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('Is the ice hall warm or cold?', 'Cold',
               ['Cold', 'Warm', 'Wet'],
               [['cold', 'ice']],
               '이 얼음 성은 따뜻한가요, 차가운가요?'),
          6: Q('Is the ice hall warm or cold?', 'Very cold',
               ['Very cold', 'Very warm', 'Very wet'],
               [['cold']],
               '이 얼음 성은 따뜻한가요, 차가운가요?'),
          8: Q('Is the ice hall warm or cold?', 'The ice hall is very cold.',
               ['The ice hall is very cold.', 'The ice hall is very warm.', 'The ice hall is very wet.'],
               [['hall'], ['cold']],
               '이 얼음 성은 따뜻한가요, 차가운가요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('What is the floor like?', 'Shiny',
               ['Shiny', 'Soft', 'Bumpy'],
               [['shiny', 'bright', 'clear']],
               '바닥은 어떤가요?'),
          6: Q('What is the floor like?', 'Shiny floor',
               ['Shiny floor', 'Soft floor', 'Bumpy floor'],
               [['shiny', 'bright'], ['floor']],
               '바닥은 어떤가요?'),
          8: Q('What is the floor like?', 'The floor is shiny and clear.',
               ['The floor is shiny and clear.', 'The floor is soft and warm.', 'The floor is bumpy and grey.'],
               [['floor'], ['shiny']],
               '바닥은 어떤가요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('What can you see through the ice?', 'Light',
               ['Light', 'Fish', 'Trees'],
               [['light']],
               '얼음 사이로 무엇이 보이나요?'),
          6: Q('What can you see through the ice?', 'Bright light',
               ['Bright light', 'Blue fish', 'Green trees'],
               [['bright'], ['light']],
               '얼음 사이로 무엇이 보이나요?'),
          8: Q('What can you see through the ice?', 'You can see bright light through the ice.',
               ['You can see bright light through the ice.', 'You can see blue fish through the ice.', 'You can see green trees through the ice.'],
               [['light'], ['ice']],
               '얼음 사이로 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/el-2-icecastle.webp',
        scene: '얼음 성',
        q: {
          4: Q('Is her dress long or short?', 'Long',
               ['Long', 'Short', 'Tiny'],
               [['long']],
               '그녀의 드레스는 길까요, 짧을까요?'),
          6: Q('Is her dress long or short?', 'Long dress',
               ['Long dress', 'Short dress', 'Tiny dress'],
               [['long'], ['dress']],
               '그녀의 드레스는 길까요, 짧을까요?'),
          8: Q('Is her dress long or short?', 'She is wearing a long blue dress.',
               ['She is wearing a long blue dress.', 'She is wearing a short blue dress.', 'She is wearing a tiny blue dress.'],
               [['long'], ['dress'], ['blue']],
               '그녀의 드레스는 길까요, 짧을까요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('What is in the sky?', 'Lights',
               ['Lights', 'Fish', 'Cars'],
               [['light']],
               '하늘에는 무엇이 있나요?'),
          6: Q('What is in the sky?', 'Green lights',
               ['Green lights', 'Blue fish', 'Red cars'],
               [['green'], ['light']],
               '하늘에는 무엇이 있나요?'),
          8: Q('What is in the sky?', 'There are green lights in the sky.',
               ['There are green lights in the sky.', 'There are blue fish in the sky.', 'There are red cars in the sky.'],
               [['light'], ['sky']],
               '하늘에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('What is in the night sky?', 'Stars',
               ['Stars', 'Birds', 'Kites'],
               [['star']],
               '밤하늘에는 무엇이 있나요?'),
          6: Q('What is in the night sky?', 'Many stars',
               ['Many stars', 'Many birds', 'Many kites'],
               [['star']],
               '밤하늘에는 무엇이 있나요?'),
          8: Q('What is in the night sky?', 'There are many stars in the night sky.',
               ['There are many stars in the night sky.', 'There are many birds in the night sky.', 'There are many kites in the night sky.'],
               [['star'], ['sky']],
               '밤하늘에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('What is on the ground?', 'Snow',
               ['Snow', 'Sand', 'Grass'],
               [['snow']],
               '땅에는 무엇이 덮여 있나요?'),
          6: Q('What is on the ground?', 'White snow',
               ['White snow', 'Yellow sand', 'Green grass'],
               [['white'], ['snow']],
               '땅에는 무엇이 덮여 있나요?'),
          8: Q('What is on the ground?', 'The ground is covered with snow.',
               ['The ground is covered with snow.', 'The ground is covered with sand.', 'The ground is covered with grass.'],
               [['ground'], ['snow']],
               '땅에는 무엇이 덮여 있나요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('What is below the mountain?', 'Lake',
               ['Lake', 'City', 'Road'],
               [['lake', 'river', 'water']],
               '산 아래에는 무엇이 있나요?'),
          6: Q('What is below the mountain?', 'Frozen lake',
               ['Frozen lake', 'Big city', 'Long road'],
               [['lake', 'river']],
               '산 아래에는 무엇이 있나요?'),
          8: Q('What is below the mountain?', 'There is a frozen lake below the mountain.',
               ['There is a frozen lake below the mountain.', 'There is a big city below the mountain.', 'There is a long road below the mountain.'],
               [['lake', 'river'], ['mountain']],
               '산 아래에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('What are the tall blue things on the right?', 'Ice',
               ['Ice', 'Trees', 'Houses'],
               [['ice']],
               '오른쪽의 높고 파란 것은 무엇인가요?'),
          6: Q('What are the tall blue things on the right?', 'Ice crystals',
               ['Ice crystals', 'Green trees', 'Tall houses'],
               [['ice']],
               '오른쪽의 높고 파란 것은 무엇인가요?'),
          8: Q('What are the tall blue things on the right?', 'There are ice crystals on the right.',
               ['There are ice crystals on the right.', 'There are green trees on the right.', 'There are tall houses on the right.'],
               [['ice']],
               '오른쪽의 높고 파란 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('What is her hair like?', 'Long',
               ['Long', 'Short', 'Curly'],
               [['long']],
               '그녀의 머리카락은 어떤가요?'),
          6: Q('What is her hair like?', 'Long braid',
               ['Long braid', 'Short hair', 'Curly hair'],
               [['long'], ['braid']],
               '그녀의 머리카락은 어떤가요?'),
          8: Q('What is her hair like?', 'She has a long braid.',
               ['She has a long braid.', 'She has short hair.', 'She has curly hair.'],
               [['braid'], ['long']],
               '그녀의 머리카락은 어떤가요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('What time is it?', 'Night',
               ['Night', 'Morning', 'Noon'],
               [['night']],
               '지금은 언제인가요?'),
          6: Q('What time is it?', 'Night time',
               ['Night time', 'Morning time', 'Lunch time'],
               [['night']],
               '지금은 언제인가요?'),
          8: Q('What time is it?', 'It is night time.',
               ['It is night time.', 'It is morning time.', 'It is lunch time.'],
               [['night']],
               '지금은 언제인가요?')
        }
      },
      {
        img: 'assets/img/el-3-aurora.webp',
        scene: '오로라',
        q: {
          4: Q('Where are the lights?', 'In the sky',
               ['In the sky', 'In the sea', 'In a box'],
               [['sky']],
               '빛은 어디에 있나요?'),
          6: Q('Where are the lights?', 'In the night sky',
               ['In the night sky', 'In the deep sea', 'In a small box'],
               [['sky']],
               '빛은 어디에 있나요?'),
          8: Q('Where are the lights?', 'The lights are in the night sky.',
               ['The lights are in the night sky.', 'The lights are in the deep sea.', 'The lights are in a small box.'],
               [['light'], ['sky']],
               '빛은 어디에 있나요?')
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
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What is behind her?', 'Arch',
               ['Arch', 'Boat', 'Car'],
               [['arch', 'gate', 'door']],
               '그녀 뒤에는 무엇이 있나요?'),
          6: Q('What is behind her?', 'Stone arch',
               ['Stone arch', 'Small boat', 'Fast car'],
               [['stone'], ['arch', 'gate']],
               '그녀 뒤에는 무엇이 있나요?'),
          8: Q('What is behind her?', 'There is a stone arch behind her.',
               ['There is a stone arch behind her.', 'There is a small boat behind her.', 'There is a fast car behind her.'],
               [['arch', 'gate'], ['stone']],
               '그녀 뒤에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What is she leaning on?', 'Stone wall',
               ['Stone wall', 'Soft bed', 'Wooden boat'],
               [['wall', 'stone']],
               '그녀는 무엇에 기대어 있나요?'),
          6: Q('What is she leaning on?', 'Stone wall',
               ['Stone wall', 'Soft bed', 'Wooden boat'],
               [['wall', 'stone']],
               '그녀는 무엇에 기대어 있나요?'),
          8: Q('What is she leaning on?', 'She is leaning on a stone wall.',
               ['She is leaning on a stone wall.', 'She is leaning on a soft bed.', 'She is leaning on a wooden boat.'],
               [['wall'], ['stone']],
               '그녀는 무엇에 기대어 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What is below her?', 'Town',
               ['Town', 'Desert', 'Snow'],
               [['town', 'village', 'city']],
               '그녀 아래에는 무엇이 있나요?'),
          6: Q('What is below her?', 'Small town',
               ['Small town', 'Hot desert', 'White snow'],
               [['town', 'village', 'city']],
               '그녀 아래에는 무엇이 있나요?'),
          8: Q('What is below her?', 'There is a small town below her.',
               ['There is a small town below her.', 'There is a hot desert below her.', 'There is white snow below her.'],
               [['town', 'village', 'city']],
               '그녀 아래에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What is on her sleeves?', 'Stripes',
               ['Stripes', 'Stars', 'Dots'],
               [['stripe']],
               '그녀의 소매에는 무엇이 있나요?'),
          6: Q('What is on her sleeves?', 'Pink stripes',
               ['Pink stripes', 'Yellow stars', 'Black dots'],
               [['pink'], ['stripe']],
               '그녀의 소매에는 무엇이 있나요?'),
          8: Q('What is on her sleeves?', 'Her sleeves have pink stripes.',
               ['Her sleeves have pink stripes.', 'Her sleeves have yellow stars.', 'Her sleeves have black dots.'],
               [['sleeve'], ['stripe']],
               '그녀의 소매에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What is her hair like?', 'Long',
               ['Long', 'Short', 'Curly'],
               [['long']],
               '그녀의 머리카락은 어떤가요?'),
          6: Q('What is her hair like?', 'Long braid',
               ['Long braid', 'Short hair', 'Curly hair'],
               [['long'], ['braid']],
               '그녀의 머리카락은 어떤가요?'),
          8: Q('What is her hair like?', 'She has a very long braid.',
               ['She has a very long braid.', 'She has short hair.', 'She has curly hair.'],
               [['braid'], ['long']],
               '그녀의 머리카락은 어떤가요?')
        }
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What color are the lanterns in the sky?', 'Orange',
               ['Orange', 'Black', 'Blue'],
               [['orange']],
               '하늘의 등불은 무슨 색일까요?'),
          6: Q('What color are the lanterns in the sky?', 'Orange lanterns',
               ['Orange lanterns', 'Black lanterns', 'Blue lanterns'],
               [['orange'], ['lantern']],
               '하늘의 등불은 무슨 색일까요?'),
          8: Q('What color are the lanterns in the sky?', 'The lanterns in the sky are orange.',
               ['The lanterns in the sky are orange.', 'The lanterns in the sky are black.', 'The lanterns in the sky are blue.'],
               [['lantern'], ['orange']],
               '하늘의 등불은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/hero-ra.webp',
        scene: '공주',
        q: {
          4: Q('What color are the flowers on the wall?', 'Pink',
               ['Pink', 'Blue', 'Black'],
               [['pink']],
               '벽에 핀 꽃은 무슨 색일까요?'),
          6: Q('What color are the flowers on the wall?', 'Pink flowers',
               ['Pink flowers', 'Blue flowers', 'Black flowers'],
               [['pink'], ['flower']],
               '벽에 핀 꽃은 무슨 색일까요?'),
          8: Q('What color are the flowers on the stone wall?', 'The flowers on the stone wall are pink.',
               ['The flowers on the stone wall are pink.', 'The flowers on the stone wall are blue.', 'The flowers on the stone wall are black.'],
               [['flower'], ['pink']],
               '돌벽에 핀 꽃은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What color is the sky?', 'Blue',
               ['Blue', 'Black', 'Red'],
               [['blue']],
               '하늘은 무슨 색일까요?'),
          6: Q('What color is the sky?', 'Blue sky',
               ['Blue sky', 'Black sky', 'Red sky'],
               [['blue'], ['sky']],
               '하늘은 무슨 색일까요?'),
          8: Q('What color is the sky above the tower?', 'The sky above the tower is blue.',
               ['The sky above the tower is blue.', 'The sky above the tower is black.', 'The sky above the tower is red.'],
               [['sky'], ['blue']],
               '탑 위의 하늘은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What is in the sky?', 'Clouds',
               ['Clouds', 'Kites', 'Cars'],
               [['cloud']],
               '하늘에는 무엇이 떠 있나요?'),
          6: Q('What is in the sky?', 'White clouds',
               ['White clouds', 'Red kites', 'Blue cars'],
               [['white'], ['cloud']],
               '하늘에는 무엇이 떠 있나요?'),
          8: Q('What is in the sky?', 'There are white clouds in the sky.',
               ['There are white clouds in the sky.', 'There are red kites in the sky.', 'There are blue cars in the sky.'],
               [['cloud'], ['sky']],
               '하늘에는 무엇이 떠 있나요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What do you see far away?', 'Mountains',
               ['Mountains', 'Boats', 'Cars'],
               [['mountain']],
               '멀리 무엇이 보이나요?'),
          6: Q('What do you see far away?', 'Tall mountains',
               ['Tall mountains', 'Blue boats', 'Fast cars'],
               [['tall', 'high'], ['mountain']],
               '멀리 무엇이 보이나요?'),
          8: Q('What do you see far away?', 'She can see tall mountains far away.',
               ['She can see tall mountains far away.', 'She can see blue boats far away.', 'She can see fast cars far away.'],
               [['mountain']],
               '멀리 무엇이 보이나요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What is the tower made of?', 'Stone',
               ['Stone', 'Ice', 'Paper'],
               [['stone']],
               '탑은 무엇으로 만들어졌나요?'),
          6: Q('What is the tower made of?', 'Grey stone',
               ['Grey stone', 'Clear ice', 'White paper'],
               [['grey', 'gray'], ['stone']],
               '탑은 무엇으로 만들어졌나요?'),
          8: Q('What is the tall tower made of?', 'The tall tower is made of grey stone.',
               ['The tall tower is made of grey stone.', 'The tall tower is made of clear ice.', 'The tall tower is made of white paper.'],
               [['tower'], ['stone']],
               '높은 탑은 무엇으로 만들어졌나요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What flowers are on the tower?', 'Flowers',
               ['Flowers', 'Apples', 'Stars'],
               [['flower']],
               '탑에는 어떤 꽃이 있나요?'),
          6: Q('What flowers are on the tower?', 'Pink flowers',
               ['Pink flowers', 'Red apples', 'Yellow stars'],
               [['pink'], ['flower']],
               '탑에는 어떤 꽃이 있나요?'),
          8: Q('What flowers are growing on the tower?', 'Pink flowers are growing on the tower.',
               ['Pink flowers are growing on the tower.', 'Red apples are growing on the tower.', 'Yellow stars are growing on the tower.'],
               [['flower'], ['pink']],
               '탑에서 어떤 꽃이 자라고 있나요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What is her hand on?', 'Railing',
               ['Railing', 'Book', 'Cup'],
               [['rail', 'wall', 'balcony']],
               '그녀의 손은 무엇 위에 있나요?'),
          6: Q('What is her hand on?', 'Stone railing',
               ['Stone railing', 'Old book', 'Blue cup'],
               [['stone'], ['rail', 'wall']],
               '그녀의 손은 무엇 위에 있나요?'),
          8: Q('What is her hand on?', 'Her hand is on the stone railing.',
               ['Her hand is on the stone railing.', 'Her hand is on an old book.', 'Her hand is on a blue cup.'],
               [['hand'], ['rail', 'wall']],
               '그녀의 손은 무엇 위에 있나요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What is in the valley?', 'River',
               ['River', 'Desert', 'Snow'],
               [['river', 'water']],
               '골짜기에는 무엇이 있나요?'),
          6: Q('What is in the valley?', 'Blue river',
               ['Blue river', 'Yellow desert', 'White snow'],
               [['blue'], ['river', 'water']],
               '골짜기에는 무엇이 있나요?'),
          8: Q('What is in the valley?', 'There is a blue river in the valley.',
               ['There is a blue river in the valley.', 'There is a yellow desert in the valley.', 'There is white snow in the valley.'],
               [['river', 'water']],
               '골짜기에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ra-1-tower.webp',
        scene: '높은 탑',
        q: {
          4: Q('What is on the right of the tower?', 'Window',
               ['Window', 'Door', 'Mirror'],
               [['window']],
               '탑의 오른쪽에는 무엇이 있나요?'),
          6: Q('What is on the right of the tower?', 'Tall window',
               ['Tall window', 'Brown door', 'Golden mirror'],
               [['tall', 'high'], ['window']],
               '탑의 오른쪽에는 무엇이 있나요?'),
          8: Q('What is on the right of the tower?', 'There is a tall window on the tower.',
               ['There is a tall window on the tower.', 'There is a brown door on the tower.', 'There is a golden mirror on the tower.'],
               [['window']],
               '탑의 오른쪽에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What is she holding?', 'Brush',
               ['Brush', 'Spoon', 'Cup'],
               [['brush']],
               '그녀는 무엇을 들고 있나요?'),
          6: Q('What is she holding?', 'Paint brush',
               ['Paint brush', 'Silver spoon', 'Blue cup'],
               [['brush']],
               '그녀는 무엇을 들고 있나요?'),
          8: Q('What is she holding?', 'She is holding a paint brush.',
               ['She is holding a paint brush.', 'She is holding a silver spoon.', 'She is holding a blue cup.'],
               [['brush'], ['paint']],
               '그녀는 무엇을 들고 있나요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What is she holding in her other hand?', 'Palette',
               ['Palette', 'Shoe', 'Hat'],
               [['palette', 'paint']],
               '그녀의 다른 손에는 무엇이 있나요?'),
          6: Q('What is she holding in her other hand?', 'Paint palette',
               ['Paint palette', 'Red shoe', 'Big hat'],
               [['palette', 'paint']],
               '그녀의 다른 손에는 무엇이 있나요?'),
          8: Q('What is she holding in her other hand?', 'She has paints on her palette.',
               ['She has paints on her palette.', 'She has a red shoe on her palette.', 'She has a big hat on her palette.'],
               [['palette', 'paint']],
               '그녀의 다른 손에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What is on the canvas?', 'Castle',
               ['Castle', 'Fish', 'Snow'],
               [['castle', 'palace']],
               '그림 속에는 무엇이 있나요?'),
          6: Q('What is on the canvas?', 'Castle picture',
               ['Castle picture', 'Fish picture', 'Snow picture'],
               [['castle', 'palace'], ['picture', 'painting']],
               '그림 속에는 무엇이 있나요?'),
          8: Q('What is she painting on the canvas?', 'She is painting a picture of a castle.',
               ['She is painting a picture of a castle.', 'She is painting a picture of a fish.', 'She is painting a picture of snow.'],
               [['paint'], ['castle', 'palace']],
               '그녀는 그림에 무엇을 그리고 있나요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What is beside her in the grass?', 'Frog',
               ['Frog', 'Cat', 'Bird'],
               [['frog']],
               '풀밭에서 그녀 옆에는 무엇이 있나요?'),
          6: Q('What is beside her in the grass?', 'Green frog',
               ['Green frog', 'Black cat', 'Blue bird'],
               [['green'], ['frog']],
               '풀밭에서 그녀 옆에는 무엇이 있나요?'),
          8: Q('What is beside her in the grass?', 'There is a green frog beside her.',
               ['There is a green frog beside her.', 'There is a black cat beside her.', 'There is a blue bird beside her.'],
               [['frog'], ['green']],
               '풀밭에서 그녀 옆에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What color are the daisies?', 'White',
               ['White', 'Red', 'Black'],
               [['white']],
               '데이지 꽃은 무슨 색일까요?'),
          6: Q('What color are the daisies?', 'White daisies',
               ['White daisies', 'Red daisies', 'Black daisies'],
               [['white'], ['daisy', 'flower']],
               '데이지 꽃은 무슨 색일까요?'),
          8: Q('What color are the daisies?', 'The daisies in the grass are white.',
               ['The daisies in the grass are white.', 'The daisies in the grass are red.', 'The daisies in the grass are black.'],
               [['daisy', 'flower'], ['white']],
               '풀밭의 데이지 꽃은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What is in the wooden box?', 'Paints',
               ['Paints', 'Apples', 'Books'],
               [['paint', 'jar', 'bottle']],
               '나무 상자 안에는 무엇이 있나요?'),
          6: Q('What is in the wooden box?', 'Paint jars',
               ['Paint jars', 'Red apples', 'Big books'],
               [['paint'], ['jar', 'bottle']],
               '나무 상자 안에는 무엇이 있나요?'),
          8: Q('What is in the wooden box?', 'There are paint jars in the wooden box.',
               ['There are paint jars in the wooden box.', 'There are red apples in the wooden box.', 'There are big books in the wooden box.'],
               [['paint', 'jar'], ['box']],
               '나무 상자 안에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ra-2-painting.webp',
        scene: '그림 그리기',
        q: {
          4: Q('What color is the grass?', 'Green',
               ['Green', 'Yellow', 'Purple'],
               [['green']],
               '풀은 무슨 색일까요?'),
          6: Q('What color is the grass?', 'Green grass',
               ['Green grass', 'Yellow grass', 'Purple grass'],
               [['green'], ['grass', 'meadow']],
               '풀은 무슨 색일까요?'),
          8: Q('What color is the grass?', 'The grass in the meadow is green.',
               ['The grass in the meadow is green.', 'The grass in the meadow is yellow.', 'The grass in the meadow is purple.'],
               [['grass', 'meadow'], ['green']],
               '들판의 풀은 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What is in the boat with her?', 'Lantern',
               ['Lantern', 'Apple', 'Dog'],
               [['lantern', 'light']],
               '배 안에서 그녀와 함께 있는 것은 무엇인가요?'),
          6: Q('What is in the boat with her?', 'Paper lantern',
               ['Paper lantern', 'Red apple', 'Little dog'],
               [['lantern', 'light']],
               '배 안에서 그녀와 함께 있는 것은 무엇인가요?'),
          8: Q('What is in the boat with her?', 'There is a paper lantern in the boat.',
               ['There is a paper lantern in the boat.', 'There is a red apple in the boat.', 'There is a little dog in the boat.'],
               [['lantern'], ['boat']],
               '배 안에서 그녀와 함께 있는 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What time is it?', 'Night',
               ['Night', 'Morning', 'Noon'],
               [['night']],
               '지금은 언제인가요?'),
          6: Q('What time is it?', 'Night time',
               ['Night time', 'Morning time', 'Lunch time'],
               [['night']],
               '지금은 언제인가요?'),
          8: Q('What time is it?', 'It is night time.',
               ['It is night time.', 'It is morning time.', 'It is lunch time.'],
               [['night']],
               '지금은 언제인가요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What is on the water?', 'Lanterns',
               ['Lanterns', 'Fish', 'Cars'],
               [['lantern']],
               '물 위에는 무엇이 있나요?'),
          6: Q('What is on the water?', 'Glowing lanterns',
               ['Glowing lanterns', 'Blue fish', 'Small cars'],
               [['lantern']],
               '물 위에는 무엇이 있나요?'),
          8: Q('What is on the water?', 'There are glowing lanterns on the water.',
               ['There are glowing lanterns on the water.', 'There are blue fish on the water.', 'There are small cars on the water.'],
               [['lantern'], ['water']],
               '물 위에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What color is the boat?', 'Brown',
               ['Brown', 'Blue', 'Pink'],
               [['brown', 'wood']],
               '배는 무슨 색일까요?'),
          6: Q('What color is the boat?', 'Brown boat',
               ['Brown boat', 'Blue boat', 'Pink boat'],
               [['brown', 'wood'], ['boat']],
               '배는 무슨 색일까요?'),
          8: Q('What color is the boat?', 'The boat is made of brown wood.',
               ['The boat is made of brown wood.', 'The boat is made of blue wood.', 'The boat is made of pink wood.'],
               [['boat'], ['brown', 'wood']],
               '배는 무슨 색일까요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What is glowing far away?', 'Castle',
               ['Castle', 'Desert', 'Snow'],
               [['castle', 'town']],
               '멀리 빛나는 것은 무엇인가요?'),
          6: Q('What is glowing far away?', 'Little castle',
               ['Little castle', 'Hot desert', 'White snow'],
               [['castle', 'town']],
               '멀리 빛나는 것은 무엇인가요?'),
          8: Q('What is glowing far away?', 'There is a little castle glowing far away.',
               ['There is a little castle glowing far away.', 'There is a hot desert glowing far away.', 'There is white snow glowing far away.'],
               [['castle', 'town']],
               '멀리 빛나는 것은 무엇인가요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What is on her head?', 'Flowers',
               ['Flowers', 'Stars', 'Shells'],
               [['flower']],
               '그녀의 머리에는 무엇이 있나요?'),
          6: Q('What is on her head?', 'Little flowers',
               ['Little flowers', 'Blue stars', 'Pink shells'],
               [['little', 'small'], ['flower']],
               '그녀의 머리에는 무엇이 있나요?'),
          8: Q('What is on her head?', 'She has little flowers in her hair.',
               ['She has little flowers in her hair.', 'She has blue stars in her hair.', 'She has pink shells in her hair.'],
               [['flower'], ['hair']],
               '그녀의 머리에는 무엇이 있나요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What color is the water?', 'Dark',
               ['Dark', 'Yellow', 'White'],
               [['dark']],
               '물은 어떤가요?'),
          6: Q('What color is the water?', 'Dark water',
               ['Dark water', 'Yellow water', 'White water'],
               [['dark'], ['water']],
               '물은 어떤가요?'),
          8: Q('What is the water like?', 'The water is dark and calm.',
               ['The water is dark and calm.', 'The water is yellow and warm.', 'The water is white and cold.'],
               [['water'], ['dark']],
               '물은 어떤가요?')
        }
      },
      {
        img: 'assets/img/ra-3-lanterns.webp',
        scene: '등불 축제',
        q: {
          4: Q('What color are the lanterns on the water?', 'Orange',
               ['Orange', 'Green', 'Black'],
               [['orange']],
               '물 위의 등불은 무슨 색일까요?'),
          6: Q('What color are the lanterns on the water?', 'Orange lanterns',
               ['Orange lanterns', 'Green lanterns', 'Black lanterns'],
               [['orange'], ['lantern']],
               '물 위의 등불은 무슨 색일까요?'),
          8: Q('What color are the lanterns on the water?', 'The lanterns on the water are orange.',
               ['The lanterns on the water are orange.', 'The lanterns on the water are green.', 'The lanterns on the water are black.'],
               [['lantern'], ['orange']],
               '물 위의 등불은 무슨 색일까요?')
        }
      }
    ]
  }
];
