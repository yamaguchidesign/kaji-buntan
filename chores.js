const CHORES = [
  // 🍳 料理・食事関連
  { text: "献立を考える", category: "料理" },
  { text: "冷蔵庫の中身を把握し、足りないものをメモする", category: "料理" },
  { text: "スーパーに食材を買いに行く", category: "料理" },
  { text: "朝ごはんを作る", category: "料理" },
  { text: "晩ごはんを作る", category: "料理" },
  { text: "お弁当を作る", category: "料理" },
  { text: "食器を洗う", category: "料理" },
  { text: "食洗機に食器をセットし、終わったら片付ける", category: "料理" },
  { text: "シンクの排水口のゴミを取り除く", category: "料理" },
  { text: "コンロ周りの油汚れを拭く", category: "料理" },
  { text: "調味料がなくなったら補充・購入する", category: "料理" },
  { text: "麦茶やお茶を作って冷蔵庫に入れる", category: "料理" },
  { text: "炊飯器でご飯を炊く", category: "料理" },

  // 🧹 掃除関連
  { text: "掃除機をかける", category: "掃除" },
  { text: "床をフローリングワイパーで拭く", category: "掃除" },
  { text: "トイレ掃除をする", category: "掃除" },
  { text: "お風呂のカビ取り・排水口の掃除をする", category: "掃除" },
  { text: "お風呂を洗って湯を溜める", category: "掃除" },
  { text: "洗面台の水垢を掃除する", category: "掃除" },
  { text: "窓を拭く・網戸を掃除する", category: "掃除" },
  { text: "ベランダ・バルコニーを掃く", category: "掃除" },
  { text: "玄関を掃き掃除する", category: "掃除" },
  { text: "エアコンのフィルターを掃除する", category: "掃除" },

  // 👕 洗濯関連
  { text: "洗濯機を回す", category: "洗濯" },
  { text: "洗濯物を干す", category: "洗濯" },
  { text: "乾いた洗濯物を取り込む", category: "洗濯" },
  { text: "洗濯物をたたんでしまう", category: "洗濯" },
  { text: "アイロンをかける", category: "洗濯" },
  { text: "洗濯槽のクリーニングをする", category: "洗濯" },
  { text: "布団を干す・布団乾燥機をかける", category: "洗濯" },
  { text: "シーツや枕カバーを定期的に洗う", category: "洗濯" },

  // 🗑️ ゴミ関連
  { text: "ゴミの日にゴミ袋を家からゴミ捨て場まで運び、捨てる", category: "ゴミ" },
  { text: "各部屋のゴミ箱のゴミを集めてまとめる", category: "ゴミ" },
  { text: "ゴミの分別をする", category: "ゴミ" },
  { text: "ゴミ箱に新しい袋をセットする", category: "ゴミ" },
  { text: "ゴミ袋のストックが切れたら買い足す", category: "ゴミ" },

  // 📦 日用品・管理
  { text: "トイレットペーパーを補充する", category: "日用品" },
  { text: "ティッシュがなくなったら新しい箱を出す", category: "日用品" },
  { text: "シャンプー・ボディソープの詰め替えをする", category: "日用品" },
  { text: "洗剤・柔軟剤のストックを管理・購入する", category: "日用品" },
  { text: "電球が切れたら交換する", category: "日用品" },
  { text: "宅配便を受け取る", category: "日用品" },
  { text: "郵便ポストを確認して郵便物を取る", category: "日用品" },
  { text: "届いたダンボールを解体して捨てる", category: "日用品" },

  // 💰 家計・手続き
  { text: "家計簿をつける・支出を管理する", category: "家計" },
  { text: "公共料金の支払い・引き落としを確認する", category: "家計" },
  { text: "保険の更新・見直しをする", category: "家計" },
  { text: "町内会費・自治会費を払う", category: "家計" },
  { text: "年賀状を準備して出す", category: "家計" },

  // 🏠 住まいの管理
  { text: "壊れた家具・家電の修理手配をする", category: "住まい" },
  { text: "防虫剤・除湿剤を交換する", category: "住まい" },
  { text: "ベランダの植物に水をやる", category: "住まい" },
  { text: "季節の家電（扇風機・ヒーターなど）の出し入れをする", category: "住まい" },
  { text: "災害用の備蓄品を管理する", category: "住まい" },

  // 🚗 車関連
  { text: "車のガソリンを入れに行く", category: "車" },
  { text: "車の定期点検・車検の手配をする", category: "車" },
  { text: "車の中を掃除する", category: "車" },

  // 👶 育児関連（子どもがいる場合）
  { text: "保育園・学校の持ち物を準備する", category: "育児" },
  { text: "子どもの送り迎えをする", category: "育児" },
  { text: "子どもの宿題をみる", category: "育児" },
  { text: "保護者会・授業参観に参加する", category: "育児" },
  { text: "子どもの服のサイズアウトを確認して買い替える", category: "育児" },
  { text: "予防接種・健診のスケジュールを管理する", category: "育児" },
  { text: "習い事の送迎・準備をする", category: "育児" },

  // 🐾 ペット関連
  { text: "ペットのごはんを用意する", category: "ペット" },
  { text: "ペットの散歩に行く", category: "ペット" },
  { text: "ペットのトイレを掃除する", category: "ペット" },

  // 🤝 人付き合い
  { text: "親戚への贈り物・お中元お歳暮を手配する", category: "人付き合い" },
  { text: "家族の誕生日プレゼントを考えて買う", category: "人付き合い" },
  { text: "実家に連絡をする（自分の/相手の）", category: "人付き合い" },

  // 🩺 健康管理
  { text: "病院の予約を取る（自分/家族）", category: "健康" },
  { text: "薬の残りを確認して病院に行く", category: "健康" },
  { text: "常備薬（風邪薬・絆創膏など）を補充する", category: "健康" },
];
