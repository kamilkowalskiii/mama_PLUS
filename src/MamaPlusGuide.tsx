import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Heart,
  Baby,
  Sparkles,
  Calendar,
  ShieldCheck,
  FileText,
  BookOpen,
  Send,
  ExternalLink,
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  Clock,
  Info,
  ChevronRight,
  Search,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Copy,
  Check,
  Briefcase,
  Stethoscope,
  Home,
  Menu,
  X,
  ArrowRight,
  Sliders,
  Award,
  Users,
  Bot,
  User
} from 'lucide-react';

// ============================================================================
// KONFIGURACJA ETAPÓW ROZWOJU I ŚWIADCZEŃ (DANE BAZOWE)
// ============================================================================

const STAGES = [
  { id: 'all', label: 'Wszystkie etapy', shortLabel: 'Wszystkie etapy', badge: 'Bez ograniczeń' },
  { id: 'pregnancy', label: 'Ciąża', shortLabel: 'Ciąża', badge: '1–42 tydz.' },
  { id: '0-6m', label: '0–6 mies.', shortLabel: '0–6 mies.', badge: 'Niemowlę' },
  { id: '6-12m', label: '6–12 mies.', shortLabel: '6–12 mies.', badge: 'Rozszerzanie diety' },
  { id: '1-2y', label: '1–2 lata', shortLabel: '1–2 lata', badge: 'Małe dziecko' },
  { id: '2-3y', label: '2–3 lata', shortLabel: '2–3 lata', badge: 'Przedszkolak start' },
  { id: '3-6y', label: '3–6 lat', shortLabel: '3–6 lat', badge: 'Przedszkole' }
];

const OFFICIAL_PORTALS = [
  {
    name: 'eZUS / PUE ZUS',
    desc: 'Wnioski o 800+, Aktywny Rodzic, zasiłek macierzyński',
    url: 'https://www.zus.pl/ezus',
    tag: 'ZUS'
  },
  {
    name: 'Portal Emp@tia',
    desc: 'Świadczenia rodzinne, Kosiniakowe, Becikowe',
    url: 'https://empatia.mpips.gov.pl',
    tag: 'MRPiPS'
  },
  {
    name: 'Zgłoś urodzenie dziecka',
    desc: 'Akt urodzenia w USC, PESEL i zameldowanie online',
    url: 'https://www.gov.pl/web/gov/zglos-urodzenie-dziecka',
    tag: 'Gov.pl'
  },
  {
    name: 'Program Aktywny Rodzic',
    desc: 'Zasady świadczeń 1500 zł / 1900 zł / 500 zł',
    url: 'https://www.zus.pl/aktywnyrodzic',
    tag: 'ZUS'
  },
  {
    name: 'Pacjent.gov.pl (IKP)',
    desc: 'Kalendarz badań w ciąży, szczepienia i e-recepty',
    url: 'https://pacjent.gov.pl',
    tag: 'MZ'
  }
];

const STARTER_QUESTIONS = [
  'Daj bezpośredni link do złożenia wniosku o 800+',
  'Ile powinno spać dziecko?',
  'Jaką temperaturę powinna mieć woda do kąpieli?',
  'Jakie świadczenia przysługują po urodzeniu dziecka?',
  'Co spakować do torby do szpitala?',
  'Jak działa program Aktywny Rodzic?'
];

const INITIAL_BENEFITS = [
  {
    id: '800plus',
    title: 'Świadczenie wychowawcze 800+',
    category: 'ZUS / Comiesięczne',
    amount: 800,
    unit: 'zł / mies.',
    deadline: '3 mies. od urodzenia (wyrównanie wstecz)',
    form: 'Formularz SW-R (eZUS, Emp@tia, bankowość)',
    description: 'Przysługuje na każde dziecko do ukończenia 18. roku życia niezależnie od dochodu rodziny.',
    linkLabel: 'Złóż wniosek 800+ na eZUS',
    linkUrl: 'https://www.zus.pl/ezus'
  },
  {
    id: 'aktywny-rodzic',
    title: 'Program „Aktywny Rodzic”',
    category: 'ZUS / Opieka 12–35 mies.',
    amount: 1500,
    unit: 'zł / mies. (do 1900 zł)',
    deadline: 'Od 12. do 35. miesiąca życia dziecka',
    form: 'Wnioski ARW / ARZ / ARD wyłącznie elektronicznie (eZUS)',
    description: 'Trzy formy wsparcia: „Aktywni rodzice w pracy” (1500 zł), „Aktywnie w żłobku” (dofinansowanie do 1500 zł) lub „Aktywnie w domu” (500 zł).',
    linkLabel: 'Sprawdź Aktywny Rodzic w ZUS',
    linkUrl: 'https://www.zus.pl/aktywnyrodzic'
  },
  {
    id: 'macierzynski',
    title: 'Zasiłek macierzyński',
    category: 'ZUS / Ubezpieczenie',
    amount: 81.5,
    unit: '% podstawy (lub 100% + 70%)',
    deadline: '21 dni od porodu (wniosek o pełny wymiar)',
    form: 'Wniosek u pracodawcy lub ZAS-54 w eZUS',
    description: 'Wypłacany przez 52 tygodnie (urlop macierzyński 20 tyg. + urlop rodzicielski 32 tyg.) dla osób objętych ubezpieczeniem chorobowym.',
    linkLabel: 'Informacje i wnioski w eZUS',
    linkUrl: 'https://www.zus.pl/ezus'
  },
  {
    id: 'kosiniakowe',
    title: 'Świadczenie rodzicielskie (Kosiniakowe)',
    category: 'Gmina / Bez etatu',
    amount: 1000,
    unit: 'zł / mies. przez 52 tyg.',
    deadline: '3 mies. od dnia porodu (wyrównanie)',
    form: 'Portal Emp@tia lub urząd gminy/miasta',
    description: 'Dla rodziców nieuprawnionych do zasiłku macierzyńskiego (m.in. studentów, bezrobotnych, osób na umowie o dzieło).',
    linkLabel: 'Złóż wniosek przez Emp@tia',
    linkUrl: 'https://empatia.mpips.gov.pl'
  },
  {
    id: 'becikowe',
    title: 'Jednorazowa zapomoga (Becikowe)',
    category: 'Gmina / Jednorazowe',
    amount: 1000,
    unit: 'zł jednorazowo',
    deadline: '12 mies. od narodzin dziecka',
    form: 'Emp@tia lub ośrodek pomocy społecznej + zaświadczenie lekarskie',
    description: 'Przysługuje, gdy dochód na osobę w rodzinie nie przekracza 1922 zł netto, a mama pozostawała pod opieką lekarską min. od 10. tyg. ciąży.',
    linkLabel: 'Wniosek online na Emp@tia',
    linkUrl: 'https://empatia.mpips.gov.pl'
  },
  {
    id: 'usc-pesel',
    title: 'Rejestracja urodzenia (USC i PESEL)',
    category: 'Formalność obowiązkowa',
    amount: 0,
    unit: 'Bezpłatnie online',
    deadline: '21 dni od wystawienia karty urodzenia',
    form: 'Usługa online na Gov.pl (Profil Zaufany / mObywatel)',
    description: 'Po zgłoszeniu online otrzymujesz odpis aktu urodzenia, numer PESEL dziecka oraz automatyczne zameldowanie.',
    linkLabel: 'Zgłoś urodzenie dziecka na Gov.pl',
    linkUrl: 'https://www.gov.pl/web/gov/zglos-urodzenie-dziecka'
  },
  {
    id: 'zcna',
    title: 'Zgłoszenie do NFZ (druk ZCNA)',
    category: 'Zdrowie / NFZ',
    amount: 0,
    unit: 'Bezpłatne leczenie',
    deadline: '7 dni od nadania dziecku numeru PESEL',
    form: 'U pracodawcy (ZUS ZCNA) lub w ZUS dla przedsiębiorców',
    description: 'Zapewnia dziecku pełny dostęp do bezpłatnej opieki pediatrycznej, bilansów i szczepień w ramach NFZ.',
    linkLabel: 'Portal eZUS / PUE ZUS',
    linkUrl: 'https://www.zus.pl/ezus'
  },
  {
    id: 'urlop-ojcowski',
    title: 'Urlop ojcowski i część dla taty (9 tyg.)',
    category: 'Kodeks pracy / ZUS',
    amount: 100,
    unit: '% podstawy (ojcowski)',
    deadline: 'Ojcowski: do 12. mies. życia dziecka',
    form: 'Wniosek do pracodawcy min. 7 dni przed urlopem',
    description: 'Tata może wykorzystać 2 tygodnie płatnego w 100% urlopu ojcowskiego oraz 9 tygodni nieprzenoszalnego urlopu rodzicielskiego (70%).',
    linkLabel: 'Zasady urlopów na Gov.pl',
    linkUrl: 'https://www.gov.pl/web/rodzina'
  }
];

const PREGNANCY_WEEKS_DATA = [
  {
    range: [1, 13],
    trimester: 'I Trymestr (1–13 tydz.)',
    size: 'Od ziarenka maku do cytryny (ok. 7 cm)',
    babyDev: 'Kształtują się wszystkie kluczowe narządy, zaczyna bić serduszko, rozwijają się zawiązki rączek i nóżek.',
    motherTips: 'Przyjmuj kwas foliowy (400–800 µg), dbaj o nawodnienie i odpoczynek przy mdłościach. Zgłoś się do lekarza przed 10. tygodniem ciąży (wymagane m.in. do becikowego).',
    tests: ['Grupa krwi i Rh, morfologia, badanie ogólne moczu', 'Glukoza na czczo, TSH, VDRL, HIV, HCV, toksoplazmoza, różyczka', 'USG genetyczne I trymestru (11.–14. tydzień ciąży)']
  },
  {
    range: [14, 27],
    trimester: 'II Trymestr (14–27 tydz.)',
    size: 'Od brzoskwini do kalafiora (ok. 35 cm, 900 g)',
    babyDev: 'Maluszek słyszy Twój głos, porusza się coraz wyraźniej, ćwiczy odruch ssania i połykania.',
    motherTips: 'Najbardziej komfortowy okres ciąży. Dobry moment na szkołę rodzenia, aktywność fizyczną i skompletowanie dokumentów do ZUS.',
    tests: ['USG połówkowe (18.–22. tydzień ciąży)', 'Test obciążenia glukozą OGTT 75 g (24.–26. tydzień)', 'Morfologia i badanie ogólne moczu co 4 tygodnie']
  },
  {
    range: [28, 42],
    trimester: 'III Trymestr (28–42 tydz.)',
    size: 'Od bakłażana do arbuza (ok. 50–54 cm, 3200–3800 g)',
    babyDev: 'Dojrzewają płuca, układ nerwowy i odpornościowy. Dziecko gromadzi tkankę tłuszczową i układa się główką w dół.',
    motherTips: 'Spakuj torbę do szpitala około 35.–36. tygodnia. Przygotuj plan porodu i upewnij się, że masz aktywny Profil Zaufany do rejestracji dziecka online.',
    tests: ['USG III trymestru (28.–32. tydzień ciąży)', 'Wymaz GBS w kierunku paciorkowców (35.–37. tydzień)', 'Badania KTG oraz antygen HBs, HIV, VDRL (33.–37. tydzień)']
  }
];

const HOSPITAL_BAG_ITEMS = [
  { id: 'doc-1', group: 'Dokumenty', text: 'Dowód osobisty lub mObywatel + karta ciąży' },
  { id: 'doc-2', group: 'Dokumenty', text: 'Oryginał wyniku grupy krwi i czynnika Rh' },
  { id: 'doc-3', group: 'Dokumenty', text: 'Aktualne wyniki: HBs, GBS, morfologia, mocz, ostatnie USG' },
  { id: 'doc-4', group: 'Dokumenty', text: 'Plan porodu i dane pracodawcy / szpitala' },
  { id: 'mom-1', group: 'Dla Mamy', text: '2–3 koszule nocne rozpinane do karmienia + szlafrok' },
  { id: 'mom-2', group: 'Dla Mamy', text: 'Podkłady poporodowe, majtki siateczkowe i wkładki laktacyjne' },
  { id: 'mom-3', group: 'Dla Mamy', text: 'Klapki pod prysznic, 2 ręczniki, kosmetyki bezzapachowe' },
  { id: 'mom-4', group: 'Dla Mamy', text: 'Woda niegazowana z dzióbkiem, zdrowe przekąski, ładowarka' },
  { id: 'baby-1', group: 'Dla Maluszka', text: '3–4 komplety ubranek (body kopertowe + pajacyki, rozm. 56/62)' },
  { id: 'baby-2', group: 'Dla Maluszka', text: '2 cienkie bawełniane czapeczki, skarpetki i niedrapki' },
  { id: 'baby-3', group: 'Dla Maluszka', text: 'Pieluszki jednorazowe (rozm. 1) + 4 pieluszki tetrowe/muślinowe' },
  { id: 'baby-4', group: 'Dla Maluszka', text: 'Krem ochronny do pupy, rożek lub kocyk, fotelik samochodowy' }
];

