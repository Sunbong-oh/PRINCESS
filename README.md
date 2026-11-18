# 👑 Princess Talk

공주 그림을 보며 영어로 말해보는 어린이 말하기 놀이 웹게임.
**4살 · 6살 · 8살** 난이도를 골라, 그림 속 장면에 대해 영어로 대답해요.

## 바로 열기

- 배포 주소: **https://sunbong-oh.github.io/princess-talk/**
- 빌드 과정이 없습니다. `index.html`을 브라우저로 열어도 동작합니다.
  (마이크 인식은 `https://` 또는 `localhost`에서만 허용됩니다.)

## 무엇을 하나요

| 난이도 | 기대하는 대답 | 보기 카드 |
|---|---|---|
| 🐣 4살 | 한 단어 — `Five`, `Blue`, `A shell` | 큰 단어 카드 3장 터치 |
| 🌸 6살 | 짧은 표현 — `Five cups`, `A glass slipper` | 구 카드 3장 터치 |
| 👑 8살 | 짧은 문장 — `There are five cups on the table.` | 문장 카드 3장 터치 |

- **매일 바뀌는 이야기**: 오늘 날짜로 공주와 장면 순서가 정해집니다(`오늘의 이야기`).
- **다른 공주 이야기**: 🎲 버튼으로 무작위 공주·무작위 장면 순서.
- **음성 질문**: `speechSynthesis`로 영어 질문을 읽어주고 `🔊 다시 듣기` 제공.
- **말하기**: `SpeechRecognition`으로 아이의 영어 발음을 인식 (핵심 단어 조합 + 유사 발음 허용).
- **터치 보조**: 마이크가 없거나 부끄러울 때는 보기 카드를 눌러 진행.
- 정답마다 폭죽 애니메이션 + 별·왕관 스티커를 모아요(localStorage 저장).

## 구성

```
index.html
manifest.json
assets/css/style.css
assets/js/data.js     ← 공주 6명 × 장면 4개(주인공 포함) × 난이도 3단계 퀴즈 데이터
assets/js/app.js      ← 화면 전환, 음성, 채점, 스티커, 폭죽
assets/img/*.webp     ← 주인공 6장 + 장면 18장 (총 24장, 약 4.3MB)
```

## 퀴즈 데이터 고치기

`assets/js/data.js`의 각 문항은 아래 모양입니다.

```js
{
  img: 'assets/img/sw-2-mugs.webp',
  scene: '난쟁이 친구들',
  q: {
    4: { text: 'How many cups are on the table?', answer: 'Five',
         opts: ['Three', 'Five', 'Seven'],
         keys: [['five', '5']],          // 이 단어들 중 하나가 들리면 정답
         ko: '탁자 위에 컵이 몇 개 있나요?' },
    // 6, 8 도 같은 구조
  }
}
```

`keys`는 "그룹의 배열"입니다. 그룹마다 하나 이상 일치해야 정답으로 인정되므로,
`[['five','5'], ['cup','mug']]`는 "five/five 중 하나" + "cup/mug 중 하나"가 모두 들려야 통과입니다.

## 배포

- **GitHub Pages**: `main` 브랜치 루트를 그대로 올리면 끝.
- **Vercel**: 저장소를 Import 하고 Framework Preset을 `Other`, Output을 `.` 로 두면 됩니다.
- 이미지는 WebP(약 150~250KB/장)로 최적화되어 있습니다.

## 참고

- 삽화는 모두 AI 생성 이미지이며, 각 장면은 주인공 일러스트를 기준으로 편집해 화풍과 인물을 통일했습니다.
- 문제와 정답은 **실제 그림에 보이는 내용**을 눈으로 확인해 맞춰 두었습니다.
  이미지를 교체하면 `data.js`의 정답도 함께 확인해 주세요.
