import type { SupportedLocale } from '@/i18n/messages';

export type RecommendedSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export interface RecommendedStop {
  time: string;
  name: string;
  note: string;
}

export interface RecommendedDay {
  title: string;
  summary: string;
  stops: RecommendedStop[];
}

export interface RecommendedJourneyLocale {
  seasonLabel: string;
  title: string;
  destination: string;
  duration: string;
  style: string;
  bestTime?: string;
  summary: string;
  days: RecommendedDay[];
}

export interface RecommendedJourney {
  slug: RecommendedSeason;
  accent: string;
  locales: Record<SupportedLocale, RecommendedJourneyLocale>;
}

export const recommendedJourneys: RecommendedJourney[] = [
  {
    slug: 'spring',
    accent: 'bg-morandi-rose/20 text-morandi-ink',
    locales: {
      en: {
        seasonLabel: 'Spring route',
        title: 'Tokyo cherry blossom',
        destination: 'Tokyo',
        duration: '7 days',
        style: 'Cherry blossom city stroll',
        bestTime: 'Late March to early April',
        summary: 'A gentle Tokyo route for cherry blossom season, moving through riverside parks, gardens, cafes, and easy shopping days.',
        days: [
          {
            title: 'Day 1-2 | Slow Tokyo city walk',
            summary: 'Begin with classic old-town atmosphere, riverside blossoms, city views, and one of Tokyo s liveliest parks.',
            stops: [
              { time: 'Day 1', name: 'Senso-ji Temple', note: 'Start in Asakusa with temple streets, lanterns, and small snack shops.' },
              { time: 'Day 1', name: 'Sumida Park cherry blossoms', note: 'Walk along the river where sakura frames the Tokyo Skytree skyline.' },
              { time: 'Day 1', name: 'Tokyo Skytree night view', note: 'End the day with a wide city view as Tokyo lights up.' },
              { time: 'Day 2', name: 'Ueno Park', note: 'Spend a slower morning under one of Tokyo s most famous blossom canopies.' }
            ]
          },
          {
            title: 'Day 3 | Gardens, shrine, and Omotesando',
            summary: 'Balance a spacious garden, a quiet shrine forest, and a polished shopping street.',
            stops: [
              { time: 'Morning', name: 'Shinjuku Gyoen', note: 'A spacious garden with many cherry varieties and room to linger.' },
              { time: 'Afternoon', name: 'Meiji Shrine', note: 'Walk through the forest approach for a calmer pause between city stops.' },
              { time: 'Evening', name: 'Omotesando walk', note: 'Browse cafes, architecture, and shops at an unhurried pace.' }
            ]
          },
          {
            title: 'Day 4 | Chidorigafuchi and Marunouchi',
            summary: 'A classic spring day around moat-side blossoms and the Imperial Palace area.',
            stops: [
              { time: 'Morning', name: 'Chidorigafuchi boat ride', note: 'See cherry blossoms from the water along one of Tokyo s iconic moats.' },
              { time: 'Afternoon', name: 'Imperial Palace Outer Garden', note: 'Keep the pace open with lawns, stone bridges, and seasonal views.' },
              { time: 'Evening', name: 'Tokyo Station Marunouchi', note: 'End with brick architecture, boutiques, and dinner near the station.' }
            ]
          },
          {
            title: 'Day 5 | Meguro River cafe day',
            summary: 'Leave room for riverside photos, coffee, and a softer neighborhood rhythm.',
            stops: [
              { time: 'Morning', name: 'Meguro River cherry blossom walk', note: 'Follow the blossom-lined canal through one of Tokyo s prettiest spring scenes.' },
              { time: 'Afternoon', name: 'Nakameguro cafe hopping', note: 'Stop at small cafes and shops between short riverside walks.' }
            ]
          },
          {
            title: 'Day 6 | Suburban cherry blossom option',
            summary: 'Choose a day trip depending on whether you want seaside temples or Mt. Fuji views.',
            stops: [
              { time: 'Option A', name: 'Kamakura', note: 'A relaxed coastal day with temples, old streets, and spring flowers.' },
              { time: 'Option B', name: 'Kawaguchiko', note: 'Go for Mt. Fuji views with cherry blossoms if the weather is clear.' }
            ]
          },
          {
            title: 'Day 7 | Free shopping day',
            summary: 'Keep the final day flexible for gifts, boutiques, and a last city walk.',
            stops: [
              { time: 'Option', name: 'Ginza', note: 'Good for department stores, polished streets, and classic Tokyo shopping.' },
              { time: 'Option', name: 'Nihonbashi', note: 'A quieter choice for long-standing shops and refined souvenirs.' },
              { time: 'Option', name: 'Kichijoji', note: 'A relaxed neighborhood for cafes, small shops, and Inokashira Park nearby.' }
            ]
          }
        ]
      },
      'zh-TW': {
        seasonLabel: '春季推薦',
        title: '東京賞櫻散策',
        destination: '東京',
        duration: '7 天',
        style: '賞櫻城市慢遊',
        bestTime: '3 月下旬～4 月上旬',
        summary: '以東京市區賞櫻為主軸，串起河岸、公園、庭園、咖啡廳與最後一天的自由購物。',
        days: [
          {
            title: 'Day 1－2｜東京市區慢遊',
            summary: '從下町寺院、河岸櫻花、夜景到上野公園，慢慢進入東京春天。',
            stops: [
              { time: 'Day 1', name: '淺草寺', note: '從雷門、仲見世通到寺院本堂，感受東京下町的熱鬧開場。' },
              { time: 'Day 1', name: '隅田公園賞櫻', note: '沿著隅田川散步，櫻花與晴空塔會一起進入視線。' },
              { time: 'Day 1', name: '晴空塔夜景', note: '傍晚上塔看東京點燈，替第一天留下城市夜景記憶。' },
              { time: 'Day 2', name: '上野公園', note: '東京經典賞櫻名所，適合安排半天慢慢走、拍照與野餐。' }
            ]
          },
          {
            title: 'Day 3｜庭園、神社與表參道',
            summary: '把庭園綠意、神宮森林與表參道街景排在同一天，節奏舒服不趕。',
            stops: [
              { time: '上午', name: '新宿御苑', note: '園區寬敞、櫻花種類多，很適合慢慢散步和休息。' },
              { time: '下午', name: '明治神宮', note: '穿過高樹參道，在市中心留一段安靜的森林時間。' },
              { time: '傍晚', name: '表參道散步', note: '用咖啡廳、建築與選物店收尾，保留輕鬆逛街感。' }
            ]
          },
          {
            title: 'Day 4｜千鳥之淵與丸之內',
            summary: '把護城河櫻花、皇居周邊與東京車站的經典街景串起來。',
            stops: [
              { time: '上午', name: '千鳥之淵划船賞櫻', note: '從水面看滿開櫻花，是東京春天很有代表性的畫面。' },
              { time: '下午', name: '皇居外苑', note: '在草地、石橋與寬闊步道之間散步，調整一天節奏。' },
              { time: '傍晚', name: '東京車站丸之內', note: '欣賞紅磚車站與丸之內街景，也方便安排晚餐。' }
            ]
          },
          {
            title: 'Day 5｜目黑川與中目黑',
            summary: '留給櫻花步道、河岸照片與咖啡廳巡禮的一天。',
            stops: [
              { time: '上午', name: '目黑川櫻花步道', note: '沿著河道慢慢走，兩側櫻花形成很適合拍照的春日街景。' },
              { time: '下午', name: '中目黑咖啡廳巡禮', note: '在咖啡廳、甜點店與小店之間停留，讓行程更有生活感。' }
            ]
          },
          {
            title: 'Day 6｜近郊賞櫻',
            summary: '依天氣與心情選一個近郊：想看海邊古都就去鎌倉，想看富士山就去河口湖。',
            stops: [
              { time: '選項 A', name: '鎌倉', note: '寺院、老街與海岸線都能一次走到，適合輕鬆近郊一日遊。' },
              { time: '選項 B', name: '河口湖', note: '天氣好時可看富士山與櫻花同框，是更有旅行感的選擇。' }
            ]
          },
          {
            title: 'Day 7｜自由購物',
            summary: '最後一天保留彈性，依想買的東西和想逛的氛圍選區域。',
            stops: [
              { time: '選項', name: '銀座', note: '百貨、精品與餐廳集中，適合正式購物與伴手禮。' },
              { time: '選項', name: '日本橋', note: '有老舖、質感選物與比較安靜的街區氣氛。' },
              { time: '選項', name: '吉祥寺', note: '咖啡廳、小店與井之頭公園都在附近，適合悠閒收尾。' }
            ]
          }
        ]
      },
      ja: {
        seasonLabel: '春のおすすめ',
        title: '東京 桜さんぽ',
        destination: '東京',
        duration: '7日間',
        style: '桜の街歩き',
        bestTime: '3月下旬〜4月上旬',
        summary: '東京の桜を中心に、川沿い、公園、庭園、カフェ、最終日の自由な買い物までゆっくり巡ります。',
        days: [
          {
            title: 'Day 1-2｜東京市内をゆっくり散策',
            summary: '下町の寺院、川沿いの桜、夜景、上野公園から東京の春を始めます。',
            stops: [
              { time: 'Day 1', name: '浅草寺', note: '雷門、仲見世通り、本堂を歩き、東京の下町らしい賑わいを楽しみます。' },
              { time: 'Day 1', name: '隅田公園の桜', note: '隅田川沿いを歩き、桜と東京スカイツリーを一緒に眺めます。' },
              { time: 'Day 1', name: '東京スカイツリー夜景', note: '夕方以降に上がり、東京の街の灯りを広く見渡します。' },
              { time: 'Day 2', name: '上野公園', note: '東京を代表する桜の名所で、散歩や写真、軽い休憩にぴったりです。' }
            ]
          },
          {
            title: 'Day 3｜庭園、神社、表参道',
            summary: '庭園の緑、神宮の森、表参道の街並みを無理なく組み合わせます。',
            stops: [
              { time: '午前', name: '新宿御苑', note: '広い園内に多くの桜があり、ゆっくり歩いて休憩できます。' },
              { time: '午後', name: '明治神宮', note: '高い木々の参道を抜けて、街の中で静かな時間を過ごします。' },
              { time: '夕方', name: '表参道散策', note: 'カフェ、建築、ショップを眺めながら軽やかに締めくくります。' }
            ]
          },
          {
            title: 'Day 4｜千鳥ヶ淵と丸の内',
            summary: 'お堀沿いの桜、皇居周辺、東京駅の街並みをつなぐ定番の春ルートです。',
            stops: [
              { time: '午前', name: '千鳥ヶ淵ボート花見', note: '水面から満開の桜を眺められる、東京らしい春の景色です。' },
              { time: '午後', name: '皇居外苑', note: '芝生、石橋、広い道を歩きながら一日のペースを整えます。' },
              { time: '夕方', name: '東京駅丸の内', note: '赤レンガ駅舎と丸の内の街並みを見て、夕食にもつなげやすい場所です。' }
            ]
          },
          {
            title: 'Day 5｜目黒川と中目黒',
            summary: '桜並木、川沿いの写真、カフェ巡りのために余白を残す一日です。',
            stops: [
              { time: '午前', name: '目黒川桜並木', note: '川沿いに続く桜をゆっくり歩き、春らしい街の景色を楽しみます。' },
              { time: '午後', name: '中目黒カフェ巡り', note: 'カフェ、スイーツ、小さなお店に立ち寄りながら過ごします。' }
            ]
          },
          {
            title: 'Day 6｜近郊の桜',
            summary: '海辺の古都なら鐮倉、富士山の景色なら河口湖 を選びます。',
            stops: [
              { time: '選択肢 A', name: '鐮倉', note: '寺院、古い街並み、海岸を一日で楽しめる近郊ルートです。' },
              { time: '選択肢 B', name: '河口湖', note: '晴れた日には富士山と桜を一緒に見られる、旅らしい選択肢です。' }
            ]
          },
          {
            title: 'Day 7｜自由に買い物',
            summary: '最終日は欲しいものや歩きたい雰囲気に合わせてエリアを選びます。',
            stops: [
              { time: '選択肢', name: '銀座', note: '百貨店、ブランドショップ、レストランが集まり、買い物に便利です。' },
              { time: '選択肢', name: '日本橋', note: '老舗や上質なショップが多く、落ち着いた買い物に向いています。' },
              { time: '選択肢', name: '吉祥寺', note: 'カフェ、小さなお店、井の頭公園が近く、ゆったり締めくくれます。' }
            ]
          }
        ]
      }
    }
  },
  {
    slug: 'summer',
    accent: 'bg-morandi-blue/20 text-morandi-ink',
    locales: {
      en: {
        seasonLabel: 'Summer route',
        title: 'Paris city walk',
        destination: 'Paris',
        duration: '5-6 days',
        style: 'Museum, cafe, and city strolling',
        bestTime: 'Mid-June to early July; early September is also very comfortable',
        summary: 'A light Paris itinerary for summer, built around monuments, museums, neighborhoods, cafes, and one optional day trip to Versailles.',
        days: [
          {
            title: 'Day 1 | Eiffel Tower and the Seine',
            summary: 'Start with the city s classic silhouette, a picnic, and a night cruise.',
            stops: [
              { time: 'Morning', name: 'Eiffel Tower', note: 'Begin with Paris s most iconic landmark and leave time for photos nearby.' },
              { time: 'Afternoon', name: 'Champ de Mars picnic', note: 'Pick up bread, fruit, and cheese for a relaxed lawn picnic.' },
              { time: 'Night', name: 'Seine river cruise', note: 'See bridges and monuments from the water as the city lights turn on.' }
            ]
          },
          {
            title: 'Day 2 | Louvre and historic axis',
            summary: 'A museum morning followed by garden paths and grand squares.',
            stops: [
              { time: 'Morning', name: 'Louvre Museum', note: 'Focus on a few galleries so the visit stays enjoyable.' },
              { time: 'Afternoon', name: 'Tuileries Garden', note: 'Rest between fountains, chairs, and tree-lined paths.' },
              { time: 'Evening', name: 'Place de la Concorde', note: 'Continue the classic Paris axis toward golden-hour views.' }
            ]
          },
          {
            title: 'Day 3 | Montmartre',
            summary: 'Spend the day on hilltop streets, artists corners, and cafe breaks.',
            stops: [
              { time: 'Morning', name: 'Montmartre', note: 'Wander small lanes and stairways before the area gets too busy.' },
              { time: 'Afternoon', name: 'Sacré-Coeur', note: 'Climb toward the basilica for a wide view over Paris.' },
              { time: 'Break', name: 'Hilltop cafe', note: 'Choose a small cafe stop to slow down the neighborhood walk.' }
            ]
          },
          {
            title: 'Day 4 | Orsay and the Latin Quarter',
            summary: 'Pair impressionist art with bookshops and left-bank streets.',
            stops: [
              { time: 'Morning', name: 'Musée d Orsay', note: 'A beautiful station-turned-museum with impressionist highlights.' },
              { time: 'Afternoon', name: 'Latin Quarter', note: 'Walk through lively streets, old schools, and casual restaurants.' },
              { time: 'Late afternoon', name: 'Shakespeare and Company', note: 'Stop by the beloved English-language bookshop near the Seine.' }
            ]
          },
          {
            title: 'Day 5 | Marais and shopping',
            summary: 'Keep the final city day flexible with boutiques, opera-house grandeur, and department stores.',
            stops: [
              { time: 'Morning', name: 'Le Marais walk', note: 'Browse small shops, galleries, bakeries, and hidden courtyards.' },
              { time: 'Afternoon', name: 'Palais Garnier', note: 'See the opera house facade or visit the ornate interiors if time allows.' },
              { time: 'Evening', name: 'Galeries Lafayette', note: 'End with department-store shopping and a rooftop city view.' }
            ]
          },
          {
            title: 'Day 6 | Nearby option',
            summary: 'Add one grand day trip if you have a sixth day in Paris.',
            stops: [{ time: 'Day trip', name: 'Palace of Versailles', note: 'Visit the palace, gardens, and fountains with enough time to avoid rushing back.' }]
          }
        ]
      },
      'zh-TW': {
        seasonLabel: '夏季推薦',
        title: '巴黎漫步',
        destination: '巴黎',
        duration: '5～6 天',
        style: '美術館、咖啡廳與城市散步',
        bestTime: '6 月中旬～7 月初；9 月初也非常舒服',
        summary: '以巴黎市區慢遊為主，安排鐵塔、博物館、街區散步、咖啡館與可彈性加入的凡爾賽近郊。',
        days: [
          {
            title: 'Day 1｜艾菲爾鐵塔與塞納河',
            summary: '用巴黎最經典的輪廓開場，從野餐一路走到夜晚河景。',
            stops: [
              { time: '上午', name: 'Eiffel Tower', note: '先看巴黎最具代表性的地標，也保留拍照與周邊散步時間。' },
              { time: '下午', name: '戰神廣場野餐', note: '買麵包、水果和起司，在草地上慢慢享受夏天。' },
              { time: '晚上', name: '塞納河夜遊', note: '從水上看橋、建築與燈光，讓第一天有浪漫收尾。' }
            ]
          },
          {
            title: 'Day 2｜羅浮宮與歷史軸線',
            summary: '把美術館、花園與廣場排在同一天，路線順也不太折返。',
            stops: [
              { time: '上午', name: '羅浮宮', note: '建議鎖定幾個展區，不把上午塞得太滿。' },
              { time: '下午', name: '杜樂麗花園', note: '在噴水池、樹蔭與椅子之間休息，銜接午後散步。' },
              { time: '傍晚', name: '協和廣場', note: '延著巴黎經典軸線前進，很適合接近黃昏時抵達。' }
            ]
          },
          {
            title: 'Day 3｜蒙馬特',
            summary: '把這天留給小丘、街角、聖心堂與咖啡館。',
            stops: [
              { time: '上午', name: '蒙馬特', note: '早點走進巷弄與階梯，避開中午後的人潮。' },
              { time: '下午', name: '聖心堂', note: '登上高處看巴黎市景，也能在教堂周邊慢慢停留。' },
              { time: '休息', name: '小丘咖啡館', note: '安排一間咖啡館坐下來，讓蒙馬特多一點日常感。' }
            ]
          },
          {
            title: 'Day 4｜奧賽與拉丁區',
            summary: '用印象派美術館、左岸街區和書店組成文藝感的一天。',
            stops: [
              { time: '上午', name: '奧賽博物館', note: '由火車站改建的美術館，本身空間和館藏都很值得停留。' },
              { time: '下午', name: '拉丁區', note: '穿過書店、學院街道與小餐館，感受左岸氣氛。' },
              { time: '傍晚', name: '莎士比亞書店', note: '塞納河旁的經典英文書店，適合當作散步中的小停靠。' }
            ]
          },
          {
            title: 'Day 5｜瑪黑區與購物',
            summary: '最後一個市區日安排街區散步、歌劇院與百貨購物。',
            stops: [
              { time: '上午', name: '瑪黑區散步', note: '小店、畫廊、甜點與隱藏庭院很多，適合慢慢逛。' },
              { time: '下午', name: '巴黎歌劇院', note: '可以欣賞外觀，時間足夠也能入內看華麗空間。' },
              { time: '傍晚', name: '老佛爺百貨', note: '適合購物與補伴手禮，也可以順道看屋頂景觀。' }
            ]
          },
          {
            title: 'Day 6｜近郊',
            summary: '如果有第六天，可以把凡爾賽排成完整的一日近郊。',
            stops: [{ time: '一日遊', name: 'Palace of Versailles', note: '宮殿、花園與噴泉都需要時間，建議不要排得太趕。' }]
          }
        ]
      },
      ja: {
        seasonLabel: '夏のおすすめ',
        title: 'パリ散歩',
        destination: 'パリ',
        duration: '5〜6日間',
        style: '美術館、カフェ、街歩き',
        bestTime: '6月中旬〜7月上旬。9月初旬もとても快適です',
        summary: 'エッフェル塔、美術館、街歩き、カフェ、そして余裕があればヴェルサイユへの近郊旅を組み合わせます。',
        days: [
          {
            title: 'Day 1｜エッフェル塔とセーヌ川',
            summary: 'パリらしい景色から始め、ピクニックと夜の川景色へつなげます。',
            stops: [
              { time: '午前', name: 'Eiffel Tower', note: 'パリを象徴するランドマークから始め、周辺で写真の時間も取ります。' },
              { time: '午後', name: 'シャン・ド・マルスでピクニック', note: 'パン、果物、チーズを買って芝生でゆっくり過ごします。' },
              { time: '夜', name: 'セーヌ川ナイトクルーズ', note: '橋や建物、街の灯りを水上から眺めます。' }
            ]
          },
          {
            title: 'Day 2｜ルーヴルと歴史軸',
            summary: '美術館、庭園、広場を自然な流れで巡ります。',
            stops: [
              { time: '午前', name: 'ルーヴル美術館', note: '見たい展示を絞ると、無理なく楽しめます。' },
              { time: '午後', name: 'チュイルリー庭園', note: '噴水や木陰の椅子で休みながら午後へつなげます。' },
              { time: '夕方', name: 'コンコルド広場', note: 'パリらしい大通りの流れを感じられる場所です。' }
            ]
          },
          {
            title: 'Day 3｜モンマルトル',
            summary: '丘の上の街並み、サクレ・クール寺院、カフェ時間を楽しみます。',
            stops: [
              { time: '午前', name: 'モンマルトル', note: '混み合う前に路地や階段をゆっくり歩きます。' },
              { time: '午後', name: 'サクレ・クール寺院', note: '高台からパリの景色を眺め、寺院周辺で休憩します。' },
              { time: '休憩', name: '丘のカフェ', note: '小さなカフェに入って、街歩きに日常感を足します。' }
            ]
          },
          {
            title: 'Day 4｜オルセーとカルチェ・ラタン',
            summary: '印象派の美術館、左岸の街、書店を組み合わせた一日です。',
            stops: [
              { time: '午前', name: 'オルセー美術館', note: '駅舎を改装した美しい空間で、印象派の名作を楽しめます。' },
              { time: '午後', name: 'カルチェ・ラタン', note: '書店、大学街、小さなレストランが並ぶ左岸らしいエリアです。' },
              { time: '夕方', name: 'シェイクスピア・アンド・カンパニー書店', note: 'セーヌ川近くの有名な英語書店で、散歩の途中に立ち寄れます。' }
            ]
          },
          {
            title: 'Day 5｜マレ地区と買い物',
            summary: '街歩き、オペラ座、百貨店を組み合わせた自由度の高い日です。',
            stops: [
              { time: '午前', name: 'マレ地区散策', note: '小さな店、ギャラリー、焼き菓子店、隠れた中庭を楽しめます。' },
              { time: '午後', name: 'パリ・オペラ座', note: '外観だけでも華やかで、時間があれば内部見学もおすすめです。' },
              { time: '夕方', name: 'ギャラリー・ラファイエット', note: '買い物やお土産探しに便利で、屋上からの眺めも楽しめます。' }
            ]
          },
          {
            title: 'Day 6｜近郊',
            summary: '6日目があれば、ヴェルサイユを一日かけて訪れます。',
            stops: [{ time: '日帰り', name: 'Palace of Versailles', note: '宮殿、庭園、噴水をゆっくり見るため、余裕を持った日程にします。' }]
          }
        ]
      }
    }
  },
  {
    slug: 'autumn',
    accent: 'bg-morandi-clay/20 text-morandi-ink',
    locales: {
      en: {
        seasonLabel: 'Autumn route',
        title: 'Kyoto autumn stroll',
        destination: 'Kyoto',
        duration: '5-7 days',
        style: 'Temples, foliage, and old streets',
        bestTime: 'Mid-November to early December',
        summary: 'A Kyoto autumn route through famous temples, maple corridors, Arashiyama, tea culture in Uji, and a flexible final market day.',
        days: [
          {
            title: 'Day 1 | Kiyomizu and old streets',
            summary: 'Start with one of Kyoto s most iconic temple areas and its historic sloped lanes.',
            stops: [
              { time: 'Morning', name: 'Kiyomizu-dera', note: 'Arrive early for hillside views, wooden terraces, and autumn colors.' },
              { time: 'Afternoon', name: 'Ninenzaka', note: 'Walk the preserved slope with tea shops, sweets, and small boutiques.' },
              { time: 'Afternoon', name: 'Sannenzaka', note: 'Continue through old Kyoto streets at a slow photo-friendly pace.' }
            ]
          },
          {
            title: 'Day 2 | Nanzen-ji and Eikan-do',
            summary: 'Spend the day around eastern Kyoto s deep autumn temple scenery.',
            stops: [
              { time: 'Morning', name: 'Nanzen-ji', note: 'Explore temple grounds, stone paths, and the aqueduct framed by maples.' },
              { time: 'Afternoon', name: 'Eikan-do', note: 'One of Kyoto s classic foliage spots, especially beautiful near late afternoon.' }
            ]
          },
          {
            title: 'Day 3 | Tofuku-ji and Fushimi Inari',
            summary: 'Pair a famous maple valley with a shrine walk through red torii gates.',
            stops: [
              { time: 'Morning', name: 'Tofuku-ji', note: 'The bridge view over the maple valley is a Kyoto autumn highlight.' },
              { time: 'Afternoon', name: 'Fushimi Inari', note: 'Walk part of the torii path and adjust the climb based on energy.' }
            ]
          },
          {
            title: 'Day 4 | Arashiyama',
            summary: 'Leave a full day for riverside scenery, bamboo paths, and western Kyoto.',
            stops: [
              { time: 'Morning', name: 'Arashiyama', note: 'A scenic district for river views, temples, snacks, and seasonal color.' },
              { time: 'Noon', name: 'Togetsukyo Bridge', note: 'A classic view where the bridge, river, and mountain foliage meet.' },
              { time: 'Afternoon', name: 'Bamboo Grove', note: 'Walk through the tall bamboo path and nearby quiet lanes.' }
            ]
          },
          {
            title: 'Day 5 | Northern Kyoto temples',
            summary: 'Use the day for two calm temple stops with distinct textures.',
            stops: [
              { time: 'Morning', name: 'Kinkaku-ji', note: 'See the golden pavilion reflected in the pond with autumn colors nearby.' },
              { time: 'Afternoon', name: 'Ryoan-ji', note: 'Slow down at the rock garden and quieter temple grounds.' }
            ]
          },
          {
            title: 'Day 6 | Nearby Uji',
            summary: 'A gentle day trip for tea, riverside walking, and a different Kyoto rhythm.',
            stops: [
              { time: 'Day trip', name: 'Uji', note: 'Visit tea shops, walk by the river, and explore the town at an easy pace.' },
              { time: 'Break', name: 'Uji tea trail', note: 'Try matcha sweets, tea houses, and small shops focused on Uji tea.' }
            ]
          },
          {
            title: 'Day 7 | Market and station area',
            summary: 'Keep the final day light for food, souvenirs, and transit-friendly wandering.',
            stops: [
              { time: 'Morning', name: 'Nishiki Market', note: 'Taste Kyoto snacks and shop for compact souvenirs.' },
              { time: 'Afternoon', name: 'Kyoto Station area', note: 'Good for last-minute shopping, food, and an easy departure plan.' }
            ]
          }
        ]
      },
      'zh-TW': {
        seasonLabel: '秋季推薦',
        title: '京都賞楓',
        destination: '京都',
        duration: '5～7 天',
        style: '寺院、楓葉與老街散策',
        bestTime: '11 月中旬～12 月初',
        summary: '以京都經典賞楓寺院為主軸，串起清水寺、南禪寺、東福寺、嵐山，也保留宇治與錦市場的彈性。',
        days: [
          {
            title: 'Day 1｜清水寺與老街',
            summary: '從京都最經典的山坡寺院與石板老街開始，慢慢進入賞楓旅程。',
            stops: [
              { time: '上午', name: '清水寺', note: '木造舞台、山景與楓葉很有代表性，建議早點抵達。' },
              { time: '下午', name: '二年坂', note: '石板坡道兩側有茶屋與小店，適合慢慢散步拍照。' },
              { time: '下午', name: '三年坂', note: '延續老京都街景，可以安排甜點或伴手禮停留。' }
            ]
          },
          {
            title: 'Day 2｜南禪寺與永觀堂',
            summary: '把東山一帶的深秋寺院排成一日，楓色濃度很高。',
            stops: [
              { time: '上午', name: '南禪寺', note: '寺院境內寬敞，水路閣與楓葉一起看很有京都秋天感。' },
              { time: '下午', name: '永觀堂', note: '京都知名賞楓名所，傍晚前後的光線特別漂亮。' }
            ]
          },
          {
            title: 'Day 3｜東福寺與伏見稻荷',
            summary: '上午看楓葉溪谷，下午走進千本鳥居。',
            stops: [
              { time: '上午', name: '東福寺', note: '通天橋望出去的楓葉景色非常經典，是京都秋季重點。' },
              { time: '下午', name: '伏見稻荷', note: '依體力選擇鳥居步道長度，不一定要走完全程。' }
            ]
          },
          {
            title: 'Day 4｜嵐山',
            summary: '把河景、橋、竹林與西京都的秋色留給完整一天。',
            stops: [
              { time: '上午', name: '嵐山', note: '河岸、寺院與小吃店集中，很適合慢慢逛。' },
              { time: '中午', name: '渡月橋', note: '橋、河流與山上楓色同框，是嵐山最經典的畫面。' },
              { time: '下午', name: '竹林小徑', note: '高聳竹林帶來不同於楓葉的清爽景色，可順路逛周邊小路。' }
            ]
          },
          {
            title: 'Day 5｜金閣寺與龍安寺',
            summary: '用北京都兩個氣質不同的寺院，安排比較安靜的一天。',
            stops: [
              { time: '上午', name: '金閣寺', note: '金色建築倒映在池水中，搭配秋色很適合拍照。' },
              { time: '下午', name: '龍安寺', note: '石庭氛圍安靜，適合把賞楓行程放慢。' }
            ]
          },
          {
            title: 'Day 6｜近郊宇治',
            summary: '安排宇治茶巡禮與河邊散步，讓京都行程多一點近郊感。',
            stops: [
              { time: '一日遊', name: '宇治', note: '從京都出發方便，適合茶店、河岸與小鎮慢遊。' },
              { time: '休息', name: '宇治茶巡禮', note: '可以安排抹茶甜點、茶屋與伴手禮，節奏輕鬆。' }
            ]
          },
          {
            title: 'Day 7｜錦市場與京都車站周邊',
            summary: '最後一天留給美食、伴手禮與交通方便的區域。',
            stops: [
              { time: '上午', name: '錦市場', note: '適合邊走邊吃，也能買一些小型伴手禮。' },
              { time: '下午', name: '京都車站周邊', note: '百貨、地下街與餐廳集中，適合返程前整理購物。' }
            ]
          }
        ]
      },
      ja: {
        seasonLabel: '秋のおすすめ',
        title: '京都 紅葉さんぽ',
        destination: '京都',
        duration: '5〜7日間',
        style: '寺院、紅葉、古い街並み',
        bestTime: '11月中旬〜12月上旬',
        summary: '清水寺、南禅寺、東福寺、嵐山を中心に、宇治や錦市場も組み合わせる京都の紅葉旅です。',
        days: [
          {
            title: 'Day 1｜清水寺と古い坂道',
            summary: '京都らしい寺院と石畳の坂道から、紅葉旅を始めます。',
            stops: [
              { time: '午前', name: '清水寺', note: '舞台、山の景色、紅葉を楽しめる定番スポットです。早めの到着がおすすめです。' },
              { time: '午後', name: '二年坂', note: '石畳の坂に茶屋や小さな店が並び、写真を撮りながら歩けます。' },
              { time: '午後', name: '三年坂', note: '古い京都の雰囲気が続き、甘味やお土産探しにも向いています。' }
            ]
          },
          {
            title: 'Day 2｜南禅寺と永観堂',
            summary: '東山エリアの紅葉が美しい寺院を一日かけて巡ります。',
            stops: [
              { time: '午前', name: '南禅寺', note: '広い境内、水路閣、紅葉を合わせて楽しめる秋らしい場所です。' },
              { time: '午後', name: '永観堂', note: '京都を代表する紅葉名所で、夕方前後の光もきれいです。' }
            ]
          },
          {
            title: 'Day 3｜東福寺と伏見稲荷',
            summary: '午前は紅葉の谷、午後は朱色の鳥居を歩きます。',
            stops: [
              { time: '午前', name: '東福寺', note: '通天橋から見る紅葉の景色は、京都の秋を代表する眺めです。' },
              { time: '午後', name: '伏見稲荷', note: '体力に合わせて鳥居の道を歩き、無理なく折り返せます。' }
            ]
          },
          {
            title: 'Day 4｜嵐山',
            summary: '川、橋、竹林、西京都の紅葉を一日かけて楽しみます。',
            stops: [
              { time: '午前', name: '嵐山', note: '川沿い、寺院、食べ歩きが集まる歩きやすいエリアです。' },
              { time: '昼', name: '渡月橋', note: '橋、川、山の紅葉が重なる嵐山らしい景色です。' },
              { time: '午後', name: '竹林小径', note: '高い竹に囲まれた道で、紅葉とは違う静かな景色を楽しめます。' }
            ]
          },
          {
            title: 'Day 5｜金閣寺と龍安寺',
            summary: '北京都の雰囲気が異なる二つの寺院をゆっくり巡ります。',
            stops: [
              { time: '午前', name: '金閣寺', note: '池に映る金色の建物と秋の色が印象的です。' },
              { time: '午後', name: '龍安寺', note: '石庭と静かな境内で、旅のペースを少し落とせます。' }
            ]
          },
          {
            title: 'Day 6｜近郊の宇治',
            summary: '宇治茶と川沿いの散策で、京都とは少し違う時間を過ごします。',
            stops: [
              { time: '日帰り', name: '宇治', note: '京都から行きやすく、茶店や川沿いをゆっくり楽しめます。' },
              { time: '休憩', name: '宇治茶巡り', note: '抹茶スイーツ、茶屋、お土産を軽いペースで巡ります。' }
            ]
          },
          {
            title: 'Day 7｜錦市場と京都駅周辺',
            summary: '最終日は食べ歩き、お土産、移動しやすいエリアで軽くまとめます。',
            stops: [
              { time: '午前', name: '錦市場', note: '京都らしい軽食を楽しみながら、小さなお土産も探せます。' },
              { time: '午後', name: '京都駅周辺', note: '百貨店、地下街、食事処が集まり、帰る前の調整に便利です。' }
            ]
          }
        ]
      }
    }
  },
  {
    slug: 'winter',
    accent: 'bg-white text-morandi-ink',
    locales: {
      en: {
        seasonLabel: 'Winter route',
        title: 'Swiss snow trip',
        destination: 'Lucerne base, Swiss rail day trips',
        duration: '7-9 days',
        style: 'One-base rail travel and snowy scenery',
        bestTime: 'Mid-December to mid-February',
        summary: 'A winter Switzerland route built around staying mainly in Lucerne and using trains for radial day trips to lakes, mountains, villages, and Christmas markets.',
        days: [
          {
            title: 'Day 1 | Arrive and move to Lucerne',
            summary: 'Keep the arrival day simple and settle into a comfortable base.',
            stops: [
              { time: 'Arrival', name: 'Zurich arrival', note: 'Use Zurich as the entry point and keep transfer time realistic after the flight.' },
              { time: 'Evening', name: 'Train to Lucerne', note: 'Move to Lucerne as the main base for easy rail connections and lake scenery.' }
            ]
          },
          {
            title: 'Day 2 | Lucerne lake area',
            summary: 'Ease into snowy Switzerland with an old town and lakefront day.',
            stops: [
              { time: 'Morning', name: 'Lake Lucerne area', note: 'Walk by the lake, enjoy mountain views, and keep the first full day gentle.' },
              { time: 'Afternoon', name: 'Chapel Bridge', note: 'Visit Lucerne s classic wooden bridge and nearby old town streets.' }
            ]
          },
          {
            title: 'Day 3 | Mount Rigi',
            summary: 'Take a classic snow-view rail day from the Lucerne base.',
            stops: [
              { time: 'Day trip', name: 'Mount Rigi', note: 'Use train and mountain railway connections for a scenic, low-stress snow day.' },
              { time: 'Transit', name: 'Snow train views', note: 'Let the railway ride become part of the experience, with snowy villages and lake views.' }
            ]
          },
          {
            title: 'Day 4 | Grindelwald',
            summary: 'A mountain village day with dramatic scenery and warm cafe pauses.',
            stops: [{ time: 'Day trip', name: 'Grindelwald', note: 'Go for chalet streets, snowy peaks, and flexible walking depending on weather.' }]
          },
          {
            title: 'Day 5 | Jungfrau region',
            summary: 'Build the day around snow walking and alpine scenery rather than rushing between too many spots.',
            stops: [
              { time: 'Day trip', name: 'Jungfrau region', note: 'Choose accessible viewpoints and trains based on the day s weather.' },
              { time: 'Afternoon', name: 'Snow walk', note: 'Leave time for a gentle snow walk and warm indoor break.' }
            ]
          },
          {
            title: 'Day 6 | Lauterbrunnen',
            summary: 'Visit the waterfall valley when you want a softer, cinematic snow landscape.',
            stops: [
              { time: 'Day trip', name: 'Lauterbrunnen', note: 'The valley, cliffs, and waterfalls feel especially quiet under winter snow.' },
              { time: 'Walk', name: 'Waterfall valley snow view', note: 'Keep the walk flexible and adjust to trail conditions.' }
            ]
          },
          {
            title: 'Day 7 | Bern',
            summary: 'Add a city day for arcades, old town streets, and a slower winter rhythm.',
            stops: [
              { time: 'Day trip', name: 'Bern', note: 'A comfortable rail day from Lucerne with a compact old town.' },
              { time: 'Afternoon', name: 'Old town', note: 'Walk under arcades, browse shops, and warm up in cafes.' }
            ]
          },
          {
            title: 'Day 8 | Zurich',
            summary: 'Use Zurich for a final city day, especially charming during December markets.',
            stops: [
              { time: 'Day trip', name: 'Zurich', note: 'Good for shopping, old town walks, and an easy route toward departure.' },
              { time: 'December', name: 'Christmas markets', note: 'If traveling in December, add market time for lights, food, and gifts.' }
            ]
          },
          {
            title: 'Day 9 | Departure',
            summary: 'Keep the last day simple so train transfers and flights stay comfortable.',
            stops: [{ time: 'Return', name: 'Departure', note: 'Travel back toward Zurich Airport with enough buffer for winter rail conditions.' }]
          }
        ]
      },
      'zh-TW': {
        seasonLabel: '冬季推薦',
        title: '瑞士賞雪',
        destination: '以琉森為基地，火車放射狀旅行',
        duration: '7～9 天',
        style: '單點住宿、鐵道雪景自由行',
        bestTime: '12 月中旬～2 月中旬',
        summary: '考量你之前規劃過瑞士自由行，這版以一個基地住宿搭火車放射狀旅遊為主，從湖區、雪山小鎮到聖誕市集都能彈性安排。',
        days: [
          {
            title: 'Day 1｜抵達蘇黎世，前往琉森',
            summary: '抵達日不排太滿，先移動到主要住宿基地。',
            stops: [
              { time: '抵達', name: '抵達蘇黎世', note: '把蘇黎世作為入境點，預留出關、領行李與交通緩衝。' },
              { time: '傍晚', name: '前往琉森', note: '搭火車前往琉森，作為後續放射狀旅行的舒適基地。' }
            ]
          },
          {
            title: 'Day 2｜琉森湖區',
            summary: '用湖景、老城和經典木橋慢慢進入瑞士冬天。',
            stops: [
              { time: '上午', name: '琉森湖區', note: '沿湖散步，看湖面、山景與冬季城市氛圍。' },
              { time: '下午', name: '卡貝爾橋', note: '琉森代表性木橋，周邊老城也適合慢慢走。' }
            ]
          },
          {
            title: 'Day 3｜Mount Rigi',
            summary: '從琉森出發安排經典雪景鐵道日。',
            stops: [
              { time: '一日遊', name: 'Mount Rigi', note: '搭乘火車與登山鐵道，看湖景、雪景和山上視野。' },
              { time: '移動', name: '雪景列車', note: '把列車本身也當成行程一部分，慢慢看窗外雪景。' }
            ]
          },
          {
            title: 'Day 4｜格林德瓦',
            summary: '安排山村與雪山景色，可以依天氣調整停留時間。',
            stops: [{ time: '一日遊', name: '格林德瓦', note: '木屋街景、雪山背景與咖啡廳都很適合冬季慢遊。' }]
          },
          {
            title: 'Day 5｜少女峰地區',
            summary: '這天重點放在阿爾卑斯雪景與雪地散步，不需要塞太多點。',
            stops: [
              { time: '一日遊', name: '少女峰地區', note: '依當天天氣選擇觀景點與鐵道路線，保留彈性最重要。' },
              { time: '下午', name: '雪地散步', note: '安排一段輕鬆雪地步道，搭配室內休息和熱飲。' }
            ]
          },
          {
            title: 'Day 6｜Lauterbrunnen',
            summary: '瀑布谷冬天很有電影感，適合安排比較柔和的一日。',
            stops: [
              { time: '一日遊', name: 'Lauterbrunnen', note: '峭壁、村莊與雪景組成很安靜的冬日畫面。' },
              { time: '散步', name: '瀑布谷雪景', note: '依路況調整步行距離，不需要走得太硬。' }
            ]
          },
          {
            title: 'Day 7｜伯恩',
            summary: '穿插一個城市日，讓連續山區行程有一點變化。',
            stops: [
              { time: '一日遊', name: '伯恩', note: '從 Lucerne 搭火車前往很適合，老城區集中好走。' },
              { time: '下午', name: '老城區', note: '拱廊街、鐘樓與咖啡館很適合冬天慢慢逛。' }
            ]
          },
          {
            title: 'Day 8｜蘇黎世',
            summary: '最後安排蘇黎世市區，12 月可加入聖誕市集。',
            stops: [
              { time: '一日遊', name: '蘇黎世', note: '適合購物、老城散步，也方便銜接返程。' },
              { time: '12 月', name: '聖誕市集', note: '如果是 12 月旅行，可以安排燈飾、市集小吃與禮物採買。' }
            ]
          },
          {
            title: 'Day 9｜返程',
            summary: '最後一天保留交通緩衝，讓回程更安心。',
            stops: [{ time: '返程', name: '返程', note: '從住宿地或蘇黎世前往機場，冬季交通建議多留一點時間。' }]
          }
        ]
      },
      ja: {
        seasonLabel: '冬のおすすめ',
        title: 'スイス雪景色の旅',
        destination: 'ルツェルンを拠点に鉄道で日帰り旅',
        duration: '7〜9日間',
        style: '一つの拠点から鉄道で巡る冬旅',
        bestTime: '12月中旬〜2月中旬',
        summary: 'ルツェルンを主な宿泊拠点にして、鉄道で湖、雪山の村、滝の谷、ベルン、チューリッヒへ放射状に巡るプランです。',
        days: [
          {
            title: 'Day 1｜チューリッヒ到着、ルツェルンへ',
            summary: '到着日は無理をせず、まず旅の拠点に移動します。',
            stops: [
              { time: '到着', name: 'チューリッヒ到着', note: '入国、荷物、移動の時間に余裕を持たせます。' },
              { time: '夕方', name: 'ルツェルンへ移動', note: '鉄道でルツェルンへ向かい、以降の旅の拠点にします。' }
            ]
          },
          {
            title: 'Day 2｜ルツェルン湖エリア',
            summary: '湖、旧市街、木橋でスイスの冬にゆっくり入ります。',
            stops: [
              { time: '午前', name: 'ルツェルン湖エリア', note: '湖沿いを歩き、山と冬の街の雰囲気を楽しみます。' },
              { time: '午後', name: 'カペル橋', note: 'ルツェルンを代表する木橋と周辺の旧市街を散策します。' }
            ]
          },
          {
            title: 'Day 3｜Mount Rigi',
            summary: 'ルツェルンから行きやすい雪景色の鉄道旅です。',
            stops: [
              { time: '日帰り', name: 'Mount Rigi', note: '列車と登山鉄道で、湖と雪山の眺めを楽しみます。' },
              { time: '移動', name: '雪景色の列車', note: '車窓から見える雪の村や湖も旅の一部になります。' }
            ]
          },
          {
            title: 'Day 4｜Grindelwald',
            summary: '山の村と雪山の景色を、天気に合わせて楽しみます。',
            stops: [{ time: '日帰り', name: 'Grindelwald', note: '木造の家、雪山、カフェ休憩を組み合わせやすい村です。' }]
          },
          {
            title: 'Day 5｜ユングフラウ地方',
            summary: 'アルプスの雪景色と軽い雪道散歩を中心にします。',
            stops: [
              { time: '日帰り', name: 'ユングフラウ地方', note: '天気に合わせて展望台や鉄道路線を選ぶと安心です。' },
              { time: '午後', name: '雪道散歩', note: '軽く歩いたあと、室内で温かい飲み物を取る時間も残します。' }
            ]
          },
          {
            title: 'Day 6｜Lauterbrunnen',
            summary: '滝の谷の雪景色を、静かに楽しむ一日です。',
            stops: [
              { time: '日帰り', name: 'Lauterbrunnen', note: '崖、村、雪が重なる映画のような冬景色です。' },
              { time: '散歩', name: '滝の谷の雪景色', note: '道の状態に合わせて歩く距離を調整します。' }
            ]
          },
          {
            title: 'Day 7｜Bern',
            summary: '山の日が続いたあとに、落ち着いた街歩きを入れます。',
            stops: [
              { time: '日帰り', name: 'Bern', note: 'ルツェルンから鉄道で行きやすく、旧市街がまとまっています。' },
              { time: '午後', name: '旧市街', note: 'アーケード、時計塔、カフェをゆっくり巡れます。' }
            ]
          },
          {
            title: 'Day 8｜チューリッヒ',
            summary: '最後の街歩きに。12月ならクリスマスマーケットも楽しめます。',
            stops: [
              { time: '日帰り', name: 'チューリッヒ', note: '買い物、旧市街散策、帰国前の調整に便利です。' },
              { time: '12月', name: 'クリスマスマーケット', note: '12月の旅なら、灯り、屋台、お土産探しを加えられます。' }
            ]
          },
          {
            title: 'Day 9｜帰国',
            summary: '最終日は移動の余裕を持たせて、安心して空港へ向かいます。',
            stops: [{ time: '帰国', name: '帰国', note: '冬の鉄道事情を考えて、空港までの移動時間に余裕を取ります。' }]
          }
        ]
      }
    }
  }
];

export const getRecommendedJourney = (season: string) => recommendedJourneys.find((journey) => journey.slug === season);