const CARE_AGES = [
  { id: '0-6m', label: '0–6 mies.', subtitle: 'Noworodek i młodsze niemowlę' },
  { id: '6-12m', label: '6–12 mies.', subtitle: 'Rozszerzanie diety i ruch' },
  { id: '1-2y', label: '1–2 lata', subtitle: 'Pierwsze kroki i słowa' },
  { id: '2-3y', label: '2–3 lata', subtitle: 'Samodzielność i emocje' },
  { id: '3-6y', label: '3–6 lat', subtitle: 'Wiek przedszkolny' }
];

const CARE_CATEGORIES = [
  { id: 'sleep', label: 'Sen i rytm dnia' },
  { id: 'feeding', label: 'Karmienie i dieta' },
  { id: 'bath', label: 'Kąpiel i pielęgnacja' },
  { id: 'dev', label: 'Rozwój i zabawa' },
  { id: 'health', label: 'Zdrowie i szczepienia' },
  { id: 'safety', label: 'Bezpieczeństwo' },
  { id: 'emotions', label: 'Emocje i bliskość' }
];

const CARE_CONTENT = {
  '0-6m': {
    sleep: 'Noworodek śpi 14–17 godz. na dobę w krótkich cyklach (2–4 godz.). Niemowlę 3–6 mies. zwykle 12–15 godz. (w tym 3–4 drzemki). Zawsze układaj dziecko na plecach na twardym materacu bez poduszek i luźnych kocyków.',
    feeding: 'Wyłączne karmienie piersią (lub mlekiem modyfikowanym na żądanie) przez pierwsze 6 miesięcy. Noworodek je 8–12 razy na dobę; nie dopajamy wodą w tym okresie.',
    bath: 'Temperatura wody: 37°C (sprawdź termometrem lub łokciem), temperatura w pokoju: 22–24°C. Kąpiel krótka (5–10 min) 2–3 razy w tygodniu w delikatnym emolientowym środku bez SLS.',
    dev: 'Codzienny czas na brzuszku (tummy time) podczas czuwania wzmacnia mięśnie szyi i pleców. Kontrastowe książeczki, spokojny głos i kontakt skóra do skóry wspierają układ nerwowy.',
    health: 'Obowiązkowe szczepienia w 1. dobie, 2., 4. oraz 5–6. miesiącu życia. Witamina D3 (400 IU/dobę od pierwszych dni życia) oraz wizyty patronażowe położnej.',
    safety: 'Fotelik tyłem do kierunku jazdy (RWF), brak zabawek w łóżeczku, nigdy nie zostawiaj maluszka samego na przewijaku ani kanapie.',
    emotions: 'Reagowanie na płacz buduje bezpieczną więź — noworodka nie da się „rozpieścić” noszeniem i przytulaniem.'
  },
  '6-12m': {
    sleep: 'Łącznie 12–15 godz. snu na dobę, zazwyczaj z 2 drzemkami w ciągu dnia. Stały wieczorny rytuał (kąpiel, wyciszenie, karmienie) ułatwia zasypianie.',
    feeding: 'Rozszerzanie diety po ukończeniu 6. miesiąca (warzywa, owoce, kasze, mięso, ryby, jajko, alergeny wprowadzane stopniowo). Podajemy wodę w otwartym kubeczku lub bidonie ze słomką.',
    bath: 'Woda 36–37°C. Gdy maluch stabilnie siedzi, można używać maty antypoślizgowej w wannie. Myjemy fałdki skórne i pierwsze ząbki miękką szczoteczką z odrobiną pasty z fluorem (1000 ppm).',
    dev: 'Czas pełzania, czworakowania, siadania i chwytu pęsetowego. Unikaj chodzików — najlepiej pozwalać dziecku na swobodny ruch na macie na podłodze.',
    health: 'Szczepienia w 7. miesiącu i bilans w 9.–12. miesiącu. Zwiększ dawkę witaminy D3 do 400–600 IU zależnie od podaży z mleka modyfikowanego.',
    safety: 'Zabezpiecz kontakty, szuflady z chemią i lekami, ostre kanty mebli oraz schody. Unikaj całych orzechów, winogron i twardych kawałków jedzenia (ryzyko zakrztuszenia).',
    emotions: 'Około 8.–9. miesiąca pojawia się lęk separacyjny — to zdrowy etap rozwoju. Zabawy w „a kuku” uczą stałości obiektu.'
  },
  '1-2y': {
    sleep: '11–14 godz. snu na dobę (w tym 1–2 drzemki w dzień; około 15.–18. miesiąca większość dzieci przechodzi na jedną drzemkę poobiednią).',
    feeding: '5 regularnych posiłków (3 główne + 2 przekąski) zbliżonych do diety rodzinnej, bez soli i dodanego cukru. Mleko kobiece lub modyfikowane jako uzupełnienie.',
    bath: 'Woda ok. 36–37°C. Zabawy kubeczkami i konewką w wannie oswajają z myciem głowy. Szczotkowanie zębów dwa razy dziennie przez rodzica.',
    dev: 'Nauka chodzenia, wspinania się, budowania wieży z klocków i pierwsze słowa. Czytajcie codziennie krótkie książeczki i nazywajcie przedmioty.',
    health: 'Szczepienia w 13.–15. miesiącu (MMR, pneumokoki, ospa/meningokoki wg kalendarza) oraz 16.–18. miesiącu. Pierwsza wizyta adaptacyjna u stomatologa.',
    safety: 'Zabezpiecz okna (blokady uchylania), gorące garnki na tylnych palnikach kuchenki i środki czystości wysoko poza zasięgiem rąk.',
    emotions: 'Początek buntu dwulatka — dziecko chce decydować, ale nie umie jeszcze regulować silnych emocji. Pomaga nazywanie uczuć i spokojne stawianie granic.'
  },
  '2-3y': {
    sleep: '11–13 godz. snu na dobę (10–11 godz. w nocy + ewentualna 1–1,5 godz. drzemka w dzień). Ogranicz ekrany na minimum 2 godz. przed snem.',
    feeding: 'Wspólne posiłki przy stole bez rozpraszaczy (telewizora/tabletu). Zasada podziału odpowiedzialności: rodzic decyduje co i kiedy podaje, dziecko — ile zje.',
    bath: 'Woda 36–37°C. Dziecko uczy się samodzielnego mycia rąk, twarzy i brania krótkiego prysznica pod opieką dorosłego.',
    dev: 'Dynamiczny rozwój mowy (zdania złożone), zabawy tematyczne (w dom, sklep), rysowanie i nauka korzystania z nocnika/toalety bez presji.',
    health: 'Bilans dwulatka (ocena wzroku, słuchu, mowy, postawy i uzębienia). Witamina D3 w dawce 600–1000 IU/dobę.',
    safety: 'Kask podczas jazdy na rowerku biegowym, nauka zasad przechodzenia przez ulicę za rękę i bezpieczeństwa na placu zabaw.',
    emotions: 'Wspieraj samodzielność („Ja sam!”), dawaj wybór z dwóch akceptowalnych opcji (np. czerwona czy niebieska bluza).'
  },
  '3-6y': {
    sleep: '10–13 godz. snu na dobę (zazwyczaj bez drzemki w dzień, za to z wcześniejszą porą kładzenia się spać ok. 19:30–20:30).',
    feeding: 'Zbilansowana dieta przedszkolaka: warzywa i owoce w każdym posiłku, pełnoziarniste zboża, nabiał, strączki/ryby, woda jako główny napój.',
    bath: 'Woda ok. 36–37°C. Samodzielna higiena pod nadzorem: dokładne mycie rąk po powrocie z przedszkola i mycie zębów (pasta 1000–1450 ppm fluoru, ilość ziarnka grochu).',
    dev: 'Zabawy rówieśnicze, ćwiczenie motoryki małej (nożyczki, lepienie, rysowanie), gry planszowe uczące zasad i przegrywania.',
    health: 'Bilans czterolatka i sześciolatka oraz szczepienia przypominające w 6. roku życia (DTaP + IPV). Kontrola stomatologiczna co 6 miesięcy.',
    safety: 'Nauka podstawowych danych (imię, nazwisko, numer alarmowy 112), widoczne odblaski i fotelik dopasowany do wzrostu.',
    emotions: 'Rozwój empatii i wyobraźni (mogą pojawiać się lęki nocne). Rozmawiaj o emocjach i buduj poczucie własnej wartości przez docenianie wysiłku.'
  }
};

const GUIDES_LIBRARY = [
  {
    id: 'g1',
    tag: 'Świadczenia i ZUS',
    title: 'Jak złożyć wniosek o 800+ i Aktywny Rodzic krok po kroku',
    summary: 'Gdzie zalogować się na eZUS/PUE ZUS, jaki formularz wybrać (SW-R dla 800+, ARW/ARZ/ARD dla Aktywnego Rodzica) i jakich błędów unikać.',
    prompt: 'Wyjaśnij krok po kroku jak złożyć wniosek o 800+ oraz Aktywny Rodzic i podaj bezpośrednie linki.'
  },
  {
    id: 'g2',
    tag: 'Formalności po porodzie',
    title: 'Pierwsze 21 dni po narodzinach: USC, PESEL, ZCNA i urlopy',
    summary: 'Kompletna checklista formalności dla świeżo upieczonych rodziców — wszystko, co załatwisz online bez wychodzenia z domu.',
    prompt: 'Jakie formalności trzeba załatwić w pierwszych tygodniach po narodzinach dziecka i w jakich terminach?'
  },
  {
    id: 'g3',
    tag: 'Ciąża i prawa mamy',
    title: 'Prawa kobiety w ciąży w pracy i na L4 (100% zasiłku)',
    summary: 'Ochrona stosunku pracy, płatne zwolnienia na badania lekarskie, zakaz pracy w nadgodzinach oraz zasady wyliczania zasiłku macierzyńskiego.',
    prompt: 'Jakie prawa przysługują kobiecie w ciąży w pracy i jak wyliczany jest zasiłek macierzyński?'
  },
  {
    id: 'g4',
    tag: 'Pielęgnacja i sen',
    title: 'Bezpieczny sen i pierwsza kąpiel noworodka bez stresu',
    summary: 'Optymalna temperatura wody (37°C) i pokoju, zasady bezpiecznego łóżeczka oraz rytm snu niemowlęcia w kolejnych miesiącach.',
    prompt: 'Jak przygotować bezpieczną kąpiel dla dziecka i jak zadbać o jego spokojny sen?'
  },
  {
    id: 'g5',
    tag: 'Karmienie i dieta',
    title: 'Karmienie piersią i rozszerzanie diety po 6. miesiącu',
    summary: 'Kiedy podać pierwsze warzywa, jak wprowadzać alergeny i jakich produktów unikać w pierwszym roku życia dziecka.',
    prompt: 'Jak prawidłowo karmić niemowlę i kiedy rozpocząć rozszerzanie diety?'
  },
  {
    id: 'g6',
    tag: 'Urlopy dla taty',
    title: 'Urlop ojcowski (2 tyg.) i 9 tygodni dla drugiego rodzica',
    summary: 'Dlaczego 9 tygodni urlopu rodzicielskiego nie przechodzi na drugiego rodzica i jak zaplanować wspólny czas z maluszkiem.',
    prompt: 'Jak działają urlop ojcowski oraz nieprzenoszalne 9 tygodni urlopu rodzicielskiego dla taty?'
  }
];

const DEFAULT_CALENDAR_EVENTS = [
  { id: 'ev1', date: '2026-11-20', title: 'Badanie USG połówkowe / kontrolne', category: 'Zdrowie', done: false },
  { id: 'ev2', date: '2026-11-28', title: 'Założenie / sprawdzenie Profilu Zaufanego i eZUS', category: 'ZUS / Urząd', done: true },
  { id: 'ev3', date: '2026-12-10', title: 'Przygotowanie dokumentów do szpitala', category: 'Ciąża', done: false }
];

// ============================================================================
// POMOCNICY NORMALIZACJI, ŹRÓDEŁ I LOKALNEJ INTELIGENCJI ASYSTENTA AI
// ============================================================================

