import React, { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react'
import { supabase } from './supabaseClient'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area, ReferenceLine, Brush
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Building2, DollarSign, 
  Percent, BarChart3, Plus, Edit2, Target,
  X, Check, Hotel, ChevronDown, ChevronUp, AlertTriangle, Lightbulb, Save, LogOut,
  Download, FileText, ArrowLeftRight, Activity, Globe, Users, Calendar,
  RefreshCw, Moon, Sun, Camera, Filter, Keyboard, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Share2, Bell, Maximize2
} from 'lucide-react'

const HOTELS = {
  'doubutsuen': 'ホテル動物園前',
  'shinimamiya': 'ホテル新今宮'
}

// ホテル動物園前 データ（当月列のみ：合計=売上高, 販売客室数, 稼働率, ADR）
const initialDataDoubutsuen = [
  {
    id: 101, month: '2024年1月',
    revenue: 4040960, rooms: 566, occupancy: 50.7, adr: 7140, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 102, month: '2024年2月',
    revenue: 6143913, rooms: 794, occupancy: 76.1, adr: 7738, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 103, month: '2024年3月',
    revenue: 7696531, rooms: 916, occupancy: 82.1, adr: 8402, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 104, month: '2024年4月',
    revenue: 8134553, rooms: 950, occupancy: 88.0, adr: 8563, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 105, month: '2024年5月',
    revenue: 6649740, rooms: 796, occupancy: 71.3, adr: 8354, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 106, month: '2024年6月',
    revenue: 5231859, rooms: 865, occupancy: 80.1, adr: 6048, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 107, month: '2024年7月',
    revenue: 7122019, rooms: 1075, occupancy: 96.3, adr: 6625, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 108, month: '2024年8月',
    revenue: 7330640, rooms: 1056, occupancy: 94.6, adr: 6942, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 109, month: '2024年9月',
    revenue: 6746657, rooms: 1034, occupancy: 95.7, adr: 6525, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 110, month: '2024年10月',
    revenue: 8021733, rooms: 1095, occupancy: 98.1, adr: 7326, revenueTarget: 6700000,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 111, month: '2024年11月',
    revenue: 8350603, rooms: 1057, occupancy: 97.9, adr: 7900, revenueTarget: 7100000,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 1, month: '2024年12月',
    revenue: 8477529, rooms: 1006, occupancy: 90.1, adr: 8427, revenueTarget: 0,
    domesticRatio: 65, overseasRatio: 35,
    channels: {
      'Booking': { revenue: 951098, ratio: 3.4, avgPrice: 4840 },
      'AGODA': { revenue: 2690486, ratio: 86.3, avgPrice: 4803 },
      'エクスペディア': { revenue: 1350768, ratio: 5.5, avgPrice: 6007 },
      '楽天トラベル': { revenue: 522632, ratio: 2.1, avgPrice: 8256 },
      'じゃらん': { revenue: 4490035, ratio: 18.0, avgPrice: 9908 },
      '一休': { revenue: 25670, ratio: 0.1, avgPrice: 4220 },
      'Trip.com': { revenue: 0, ratio: 0, avgPrice: 0 },
      'るるぶ': { revenue: 350640, ratio: 1.6, avgPrice: 4027 },
      '予約PRO': { revenue: 10232, ratio: 0.9, avgPrice: 10232 },
      '直予約': { revenue: 1409976, ratio: 6.6, avgPrice: 4254 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 3048 },
    }
  },
  {
    id: 2, month: '2025年1月',
    revenue: 6190644, rooms: 807, occupancy: 82.6, adr: 7671, revenueTarget: 6500000,
    domesticRatio: 53, overseasRatio: 47,
    channels: {
      'Booking': { revenue: 1344531, ratio: 6.7, avgPrice: 3888 },
      'AGODA': { revenue: 10985248, ratio: 54.0, avgPrice: 4273 },
      'エクスペディア': { revenue: 498861, ratio: 8.1, avgPrice: 6892 },
      '楽天トラベル': { revenue: 453300, ratio: 2.3, avgPrice: 7064 },
      'じゃらん': { revenue: 2418174, ratio: 12.0, avgPrice: 7102 },
      '一休': { revenue: 122348, ratio: 0.5, avgPrice: 4265 },
      'Trip.com': { revenue: 0, ratio: 0, avgPrice: 0 },
      'るるぶ': { revenue: 478070, ratio: 2.4, avgPrice: 5164 },
      '予約PRO': { revenue: 180041, ratio: 0.4, avgPrice: 24600 },
      '直予約': { revenue: 1185128, ratio: 5.8, avgPrice: 41435 },
      'その他': { revenue: 232242, ratio: 1.6, avgPrice: 2148 },
    }
  },
  {
    id: 3, month: '2025年2月',
    revenue: 5758604, rooms: 807, occupancy: 80.1, adr: 7133, revenueTarget: 6200000,
    domesticRatio: 46, overseasRatio: 54,
    channels: {
      'Booking': { revenue: 1588300, ratio: 8.7, avgPrice: 4404 },
      'AGODA': { revenue: 10972487, ratio: 54.6, avgPrice: 4634 },
      'エクスペディア': { revenue: 488861, ratio: 8.1, avgPrice: 5125 },
      '楽天トラベル': { revenue: 453300, ratio: 2.3, avgPrice: 7054 },
      'じゃらん': { revenue: 2418174, ratio: 12.0, avgPrice: 7102 },
      '一休': { revenue: 50280, ratio: 0.3, avgPrice: 4205 },
      'Trip.com': { revenue: 0, ratio: 0, avgPrice: 0 },
      'るるぶ': { revenue: 478070, ratio: 0.4, avgPrice: 5164 },
      '予約PRO': { revenue: 11478, ratio: 0.1, avgPrice: 41435 },
      '直予約': { revenue: 1185128, ratio: 5.8, avgPrice: 41134 },
      'その他': { revenue: 232242, ratio: 1.6, avgPrice: 2148 },
    }
  },
  {
    id: 4, month: '2025年3月',
    revenue: 8350603, rooms: 1057, occupancy: 97.9, adr: 7900, revenueTarget: 7300000,
    domesticRatio: 37, overseasRatio: 63,
    channels: {
      'Booking': { revenue: 5374006, ratio: 12.5, avgPrice: 4639 },
      'AGODA': { revenue: 11138296, ratio: 42.8, avgPrice: 4901 },
      'エクスペディア': { revenue: 988247, ratio: 21.5, avgPrice: 5727 },
      '楽天トラベル': { revenue: 600631, ratio: 3.4, avgPrice: 7343 },
      'じゃらん': { revenue: 2506062, ratio: 9.6, avgPrice: 7363 },
      '一休': { revenue: 175480, ratio: 0.3, avgPrice: 5143 },
      'Trip.com': { revenue: 11505, ratio: 0.7, avgPrice: 3855 },
      'るるぶ': { revenue: 292110, ratio: 1.1, avgPrice: 5901 },
      '予約PRO': { revenue: 82200, ratio: 0.3, avgPrice: 6212 },
      '直予約': { revenue: 4173034, ratio: 4.5, avgPrice: 5876 },
      'その他': { revenue: 407785, ratio: 1.8, avgPrice: 2413 },
    }
  },
  {
    id: 5, month: '2025年4月',
    revenue: 9934419, rooms: 1065, occupancy: 98.6, adr: 9328, revenueTarget: 7500000,
    domesticRatio: 40, overseasRatio: 60,
    channels: {
      'Booking': { revenue: 1186095, ratio: 3.2, avgPrice: 6492 },
      'AGODA': { revenue: 21709317, ratio: 99.5, avgPrice: 7754 },
      'エクスペディア': { revenue: 4955641, ratio: 13.0, avgPrice: 6385 },
      '楽天トラベル': { revenue: 2330920, ratio: 6.4, avgPrice: 10094 },
      'じゃらん': { revenue: 2438310, ratio: 6.7, avgPrice: 14685 },
      '一休': { revenue: 46310, ratio: 0.1, avgPrice: 75710 },
      'Trip.com': { revenue: 297895, ratio: 0.8, avgPrice: 350015 },
      'るるぶ': { revenue: 1485112, ratio: 5.1, avgPrice: 10296 },
      '予約PRO': { revenue: 0, ratio: 0, avgPrice: 0 },
      '直予約': { revenue: 426615, ratio: 2.5, avgPrice: 5406 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 2645 },
    }
  },
  {
    id: 6, month: '2025年5月',
    revenue: 9551573, rooms: 1079, occupancy: 99.9, adr: 8852, revenueTarget: 7800000,
    domesticRatio: 25, overseasRatio: 75,
    channels: {
      'Booking': { revenue: 1552472, ratio: 5.5, avgPrice: 5996 },
      'AGODA': { revenue: 18272137, ratio: 53.0, avgPrice: 7863 },
      'エクスペディア': { revenue: 4033902, ratio: 11.7, avgPrice: 6802 },
      '楽天トラベル': { revenue: 563910, ratio: 3.3, avgPrice: 11276 },
      'じゃらん': { revenue: 3866288, ratio: 11.2, avgPrice: 5333 },
      '一休': { revenue: 13100, ratio: 0.0, avgPrice: 7442 },
      'Trip.com': { revenue: 705398, ratio: 2.0, avgPrice: 7148 },
      'るるぶ': { revenue: 307925, ratio: 0.9, avgPrice: 5527 },
      '予約PRO': { revenue: 1389360, ratio: 8.8, avgPrice: 11405 },
      '直予約': { revenue: 424590, ratio: 1.2, avgPrice: 5101 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 2687 },
    }
  },
  {
    id: 7, month: '2025年6月',
    revenue: 7647534, rooms: 1017, occupancy: 91.1, adr: 7520, revenueTarget: 7000000,
    domesticRatio: 15, overseasRatio: 85,
    channels: {
      'Booking': { revenue: 1319456, ratio: 4.2, avgPrice: 5510 },
      'AGODA': { revenue: 14386090, ratio: 53.6, avgPrice: 6077 },
      'エクスペディア': { revenue: 1597044, ratio: 6.0, avgPrice: 6238 },
      '楽天トラベル': { revenue: 1459010, ratio: 5.4, avgPrice: 7347 },
      'じゃらん': { revenue: 993500, ratio: 5.4, avgPrice: 7100 },
      '一休': { revenue: 170000, ratio: 0.6, avgPrice: 5833 },
      'Trip.com': { revenue: 17055, ratio: 0.1, avgPrice: 17055 },
      'るるぶ': { revenue: 333431, ratio: 1.2, avgPrice: 9527 },
      '予約PRO': { revenue: 0, ratio: 0, avgPrice: 0 },
      '直予約': { revenue: 407600, ratio: 5.1, avgPrice: 4686 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 2891 },
    }
  },
  {
    id: 8, month: '2025年7月',
    revenue: 10093685, rooms: 1079, occupancy: 99.9, adr: 9355, revenueTarget: 7400000,
    domesticRatio: 10, overseasRatio: 90,
    channels: {
      'Booking': { revenue: 7042295, ratio: 4.0, avgPrice: 5595 },
      'AGODA': { revenue: 14128126, ratio: 54.3, avgPrice: 6801 },
      'エクスペディア': { revenue: 1275346, ratio: 9.4, avgPrice: 7421 },
      '楽天トラベル': { revenue: 1255346, ratio: 4.7, avgPrice: 7272 },
      'じゃらん': { revenue: 4233690, ratio: 16.3, avgPrice: 4880 },
      '一休': { revenue: 0, ratio: 0, avgPrice: 0 },
      'Trip.com': { revenue: 2509638, ratio: 1.7, avgPrice: 7224 },
      'るるぶ': { revenue: 958181, ratio: 0.0, avgPrice: 4600 },
      '予約PRO': { revenue: 1350641, ratio: 1.5, avgPrice: 8387 },
      '直予約': { revenue: 0, ratio: 5.2, avgPrice: 4457 },
      'その他': { revenue: 37065, ratio: 0, avgPrice: 0 },
    }
  },
  {
    id: 9, month: '2025年8月',
    revenue: 9767543, rooms: 1079, occupancy: 99.9, adr: 9053, revenueTarget: 8000000,
    domesticRatio: 46, overseasRatio: 54,
    channels: {
      'Booking': { revenue: 1290035, ratio: 4.1, avgPrice: 5291 },
      'AGODA': { revenue: 16871572, ratio: 56.8, avgPrice: 6413 },
      'エクスペディア': { revenue: 2714192, ratio: 9.1, avgPrice: 6588 },
      '楽天トラベル': { revenue: 1377029, ratio: 4.6, avgPrice: 8771 },
      'じゃらん': { revenue: 845423, ratio: 2.8, avgPrice: 10289 },
      '一休': { revenue: 3731023, ratio: 12.6, avgPrice: 5175 },
      'Trip.com': { revenue: 935295, ratio: 3.1, avgPrice: 6587 },
      'るるぶ': { revenue: 1380544, ratio: 4.5, avgPrice: 4676 },
      '予約PRO': { revenue: 1124862, ratio: 0.4, avgPrice: 2450 },
      '直予約': { revenue: 0, ratio: 0, avgPrice: 0 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 0 },
    }
  },
  {
    id: 10, month: '2025年9月',
    revenue: 8134553, rooms: 950, occupancy: 88.0, adr: 8563, revenueTarget: 7500000,
    domesticRatio: 50, overseasRatio: 50,
    channels: {
      'Booking': { revenue: 19257, ratio: 2.3, avgPrice: 7314 },
      'AGODA': { revenue: 18268556, ratio: 53.3, avgPrice: 5613 },
      'エクスペディア': { revenue: 2845756, ratio: 8.3, avgPrice: 7670 },
      '楽天トラベル': { revenue: 3209531, ratio: 9.4, avgPrice: 8315 },
      'じゃらん': { revenue: 2054311, ratio: 5.0, avgPrice: 7200 },
      '一休': { revenue: 188543, ratio: 0.6, avgPrice: 7780 },
      'Trip.com': { revenue: 640406, ratio: 1.9, avgPrice: 7789 },
      'るるぶ': { revenue: 1007566, ratio: 2.9, avgPrice: 12144 },
      '予約PRO': { revenue: 0, ratio: 0, avgPrice: 0 },
      '直予約': { revenue: 1455080, ratio: 4.2, avgPrice: 5291 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 0 },
    }
  },
  {
    id: 11, month: '2025年10月',
    revenue: 8094774, rooms: 950, occupancy: 88.0, adr: 8521, revenueTarget: 8600000,
    domesticRatio: 37, overseasRatio: 63,
    channels: {
      'Booking': { revenue: 2174885, ratio: 14.4, avgPrice: 5031 },
      'AGODA': { revenue: 12846872, ratio: 40.7, avgPrice: 4803 },
      'エクスペディア': { revenue: 988147, ratio: 11.0, avgPrice: 6007 },
      '楽天トラベル': { revenue: 982147, ratio: 3.8, avgPrice: 10523 },
      'じゃらん': { revenue: 104930, ratio: 1.3, avgPrice: 11659 },
      '一休': { revenue: 33668, ratio: 0.4, avgPrice: 5611 },
      'Trip.com': { revenue: 1388044, ratio: 17.1, avgPrice: 13095 },
      'るるぶ': { revenue: 63478, ratio: 0.8, avgPrice: 7053 },
      '予約PRO': { revenue: 55730, ratio: 0.7, avgPrice: 11145 },
      '直予約': { revenue: 366726, ratio: 4.5, avgPrice: 6112 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 0 },
    }
  },
  {
    id: 12, month: '2025年11月',
    revenue: 8258119, rooms: 1058, occupancy: 98.0, adr: 7901, revenueTarget: 9000000,
    domesticRatio: 60, overseasRatio: 40,
    channels: {
      'Booking': { revenue: 1407449, ratio: 17.3, avgPrice: 6702 },
      'AGODA': { revenue: 9372682, ratio: 41.5, avgPrice: 6342 },
      'エクスペディア': { revenue: 866923, ratio: 10.7, avgPrice: 7347 },
      '楽天トラベル': { revenue: 473540, ratio: 5.8, avgPrice: 10523 },
      'じゃらん': { revenue: 104930, ratio: 1.3, avgPrice: 11659 },
      '一休': { revenue: 1388044, ratio: 17.1, avgPrice: 13095 },
      'Trip.com': { revenue: 53478, ratio: 0.8, avgPrice: 7053 },
      'るるぶ': { revenue: 55730, ratio: 0.7, avgPrice: 11145 },
      '予約PRO': { revenue: 55730, ratio: 0.8, avgPrice: 7053 },
      '直予約': { revenue: 366726, ratio: 4.5, avgPrice: 6112 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 0 },
    }
  },
]

