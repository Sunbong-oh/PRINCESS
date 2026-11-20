/* Princess Talk — 일상 영어회화 (Talk) 문항 데이터
   7가지 주제 × 9문항 = 63문항, 문항마다 4살·6살·8살·12살 4단계.
   아이는 보기를 고르지 않고 자기 이야기를 영어로 말합니다.
   공주가 먼저 예시(ex)를 말하고 → 0.6초 쉬고 → 질문(q)을 던집니다.
   hint = 아이가 따라 말해 볼 수 있는 모범 대답 틀.
   ko   = 부모님이 옆에서 도와줄 수 있는 한국어 뜻.

   · 주제: 좋아하는 것 / 먹은 것 / 가본 곳 / 기분 / Have / How many / Where
   · 4살: 세 단어 안팎의 아주 짧은 예시와 질문
   · 6살: 두 문장 정도, 일상 표현
   · 8살: 조금 더 긴 문장과 이유 묻기
   · 12살: 긴 일상 회화, 경험이나 생각을 묻기
   · 정답이 하나로 정해지지 않는 질문이라, 아이가 말한 내용은 무엇이든 맞습니다.
     (말해보기로 '핵심 표현'이 들리면 자동 통과, 아니면 부모님이 ⭕ 맞았어요를 눌러 주세요.)
*/

const TALK_LEVELS = [4, 6, 8, 12];

