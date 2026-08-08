/* Metalica Zuev — двуязычный интерфейс (RO по умолчанию, RU второй язык). */
(function (global) {
  'use strict';

  var STRINGS = {
    ro: {
      meta: { title: 'Metalica Zuev — laminate metalice în Moldova', desc: 'Laminate metalice angro și cu amănuntul în Chișinău și Orhei. Debitare la dimensiune, livrare în toată Moldova, vânzare în credit. Sunați sau scrieți pe Viber.' },
      brand: { sub: 'Laminate metalice · din 1989' },
      header: { callLabel: 'Apel în Moldova', navAria: 'Navigare principală', mobileAria: 'Navigare mobilă', menuAria: 'Deschideți meniul' },
      nav: { catalog: 'Catalog', calculator: 'Calculator', services: 'Servicii', about: 'Despre companie', locations: 'Depozite', contacts: 'Contacte' },
      hero: {
        eyebrow: 'Bază de metal în Chișinău și Orhei · din 1989',
        line1: 'Metal pe care',
        line2Html: 'se sprijină <span class="brass-word">șantierul tău</span>',
        lead: '19 grupe de produse din laminate de secțiune, țevi și tablă. Debitare la dimensiune, livrare în toată Moldova — scrieți managerului pe Viber sau sunați, răspundem în timpul programului.',
        viber: 'Scrieți pe Viber', catalogBtn: 'Vedeți catalogul'
      },
      spec: {
        head1: 'Profile — sortiment', head2: 'GOST · DIN',
        rebar: 'Armătură', beam: 'Grindă', tube: 'Țeavă', angle: 'Corniera', channel: 'Profil U', tubeSq: 'Țeavă<br>profilată',
        count: '19 grupe de produse', price: 'preț la cerere'
      },
      ledger: {
        years: '37 ani', yearsLbl: 'pe piața Moldovei, din 1989',
        warehouses: '3 depozite', warehousesLbl: 'Chișinău (2) și Orhei',
        groups: '19 grupe', groupsLbl: 'laminate de secțiune și tablă',
        cert: '100%', certLbl: 'metal certificat'
      },
      catalog: {
        eyebrow: 'Catalog', h2: 'Laminate de secțiune, țevi și tablă',
        hint: 'Deschideți o carte — vedeți grila de dimensiuni și greutatea pe metru. Stocul și prețul se confirmă cu managerul, în funcție de volum.',
        filterAria: 'Filtru catalog pe grupe', countSuffix: 'poziții în grupă',
        sizesShow: 'Dimensiuni', sizesHide: 'Ascundeți', quote: 'Cereți preț',
        tagStock: 'În stoc', tagOrder: 'La comandă'
      },
      groupLabels: { all: 'Toate', rebar: 'Armătură și accesorii', bar: 'Laminate de secțiune', pipe: 'Țevi', beam: 'Grinzi și profile', sheet: 'Tablă', fence: 'Împrejmuiri', lumber: 'Materiale lemnoase' },
      calc: {
        eyebrow: 'Instrument', h2: 'Calculator greutate metal',
        hint: 'Pentru laminate de secțiune și țevi — după lungime în metri. Greutatea este exactă, conform GOST/DIN pentru fiecare dimensiune.',
        categoryLabel: 'Categorie de laminat', sizeLabel: 'Dimensiune (GOST/DIN)', qtyLabel: 'Lungime, m',
        unavailable: 'Greutatea acestei poziții depinde de comandă — cifra exactă o dă managerul.',
        priceLabel: 'Preț per tonă (reper propriu, opțional)', pricePlaceholder: 'ex. 12000',
        wpmLabel: 'Greutatea poziției', totalLabel: 'Greutate totală', costLabel: 'Cost estimativ',
        note: 'Calculul gata poate fi trimis managerului — butonul „Cereți preț” de pe cardul produsului.'
      },
      services: {
        eyebrow: 'Servicii', h2: 'Nu doar metal', hint: 'Însoțim livrarea de la calcul până pe șantier.',
        items: [
          { title: 'Livrare', text: 'Cu transport propriu în Chișinău, Orhei și în toată Moldova.' },
          { title: 'Debitare metal', text: 'Ghilotină, la dimensiune, calandrare țevi, tăiere cu gaz.' },
          { title: 'Încărcare cu manipulator', text: 'Descărcare pe șantier fără utilaj suplimentar din partea clientului.' },
          { title: 'Vânzare în credit', text: 'Amânare la plată și condiții de credit conform contractului.' }
        ]
      },
      about: {
        eyebrow: 'Despre companie', h2Html: 'Experiența generațiilor.<br>Baza viitorului.',
        p1: 'Metalica Zuev furnizează laminate metalice în Moldova din 1989 — de la armătură și țevi până la grinzi, tablă și împrejmuiri. Catalogul acoperă tot ciclul construcției: de la fundație și structură până la gard și acoperiș.',
        p2: 'Produsele sunt potrivite atât pentru obiective industriale, cât și pentru complexe rezidențiale sau construcții private. Trei depozite în Chișinău și Orhei permit menținerea stocului pe pozițiile-cheie și livrarea fără așteptare îndelungată.',
        features: [
          { title: 'Control al calității', text: 'Laminate certificate, verificarea lotului la recepție.' },
          { title: 'Trei depozite', text: 'Chișinău (2) și Orhei — traseu de livrare mai scurt în toată țara.' },
          { title: 'Debitare la dimensiune', text: 'Croire după desenul clientului, fără resturi inutile.' },
          { title: 'Condiții pentru firme', text: 'Prețuri individuale pe volum, amânare și eșalonare la plată.' }
        ]
      },
      cta: {
        eyebrow: 'Preț la cerere', h2: 'Aveți nevoie de un calcul exact pentru volumul dvs.?',
        p: 'Trimiteți lista de poziții managerului pe Viber sau sunați — calculăm costul și termenele în aceeași zi lucrătoare.',
        viber: 'Scrieți pe Viber', call: 'Sunați'
      },
      locations: {
        eyebrow: 'Locații', h2: 'Trei depozite — toată Moldova aproape',
        hint: 'Veniți după marfă din stoc sau comandați livrare.', route: 'Traseu',
        items: [
          { tag: 'Depozit', city: 'Chișinău', addrHtml: 'str. Industrială, 48', hours: 'Lu–Vi: 08:00–17:00 · Sâ–Du: liber' },
          { tag: 'Birou / depozit', city: 'Chișinău', addrHtml: 'str. Transnistria, 3A<br>reper: intersecția cu str. Vadul-lui-Vodă', hours: 'Lu–Vi: 08:00–17:00' },
          { tag: 'Depozit', city: 'Orhei', addrHtml: 'str. Unirii, 49/D', hours: 'Lu–Vi: 08:00–17:00 · Sâ–Du: liber' }
        ]
      },
      contacts: {
        eyebrow: 'Contacte', h2: 'Contactați managerul', hint: 'Răspundem în timpul programului — de obicei în decurs de o oră.',
        quickTitle: 'Legătură rapidă — cel mai simplu', quickText: 'Scrieți pe Viber sau sunați — nu trebuie să completați nimic.',
        viber: 'Scrieți pe Viber',
        warehouseTitle: 'Depozit / birou — Chișinău', warehouseAddrHtml: 'str. Industrială, 48<br>str. Transnistria, 3A',
        orheiTitle: 'Depozit — Orhei', orheiAddrHtml: 'str. Unirii, 49/D',
        hoursTitle: 'Program de lucru', hoursHtml: 'Lu–Vi: 08:00–17:00<br>Sâ–Du: liber'
      },
      form: {
        eyebrow: 'Sau lăsați numărul', nameLabel: 'Nume', namePh: 'Cum să vă adresăm',
        phoneLabel: 'Telefon', phonePh: '+373 6_ ___ ___',
        commentLabel: 'Comentariu (opțional)', commentPh: 'Ce aveți nevoie — marcă, dimensiuni, volum',
        submit: 'Trimiteți cererea', note: 'Managerul vă va contacta în timpul programului — nu e obligatoriu să completați totul.',
        successTitle: 'Cererea a fost trimisă', successText: 'Managerul vă va contacta în timpul programului la numărul indicat.',
        resend: 'Trimiteți încă una', toast: 'Cererea a fost trimisă managerului'
      },
      footer: {
        catalogTitle: 'Catalog', catalogLinks: ['Armătură și accesorii', 'Țevi', 'Grinzi și profile', 'Tablă'],
        companyTitle: 'Companie', companyLinks: ['Calculator de greutate', 'Locații', 'Despre companie', 'Servicii', 'Contacte'],
        contactsTitle: 'Contacte', contactsLinks: ['+373 68 47 15 30', 'Viber', 'Chișinău, str. Industrială 48', 'Orhei, str. Unirii 49/D'],
        copyright: '© 2026 Metalica Zuev', note: 'Laminatele sunt certificate · prețurile și stocul se confirmă cu managerul'
      },
      fab: { viber: 'Viber', call: 'Sunați' }
    },
    ru: {
      meta: { title: 'Metalica Zuev — металлопрокат в Молдове', desc: 'Металлопрокат оптом и в розницу в Кишинёве и Оргееве. Резка в размер, доставка по Молдове, продажа в кредит. Звоните или пишите в Viber.' },
      brand: { sub: 'Металлопрокат · с 1989' },
      header: { callLabel: 'Звонок по Молдове', navAria: 'Основная навигация', mobileAria: 'Мобильная навигация', menuAria: 'Открыть меню' },
      nav: { catalog: 'Каталог', calculator: 'Калькулятор', services: 'Услуги', about: 'О компании', locations: 'Склады', contacts: 'Контакты' },
      hero: {
        eyebrow: 'Металлобаза в Кишинёве и Оргееве · с 1989 года',
        line1: 'Металл, на котором',
        line2Html: 'держится <span class="brass-word">ваша стройка</span>',
        lead: '19 товарных групп сортового, трубного и листового проката. Порезка в размер, доставка по Молдове — свяжитесь с менеджером в Viber или по звонку, ответим в рабочее время.',
        viber: 'Написать в Viber', catalogBtn: 'Смотреть каталог'
      },
      spec: {
        head1: 'Профили — сортамент', head2: 'ГОСТ · DIN',
        rebar: 'Арматура', beam: 'Балка', tube: 'Труба', angle: 'Уголок', channel: 'Швеллер', tubeSq: 'Проф.<br>труба',
        count: '19 товарных групп', price: 'цена по запросу'
      },
      ledger: {
        years: '37 лет', yearsLbl: 'на рынке Молдовы, с 1989 года',
        warehouses: '3 склада', warehousesLbl: 'Кишинёв (2) и Оргеев',
        groups: '19 групп', groupsLbl: 'сортового и листового проката',
        cert: '100%', certLbl: 'сертифицированный металл'
      },
      catalog: {
        eyebrow: 'Каталог', h2: 'Сортовой, трубный и листовой прокат',
        hint: 'Разверните карточку — увидите сетку размеров и вес на метр. Наличие и цена уточняются под объём у менеджера.',
        filterAria: 'Фильтр каталога по группам', countSuffix: 'позиций в группе',
        sizesShow: 'Размеры', sizesHide: 'Скрыть', quote: 'Уточнить цену',
        tagStock: 'В наличии', tagOrder: 'Под заказ'
      },
      groupLabels: { all: 'Всё', rebar: 'Арматура и метизы', bar: 'Сортовой прокат', pipe: 'Трубы', beam: 'Балки и профили', sheet: 'Листовой прокат', fence: 'Ограждения', lumber: 'Пиломатериалы' },
      calc: {
        eyebrow: 'Инструмент', h2: 'Калькулятор веса металла',
        hint: 'Для сортового проката и труб — по длине в метрах. Вес — точный, по ГОСТ/DIN для каждого типоразмера.',
        categoryLabel: 'Категория проката', sizeLabel: 'Типоразмер (ГОСТ/DIN)', qtyLabel: 'Длина, м',
        unavailable: 'Вес для этой позиции зависит от заказа — точную цифру даст менеджер.',
        priceLabel: 'Цена за тонну (свой ориентир, необязательно)', pricePlaceholder: 'напр. 12000',
        wpmLabel: 'Вес позиции', totalLabel: 'Итоговый вес', costLabel: 'Ориентировочная стоимость',
        note: 'Готовый расчёт можно отправить менеджеру — кнопка «Уточнить цену» на карточке товара.'
      },
      services: {
        eyebrow: 'Услуги', h2: 'Не только металл', hint: 'Сопровождаем поставку от расчёта до площадки.',
        items: [
          { title: 'Доставка', text: 'Своим транспортом по Кишинёву, Оргееву и всей Молдове.' },
          { title: 'Порезка металла', text: 'Гильотина, под размер, вальцовка труб, газовая резка.' },
          { title: 'Погрузка манипулятором', text: 'Разгрузка на объекте без дополнительной техники клиента.' },
          { title: 'Продажа в кредит', text: 'Отсрочка платежа и кредитные условия по договору.' }
        ]
      },
      about: {
        eyebrow: 'О компании', h2Html: 'Опыт поколений.<br>Основа будущего.',
        p1: 'Metalica Zuev поставляет металлопрокат в Молдове с 1989 года — от арматуры и труб до балок, листа и ограждений. Каталог закрывает весь цикл стройки: от фундамента и каркаса до забора и кровли.',
        p2: 'Продукция подходит и для промышленных объектов, и для жилых комплексов, и для частной застройки. Три склада в Кишинёве и Оргееве позволяют держать наличие по ключевым позициям и отгружать без долгого ожидания.',
        features: [
          { title: 'Контроль качества', text: 'Сертифицированный прокат, проверка партии на входе.' },
          { title: 'Три склада', text: 'Кишинёв (2) и Оргеев — короче плечо доставки по стране.' },
          { title: 'Порезка в размер', text: 'Раскрой под чертёж заказчика без лишних остатков.' },
          { title: 'Условия для юрлиц', text: 'Индивидуальные цены на объём, отсрочка и рассрочка.' }
        ]
      },
      cta: {
        eyebrow: 'Цена по запросу', h2: 'Нужен точный расчёт под ваш объём?',
        p: 'Пришлите список позиций менеджеру в Viber или позвоните — посчитаем стоимость и сроки в течение рабочего дня.',
        viber: 'Написать в Viber', call: 'Позвонить'
      },
      locations: {
        eyebrow: 'Локации', h2: 'Три склада — вся Молдова рядом',
        hint: 'Приезжайте за наличным товаром или закажите доставку.', route: 'Маршрут',
        items: [
          { tag: 'Склад', city: 'Кишинёв', addrHtml: 'str. Industrială, 48', hours: 'Пн–Пт: 08:00–17:00 · Сб–Вс: выходной' },
          { tag: 'Офис / склад', city: 'Кишинёв', addrHtml: 'str. Transnistria, 3A<br>ориентир: пересечение со str. Vadul-lui-Vodă', hours: 'Пн–Пт: 08:00–17:00' },
          { tag: 'Склад', city: 'Оргеев', addrHtml: 'str. Unirii, 49/D', hours: 'Пн–Пт: 08:00–17:00 · Сб–Вс: выходной' }
        ]
      },
      contacts: {
        eyebrow: 'Контакты', h2: 'Свяжитесь с менеджером', hint: 'Ответим в рабочее время — обычно в течение часа.',
        quickTitle: 'Быстрая связь — быстрее всего', quickText: 'Напишите в Viber или позвоните — не нужно ничего заполнять.',
        viber: 'Написать в Viber',
        warehouseTitle: 'Склад / офис — Кишинёв', warehouseAddrHtml: 'str. Industrială, 48<br>str. Transnistria, 3A',
        orheiTitle: 'Склад — Оргеев', orheiAddrHtml: 'str. Unirii, 49/D',
        hoursTitle: 'Часы работы', hoursHtml: 'Пн–Пт: 08:00–17:00<br>Сб–Вс: выходной'
      },
      form: {
        eyebrow: 'Или оставьте номер', nameLabel: 'Имя', namePh: 'Как к вам обращаться',
        phoneLabel: 'Телефон', phonePh: '+373 6_ ___ ___',
        commentLabel: 'Комментарий (необязательно)', commentPh: 'Что нужно — марка, размеры, объём',
        submit: 'Отправить заявку', note: 'Менеджер перезвонит в рабочее время — заполнять всё не обязательно.',
        successTitle: 'Заявка принята', successText: 'Менеджер свяжется с вами в рабочее время по указанному телефону.',
        resend: 'Отправить ещё одну', toast: 'Заявка отправлена менеджеру'
      },
      footer: {
        catalogTitle: 'Каталог', catalogLinks: ['Арматура и метизы', 'Трубы', 'Балки и профили', 'Листовой прокат'],
        companyTitle: 'Компания', companyLinks: ['Калькулятор веса', 'Локации', 'О компании', 'Услуги', 'Контакты'],
        contactsTitle: 'Контакты', contactsLinks: ['+373 68 47 15 30', 'Viber', 'Кишинёв, str. Industrială 48', 'Оргеев, str. Unirii 49/D'],
        copyright: '© 2026 Metalica Zuev', note: 'Прокат сертифицирован · цены и наличие уточняйте у менеджера'
      },
      fab: { viber: 'Viber', call: 'Позвонить' }
    }
  };

  var LANG_KEY = 'mz_lang_v1';
  function detectDefault() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === 'ro' || saved === 'ru') return saved;
    } catch (e) { /* ignore */ }
    return 'ro';
  }

  var current = detectDefault();

  function get(path) {
    var parts = path.split('.');
    var node = STRINGS[current];
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return null;
      node = node[parts[i]];
    }
    return node;
  }

  function applyStatic() {
    document.documentElement.lang = current;
    var d = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < d.length; i++) {
      var val = get(d[i].getAttribute('data-i18n'));
      if (val != null) d[i].textContent = val;
    }
    var dh = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < dh.length; j++) {
      var valh = get(dh[j].getAttribute('data-i18n-html'));
      if (valh != null) dh[j].innerHTML = valh;
    }
    var dp = document.querySelectorAll('[data-i18n-placeholder]');
    for (var k = 0; k < dp.length; k++) {
      var valp = get(dp[k].getAttribute('data-i18n-placeholder'));
      if (valp != null) dp[k].setAttribute('placeholder', valp);
    }
    var da = document.querySelectorAll('[data-i18n-aria]');
    for (var m = 0; m < da.length; m++) {
      var vala = get(da[m].getAttribute('data-i18n-aria'));
      if (vala != null) da[m].setAttribute('aria-label', vala);
    }
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', get('meta.desc'));
    document.title = get('meta.title');
    var switches = document.querySelectorAll('[data-lang-switch]');
    for (var s = 0; s < switches.length; s++) {
      switches[s].classList.toggle('is-active', switches[s].getAttribute('data-lang-switch') === current);
    }
  }

  function setLang(lang) {
    if (lang !== 'ro' && lang !== 'ru') return;
    current = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
    applyStatic();
    document.dispatchEvent(new CustomEvent('mz:langchange', { detail: { lang: lang } }));
  }

  global.MZ_I18N = {
    get lang() { return current; },
    t: get,
    strings: function () { return STRINGS[current]; },
    apply: applyStatic,
    setLang: setLang
  };

  document.addEventListener('DOMContentLoaded', function () {
    applyStatic();
    var switches = document.querySelectorAll('[data-lang-switch]');
    switches.forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang-switch')); });
    });
  });
})(window);