// ホテル新今宮 データ（当月列のみ：合計=売上高, 販売客室数, 稼働率, ADR）
// 図3:令和6年11月, 図14:令和6年12月, 図13:令和7年1月, 図12:令和7年2月,
// 図11:令和7年3月, 図10:令和7年4月, 図9:令和7年5月, 図8:令和7年6月,
// 図7:令和7年7月, 図6:令和7年8月, 図5:令和7年9月, 図4:令和7年10月
const initialDataShinimamiya = [
  {
    id: 201, month: '2024年1月',
    revenue: 14790618, rooms: 3901, occupancy: 65.5, adr: 3791, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 202, month: '2024年2月',
    revenue: 15964656, rooms: 3876, occupancy: 69.6, adr: 4119, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 203, month: '2024年3月',
    revenue: 22547708, rooms: 5442, occupancy: 91.4, adr: 4143, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 204, month: '2024年4月',
    revenue: 22167683, rooms: 5230, occupancy: 90.8, adr: 4239, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 205, month: '2024年5月',
    revenue: 21465597, rooms: 5354, occupancy: 90.0, adr: 4009, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 206, month: '2024年6月',
    revenue: 18293436, rooms: 5174, occupancy: 86.9, adr: 3536, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 207, month: '2024年7月',
    revenue: 19546080, rooms: 4919, occupancy: 82.6, adr: 3974, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 208, month: '2024年8月',
    revenue: 20509746, rooms: 4695, occupancy: 78.9, adr: 4368, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 209, month: '2024年9月',
    revenue: 21501143, rooms: 5079, occupancy: 88.2, adr: 4233, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    id: 210, month: '2024年10月',
    revenue: 24875369, rooms: 5487, occupancy: 92.2, adr: 4534, revenueTarget: 21000000,
    domesticRatio: 50, overseasRatio: 50,
    channels: {}
  },
  {
    // 図3: 令和6年11月 ホテル新今宮
    id: 1, month: '2024年11月',
    revenue: 28123874, rooms: 21005, occupancy: 94.1, adr: 4821, revenueTarget: 0,
    domesticRatio: 36, overseasRatio: 64,
    channels: {
      'Booking': { revenue: 1407449, ratio: 17.3, avgPrice: 6702 },
      'AGODA': { revenue: 9372682, ratio: 41.5, avgPrice: 6342 },
      'エクスペディア': { revenue: 866923, ratio: 10.7, avgPrice: 7347 },
      '楽天トラベル': { revenue: 473540, ratio: 5.8, avgPrice: 10523 },
      'じゃらん': { revenue: 104930, ratio: 1.3, avgPrice: 11659 },
      '一休': { revenue: 1388044, ratio: 17.1, avgPrice: 13095 },
      'Trip.com': { revenue: 53478, ratio: 0.8, avgPrice: 7053 },
      'るるぶ': { revenue: 55730, ratio: 0.7, avgPrice: 11145 },
      '予約PRO': { revenue: 55730, ratio: 0.8, avgPrice: 7053 },
      '直予約': { revenue: 366726, ratio: 4.5, avgPrice: 6112 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 0 },
    }
  },
  {
    // 図14: 令和6年12月 ホテル新今宮
    id: 2, month: '2024年12月',
    revenue: 25074109, rooms: 106308, occupancy: 87.0, adr: 4944, revenueTarget: 0,
    domesticRatio: 50, overseasRatio: 50,
    channels: {
      'Booking': { revenue: 951500, ratio: 3.4, avgPrice: 4840 },
      'AGODA': { revenue: 14115886, ratio: 56.3, avgPrice: 4803 },
      'エクスペディア': { revenue: 1690786, ratio: 6.9, avgPrice: 6007 },
      '楽天トラベル': { revenue: 522632, ratio: 2.1, avgPrice: 8256 },
      'じゃらん': { revenue: 4490035, ratio: 18.0, avgPrice: 9908 },
      '一休': { revenue: 25670, ratio: 0.1, avgPrice: 4220 },
      'Trip.com': { revenue: 4600025, ratio: 18.0, avgPrice: 4600 },
      'るるぶ': { revenue: 350640, ratio: 1.6, avgPrice: 4027 },
      '予約PRO': { revenue: 10232, ratio: 0.9, avgPrice: 10232 },
      '直予約': { revenue: 1409976, ratio: 6.6, avgPrice: 4254 },
      'その他': { revenue: 94500, ratio: 0.4, avgPrice: 3048 },
    }
  },
  {
    // 図13: 令和7年1月 ホテル新今宮
    id: 3, month: '2025年1月',
    revenue: 20350462, rooms: 80195, occupancy: 80.4, adr: 4786, revenueTarget: 17000000,
    domesticRatio: 53, overseasRatio: 47,
    channels: {
      'Booking': { revenue: 1364521, ratio: 6.7, avgPrice: 4370 },
      'AGODA': { revenue: 10955838, ratio: 54.0, avgPrice: 4273 },
      'エクスペディア': { revenue: 865446, ratio: 4.3, avgPrice: 7054 },
      '楽天トラベル': { revenue: 453300, ratio: 2.3, avgPrice: 7064 },
      'じゃらん': { revenue: 3380876, ratio: 18.6, avgPrice: 7102 },
      '一休': { revenue: 0, ratio: 0, avgPrice: 0 },
      'Trip.com': { revenue: 13230, ratio: 0.1, avgPrice: 13230 },
      'るるぶ': { revenue: 5300, ratio: 0, avgPrice: 5300 },
      '予約PRO': { revenue: 296010, ratio: 1.9, avgPrice: 6300 },
      '直予約': { revenue: 1418900, ratio: 7.0, avgPrice: 3824 },
      'その他': { revenue: 50200, ratio: 0.3, avgPrice: 2692 },
    }
  },
  {
    // 図12: 令和7年2月 ホテル新今宮
    id: 4, month: '2025年2月',
    revenue: 15914606, rooms: 74551, occupancy: 89.8, adr: 4119, revenueTarget: 17500000,
    domesticRatio: 43, overseasRatio: 57,
    channels: {
      'Booking': { revenue: 1968303, ratio: 8.7, avgPrice: 4404 },
      'AGODA': { revenue: 10977497, ratio: 54.6, avgPrice: 4634 },
      'エクスペディア': { revenue: 4884867, ratio: 8.1, avgPrice: 5125 },
      '楽天トラベル': { revenue: 1116162, ratio: 2.3, avgPrice: 7054 },
      'じゃらん': { revenue: 2416714, ratio: 12.0, avgPrice: 7102 },
      '一休': { revenue: 952300, ratio: 0.3, avgPrice: 4205 },
      'Trip.com': { revenue: 117096, ratio: 0.1, avgPrice: 8800 },
      'るるぶ': { revenue: 81041, ratio: 0.4, avgPrice: 5164 },
      '予約PRO': { revenue: 11495, ratio: 0.1, avgPrice: 41435 },
      '直予約': { revenue: 1165018, ratio: 5.8, avgPrice: 41134 },
      'その他': { revenue: 232242, ratio: 1.6, avgPrice: 2148 },
    }
  },
  {
    // 図11: 令和7年3月 ホテル新今宮
    id: 5, month: '2025年3月',
    revenue: 20173218, rooms: 74551, occupancy: 85.5, adr: 4594, revenueTarget: 23500000,
    domesticRatio: 30, overseasRatio: 70,
    channels: {
      'Booking': { revenue: 3271804, ratio: 12.5, avgPrice: 4639 },
      'AGODA': { revenue: 11138206, ratio: 42.8, avgPrice: 4901 },
      'エクスペディア': { revenue: 988247, ratio: 21.5, avgPrice: 5727 },
      '楽天トラベル': { revenue: 2506062, ratio: 9.6, avgPrice: 7363 },
      'じゃらん': { revenue: 600631, ratio: 3.4, avgPrice: 7343 },
      '一休': { revenue: 975460, ratio: 3.6, avgPrice: 5143 },
      'Trip.com': { revenue: 252110, ratio: 1.1, avgPrice: 5901 },
      'るるぶ': { revenue: 82200, ratio: 0.3, avgPrice: 6212 },
      '予約PRO': { revenue: 84226, ratio: 0.2, avgPrice: 6028 },
      '直予約': { revenue: 1171092, ratio: 4.0, avgPrice: 5576 },
      'その他': { revenue: 407785, ratio: 1.8, avgPrice: 2413 },
    }
  },
  {
    // 図10: 令和7年4月 ホテル新今宮
    id: 6, month: '2025年4月',
    revenue: 22142603, rooms: 122197, occupancy: 90.0, adr: 5497, revenueTarget: 24500000,
    domesticRatio: 35, overseasRatio: 65,
    channels: {
      'Booking': { revenue: 1186095, ratio: 3.2, avgPrice: 6492 },
      'AGODA': { revenue: 21759317, ratio: 59.5, avgPrice: 7754 },
      'エクスペディア': { revenue: 4955641, ratio: 13.6, avgPrice: 6385 },
      '楽天トラベル': { revenue: 2330930, ratio: 6.4, avgPrice: 10094 },
      'じゃらん': { revenue: 2438310, ratio: 6.7, avgPrice: 14685 },
      '一休': { revenue: 446310, ratio: 1.2, avgPrice: 7571 },
      'Trip.com': { revenue: 297895, ratio: 0.8, avgPrice: 35015 },
      'るるぶ': { revenue: 297865, ratio: 0.8, avgPrice: 10296 },
      '予約PRO': { revenue: 75716, ratio: 0.2, avgPrice: 7572 },
      '直予約': { revenue: 426615, ratio: 2.5, avgPrice: 5406 },
      'その他': { revenue: 436816, ratio: 1.2, avgPrice: 2645 },
    }
  },
  {
    // 図9: 令和7年5月 ホテル新今宮
    id: 7, month: '2025年5月',
    revenue: 34580205, rooms: 134294, occupancy: 94.3, adr: 6164, revenueTarget: 23000000,
    domesticRatio: 25, overseasRatio: 75,
    channels: {
      'Booking': { revenue: 1820474, ratio: 5.3, avgPrice: 5996 },
      'AGODA': { revenue: 18272137, ratio: 53.0, avgPrice: 7863 },
      'エクスペディア': { revenue: 4053902, ratio: 11.7, avgPrice: 6802 },
      '楽天トラベル': { revenue: 1351900, ratio: 3.3, avgPrice: 11276 },
      'じゃらん': { revenue: 3866288, ratio: 11.2, avgPrice: 5333 },
      '一休': { revenue: 8866288, ratio: 11.2, avgPrice: 7442 },
      'Trip.com': { revenue: 372210, ratio: 0.1, avgPrice: 7148 },
      'るるぶ': { revenue: 700586, ratio: 2.0, avgPrice: 5527 },
      '予約PRO': { revenue: 207929, ratio: 0.9, avgPrice: 11405 },
      '直予約': { revenue: 1989836, ratio: 5.8, avgPrice: 5101 },
      'その他': { revenue: 424536, ratio: 1.2, avgPrice: 2687 },
    }
  },
  {
    // 図8: 令和7年6月 ホテル新今宮
    id: 8, month: '2025年6月',
    revenue: 26838306, rooms: 85445, occupancy: 91.1, adr: 5178, revenueTarget: 20000000,
    domesticRatio: 11, overseasRatio: 89,
    channels: {
      'Booking': { revenue: 1119405, ratio: 4.2, avgPrice: 5510 },
      'AGODA': { revenue: 14386090, ratio: 53.6, avgPrice: 6077 },
      'エクスペディア': { revenue: 1597044, ratio: 6.0, avgPrice: 6238 },
      '楽天トラベル': { revenue: 1459030, ratio: 5.4, avgPrice: 7347 },
      'じゃらん': { revenue: 993500, ratio: 5.4, avgPrice: 7100 },
      '一休': { revenue: 170000, ratio: 0.6, avgPrice: 5833 },
      'Trip.com': { revenue: 17055, ratio: 0.1, avgPrice: 17055 },
      'るるぶ': { revenue: 333431, ratio: 1.2, avgPrice: 9527 },
      '予約PRO': { revenue: 233459, ratio: 1.2, avgPrice: 7053 },
      '直予約': { revenue: 1134094, ratio: 4.2, avgPrice: 4686 },
      'その他': { revenue: 407660, ratio: 1.5, avgPrice: 2891 },
    }
  },
  {
    // 図7: 令和7年7月 ホテル新今宮
    id: 9, month: '2025年7月',
    revenue: 26051393, rooms: 108565, occupancy: 82.2, adr: 4384, revenueTarget: 22000000,
    domesticRatio: 18, overseasRatio: 82,
    channels: {
      'Booking': { revenue: 14128864, ratio: 54.4, avgPrice: 5595 },
      'AGODA': { revenue: 2449804, ratio: 8.4, avgPrice: 6801 },
      'エクスペディア': { revenue: 1325146, ratio: 4.7, avgPrice: 7421 },
      '楽天トラベル': { revenue: 4233690, ratio: 16.3, avgPrice: 4880 },
      'じゃらん': { revenue: 2509638, ratio: 1.7, avgPrice: 7224 },
      '一休': { revenue: 958181, ratio: 0.0, avgPrice: 4600 },
      'Trip.com': { revenue: 1350641, ratio: 1.5, avgPrice: 8387 },
      'るるぶ': { revenue: 1350181, ratio: 5.2, avgPrice: 4457 },
      '予約PRO': { revenue: 37065, ratio: 0, avgPrice: 0 },
      '直予約': { revenue: 0, ratio: 0, avgPrice: 0 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 0 },
    }
  },
  {
    // 図6: 令和7年8月 ホテル新今宮
    id: 10, month: '2025年8月',
    revenue: 25631398, rooms: 108565, occupancy: 88.6, adr: 5647, revenueTarget: 23000000,
    domesticRatio: 46, overseasRatio: 54,
    channels: {
      'Booking': { revenue: 1289613, ratio: 4.3, avgPrice: 5291 },
      'AGODA': { revenue: 16571572, ratio: 56.8, avgPrice: 6413 },
      'エクスペディア': { revenue: 2714192, ratio: 9.1, avgPrice: 6588 },
      '楽天トラベル': { revenue: 1397029, ratio: 4.6, avgPrice: 8771 },
      'じゃらん': { revenue: 845425, ratio: 2.8, avgPrice: 10289 },
      '一休': { revenue: 973202, ratio: 3.1, avgPrice: 5175 },
      'Trip.com': { revenue: 935295, ratio: 3.1, avgPrice: 6587 },
      'るるぶ': { revenue: 435968, ratio: 1.4, avgPrice: 4676 },
      '予約PRO': { revenue: 126544, ratio: 4.5, avgPrice: 2450 },
      '直予約': { revenue: 1380544, ratio: 4.5, avgPrice: 4676 },
      'その他': { revenue: 174465, ratio: 0.5, avgPrice: 2480 },
    }
  },
  {
    // 図5: 令和7年9月 ホテル新今宮
    id: 11, month: '2025年9月',
    revenue: 21500143, rooms: 105193, occupancy: 88.2, adr: 5079, revenueTarget: 23220000,
    domesticRatio: 50, overseasRatio: 50,
    channels: {
      'Booking': { revenue: 19257, ratio: 2.3, avgPrice: 7314 },
      'AGODA': { revenue: 18268956, ratio: 53.3, avgPrice: 5613 },
      'エクスペディア': { revenue: 2845733, ratio: 8.3, avgPrice: 7670 },
      '楽天トラベル': { revenue: 3200531, ratio: 9.4, avgPrice: 8315 },
      'じゃらん': { revenue: 2054311, ratio: 6.4, avgPrice: 7200 },
      '一休': { revenue: 15907, ratio: 0, avgPrice: 7789 },
      'Trip.com': { revenue: 5907, ratio: 0, avgPrice: 7789 },
      'るるぶ': { revenue: 7789, ratio: 1.9, avgPrice: 12144 },
      '予約PRO': { revenue: 12144, ratio: 2.9, avgPrice: 5291 },
      '直予約': { revenue: 1455086, ratio: 4.2, avgPrice: 5291 },
      'その他': { revenue: 6291, ratio: 0, avgPrice: 0 },
    }
  },
  {
    // 図4: 令和7年10月 ホテル新今宮
    id: 12, month: '2025年10月',
    revenue: 24875518, rooms: 108541, occupancy: 95.2, adr: 5487, revenueTarget: 25800000,
    domesticRatio: 43, overseasRatio: 57,
    channels: {
      'Booking': { revenue: 2094601, ratio: 6.8, avgPrice: 5031 },
      'AGODA': { revenue: 14501186, ratio: 49.8, avgPrice: 4803 },
      'エクスペディア': { revenue: 112796, ratio: 1.0, avgPrice: 6007 },
      '楽天トラベル': { revenue: 946000, ratio: 1.8, avgPrice: 10523 },
      'じゃらん': { revenue: 0, ratio: 0, avgPrice: 0 },
      '一休': { revenue: 108215, ratio: 0.5, avgPrice: 5611 },
      'Trip.com': { revenue: 1045117, ratio: 3.4, avgPrice: 13095 },
      'るるぶ': { revenue: 0, ratio: 0, avgPrice: 0 },
      '予約PRO': { revenue: 4459126, ratio: 4.7, avgPrice: 11145 },
      '直予約': { revenue: 1459126, ratio: 4.7, avgPrice: 6112 },
      'その他': { revenue: 0, ratio: 0, avgPrice: 0 },
    }
  },
]

