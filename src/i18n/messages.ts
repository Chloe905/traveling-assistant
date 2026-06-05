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
      deleteConfirm: 'Delete this trip?',
      deleteModal: {
        title: 'Delete this trip?',
        message: 'This will remove the trip and its itinerary items. This action cannot be undone.'
      },
      card: {
        noDestination: 'No destination set',
        people: '{count} people',
        plannedCount: '{count} itinerary items',
        edit: 'Edit',
        delete: 'Delete'
      },
      modal: {
        eyebrowEdit: 'Edit trip',
        eyebrowAdd: 'New trip',
        titleEdit: 'Edit trip',
        titleAdd: 'Create new trip',
        close: 'Close',
        name: 'Trip name',
        destination: 'Destination',
        destinationPlaceholder: 'For example: Kyoto',
        people: 'People',
        dateStart: 'Start date',
        dateEnd: 'End date',
        dailyStart: 'Daily start',
        dailyEnd: 'Daily end',
        travelStyle: 'Travel style',
        styles: {
          relaxed: 'Relaxed',
          balanced: 'Balanced',
          packed: 'Packed'
        },
        cancel: 'Cancel',
        save: 'Save',
        dateError: 'End date cannot be earlier than the start date.'
      }
    },
    tripDetail: {
      backToTrips: '← Back to trips',
      loading: 'Loading trip...',
      loadFailed: 'Unable to load this trip. Please check the link or go back to the trip list.',
      people: '{count} people',
      daysTitle: 'Days',
      dayLabel: 'Day {day}',
      daySpotCount: '{count} itinerary items',
      confirmDeleteSpot: 'Delete this itinerary item?',
      confirmDeleteCandidate: 'Delete this candidate spot?',
      deleteDialog: {
        spotTitle: 'Delete this itinerary item?',
        spotMessage: 'This itinerary item will be removed from the current day.',
        candidateTitle: 'Delete this candidate spot?',
        candidateMessage: 'This candidate spot will be removed from the planning pool.'
      },
      actions: {
        edit: 'Edit',
        delete: 'Delete'
      },
      travelStyles: {
        relaxed: 'Relaxed',
        balanced: 'Balanced',
        packed: 'Packed'
      },
      priorities: {
        must: 'Must visit',
        high: 'High priority',
        medium: 'Optional',
        low: 'If time allows'
      },
      categories: {
        sightseeing: 'Sightseeing',
        food: 'Food',
        shopping: 'Shopping',
        museum: 'Museum',
        hotel: 'Hotel'
      },
      timeline: {
        title: 'Day {day} timeline',
        totalMinutes: '{total} minutes including transport estimates',
        addSpot: 'Add itinerary item',
        dragHint: 'Drag to reorder',
        emptyAddress: 'No address/area',
        empty: 'No itinerary items for this day yet. Add candidate spots first, then start AI planning.'
      },
      candidates: {
        title: 'Candidate pool',
        count: '{count} spots',
        emptyAddress: 'No area provided',
        duration: '{minutes} minutes',
        empty: 'Add a few places you want to visit before starting AI planning.'
      },
      candidateForm: {
        title: 'Candidate spots',
        name: 'Spot name',
        address: 'Address / area',
        addressPlaceholder: 'For example: Nakagyo Ward, Taipei Xinyi',
        category: 'Type',
        priority: 'Priority',
        duration: 'Stay minutes',
        openTime: 'Opens',
        closeTime: 'Closes',
        notes: 'Notes',
        notesPlaceholder: 'Food ideas, tickets, companion preferences...',
        saving: 'Saving...',
        update: 'Update candidate spot',
        add: 'Add candidate spot',
        cancelEdit: 'Cancel editing',
        updated: 'Candidate spot updated.',
        added: 'Candidate spot added.',
        saveFailed: 'Save failed. Please try again later.'
      },
      ai: {
        title: 'AI planning',
        description: 'Mock AI arranges by priority, stay time, and daily rhythm.',
        destination: 'Destination',
        dailyStart: 'Daily start',
        dailyEnd: 'Daily end',
        travelStyle: 'Travel style',
        planning: 'AI is planning...',
        plan: 'Start AI itinerary planning',
        note: 'AI keeps existing timeline items and only adds candidate spots that have not been scheduled yet. Transport notes can still be edited manually.'
      },
      collaborators: {
        title: 'Shared editing',
        description: 'Invite by email, or share an invite link or QR code.',
        generating: 'Generating',
        inviteLink: 'Invite link',
        sending: 'Sending',
        invite: 'Invite',
        copy: 'Copy',
        qrHelp: 'Friends can scan the QR code or open the link, then sign in/sign up or join first as a guest.',
        empty: 'No collaborators invited yet.',
        inviteSuccess: 'Added to the collaborator list.',
        inviteFailed: 'Email not found. You can also use an invite link or QR code.',
        linkSuccess: 'Invite link created. Copy it or let friends scan the QR code.',
        linkFailed: 'Unable to create invite link right now. Please try again later.',
        copied: 'Invite link copied.'
      },
      spotEditor: {
        editTitle: 'Edit itinerary item',
        addTitle: 'Add itinerary item',
        close: 'Close',
        name: 'Spot name',
        start: 'Start',
        duration: 'Stay minutes',
        end: 'End',
        transportMinutes: 'Transport minutes',
        address: 'Address / area',
        transportNote: 'Transport note',
        notes: 'Notes',
        cancel: 'Cancel',
        save: 'Save',
        defaultTransportNote: 'Added manually. You can add transport details.'
      }
    },
    common: {
      notFoundTitle: 'Page not found',
      backToTrips: 'Back to trips',
      confirm: {
        eyebrow: 'Please confirm',
        cancel: 'Cancel',
        delete: 'Delete'
      }
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
      workspace: '旅程工作區',
      title: '我的旅程',
      description: '建立旅程、加入候選景點，再讓 AI 先排一版可以手動調整的行程。',
      addTrip: '新增旅程',
      loading: '讀取旅程中...',
      emptyTitle: '還沒有旅程',
      emptyDescription: '新增第一個旅程，開始準備 AI 排程作品展示。',
      deleteConfirm: '確定要刪除這趟旅程嗎？',
      deleteModal: {
        title: '刪除這趟旅程？',
        message: '這會移除旅程與裡面的行程內容，刪除後無法復原。'
      },
      card: {
        noDestination: '未設定目的地',
        people: '{count} 人',
        plannedCount: '{count} 個行程',
        edit: '編輯',
        delete: '刪除'
      },
      modal: {
        eyebrowEdit: '編輯旅程',
        eyebrowAdd: '新增旅程',
        titleEdit: '編輯旅程',
        titleAdd: '建立新旅程',
        close: '關閉',
        name: '旅程名稱',
        destination: '目的地',
        destinationPlaceholder: '例如：京都',
        people: '人數',
        dateStart: '開始日期',
        dateEnd: '結束日期',
        dailyStart: '每日開始',
        dailyEnd: '每日結束',
        travelStyle: '旅行風格',
        styles: {
          relaxed: '輕鬆慢遊',
          balanced: '適中平衡',
          packed: '充實緊湊'
        },
        cancel: '取消',
        save: '儲存',
        dateError: '結束日期不能早於開始日期。'
      }
    },
    tripDetail: {
      backToTrips: '← 回旅程列表',
      loading: '讀取旅程中...',
      loadFailed: '無法讀取這趟旅程，請確認連結或回到旅程列表。',
      people: '{count} 人',
      daysTitle: '天數',
      dayLabel: '第 {day} 天',
      daySpotCount: '{count} 個行程',
      confirmDeleteSpot: '確定要刪除這個行程嗎？',
      confirmDeleteCandidate: '確定要刪除這個候選景點嗎？',
      deleteDialog: {
        spotTitle: '刪除這個行程？',
        spotMessage: '這個行程會從目前天數中移除。',
        candidateTitle: '刪除這個候選景點？',
        candidateMessage: '這個候選景點會從候選池中移除。'
      },
      actions: {
        edit: '編輯',
        delete: '刪除'
      },
      travelStyles: {
        relaxed: '輕鬆慢遊',
        balanced: '適中平衡',
        packed: '充實緊湊'
      },
      priorities: {
        must: '必去',
        high: '很想去',
        medium: '可安排',
        low: '有空再去'
      },
      categories: {
        sightseeing: '景點',
        food: '美食',
        shopping: '購物',
        museum: '展館',
        hotel: '住宿'
      },
      timeline: {
        title: '第 {day} 天時間軸',
        totalMinutes: '{total} 分鐘含交通估算',
        addSpot: '手動加入行程',
        dragHint: '拖拉調整順序',
        emptyAddress: '未填地址/區域',
        empty: '這一天還沒有行程。可以先新增候選景點，再啟用 AI 排程。'
      },
      candidates: {
        title: '候選池',
        count: '{count} 個',
        emptyAddress: '未填區域',
        duration: '{minutes} 分鐘',
        empty: '先加入幾個想去的景點，再啟用 AI 排程。'
      },
      candidateForm: {
        title: '候選景點',
        name: '景點名稱',
        address: '地址 / 區域',
        addressPlaceholder: '例如：中京區、台北信義區',
        category: '類型',
        priority: '優先級',
        duration: '停留分鐘',
        openTime: '營業開始',
        closeTime: '營業結束',
        notes: '備註',
        notesPlaceholder: '想吃的店、門票、同行者偏好...',
        saving: '儲存中...',
        update: '更新候選景點',
        add: '加入候選景點',
        cancelEdit: '取消編輯',
        updated: '候選景點已更新。',
        added: '候選景點已加入。',
        saveFailed: '儲存失敗，請稍後再試。'
      },
      ai: {
        title: 'AI 排程',
        description: 'Mock AI 會依優先級、停留時間與每日節奏安排。',
        destination: '目的地',
        dailyStart: '每日開始',
        dailyEnd: '每日結束',
        travelStyle: '旅行風格',
        planning: 'AI 安排中...',
        plan: '啟用 AI 排行程',
        note: 'AI 會保留時間軸中既有行程，只補入尚未排入的候選景點；交通備註仍可手動修正。'
      },
      collaborators: {
        title: '共同編輯',
        description: '可用 email 邀請，也可分享連結或 QR code。',
        generating: '產生中',
        inviteLink: '邀請連結',
        sending: '送出中',
        invite: '邀請',
        copy: '複製',
        qrHelp: '朋友掃 QR 或打開連結後，可以登入/註冊再加入，也可以用訪客名稱先加入旅程。',
        empty: '尚未邀請共編者。',
        inviteSuccess: '已加入共同編輯清單。',
        inviteFailed: '找不到這個 email，也可以改用邀請連結或 QR code。',
        linkSuccess: '邀請連結已建立，可以複製或讓朋友掃 QR code。',
        linkFailed: '目前無法建立邀請連結，請稍後再試。',
        copied: '邀請連結已複製。'
      },
      spotEditor: {
        editTitle: '編輯行程',
        addTitle: '手動加入行程',
        close: '關閉',
        name: '景點名稱',
        start: '開始',
        duration: '停留分鐘',
        end: '結束',
        transportMinutes: '交通分鐘',
        address: '地址 / 區域',
        transportNote: '交通備註',
        notes: '備註',
        cancel: '取消',
        save: '儲存',
        defaultTransportNote: '手動加入，可自行補上交通方式。'
      }
    },
    common: {
      notFoundTitle: '找不到這個頁面',
      backToTrips: '回旅程列表',
      confirm: {
        eyebrow: '請再次確認',
        cancel: '取消',
        delete: '刪除'
      }
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
      workspace: '旅程ワークスペース',
      title: '旅程一覧',
      description: '旅程を作成し、候補スポットを追加して、AI が下書きしたプランを手動で調整できます。',
      addTrip: '旅程を追加',
      loading: '旅程を読み込み中...',
      emptyTitle: 'まだ旅程がありません',
      emptyDescription: '最初の旅程を作成して、AI 旅程作成のデモを始めましょう。',
      deleteConfirm: 'この旅程を削除しますか？',
      deleteModal: {
        title: 'この旅程を削除しますか？',
        message: '旅程と中の行程が削除されます。この操作は元に戻せません。'
      },
      card: {
        noDestination: '目的地未設定',
        people: '{count} 人',
        plannedCount: '行程 {count} 件',
        edit: '編集',
        delete: '削除'
      },
      modal: {
        eyebrowEdit: '旅程を編集',
        eyebrowAdd: '新しい旅程',
        titleEdit: '旅程を編集',
        titleAdd: '新しい旅程を作成',
        close: '閉じる',
        name: '旅程名',
        destination: '目的地',
        destinationPlaceholder: '例：京都',
        people: '人数',
        dateStart: '開始日',
        dateEnd: '終了日',
        dailyStart: '毎日の開始',
        dailyEnd: '毎日の終了',
        travelStyle: '旅のスタイル',
        styles: {
          relaxed: 'ゆったり',
          balanced: 'バランス',
          packed: 'しっかり巡る'
        },
        cancel: 'キャンセル',
        save: '保存',
        dateError: '終了日は開始日より前にできません。'
      }
    },
    tripDetail: {
      backToTrips: '← 旅程一覧へ戻る',
      loading: '旅程を読み込み中...',
      loadFailed: 'この旅程を読み込めません。リンクを確認するか、旅程一覧へ戻ってください。',
      people: '{count} 人',
      daysTitle: '日数',
      dayLabel: '{day} 日目',
      daySpotCount: '行程 {count} 件',
      confirmDeleteSpot: 'この行程を削除しますか？',
      confirmDeleteCandidate: 'この候補スポットを削除しますか？',
      deleteDialog: {
        spotTitle: 'この行程を削除しますか？',
        spotMessage: 'この行程は現在の日程から削除されます。',
        candidateTitle: 'この候補スポットを削除しますか？',
        candidateMessage: 'この候補スポットは候補リストから削除されます。'
      },
      actions: {
        edit: '編集',
        delete: '削除'
      },
      travelStyles: {
        relaxed: 'ゆったり',
        balanced: 'バランス',
        packed: 'しっかり巡る'
      },
      priorities: {
        must: '必ず行きたい',
        high: '優先度高め',
        medium: '候補',
        low: '時間があれば'
      },
      categories: {
        sightseeing: '観光',
        food: 'グルメ',
        shopping: '買い物',
        museum: '展示・博物館',
        hotel: '宿泊'
      },
      timeline: {
        title: '{day} 日目のタイムライン',
        totalMinutes: '移動時間込みで {total} 分',
        addSpot: '行程を手動追加',
        dragHint: 'ドラッグして順番を変更',
        emptyAddress: '住所/エリア未入力',
        empty: 'この日はまだ行程がありません。候補スポットを追加してから AI 計画を開始できます。'
      },
      candidates: {
        title: '候補リスト',
        count: '{count} 件',
        emptyAddress: 'エリア未入力',
        duration: '{minutes} 分',
        empty: 'AI 計画を始める前に、行きたい場所をいくつか追加してください。'
      },
      candidateForm: {
        title: '候補スポット',
        name: 'スポット名',
        address: '住所 / エリア',
        addressPlaceholder: '例：中京区、台北信義区',
        category: 'タイプ',
        priority: '優先度',
        duration: '滞在分数',
        openTime: '営業開始',
        closeTime: '営業終了',
        notes: 'メモ',
        notesPlaceholder: '食べたい店、チケット、同行者の好み...',
        saving: '保存中...',
        update: '候補スポットを更新',
        add: '候補スポットを追加',
        cancelEdit: '編集をキャンセル',
        updated: '候補スポットを更新しました。',
        added: '候補スポットを追加しました。',
        saveFailed: '保存に失敗しました。時間をおいて再試行してください。'
      },
      ai: {
        title: 'AI 計画',
        description: 'Mock AI が優先度、滞在時間、1日のリズムに合わせて配置します。',
        destination: '目的地',
        dailyStart: '毎日の開始',
        dailyEnd: '毎日の終了',
        travelStyle: '旅のスタイル',
        planning: 'AI が計画中...',
        plan: 'AI で旅程を作成',
        note: 'AI は既存のタイムライン項目を残し、まだ予定に入っていない候補スポットだけを追加します。移動メモは手動で編集できます。'
      },
      collaborators: {
        title: '共同編集',
        description: 'メールで招待するほか、リンクや QR code も共有できます。',
        generating: '作成中',
        inviteLink: '招待リンク',
        sending: '送信中',
        invite: '招待',
        copy: 'コピー',
        qrHelp: '友人は QR を読み取るかリンクを開き、ログイン/登録して参加できます。ゲスト名で先に参加することもできます。',
        empty: '共同編集者はまだ招待されていません。',
        inviteSuccess: '共同編集リストに追加しました。',
        inviteFailed: 'このメールは見つかりません。招待リンクまたは QR code も利用できます。',
        linkSuccess: '招待リンクを作成しました。コピーするか、友人に QR code を読み取ってもらえます。',
        linkFailed: '現在、招待リンクを作成できません。時間をおいて再試行してください。',
        copied: '招待リンクをコピーしました。'
      },
      spotEditor: {
        editTitle: '行程を編集',
        addTitle: '行程を手動追加',
        close: '閉じる',
        name: 'スポット名',
        start: '開始',
        duration: '滞在分数',
        end: '終了',
        transportMinutes: '移動分数',
        address: '住所 / エリア',
        transportNote: '移動メモ',
        notes: 'メモ',
        cancel: 'キャンセル',
        save: '保存',
        defaultTransportNote: '手動追加。移動方法を自由に追記できます。'
      }
    },
    common: {
      notFoundTitle: 'ページが見つかりません',
      backToTrips: '旅程一覧へ戻る',
      confirm: {
        eyebrow: '確認してください',
        cancel: 'キャンセル',
        delete: '削除'
      }
    }
  }
};
export type SupportedLocale = keyof typeof messages;