function normalizeText(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectTopicSource(queryText, answerText = '') {
  const combined = normalizeText(`${queryText} ${answerText}`);
  if (
    combined.includes('800+') ||
    combined.includes('800 plus') ||
    combined.includes('zus') ||
    combined.includes('ezus') ||
    combined.includes('swiadczen') ||
    combined.includes('wniosek') ||
    combined.includes('link') ||
    combined.includes('aktywny rodzic') ||
    combined.includes('kosiniakowe') ||
    combined.includes('becikowe') ||
    combined.includes('pesel') ||
    combined.includes('usc') ||
    combined.includes('zcna') ||
    combined.includes('empatia')
  ) {
    return 'ZUS.pl & Gov.pl (eZUS / Emp@tia)';
  }
  if (
    combined.includes('urlop') ||
    combined.includes('praca') ||
    combined.includes('pracodawc') ||
    combined.includes('kodeks') ||
    combined.includes('ojcowski') ||
    combined.includes('macierzynski') ||
    combined.includes('zwolnien') ||
    combined.includes('l4')
  ) {
    return 'Gov.pl & Kodeks pracy';
  }
  if (
    combined.includes('sen') ||
    combined.includes('spac') ||
    combined.includes('kapiel') ||
    combined.includes('woda') ||
    combined.includes('temperatur') ||
    combined.includes('karm') ||
    combined.includes('dieta') ||
    combined.includes('szczepien') ||
    combined.includes('badani') ||
    combined.includes('usg') ||
    combined.includes('szpital') ||
    combined.includes('wyprawk') ||
    combined.includes('goraczk') ||
    combined.includes('zdrow')
  ) {
    return 'Pacjent.gov.pl & IMiD';
  }
  return 'ZUS.pl, Pacjent.gov.pl & Gov.pl';
}

function deduplicateFollowUps(candidates, usedQuestions) {
  const usedNorm = new Set((usedQuestions || []).map(normalizeText));
  const result = [];
  for (const item of candidates) {
    const clean = (item || '').trim();
    const norm = normalizeText(clean);
    if (!clean || norm.length < 6) continue;
    let isDuplicate = false;
    for (const u of usedNorm) {
      if (u === norm || u.includes(norm) || norm.includes(u)) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      usedNorm.add(norm);
      result.push(clean);
    }
    if (result.length >= 3) break;
  }
  return result;
}

function isAgeDependentQuestion(query) {
  const q = normalizeText(query);
  // Jeśli użytkownik sam w treści pytania podał wiek (np. "3 latka", "noworodka", "6 miesiecy", "w ciazy"), nie dopytujemy ponownie
  const explicitAgeHints = [
    'noworod',
    'niemowl',
    '3 lat',
    '3-lat',
    '2 lat',
    '2-lat',
    'roczn',
    'przedszkol',
    'w ciazy',
    'tydzien',
    'tygodn',
    'miesiac',
    'miesiec'
  ];
  if (explicitAgeHints.some((h) => q.includes(h))) return false;

  const ageDependentPatterns = [
    'ile powinno spac',
    'ile spi',
    'sen dzieck',
    'drzemk',
    'temperatur',
    'kapiel',
    'kapac',
    'jak karmic',
    'ile jesc',
    'rozszerzani',
    'jakie swiadczeni',
    'co mi przysluguje',
    'jakie badania',
    'szczepieni',
    'waga dzieck',
    'rozwoj dzieck',
    'zabaw'
  ];
  return ageDependentPatterns.some((p) => q.includes(p));
}

function getStageDisplayLabel(stageId, pregnancyWeek) {
  if (stageId === 'all') return 'Wszystkie etapy';
  if (stageId === 'pregnancy') return `Ciąża (${pregnancyWeek}. tydz.)`;
  const found = STAGES.find((s) => s.id === stageId);
  return found ? found.label : 'Wszystkie etapy';
}

// Kompletny, niezawodny silnik wiedzy lokalnej (działa natychmiast jako baza lub fallback gdy API jest niedostępne)
function buildSmartFallbackResponse({ userQuery, stageId, pregnancyWeek, previousUserMessages }) {
  const q = normalizeText(userQuery);
  const stageNote =
    stageId === 'pregnancy'
      ? `**Wskazówka dla Twojego etapu (Ciąża, ${pregnancyWeek}. tydz.):** `
      : stageId !== 'all'
      ? `**Dopasowanie do etapu (${getStageDisplayLabel(stageId, pregnancyWeek)}):** `
      : '';

  // 1. Pytania o link do wniosku 800+ / złożenie wniosku
  if (
    (q.includes('link') || q.includes('gdzie zlozyc') || q.includes('strona') || q.includes('formularz')) &&
    (q.includes('800') || q.includes('wnios') || q.includes('sw-r') || q.includes('swiadczen'))
  ) {
    const contextSentence =
      stageId === 'pregnancy'
        ? `Wniosek o **800+ (formularz SW-R)** wyślesz oficjalnie po porodzie, gdy dziecko otrzyma numer PESEL — ale już teraz możesz zapisać bezpośredni link i sprawdzić swoje logowanie do eZUS.\n\n`
        : '';

    return {
      text:
        `${contextSentence}Oto bezpośrednie, oficjalne portale, przez które złożysz wniosek o świadczenie **800+ (formularz SW-R)** bezpłatnie online:\n\n` +
        `1. **Platforma eZUS (PUE ZUS)** – najwygodniejsza droga obsługi wniosków ZUS:\n` +
        `[Przejdź bezpośrednio do eZUS / PUE ZUS](https://www.zus.pl/ezus)\n` +
        `2. **Portal Emp@tia (MRPiPS)** – rządowy portal świadczeń rodzinnych:\n` +
        `[Otwórz Portal Emp@tia](https://empatia.mpips.gov.pl)\n` +
        `3. **Bankowość elektroniczna** – większość banków w Polsce ma zakładkę „Wnioski urzędowe / 800+” po zalogowaniu na konto.\n\n` +
        `**Jak złożyć wniosek w 3 krokach:**\n` +
        `- Zaloguj się przez Profil Zaufany, mObywatel lub bankowość elektroniczną.\n` +
        `- Wybierz wniosek **SW-R** (dla rodzica dziecka) i wpisz numer **PESEL dziecka** oraz numer konta bankowego.\n` +
        `- Zatwierdź podpisem elektronicznym — potwierdzenie otrzymasz od razu na skrzynkę eZUS.`,
      followUps: deduplicateFollowUps(
        [
          'Jakie dokumenty muszę przygotować do wniosku?',
          'Ile mam czasu na złożenie wniosku o 800+ po porodzie?',
          'Jakie inne świadczenia przysługują po urodzeniu dziecka?'
        ],
        previousUserMessages
      ),
      source: 'ZUS.pl & Gov.pl (eZUS / Emp@tia)',
      askStageClarification: false
    };
  }

  // 2. Pytania o 800+ ogólnie (dokumenty, czas, zasady)
  if (q.includes('800+') || q.includes('800 plus') || q.includes('sw-r')) {
    const contextSentence =
      stageId === 'pregnancy'
        ? `${stageNote}Wniosek złożysz po narodzinach dziecka i nadaniu mu numeru PESEL.\n\n`
        : '';
    return {
      text:
        `${contextSentence}Świadczenie wychowawcze **800+** przysługuje na każde dziecko do ukończenia 18. roku życia, niezależnie od dochodu rodziny.\n\n` +
        `- **Kwota:** **800 zł miesięcznie** na każde dziecko.\n` +
        `- **Termin złożenia po porodzie:** masz **3 miesiące** od dnia urodzenia dziecka — wtedy ZUS wypłaci pieniądze z wyrównaniem od dnia narodzin.\n` +
        `- **Potrzebne dane:** numer **PESEL dziecka**, Twój numer rachunku bankowego oraz dostęp do eZUS, bankowości lub portalu Emp@tia (nie trzeba skanować papierowego aktu urodzenia).\n\n` +
        `[Złóż wniosek 800+ na eZUS / PUE ZUS](https://www.zus.pl/ezus)`,
      followUps: deduplicateFollowUps(
        [
          'Daj bezpośredni link do złożenia wniosku o 800+',
          'Jak zgłosić urodzenie dziecka i uzyskać PESEL online?',
          'Jak działa program Aktywny Rodzic?'
        ],
        previousUserMessages
      ),
      source: 'ZUS.pl & Gov.pl (eZUS / Emp@tia)',
      askStageClarification: false
    };
  }

  // 3. Program Aktywny Rodzic
  if (q.includes('aktywny rodzic') || q.includes('zlobk') || q.includes('babciowe')) {
    return {
      text:
        `Program **„Aktywny Rodzic”** wspiera rodziców dzieci w wieku **od 12. do 35. miesiąca życia** i obejmuje trzy świadczenia do wyboru (można je zmieniać w zależności od sytuacji):\n\n` +
        `1. **Aktywni rodzice w pracy (1500 zł/mies. lub 1900 zł/mies. przy orzeczeniu o niepełnosprawności)** – dla rodziców aktywnych zawodowo, gdy dziecko nie chodzi do żłobka (np. opiekuje się nim niania lub babcia).\n` +
        `2. **Aktywnie w żłobku (do 1500 zł/mies.)** – dofinansowanie opłaty za żłobek, klub dziecięcy lub dziennego opiekuna (przekazywane bezpośrednio na konto placówki).\n` +
        `3. **Aktywnie w domu (500 zł/mies.)** – dla rodziców, którzy zostają z dzieckiem w domu i nie korzystają ze żłobka ani powyższych wariantów.\n\n` +
        `[Sprawdź szczegóły i złóż wniosek na ZUS.pl](https://www.zus.pl/aktywnyrodzic)`,
      followUps: deduplicateFollowUps(
        [
          'Jakie dokumenty są potrzebne do Aktywnego Rodzica?',
          'Czy można łączyć Aktywny Rodzic ze świadczeniem 800+?',
          'Ile wynosi zasiłek macierzyński?'
        ],
        previousUserMessages
      ),
      source: 'ZUS.pl & Gov.pl (eZUS / Emp@tia)',
      askStageClarification: false
    };
  }

  // 4. Sen dziecka
  if (q.includes('sen') || q.includes('spac') || q.includes('drzemk')) {
    const stageDetails = {
      pregnancy:
        `${stageNote}W ciąży zadbaj o własny sen na lewym boku (z poduszką ciążową między kolanami). Warto już teraz przygotować bezpieczne łóżeczko dla noworodka: twardy materac, prześcieradło z gumką, **bez poduszek, ochraniaczy i luźnych kocyków**.\n\n`,
      '0-6m':
        `${stageNote}Noworodek (0–3 mies.) śpi łącznie **14–17 godzin na dobę** w krótkich cyklach co 2–4 godziny (także w nocy na karmienie). Niemowlę w wieku 4–6 mies. potrzebuje **12–15 godzin snu**, w tym zwykle **3 drzemek w ciągu dnia**.\n\n`,
      '6-12m':
        `${stageNote}Niemowlę w wieku 6–12 miesięcy śpi średnio **12–15 godzin na dobę** (ok. 10–11 godz. w nocy oraz **2 drzemki dzienne**). Stała pora kąpieli i wyciszenia pomaga ograniczyć nocne wybudzenia.\n\n`,
      '1-2y':
        `${stageNote}Dziecko w wieku 1–2 lat potrzebuje **11–14 godzin snu na dobę**. Około 15.–18. miesiąca życia większość maluchów przechodzi z dwóch drzemek na **jedną dłuższą drzemkę** po obiedzie.\n\n`,
      '2-3y':
        `${stageNote}Dwulatek i trzylatek śpi zwykle **11–13 godzin na dobę**. Część dzieci ma jeszcze jedną drzemkę w ciągu dnia (ok. 1–1,5 godz.), a część rezygnuje z niej na rzecz wcześniejszego snu nocnego.\n\n`,
      '3-6y':
        `${stageNote}Przedszkolak (3–6 lat) potrzebuje **10–13 godzin snu nocnego** (najczęściej bez drzemki w dzień). Kluczowe jest wyłączenie ekranów minimum 2 godziny przed snem.\n\n`
    };

    const intro =
      stageId === 'all'
        ? `Zapotrzebowanie na sen zmienia się bardzo szybko wraz z wiekiem dziecka:\n\n` +
          `- **0–3 mies. (noworodek):** 14–17 godz. na dobę (krótkie drzemki całą dobę)\n` +
          `- **4–12 mies. (niemowlę):** 12–15 godz. na dobę (w tym 2–3 drzemki w dzień)\n` +
          `- **1–2 lata:** 11–14 godz. na dobę (1–2 drzemki)\n` +
          `- **3–6 lat (przedszkolak):** 10–13 godz. snu nocnego\n\n` +
          `**Złota zasada bezpieczeństwa:** niemowlęta zawsze układamy do snu **na plecach**, na płaskim i twardym materacu, bez poduszek.`
        : `${stageDetails[stageId]}**Zasady higieny snu:** stała pora wieczornego rytuału (kąpiel, przytulenie, czytanie), przewietrzony pokój (ok. 19–20°C) oraz brak ekranów przed snem.`;

    return {
      text: intro,
      followUps: deduplicateFollowUps(
        [
          'Jaką temperaturę powinna mieć woda do kąpieli?',
          'Jak stworzyć wieczorny rytuał przed snem?',
          'Jaka temperatura powinna być w pokoju dziecka w nocy?'
        ],
        previousUserMessages
      ),
      source: 'Pacjent.gov.pl & IMiD',
      askStageClarification: stageId === 'all'
    };
  }

  // 5. Temperatura wody i kąpiel
  if (q.includes('kapiel') || q.includes('kapac') || (q.includes('temperatur') && q.includes('wod'))) {
    const specific =
      stageId === 'pregnancy'
        ? `${stageNote}W ciąży sama unikaj bardzo gorących kąpieli powyżej 38°C. Dla noworodka, którego powitasz na świecie, przygotuj wodę o temperaturze zbliżonej do temperatury ciała.\n\n`
        : stageId !== 'all'
        ? `${stageNote}`
        : '';

    return {
      text:
        `${specific}Optymalna temperatura wody do kąpieli dziecka wynosi **37°C** (dla starszych dzieci od 1. roku życia może być to **36–37°C**).\n\n` +
        `**Najważniejsze zasady bezpiecznej kąpieli:**\n` +
        `- **Temperatura w pomieszczeniu:** ok. **22–24°C**, bez przeciągów.\n` +
        `- **Kontrola wody:** najlepiej użyć termometru kąpielowego lub zanurzyć wewnętrzną stronę swojego przedramienia/łokcia (woda powinna być przyjemnie ciepła, nie gorąca).\n` +
        `- **Czas trwania:** u niemowląt wystarczy **5–10 minut**, 2–3 razy w tygodniu.\n` +
        `- **Kosmetyki:** delikatny płyn/emolient o neutralnym pH bez intensywnych substancji zapachowych.`,
      followUps: deduplicateFollowUps(
        [
          'Ile powinno spać dziecko?',
          'Jak pielęgnować kikut pępowinowy u noworodka?',
          'Jakie kosmetyki spakować do wyprawki dla dziecka?'
        ],
        previousUserMessages
      ),
      source: 'Pacjent.gov.pl & IMiD',
      askStageClarification: stageId === 'all'
    };
  }

  // 6. Świadczenia ogólne
  if (q.includes('swiadczen') || q.includes('pieniadz') || q.includes('zasil') || q.includes('przysluguj')) {
    const stageHighlight =
      stageId === 'pregnancy'
        ? `${stageNote}W trakcie ciąży przysługuje Ci **100% zasiłek chorobowy** na L4 (kod B), a po porodzie możesz skorzystać z poniższego pakietu wsparcia:\n\n`
        : stageId !== 'all'
        ? `${stageNote}Niezależnie od wybranego etapu warto znać pełen zestaw świadczeń rodzinnych:\n\n`
        : '';

    return {
      text:
        `${stageHighlight}Najważniejsze świadczenia dla rodziców w Polsce:\n\n` +
        `1. **800+ (Świadczenie wychowawcze)** – **800 zł/mies.** na każde dziecko do 18. roku życia (bez kryterium dochodowego).\n` +
        `2. **Program „Aktywny Rodzic” (12–35 mies.)** – **1500 zł/mies.** (lub 1900 zł przy niepełnosprawności) w wariancie aktywności zawodowej/żłobka albo **500 zł/mies.** w domu.\n` +
        `3. **Zasiłek macierzyński** – przez **52 tygodnie** po porodzie (81,5% podstawy przez cały rok lub 100% przez pierwsze 20 tyg. i 70% przez kolejne 32 tyg.).\n` +
        `4. **Kosiniakowe (świadczenie rodzicielskie)** – **1000 zł/mies.** przez 52 tygodnie dla rodziców bez prawa do zasiłku macierzyńskiego (studenci, bezrobotni, umowa o dzieło).\n` +
        `5. **Becikowe** – **1000 zł jednorazowo** (przy dochodzie do 1922 zł netto/os. i opiece lekarskiej od min. 10. tyg. ciąży).\n\n` +
        `[Przejdź do eZUS / PUE ZUS](https://www.zus.pl/ezus)  [Otwórz Portal Emp@tia](https://empatia.mpips.gov.pl)`,
      followUps: deduplicateFollowUps(
        [
          'Daj bezpośredni link do złożenia wniosku o 800+',
          'Jak działa program Aktywny Rodzic?',
          'Jak zgłosić urodzenie dziecka i uzyskać PESEL online?'
        ],
        previousUserMessages
      ),
      source: 'ZUS.pl & Gov.pl (eZUS / Emp@tia)',
      askStageClarification: stageId === 'all'
    };
  }

  // 7. Torba do szpitala / wyprawka
  if (q.includes('torb') || q.includes('szpital') || q.includes('wyprawk')) {
    return {
      text:
        `Torbę do szpitala najlepiej spakować około **35.–36. tygodnia ciąży** i podzielić na trzy części:\n\n` +
        `- **Dokumenty:** dowód osobisty (lub mObywatel), karta ciąży, oryginał wyniku grupy krwi, aktualne wyniki badań (GBS, HBs, morfologia, mocz, ostatnie USG) oraz plan porodu.\n` +
        `- **Dla Mamy:** 2–3 rozpinane koszule do karmienia, szlafrok, podkłady poporodowe, majtki siateczkowe, wkładki laktacyjne, klapki pod prysznic, 2 ręczniki, woda niegazowana i przekąski.\n` +
        `- **Dla Maluszka:** 3–4 komplety ubranek (body kopertowe + pajacyki w rozm. 56/62), 2 bawełniane czapeczki, skarpetki, pieluszki jednorazowe (rozm. 1), pieluszki tetrowe, krem do pupy i fotelik na wyjście.\n\n` +
        `Pełną interaktywną listę z możliwością odhaczania znajdziesz także w zakładce **„Moja ciąża”**.`,
      followUps: deduplicateFollowUps(
        [
          'Jakie badania trzeba wykonać w III trymestrze ciąży?',
          'Jakie formalności trzeba załatwić po porodzie?',
          'Daj bezpośredni link do złożenia wniosku o 800+'
        ],
        previousUserMessages
      ),
      source: 'Pacjent.gov.pl & IMiD',
      askStageClarification: false
    };
  }

  // 8. Rejestracja dziecka / formalności po porodzie
  if (q.includes('usc') || q.includes('pesel') || q.includes('urodzen') || q.includes('formalnos') || q.includes('zcna')) {
    return {
      text:
        `Po narodzinach dziecka najważniejsze formalności załatwisz bezpłatnie i w większości bez wychodzenia z domu:\n\n` +
        `1. **Rejestracja urodzenia w USC i numer PESEL (do 21 dni od wystawienia karty urodzenia):**\n` +
        `Zaloguj się Profilem Zaufanym na Gov.pl — otrzymasz akt urodzenia, numer PESEL i zameldowanie dziecka.\n` +
        `[Zgłoś urodzenie dziecka online na Gov.pl](https://www.gov.pl/web/gov/zglos-urodzenie-dziecka)\n` +
        `2. **Zgłoszenie do ubezpieczenia zdrowotnego NFZ (druk ZCNA – do 7 dni od nadania PESEL):**\n` +
        `Zgłoś dziecko u swojego pracodawcy (lub przez eZUS, jeśli prowadzisz działalność).\n` +
        `3. **Wniosek o zasiłek macierzyński / urlop rodzicielski (do 21 dni od porodu):**\n` +
        `Złóż wniosek u pracodawcy (lub przez eZUS), aby otrzymywać 81,5% zasiłku przez cały rok.\n` +
        `4. **Wniosek o 800+ (do 3 miesięcy od porodu):**\n` +
        `[Złóż wniosek 800+ na eZUS / PUE ZUS](https://www.zus.pl/ezus)`,
      followUps: deduplicateFollowUps(
        [
          'Jakie inne świadczenia przysługują po urodzeniu dziecka?',
          'Ile wynosi zasiłek macierzyński i jak długo trwa?',
          'Jak działają urlop ojcowski i 9 tygodni dla taty?'
        ],
        previousUserMessages
      ),
      source: 'ZUS.pl & Gov.pl (eZUS / Emp@tia)',
      askStageClarification: false
    };
  }

  // 9. Karmienie i dieta
  if (q.includes('karm') || q.includes('dieta') || q.includes('mleko') || q.includes('rozszerzani')) {
    return {
      text:
        `Zasady żywienia dziecka zależą od jego wieku:\n\n` +
        `- **0–6 miesięcy:** wyłączne karmienie piersią na żądanie (8–12 razy na dobę) lub mlekiem modyfikowanym — w tym okresie nie podajemy wody ani stałych pokarmów.\n` +
        `- **Po 6. miesiącu (6–12 mies.):** stopniowe rozszerzanie diety o warzywa, owoce, kasze, mięso, ryby, jajko oraz potencjalne alergeny (np. masło orzechowe bez soli). Podajemy wodę z otwartego kubeczka.\n` +
        `- **Po 1. roku życia:** 5 regularnych posiłków dziennie zbliżonych do zdrowej diety całej rodziny, bez dosalania i bez cukru dodanego.`,
      followUps: deduplicateFollowUps(
        [
          'Ile powinno spać dziecko?',
          'Jaką temperaturę powinna mieć woda do kąpieli?',
          'Jakie szczepienia czekają maluszka w 1. roku życia?'
        ],
        previousUserMessages
      ),
      source: 'Pacjent.gov.pl & IMiD',
      askStageClarification: stageId === 'all'
    };
  }

  // 10. Uniwersalna odpowiedź na każde inne pytanie
  const ageAsk = isAgeDependentQuestion(userQuery) && stageId === 'all';
  return {
    text:
      `Chętnie Ci w tym pomogę! Oto najważniejsze, praktyczne informacje dotyczące Twojego pytania (**„${userQuery.trim()}”**):\n\n` +
      `- **Wsparcie zdrowotne i opiekuńcze:** Aktualne zalecenia pediatryczne, kalendarz badań w ciąży oraz harmonogram szczepień znajdziesz w oficjalnym serwisie Ministerstwa Zdrowia.\n` +
      `[Otwórz Pacjent.gov.pl](https://pacjent.gov.pl)\n` +
      `- **Sprawy urzędowe i świadczenia ZUS (800+, Aktywny Rodzic, zasiłek macierzyński):** Wszystkie wnioski złożysz elektronicznie bez wychodzenia z domu.\n` +
      `[Przejdź do eZUS / PUE ZUS](https://www.zus.pl/ezus)\n\n` +
      `Możesz dopytać o konkretny szczegół (np. terminy, kwoty, badania w konkretnym tygodniu ciąży lub pielęgnację w danym wieku dziecka), a podam Ci dokładną instrukcję krok po kroku.`,
    followUps: deduplicateFollowUps(
      [
        'Jakie świadczenia przysługują po urodzeniu dziecka?',
        'Daj bezpośredni link do złożenia wniosku o 800+',
        'Ile powinno spać dziecko?'
      ],
      previousUserMessages
    ),
    source: detectTopicSource(userQuery),
    askStageClarification: ageAsk
  };
}

// ============================================================================
// BEZPIECZNY PARSER FORMATOWANIA WIADOMOŚCI AI (NIGDY NIE UCINA TEKSTU)
// ============================================================================

function FormattedMessageContent({ text, isDark }) {
  // Oczyszczenie ewentualnych niedomkniętych markerów pogrubienia na samym końcu tekstu
  const sanitizedText = useMemo(() => {
    if (!text) return '';
    let cleaned = text.replace(/\r\n/g, '\n');
    const boldMatches = cleaned.match(/\*\*/g);
    if (boldMatches && boldMatches.length % 2 !== 0) {
      const lastIdx = cleaned.lastIndexOf('**');
      cleaned = cleaned.slice(0, lastIdx) + cleaned.slice(lastIdx + 2);
    }
    return cleaned;
  }, [text]);

  // Renderowanie fragmentu linii z obsługą [Link](https://...) oraz **pogrubień**
  const renderInlineTokens = (lineStr, keyPrefix) => {
    const tokenRegex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*)/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    let tokenIdx = 0;

    while ((match = tokenRegex.exec(lineStr)) !== null) {
      if (match.index > lastIndex) {
        elements.push(
          <span key={`${keyPrefix}-t-${tokenIdx++}`}>
            {lineStr.slice(lastIndex, match.index)}
          </span>
        );
      }

      if (match[2] && match[3]) {
        // Klikalny przycisk-link zewnętrzny
        const label = match[2];
        const url = match[3];
        let domain = '';
        try {
          domain = new URL(url).hostname.replace(/^www\./, '');
        } catch {
          domain = 'gov.pl';
        }
        elements.push(
          <a
            key={`${keyPrefix}-link-${tokenIdx++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 my-1.5 mr-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all shadow-sm hover:shadow ${
              isDark
                ? 'bg-[#2C1F24] border-[#D4748E]/50 text-[#F4B6C6] hover:bg-[#3A272E]'
                : 'bg-[#FDF4F6] border-[#D4748E]/40 text-[#9E3F5A] hover:bg-[#FAE6EC]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
            <span
              className={`text-[11px] font-normal px-1.5 py-0.5 rounded-md ${
                isDark ? 'bg-black/30 text-[#D8C7C2]' : 'bg-white/80 text-[#7A6A65]'
              }`}
            >
              {domain}
            </span>
          </a>
        );
      } else if (match[4]) {
        elements.push(
          <strong
            key={`${keyPrefix}-b-${tokenIdx++}`}
            className={isDark ? 'font-semibold text-white' : 'font-semibold text-[#231C1A]'}
          >
            {match[4]}
          </strong>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < lineStr.length) {
      elements.push(
        <span key={`${keyPrefix}-end`}>{lineStr.slice(lastIndex)}</span>
      );
    }

    return elements;
  };

  const lines = sanitizedText.split('\n');

  return (
    <div className="space-y-1.5 text-sm sm:text-[15px] leading-relaxed break-words">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={`sp-${idx}`} className="h-1" />;
        }

        // Lista punktowana
        if (/^[-*•]\s+/.test(trimmed)) {
          const content = trimmed.replace(/^[-*•]\s+/, '');
          return (
            <div key={`ul-${idx}`} className="flex items-start gap-2.5 pl-1">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#D4748E] shrink-0" />
              <div className="flex-1">{renderInlineTokens(content, `ul-${idx}`)}</div>
            </div>
          );
        }

        // Lista numerowana
        const numMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={`ol-${idx}`} className="flex items-start gap-2.5 pl-1">
              <span className="font-semibold text-[#D4748E] min-w-[1.25rem] shrink-0">
                {numMatch[1]}
              </span>
              <div className="flex-1">{renderInlineTokens(numMatch[2], `ol-${idx}`)}</div>
            </div>
          );
        }

        return (
          <div key={`p-${idx}`}>
            {renderInlineTokens(trimmed, `p-${idx}`)}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// WYWOŁANIE GEMINI API (Z BACKOFFEM, MAX_TOKENS 1200 I STRUKTURĄ JSON)
// ============================================================================

async function fetchGeminiAssistantReply({
  userQuery,
  stageId,
  pregnancyWeek,
  chatHistory,
  previousUserMessages
}) {
  const apiKey = '';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const stageLabel = getStageDisplayLabel(stageId, pregnancyWeek);

  const systemInstruction = `Jesteś „Przewodnikiem MAMA+” — ciepłym, empatycznym i niezwykle konkretnym polskim asystentem dla przyszłych mam, ojców i rodziców (kampania edukacyjna ZUS „Przewodnik Przyszłej Mamy”).

BEZWZGLĘDNE ZASADY DZIAŁANIA:
1. NIGDY NIE BLOKUJ ODPOWIEDZI WYBRANYM ETAPEM:
   - Aktualnie wybrany filtr etapu użytkownika to: "${stageLabel}".
   - Nawet jeśli użytkownik ma zaznaczoną "Ciążę (22. tydz.)", a pyta o wniosek 800+, link do formularza, Aktywny Rodzic lub kąpiel 3-latka — ZAWSZE udziel pełnej, konkretnej odpowiedzi i podaj bezpośredni klikalny link! Dodaj jedynie maksymalnie 1 życzliwe zdanie kontekstu dopasowane do etapu (np. "Wniosek o 800+ wyślesz po nadaniu dziecku numeru PESEL po porodzie, ale oto bezpośredni link do formularza na eZUS/PUE ZUS:").
2. INTELIGENTNE DOPYTYWANIE O WIEK DOPIERO PO ZAPYTANIU:
   - Jeśli aktualny filtr to "Wszystkie etapy", a pytanie dotyczy tematu zależnego od wieku dziecka (np. ile powinno spać dziecko, temperatura kąpieli, karmienie, szczepienia, świadczenia):
     a) Najpierw podaj krótką, uniwersalną odpowiedź ogólną obejmującą główne przedziały wiekowe.
     b) Ustaw pole "askStageClarification" na true (aplikacja automatycznie wyświetli pod spodem przyciski wyboru wieku).
   - Jeśli użytkownik już wybrał konkretny etap ALBO podał wiek w swoim pytaniu ALBO pytanie dotyczy konkretnego wniosku/linku (np. link do 800+, torba do szpitala), ustaw "askStageClarification" na false.
3. LINKI I FORMATOWANIE:
   - Gdy użytkownik pyta o link lub gdzie złożyć wniosek, ZAWSZE podawaj prawdziwe, pełne adresy w formacie markdown [Nazwa przycisku](https://...):
     * [Przejdź do eZUS / PUE ZUS](https://www.zus.pl/ezus)
     * [Otwórz Portal Emp@tia](https://empatia.mpips.gov.pl)
     * [Zgłoś urodzenie dziecka online (Gov.pl)](https://www.gov.pl/web/gov/zglos-urodzenie-dziecka)
     * [Program Aktywny Rodzic (ZUS.pl)](https://www.zus.pl/aktywnyrodzic)
     * [Serwis Pacjent.gov.pl](https://pacjent.gov.pl)
   - Używaj przejrzystych list punktowanych (- ) lub numerowanych (1. ) oraz pogrubień (**tekst**). Zawsze zamykaj wszystkie znaczniki pogrubienia i pisz pełne, kompletne zdania bez ucinania.
4. PODPOWIEDZI I ŹRÓDŁA:
   - W polu "followUps" podaj 3 kolejne, logiczne pytania pogłębiające. NIGDY nie powtarzaj pytania, które użytkownik już zadał (${JSON.stringify(previousUserMessages.slice(-5))}).
   - W polu "source" podaj dokładnie jedną z dopasowanych etykiet źródłowych:
     * "ZUS.pl & Gov.pl (eZUS / Emp@tia)" — dla spraw urzędowych, 800+, Aktywny Rodzic, zasiłków, USC, PESEL
     * "Pacjent.gov.pl & IMiD" — dla zdrowia, ciąży, badań, snu, kąpieli i opieki nad dzieckiem
     * "Gov.pl & Kodeks pracy" — dla urlopów rodzicielskich, ojcowskich i praw pracowniczych mamy`;

  const recentContext = chatHistory
    .slice(-4)
    .map((m) => `${m.sender === 'user' ? 'Użytkownik' : 'Przewodnik MAMA+'}: ${m.text}`)
    .join('\n');

  const promptText = `${recentContext ? `Dotychczasowy kontekst rozmowy:\n${recentContext}\n\n` : ''}Aktualny filtr etapu: ${stageLabel}\nPytanie użytkownika: ${userQuery}`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: promptText }] }],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      maxOutputTokens: 1200,
      temperature: 0.45,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          answer: { type: 'STRING' },
          followUps: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          },
          source: { type: 'STRING' },
          askStageClarification: { type: 'BOOLEAN' }
        },
        required: ['answer', 'followUps', 'source', 'askStageClarification']
      }
    }
  };

  const delays = [1000, 2000, 4000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (attempt < delays.length) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
          continue;
        }
        throw new Error('API request failed');
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response');

      const parsed = JSON.parse(rawText);
      if (!parsed.answer || parsed.answer.trim().length < 15) {
        throw new Error('Incomplete answer');
      }

      const cleanedFollowUps = deduplicateFollowUps(
        parsed.followUps || [],
        previousUserMessages
      );

      return {
        text: parsed.answer.trim(),
        followUps:
          cleanedFollowUps.length > 0
            ? cleanedFollowUps
            : deduplicateFollowUps(
                [
                  'Jakie dokumenty warto przygotować?',
                  'Jakie inne świadczenia przysługują rodzicom?',
                  'O czym pamiętać na kolejnym etapie?'
                ],
                previousUserMessages
              ),
        source: parsed.source || detectTopicSource(userQuery, parsed.answer),
        askStageClarification:
          stageId === 'all' && Boolean(parsed.askStageClarification)
      };
    } catch {
      if (attempt < delays.length) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  }

  // Niezawodny fallback lokalny (gdy offline lub brak połączenia z API)
  return buildSmartFallbackResponse({
    userQuery,
    stageId,
    pregnancyWeek,
    previousUserMessages
  });
}

// ============================================================================
// GŁÓWNY KOMPONENT APLIKACJI: MAMA+ – INTELIGENTNY PRZEWODNIK RODZICA
// ============================================================================

export default function App() {
  // Motyw jasny / ciemny
  const [isDark, setIsDark] = useState(false);

  // Nawigacja główna
  const [activeTab, setActiveTab] = useState('assistant');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Powiadomienia Toast (zamiast alert/confirm)
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // --- STAN ASYSTENTA AI ---
  // Domyślnie: "all" (Wszystkie etapy — brak narzucania wieku na starcie!)
  const [selectedStage, setSelectedStage] = useState('all');
  const [pregnancyWeek, setPregnancyWeek] = useState(22);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [dismissedClarificationIds, setDismissedClarificationIds] = useState({});

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stageContext: 'Wszystkie etapy',
      text:
        'Witaj w **Przewodniku MAMA+**! Jestem Twoim przyjaznym asystentem od spraw ZUS, świadczeń (800+, Aktywny Rodzic, zasiłek macierzyński), ciąży oraz opieki nad dzieckiem.\n\n' +
        'Możesz od razu zadać dowolne pytanie — **nie musisz wcześniej wybierać wieku dziecka**. Jeśli będzie to pomocne, po Twoim pytaniu zaproponuję dopasowanie odpowiedzi do konkretnego etapu.',
      followUps: [
        'Daj bezpośredni link do złożenia wniosku o 800+',
        'Ile powinno spać dziecko?',
        'Jaką temperaturę powinna mieć woda do kąpieli?'
      ],
      source: 'ZUS.pl, Pacjent.gov.pl & Gov.pl',
      askStageClarification: false
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'assistant') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeTab]);

  // Wysłanie zapytania do Asystenta AI
  const handleSendMessage = async (customText = null, overrideStageId = null) => {
    const rawText = typeof customText === 'string' ? customText : inputQuery;
    const trimmed = rawText.trim();
    if (!trimmed || isTyping) return;

    const effectiveStageId = overrideStageId || selectedStage;
    const stageContextLabel = getStageDisplayLabel(effectiveStageId, pregnancyWeek);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: nowTime,
      stageContext: stageContextLabel,
      text: trimmed
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customText) setInputQuery('');
    setIsTyping(true);

    const previousUserMessages = updatedMessages
      .filter((m) => m.sender === 'user')
      .map((m) => m.text);

    const reply = await fetchGeminiAssistantReply({
      userQuery: trimmed,
      stageId: effectiveStageId,
      pregnancyWeek,
      chatHistory: updatedMessages,
      previousUserMessages
    });

    const botMsg = {
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stageContext: stageContextLabel,
      text: reply.text,
      followUps: reply.followUps,
      source: reply.source,
      askStageClarification: reply.askStageClarification,
      relatedUserQuery: trimmed
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  // Wybór etapu z poziomu podpowiedzi pod wiadomością bota (po wpisaniu zapytania!)
  const handleClarifyStageFromMessage = (msgId, newStageId, originalQuery) => {
    setSelectedStage(newStageId);
    setDismissedClarificationIds((prev) => ({ ...prev, [msgId]: true }));
    const stageLabel = getStageDisplayLabel(newStageId, pregnancyWeek);
    handleSendMessage(
      `Dopasuj odpowiedź do etapu: ${stageLabel} (pytanie: ${originalQuery})`,
      newStageId
    );
  };

  const handleCopyMessage = (id, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(id);
    showToast('Skopiowano treść odpowiedzi do schowka');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setSelectedStage('all');
    setDismissedClarificationIds({});
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stageContext: 'Wszystkie etapy',
        text:
          'Rozpoczęliśmy nową rozmowę w trybie **Wszystkie etapy (bez ograniczeń)**. Wpisz dowolne pytanie o świadczenia ZUS, 800+, ciążę lub opiekę nad dzieckiem!',
        followUps: [
          'Daj bezpośredni link do złożenia wniosku o 800+',
          'Jakie świadczenia przysługują po urodzeniu dziecka?',
          'Jaką temperaturę powinna mieć woda do kąpieli?'
        ],
        source: 'ZUS.pl, Pacjent.gov.pl & Gov.pl',
        askStageClarification: false
      }
    ]);
    showToast('Wyczyszczono historię rozmowy');
  };

  const openAssistantWithQuestion = (question, stageToSet = null) => {
    if (stageToSet) setSelectedStage(stageToSet);
    setActiveTab('assistant');
    setTimeout(() => {
      handleSendMessage(question, stageToSet || selectedStage);
    }, 80);
  };

  // --- STAN ZAKŁADKI „MOJA CIĄŻA” ---
  const [checkedBagItems, setCheckedBagItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mamaplus_bag_v2');
      return saved ? JSON.parse(saved) : { 'doc-1': true, 'doc-2': true };
    } catch {
      return { 'doc-1': true, 'doc-2': true };
    }
  });

  const toggleBagItem = (id) => {
    setCheckedBagItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('mamaplus_bag_v2', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const currentTrimesterData = useMemo(() => {
    return (
      PREGNANCY_WEEKS_DATA.find(
        (t) => pregnancyWeek >= t.range[0] && pregnancyWeek <= t.range[1]
      ) || PREGNANCY_WEEKS_DATA[1]
    );
  }, [pregnancyWeek]);

  // --- STAN ZAKŁADKI „OPIEKA NAD DZIECKIEM” ---
  const [careAge, setCareAge] = useState('0-6m');
  const [careCategory, setCareCategory] = useState('sleep');

  // --- STAN ZAKŁADKI „ŚWIADCZENIA I ZUS” (Z EDYCJĄ PARAMETRÓW) ---
  const [benefitsList, setBenefitsList] = useState(INITIAL_BENEFITS);
  const [editingBenefitId, setEditingBenefitId] = useState(null);
  const [editAmountVal, setEditAmountVal] = useState('');
  const [editDeadlineVal, setEditDeadlineVal] = useState('');
  const [selectedCalcIds, setSelectedCalcIds] = useState({
    '800plus': true,
    'aktywny-rodzic': true,
    kosiniakowe: false,
    becikowe: true
  });

  const startEditingBenefit = (item) => {
    setEditingBenefitId(item.id);
    setEditAmountVal(String(item.amount));
    setEditDeadlineVal(item.deadline);
  };

  const saveBenefitEdit = (id) => {
    const parsedNum = parseFloat(editAmountVal.replace(',', '.'));
    setBenefitsList((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              amount: Number.isFinite(parsedNum) && parsedNum >= 0 ? parsedNum : b.amount,
              deadline: editDeadlineVal.trim() || b.deadline
            }
          : b
      )
    );
    setEditingBenefitId(null);
    showToast('Zaktualizowano parametry świadczenia');
  };

  const resetBenefitsDefaults = () => {
    setBenefitsList(INITIAL_BENEFITS);
    setEditingBenefitId(null);
    showToast('Przywrócono domyślne stawki i terminy ustawowe');
  };

  const estimatedTotalSupport = useMemo(() => {
    return benefitsList.reduce((acc, item) => {
      if (!selectedCalcIds[item.id]) return acc;
      if (item.id === 'macierzynski' || item.id === 'urlop-ojcowski') return acc;
      return acc + (Number(item.amount) || 0);
    }, 0);
  }, [benefitsList, selectedCalcIds]);

  // --- STAN ZAKŁADKI „PORADNIKI I KALENDARZ RODZICA” ---
  const [guideSearch, setGuideSearch] = useState('');
  const [calendarEvents, setCalendarEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('mamaplus_cal_v2');
      return saved ? JSON.parse(saved) : DEFAULT_CALENDAR_EVENTS;
    } catch {
      return DEFAULT_CALENDAR_EVENTS;
    }
  });
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-12-15');
  const [newEventCat, setNewEventCat] = useState('ZUS / Urząd');

  const saveCalendar = (nextEvents) => {
    setCalendarEvents(nextEvents);
    try {
      localStorage.setItem('mamaplus_cal_v2', JSON.stringify(nextEvents));
    } catch {}
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const next = [
      ...calendarEvents,
      {
        id: `ev-${Date.now()}`,
        date: newEventDate || '2026-12-15',
        title: newEventTitle.trim(),
        category: newEventCat,
        done: false
      }
    ].sort((a, b) => a.date.localeCompare(b.date));
    saveCalendar(next);
    setNewEventTitle('');
    showToast('Dodano wydarzenie do Kalendarza Rodzica');
  };

  const filteredGuides = useMemo(() => {
    const q = normalizeText(guideSearch);
    if (!q) return GUIDES_LIBRARY;
    return GUIDES_LIBRARY.filter(
      (g) =>
        normalizeText(g.title).includes(q) ||
        normalizeText(g.summary).includes(q) ||
        normalizeText(g.tag).includes(q)
    );
  }, [guideSearch]);

  // ============================================================================
  // STYLE POMOCNICZE DLA TRYBU JASNEGO I CIEMNEGO
  // ============================================================================

  const bgMain = isDark ? 'bg-[#161413] text-[#F5EFEA]' : 'bg-[#FAF6F2] text-[#2D2624]';
  const bgCard = isDark
    ? 'bg-[#211E1C] border-[#332E2B]'
    : 'bg-white border-[#EFE6DF]';
  const textMuted = isDark ? 'text-[#B8ACA6]' : 'text-[#6E605B]';

  const navItems = [
    { id: 'home', label: 'Strona główna', icon: Home },
    { id: 'assistant', label: 'Asystent AI', icon: Sparkles, badge: 'AI' },
    { id: 'pregnancy', label: 'Moja ciąża', icon: Heart },
    { id: 'care', label: 'Opieka nad dzieckiem', icon: Baby },
    { id: 'benefits', label: 'Świadczenia i ZUS', icon: ShieldCheck },
    { id: 'guides', label: 'Poradniki i Kalendarz', icon: Calendar }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${bgMain}`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2D2624] text-white text-sm font-medium shadow-xl border border-[#D4748E]/40">
          <CheckCircle2 className="w-4 h-4 text-[#84C5A3] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ====================================================================
          GÓRNY PASEK NAWIGACJI (HEADER)
         ==================================================================== */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#1A1715]/90 border-[#332E2B]'
            : 'bg-white/90 border-[#EFE6DF]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo MAMA+ */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4748E] to-[#B85470] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white/90" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">MAMA+</span>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF5F1] text-[#3B6B53]">
                  Przewodnik Przyszłej Mamy
                </span>
              </div>
              <p className={`text-xs ${textMuted} hidden md:block`}>
                Inteligentny Przewodnik Rodzica • ZUS, Zdrowie i Opieka
              </p>
            </div>
          </button>

          {/* Nawigacja Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#D4748E] text-white shadow-sm'
                      : isDark
                      ? 'text-[#D6CBC6] hover:bg-[#2A2522]'
                      : 'text-[#524642] hover:bg-[#F7EFEA]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-[#FDF4F6] text-[#B85470]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Prawa strona: Przełącznik motywu + menu mobilne */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Przełącz tryb jasny lub ciemny"
              className={`p-2.5 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-[#25211F] border-[#3A3430] text-[#F5D0A9] hover:bg-[#2F2A27]'
                  : 'bg-[#FAF6F2] border-[#E8DDD5] text-[#5C4E49] hover:bg-[#F2EAE3]'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Otwórz menu nawigacji"
              className={`lg:hidden p-2.5 rounded-xl border ${
                isDark
                  ? 'bg-[#25211F] border-[#3A3430] text-white'
                  : 'bg-[#FAF6F2] border-[#E8DDD5] text-[#2D2624]'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Nawigacja Mobilna */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2 ${
              isDark ? 'bg-[#1D1A18] border-[#332E2B]' : 'bg-white border-[#EFE6DF]'
            }`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-[#D4748E] text-white'
                      : isDark
                      ? 'bg-[#262220] text-[#E5DBD6]'
                      : 'bg-[#FAF6F2] text-[#3F3532]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ====================================================================
          GŁÓWNA ZAWARTOŚĆ PODSTRON
         ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ------------------------------------------------------------------
            1. STRONA GŁÓWNA (HOME)
           ------------------------------------------------------------------ */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <section
              className={`rounded-3xl border p-6 sm:p-10 relative overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-br from-[#271E21] via-[#211E1C] to-[#1B2420] border-[#3B2E32]'
                  : 'bg-gradient-to-br from-[#FDF4F6] via-white to-[#EEF5F1] border-[#EEDCE2]'
              }`}
            >
              <div className="max-w-3xl space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#D4748E]/15 text-[#B85470]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kampania edukacyjna ZUS • Przewodnik Przyszłej Mamy</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                  Spokojne wsparcie w ciąży, rodzicielstwie i formalnościach ZUS
                </h1>

                <p className={`text-base sm:text-lg leading-relaxed ${textMuted}`}>
                  Zadaj dowolne pytanie Asystentowi AI bez wstępnych formularzy, sprawdź bezpośrednie
                  linki do wniosków <strong>800+</strong> i <strong>Aktywny Rodzic</strong>, kontroluj
                  kalendarz badań w ciąży oraz opiekę nad dzieckiem od narodzin do 6. roku życia.
                </p>

                {/* Szybkie pole pytania na stronie głównej */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    onClick={() => setActiveTab('assistant')}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#D4748E] hover:bg-[#C2607B] text-white font-semibold shadow-md transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Otwórz Asystenta AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('benefits')}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border font-semibold transition-all ${
                      isDark
                        ? 'bg-[#25211F] border-[#3D3632] text-white hover:bg-[#2F2A27]'
                        : 'bg-white border-[#E4D8D0] text-[#2D2624] hover:bg-[#FAF6F2]'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-[#5B8A72]" />
                    <span>Świadczenia ZUS i 800+</span>
                  </button>
                </div>

                {/* Popularne pytania jednym kliknięciem */}
                <div className="pt-2">
                  <p className={`text-xs font-medium mb-2 ${textMuted}`}>
                    Najczęstsze pytania — kliknij, aby od razu uzyskać odpowiedź:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STARTER_QUESTIONS.slice(0, 4).map((q) => (
                      <button
                        key={q}
                        onClick={() => openAssistantWithQuestion(q, 'all')}
                        className={`text-xs sm:text-sm px-3.5 py-2 rounded-full border transition-all text-left ${
                          isDark
                            ? 'bg-[#25211F] border-[#3A3330] text-[#EADFD9] hover:border-[#D4748E]'
                            : 'bg-white/90 border-[#E5D5DC] text-[#5C3A45] hover:border-[#D4748E] hover:bg-[#FDF4F6]'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 4 główne filary aplikacji */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  tab: 'assistant',
                  icon: Bot,
                  color: 'text-[#D4748E] bg-[#FDF4F6]',
                  title: 'Asystent AI bez barier',
                  desc: 'Odpowiada na każde pytanie od razu, podaje bezpośrednie linki i dopytuje o wiek dopiero gdy potrzeba.'
                },
                {
                  tab: 'pregnancy',
                  icon: Heart,
                  color: 'text-[#B85470] bg-[#FCEEF2]',
                  title: 'Moja ciąża (1–42 tydz.)',
                  desc: 'Interaktywny suwak tygodni, kalendarz badań prenatalnych, wyprawka do szpitala i prawa mamy.'
                },
                {
                  tab: 'care',
                  icon: Baby,
                  color: 'text-[#5B8A72] bg-[#EEF5F1]',
                  title: 'Opieka nad dzieckiem',
                  desc: '5 grup wiekowych i 7 praktycznych kategorii: sen, kąpiel, karmienie, rozwój i bezpieczeństwo.'
                },
                {
                  tab: 'benefits',
                  icon: ShieldCheck,
                  color: 'text-[#4D7C65] bg-[#EAF3EE]',
                  title: 'Świadczenia i eZUS',
                  desc: '800+, Aktywny Rodzic, zasiłek macierzyński, Kosiniakowe, USC oraz kalkulator z edycją stawek.'
                }
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.tab}
                    onClick={() => setActiveTab(card.tab)}
                    className={`p-5 rounded-2xl border text-left transition-all hover:shadow-md flex flex-col justify-between gap-4 ${bgCard}`}
                  >
                    <div className="space-y-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="font-bold text-base">{card.title}</h2>
                      <p className={`text-sm leading-relaxed ${textMuted}`}>{card.desc}</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4748E]">
                      <span>Przejdź do sekcji</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </section>

            {/* Oficjalne portale rządowe i ZUS */}
            <section className={`rounded-3xl border p-6 ${bgCard}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <div>
                  <h2 className="font-bold text-lg">Oficjalne portale i wnioski online</h2>
                  <p className={`text-sm ${textMuted}`}>
                    Bezpośrednie, zweryfikowane adresy ZUS, Emp@tia, Gov.pl oraz Pacjent.gov.pl
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {OFFICIAL_PORTALS.map((portal) => (
                  <a
                    key={portal.url}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 hover:border-[#D4748E] ${
                      isDark
                        ? 'bg-[#191715] border-[#332E2B]'
                        : 'bg-[#FAF6F2]/70 border-[#EAE0D8]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EEF5F1] text-[#3B6B53]">
                        {portal.tag}
                      </span>
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        <span>{portal.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#D4748E] shrink-0" />
                      </div>
                      <p className={`text-xs leading-relaxed ${textMuted}`}>{portal.desc}</p>
                    </div>
                    <span className="text-[11px] font-medium text-[#D4748E] truncate">
                      {portal.url.replace('https://', '')}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------
            2. ASYSTENT AI (PRIORYTETOWO ULEPSZONY I INTUICYJNY)
           ------------------------------------------------------------------ */}
        {activeTab === 'assistant' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Nagłówek Asystenta + Opcjonalny pasek wyboru etapu */}
            <div className={`rounded-3xl border p-4 sm:p-5 space-y-3.5 ${bgCard}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF4F6] border border-[#EED2DA] flex items-center justify-center text-[#D4748E]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-bold text-base sm:text-lg flex items-center gap-2">
                      <span>Przewodnik MAMA+ AI</span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF5F1] text-[#3B6B53]">
                        Odpowiada na każde pytanie
                      </span>
                    </h1>
                    <p className={`text-xs ${textMuted}`}>
                      Zapytaj o linki do wniosków, świadczenia ZUS, ciążę lub opiekę nad dzieckiem
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetChat}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-colors ${
                    isDark
                      ? 'border-[#3A3430] text-[#C8BBB5] hover:bg-[#2A2522]'
                      : 'border-[#E6DAD2] text-[#6B5D58] hover:bg-[#FAF6F2]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Nowa rozmowa</span>
                </button>
              </div>

              {/* Opcjonalny pasek wyboru etapu (Domyślnie: Wszystkie etapy) */}
              <div
                className={`pt-3 border-t ${
                  isDark ? 'border-[#332E2B]' : 'border-[#F2E9E3]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-xs font-medium ${textMuted}`}>
                    Opcjonalnie dopasuj do etapu (możesz też zapytać od razu bez wybierania):
                  </span>
                  {selectedStage !== 'all' && (
                    <button
                      onClick={() => setSelectedStage('all')}
                      className="text-xs font-semibold text-[#D4748E] hover:underline"
                    >
                      Pokaż wszystkie etapy
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((stage) => {
                    const active = selectedStage === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => setSelectedStage(stage.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          active
                            ? 'bg-[#D4748E] border-[#D4748E] text-white shadow-sm'
                            : isDark
                            ? 'bg-[#1A1715] border-[#38322E] text-[#D2C6C0] hover:border-[#D4748E]/60'
                            : 'bg-[#FAF6F2] border-[#E6D9D1] text-[#524642] hover:border-[#D4748E]/60'
                        }`}
                      >
                        {stage.label}
                        {stage.id === 'pregnancy' && active ? ` (${pregnancyWeek}. tydz.)` : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Suwak tygodnia ciąży pojawia się wyłącznie, gdy użytkownik świadomie kliknie „Ciąża” */}
                {selectedStage === 'pregnancy' && (
                  <div
                    className={`mt-3 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3 ${
                      isDark ? 'bg-[#2A1F23]' : 'bg-[#FDF4F6]'
                    }`}
                  >
                    <span className="text-xs font-semibold text-[#B85470] whitespace-nowrap">
                      Tydzień ciąży: {pregnancyWeek}. tydz.
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={42}
                      value={pregnancyWeek}
                      onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                      className="w-full accent-[#D4748E] cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Okno wiadomości czatu */}
            <div
              className={`rounded-3xl border p-4 sm:p-6 space-y-5 min-h-[420px] max-h-[62vh] overflow-y-auto ${bgCard}`}
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const showClarification =
                  !isUser &&
                  msg.askStageClarification &&
                  selectedStage === 'all' &&
                  !dismissedClarificationIds[msg.id];

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Awatar bota po lewej */}
                    {!isUser && (
                      <div className="w-9 h-9 rounded-full bg-[#FDF4F6] border border-[#EED0D9] flex items-center justify-center text-[#D4748E] shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    {/* Dymek wiadomości */}
                    <div
                      className={`max-w-[90%] sm:max-w-[82%] rounded-2xl px-4 py-3.5 shadow-sm ${
                        isUser
                          ? 'bg-[#C86681] text-white rounded-tr-sm'
                          : isDark
                          ? 'bg-[#272320] border border-[#38322E] text-[#F4EEE9] rounded-tl-sm'
                          : 'bg-[#FDF8F6] border border-[#EFE2DC] text-[#2D2624] rounded-tl-sm'
                      }`}
                    >
                      {/* Nagłówek dymka */}
                      <div
                        className={`flex items-center justify-between gap-4 text-[11px] mb-1.5 ${
                          isUser ? 'text-white/85' : textMuted
                        }`}
                      >
                        <span className="font-medium">
                          {isUser
                            ? `Ty • ${msg.stageContext}`
                            : `Przewodnik MAMA+ • ${msg.stageContext}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              title="Kopiuj odpowiedź"
                              className="opacity-70 hover:opacity-100 transition-opacity"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-[#5B8A72]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Treść wiadomości */}
                      {isUser ? (
                        <p className="text-sm sm:text-[15px] leading-relaxed">{msg.text}</p>
                      ) : (
                        <FormattedMessageContent text={msg.text} isDark={isDark} />
                      )}

                      {/* Post-query Age Clarification Card (pyta o wiek DOPIERO PO zapytaniu, gdy to potrzebne!) */}
                      {showClarification && (
                        <div
                          className={`mt-3.5 p-3.5 rounded-2xl border ${
                            isDark
                              ? 'bg-[#1E2723] border-[#354B40]'
                              : 'bg-[#EEF5F1] border-[#CBE0D4]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p
                              className={`text-xs font-semibold ${
                                isDark ? 'text-[#9AD1B5]' : 'text-[#2D5A43]'
                              }`}
                            >
                              Chcesz dokładną odpowiedź dopasowaną do wieku? Wybierz etap:
                            </p>
                            <button
                              onClick={() =>
                                setDismissedClarificationIds((prev) => ({
                                  ...prev,
                                  [msg.id]: true
                                }))
                              }
                              className={`text-[11px] underline ${textMuted}`}
                            >
                              Ukryj
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {STAGES.filter((s) => s.id !== 'all').map((st) => (
                              <button
                                key={st.id}
                                onClick={() =>
                                  handleClarifyStageFromMessage(
                                    msg.id,
                                    st.id,
                                    msg.relatedUserQuery || 'to pytanie'
                                  )
                                }
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                                  isDark
                                    ? 'bg-[#26332D] border-[#456354] text-[#BCE6D0] hover:bg-[#31423A]'
                                    : 'bg-white border-[#B8D5C5] text-[#2D5A43] hover:bg-[#5B8A72] hover:text-white'
                                }`}
                              >
                                {st.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Podpowiedzi „Dopytaj o szczegóły” (nigdy nie powtarzają pytania użytkownika) */}
                      {!isUser && msg.followUps && msg.followUps.length > 0 && (
                        <div
                          className={`mt-3.5 pt-3 border-t ${
                            isDark ? 'border-[#38322E]' : 'border-[#EDE0DA]'
                          }`}
                        >
                          <p className={`text-xs font-medium mb-2 ${textMuted}`}>
                            Dopytaj o szczegóły:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.followUps.map((qItem, fIdx) => (
                              <button
                                key={`${msg.id}-f-${fIdx}`}
                                onClick={() => handleSendMessage(qItem)}
                                disabled={isTyping}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all text-left disabled:opacity-50 ${
                                  isDark
                                    ? 'bg-[#211E1C] border-[#D4748E]/40 text-[#F0B4C5] hover:bg-[#2F2327]'
                                    : 'bg-white border-[#E4BCC8] text-[#9E3F5A] hover:bg-[#FDF4F6]'
                                }`}
                              >
                                {qItem}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dopasowana etykieta źródła */}
                      {!isUser && msg.source && (
                        <div
                          className={`mt-3 pt-2.5 border-t flex items-center gap-2 text-[11px] ${
                            isDark ? 'border-[#38322E]' : 'border-[#EDE0DA]'
                          }`}
                        >
                          <span className={textMuted}>Źródła:</span>
                          <span
                            className={`inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full ${
                              isDark
                                ? 'bg-[#1F2D26] text-[#96CEB1]'
                                : 'bg-[#E9F3EE] text-[#35634B]'
                            }`}
                          >
                            <span>{msg.source}</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Awatar użytkownika po prawej */}
                    {isUser && (
                      <div className="w-9 h-9 rounded-full bg-[#5B8A72] flex items-center justify-center text-white shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Wskaźnik pisania odpowiedzi */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FDF4F6] border border-[#EED0D9] flex items-center justify-center text-[#D4748E]">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl border text-xs flex items-center gap-2 ${
                      isDark
                        ? 'bg-[#272320] border-[#38322E] text-[#C8BBB5]'
                        : 'bg-[#FDF8F6] border-[#EFE2DC] text-[#6E605B]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#D4748E] animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-[#D4748E] animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[#D4748E] animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                    <span className="ml-1">Przewodnik MAMA+ przygotowuje pełną odpowiedź...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Szybkie tematy startowe + Pole wpisywania pytania */}
            <div className={`rounded-3xl border p-4 space-y-3 ${bgCard}`}>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    disabled={isTyping}
                    className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors disabled:opacity-50 ${
                      isDark
                        ? 'bg-[#191715] border-[#36302C] text-[#D6CBC6] hover:border-[#D4748E]'
                        : 'bg-[#FAF6F2] border-[#E6D9D1] text-[#524642] hover:border-[#D4748E] hover:bg-[#FDF4F6]'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Wpisz dowolne pytanie, np. „Daj link do wniosku o 800+” lub „Ile powinno spać dziecko?”..."
                  className={`flex-1 px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#D4748E] ${
                    isDark
                      ? 'bg-[#181614] border-[#38322E] text-white placeholder-[#8B7E78]'
                      : 'bg-[#FAF6F2] border-[#E4D7CF] text-[#2D2624] placeholder-[#8E7F7A]'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#D4748E] hover:bg-[#C2607B] disabled:opacity-45 text-white font-semibold text-sm transition-all shadow-sm shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Zapytaj</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            3. MOJA CIĄŻA (1–42 TYDZIEŃ, BADANIA, WYPRAWKA, PRAWA MAMY)
           ------------------------------------------------------------------ */}
        {activeTab === 'pregnancy' && (
          <div className="space-y-6">
            {/* Suwak tygodnia ciąży */}
            <div className={`rounded-3xl border p-6 space-y-5 ${bgCard}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4748E]">
                    {currentTrimesterData.trimester}
                  </span>
                  <h1 className="text-2xl font-bold mt-0.5">
                    {pregnancyWeek}. tydzień ciąży
                  </h1>
                </div>
                <button
                  onClick={() =>
                    openAssistantWithQuestion(
                      `Jestem w ${pregnancyWeek}. tygodniu ciąży — o jakich badaniach i formalnościach ZUS warto teraz pamiętać?`,
                      'pregnancy'
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FDF4F6] text-[#9E3F5A] border border-[#E8C5D0] text-xs sm:text-sm font-semibold hover:bg-[#FAE6EC] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Zapytaj Asystenta o {pregnancyWeek}. tydzień</span>
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min={1}
                  max={42}
                  value={pregnancyWeek}
                  onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                  className="w-full accent-[#D4748E] cursor-pointer h-2"
                />
                <div className={`flex justify-between text-xs ${textMuted}`}>
                  <span>1. tydzień</span>
                  <span>14. tydzień (II trym.)</span>
                  <span>28. tydzień (III trym.)</span>
                  <span>42. tydzień</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-[#191715] border-[#332E2B]' : 'bg-[#FAF6F2] border-[#ECE1D9]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#D4748E] mb-1">Wielkość i rozwój dziecka</p>
                  <p className="font-bold text-sm mb-1.5">{currentTrimesterData.size}</p>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>
                    {currentTrimesterData.babyDev}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-[#191715] border-[#332E2B]' : 'bg-[#FAF6F2] border-[#ECE1D9]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#5B8A72] mb-1">Wskazówki dla Mamy</p>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>
                    {currentTrimesterData.motherTips}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-[#191715] border-[#332E2B]' : 'bg-[#FAF6F2] border-[#ECE1D9]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#B85470] mb-2">
                    Zalecane badania w tym trymestrze
                  </p>
                  <ul className="space-y-1.5">
                    {currentTrimesterData.tests.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-xs">
                        <Stethoscope className="w-3.5 h-3.5 text-[#D4748E] shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Wyprawka do szpitala + Prawa przyszłej mamy */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interaktywna checklista wyprawki */}
              <div className={`lg:col-span-2 rounded-3xl border p-6 space-y-4 ${bgCard}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-lg">Wyprawka do szpitala (Checklista)</h2>
                    <p className={`text-xs ${textMuted}`}>
                      Postęp zapisuje się automatycznie w Twojej przeglądarce
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF5F1] text-[#3B6B53]">
                    Spakowano:{' '}
                    {Object.values(checkedBagItems).filter(Boolean).length} /{' '}
                    {HOSPITAL_BAG_ITEMS.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Dokumenty', 'Dla Mamy', 'Dla Maluszka'].map((grp) => (
                    <div key={grp} className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4748E]">
                        {grp}
                      </h3>
                      <div className="space-y-2">
                        {HOSPITAL_BAG_ITEMS.filter((i) => i.group === grp).map((item) => {
                          const checked = Boolean(checkedBagItems[item.id]);
                          return (
                            <button
                              key={item.id}
                              onClick={() => toggleBagItem(item.id)}
                              className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border text-left text-xs transition-all ${
                                checked
                                  ? isDark
                                    ? 'bg-[#1D2B24] border-[#385748] text-[#B8DFC9]'
                                    : 'bg-[#EEF5F1] border-[#C5DDD0] text-[#2D5A43]'
                                  : isDark
                                  ? 'bg-[#191715] border-[#332E2B]'
                                  : 'bg-[#FAF6F2]/70 border-[#EAE0D8]'
                              }`}
                            >
                              {checked ? (
                                <CheckCircle2 className="w-4 h-4 text-[#5B8A72] shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-4 h-4 text-[#A39590] shrink-0 mt-0.5" />
                              )}
                              <span className={checked ? 'line-through opacity-85' : ''}>
                                {item.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prawa przyszłej mamy */}
              <div className={`rounded-3xl border p-6 space-y-4 ${bgCard}`}>
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-[#D4748E]" />
                  <h2 className="font-bold text-lg">Prawa mamy w pracy</h2>
                </div>
                <ul className="space-y-3 text-xs leading-relaxed">
                  <li className="p-3 rounded-2xl bg-[#FDF4F6] text-[#4B2B35]">
                    <strong>100% zasiłek chorobowy:</strong> Zwolnienie lekarskie w ciąży (kod B) jest płatne w 100% podstawy wymiaru (do 270 dni).
                  </li>
                  <li className="p-3 rounded-2xl bg-[#EEF5F1] text-[#274837]">
                    <strong>Zwolnienie na badania:</strong> Pracodawca ma obowiązek zwolnić Cię na zalecone badania ciążowe z zachowaniem pełnego wynagrodzenia.
                  </li>
                  <li className="p-3 rounded-2xl bg-[#FAF6F2] text-[#3E3532]">
                    <strong>Ochrona etatu:</strong> Zakaz wypowiedzenia umowy o pracę, zakaz pracy w porze nocnej i w godzinach nadliczbowych.
                  </li>
                </ul>
                <button
                  onClick={() =>
                    openAssistantWithQuestion(
                      'Jakie prawa przysługują kobiecie w ciąży w pracy i jak wyliczany jest zasiłek macierzyński?',
                      'pregnancy'
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4748E] text-white text-xs font-semibold hover:bg-[#C2607B] transition-colors"
                >
                  Dopytaj Asystenta o prawa w pracy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            4. OPIEKA NAD DZIECKIEM (5 GRUP WIEKOWYCH × 7 KATEGORII)
           ------------------------------------------------------------------ */}
        {activeTab === 'care' && (
          <div className="space-y-6">
            <div className={`rounded-3xl border p-6 space-y-5 ${bgCard}`}>
              <div>
                <h1 className="text-2xl font-bold">Opieka nad dzieckiem (0–6 lat)</h1>
                <p className={`text-sm mt-1 ${textMuted}`}>
                  Wybierz przedział wiekowy oraz obszar opieki, aby poznać sprawdzone zalecenia pediatryczne
                </p>
              </div>

              {/* Wybór przedziału wiekowego */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {CARE_AGES.map((a) => {
                  const active = careAge === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setCareAge(a.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        active
                          ? 'bg-[#D4748E] border-[#D4748E] text-white shadow-sm'
                          : isDark
                          ? 'bg-[#191715] border-[#332E2B] hover:border-[#D4748E]/50'
                          : 'bg-[#FAF6F2] border-[#E6D9D1] hover:border-[#D4748E]/50'
                      }`}
                    >
                      <div className="font-bold text-sm">{a.label}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          active ? 'text-white/85' : textMuted
                        }`}
                      >
                        {a.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 7 kategorii opieki */}
              <div className="flex flex-wrap gap-2">
                {CARE_CATEGORIES.map((cat) => {
                  const active = careCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCareCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-[#5B8A72] border-[#5B8A72] text-white'
                          : isDark
                          ? 'bg-[#191715] border-[#36302C] text-[#D2C6C0]'
                          : 'bg-white border-[#E4D8D0] text-[#4B403D]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Wybrana treść poradnika */}
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-[#191715] border-[#332E2B]' : 'bg-[#FAF6F2] border-[#EAE0D8]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF4F6] text-[#B85470]">
                    {CARE_AGES.find((a) => a.id === careAge)?.label} •{' '}
                    {CARE_CATEGORIES.find((c) => c.id === careCategory)?.label}
                  </span>
                  <span className={`text-xs ${textMuted}`}>Źródło: Pacjent.gov.pl & IMiD</span>
                </div>

                <p className="text-sm sm:text-base leading-relaxed">
                  {CARE_CONTENT[careAge]?.[careCategory]}
                </p>

                <button
                  onClick={() =>
                    openAssistantWithQuestion(
                      `Opowiedz więcej o temacie: ${
                        CARE_CATEGORIES.find((c) => c.id === careCategory)?.label
                      } dla dziecka w wieku ${
                        CARE_AGES.find((a) => a.id === careAge)?.label
                      }`,
                      careAge
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4748E] text-white text-xs font-semibold hover:bg-[#C2607B] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Dopytaj Asystenta AI o szczegóły dla tego wieku</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            5. ŚWIADCZENIA I ZUS (8 ŚWIADCZEŃ + EDYCJA KWOT/TERMINÓW + LINKI)
           ------------------------------------------------------------------ */}
        {activeTab === 'benefits' && (
          <div className="space-y-6">
            {/* Kalkulator + Edytor parametrów */}
            <div className={`rounded-3xl border p-6 space-y-4 ${bgCard}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B8A72] mb-1">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Interaktywny przegląd i edycja parametrów kwot/terminów</span>
                  </div>
                  <h1 className="text-2xl font-bold">Świadczenia rodzinne i wnioski ZUS</h1>
                  <p className={`text-sm mt-1 ${textMuted}`}>
                    Zaznacz świadczenia w symulatorze lub kliknij ikonę edycji na dowolnej karcie, aby dopasować kwotę/termin.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`px-4 py-3 rounded-2xl border ${
                      isDark ? 'bg-[#1D2B24] border-[#375546]' : 'bg-[#EEF5F1] border-[#C9E0D3]'
                    }`}
                  >
                    <p className={`text-[11px] font-medium ${textMuted}`}>
                      Suma zaznaczonych świadczeń
                    </p>
                    <p className="text-xl font-bold text-[#3B6B53]">
                      {estimatedTotalSupport.toLocaleString('pl-PL')} zł
                    </p>
                  </div>

                  <button
                    onClick={resetBenefitsDefaults}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold ${
                      isDark
                        ? 'border-[#3A3430] text-[#D2C6C0] hover:bg-[#2A2522]'
                        : 'border-[#E4D8D0] text-[#5C4E49] hover:bg-[#FAF6F2]'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Domyślne stawki</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Siatka 8 świadczeń */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefitsList.map((item) => {
                const isEditing = editingBenefitId === item.id;
                const isInCalc = Boolean(selectedCalcIds[item.id]);
                const canCalc =
                  item.id !== 'macierzynski' &&
                  item.id !== 'urlop-ojcowski' &&
                  item.amount > 0;

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl border p-5 flex flex-col justify-between gap-4 transition-all ${bgCard}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FDF4F6] text-[#B85470]">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {canCalc && (
                            <button
                              onClick={() =>
                                setSelectedCalcIds((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }))
                              }
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                                isInCalc
                                  ? 'bg-[#5B8A72] border-[#5B8A72] text-white'
                                  : 'border-[#D9CEC6] text-[#7A6A65]'
                              }`}
                            >
                              {isInCalc ? 'W sumie ✓' : '+ Do sumy'}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              isEditing ? saveBenefitEdit(item.id) : startEditingBenefit(item)
                            }
                            title="Edytuj kwotę lub termin"
                            className={`p-1.5 rounded-lg border ${
                              isDark
                                ? 'border-[#3A3430] text-[#C8BBB5] hover:bg-[#2A2522]'
                                : 'border-[#E6DAD2] text-[#6B5D58] hover:bg-[#FAF6F2]'
                            }`}
                          >
                            {isEditing ? (
                              <Check className="w-3.5 h-3.5 text-[#5B8A72]" />
                            ) : (
                              <Edit3 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h2 className="font-bold text-base">{item.title}</h2>
                        {isEditing ? (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editAmountVal}
                                onChange={(e) => setEditAmountVal(e.target.value)}
                                className={`w-28 px-2.5 py-1.5 rounded-lg border text-sm font-bold ${
                                  isDark
                                    ? 'bg-[#181614] border-[#3A3430] text-white'
                                    : 'bg-[#FAF6F2] border-[#DFD2CA]'
                                }`}
                              />
                              <span className="text-xs font-medium">{item.unit}</span>
                            </div>
                            <input
                              type="text"
                              value={editDeadlineVal}
                              onChange={(e) => setEditDeadlineVal(e.target.value)}
                              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${
                                isDark
                                  ? 'bg-[#181614] border-[#3A3430] text-white'
                                  : 'bg-[#FAF6F2] border-[#DFD2CA]'
                              }`}
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-lg font-bold text-[#D4748E] mt-1">
                              {item.amount > 0 ? `${item.amount} ${item.unit}` : item.unit}
                            </p>
                            <p className={`text-xs mt-1 flex items-center gap-1.5 ${textMuted}`}>
                              <Clock className="w-3.5 h-3.5 text-[#5B8A72] shrink-0" />
                              <span>Termin: {item.deadline}</span>
                            </p>
                          </>
                        )}
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed ${textMuted}`}>
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#EFE6DF]/60">
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#FDF4F6] text-[#9E3F5A] border border-[#E8C5D0] hover:bg-[#FAE6EC] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{item.linkLabel}</span>
                      </a>

                      <button
                        onClick={() =>
                          openAssistantWithQuestion(
                            `Wyjaśnij szczegóły i podaj instrukcję krok po kroku dla: ${item.title}`
                          )
                        }
                        className="text-xs font-semibold text-[#5B8A72] hover:underline"
                      >
                        Zapytaj AI →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            6. PORADNIKI I KALENDARZ RODZICA
           ------------------------------------------------------------------ */}
        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wyszukiwarka poradników */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`rounded-3xl border p-6 space-y-4 ${bgCard}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold">Poradniki Rodzica</h1>
                    <p className={`text-sm ${textMuted}`}>
                      Praktyczne opracowania dotyczące ZUS, ciąży i wychowania
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#968883]" />
                  <input
                    type="text"
                    value={guideSearch}
                    onChange={(e) => setGuideSearch(e.target.value)}
                    placeholder="Szukaj poradnika, np. 800+, Aktywny Rodzic, kąpiel, urlop ojcowski..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#D4748E] ${
                      isDark
                        ? 'bg-[#181614] border-[#38322E] text-white'
                        : 'bg-[#FAF6F2] border-[#E4D7CF]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {filteredGuides.map((g) => (
                    <div
                      key={g.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                        isDark
                          ? 'bg-[#191715] border-[#332E2B]'
                          : 'bg-[#FAF6F2]/70 border-[#EAE0D8]'
                      }`}
                    >
                      <div className="space-y-2">
                        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF5F1] text-[#3B6B53]">
                          {g.tag}
                        </span>
                        <h2 className="font-bold text-sm leading-snug">{g.title}</h2>
                        <p className={`text-xs leading-relaxed ${textMuted}`}>{g.summary}</p>
                      </div>
                      <button
                        onClick={() => openAssistantWithQuestion(g.prompt)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4748E] hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Otwórz pełne wyjaśnienie w Asystencie AI</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kalendarz Rodzica (lokalny) */}
            <div className={`rounded-3xl border p-6 space-y-4 h-fit ${bgCard}`}>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#D4748E]" />
                <h2 className="font-bold text-lg">Kalendarz Rodzica</h2>
              </div>
              <p className={`text-xs ${textMuted}`}>
                Zapisuj terminy badań USG, szczepień oraz wniosków ZUS/USC.
              </p>

              <form onSubmit={handleAddEvent} className="space-y-2.5">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Np. Wniosek o 800+ na eZUS..."
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                    isDark
                      ? 'bg-[#181614] border-[#38322E] text-white'
                      : 'bg-[#FAF6F2] border-[#E4D7CF]'
                  }`}
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl border text-xs ${
                      isDark
                        ? 'bg-[#181614] border-[#38322E] text-white'
                        : 'bg-[#FAF6F2] border-[#E4D7CF]'
                    }`}
                  />
                  <select
                    value={newEventCat}
                    onChange={(e) => setNewEventCat(e.target.value)}
                    className={`px-3 py-2 rounded-xl border text-xs ${
                      isDark
                        ? 'bg-[#181614] border-[#38322E] text-white'
                        : 'bg-[#FAF6F2] border-[#E4D7CF]'
                    }`}
                  >
                    <option value="ZUS / Urząd">ZUS / Urząd</option>
                    <option value="Zdrowie">Zdrowie</option>
                    <option value="Ciąża">Ciąża</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#5B8A72] hover:bg-[#4B7660] text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dodaj termin do kalendarza</span>
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {calendarEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-2xl border flex items-start justify-between gap-2 ${
                      isDark
                        ? 'bg-[#191715] border-[#332E2B]'
                        : 'bg-[#FAF6F2] border-[#EAE0D8]'
                    }`}
                  >
                    <button
                      onClick={() =>
                        saveCalendar(
                          calendarEvents.map((item) =>
                            item.id === ev.id ? { ...item, done: !item.done } : item
                          )
                        )
                      }
                      className="flex items-start gap-2.5 text-left flex-1"
                    >
                      {ev.done ? (
                        <CheckCircle2 className="w-4 h-4 text-[#5B8A72] shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#D4748E] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            ev.done ? 'line-through opacity-65' : ''
                          }`}
                        >
                          {ev.title}
                        </p>
                        <p className={`text-[11px] mt-0.5 ${textMuted}`}>
                          {ev.date} • {ev.category}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        saveCalendar(calendarEvents.filter((item) => item.id !== ev.id))
                      }
                      aria-label="Usuń wydarzenie"
                      className="text-[#9E8E88] hover:text-[#D4748E] p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          STOPKA EDUKACYJNA
         ==================================================================== */}
      <footer
        className={`border-t py-5 px-4 sm:px-6 text-xs ${
          isDark
            ? 'bg-[#191715] border-[#332E2B] text-[#9E918B]'
            : 'bg-white border-[#EFE6DF] text-[#7A6B66]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4748E]" />
            <span>
              <strong>MAMA+ – Inteligentny Przewodnik Rodzica</strong> • Kampania edukacyjna „Przewodnik Przyszłej Mamy”
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://www.zus.pl/ezus"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4748E] underline"
            >
              eZUS / PUE ZUS
            </a>
            <a
              href="https://empatia.mpips.gov.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4748E] underline"
            >
              Emp@tia
            </a>
            <a
              href="https://pacjent.gov.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4748E] underline"
            >
              Pacjent.gov.pl
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}