// 今後の改善事項データ
const DEFAULT_IMPROVEMENTS = {
  'doubutsuen': [
    'カプセル内照明の調整、外装の使用用のシミュレーション',
    '予約サイトの販促管理に関しましては、ユスフ・松永に連絡を取りながら業務展開します。',
    'メイン・カプセルの販促営業用、料金調整、外装整備、方策整備',
    '新規サイト：オーマイホテルに加盟、販売手数料12%、サイト担当者：松永・白',
  ],
  'shinimamiya': [
    '予約サイトの販促管理に関しましては、ユスフ・松永に連絡を取りながら業務展開します。',
    '国内ホテルは今後の空室の販促営業が出てきました。',
    '国内利用者6割りがあって、国内販売促進強化',
    '11月に対して、売上販促から顧位を強化する',
  ]
}

const CHANNEL_COLORS = {
  'Booking': '#003580',
  'AGODA': '#5542f6',
  'エクスペディア': '#ffcc00',
  '楽天トラベル': '#bf0000',
  'じゃらん': '#ff6600',
  '一休': '#000000',
  'Trip.com': '#287dfa',
  'るるぶ': '#e60012',
  '予約PRO': '#00a0e9',
  '直予約': '#28a745',
  'その他': '#999999',
}

const CHANNEL_NAMES = ['Booking', 'AGODA', 'エクスペディア', '楽天トラベル', 'じゃらん', '一休', 'Trip.com', 'るるぶ', '予約PRO', '直予約', 'その他']

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('ja-JP').format(value)
}