/* keys: 아이가 이 주제답게 말했는지 알아보는 핵심 표현 (소문자) */
const TALK_TOPICS = [
  { id: 'like',  ko: '좋아하는 것', emoji: '💗',
    keys: ['like', 'likes', 'love', 'loves', 'favorite', 'favourite', 'enjoy', 'best'] },
  { id: 'ate',   ko: '먹은 것', emoji: '🍰',
    keys: ['ate', 'eat', 'eats', 'had', 'drank', 'drink', 'food', 'tasty', 'yummy', 'delicious', 'made', 'make', 'cook', 'cooked', 'sweet', 'salty', 'spicy'] },
  { id: 'been',  ko: '가본 곳', emoji: '🏖️',
    keys: ['went', 'go', 'goes', 'visited', 'been', 'saw', 'see', 'trip', 'travel', 'walked', 'played'] },
  { id: 'feel',  ko: '기분', emoji: '😊',
    keys: ['feel', 'feels', 'felt', 'am', 'happy', 'sad', 'angry', 'tired', 'fine', 'good', 'great', 'scared', 'excited', 'proud', 'lonely', 'sleepy', 'nervous', 'calm'] },
  { id: 'have',  ko: 'Have', emoji: '🎁',
    keys: ['have', 'has', 'had', 'got', 'there'] },
  { id: 'many',  ko: 'How many', emoji: '🔢',
    keys: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
           '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'lots', 'many', 'times', 'glass', 'glasses'] },
  { id: 'where', ko: 'Where', emoji: '📍',
    keys: ['in', 'at', 'on', 'near', 'under', 'next', 'home', 'house', 'here', 'there', 'school', 'park', 'room', 'kitchen', 'outside', 'beside'] }
];

/* 공주 10명 — 한 판 10문제에 한 명씩, 매 문제 다른 공주가 물어봅니다.
   이름은 그림 속 공주를 부르는 이름이고, imgs는 그 공주가 나온 그림들입니다.
   (같은 질문이라도 날마다 다른 공주·다른 그림이 물어볼 수 있게 하루 단위로 섞습니다.) */
const TALK_PRINCESSES = [
  { id: 'sw', ko: '백설공주', en: 'Snow White',
    imgs: ['../assets/img/hero-sw.webp', '../assets/img/sw-1-mirror.webp', '../assets/img/sw-2-mugs.webp', '../assets/img/sw-3-apples.webp'] },
  { id: 'ci', ko: '신데렐라', en: 'Cinderella',
    imgs: ['../assets/img/hero-ci.webp', '../assets/img/ci-1-carriage.webp', '../assets/img/ci-2-ballroom.webp', '../assets/img/ci-3-midnight.webp'] },
  { id: 'sb', ko: '잠자는 숲속의 공주', en: 'Sleeping Beauty',
    imgs: ['../assets/img/hero-sb.webp', '../assets/img/sb-1-wheel.webp', '../assets/img/sb-2-forest.webp', '../assets/img/sb-3-roses.webp'] },
  { id: 'ra', ko: '라푼젤', en: 'Rapunzel',
    imgs: ['../assets/img/hero-ra.webp', '../assets/img/ra-1-tower.webp', '../assets/img/ra-2-painting.webp', '../assets/img/ra-3-lanterns.webp'] },
  { id: 'el', ko: '엘사', en: 'Elsa',
    imgs: ['../assets/img/hero-el.webp', '../assets/img/el-1-snowman.webp', '../assets/img/el-2-icecastle.webp', '../assets/img/el-3-aurora.webp'] },
  { id: 'lm', ko: '인어공주', en: 'The Little Mermaid',
    imgs: ['../assets/img/hero-lm.webp', '../assets/img/lm-1-fish.webp', '../assets/img/lm-2-treasure.webp', '../assets/img/lm-3-castle.webp'] },
  { id: 'ch', ko: '샤를로트 공주', en: 'Princess Charlotte',
    imgs: ['img/talk-cake.webp'] },
  { id: 'li', ko: '릴리 공주', en: 'Princess Lily',
    imgs: ['img/talk-park.webp'] },
  { id: 'ro', ko: '로즈 공주', en: 'Princess Rose',
    imgs: ['img/talk-laugh.webp'] },
  { id: 'lu', ko: '루나 공주', en: 'Princess Luna',
    imgs: ['img/talk-bear.webp'] }
];

/* L(ex, q, ko, hint) — 한 난이도의 한 문항 */
function L(ex, q, ko, hint) {
  return { ex: ex, q: q, ko: ko, hint: hint };
}
/* T(id, topic, 4살, 6살, 8살, 12살) */
function T(id, topic, lv4, lv6, lv8, lv12) {
  return { id: id, topic: topic, lv: { 4: lv4, 6: lv6, 8: lv8, 12: lv12 } };
}

const TALK_ITEMS = [

  /* ===================== 1. 좋아하는 것 ===================== */
  T('like-01', 'like',
    L('I like cake.', 'What do you like?', '나는 케이크를 좋아해. 너는 무엇을 좋아해?', 'I like ice cream.'),
    L('I like cake and ice cream.', 'What do you like?', '나는 케이크랑 아이스크림을 좋아해. 너는 무엇을 좋아해?', 'I like cookies and milk.'),
    L('I like sweet strawberries and cold ice cream.', 'What is your favorite food?', '나는 달콤한 딸기와 차가운 아이스크림을 좋아해. 네가 가장 좋아하는 음식은 뭐야?', 'My favorite food is pizza.'),
    L('I really like sweet fruit, and I like it best in summer.', 'What kind of food do you like the most?', '나는 달콤한 과일을 정말 좋아하고, 여름에 가장 맛있어. 네가 가장 좋아하는 음식은 뭐야?', 'I like noodles, and I like them best when it is cold.')),

  T('like-02', 'like',
    L('I like pink.', 'What color do you like?', '나는 분홍색을 좋아해. 너는 무슨 색을 좋아해?', 'I like yellow.'),
    L('My dress is pink, and I like pink.', 'What is your favorite color?', '내 드레스는 분홍색이야. 네가 가장 좋아하는 색은 뭐야?', 'I like blue and green.'),
    L('I like the color of the sky.', 'What is your favorite color, and why?', '나는 하늘색을 좋아해. 네가 가장 좋아하는 색은 뭐고, 왜 좋아해?', 'I like blue because the sea is blue.'),
    L('I love sky blue because it makes me feel calm.', 'Which color do you like best, and what does it remind you of?', '나는 하늘색이 마음을 편안하게 해서 좋아해. 네가 가장 좋아하는 색은 뭐고, 그 색은 무엇이 떠오르게 해?', 'I like green because it reminds me of the forest.')),

  T('like-03', 'like',
    L('I like cats.', 'What animal do you like?', '나는 고양이를 좋아해. 너는 어떤 동물을 좋아해?', 'I like dogs.'),
    L('I like animals with soft fur.', 'What animal do you like?', '나는 털이 부드러운 동물을 좋아해. 너는 어떤 동물을 좋아해?', 'I like rabbits.'),
    L('I like animals that live in the forest.', 'What animal do you like best, and why?', '나는 숲에 사는 동물을 좋아해. 네가 가장 좋아하는 동물은 뭐고, 왜 좋아해?', 'I like dogs because they are friendly.'),
    L('I like animals that live in the sea.', 'What animal do you like best, and have you ever seen one?', '나는 바다에 사는 동물을 좋아해. 네가 가장 좋아하는 동물은 뭐고, 그 동물을 직접 본 적 있어?', 'I like dolphins, and I saw one at the aquarium.')),

  T('like-04', 'like',
    L('I like this song.', 'What song do you like?', '나는 이 노래가 좋아. 너는 무슨 노래를 좋아해?', 'I like the ABC song.'),
    L('I sing every morning.', 'What is your favorite song?', '나는 아침마다 노래를 불러. 네가 가장 좋아하는 노래는 뭐야?', 'I like the animal song.'),
    L('I love songs that make me dance.', 'What kind of music do you like?', '나는 춤추고 싶게 만드는 노래를 좋아해. 너는 어떤 음악을 좋아해?', 'I like happy songs that I can dance to.'),
    L('I listen to music while I clean my room.', 'What kind of music do you like, and when do you listen to it?', '나는 방을 정리할 때 음악을 들어. 어떤 음악을 좋아하고, 언제 들어?', 'I like pop songs, and I listen to them on the bus.')),

  T('like-05', 'like',
    L('I like to play with blocks.', 'What do you like to play?', '나는 블록 놀이를 좋아해. 너는 무슨 놀이를 좋아해?', 'I like to play with dolls.'),
    L('I play hide and seek with my friends.', 'What game do you like?', '나는 친구들과 숨바꼭질을 해. 너는 무슨 놀이를 좋아해?', 'I like tag.'),
    L('I like games that we play outside.', 'What is your favorite game, and who do you play it with?', '나는 밖에서 하는 놀이를 좋아해. 네가 가장 좋아하는 놀이는 뭐고, 누구와 같이 해?', 'I like soccer, and I play it with my dad.'),
    L('I play games with my friends after school.', 'What game do you enjoy most, and why do you like it?', '나는 방과 후에 친구들과 게임을 해. 어떤 게임을 가장 재미있어 하고, 왜 좋아해?', 'I enjoy board games because we can talk and laugh together.')),

  T('like-06', 'like',
    L('I like this story.', 'What story do you like?', '나는 이 이야기가 좋아. 너는 무슨 이야기를 좋아해?', 'I like the princess story.'),
    L('My mom reads me a book at night.', 'What book do you like?', '엄마가 밤에 책을 읽어 줘. 너는 무슨 책을 좋아해?', 'I like the animal book.'),
    L('I like stories about brave children.', 'What kind of story do you like?', '나는 용감한 아이들 이야기를 좋아해. 너는 어떤 이야기를 좋아해?', 'I like funny stories about animals.'),
    L('I read a little every night before bed.', 'What kind of books do you like, and which one was the best?', '나는 잘 때마다 조금씩 책을 읽어. 어떤 책을 좋아하고, 그중 가장 재미있던 책은 뭐야?', 'I like mystery books, and the best one was about a lost dog.')),

  T('like-07', 'like',
    L('I like summer. I can swim.', 'What season do you like?', '나는 여름이 좋아. 수영할 수 있거든. 너는 무슨 계절을 좋아해?', 'I like winter.'),
    L('I like summer because I can swim.', 'What season do you like?', '나는 수영할 수 있어서 여름을 좋아해. 너는 무슨 계절을 좋아해?', 'I like winter because I can make a snowman.'),
    L('I like autumn when the leaves turn red.', 'Which season do you like best, and what do you do then?', '나는 나뭇잎이 빨개지는 가을을 좋아해. 어느 계절을 가장 좋아하고, 그때 무엇을 해?', 'I like spring because I can see flowers.'),
    L('I like autumn because the air is cool and the leaves are pretty.', 'Which season do you like best, and what is special about it for you?', '나는 공기가 시원하고 나뭇잎이 예뻐서 가을을 좋아해. 어느 계절을 가장 좋아하고, 그 계절의 무엇이 특별해?', 'I like winter because I can drink hot chocolate with my family.')),

  T('like-08', 'like',
    L('I like milk.', 'What do you like to drink?', '나는 우유를 좋아해. 너는 무엇을 마시는 걸 좋아해?', 'I like juice.'),
    L('I drink warm milk before bed.', 'What do you like to drink?', '나는 자기 전에 따뜻한 우유를 마셔. 너는 무엇을 마시는 걸 좋아해?', 'I like apple juice.'),
    L('I like cold juice on a hot day.', 'What is your favorite drink, and when do you drink it?', '나는 더운 날에 차가운 주스를 좋아해. 네가 가장 좋아하는 음료는 뭐고, 언제 마셔?', 'I like milk in the morning.'),
    L('I love a warm cup of milk after dinner.', 'What is your favorite drink, and how do you make it?', '나는 저녁 식사 후에 따뜻한 우유 한 잔을 좋아해. 네가 가장 좋아하는 음료는 뭐고, 어떻게 만들어?', 'I like lemon tea with honey.')),

  T('like-09', 'like',
    L('I like my teddy bear.', 'What toy do you like?', '나는 곰인형을 좋아해. 너는 무슨 장난감을 좋아해?', 'I like my car.'),
    L('I sleep with my teddy bear every night.', 'What is your favorite toy?', '나는 매일 밤 곰인형과 자. 네가 가장 좋아하는 장난감은 뭐야?', 'I like my red car.'),
    L('I like toys that I can build.', 'What is your favorite toy, and why?', '나는 만들 수 있는 장난감을 좋아해. 네가 가장 좋아하는 장난감은 뭐고, 왜 좋아해?', 'I like blocks because I can make a castle.'),
    L('I keep my favorite toy on my bed.', 'What is your favorite toy, and what do you like to do with it?', '나는 가장 좋아하는 장난감을 침대 위에 둬. 네가 가장 좋아하는 장난감은 뭐고, 그것으로 무엇을 하는 걸 좋아해?', 'I like my robot because I can build new things with it.')),

  /* ===================== 2. 먹은 것 ===================== */
  T('ate-01', 'ate',
    L('I ate an apple.', 'What did you eat?', '나는 사과를 먹었어. 너는 무엇을 먹었어?', 'I ate rice.'),
    L('I ate bread and eggs this morning.', 'What did you eat for breakfast?', '나는 오늘 아침에 빵과 달걀을 먹었어. 너는 아침으로 무엇을 먹었어?', 'I ate cereal and milk.'),
    L('I had warm soup for lunch.', 'What did you eat today?', '나는 점심으로 따뜻한 국을 먹었어. 오늘 무엇을 먹었어?', 'I ate rice and soup with my family.'),
    L('I tried a new dish at lunch today.', 'What did you eat today, and how was it?', '나는 오늘 점심에 새 음식을 먹어 봤어. 오늘 무엇을 먹었고, 어땠어?', 'I ate noodles, and they were a little spicy.')),

  T('ate-02', 'ate',
    L('I ate a banana.', 'What fruit did you eat?', '나는 바나나를 먹었어. 너는 무슨 과일을 먹었어?', 'I ate grapes.'),
    L('I ate sweet grapes after lunch.', 'What fruit did you eat today?', '나는 점심 후에 달콤한 포도를 먹었어. 오늘 무슨 과일을 먹었어?', 'I ate a peach.'),
    L('I shared strawberries with my friend.', 'What fruit did you eat, and was it sweet?', '나는 친구와 딸기를 나눠 먹었어. 무슨 과일을 먹었고, 달았어?', 'I ate watermelon, and it was very sweet.'),
    L('I made a fruit salad with apples and bananas.', 'What did you eat today that you really enjoyed?', '나는 사과와 바나나로 과일 샐러드를 만들었어. 오늘 먹은 것 중에 정말 맛있었던 건 뭐야?', 'I ate a mango for the first time, and it was delicious.')),

  T('ate-03', 'ate',
    L('I ate eggs.', 'What did you eat for breakfast?', '나는 달걀을 먹었어. 너는 아침으로 무엇을 먹었어?', 'I ate bread.'),
    L('I ate toast with jam.', 'What did you have for breakfast?', '나는 잼을 바른 토스트를 먹었어. 너는 아침으로 무엇을 먹었어?', 'I had eggs and milk.'),
    L('I had a big breakfast with my family.', 'What did you have for breakfast this morning?', '나는 가족과 아침을 푸짐하게 먹었어. 오늘 아침에 무엇을 먹었어?', 'I had rice, eggs, and seaweed soup.'),
    L('I was in a hurry this morning, so I ate something quick.', 'What did you have for breakfast, and did you like it?', '나는 오늘 아침에 서둘러서 간단히 먹었어. 아침으로 무엇을 먹었고, 맛있었어?', 'I had a sandwich and juice, and it was enough.')),

  T('ate-04', 'ate',
    L('I ate rice.', 'What did you eat for dinner?', '나는 밥을 먹었어. 너는 저녁으로 무엇을 먹었어?', 'I ate noodles.'),
    L('I ate noodles for dinner.', 'What did you eat for dinner?', '나는 저녁으로 국수를 먹었어. 너는 저녁으로 무엇을 먹었어?', 'I ate rice and fish.'),
    L('I had dinner at my grandma\'s house.', 'What did you eat for dinner, and who did you eat with?', '나는 할머니 댁에서 저녁을 먹었어. 저녁으로 무엇을 먹었고, 누구와 먹었어?', 'I ate dumplings with my grandma.'),
    L('We ate out at a small restaurant near our home.', 'What did you have for dinner, and would you eat it again?', '우리는 집 근처 작은 식당에서 외식을 했어. 저녁으로 무엇을 먹었고, 또 먹고 싶어?', 'I had fried rice, and I would like to eat it again.')),

  T('ate-05', 'ate',
    L('I ate a cookie.', 'What snack did you eat?', '나는 쿠키를 먹었어. 너는 무슨 간식을 먹었어?', 'I ate crackers.'),
    L('I ate a cookie after school.', 'What snack did you eat today?', '나는 방과 후에 쿠키를 먹었어. 오늘 무슨 간식을 먹었어?', 'I ate yogurt.'),
    L('I shared a snack with my friend.', 'What snack did you eat, and was it tasty?', '나는 친구와 간식을 나눠 먹었어. 무슨 간식을 먹었고, 맛있었어?', 'I ate popcorn, and it was salty and tasty.'),
    L('I bought a small snack on the way home.', 'What snack did you have today, and was it worth it?', '나는 집에 오는 길에 작은 간식을 샀어. 오늘 무슨 간식을 먹었고, 만족스러웠어?', 'I had a chocolate bar, and it was too sweet for me.')),

  T('ate-06', 'ate',
    L('I drank water.', 'What did you drink?', '나는 물을 마셨어. 너는 무엇을 마셨어?', 'I drank milk.'),
    L('I drank cold water after playing.', 'What did you drink today?', '나는 놀고 나서 찬 물을 마셨어. 오늘 무엇을 마셨어?', 'I drank juice.'),
    L('I drank warm milk before bed last night.', 'What did you drink today, and was it cold or warm?', '나는 어젯밤에 따뜻한 우유를 마셨어. 오늘 무엇을 마셨고, 차가웠어 따뜻했어?', 'I drank cold water after my walk.'),
    L('I tried a new drink at the cafe.', 'What did you drink today, and did you like it?', '나는 카페에서 새 음료를 마셔 봤어. 오늘 무엇을 마셨고, 좋았어?', 'I drank a strawberry smoothie, and it was refreshing.')),

  T('ate-07', 'ate',
    L('I made a sandwich.', 'What did you make?', '나는 샌드위치를 만들었어. 너는 무엇을 만들었어?', 'I made a salad.'),
    L('I helped my mom make pancakes.', 'What did you help make?', '나는 엄마가 팬케이크 만드는 걸 도왔어. 너는 무엇을 만드는 걸 도왔어?', 'I helped make kimbap.'),
    L('I helped cook dinner in the kitchen.', 'What did you make, and who helped you?', '나는 부엌에서 저녁 만드는 걸 도왔어. 무엇을 만들었고, 누가 도와줬어?', 'I made pancakes with my mom.'),
    L('I cooked a simple dish for my family.', 'What did you cook, and how did it turn out?', '나는 가족을 위해 간단한 요리를 했어. 무엇을 요리했고, 잘 됐어?', 'I cooked fried eggs, and they were a little burnt but tasty.')),

  T('ate-08', 'ate',
    L('The cake was sweet.', 'How was your food?', '케이크가 달았어. 네가 먹은 음식은 어땠어?', 'It was yummy.'),
    L('The soup was warm and tasty.', 'How did your food taste?', '국이 따뜻하고 맛있었어. 네가 먹은 음식은 어땠어?', 'It was spicy.'),
    L('My lunch was a little too salty.', 'How did your food taste today?', '내 점심은 조금 짰어. 오늘 먹은 음식은 어땠어?', 'It was sweet and soft.'),
    L('The dish I had was full of flavor.', 'How did the food taste, and would you order it again?', '내가 먹은 음식은 맛이 진했어. 그 음식은 어땠고, 다시 주문하고 싶어?', 'It was spicy but delicious, and I would order it again.')),

  T('ate-09', 'ate',
    L('I ate at home.', 'Where did you eat?', '나는 집에서 먹었어. 너는 어디에서 먹었어?', 'I ate at school.'),
    L('I ate at a restaurant with my dad.', 'Where did you eat today?', '나는 아빠와 식당에서 먹었어. 오늘 어디에서 먹었어?', 'I ate at home.'),
    L('I ate lunch at a small restaurant.', 'Where did you eat today, and what did you eat?', '나는 작은 식당에서 점심을 먹었어. 오늘 어디에서 먹었고, 무엇을 먹었어?', 'I ate at school with my friends.'),
    L('We had dinner at a restaurant near the beach.', 'Where did you eat, and what was the place like?', '우리는 바닷가 근처 식당에서 저녁을 먹었어. 어디에서 먹었고, 그곳은 어땠어?', 'We ate at a noodle shop, and it was small but cozy.')),

  /* ===================== 3. 가본 곳 ===================== */
  T('been-01', 'been',
    L('I went to the beach.', 'Where did you go?', '나는 바다에 갔어. 너는 어디에 갔어?', 'I went to the park.'),
    L('I went to the beach with my family.', 'Where did you go last weekend?', '나는 지난 주말에 가족과 바다에 갔어. 너는 어디에 갔어?', 'I went to the zoo.'),
    L('I went to the beach and played in the water.', 'Where did you go, and what did you do there?', '나는 바다에 가서 물놀이를 했어. 어디에 갔고, 거기서 무엇을 했어?', 'I went to the museum and saw dinosaurs.'),
    L('I visited a small island last summer.', 'Where did you go on your last trip, and what was it like?', '나는 지난여름에 작은 섬에 갔어. 지난 여행에서 어디에 갔고, 어땠어?', 'I went to Busan, and the sea was beautiful.')),

  T('been-02', 'been',
    L('I went to the park.', 'Where did you play?', '나는 공원에 갔어. 너는 어디에서 놀았어?', 'I played at the playground.'),
    L('I played at the park near my house.', 'Where did you play today?', '나는 집 근처 공원에서 놀았어. 오늘 어디에서 놀았어?', 'I played at my friend\'s house.'),
    L('I went to the park with my friends after school.', 'Where did you go, and who did you go with?', '나는 방과 후에 친구들과 공원에 갔어. 어디에 갔고, 누구와 갔어?', 'I went to the playground with my dad.'),
    L('I walked along the river in the park.', 'Where did you go, and what did you like most about it?', '나는 공원에서 강을 따라 걸었어. 어디에 갔고, 그중 무엇이 가장 좋았어?', 'I went to the park, and I liked the flowers.')),

  T('been-03', 'been',
    L('I saw a lion.', 'Where did you see it?', '나는 사자를 봤어. 너는 어디에서 봤어?', 'I saw it at the zoo.'),
    L('I went to the zoo and saw lions.', 'Where did you go?', '나는 동물원에 가서 사자를 봤어. 너는 어디에 갔어?', 'I went to the aquarium.'),
    L('I went to the zoo with my class.', 'Where did you go, and which animal did you like best?', '나는 반 친구들과 동물원에 갔어. 어디에 갔고, 어떤 동물이 가장 좋았어?', 'I went to the zoo and liked the elephants.'),
    L('I spent a whole day at the zoo.', 'Where did you go, and what did you enjoy most?', '나는 동물원에서 하루를 보냈어. 어디에 갔고, 무엇이 가장 즐거웠어?', 'I went to the aquarium and loved the sharks.')),

  T('been-04', 'been',
    L('I went to my grandma\'s house.', 'Where did you go?', '나는 할머니 댁에 갔어. 너는 어디에 갔어?', 'I went to my friend\'s house.'),
    L('I went to my grandma\'s house on Sunday.', 'Where did you go last Sunday?', '나는 일요일에 할머니 댁에 갔어. 지난 일요일에 어디에 갔어?', 'I went to my aunt\'s house.'),
    L('I stayed at my grandma\'s house for the weekend.', 'Where did you go, and what did you do?', '나는 주말에 할머니 댁에 머물렀어. 어디에 갔고, 무엇을 했어?', 'I went to my cousin\'s house and played.'),
    L('I visited my grandparents in the countryside.', 'Where did you go, and what did you do there?', '나는 시골에 계신 조부모님을 뵈러 갔어. 어디에 갔고, 거기서 무엇을 했어?', 'I went to the countryside and helped pick fruit.')),

  T('been-05', 'been',
    L('I go to school.', 'Where do you go in the morning?', '나는 학교에 가. 너는 아침에 어디에 가?', 'I go to kindergarten.'),
    L('I go to kindergarten every morning.', 'Where do you go in the morning?', '나는 매일 아침 유치원에 가. 너는 아침에 어디에 가?', 'I go to school.'),
    L('I went to school early today.', 'Where did you go this morning, and what did you do?', '나는 오늘 아침 일찍 학교에 갔어. 오늘 아침에 어디에 갔고, 무엇을 했어?', 'I went to school and sang songs.'),
    L('I went to school and had a busy day.', 'Where did you go today, and how was your day there?', '나는 학교에 가서 바쁜 하루를 보냈어. 오늘 어디에 갔고, 거기서 하루가 어땠어?', 'I went to school and studied math and art.')),

  T('been-06', 'been',
    L('I went to the mountain.', 'Where did you go with your family?', '나는 산에 갔어. 너는 가족과 어디에 갔어?', 'I went to the sea.'),
    L('We walked up a small mountain.', 'Where did you go with your family?', '우리는 작은 산을 걸어 올라갔어. 너는 가족과 어디에 갔어?', 'We went to a river.'),
    L('I went hiking with my dad on Saturday.', 'Where did you go, and was it hard?', '나는 토요일에 아빠와 등산을 갔어. 어디에 갔고, 힘들었어?', 'We went up a small mountain, and it was a little hard.'),
    L('We drove to the mountains for the weekend.', 'Where did you go, and what did you see there?', '우리는 주말에 차를 타고 산으로 갔어. 어디에 갔고, 거기서 무엇을 봤어?', 'We went to a quiet village and saw old houses.')),

  T('been-07', 'been',
    L('I saw big dinosaurs.', 'Where did you see them?', '나는 커다란 공룡을 봤어. 너는 어디에서 봤어?', 'I saw them at the museum.'),
    L('I went to the museum and saw dinosaurs.', 'Where did you go?', '나는 박물관에 가서 공룡을 봤어. 너는 어디에 갔어?', 'I went to the library.'),
    L('I visited a science museum with my class.', 'Where did you go, and what did you learn?', '나는 반 친구들과 과학관에 갔어. 어디에 갔고, 무엇을 배웠어?', 'I went to the library and borrowed a book.'),
    L('I went to a museum with an interesting exhibit.', 'Where did you go, and what did you find most interesting?', '나는 흥미로운 전시가 있는 박물관에 갔어. 어디에 갔고, 무엇이 가장 흥미로웠어?', 'I went to an art museum and liked the paintings.')),

  T('been-08', 'been',
    L('I went to a party.', 'Where did you go?', '나는 파티에 갔어. 너는 어디에 갔어?', 'I went to my friend\'s house.'),
    L('I went to my friend\'s birthday party.', 'Where did you go?', '나는 친구 생일 파티에 갔어. 너는 어디에 갔어?', 'I went to the pool.'),
    L('I went to my friend\'s house to play.', 'Where did you go, and what did you play?', '나는 친구 집에 놀러 갔어. 어디에 갔고, 무엇을 하고 놀았어?', 'I went to my friend\'s house and played with blocks.'),
    L('I went to a friend\'s birthday party in the evening.', 'Where did you go, and what was the best part?', '나는 저녁에 친구 생일 파티에 갔어. 어디에 갔고, 가장 좋았던 건 뭐였어?', 'I went to a party and liked the cake and games.')),

  T('been-09', 'been',
    L('I went swimming.', 'Where did you swim?', '나는 수영하러 갔어. 너는 어디에서 수영했어?', 'I swam in the pool.'),
    L('I went to the swimming pool.', 'Where did you go?', '나는 수영장에 갔어. 너는 어디에 갔어?', 'I went to the beach.'),
    L('I went swimming with my family on Sunday.', 'Where did you go, and did you have fun?', '나는 일요일에 가족과 수영하러 갔어. 어디에 갔고, 재미있었어?', 'I went to the pool and swam a lot.'),
    L('I started swimming lessons this month.', 'Where do you go for your lessons, and how is it?', '나는 이번 달에 수영을 배우기 시작했어. 수업은 어디에 가고, 어때?', 'I go to the pool near my house, and it is fun but tiring.')),

  /* ===================== 4. 기분 ===================== */
  T('feel-01', 'feel',
    L('I am happy.', 'How do you feel?', '나는 기뻐. 너는 기분이 어때?', 'I am happy too.'),
    L('I am happy because I saw my friend.', 'How do you feel today?', '나는 친구를 만나서 기뻐. 오늘 기분이 어때?', 'I feel happy and excited.'),
    L('I feel happy when I play with my friends.', 'How do you feel today, and why?', '나는 친구들과 놀 때 기뻐. 오늘 기분이 어때, 그리고 왜?', 'I feel happy because it is sunny.'),
    L('I felt great after a good sleep.', 'How do you feel today, and what made you feel that way?', '나는 푹 자고 나서 기분이 아주 좋았어. 오늘 기분이 어때, 그리고 왜 그런 기분이 들었어?', 'I feel calm and happy because I finished my homework.')),

  T('feel-02', 'feel',
    L('I am sad.', 'How do you feel?', '나는 슬퍼. 너는 기분이 어때?', 'I am sad too.'),
    L('I am sad because my toy broke.', 'How do you feel?', '나는 장난감이 망가져서 슬퍼. 너는 기분이 어때?', 'I feel a little sad.'),
    L('I felt sad when my friend went home.', 'How did you feel, and what did you do?', '나는 친구가 집에 갔을 때 슬펐어. 기분이 어땠고, 무엇을 했어?', 'I felt sad, so I hugged my mom.'),
    L('I was a bit sad yesterday because my plans changed.', 'How did you feel, and what helped you feel better?', '나는 어제 계획이 바뀌어서 조금 슬펐어. 기분이 어땠고, 무엇이 기분을 낫게 해 줬어?', 'I was sad, but talking to my mom helped me.')),

  T('feel-03', 'feel',
    L('I am angry.', 'How do you feel?', '나는 화가 나. 너는 기분이 어때?', 'I am angry too.'),
    L('I am angry because my brother took my toy.', 'How do you feel?', '나는 동생이 내 장난감을 가져가서 화가 나. 너는 기분이 어때?', 'I feel angry.'),
    L('I felt angry when I lost the game.', 'How did you feel, and what did you do?', '나는 게임에서 졌을 때 화가 났어. 기분이 어땠고, 무엇을 했어?', 'I felt angry, so I took a deep breath.'),
    L('Sometimes I get angry over small things.', 'What makes you angry, and how do you calm down?', '나는 가끔 작은 일에도 화가 나. 무엇이 너를 화나게 하고, 어떻게 마음을 가라앉혀?', 'I get angry when I am tired, so I rest for a while.')),

  T('feel-04', 'feel',
    L('I am sleepy.', 'How do you feel?', '나는 졸려. 너는 기분이 어때?', 'I am tired.'),
    L('I am tired after playing outside.', 'How do you feel now?', '나는 밖에서 놀고 나서 피곤해. 지금 기분이 어때?', 'I feel sleepy.'),
    L('I feel tired after a long day at school.', 'How do you feel now, and what do you want to do?', '나는 학교에서 긴 하루를 보내고 피곤해. 지금 기분이 어때, 그리고 무엇을 하고 싶어?', 'I feel tired, so I want to rest.'),
    L('I stayed up late, so I am tired today.', 'How do you feel, and what will you do tonight?', '나는 늦게까지 안 자서 오늘 피곤해. 기분이 어때, 그리고 오늘 밤에 무엇을 할 거야?', 'I feel sleepy, so I will go to bed early.')),

  T('feel-05', 'feel',
    L('I am scared.', 'How do you feel?', '나는 무서워. 너는 기분이 어때?', 'I am scared too.'),
    L('I am scared of the dark.', 'How do you feel at night?', '나는 어두운 게 무서워. 밤에 기분이 어때?', 'I feel a little scared.'),
    L('I felt scared during the storm last night.', 'How did you feel, and who was with you?', '나는 어젯밤 폭풍이 칠 때 무서웠어. 기분이 어땠고, 누가 함께 있었어?', 'I felt scared, but my dad stayed with me.'),
    L('I was nervous before my first swimming class.', 'How did you feel, and what helped you?', '나는 첫 수영 수업 전에 긴장됐어. 기분이 어땠고, 무엇이 도움이 됐어?', 'I was scared, but my teacher was kind.')),

  T('feel-06', 'feel',
    L('I am excited.', 'How do you feel?', '나는 신나. 너는 기분이 어때?', 'I am excited too.'),
    L('I am excited about my birthday.', 'How do you feel?', '나는 내 생일이 신나. 너는 기분이 어때?', 'I feel very excited.'),
    L('I feel excited before a trip.', 'How do you feel about your trip?', '나는 여행 전에 신나. 네 여행은 기분이 어때?', 'I feel excited and happy.'),
    L('I am excited about the weekend plans.', 'How do you feel about it, and what are you looking forward to?', '나는 주말 계획이 신나. 기분이 어때, 그리고 무엇이 기대돼?', 'I am excited to see my cousins.')),

  T('feel-07', 'feel',
    L('I miss my dad.', 'How do you feel?', '나는 아빠가 보고 싶어. 너는 기분이 어때?', 'I miss my mom.'),
    L('I miss my grandma.', 'How do you feel?', '나는 할머니가 보고 싶어. 너는 기분이 어때?', 'I feel a little lonely.'),
    L('I felt lonely when my friend moved away.', 'How did you feel, and what did you do?', '나는 친구가 이사 갔을 때 외로웠어. 기분이 어땠고, 무엇을 했어?', 'I felt lonely, so I called my friend.'),
    L('I missed my friends during the holiday.', 'How did you feel, and how did you stay in touch?', '나는 방학 동안 친구들이 보고 싶었어. 기분이 어땠고, 어떻게 연락했어?', 'I missed them, so we called and talked.')),

  T('feel-08', 'feel',
    L('I did it!', 'How do you feel?', '나는 해냈어! 너는 기분이 어때?', 'I am proud.'),
    L('I rode my bike alone.', 'How do you feel?', '나는 혼자 자전거를 탔어. 너는 기분이 어때?', 'I feel proud.'),
    L('I finished my drawing by myself.', 'How do you feel about it?', '나는 내 그림을 혼자 다 그렸어. 그 일에 대해 기분이 어때?', 'I feel proud of my work.'),
    L('I spoke in front of the class today.', 'How did you feel, and what did you learn?', '나는 오늘 반 친구들 앞에서 발표했어. 기분이 어땠고, 무엇을 배웠어?', 'I felt nervous at first, but now I feel proud.')),

  T('feel-09', 'feel',
    L('I am fine.', 'How are you today?', '나는 괜찮아. 오늘 기분이 어때?', 'I am happy.'),
    L('Today was a good day.', 'How was your day?', '오늘은 좋은 날이었어. 오늘 하루 어땠어?', 'Today was fun.'),
    L('Today was busy but good.', 'How was your day today?', '오늘은 바빴지만 좋았어. 오늘 하루 어땠어?', 'It was fun because I played outside.'),
    L('My day had good parts and hard parts.', 'How was your day today, and what was the best part?', '내 하루에는 좋은 일도 있고 힘든 일도 있었어. 오늘 하루 어땠고, 가장 좋았던 건 뭐였어?', 'It was busy, but the best part was dinner with my family.')),

  /* ===================== 5. Have ===================== */
  T('have-01', 'have',
    L('I have a cat.', 'Do you have a pet?', '나는 고양이가 있어. 너는 반려동물이 있어?', 'I have a dog.'),
    L('I have a small cat at home.', 'Do you have a pet?', '나는 집에 작은 고양이가 있어. 너는 반려동물이 있어?', 'I have a fish.'),
    L('I have a cat, and she sleeps on my bed.', 'Do you have a pet, and what is it like?', '나는 고양이가 있는데, 내 침대에서 자. 너는 반려동물이 있어? 어떤 아이야?', 'I have a dog, and he is very playful.'),
    L('I have a pet that follows me everywhere.', 'Do you have a pet, and what do you do together?', '나는 어디든 따라오는 반려동물이 있어. 너는 반려동물이 있어? 함께 무엇을 해?', 'I have a puppy, and we walk in the park every day.')),

  T('have-02', 'have',
    L('I have a ball.', 'What do you have?', '나는 공이 있어. 너는 무엇이 있어?', 'I have a doll.'),
    L('I have a red ball and a teddy bear.', 'What do you have?', '나는 빨간 공과 곰인형이 있어. 너는 무엇이 있어?', 'I have many books.'),
    L('I have a box full of blocks.', 'What do you have in your room?', '나는 블록이 가득한 상자가 있어. 네 방에는 무엇이 있어?', 'I have a lot of toys and books.'),
    L('I have a collection of small cars.', 'What do you have in your room that you really like?', '나는 작은 자동차를 모으고 있어. 네 방에서 정말 좋아하는 물건은 뭐야?', 'I have a shelf full of books and a robot.')),

  T('have-03', 'have',
    L('I have a sister.', 'Do you have a sister?', '나는 언니가 있어. 너는 언니나 누나가 있어?', 'I have a brother.'),
    L('I have one sister and one brother.', 'Do you have any brothers or sisters?', '나는 언니 하나와 남동생 하나가 있어. 너는 형제자매가 있어?', 'I have two sisters.'),
    L('I have an older sister who helps me.', 'Do you have any brothers or sisters, and what do you play together?', '나는 나를 도와주는 언니가 있어. 형제자매가 있어? 함께 무엇을 하고 놀아?', 'I have a younger brother, and we play cars.'),
    L('I have a brother who is two years younger than me.', 'Do you have any brothers or sisters, and how do you get along?', '나는 나보다 두 살 어린 남동생이 있어. 형제자매가 있어? 사이가 어때?', 'I have a sister, and we share a room.')),

  T('have-04', 'have',
    L('I have time to play.', 'Do you have time to play?', '나는 놀 시간이 있어. 너는 놀 시간이 있어?', 'I have time.'),
    L('I have free time after school.', 'Do you have time to play now?', '나는 방과 후에 자유 시간이 있어. 지금 놀 시간이 있어?', 'I have time after homework.'),
    L('I have a little free time before dinner.', 'How much free time do you have today?', '나는 저녁 식사 전에 조금 자유 시간이 있어. 오늘 자유 시간이 얼마나 있어?', 'I have one hour after homework.'),
    L('I have a busy week, but I have some free time on Sunday.', 'How much free time do you have this week, and what will you do?', '이번 주는 바쁘지만 일요일에는 조금 시간이 있어. 이번 주에 자유 시간이 얼마나 있고, 무엇을 할 거야?', 'I have free time on Saturday, so I will go to the park.')),

  T('have-05', 'have',
    L('I have an apple.', 'What do you have?', '나는 사과가 있어. 너는 무엇이 있어?', 'I have bread.'),
    L('I have apples and milk at home.', 'What do you have at home?', '나는 집에 사과와 우유가 있어. 너는 집에 무엇이 있어?', 'I have cookies and juice.'),
    L('I have some fruit in the fridge.', 'What food do you have at home?', '나는 냉장고에 과일이 조금 있어. 집에 무슨 음식이 있어?', 'We have rice, eggs, and milk.'),
    L('We have lots of snacks in the kitchen.', 'What do you have in your kitchen for snacks?', '우리는 부엌에 간식이 많이 있어. 너희 집 부엌에는 무슨 간식이 있어?', 'We have nuts and fruit, and sometimes chips.')),

  T('have-06', 'have',
    L('I have a hat.', 'Do you have a hat?', '나는 모자가 있어. 너는 모자가 있어?', 'I have a cap.'),
    L('I have a blue hat and a scarf.', 'Do you have a hat?', '나는 파란 모자와 목도리가 있어. 너는 모자가 있어?', 'I have a red hat.'),
    L('I have a warm coat for winter.', 'Do you have something warm for winter?', '나는 겨울에 입을 따뜻한 외투가 있어. 너는 겨울에 따뜻하게 입을 게 있어?', 'I have a thick coat and gloves.'),
    L('I have a bag that I take everywhere.', 'Do you have a bag you always carry, and what is inside?', '나는 어디든 들고 다니는 가방이 있어. 항상 들고 다니는 가방이 있어? 안에 뭐가 들어 있어?', 'I have a small backpack with my notebook and bottle.')),

  T('have-07', 'have',
    L('I have a coin.', 'Do you have a coin?', '나는 동전이 하나 있어. 너는 동전이 있어?', 'Yes, I have a coin.'),
    L('I have money in my piggy bank.', 'Do you have a piggy bank?', '나는 저금통에 돈이 있어. 너는 저금통이 있어?', 'I have a little money.'),
    L('I have some money that I saved.', 'Do you save money, and what do you want to buy?', '나는 모아 둔 돈이 조금 있어. 너는 돈을 모아? 무엇을 사고 싶어?', 'I save money to buy a toy.'),
    L('I have been saving money for a month.', 'Do you save money, and what are you saving for?', '나는 한 달 동안 돈을 모으고 있어. 너는 돈을 모아? 무엇을 위해 모아?', 'I am saving for a book I want.')),

  T('have-08', 'have',
    L('I have a friend.', 'Do you have a friend?', '나는 친구가 있어. 너는 친구가 있어?', 'I have a friend too.'),
    L('I have a best friend at school.', 'Do you have a best friend?', '나는 학교에 가장 친한 친구가 있어. 너는 가장 친한 친구가 있어?', 'I have a friend named Mina.'),
    L('I have a friend who lives next door.', 'Do you have a friend nearby, and what do you do together?', '나는 옆집에 사는 친구가 있어. 가까이 사는 친구가 있어? 함께 무엇을 해?', 'I have a friend next door, and we ride bikes.'),
    L('I have a few close friends from school.', 'Do you have close friends, and how did you meet?', '나는 학교에서 친한 친구가 몇 명 있어. 친한 친구가 있어? 어떻게 만났어?', 'I have two close friends, and we met in class.')),

  T('have-09', 'have',
    L('I have a bike.', 'Do you have a bike?', '나는 자전거가 있어. 너는 자전거가 있어?', 'I have a scooter.'),
    L('I have a new bike.', 'Do you have a bike?', '나는 새 자전거가 있어. 너는 자전거가 있어?', 'I have a small bike.'),
    L('I have a bike, but I am still learning.', 'Do you have a bike, and can you ride it?', '나는 자전거가 있는데 아직 배우는 중이야. 너는 자전거가 있어? 탈 수 있어?', 'I have a bike, and I can ride it well.'),
    L('I have a bike that I ride on weekends.', 'Do you have a bike, and where do you ride it?', '나는 주말에 타는 자전거가 있어. 너는 자전거가 있어? 어디에서 타?', 'I have a bike, and I ride it along the river.')),

  /* ===================== 6. How many ===================== */
  T('many-01', 'many',
    L('I have four people in my family.', 'How many people are in your family?', '우리 가족은 네 명이야. 너희 가족은 몇 명이야?', 'Four.'),
    L('There are four people in my family.', 'How many people are in your family?', '우리 가족은 네 명이야. 너희 가족은 몇 명이야?', 'There are three people.'),
    L('My family has four people: my mom, dad, sister, and me.', 'How many people are in your family, and who are they?', '우리 가족은 엄마, 아빠, 언니, 나 이렇게 네 명이야. 너희 가족은 몇 명이고, 누구누구야?', 'There are three people: my mom, dad, and me.'),
    L('I come from a family of four.', 'How many people are in your family, and who do you spend the most time with?', '우리 가족은 네 명이야. 너희 가족은 몇 명이고, 누구와 가장 많은 시간을 보내?', 'There are four of us, and I spend the most time with my mom.')),

  T('many-02', 'many',
    L('I have two dolls.', 'How many dolls do you have?', '나는 인형이 두 개 있어. 너는 인형이 몇 개 있어?', 'Three.'),
    L('I have three dolls and one bear.', 'How many dolls do you have?', '나는 인형 세 개와 곰인형 하나가 있어. 너는 인형이 몇 개 있어?', 'I have two dolls.'),
    L('I have five small dolls on my shelf.', 'How many dolls do you have, and which is your favorite?', '나는 선반에 작은 인형이 다섯 개 있어. 인형이 몇 개 있고, 어떤 게 가장 좋아?', 'I have four dolls, and the pink one is my favorite.'),
    L('I have a shelf with a few toys.', 'How many toys do you have, and do you still play with all of them?', '나는 선반에 장난감이 조금 있어. 장난감이 몇 개 있고, 아직 다 가지고 놀아?', 'I have about ten toys, but I play with three.')),

  T('many-03', 'many',
    L('I have one brother.', 'How many brothers do you have?', '나는 남동생이 한 명 있어. 너는 남자 형제가 몇 명이야?', 'One.'),
    L('I have one brother and one sister.', 'How many brothers and sisters do you have?', '나는 남동생 하나와 여동생 하나가 있어. 너는 형제자매가 몇 명이야?', 'I have one sister.'),
    L('I have two brothers, and they are older.', 'How many brothers and sisters do you have, and are they older or younger?', '나는 형이 두 명 있어. 형제자매가 몇 명이고, 나보다 많아 아니면 어려?', 'I have one brother, and he is younger.'),
    L('I have one older sister and one younger brother.', 'How many brothers and sisters do you have, and how old are they?', '나는 언니 하나와 남동생 하나가 있어. 형제자매가 몇 명이고, 몇 살이야?', 'I have two sisters, and they are older than me.')),

  T('many-04', 'many',
    L('I have three books.', 'How many books do you have?', '나는 책이 세 권 있어. 너는 책이 몇 권 있어?', 'Two.'),
    L('I have many books on my desk.', 'How many books do you have?', '나는 책상 위에 책이 많아. 너는 책이 몇 권 있어?', 'I have five books.'),
    L('I have a lot of picture books at home.', 'How many books do you have, and which one do you like?', '나는 집에 그림책이 아주 많아. 책이 몇 권 있고, 어떤 책을 좋아해?', 'I have about twenty books, and I like the animal book.'),
    L('I keep a stack of books next to my bed.', 'How many books do you have, and how often do you read them?', '나는 침대 옆에 책을 쌓아 둬. 책이 몇 권 있고, 얼마나 자주 읽어?', 'I have around thirty books, and I read one every night.')),

  T('many-05', 'many',
    L('I want two apples.', 'How many apples do you want?', '나는 사과 두 개를 원해. 너는 사과 몇 개를 원해?', 'One.'),
    L('I want three apples for my bag.', 'How many apples do you want?', '나는 가방에 넣을 사과 세 개를 원해. 너는 사과 몇 개를 원해?', 'I want two apples.'),
    L('I want to share four apples with my friends.', 'How many apples do you need to share?', '나는 친구들과 사과 네 개를 나눠 먹고 싶어. 나눠 먹으려면 사과가 몇 개 필요해?', 'I need five apples.'),
    L('We need enough apples for everyone.', 'How many apples do you need for your family, and why?', '우리는 모두 먹을 사과가 필요해. 가족을 위해 사과가 몇 개 필요하고, 왜?', 'I need four apples, one for each person.')),

  T('many-06', 'many',
    L('I have two crayons.', 'How many crayons do you have?', '나는 크레용이 두 개 있어. 너는 크레용이 몇 개 있어?', 'Three.'),
    L('I have eight crayons in my box.', 'How many crayons do you have?', '나는 상자에 크레용이 여덟 개 있어. 너는 크레용이 몇 개 있어?', 'I have ten crayons.'),
    L('I have a box of twelve crayons.', 'How many crayons do you have, and what colors do you like?', '나는 크레용 열두 개가 든 상자가 있어. 크레용이 몇 개 있고, 무슨 색을 좋아해?', 'I have twelve crayons, and I like the blue one.'),
    L('I use a set of colored pencils when I draw.', 'How many colored pencils do you have, and which color do you use most?', '나는 그림을 그릴 때 색연필 세트를 써. 색연필이 몇 개 있고, 무슨 색을 가장 많이 써?', 'I have twenty-four, and I use blue the most.')),

  T('many-07', 'many',
    L('There are seven days in a week.', 'How many days are in a week?', '한 주에는 칠 일이 있어. 한 주는 며칠이야?', 'Seven.'),
    L('I go to school five days a week.', 'How many days do you go to school?', '나는 일주일에 닷새 학교에 가. 너는 일주일에 며칠 학교에 가?', 'Five days.'),
    L('I have school from Monday to Friday.', 'How many days a week do you go to school, and which day do you like best?', '나는 월요일부터 금요일까지 학교에 가. 일주일에 며칠 학교에 가고, 무슨 요일이 가장 좋아?', 'Five days, and I like Friday best.'),
    L('My week is busy from Monday to Friday.', 'How many busy days do you have this week, and what do you do on the weekend?', '내 한 주는 월요일부터 금요일까지 바빠. 이번 주에 바쁜 날이 며칠이고, 주말에는 무엇을 해?', 'I have five busy days, and I rest on the weekend.')),

  T('many-08', 'many',
    L('A dog has four legs.', 'How many legs does a dog have?', '강아지는 다리가 네 개야. 강아지 다리는 몇 개야?', 'Four.'),
    L('A cat has four legs and a long tail.', 'How many legs does a cat have?', '고양이는 다리가 네 개이고 꼬리가 길어. 고양이 다리는 몇 개야?', 'Four legs.'),
    L('Birds have two legs and two wings.', 'How many legs does a bird have, and how many wings?', '새는 다리가 두 개이고 날개가 두 개야. 새는 다리가 몇 개이고 날개는 몇 개야?', 'Two legs and two wings.'),
    L('Spiders are different from insects.', 'How many legs does a spider have, and how is that different from an insect?', '거미는 곤충과 달라. 거미는 다리가 몇 개이고, 곤충과 어떻게 달라?', 'A spider has eight legs, and an insect has six.')),

  T('many-09', 'many',
    L('I brush my teeth two times a day.', 'How many times do you brush your teeth?', '나는 하루에 두 번 이를 닦아. 너는 하루에 몇 번 이를 닦아?', 'Two times.'),
    L('I wash my hands before eating.', 'How many times a day do you wash your hands?', '나는 먹기 전에 손을 씻어. 너는 하루에 몇 번 손을 씻어?', 'Three times.'),
    L('I brush my teeth in the morning and at night.', 'How many times a day do you brush your teeth, and when?', '나는 아침과 저녁에 이를 닦아. 하루에 몇 번, 언제 이를 닦아?', 'Two times, morning and night.'),
    L('I try to drink water often during the day.', 'How many glasses of water do you drink a day, and why?', '나는 낮에 물을 자주 마시려고 해. 하루에 물을 몇 잔 마시고, 왜?', 'I drink about six glasses because water is good for me.')),

  /* ===================== 7. Where ===================== */
  T('where-01', 'where',
    L('I live in a house.', 'Where do you live?', '나는 집에 살아. 너는 어디에 살아?', 'I live in Jeju.'),
    L('I live in an apartment.', 'Where do you live?', '나는 아파트에 살아. 너는 어디에 살아?', 'I live in a house near the park.'),
    L('I live in a small apartment near the sea.', 'Where do you live, and what is near your home?', '나는 바다 가까운 작은 아파트에 살아. 너는 어디에 살고, 집 근처에 무엇이 있어?', 'I live in Jeju, and there is a park near my home.'),
    L('I live in a quiet neighborhood with my family.', 'Where do you live, and what do you like about your neighborhood?', '나는 가족과 조용한 동네에 살아. 너는 어디에 살고, 동네에서 무엇이 좋아?', 'I live near the beach, and I like walking there.')),

  T('where-02', 'where',
    L('My mom is in the kitchen.', 'Where is your mom?', '우리 엄마는 부엌에 계셔. 너희 엄마는 어디에 계셔?', 'She is in the living room.'),
    L('My dad is at work.', 'Where is your dad?', '우리 아빠는 회사에 계셔. 너희 아빠는 어디에 계셔?', 'He is at home.'),
    L('My mom is at the market right now.', 'Where is your mom, and what is she doing?', '우리 엄마는 지금 시장에 계셔. 너희 엄마는 어디에 계시고, 무엇을 하세요?', 'She is in the kitchen, cooking dinner.'),
    L('My parents are both busy today.', 'Where are your parents today, and what are they doing?', '우리 부모님은 오늘 둘 다 바쁘셔. 오늘 부모님은 어디에 계시고, 무엇을 하세요?', 'My dad is at work, and my mom is at home.')),

  T('where-03', 'where',
    L('The cat is under the table.', 'Where is the cat?', '고양이는 탁자 아래에 있어. 고양이는 어디에 있어?', 'It is on the bed.'),
    L('My teddy bear is on my bed.', 'Where is your teddy bear?', '내 곰인형은 침대 위에 있어. 네 곰인형은 어디에 있어?', 'It is under the blanket.'),
    L('I put my shoes next to the door.', 'Where do you put your shoes, and why?', '나는 신발을 문 옆에 둬. 너는 신발을 어디에 두고, 왜?', 'I put them by the door so I can find them.'),
    L('I always lose my keys.', 'Where do you keep your things so you do not lose them?', '나는 항상 열쇠를 잃어버려. 잃어버리지 않으려고 물건을 어디에 두어?', 'I keep my keys in my bag.')),

  T('where-04', 'where',
    L('I play in the living room.', 'Where do you play?', '나는 거실에서 놀아. 너는 어디에서 놀아?', 'I play outside.'),
    L('I play in the playground near my house.', 'Where do you play?', '나는 집 근처 놀이터에서 놀아. 너는 어디에서 놀아?', 'I play in my room.'),
    L('I usually play outside after school.', 'Where do you play, and who do you play with?', '나는 보통 방과 후에 밖에서 놀아. 어디에서 놀고, 누구랑 놀아?', 'I play in the park with my friends.'),
    L('I like playing where there is space to run.', 'Where do you usually play, and why do you like that place?', '나는 뛸 공간이 있는 곳에서 노는 게 좋아. 보통 어디에서 놀고, 왜 그곳이 좋아?', 'I play at the school field because there is a lot of space.')),

  T('where-05', 'where',
    L('The bathroom is over there.', 'Where is the bathroom?', '화장실은 저쪽에 있어. 화장실은 어디에 있어?', 'It is next to the kitchen.'),
    L('The bathroom is next to my room.', 'Where is the bathroom in your home?', '화장실은 내 방 옆에 있어. 너희 집 화장실은 어디에 있어?', 'It is near the kitchen.'),
    L('My school is close to my house.', 'Where is your school, and how do you get there?', '우리 학교는 집에서 가까워. 네 학교는 어디에 있고, 어떻게 가?', 'It is near my house, so I walk.'),
    L('My school is about ten minutes away.', 'Where is your school, and how long does it take to get there?', '우리 학교는 십 분쯤 걸려. 네 학교는 어디에 있고, 가는 데 얼마나 걸려?', 'It is close, and it takes ten minutes by bus.')),

  T('where-06', 'where',
    L('My grandma lives far away.', 'Where does your grandma live?', '우리 할머니는 멀리 사셔. 너희 할머니는 어디에 사셔?', 'She lives near me.'),
    L('My grandma lives in the countryside.', 'Where does your grandma live?', '우리 할머니는 시골에 사셔. 너희 할머니는 어디에 사셔?', 'She lives in the city.'),
    L('My grandma lives in a small town.', 'Where does your grandma live, and how often do you visit?', '우리 할머니는 작은 마을에 사셔. 할머니는 어디에 사시고, 얼마나 자주 가?', 'She lives in the countryside, and we visit in summer.'),
    L('My grandparents live a few hours away.', 'Where do your grandparents live, and when do you see them?', '우리 조부모님은 차로 몇 시간 걸리는 곳에 사셔. 조부모님은 어디에 사시고, 언제 만나?', 'They live in the countryside, and we visit on holidays.')),

  T('where-07', 'where',
    L('The milk is in the fridge.', 'Where is the milk?', '우유는 냉장고에 있어. 우유는 어디에 있어?', 'It is on the table.'),
    L('The apples are in the kitchen.', 'Where are the apples?', '사과는 부엌에 있어. 사과는 어디에 있어?', 'They are in the fridge.'),
    L('We keep the snacks in the kitchen cupboard.', 'Where do you keep the snacks at home?', '우리는 간식을 부엌 찬장에 둬. 너희 집에서는 간식을 어디에 둬?', 'We keep them in the kitchen.'),
    L('I help put the groceries away.', 'Where do you put the food when you bring it home, and who helps?', '나는 장 본 것을 정리하는 걸 도와. 집에 음식을 가져오면 어디에 두고, 누가 도와?', 'We put it in the fridge and the cupboard, and I help my mom.')),

  T('where-08', 'where',
    L('I am at home.', 'Where are you now?', '나는 집에 있어. 너는 지금 어디에 있어?', 'I am at school.'),
    L('I am at home with my family.', 'Where are you now?', '나는 가족과 집에 있어. 너는 지금 어디에 있어?', 'I am at school.'),
    L('I am in my room, drawing a picture.', 'Where are you now, and what are you doing?', '나는 내 방에서 그림을 그리고 있어. 지금 어디에 있고, 무엇을 해?', 'I am in the living room, watching TV.'),
    L('I am at home after a long day.', 'Where are you now, and what are you doing?', '나는 긴 하루를 보내고 집에 있어. 지금 어디에 있고, 무엇을 해?', 'I am at home, resting and reading.')),

  T('where-09', 'where',
    L('I go to the park tomorrow.', 'Where do you go tomorrow?', '나는 내일 공원에 가. 너는 내일 어디에 가?', 'I go to school.'),
    L('I will go to the zoo on Saturday.', 'Where will you go on Saturday?', '나는 토요일에 동물원에 갈 거야. 너는 토요일에 어디에 갈 거야?', 'I will go to the park.'),
    L('We are going to visit my aunt this weekend.', 'Where will you go this weekend, and who will you go with?', '우리는 이번 주말에 이모 댁에 갈 거야. 주말에 어디에 갈 거고, 누구와 갈 거야?', 'I will go to the beach with my family.'),
    L('I have plans for the weekend.', 'Where are you going this weekend, and what will you do there?', '나는 주말 계획이 있어. 이번 주말에 어디에 가고, 거기서 무엇을 할 거야?', 'I am going to a friend\'s house, and we will bake cookies.'))
];
