export const messages = {
  en: {
    nav: {
      appName: 'Traveling Assistant',
      logout: 'Log out',
      login: 'Sign in',
      language: 'Language'
    },
    landing: {
      eyebrow: 'Travel Assistant',
      title: 'Turn the places you dream of into a journey, one step at a time.',
      description:
        'Collect the places everyone wants to visit, let AI shape them into a thoughtful itinerary, then discuss and refine the plan with your travel companions so planning feels as enjoyable as the trip itself.',
      startPlanning: 'Start planning',
      signIn: 'Sign in',
      scrollCue: 'Explore journeys',
      globe: {
        tokyo: 'Tokyo',
        kyoto: 'Kyoto',
        paris: 'Paris',
        australia: 'Australia',
        switzerland: 'Switzerland',
        newZealand: 'New Zealand'
      },
      journeys: {
        springMeta: 'Spring route',
        springTitle: 'Tokyo to Kyoto',
        summerMeta: 'Summer route',
        summerTitle: 'Paris to Provence',
        autumnMeta: 'Autumn route',
        autumnTitle: 'Seoul to Jeju'
      },
      mapCover: {
        eyebrow: 'Your travel map',
        title: 'Every place you want to visit deserves to become part of the next journey',
        body: 'Give scattered wishes a sense of direction, and let the journey take shape step by step.'
      },
      introEyebrow: 'Designed for thoughtful journeys',
      introTitle: 'Make complex travel planning simple, flexible, and reassuring.',
      introBody: 'Traveling Assistant: candidate spots, AI-assisted planning, and shared editing.',
      showcaseEyebrow: 'From wishlist to day-by-day plan',
      showcaseTitle: 'Every place you want to visit has a chance to become a scene in your journey.',
      draftLabel: 'Tokyo stroll',
      maplessLabel: 'Mapless MVP',
      features: {
        candidateTitle: 'Collect travel inspiration',
        candidateDescription: 'Save the places you want to visit on the map first, and let them wait to become part of your next journey.',
        aiTitle: 'Plan each day',
        aiDescription: 'Automatically organize spots, timing, and routes so the journey takes shape step by step.',
        collaborationTitle: 'Edit together with travel companions',
        collaborationDescription: 'Share itineraries and ideas, then complete a travel plan that belongs to all of you.'
      },
      sampleStops: {
        meijiName: 'Meiji Shrine',
        meijiNote: 'Start quiet, near transit, 75 minute stay.',
        harajukuName: 'Harajuku cafe walk',
        harajukuNote: 'AI estimates 25 minutes transport and buffer.',
        shibuyaName: 'Shibuya Sky',
        shibuyaNote: 'Prioritized for sunset, still manually adjustable.'
      },
      metrics: {
        modesValue: '3',
        modesLabel: 'Planning modes: AI, manual, collaborative',
        editableValue: '100%',
        editableLabel: 'Editable itinerary after generation',
        stackValue: 'Vue 3',
        stackLabel: 'Composition API, Pinia, Router, Tailwind'
      }
    },
    auth: {
      heroEyebrow: 'AI itinerary workspace',
      heroTitle: 'Turn the places you love into an editable daily itinerary',
      heroBody: 'Add candidate spots manually, let AI draft timing, stays, and transport notes, then refine the plan with your travel companions.',
      signInTitle: 'Sign in',
      signInHint: 'Please log in using your registered email and password.',
      email: 'Email',
      password: 'Password',
      signingIn: 'Signing in...',
      signIn: 'Sign in',
      createAccount: 'Create account',
      signUpTitle: 'Create account',
      name: 'Name',
      creating: 'Creating...',
      signUpAndLogin: 'Sign up and sign in',
      alreadyHaveAccount: 'Already have an account',
      verifyTitle: 'Please verify your email first',
      verifyBody: 'We sent a verification email to {email}. Open the confirmation link, then come back to sign in.',
      goToSignIn: 'I verified my email, go to sign in',
      errors: {
        emailNotConfirmed: 'This email is not verified yet. Please open the verification email before signing in.',
        invalidCredentials: 'The email or password is incorrect. Please confirm this account exists in Supabase Auth.',
        invalidEmail: 'Supabase rejected this email format. Please use a valid email address.',
        signInFailed: 'Sign in failed: {message}',
        signInFallback: 'Sign in failed. Please check your credentials or Supabase Auth settings.',
        emailAlreadyRegistered: 'This email is already registered. Please sign in or use another email.',
        signUpFailed: 'Sign up failed: {message}',
        signUpFallback: 'Sign up failed. Please use another email or try again later.'
      }
    },
    trips: {
      workspace: 'Trip workspace',
      title: 'My trips',
      description: 'Create a trip, add candidate spots, then let AI draft an itinerary you can adjust manually.',
      addTrip: 'Add trip',
      loading: 'Loading trips...',
      emptyTitle: 'No trips yet',
      emptyDescription: 'Create your first trip and start preparing an AI itinerary portfolio demo.',
      deleteConfirm: 'Delete this trip?'
    },
    common: {
      notFoundTitle: 'Page not found',
      backToTrips: 'Back to trips'
    }
  },
  'zh-TW': {
    nav: {
      appName: 'Traveling Assistant',
      logout: '登出',
      login: '登入',
      language: '語言'
    },
    landing: {
      eyebrow: '旅行助手',
      title: '陪你把想去的地方，慢慢變成一趟旅程。',
      description: '收集每個人想去的地方，AI 幫你整理成合理的行程提案，再和旅伴一起討論、修改，讓規劃旅行變得跟旅行一樣有趣。',
      startPlanning: '開始規劃',
      signIn: '登入',
      scrollCue: '探索旅程',
      globe: {
        tokyo: '東京',
        kyoto: '京都',
        paris: '巴黎',
        australia: '澳洲',
        switzerland: '瑞士',
        newZealand: '紐西蘭'
      },
      journeys: {
        springMeta: '春季路線',
        springTitle: '東京到京都',
        summerMeta: '夏季路線',
        summerTitle: '巴黎到普羅旺斯',
        autumnMeta: '秋季路線',
        autumnTitle: '首爾到濟州'
      },
      mapCover: {
        eyebrow: '你的旅行地圖',
        title: '每個想去的地方，都值得成為下一段旅程',
        body: '讓零散的期待有了方向，讓旅程一步步成形。'
      },
      introEyebrow: '為細緻旅程而設計',
      introTitle: '讓複雜的旅行規劃，變得簡單、彈性又安心。',
      introBody: 'Traveling Assistant ：候選景點、AI 輔助排程、共同編輯。',
      showcaseEyebrow: '從願望清單到每日行程',
      showcaseTitle: '每個想去的地方，都有機會成為旅程裡的風景。',
      draftLabel: '東京散策',
      maplessLabel: 'Mapless MVP',
      features: {
        candidateTitle: '收藏旅行靈感',
        candidateDescription: '。把想去的地方先留在地圖上，等待它們成為下一段旅程。',
        aiTitle: '規劃每日行程',
        aiDescription: '自動整理景點、時間與路線，讓旅程一步步成形。',
        collaborationTitle: '與旅伴共同編輯',
        collaborationDescription: '分享行程與想法，一起完成屬於你們的旅行計畫。'
      },
      sampleStops: {
        meijiName: '明治神宮',
        meijiNote: '從安靜景點開始，鄰近交通，停留 75 分鐘。',
        harajukuName: '原宿咖啡散步',
        harajukuNote: 'AI 估算 25 分鐘交通與緩衝。',
        shibuyaName: '澀谷 Sky',
        shibuyaNote: '優先安排夕陽時段，仍可手動調整。'
      },
      metrics: {
        modesValue: '3',
        modesLabel: '規劃模式：AI、手動、共同編輯',
        editableValue: '100%',
        editableLabel: 'AI 產生後仍可完整調整',
        stackValue: 'Vue 3',
        stackLabel: 'Composition API、Pinia、Router、Tailwind'
      }
    },
    auth: {
      heroEyebrow: 'AI itinerary workspace',
      heroTitle: '把想去的景點整理成可調整的每日行程',
      heroBody: '手動加入候選景點，讓 AI 先排出時間、停留與交通備註，再依照旅伴需求共同調整。',
      signInTitle: '登入',
      signInHint: '請使用已註冊的 email 與密碼登入。',
      email: 'Email',
      password: 'Password',
      signingIn: '登入中...',
      signIn: '登入',
      createAccount: '建立新帳號',
      signUpTitle: '建立帳號',
      name: 'Name',
      creating: '建立中...',
      signUpAndLogin: '註冊並登入',
      alreadyHaveAccount: '已有帳號',
      verifyTitle: '請先到 email 完成驗證',
      verifyBody: '我們已經把驗證信寄到 {email}。請點開信中的確認連結後，再回來登入。',
      goToSignIn: '我已完成驗證，前往登入',
      errors: {
        emailNotConfirmed: '此 email 尚未驗證。請先打開驗證信完成確認。',
        invalidCredentials: '帳號或密碼不正確，請確認你輸入的是 Supabase Auth 裡的註冊帳號。',
        invalidEmail: 'Supabase 判定此 email 格式不可用，請換一個有效 email。',
        signInFailed: '登入失敗：{message}',
        signInFallback: '登入失敗，請確認帳號密碼或 Supabase Auth 設定。',
        emailAlreadyRegistered: '這個 email 已註冊，請直接登入或換一組 email。',
        signUpFailed: '註冊失敗：{message}',
        signUpFallback: '註冊失敗，請換一組 email 或稍後再試。'
      }
    },
    trips: {
      workspace: 'Trip workspace',
      title: '我的旅程',
      description: '建立旅程、加入候選景點，再讓 AI 先排一版可以手動調整的行程。',
      addTrip: '新增旅程',
      loading: '讀取旅程中...',
      emptyTitle: '還沒有旅程',
      emptyDescription: '新增第一個旅程，開始準備 AI 排程作品展示。',
      deleteConfirm: '確定要刪除這趟旅程嗎？'
    },
    common: {
      notFoundTitle: '找不到這個頁面',
      backToTrips: '回旅程列表'
    }
  },
  ja: {
    nav: {
      appName: 'Traveling Assistant',
      logout: 'ログアウト',
      login: 'ログイン',
      language: '言語'
    },
    landing: {
      eyebrow: '旅行アシスタント',
      title: '行きたい場所を、少しずつ一つの旅に変えていく。',
      description: 'みんなが行きたい場所を集め、AI が無理のない旅程案に整理します。そのあと同行者と話し合いながら調整できるので、旅の計画も旅そのもののように楽しくなります。',
      startPlanning: '計画を始める',
      signIn: 'ログイン',
      scrollCue: '旅程を見る',
      globe: {
        tokyo: '東京',
        kyoto: '京都',
        paris: 'パリ',
        australia: 'オーストラリア',
        switzerland: 'スイス',
        newZealand: 'ニュージーランド'
      },
      journeys: {
        springMeta: '春のルート',
        springTitle: '東京から京都へ',
        summerMeta: '夏のルート',
        summerTitle: 'パリからプロヴァンスへ',
        autumnMeta: '秋のルート',
        autumnTitle: 'ソウルから済州へ'
      },
      mapCover: {
        eyebrow: 'あなたの旅行地図',
        title: '行きたい場所の一つひとつが、次の旅になる価値を持っています',
        body: 'ばらばらの期待に方向を与え、旅が一歩ずつ形になっていきます。'
      },
      introEyebrow: '丁寧な旅のための設計',
      introTitle: '複雑な旅行計画を、シンプルで柔軟、そして安心できるものに。',
      introBody: 'Traveling Assistant：候補スポット、AI 補助プランニング、共同編集。',
      showcaseEyebrow: '行きたい場所リストから日別プランへ',
      showcaseTitle: '行きたい場所の一つひとつが、旅の風景になるかもしれません。',
      draftLabel: '東京散策',
      maplessLabel: 'Mapless MVP',
      features: {
        candidateTitle: '旅のインスピレーションを集める',
        candidateDescription: '行きたい場所をまず地図に残して、次の旅の一部になる日を待たせておけます。',
        aiTitle: '日ごとの行程を計画する',
        aiDescription: 'スポット、時間、ルートを自動で整理し、旅を一歩ずつ形にしていきます。',
        collaborationTitle: '旅の仲間と一緒に編集する',
        collaborationDescription: '行程やアイデアを共有し、あなたたちらしい旅行計画を一緒に完成させます。'
      },
      sampleStops: {
        meijiName: '明治神宮',
        meijiNote: '静かな場所から開始。交通アクセスもよく、滞在は 75 分。',
        harajukuName: '原宿カフェ散歩',
        harajukuNote: 'AI が移動と余裕時間を 25 分で見積もり。',
        shibuyaName: '渋谷スカイ',
        shibuyaNote: '夕方の時間帯を優先しつつ、手動調整も可能。'
      },
      metrics: {
        modesValue: '3',
        modesLabel: '計画モード：AI、手動、共同編集',
        editableValue: '100%',
        editableLabel: '生成後も旅程を編集可能',
        stackValue: 'Vue 3',
        stackLabel: 'Composition API、Pinia、Router、Tailwind'
      }
    },
    auth: {
      heroEyebrow: 'AI itinerary workspace',
      heroTitle: '行きたい場所を、編集しやすい日別旅程に整理',
      heroBody: '候補スポットを手動で追加し、AI が時間・滞在・移動メモを下書きします。同行者に合わせてあとから調整できます。',
      signInTitle: 'ログイン',
      signInHint: 'ご登録のメールアドレスとパスワードを使用してログインしてください。',
      email: 'メール',
      password: 'パスワード',
      signingIn: 'ログイン中...',
      signIn: 'ログイン',
      createAccount: '新規登録',
      signUpTitle: 'アカウント作成',
      name: '名前',
      creating: '作成中...',
      signUpAndLogin: '登録してログイン',
      alreadyHaveAccount: 'すでにアカウントをお持ちの方',
      verifyTitle: '先にメール認証を完了してください',
      verifyBody: '{email} に確認メールを送信しました。メール内の確認リンクを開いてから、ログインしてください。',
      goToSignIn: '認証が完了したのでログインへ',
      errors: {
        emailNotConfirmed: 'このメールアドレスはまだ認証されていません。確認メールを開いて認証してください。',
        invalidCredentials: 'メールアドレスまたはパスワードが正しくありません。Supabase Auth の登録情報を確認してください。',
        invalidEmail: 'Supabase がこのメール形式を受け付けませんでした。有効なメールアドレスを使用してください。',
        signInFailed: 'ログインに失敗しました：{message}',
        signInFallback: 'ログインに失敗しました。認証情報または Supabase Auth 設定を確認してください。',
        emailAlreadyRegistered: 'このメールアドレスはすでに登録されています。ログインするか、別のメールを使用してください。',
        signUpFailed: '登録に失敗しました：{message}',
        signUpFallback: '登録に失敗しました。別のメールを使用するか、時間をおいて再試行してください。'
      }
    },
    trips: {
      workspace: 'Trip workspace',
      title: '旅程一覧',
      description: '旅程を作成し、候補スポットを追加して、AI が下書きしたプランを手動で調整できます。',
      addTrip: '旅程を追加',
      loading: '旅程を読み込み中...',
      emptyTitle: 'まだ旅程がありません',
      emptyDescription: '最初の旅程を作成して、AI 旅程作成のデモを始めましょう。',
      deleteConfirm: 'この旅程を削除しますか？'
    },
    common: {
      notFoundTitle: 'ページが見つかりません',
      backToTrips: '旅程一覧へ戻る'
    }
  }
};
export type SupportedLocale = keyof typeof messages;