// 月份文字列を数値に変換（例：'2024年11月' → 202411）
const parseMonth = (monthStr) => {
  const match = monthStr.match(/(\d{4})年(\d{1,2})月/)
  if (!match) return 0
  return parseInt(match[1]) * 100 + parseInt(match[2])
}

// 月份表示を短縮形式に変換（例：'2024年12月' → '24/12'）
const formatMonthShort = (monthStr) => {
  const match = monthStr.match(/(\d{4})年(\d{1,2})月/)
  if (!match) return monthStr
  return `${match[1].slice(2)}/${match[2].padStart(2, '0')}`
}

// 前年同月データを取得する関数
const findYoYData = (dataArray, currentMonth) => {
  const match = currentMonth.match(/(\d{4})年(\d{1,2})月/)
  if (!match) return null
  const prevYear = parseInt(match[1]) - 1
  const monthNum = match[2]
  const targetMonth = `${prevYear}年${monthNum}月`
  return dataArray.find(d => d.month === targetMonth) || null
}

// 移動平均を計算する関数
const calcMovingAverage = (dataArray, field, windowSize) => {
  return dataArray.map((item, index) => {
    if (index < windowSize - 1) return { ...item, [`${field}_ma${windowSize}`]: null }
    let sum = 0
    for (let i = index - windowSize + 1; i <= index; i++) {
      sum += dataArray[i][field] || 0
    }
    return { ...item, [`${field}_ma${windowSize}`]: Math.round(sum / windowSize) }
  })
}

// 線形回帰で将来予測する関数
const linearRegression = (dataArray, field, predictMonths = 3) => {
  const values = dataArray.map((d, i) => ({ x: i, y: d[field] || 0 }))
  const n = values.length
  if (n < 2) return []
  const sumX = values.reduce((s, v) => s + v.x, 0)
  const sumY = values.reduce((s, v) => s + v.y, 0)
  const sumXY = values.reduce((s, v) => s + v.x * v.y, 0)
  const sumX2 = values.reduce((s, v) => s + v.x * v.x, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  const predictions = []
  const lastMonth = dataArray[dataArray.length - 1]?.month || ''
  const lastMatch = lastMonth.match(/(\d{4})年(\d{1,2})月/)
  if (!lastMatch) return []
  let year = parseInt(lastMatch[1])
  let month = parseInt(lastMatch[2])
  for (let i = 1; i <= predictMonths; i++) {
    month++
    if (month > 12) { month = 1; year++ }
    const predicted = Math.max(0, Math.round(slope * (n - 1 + i) + intercept))
    predictions.push({ month: `${year}年${month}月`, [field]: predicted, isPrediction: true })
  }
  return predictions
}

// 季節性データを生成する関数（年ごとに1-12月をグループ化）
const buildSeasonalData = (dataArray) => {
  const yearMap = {}
  dataArray.forEach(d => {
    const match = d.month.match(/(\d{4})年(\d{1,2})月/)
    if (!match) return
    const year = match[1]
    const monthNum = parseInt(match[2])
    if (!yearMap[year]) yearMap[year] = {}
    yearMap[year][monthNum] = d
  })
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  return months.map(m => {
    const row = { monthNum: m, monthLabel: `${m}月` }
    Object.keys(yearMap).forEach(year => {
      if (yearMap[year][m]) {
        row[`revenue_${year}`] = yearMap[year][m].revenue
        row[`occupancy_${year}`] = yearMap[year][m].occupancy
        row[`adr_${year}`] = yearMap[year][m].adr
      }
    })
    return row
  })
}

// CSV出力関数
const exportToCSV = (dataArray, hotelName) => {
  const headers = ['月', '売上高', '売上目標', '達成率', '販売客室数', '稼働率', 'ADR', 'RevPAR', '国内客比率', '海外客比率']
  const csvRows = [headers.join(',')]
  dataArray.forEach(d => {
    const achieve = d.revenueTarget ? ((d.revenue / d.revenueTarget) * 100).toFixed(1) + '%' : '-'
    const revpar = ((d.occupancy / 100) * d.adr).toFixed(0)
    csvRows.push([
      d.month, d.revenue, d.revenueTarget || 0, achieve, d.rooms,
      d.occupancy + '%', d.adr, revpar, d.domesticRatio + '%', d.overseasRatio + '%'
    ].join(','))
  })
  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${hotelName}_データ_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// 月次レポート生成関数
const generateMonthlyReport = (selectedData, prevData, currentData, hotelName) => {
  const yoyData = findYoYData(currentData, selectedData.month)
  const revpar = ((selectedData.occupancy / 100) * selectedData.adr).toFixed(0)
  const achieve = selectedData.revenueTarget ? ((selectedData.revenue / selectedData.revenueTarget) * 100).toFixed(1) : '-'
  let report = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  report += `  ${hotelName} 月次運営レポート\n`
  report += `  対象月: ${selectedData.month}\n`
  report += `  作成日: ${new Date().toLocaleDateString('ja-JP')}\n`
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
  report += `【主要KPI】\n`
  report += `  売上高:     ${formatCurrency(selectedData.revenue)}\n`
  report += `  売上目標:   ${selectedData.revenueTarget ? formatCurrency(selectedData.revenueTarget) : '未設定'}\n`
  report += `  達成率:     ${achieve}%\n`
  report += `  販売客室数: ${formatNumber(selectedData.rooms)}室\n`
  report += `  稼働率:     ${selectedData.occupancy}%\n`
  report += `  ADR:        ${formatCurrency(selectedData.adr)}\n`
  report += `  RevPAR:     ¥${formatNumber(parseInt(revpar))}\n\n`
  if (prevData && prevData.revenue) {
    report += `【前月比較】\n`
    report += `  売上高:  ${calcChangeStr(selectedData.revenue, prevData.revenue)}\n`
    report += `  稼働率:  ${(selectedData.occupancy - prevData.occupancy).toFixed(1)}pt\n`
    report += `  ADR:     ${calcChangeStr(selectedData.adr, prevData.adr)}\n\n`
  }
  if (yoyData) {
    report += `【前年同月比較】\n`
    report += `  売上高:  ${calcChangeStr(selectedData.revenue, yoyData.revenue)}\n`
    report += `  稼働率:  ${(selectedData.occupancy - yoyData.occupancy).toFixed(1)}pt\n`
    report += `  ADR:     ${calcChangeStr(selectedData.adr, yoyData.adr)}\n\n`
  }
  report += `【客源構成】\n`
  report += `  国内客: ${selectedData.domesticRatio}%  海外客: ${selectedData.overseasRatio}%\n\n`
  if (selectedData.channels && Object.keys(selectedData.channels).length > 0) {
    report += `【予約チャネル別売上】\n`
    Object.entries(selectedData.channels)
      .filter(([, d]) => d.revenue > 0)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .forEach(([name, d]) => {
        report += `  ${name.padEnd(12, '　')}: ${formatCurrency(d.revenue)} (${d.ratio}%)\n`
      })
  }
  report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  report += `  ©㈱グローバルリンクス\n`
  return report
}

const calcChangeStr = (current, previous) => {
  if (!previous || previous === 0) return '比較データなし'
  const pct = ((current - previous) / previous * 100).toFixed(1)
  return `${pct >= 0 ? '+' : ''}${pct}%`
}

// 骨架屏コンポーネント
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-4 md:p-5 border-l-4 border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
      <div className="h-5 w-5 bg-gray-200 rounded"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-20"></div>
  </div>
)

const SkeletonChart = ({ height = 250 }) => (
  <div className="bg-white rounded-xl shadow-md p-4 md:p-5 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
    <div className="bg-gray-100 rounded" style={{ height }}></div>
  </div>
)

// トレンド警告検出（連続下降/上昇を検出）
const detectTrendWarnings = (dataArray, field, threshold = 3) => {
  const warnings = []
  let consecutiveDown = 0
  let consecutiveUp = 0
  for (let i = 1; i < dataArray.length; i++) {
    const prev = dataArray[i - 1][field] || 0
    const curr = dataArray[i][field] || 0
    if (curr < prev) {
      consecutiveDown++
      consecutiveUp = 0
      if (consecutiveDown >= threshold) {
        warnings.push({ type: 'down', month: dataArray[i].month, field, count: consecutiveDown })
      }
    } else if (curr > prev) {
      consecutiveUp++
      consecutiveDown = 0
      if (consecutiveUp >= threshold) {
        warnings.push({ type: 'up', month: dataArray[i].month, field, count: consecutiveUp })
      }
    } else {
      consecutiveDown = 0
      consecutiveUp = 0
    }
  }
  return warnings
}

// データ異常検出（平均から大きく外れた値）
const detectAnomalies = (dataArray, field, stdMultiplier = 2) => {
  const values = dataArray.map(d => d[field] || 0).filter(v => v > 0)
  if (values.length < 3) return []
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const std = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length)
  return dataArray.filter(d => {
    const v = d[field] || 0
    return v > 0 && Math.abs(v - mean) > std * stdMultiplier
  }).map(d => ({ month: d.month, field, value: d[field], mean: Math.round(mean) }))
}

// 図表スクリーンショット機能
const captureChart = async (elementId, filename) => {
  const element = document.getElementById(elementId)
  if (!element) return
  try {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 })
    const link = document.createElement('a')
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('スクリーンショット失敗:', err)
    alert('スクリーンショット機能にはhtml2canvasが必要です')
  }
}

