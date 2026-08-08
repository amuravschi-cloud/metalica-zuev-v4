/* Metalica Zuev — данные каталога и общая логика расчёта веса.
   Числа: точные диаметры арматуры и часть размеров трубы/листа — с mz.md.
   Остальное — стандартные размерные ряды ГОСТ/DIN. Вес — расчёт по плотности
   стали 7.85 г/см³ для геометрических профилей, либо справочные табличные
   значения для горячекатаных профилей (уголок/швеллер/балка) и гибких изделий
   (канат/рабица) — везде справочно, финальная цена и наличие — по запросу.
   Двуязычные поля: title/titleRo, standard/standardRo, dimLabel/dimLabelRo. */
(function (global) {
  'use strict';

  var STEEL = 0.00785; // кг / (мм² · мм длины на 1000мм) => кг на метр = area(мм²) * STEEL

  function round2(n) {
    if (n >= 100) return Math.round(n * 10) / 10;
    if (n >= 10) return Math.round(n * 100) / 100;
    if (n >= 1) return Math.round(n * 1000) / 1000;
    return Math.round(n * 100000) / 100000;
  }

  // ---- геометрические формулы (кг/м) ----
  function wRound(d) { return round2((Math.PI / 4) * d * d * STEEL); }
  function wSquare(s) { return round2(s * s * STEEL); }
  function wStrip(w, t) { return round2(w * t * STEEL); }
  function wTubeSquare(a, b, t) {
    var out = a * b, inA = Math.max(a - 2 * t, 0), inB = Math.max(b - 2 * t, 0);
    return round2((out - inA * inB) * STEEL);
  }
  function wTubeRound(D, t) {
    var d = D - 2 * t;
    return round2((Math.PI / 4) * (D * D - d * d) * STEEL);
  }
  function wSheetPerM2(t) { return round2(t * 7.85); }

  var CALC_FORMULAS = {
    round: { label: 'Круг / арматура / катанка / проволока', fields: [{ key: 'd', label: 'Диаметр, мм', min: 1, max: 250, step: 0.5 }], compute: function (v) { return wRound(v.d); } },
    square: { label: 'Квадрат', fields: [{ key: 's', label: 'Сторона, мм', min: 4, max: 250, step: 1 }], compute: function (v) { return wSquare(v.s); } },
    strip: { label: 'Полоса', fields: [{ key: 'w', label: 'Ширина, мм', min: 10, max: 300, step: 1 }, { key: 't', label: 'Толщина, мм', min: 2, max: 60, step: 0.5 }], compute: function (v) { return wStrip(v.w, v.t); } },
    tubeSquare: { label: 'Труба профильная', fields: [{ key: 'a', label: 'Сторона A, мм', min: 10, max: 250, step: 1 }, { key: 'b', label: 'Сторона B, мм', min: 10, max: 250, step: 1 }, { key: 't', label: 'Толщина стенки, мм', min: 1, max: 12, step: 0.5 }], compute: function (v) { return wTubeSquare(v.a, v.b, v.t); } },
    tubeRound: { label: 'Труба круглая', fields: [{ key: 'D', label: 'Наружный Ø, мм', min: 10, max: 550, step: 1 }, { key: 't', label: 'Толщина стенки, мм', min: 1, max: 20, step: 0.5 }], compute: function (v) { return wTubeRound(v.D, v.t); } },
    sheet: { label: 'Лист (плоский / рулонный)', fields: [{ key: 't', label: 'Толщина, мм', min: 0.35, max: 160, step: 0.05 }, { key: 'w', label: 'Ширина листа, мм', min: 500, max: 2500, step: 10 }], compute: function (v) { return round2(wSheetPerM2(v.t) * (v.w / 1000)); }, perAreaNote: true },
    lookup: { label: '', fields: [], compute: null }
  };

  function sub(ru, ro) { return { ru: ru, ro: ro }; }

  // ---- каталог: 19 карточек, сгруппированных как в фильтре ----
  var CATALOG = [
    {
      key: 'rebar', group: 'rebar', icon: 'i-rebar', title: 'Арматура', titleRo: 'Armătură',
      standard: 'ГОСТ 5781 · A400С / A500С', standardRo: 'GOST 5781 · A400C / A500C', tag: 'stock', unit: 'м', calcType: 'round',
      dimLabel: 'Диаметр, мм', dimLabelRo: 'Diametru, mm',
      sizes: [6, 8, 9.5, 10, 11.5, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36].map(function (d) {
        return { label: 'Ø' + d, weight: wRound(d) };
      })
    },
    {
      key: 'circle', group: 'bar', icon: 'i-circle', title: 'Круг', titleRo: 'Oțel rotund',
      standard: 'ГОСТ 2590 · сталь Ст3 / 45', standardRo: 'GOST 2590 · oțel St3 / 45', tag: 'stock', unit: 'м', calcType: 'round',
      dimLabel: 'Диаметр, мм', dimLabelRo: 'Diametru, mm',
      sizes: [10, 12, 14, 16, 20, 25, 32, 40, 50, 63, 80, 100, 120, 160, 200].map(function (d) {
        return { label: 'Ø' + d, weight: wRound(d) };
      })
    },
    {
      key: 'tube-sq', group: 'pipe', icon: 'i-tube-sq', title: 'Труба профильная', titleRo: 'Țeavă profilată',
      standard: 'ГОСТ 8639', standardRo: 'GOST 8639', tag: 'stock', unit: 'м', calcType: 'tubeSquare',
      dimLabel: 'Сечение × стенка, мм', dimLabelRo: 'Secțiune × perete, mm',
      sizes: [
        [15, 15, 1.5], [20, 20, 1.5], [25, 25, 2], [30, 30, 2], [40, 40, 2],
        [40, 20, 2], [50, 50, 2.5], [60, 40, 2], [60, 60, 3], [80, 40, 3],
        [80, 80, 3], [100, 100, 3], [100, 50, 3], [120, 120, 4], [150, 150, 5]
      ].map(function (s) {
        return { label: s[0] + '×' + s[1] + '×' + s[2], weight: wTubeSquare(s[0], s[1], s[2]) };
      })
    },
    {
      key: 'tube-rd', group: 'pipe', icon: 'i-tube-rd', title: 'Труба круглая', titleRo: 'Țeavă rotundă',
      standard: 'ГОСТ 10704', standardRo: 'GOST 10704', tag: 'stock', unit: 'м', calcType: 'tubeRound',
      dimLabel: 'Ø × стенка, мм', dimLabelRo: 'Ø × perete, mm',
      sizes: [
        [21.3, 2.5], [26.8, 2.5], [33.5, 3], [42.4, 3], [48.3, 3.5],
        [57, 3.5], [76, 4], [89, 4], [108, 4], [114, 4.5],
        [133, 5], [159, 5], [219, 6], [273, 7], [325, 8]
      ].map(function (s) {
        return { label: 'Ø' + s[0], sub: sub('стенка ' + s[1], 'perete ' + s[1]), weight: wTubeRound(s[0], s[1]) };
      })
    },
    {
      key: 'beam', group: 'beam', icon: 'i-beam', title: 'Балка', titleRo: 'Grindă',
      standard: 'ГОСТ 8239 · двутавр горячекатаный', standardRo: 'GOST 8239 · profil I laminat la cald', tag: 'order', unit: 'м', calcType: 'lookup',
      dimLabel: 'Номер профиля', dimLabelRo: 'Număr profil',
      sizes: [
        ['№10', 9.46], ['№12', 11.5], ['№14', 13.7], ['№16', 15.9], ['№18', 18.4],
        ['№20', 21.0], ['№22', 24.0], ['№24', 27.3], ['№27', 31.5], ['№30', 36.5],
        ['№33', 42.2], ['№36', 48.6], ['№40', 57.0]
      ].map(function (s) { return { label: s[0], weight: s[1] }; })
    },
    {
      key: 'beam-euro', group: 'beam', icon: 'i-beam-euro', title: 'Евробалка', titleRo: 'Eurogrindă',
      standard: 'DIN 1025 · IPE широкополочная', standardRo: 'DIN 1025 · IPE cu talpă lată', tag: 'order', unit: 'м', calcType: 'lookup',
      dimLabel: 'Профиль', dimLabelRo: 'Profil',
      sizes: [
        ['IPE 80', 6.0], ['IPE 100', 8.1], ['IPE 120', 10.4], ['IPE 140', 12.9], ['IPE 160', 15.8],
        ['IPE 180', 18.8], ['IPE 200', 22.4], ['IPE 220', 26.2], ['IPE 240', 30.7], ['IPE 270', 36.1],
        ['IPE 300', 42.2], ['IPE 330', 49.1], ['IPE 360', 57.1], ['IPE 400', 66.3]
      ].map(function (s) { return { label: s[0], weight: s[1] }; })
    },
    {
      key: 'angle', group: 'beam', icon: 'i-angle', title: 'Уголок', titleRo: 'Corniera',
      standard: 'ГОСТ 8509 · равнополочный', standardRo: 'GOST 8509 · cu aripi egale', tag: 'stock', unit: 'м', calcType: 'lookup',
      dimLabel: 'Сечение, мм', dimLabelRo: 'Secțiune, mm',
      sizes: [
        ['20×20×3', 0.89], ['25×25×3', 1.12], ['25×25×4', 1.46], ['32×32×3', 1.46],
        ['32×32×4', 1.91], ['40×40×4', 2.42], ['40×40×5', 2.97], ['50×50×4', 3.05],
        ['50×50×5', 3.77], ['63×63×5', 4.82], ['63×63×6', 5.72], ['75×75×6', 6.89],
        ['75×75×8', 9.02], ['100×100×8', 12.5], ['100×100×10', 15.1], ['125×125×10', 19.1]
      ].map(function (s) { return { label: s[0], weight: s[1] }; })
    },
    {
      key: 'channel', group: 'beam', icon: 'i-channel', title: 'Швеллер', titleRo: 'Profil U',
      standard: 'ГОСТ 8240 · горячекатаный', standardRo: 'GOST 8240 · laminat la cald', tag: 'stock', unit: 'м', calcType: 'lookup',
      dimLabel: 'Номер профиля', dimLabelRo: 'Număr profil',
      sizes: [
        ['№5', 4.84], ['№6.5', 5.90], ['№8', 7.05], ['№10', 8.59], ['№12', 10.4],
        ['№14', 12.3], ['№16', 14.2], ['№18', 16.3], ['№20', 18.4], ['№22', 21.0],
        ['№24', 24.0], ['№27', 27.7], ['№30', 31.8], ['№36', 41.9], ['№40', 48.3]
      ].map(function (s) { return { label: s[0], weight: s[1] }; })
    },
    {
      key: 'rope', group: 'rebar', icon: 'i-rope', title: 'Канаты / стропы', titleRo: 'Cabluri / sfori din oțel',
      standard: 'ГОСТ 2688 · стальной канат', standardRo: 'GOST 2688 · cablu de oțel', tag: 'order', unit: 'м', calcType: 'lookup',
      dimLabel: 'Диаметр каната, мм', dimLabelRo: 'Diametru cablu, mm',
      sizes: [
        ['Ø6.2', 0.144], ['Ø7.6', 0.217], ['Ø9.1', 0.311], ['Ø11', 0.454], ['Ø13', 0.640],
        ['Ø15', 0.844], ['Ø17.5', 1.14], ['Ø19.5', 1.44], ['Ø22', 1.85], ['Ø24.5', 2.28],
        ['Ø27.5', 2.87], ['Ø30', 3.42]
      ].map(function (s) { return { label: s[0] + ' мм', weight: s[1] }; })
    },
    {
      key: 'katanka', group: 'rebar', icon: 'i-coil', title: 'Катанка', titleRo: 'Sârmă laminată (catancă)',
      standard: 'ГОСТ 30136 · в бухтах', standardRo: 'GOST 30136 · în colaci', tag: 'stock', unit: 'м', calcType: 'round',
      dimLabel: 'Диаметр, мм', dimLabelRo: 'Diametru, mm',
      sizes: [5.5, 6, 6.5, 7, 8, 9, 10].map(function (d) {
        return { label: 'Ø' + d, weight: wRound(d) };
      })
    },
    {
      key: 'square', group: 'bar', icon: 'i-square', title: 'Квадрат', titleRo: 'Pătrat',
      standard: 'ГОСТ 2591 · сталь Ст3 / 45', standardRo: 'GOST 2591 · oțel St3 / 45', tag: 'stock', unit: 'м', calcType: 'square',
      dimLabel: 'Сторона, мм', dimLabelRo: 'Latura, mm',
      sizes: [8, 10, 12, 14, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200].map(function (s) {
        return { label: s + '×' + s, weight: wSquare(s) };
      })
    },
    {
      key: 'sheet-flat', group: 'sheet', icon: 'i-sheet-flat', title: 'Листовой прокат плоский', titleRo: 'Tablă plată',
      standard: 'ГОСТ 19903 · лист 1250×2500 / 1500×6000', standardRo: 'GOST 19903 · foaie 1250×2500 / 1500×6000', tag: 'stock', unit: 'лист', calcType: 'sheet',
      dimLabel: 'Толщина × формат, мм', dimLabelRo: 'Grosime × format, mm',
      sizes: [
        [2, 1250, 2500], [3, 1250, 2500], [4, 1250, 2500], [5, 1500, 6000],
        [6, 1500, 6000], [8, 1500, 6000], [10, 1500, 6000], [12, 1500, 6000],
        [16, 1500, 6000], [20, 1500, 6000], [25, 1500, 6000], [30, 1500, 6000]
      ].map(function (s) {
        var perM2 = wSheetPerM2(s[0]);
        var total = round2(perM2 * (s[1] / 1000) * (s[2] / 1000));
        return { label: s[0] + ' мм · ' + s[1] + '×' + s[2], weight: total, sub: sub(perM2 + ' кг/м²', perM2 + ' kg/m²') };
      })
    },
    {
      key: 'sheet-roll', group: 'sheet', icon: 'i-sheet-roll', title: 'Листовой прокат рулонный', titleRo: 'Tablă în rulou',
      standard: 'ГОСТ 19904 · ширина до 1500 мм', standardRo: 'GOST 19904 · lățime până la 1500 mm', tag: 'order', unit: 'м', calcType: 'sheet',
      dimLabel: 'Толщина, мм · ширина рулона', dimLabelRo: 'Grosime, mm · lățime rulou',
      sizes: [
        [0.35, 1000], [0.45, 1000], [0.5, 1250], [0.7, 1250], [0.9, 1250],
        [1.0, 1250], [1.5, 1250], [2.0, 1500], [3.0, 1500], [4.0, 1500]
      ].map(function (s) {
        return { label: s[0] + ' мм · ' + s[1], weight: round2(wSheetPerM2(s[0]) * (s[1] / 1000)) };
      })
    },
    {
      key: 'strip', group: 'bar', icon: 'i-strip', title: 'Полоса', titleRo: 'Platbandă',
      standard: 'ГОСТ 103 · горячекатаная', standardRo: 'GOST 103 · laminată la cald', tag: 'stock', unit: 'м', calcType: 'strip',
      dimLabel: 'Ширина × толщина, мм', dimLabelRo: 'Lățime × grosime, mm',
      sizes: [
        [20, 3], [25, 4], [30, 4], [40, 4], [40, 5], [50, 5],
        [50, 6], [60, 6], [63, 8], [80, 8], [100, 10], [120, 12]
      ].map(function (s) {
        return { label: s[0] + '×' + s[1], weight: wStrip(s[0], s[1]) };
      })
    },
    {
      key: 'wire', group: 'rebar', icon: 'i-wire', title: 'Проволока', titleRo: 'Sârmă',
      standard: 'ГОСТ 3282 · вязальная / сварочная', standardRo: 'GOST 3282 · sârmă de legat / sudură', tag: 'stock', unit: 'м', calcType: 'round',
      dimLabel: 'Диаметр, мм', dimLabelRo: 'Diametru, mm',
      sizes: [1.2, 1.6, 2, 2.5, 3, 4, 5, 6, 8].map(function (d) {
        return { label: 'Ø' + d, weight: wRound(d) };
      })
    },
    {
      key: 'clamp', group: 'rebar', icon: 'i-clamp', title: 'Хомуты для арматуры', titleRo: 'Coliere pentru armătură',
      standard: 'по чертежу заказчика · гнутьё на месте', standardRo: 'după desenul clientului · îndoire la comandă', tag: 'order', unit: 'шт', calcType: 'lookup',
      dimLabel: 'Диаметр прутка, мм', dimLabelRo: 'Diametru bară, mm', custom: true,
      sizes: [6, 8, 10, 12].map(function (d) { return { label: 'Ø' + d, weight: null }; })
    },
    {
      key: 'mesh', group: 'fence', icon: 'i-mesh', title: 'Рабица', titleRo: 'Plasă (rabiț)',
      standard: 'оцинкованная / ПВХ · рулон 10 м', standardRo: 'zincată / PVC · rulou 10 m', tag: 'stock', unit: 'рулон', calcType: 'lookup',
      dimLabel: 'Ячейка × высота', dimLabelRo: 'Ochi × înălțime',
      sizes: [
        ['25×1.5м', 9.5], ['40×1.5м', 7.2], ['40×2.0м', 9.6], ['50×1.5м', 6.1],
        ['50×2.0м', 8.1], ['60×1.5м', 5.2], ['60×2.0м', 6.9]
      ].map(function (s) { return { label: s[0], weight: s[1] }; })
    },
    {
      key: 'euro-fence', group: 'fence', icon: 'i-fence', title: 'Евро забор', titleRo: 'Gard euro',
      standard: 'секция 2500 мм · полимерное покрытие', standardRo: 'secțiune 2500 mm · acoperire polimerică', tag: 'order', unit: 'секция', calcType: 'lookup',
      dimLabel: 'Высота секции, мм', dimLabelRo: 'Înălțime secțiune, mm',
      sizes: [
        ['1030', 26], ['1230', 30], ['1530', 36], ['1730', 40], ['2030', 46]
      ].map(function (s) { return { label: 'h ' + s[0], weight: s[1] }; })
    },
    {
      key: 'board', group: 'lumber', icon: 'i-plank', title: 'Доска', titleRo: 'Scândură',
      standard: 'обрезная / необрезная · хвойные породы', standardRo: 'geluită / negeluită · rășinoase', tag: 'stock', unit: 'м³', calcType: 'lookup',
      dimLabel: 'Сечение, мм', dimLabelRo: 'Secțiune, mm',
      sizes: [
        ['25×100×6000', null], ['25×150×6000', null], ['40×100×6000', null],
        ['40×150×6000', null], ['50×150×6000', null], ['50×200×6000', null]
      ].map(function (s) { return { label: s[0], weight: s[1] }; })
    }
  ];

  var GROUP_LABELS = {
    all: 'Всё', rebar: 'Арматура и метизы', bar: 'Сортовой прокат', pipe: 'Трубы',
    beam: 'Балки и профили', sheet: 'Листовой прокат', fence: 'Ограждения', lumber: 'Пиломатериалы'
  };
  var GROUP_LABELS_RO = {
    all: 'Toate', rebar: 'Armătură și accesorii', bar: 'Laminate de secțiune', pipe: 'Țevi',
    beam: 'Grinzi și profile', sheet: 'Tablă', fence: 'Împrejmuiri', lumber: 'Materiale lemnoase'
  };

  global.MZ_CATALOG = CATALOG;
  global.MZ_GROUP_LABELS = GROUP_LABELS;
  global.MZ_GROUP_LABELS_RO = GROUP_LABELS_RO;
  global.MZ_CALC_FORMULAS = CALC_FORMULAS;
  global.MZ_WEIGHT_FN = {
    round: wRound, square: wSquare, strip: wStrip,
    tubeSquare: wTubeSquare, tubeRound: wTubeRound, sheetPerM2: wSheetPerM2
  };
})(window);