const KPICard = ({ title, value, unit, change, icon: Icon, color, subValue, warning, darkMode }) => {
  const isPositive = change >= 0
  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-5 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-xs md:text-sm font-medium">{title}</span>
        <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
      </div>
      <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
        {unit === '¥' ? formatCurrency(value) : `${formatNumber(value)}${unit}`}
      </div>
      {subValue && (
        <div className={`text-xs md:text-sm font-semibold mb-1 ${subValue.color || 'text-gray-500'}`}>
          {subValue.label}
        </div>
      )}
      {change !== undefined && (
        <div className={`flex items-center text-xs md:text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4 mr-1" />}
          <span>前月比 {isPositive ? '+' : ''}{change.toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}

const DataInputModal = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    month: '', revenue: '', rooms: '', occupancy: '', adr: '', revenueTarget: '',
    domesticRatio: '', overseasRatio: '', channels: {}
  })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (editData) {
      const match = editData.month.match(/(\d{4})年(\d{1,2})月/)
      if (match) {
        setSelectedYear(parseInt(match[1]))
        setSelectedMonth(parseInt(match[2]))
      }
      setFormData({
        month: editData.month,
        revenue: editData.revenue.toString(),
        rooms: editData.rooms.toString(),
        occupancy: editData.occupancy.toString(),
        adr: editData.adr.toString(),
        revenueTarget: (editData.revenueTarget || 0).toString(),
        domesticRatio: editData.domesticRatio.toString(),
        overseasRatio: editData.overseasRatio.toString(),
        channels: editData.channels || {}
      })
    } else {
      const now = new Date()
      setSelectedYear(now.getFullYear())
      setSelectedMonth(now.getMonth() + 1)
      const emptyChannels = {}
      CHANNEL_NAMES.forEach(name => {
        emptyChannels[name] = { revenue: 0, ratio: 0, avgPrice: 0 }
      })
      setFormData({
        month: `${now.getFullYear()}年${now.getMonth() + 1}月`, revenue: '', rooms: '', occupancy: '', adr: '', revenueTarget: '',
        domesticRatio: '60', overseasRatio: '40', channels: emptyChannels
      })
    }
  }, [editData, isOpen])

  const handleYearMonthChange = (year, month) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setFormData(prev => ({ ...prev, month: `${year}年${month}月` }))
  }

  const handleChannelChange = (channelName, field, value) => {
    setFormData(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channelName]: {
          ...prev.channels[channelName],
          [field]: field === 'ratio' ? parseFloat(value) || 0 : parseInt(value) || 0
        }
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    const occ = parseFloat(formData.occupancy)
    if (occ < 0 || occ > 100) errors.occupancy = '稼働率は0〜100%の範囲で入力してください'
    const dr = parseInt(formData.domesticRatio)
    const or2 = parseInt(formData.overseasRatio)
    if (dr + or2 !== 100) errors.ratio = '国内客比率と海外客比率の合計は100%にしてください'
    if (parseInt(formData.revenue) < 0) errors.revenue = '売上高は0以上で入力してください'
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    const newData = {
      id: editData?.id || Date.now(),
      month: formData.month,
      revenue: parseInt(formData.revenue),
      rooms: parseInt(formData.rooms),
      occupancy: parseFloat(formData.occupancy),
      adr: parseInt(formData.adr),
      revenueTarget: parseInt(formData.revenueTarget) || 0,
      domesticRatio: parseInt(formData.domesticRatio),
      overseasRatio: parseInt(formData.overseasRatio),
      channels: formData.channels
    }
    onSave(newData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            {editData ? 'データ編集' : '新規データ入力'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">対象月</label>
            <div className="flex gap-3">
              <select value={selectedYear}
                onChange={(e) => handleYearMonthChange(parseInt(e.target.value), selectedMonth)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
              <select value={selectedMonth}
                onChange={(e) => handleYearMonthChange(selectedYear, parseInt(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">売上高 (円)</label>
              <input type="number" value={formData.revenue}
                onChange={(e) => { setFormData({...formData, revenue: e.target.value}); setFormErrors(prev => ({...prev, revenue: undefined})) }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.revenue ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} required />
              {formErrors.revenue && <p className="text-red-500 text-xs mt-1">{formErrors.revenue}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">売上目標 (円)</label>
              <input type="number" value={formData.revenueTarget}
                onChange={(e) => setFormData({...formData, revenueTarget: e.target.value})}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">販売客室数</label>
              <input type="number" value={formData.rooms}
                onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ADR (円)</label>
              <input type="number" value={formData.adr}
                onChange={(e) => setFormData({...formData, adr: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">稼働率 (%)</label>
              <input type="number" step="0.1" value={formData.occupancy}
                onChange={(e) => { setFormData({...formData, occupancy: e.target.value}); setFormErrors(prev => ({...prev, occupancy: undefined})) }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.occupancy ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} required />
              {formErrors.occupancy && <p className="text-red-500 text-xs mt-1">{formErrors.occupancy}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">国内客比率 (%)</label>
              <input type="number" value={formData.domesticRatio}
                onChange={(e) => { setFormData({...formData, domesticRatio: e.target.value, overseasRatio: (100 - parseInt(e.target.value || 0)).toString()}); setFormErrors(prev => ({...prev, ratio: undefined})) }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.ratio ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">海外客比率 (%)</label>
              <input type="number" value={formData.overseasRatio}
                onChange={(e) => { setFormData({...formData, overseasRatio: e.target.value, domesticRatio: (100 - parseInt(e.target.value || 0)).toString()}); setFormErrors(prev => ({...prev, ratio: undefined})) }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.ratio ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} required />
              {formErrors.ratio && <p className="text-red-500 text-xs mt-1">{formErrors.ratio}</p>}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3">予約チャネル別データ</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {CHANNEL_NAMES.map(channelName => (
                <div key={channelName} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="md:col-span-1 flex items-center">
                    <span className="font-medium text-sm" style={{ color: CHANNEL_COLORS[channelName] }}>{channelName}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">売上 (円)</label>
                    <input type="number" value={formData.channels[channelName]?.revenue || ''}
                      onChange={(e) => handleChannelChange(channelName, 'revenue', e.target.value)}
                      placeholder="0" className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">比率 (%)</label>
                    <input type="number" step="0.1" value={formData.channels[channelName]?.ratio || ''}
                      onChange={(e) => handleChannelChange(channelName, 'ratio', e.target.value)}
                      placeholder="0" className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">平均単価 (円)</label>
                    <input type="number" value={formData.channels[channelName]?.avgPrice || ''}
                      onChange={(e) => handleChannelChange(channelName, 'avgPrice', e.target.value)}
                      placeholder="0" className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              キャンセル
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> 保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [currentHotel, setCurrentHotel] = useState('doubutsuen')
  const [data, setData] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [showHotelMenu, setShowHotelMenu] = useState(false)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(-1)
  const [improvements, setImprovements] = useState({})
  const [editingImprovements, setEditingImprovements] = useState(false)
  const [improvementText, setImprovementText] = useState('')
  const [showAllData, setShowAllData] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dataInitialized, setDataInitialized] = useState(false)
  // 新機能用state
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' })
  const [filterMetric, setFilterMetric] = useState('all')
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)
  const [chartZoom, setChartZoom] = useState({ start: 0, end: 100 })
  const inactivityTimerRef = useRef(null)
  const hotelMenuRef = useRef(null)
  const mainRef = useRef(null)
  const SESSION_TIMEOUT = 30 * 60 * 1000 // 30分間

  // ログアウト処理
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false)
    setPasswordInput('')
    setData({})
    setImprovements({})
    sessionStorage.removeItem('hotelDashboardAuth')
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
  }, [])

  // 無操作タイマーリセット
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      handleLogout()
      alert('セキュリティのため、30分間操作がなかったため自動ログアウトしました。')
    }, SESSION_TIMEOUT)
  }, [handleLogout, SESSION_TIMEOUT])

  // 無操作検知イベントリスナー
  useEffect(() => {
    if (!isAuthenticated) return
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    const handleActivity = () => resetInactivityTimer()
    events.forEach(event => window.addEventListener(event, handleActivity))
    resetInactivityTimer()
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity))
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
    }
  }, [isAuthenticated, resetInactivityTimer])

  // ホテルメニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hotelMenuRef.current && !hotelMenuRef.current.contains(e.target)) {
        setShowHotelMenu(false)
      }
    }
    if (showHotelMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showHotelMenu])

  // パスワード認証チェック
  useEffect(() => {
    const auth = sessionStorage.getItem('hotelDashboardAuth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  // ダークモード切替
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isAuthenticated) return
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      // Ctrl/Cmd + キー
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'e': e.preventDefault(); exportToCSV(currentData, HOTELS[currentHotel]); break
          case 'r': e.preventDefault(); handleRefresh(); break
          case 'd': e.preventDefault(); setDarkMode(!darkMode); break
          case 'f': e.preventDefault(); setShowFilter(!showFilter); break
          case '/': e.preventDefault(); setShowKeyboardHelp(!showKeyboardHelp); break
        }
      }
      // 単独キー
      switch (e.key) {
        case 'ArrowLeft':
          if (selectedMonthIndex > 0) setSelectedMonthIndex(selectedMonthIndex - 1)
          break
        case 'ArrowRight':
          if (selectedMonthIndex < currentData.length - 1) setSelectedMonthIndex(selectedMonthIndex + 1)
          break
        case '1': setCurrentHotel('doubutsuen'); break
        case '2': setCurrentHotel('shinimamiya'); break
        case 'Escape': setShowKeyboardHelp(false); setShowFilter(false); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthenticated, currentHotel, selectedMonthIndex, darkMode, showFilter, showKeyboardHelp])

  // 横画面検出
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // タッチジェスチャー（スワイプで月切替）
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }
  const handleTouchEnd = (e) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    if (Math.abs(diff) > 50) {
      if (diff > 0 && selectedMonthIndex < currentData.length - 1) {
        setSelectedMonthIndex(selectedMonthIndex + 1)
      } else if (diff < 0 && selectedMonthIndex > 0) {
        setSelectedMonthIndex(selectedMonthIndex - 1)
      }
    }
    setTouchStart(null)
  }

  // データ更新
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadDataFromSupabase()
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (passwordInput === 'hotel2026') {
      setIsAuthenticated(true)
      setPasswordError(false)
      sessionStorage.setItem('hotelDashboardAuth', 'authenticated')
    } else {
      setPasswordError(true)
    }
  }

  // Supabaseからデータを読み込む関数
  const loadDataFromSupabase = async () => {
    setLoading(true)
    try {
      // ホテルデータ読み込み
      const { data: rows, error } = await supabase
        .from('hotel_data')
        .select('*')
        .order('month', { ascending: true })

      if (error) throw error

      if (rows && rows.length > 0) {
        // Supabaseのデータをアプリ形式に変換
        const grouped = {}
        rows.forEach(row => {
          if (!grouped[row.hotel_key]) grouped[row.hotel_key] = []
          grouped[row.hotel_key].push({
            id: row.id,
            month: row.month,
            revenue: Number(row.revenue),
            revenueTarget: Number(row.revenue_target),
            rooms: row.rooms,
            occupancy: Number(row.occupancy),
            adr: row.adr,
            domesticRatio: row.domestic_ratio,
            overseasRatio: row.overseas_ratio,
            channels: row.channels || {}
          })
        })

        // 初期データに存在するがSupabaseに無いレコードを補充挿入
        const initialAll = { doubutsuen: initialDataDoubutsuen, shinimamiya: initialDataShinimamiya }
        const missingRows = []
        for (const [hotelKey, items] of Object.entries(initialAll)) {
          const existingMonths = new Set((grouped[hotelKey] || []).map(d => d.month))
          for (const item of items) {
            if (!existingMonths.has(item.month)) {
              missingRows.push({
                hotel_key: hotelKey,
                month: item.month,
                revenue: item.revenue,
                revenue_target: item.revenueTarget || 0,
                rooms: item.rooms,
                occupancy: item.occupancy,
                adr: item.adr,
                domestic_ratio: item.domesticRatio,
                overseas_ratio: item.overseasRatio,
                channels: item.channels || {}
              })
              if (!grouped[hotelKey]) grouped[hotelKey] = []
              grouped[hotelKey].push({
                id: item.id,
                month: item.month,
                revenue: item.revenue,
                revenueTarget: item.revenueTarget || 0,
                rooms: item.rooms,
                occupancy: item.occupancy,
                adr: item.adr,
                domesticRatio: item.domesticRatio,
                overseasRatio: item.overseasRatio,
                channels: item.channels || {}
              })
            }
          }
        }
        if (missingRows.length > 0) {
          const { error: upsertErr } = await supabase.from('hotel_data').upsert(missingRows, { onConflict: 'hotel_key,month' })
          if (upsertErr) console.error('補充データ挿入エラー:', upsertErr)
        }

        Object.keys(grouped).forEach(key => {
          grouped[key].sort((a, b) => parseMonth(a.month) - parseMonth(b.month))
        })
        setData(grouped)
        setDataInitialized(true)
        setLastUpdated(new Date())
      } else {
        // Supabaseにデータがない場合、初期データを投入
        await seedInitialData()
      }

      // 改善事項読み込み
      const { data: impRows, error: impError } = await supabase
        .from('hotel_improvements')
        .select('*')

      if (impError) throw impError

      if (impRows && impRows.length > 0) {
        const impData = {}
        impRows.forEach(row => {
          impData[row.hotel_key] = row.items || []
        })
        setImprovements(impData)
      } else {
        // 改善事項の初期データを投入
        for (const [key, items] of Object.entries(DEFAULT_IMPROVEMENTS)) {
          await supabase.from('hotel_improvements').upsert({
            hotel_key: key,
            items: items,
            updated_at: new Date().toISOString()
          }, { onConflict: 'hotel_key' })
        }
        setImprovements(DEFAULT_IMPROVEMENTS)
      }
    } catch (err) {
      console.error('Supabaseデータ読み込みエラー:', err)
      // フォールバック：localStorageから読み込み
      const savedData = localStorage.getItem('hotelDashboardData_v7')
      if (savedData) {
        const parsed = JSON.parse(savedData)
        Object.keys(parsed).forEach(key => {
          parsed[key].sort((a, b) => parseMonth(a.month) - parseMonth(b.month))
        })
        setData(parsed)
      } else {
        const initialData = {
          doubutsuen: [...initialDataDoubutsuen].sort((a, b) => parseMonth(a.month) - parseMonth(b.month)),
          shinimamiya: [...initialDataShinimamiya].sort((a, b) => parseMonth(a.month) - parseMonth(b.month))
        }
        setData(initialData)
      }
      const savedImp = localStorage.getItem('hotelImprovements_v6')
      if (savedImp) setImprovements(JSON.parse(savedImp))
      else setImprovements(DEFAULT_IMPROVEMENTS)
    } finally {
      setLoading(false)
    }
  }

  // 初期データをSupabaseに投入する関数
  const seedInitialData = async () => {
    const allData = {
      doubutsuen: [...initialDataDoubutsuen],
      shinimamiya: [...initialDataShinimamiya]
    }
    const rows = []
    for (const [hotelKey, items] of Object.entries(allData)) {
      for (const item of items) {
        rows.push({
          hotel_key: hotelKey,
          month: item.month,
          revenue: item.revenue,
          revenue_target: item.revenueTarget || 0,
          rooms: item.rooms,
          occupancy: item.occupancy,
          adr: item.adr,
          domestic_ratio: item.domesticRatio,
          overseas_ratio: item.overseasRatio,
          channels: item.channels || {}
        })
      }
    }
    const { error } = await supabase.from('hotel_data').upsert(rows, { onConflict: 'hotel_key,month' })
    if (error) throw error

    // 投入後に再読み込み
    const { data: newRows, error: readError } = await supabase
      .from('hotel_data')
      .select('*')
      .order('month', { ascending: true })
    if (readError) throw readError

    const grouped = {}
    newRows.forEach(row => {
      if (!grouped[row.hotel_key]) grouped[row.hotel_key] = []
      grouped[row.hotel_key].push({
        id: row.id,
        month: row.month,
        revenue: Number(row.revenue),
        revenueTarget: Number(row.revenue_target),
        rooms: row.rooms,
        occupancy: Number(row.occupancy),
        adr: row.adr,
        domesticRatio: row.domestic_ratio,
        overseasRatio: row.overseas_ratio,
        channels: row.channels || {}
      })
    })
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => parseMonth(a.month) - parseMonth(b.month))
    })
    setData(grouped)
    setDataInitialized(true)
    setLastUpdated(new Date())
  }

  useEffect(() => {
    if (!isAuthenticated) return
    loadDataFromSupabase()
  }, [isAuthenticated])

  const rawCurrentData = data[currentHotel] || []
  
  // データフィルタリング
  const currentData = useMemo(() => {
    let filtered = [...rawCurrentData]
    if (filterDateRange.start) {
      filtered = filtered.filter(d => parseMonth(d.month) >= parseMonth(filterDateRange.start))
    }
    if (filterDateRange.end) {
      filtered = filtered.filter(d => parseMonth(d.month) <= parseMonth(filterDateRange.end))
    }
    return filtered
  }, [rawCurrentData, filterDateRange])

  // トレンド警告検出
  const trendWarnings = useMemo(() => {
    const warnings = []
    warnings.push(...detectTrendWarnings(currentData, 'revenue', 3))
    warnings.push(...detectTrendWarnings(currentData, 'occupancy', 3))
    warnings.push(...detectTrendWarnings(currentData, 'adr', 3))
    return warnings
  }, [currentData])

  // データ異常検出
  const anomalies = useMemo(() => {
    const anoms = []
    anoms.push(...detectAnomalies(currentData, 'revenue', 2))
    anoms.push(...detectAnomalies(currentData, 'occupancy', 2))
    anoms.push(...detectAnomalies(currentData, 'adr', 2))
    return anoms
  }, [currentData])

  // ホテル切換時にselectedMonthIndexをリセット（バグ修正：currentHotelのみ依存）
  useEffect(() => {
    const hotelData = data[currentHotel] || []
    if (hotelData.length > 0) {
      setSelectedMonthIndex(hotelData.length - 1)
    } else {
      setSelectedMonthIndex(0)
    }
  }, [currentHotel, data])

  const handleSwitchHotel = useCallback((key) => {
    setCurrentHotel(key)
    setShowHotelMenu(false)
  }, [])

  const saveData = async (newData) => {
    try {
      // Supabaseにupsert
      const row = {
        hotel_key: currentHotel,
        month: newData.month,
        revenue: newData.revenue,
        revenue_target: newData.revenueTarget || 0,
        rooms: newData.rooms,
        occupancy: newData.occupancy,
        adr: newData.adr,
        domestic_ratio: newData.domesticRatio,
        overseas_ratio: newData.overseasRatio,
        channels: newData.channels || {},
        updated_at: new Date().toISOString()
      }
      // 既存データの場合はidを含める
      const existingItem = currentData.find(d => d.id === newData.id)
      if (existingItem) {
        row.id = newData.id
      }
      const { data: upserted, error } = await supabase
        .from('hotel_data')
        .upsert(row, { onConflict: 'hotel_key,month' })
        .select()
      if (error) throw error

      // 再読み込みで最新データを取得
      await loadDataFromSupabase()
    } catch (err) {
      console.error('データ保存エラー:', err)
      // フォールバック：ローカルに保存
      const existingIndex = currentData.findIndex(d => d.id === newData.id)
      let updatedData
      if (existingIndex >= 0) {
        updatedData = [...currentData]
        updatedData[existingIndex] = newData
      } else {
        updatedData = [...currentData, newData]
      }
      updatedData.sort((a, b) => parseMonth(a.month) - parseMonth(b.month))
      const newAllData = { ...data, [currentHotel]: updatedData }
      setData(newAllData)
      localStorage.setItem('hotelDashboardData_v7', JSON.stringify(newAllData))
    }
  }

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [deletePasswordError, setDeletePasswordError] = useState(false)

  const handleDeleteRequest = (id) => {
    setDeleteTarget(id)
    setDeletePassword('')
    setDeletePasswordError(false)
  }

  const handleDeleteConfirm = async () => {
    if (deletePassword !== 'hotel2026') {
      setDeletePasswordError(true)
      return
    }
    try {
      const { error } = await supabase.from('hotel_data').delete().eq('id', deleteTarget)
      if (error) throw error
      await loadDataFromSupabase()
    } catch (err) {
      console.error('データ削除エラー:', err)
      const updatedData = currentData.filter(d => d.id !== deleteTarget)
      const newAllData = { ...data, [currentHotel]: updatedData }
      setData(newAllData)
    }
    setDeleteTarget(null)
    setDeletePassword('')
    setDeletePasswordError(false)
  }

  const handleDeleteCancel = () => {
    setDeleteTarget(null)
    setDeletePassword('')
    setDeletePasswordError(false)
  }

  const safeIndex = selectedMonthIndex >= 0 && selectedMonthIndex < currentData.length ? selectedMonthIndex : currentData.length - 1
  const selectedData = currentData[safeIndex] || {}
  const prevMonthIndex = safeIndex > 0 ? safeIndex - 1 : -1
  const prevData = prevMonthIndex >= 0 ? currentData[prevMonthIndex] : {}

  const calcChange = (current, previous) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const channelData = selectedData.channels ? Object.entries(selectedData.channels)
    .map(([name, d]) => ({
      name, revenue: d.revenue || 0, ratio: d.ratio || 0, avgPrice: d.avgPrice || 0,
      fill: CHANNEL_COLORS[name] || '#888'
    }))
    .filter(item => item.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue) : []

  const guestData = [
    { name: '国内客', value: selectedData.domesticRatio || 0, fill: '#1a3a52' },
    { name: '海外客', value: selectedData.overseasRatio || 0, fill: '#fd7e14' },
  ]

  const currentImprovements = improvements[currentHotel] || []

  const startEditImprovements = () => {
    setImprovementText(currentImprovements.join('\n'))
    setEditingImprovements(true)
  }

  const saveImprovements = async () => {
    const newItems = improvementText.split('\n').filter(line => line.trim() !== '')
    const newImprovements = { ...improvements, [currentHotel]: newItems }
    setImprovements(newImprovements)
    setEditingImprovements(false)
    try {
      const { error } = await supabase.from('hotel_improvements').upsert({
        hotel_key: currentHotel,
        items: newItems,
        updated_at: new Date().toISOString()
      }, { onConflict: 'hotel_key' })
      if (error) throw error
    } catch (err) {
      console.error('改善事項保存エラー:', err)
      localStorage.setItem('hotelImprovements_v6', JSON.stringify(newImprovements))
    }
  }

  // パスワード認証画面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a3a52] to-[#2d5a7b] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <img src="/logo.png" alt="㈱グローバルリンクス" className="w-20 h-20 mx-auto mb-3 object-contain" />
            <p className="text-sm font-semibold text-gray-600 mb-2">㈱グローバルリンクス</p>
            <h1 className="text-xl font-bold text-gray-800">ホテル業績ダッシュボード</h1>
            <p className="text-sm text-gray-500 mt-1">アクセスにはパスワードが必要です</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false) }}
                placeholder="パスワードを入力"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg ${passwordError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2 text-center">パスワードが正しくありません</p>
              )}
            </div>
            <button type="submit"
              className="w-full py-3 bg-[#1a3a52] text-white rounded-lg hover:bg-[#2d5a7b] transition font-medium">
              ログイン
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-6">©㈱グローバルリンクス社内専用2026</p>
        </div>
      </div>
    )
  }

  if (loading || !currentData.length) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 md:p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-xl mb-6 animate-pulse`}></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <SkeletonChart height={280} />
            <SkeletonChart height={280} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={mainRef}
    >
      <header className="bg-gradient-to-r from-[#1a3a52] to-[#2d5a7b] text-white py-3 md:py-4 px-4 md:px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2 md:mb-0">
            <div className="flex items-center gap-2 md:gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-full bg-white/10 p-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base md:text-xl font-bold">ホテル業績ダッシュボード</h1>
                </div>
                <p className="text-xs text-blue-200 hidden md:block">㈱グローバルリンクス ｜ 月次経営会議データ分析</p>
                <p className="text-xs text-blue-200 md:hidden">㈱グローバルリンクス</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative" ref={hotelMenuRef}>
                <button onClick={() => setShowHotelMenu(!showHotelMenu)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm md:text-base">
                  <span className="hidden md:inline">{HOTELS[currentHotel]}</span>
                  <span className="md:hidden">{HOTELS[currentHotel].replace('ホテル', '')}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showHotelMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    {Object.entries(HOTELS).map(([key, name]) => (
                      <button key={key} onClick={() => handleSwitchHotel(key)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                          currentHotel === key ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                        }`}>{name}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1 px-2 md:px-3 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition text-xs md:text-sm"
                title="ログアウト">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">ログアウト</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-3">
            <button onClick={() => { setEditData(null); setIsModalOpen(true) }}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-xs md:text-sm">
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">データ追加</span><span className="md:hidden">追加</span>
            </button>
            <button onClick={() => exportToCSV(currentData, HOTELS[currentHotel])}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-xs md:text-sm">
              <Download className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">CSV出力</span><span className="md:hidden">CSV</span>
            </button>
            <button onClick={() => {
              const report = generateMonthlyReport(selectedData, prevData, currentData, HOTELS[currentHotel])
              const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${HOTELS[currentHotel]}_月次レポート_${selectedData.month}.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-xs md:text-sm">
              <FileText className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">月次レポート</span><span className="md:hidden">レポート</span>
            </button>
            <button onClick={() => setShowComparison(!showComparison)}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition text-xs md:text-sm ${showComparison ? 'bg-white/40 font-semibold' : 'bg-white/20 hover:bg-white/30'}`}>
              <ArrowLeftRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">ホテル比較</span><span className="md:hidden">比較</span>
            </button>
            <div className="hidden md:flex items-center gap-2 ml-2 border-l border-white/30 pl-2">
              <button onClick={handleRefresh} disabled={isRefreshing}
                className={`flex items-center gap-1 px-2 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition text-xs ${isRefreshing ? 'opacity-50' : ''}`}
                title="データ更新 (Ctrl+R)">
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition text-xs ${showFilter ? 'bg-white/40' : 'bg-white/20 hover:bg-white/30'}`}
                title="フィルター (Ctrl+F)">
                <Filter className="w-3 h-3" />
              </button>
              <button onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-1 px-2 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition text-xs"
                title="ダークモード (Ctrl+D)">
                {darkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              </button>
              <button onClick={() => setShowKeyboardHelp(true)}
                className="flex items-center gap-1 px-2 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition text-xs"
                title="ショートカット (Ctrl+/)">
                <Keyboard className="w-3 h-3" />
              </button>
            </div>
            {lastUpdated && (
              <span className="hidden lg:inline text-xs text-blue-200 ml-3">
                最終更新: {lastUpdated.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          {/* モバイル用追加ボタン */}
          <div className="flex md:hidden items-center gap-2 mt-2">
            <button onClick={handleRefresh} disabled={isRefreshing}
              className={`p-2 bg-white/20 rounded-lg ${isRefreshing ? 'opacity-50' : ''}`}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setShowFilter(!showFilter)}
              className={`p-2 rounded-lg ${showFilter ? 'bg-white/40' : 'bg-white/20'}`}>
              <Filter className="w-4 h-4" />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-white/20 rounded-lg">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* フィルターパネル */}
      {showFilter && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm px-4 py-3`}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>期間:</span>
              <select value={filterDateRange.start} onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
                className={`px-2 py-1 text-sm border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <option value="">開始月</option>
                {rawCurrentData.map(d => <option key={d.month} value={d.month}>{d.month}</option>)}
              </select>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>〜</span>
              <select value={filterDateRange.end} onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
                className={`px-2 py-1 text-sm border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <option value="">終了月</option>
                {rawCurrentData.map(d => <option key={d.month} value={d.month}>{d.month}</option>)}
              </select>
            </div>
            <button onClick={() => setFilterDateRange({ start: '', end: '' })}
              className={`px-3 py-1 text-sm rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              リセット
            </button>
            {(filterDateRange.start || filterDateRange.end) && (
              <span className="text-sm text-blue-500">フィルター適用中: {currentData.length}件</span>
            )}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        <div className="mb-4 md:mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-600">対象月:</span>
          <select
            value={safeIndex}
            onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm md:text-base font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currentData.map((item, index) => (
              <option key={index} value={index}>{item.month}</option>
            ))}
          </select>
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-6">
          <KPICard title="売上高" value={selectedData.revenue || 0} unit="¥"
            change={calcChange(selectedData.revenue, prevData.revenue)} icon={DollarSign} color="#1a3a52" />
          <KPICard title="売上目標" value={selectedData.revenueTarget || 0} unit="¥"
            change={selectedData.revenueTarget ? calcChange(selectedData.revenue, selectedData.revenueTarget) : 0} icon={Target} color="#e74c3c"
            subValue={selectedData.revenueTarget ? {
              label: `達成率: ${((selectedData.revenue / selectedData.revenueTarget) * 100).toFixed(1)}%`,
              color: (selectedData.revenue / selectedData.revenueTarget) >= 1 ? 'text-green-600' : 'text-red-500'
            } : null} />
          <KPICard title="販売客室数" value={selectedData.rooms || 0} unit="室"
            change={calcChange(selectedData.rooms, prevData.rooms)} icon={Building2} color="#2d5a7b" />
          <KPICard title="稼働率" value={selectedData.occupancy || 0} unit="%"
            change={selectedData.occupancy - (prevData.occupancy || 0)} icon={Percent} color="#4a90a4" />
          <KPICard title="ADR" value={selectedData.adr || 0} unit="¥"
            change={calcChange(selectedData.adr, prevData.adr)} icon={BarChart3} color="#fd7e14" />
          <KPICard title="RevPAR" value={Math.round((selectedData.occupancy || 0) / 100 * (selectedData.adr || 0))} unit="¥"
            change={calcChange(
              Math.round((selectedData.occupancy || 0) / 100 * (selectedData.adr || 0)),
              prevData.occupancy ? Math.round(prevData.occupancy / 100 * (prevData.adr || 0)) : 0
            )} icon={Activity} color="#8b5cf6" />
        </section>

        {/* 前年同月比較 */}
        {(() => {
          const yoyData = findYoYData(currentData, selectedData.month)
          if (!yoyData) return null
          return (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-md p-4 md:p-5 border border-purple-100 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                前年同月比較 ({selectedData.month} vs {yoyData.month})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: '売上高', current: selectedData.revenue, prev: yoyData.revenue, fmt: formatCurrency },
                  { label: '稼働率', current: selectedData.occupancy, prev: yoyData.occupancy, fmt: (v) => `${v}%`, isDiff: true },
                  { label: 'ADR', current: selectedData.adr, prev: yoyData.adr, fmt: formatCurrency },
                  { label: 'RevPAR', current: Math.round((selectedData.occupancy/100)*selectedData.adr), prev: Math.round((yoyData.occupancy/100)*yoyData.adr), fmt: formatCurrency },
                ].map(({ label, current, prev, fmt, isDiff }) => {
                  const change = isDiff ? (current - prev) : (prev ? ((current - prev) / prev * 100) : 0)
                  const isUp = change >= 0
                  return (
                    <div key={label} className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">{label}</div>
                      <div className="text-sm font-bold text-gray-800">{fmt(current)}</div>
                      <div className={`text-xs font-semibold mt-1 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                        {isUp ? '▲' : '▼'} {isDiff ? `${change.toFixed(1)}pt` : `${Math.abs(change).toFixed(1)}%`}
                      </div>
                      <div className="text-xs text-gray-400">{fmt(prev)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* 年度目標達成進捗 */}
        {(() => {
          const currentYear = selectedData.month?.match(/(\d{4})年/)?.[1]
          if (!currentYear) return null
          const yearData = currentData.filter(d => d.month.startsWith(currentYear + '年'))
          const yearRevenue = yearData.reduce((s, d) => s + (d.revenue || 0), 0)
          const yearTarget = yearData.reduce((s, d) => s + (d.revenueTarget || 0), 0)
          if (!yearTarget) return null
          const progress = Math.min((yearRevenue / yearTarget) * 100, 150)
          const monthCount = yearData.length
          return (
            <div className="bg-white rounded-xl shadow-md p-4 md:p-5 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                {currentYear}年度 目標達成進捗（{monthCount}ヶ月分）
              </h3>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div className={`h-6 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500 ${progress >= 100 ? 'bg-green-500' : progress >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}>
                      {progress.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>実績: {formatCurrency(yearRevenue)}</span>
                <span>目標: {formatCurrency(yearTarget)}</span>
                <span>差額: <span className={yearRevenue >= yearTarget ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{formatCurrency(yearRevenue - yearTarget)}</span></span>
              </div>
            </div>
          )
        })()}

        {/* 売上推移 + 移動平均 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <div id="chart-revenue" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 md:p-5 relative`}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>月次売上推移（移動平均付き）</h3>
              <button onClick={() => captureChart('chart-revenue', '売上推移')} 
                className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`} title="スクリーンショット">
                <Camera className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={calcMovingAverage(currentData, 'revenue', 3)}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e0e0e0'} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#666' }} tickFormatter={formatMonthShort} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#666' }} tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#666' }} unit="%" />
                <Tooltip formatter={(value, name) => {
                  if (name === '売上高' || name === '売上目標' || name === '3ヶ月MA') return formatCurrency(value)
                  return `${value}%`
                }} contentStyle={darkMode ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' } : {}} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="revenue" name="売上高" fill="#1a3a52" radius={[4, 4, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="revenueTarget" name="売上目標" stroke="#e74c3c" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: '#e74c3c' }} connectNulls={false} />
                <Line yAxisId="left" type="monotone" dataKey="revenue_ma3" name="3ヶ月MA" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 2" dot={false} connectNulls={false} />
                <Line yAxisId="right" type="monotone" dataKey="occupancy" name="稼働率" stroke="#fd7e14" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
                {currentData.length > 6 && <Brush dataKey="month" height={20} stroke="#1a3a52" tickFormatter={formatMonthShort} />}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div id="chart-occupancy" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 md:p-5 relative`}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>稼働率・ADR推移</h3>
              <button onClick={() => captureChart('chart-occupancy', '稼働率ADR')} 
                className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`} title="スクリーンショット">
                <Camera className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={(() => {
                let d = calcMovingAverage(currentData, 'adr', 3)
                d = calcMovingAverage(d, 'occupancy', 3)
                return d
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={formatMonthShort} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `¥${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value, name) => name.includes('ADR') ? formatCurrency(value) : `${value}%`} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line yAxisId="left" type="monotone" dataKey="occupancy" name="稼働率" stroke="#1a3a52" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="left" type="monotone" dataKey="occupancy_ma3" name="稼働率MA" stroke="#1a3a52" strokeWidth={1.5} strokeDasharray="4 2" dot={false} connectNulls={false} />
                <Line yAxisId="right" type="monotone" dataKey="adr" name="ADR" stroke="#fd7e14" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="adr_ma3" name="ADR MA" stroke="#fd7e14" strokeWidth={1.5} strokeDasharray="4 2" dot={false} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-5">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">客源構成 ({selectedData.month})</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={guestData} cx="50%" cy="55%" innerRadius={50} outerRadius={80}
                  paddingAngle={5} dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`} labelStyle={{ fontSize: '12px' }}>
                  {guestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <text x="50%" y="51%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold" fill="#374151">
                  {Math.max(selectedData.domesticRatio || 0, selectedData.overseasRatio || 0)}%
                </text>
                <text x="50%" y="61%" textAnchor="middle" dominantBaseline="middle" className="text-xs" fill="#6b7280">
                  {(selectedData.domesticRatio || 0) >= (selectedData.overseasRatio || 0) ? '国内客' : '海外客'}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-5 lg:col-span-2">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">予約チャネル別売上 ({selectedData.month})</h3>
            <ResponsiveContainer width="100%" height={Math.max(180, channelData.length * 30 + 40)}>
              <BarChart data={channelData} layout="vertical" margin={{ right: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" name="売上" radius={[0, 4, 4, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="ratio" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 10, fill: '#555' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 季節性トレンド図（年度別1-12月比較） */}
        {(() => {
          const seasonalData = buildSeasonalData(currentData)
          const years = [...new Set(currentData.map(d => d.month.match(/(\d{4})年/)?.[1]).filter(Boolean))].sort()
          const yearColors = { [years[0]]: '#94a3b8', [years[1]]: '#1a3a52', [years[2]]: '#fd7e14' }
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  季節性トレンド（売上高）
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    {years.map(year => (
                      <Line key={year} type="monotone" dataKey={`revenue_${year}`} name={`${year}年`}
                        stroke={yearColors[year] || '#888'} strokeWidth={year === years[years.length - 1] ? 3 : 1.5}
                        dot={{ r: year === years[years.length - 1] ? 4 : 2 }} connectNulls={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  季節性トレンド（稼働率）
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    {years.map(year => (
                      <Line key={year} type="monotone" dataKey={`occupancy_${year}`} name={`${year}年`}
                        stroke={yearColors[year] || '#888'} strokeWidth={year === years[years.length - 1] ? 3 : 1.5}
                        dot={{ r: year === years[years.length - 1] ? 4 : 2 }} connectNulls={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        })()}

        {/* 国内客/海外客トレンド + ADRトレンド */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-5">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              国内客/海外客比率推移
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={formatMonthShort} />
                <YAxis tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="domesticRatio" name="国内客" stackId="1" fill="#1a3a52" stroke="#1a3a52" fillOpacity={0.6} />
                <Area type="monotone" dataKey="overseasRatio" name="海外客" stackId="1" fill="#fd7e14" stroke="#fd7e14" fillOpacity={0.6} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-5">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
              ADRトレンド分析
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={(() => {
                const withMA = calcMovingAverage(currentData, 'adr', 3)
                const predictions = linearRegression(currentData, 'adr', 3)
                return [...withMA, ...predictions]
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={formatMonthShort} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `¥${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="adr" name="ADR" fill="#fd7e14" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
                <Line type="monotone" dataKey="adr_ma3" name="3ヶ月MA" stroke="#e74c3c" strokeWidth={2} strokeDasharray="4 2" dot={false} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ホテル比較ビュー */}
        {showComparison && (() => {
          const otherKey = currentHotel === 'doubutsuen' ? 'shinimamiya' : 'doubutsuen'
          const otherData = data[otherKey] || []
          if (otherData.length === 0) return null
          const currentLatest = currentData[currentData.length - 1] || {}
          const otherLatest = otherData[otherData.length - 1] || {}
          const compMetrics = [
            { label: '最新月売上高', a: currentLatest.revenue, b: otherLatest.revenue, fmt: formatCurrency },
            { label: '稼働率', a: currentLatest.occupancy, b: otherLatest.occupancy, fmt: (v) => `${v}%` },
            { label: 'ADR', a: currentLatest.adr, b: otherLatest.adr, fmt: formatCurrency },
            { label: 'RevPAR', a: Math.round((currentLatest.occupancy||0)/100*(currentLatest.adr||0)), b: Math.round((otherLatest.occupancy||0)/100*(otherLatest.adr||0)), fmt: formatCurrency },
            { label: '販売客室数', a: currentLatest.rooms, b: otherLatest.rooms, fmt: (v) => `${formatNumber(v)}室` },
            { label: '海外客比率', a: currentLatest.overseasRatio, b: otherLatest.overseasRatio, fmt: (v) => `${v}%` },
          ]
          const compChartData = []
          const maxLen = Math.max(currentData.length, otherData.length)
          for (let i = Math.max(0, maxLen - 12); i < maxLen; i++) {
            const cd = currentData[i]
            const od = otherData[i]
            if (cd || od) {
              compChartData.push({
                month: (cd || od).month,
                [`${HOTELS[currentHotel]}`]: cd?.revenue || 0,
                [`${HOTELS[otherKey]}`]: od?.revenue || 0,
              })
            }
          }
          return (
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl shadow-md p-4 md:p-6 border border-green-200 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                ホテル比較: {HOTELS[currentHotel]} vs {HOTELS[otherKey]}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {compMetrics.map(({ label, a, b, fmt }) => (
                  <div key={label} className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-2">{label}</div>
                    <div className="text-xs font-bold text-[#1a3a52]">{fmt(a)}</div>
                    <div className="text-xs text-gray-400 my-1">vs</div>
                    <div className="text-xs font-bold text-[#fd7e14]">{fmt(b)}</div>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={compChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={formatMonthShort} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey={HOTELS[currentHotel]} fill="#1a3a52" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={HOTELS[otherKey]} fill="#fd7e14" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        })()}

        <div className="bg-white rounded-xl shadow-md p-4 md:p-5 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-gray-800">月次データ一覧</h3>
            {currentData.length > 3 && (
              <button onClick={() => setShowAllData(!showAllData)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                {showAllData ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showAllData ? '折りたたむ' : `全${currentData.length}件を表示`}
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-600">月</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-gray-600">売上高</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-gray-600 hidden md:table-cell">売上目標</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-gray-600 hidden md:table-cell">達成率</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-gray-600 hidden md:table-cell">客室数</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-gray-600">稼働率</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-gray-600 hidden md:table-cell">ADR</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {[...currentData].reverse().slice(0, showAllData ? currentData.length : 3).map((row) => {
                  const originalIndex = currentData.findIndex(d => d.id === row.id)
                  const achieveRate = row.revenueTarget ? ((row.revenue / row.revenueTarget) * 100) : null
                  return (
                  <tr key={row.id} className={`${originalIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${originalIndex === safeIndex ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}>
                    <td className="px-2 md:px-4 py-2 md:py-3 font-medium">{row.month}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-right">{formatCurrency(row.revenue)}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-right hidden md:table-cell">{row.revenueTarget ? formatCurrency(row.revenueTarget) : '-'}</td>
                    <td className={`px-2 md:px-4 py-2 md:py-3 text-right hidden md:table-cell font-semibold ${achieveRate !== null ? (achieveRate >= 100 ? 'text-green-600' : 'text-red-500') : ''}`}>
                      {achieveRate !== null ? `${achieveRate.toFixed(1)}%` : '-'}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-right hidden md:table-cell">{formatNumber(row.rooms)}室</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-right">{row.occupancy}%</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-right hidden md:table-cell">{formatCurrency(row.adr)}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                      <button onClick={() => { setEditData(row); setIsModalOpen(true) }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded mr-1 md:mr-2">
                        <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button onClick={() => handleDeleteRequest(row.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <X className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </td>
                  </tr>
                  )
                })}
                {showAllData && (() => {
                  const yearGroups = {}
                  currentData.forEach(r => {
                    const match = r.month.match(/(\d{4})年/)
                    if (match) {
                      const year = match[1]
                      if (!yearGroups[year]) yearGroups[year] = []
                      yearGroups[year].push(r)
                    }
                  })
                  return Object.entries(yearGroups).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([year, rows]) => {
                    const totalRevenue = rows.reduce((sum, r) => sum + (r.revenue || 0), 0)
                    const totalTarget = rows.reduce((sum, r) => sum + (r.revenueTarget || 0), 0)
                    const totalRooms = rows.reduce((sum, r) => sum + (r.rooms || 0), 0)
                    const avgOccupancy = (rows.reduce((sum, r) => sum + (r.occupancy || 0), 0) / rows.length).toFixed(1)
                    const avgAdr = Math.round(rows.reduce((sum, r) => sum + (r.adr || 0), 0) / rows.length)
                    const totalAchieve = totalTarget ? ((totalRevenue / totalTarget) * 100) : null
                    return (
                      <tr key={`summary-${year}`} className="bg-[#1a3a52]/5 border-t-2 border-[#1a3a52]/20 font-bold">
                        <td className="px-2 md:px-4 py-2 md:py-3 text-[#1a3a52]">{year}年 累計</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-right text-[#1a3a52]">{formatCurrency(totalRevenue)}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-right hidden md:table-cell text-[#1a3a52]">{totalTarget ? formatCurrency(totalTarget) : '-'}</td>
                        <td className={`px-2 md:px-4 py-2 md:py-3 text-right hidden md:table-cell ${totalAchieve !== null ? (totalAchieve >= 100 ? 'text-green-600' : 'text-red-500') : ''}`}>
                          {totalAchieve !== null ? `${totalAchieve.toFixed(1)}%` : '-'}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-right hidden md:table-cell text-[#1a3a52]">{formatNumber(totalRooms)}室</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-right text-[#1a3a52]">{avgOccupancy}%</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-right hidden md:table-cell text-[#1a3a52]">{formatCurrency(avgAdr)}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3"></td>
                      </tr>
                    )
                  })
                })()}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-4 md:p-6 border border-blue-100 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            分析サマリー ({selectedData.month})
          </h3>
          <div className="text-gray-700 space-y-2 text-sm md:text-base">
            <p>
              <strong>{selectedData.month}</strong>の売上高は<strong>{formatCurrency(selectedData.revenue)}</strong>で、
              {prevData.revenue ? (<>前月比<span className={calcChange(selectedData.revenue, prevData.revenue) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {calcChange(selectedData.revenue, prevData.revenue) >= 0 ? '+' : ''}{calcChange(selectedData.revenue, prevData.revenue).toFixed(1)}%
              </span></>) : null}となりました。
            </p>
            {selectedData.revenueTarget > 0 && (() => {
              const achieve = ((selectedData.revenue / selectedData.revenueTarget) * 100)
              const diff = selectedData.revenue - selectedData.revenueTarget
              return (
                <p>
                  売上目標<strong>{formatCurrency(selectedData.revenueTarget)}</strong>に対し、
                  達成率は<strong className={achieve >= 100 ? 'text-green-600' : 'text-red-500'}>{achieve.toFixed(1)}%</strong>
                  {achieve >= 100
                    ? <>（目標を<strong className="text-green-600">{formatCurrency(diff)}</strong>上回りました）</>
                    : <>（目標まであと<strong className="text-red-500">{formatCurrency(Math.abs(diff))}</strong>）</>
                  }
                </p>
              )
            })()}
            <p>
              稼働率は<strong>{selectedData.occupancy}%</strong>で、
              ADRは<strong>{formatCurrency(selectedData.adr)}</strong>でした。
            </p>
            <p>
              客源構成は国内客<strong>{selectedData.domesticRatio}%</strong>、
              海外客<strong>{selectedData.overseasRatio}%</strong>となっています。
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-md p-4 md:p-6 border border-amber-200 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
              今後の改善事項
            </h3>
            {!editingImprovements ? (
              <button onClick={startEditImprovements}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition">
                <Edit2 className="w-3 h-3" /> 編集
              </button>
            ) : (
              <button onClick={saveImprovements}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition">
                <Save className="w-3 h-3" /> 保存
              </button>
            )}
          </div>
          {editingImprovements ? (
            <textarea
              value={improvementText}
              onChange={(e) => setImprovementText(e.target.value)}
              rows={6}
              placeholder="改善事項を1行ずつ入力してください..."
              className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm md:text-base"
            />
          ) : (
            <ul className="space-y-2">
              {currentImprovements.length > 0 ? currentImprovements.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              )) : (
                <p className="text-gray-500 text-sm">改善事項はまだ登録されていません。「編集」ボタンから追加してください。</p>
              )}
            </ul>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 py-3 md:py-4 mt-6 md:mt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-xs md:text-sm">
          ©㈱グローバルリンクス社内専用2026
        </div>
      </footer>

      <DataInputModal isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditData(null) }}
        onSave={saveData} editData={editData} />

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-800">データ削除確認</h3>
              <p className="text-sm text-gray-500 mt-1">削除するにはパスワードを入力してください</p>
            </div>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => { setDeletePassword(e.target.value); setDeletePasswordError(false) }}
              placeholder="パスワードを入力"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg mb-3 ${deletePasswordError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              autoFocus
            />
            {deletePasswordError && (
              <p className="text-red-500 text-sm text-center mb-3">パスワードが正しくありません</p>
            )}
            <div className="flex gap-3">
              <button onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                キャンセル
              </button>
              <button onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* キーボードショートカットヘルプ */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowKeyboardHelp(false)}>
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-2xl p-6 w-full max-w-md`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Keyboard className="w-5 h-5" /> キーボードショートカット
              </h3>
              <button onClick={() => setShowKeyboardHelp(false)} className="p-1 hover:bg-gray-200 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded`}>
                  <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">←</kbd> / <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">→</kbd>
                  <span className="ml-2">月切替</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded`}>
                  <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">1</kbd> / <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">2</kbd>
                  <span className="ml-2">ホテル切替</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded`}>
                  <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">Ctrl+E</kbd>
                  <span className="ml-2">CSV出力</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded`}>
                  <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">Ctrl+R</kbd>
                  <span className="ml-2">更新</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded`}>
                  <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">Ctrl+D</kbd>
                  <span className="ml-2">ダークモード</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded`}>
                  <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">Ctrl+F</kbd>
                  <span className="ml-2">フィルター</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded`}>
                  <kbd className="font-mono bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">Esc</kbd>
                  <span className="ml-2">閉じる</span>
                </div>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-3`}>
                モバイル: 左右スワイプで月切替
              </p>
            </div>
          </div>
        </div>
      )}

      {/* トレンド警告通知 */}
      {trendWarnings.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>トレンド警告</span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {trendWarnings.slice(0, 3).map((w, i) => (
                <div key={i} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-1`}>
                  {w.type === 'down' ? (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  )}
                  <span>{w.field === 'revenue' ? '売上' : w.field === 'occupancy' ? '稼働率' : 'ADR'}: {w.count}ヶ月連続{w.type === 'down' ? '下降' : '上昇'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
