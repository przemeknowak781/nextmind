# Specyfikacja techniczna i contentowa: strona internetowa **Next Mind Academy**

> Brief wdrożeniowy dla **Claude Code**: kompletny opis produktu, treści, architektury informacji, strategii SEO, wymagań technicznych i kryteriów akceptacji.
>
> **Operator marki:** EXPERT-SALES sp. z o.o. (KRS 0000549030, NIP 9282081467, REGON 361035409, ul. Słoneczna 6, 68-200 Żary)
> **Marka konsumencka:** Next Mind Academy (NMA)
> **Trener wiodący:** Przemek Nowak
> **Walidator (BUR):** Krzysztof Liszka (Prezes Zarządu Expert-Sales)
> **Wersja dokumentu:** 1.0 — 30 kwietnia 2026
> **Język strony:** polski (PL)
> **Rynek docelowy:** Polska (cała), z preferencją dla regionów aktywnych w PSF (dolnośląskie, małopolskie, śląskie, mazowieckie, lubuskie)

---

## Spis treści

0. [Streszczenie wykonawcze (TL;DR dla Claude Code)](#0-streszczenie-wykonawcze)
1. [Kontekst biznesowy i cele strony](#1-kontekst-biznesowy)
2. [Tożsamość marki i pozycjonowanie](#2-tozsamosc-marki)
3. [Persony użytkowników i ścieżki konwersji](#3-persony)
4. [Strategia SEO — frazy, intencje, struktura](#4-seo)
5. [Architektura informacji (sitemap + URL strategy)](#5-ia)
6. [Specyfikacja stron — page by page](#6-strony)
7. [Model danych — kursy, terminy, trenerzy](#7-dane)
8. [System projektowy (design system)](#8-design-system)
9. [Stack technologiczny i struktura repozytorium](#9-stack)
10. [Performance, dostępność, SEO techniczne](#10-perf-a11y)
11. [Compliance i strony legalne](#11-compliance)
12. [Lead capture i integracje](#12-leady)
13. [Treści — copywriting brief](#13-copywriting)
14. [Plan dostarczenia (milestones)](#14-milestones)
15. [Kryteria akceptacji](#15-acceptance)

**Załączniki**
- A. [Przykładowe meta-tagi i schema.org](#zal-a)
- B. [Schematy treści — JSON examples](#zal-b)
- C. [Lista komponentów UI](#zal-c)
- D. [Roadmap rozszerzeń (po MVP)](#zal-d)

---

<a id="0-streszczenie-wykonawcze"></a>
## 0. Streszczenie wykonawcze (TL;DR dla Claude Code)

**Co budujemy:** statyczną, bardzo szybką, wysoce SEO-zoptymalizowaną witrynę marketingową dla marki **Next Mind Academy** — programów szkoleniowych z AI dla pracowników biurowych spoza branży IT, sprzedawanych głównie przez **Bazę Usług Rozwojowych (BUR)** z dofinansowaniem (KFS, PSF, FERS).

**Cel nr 1 — biznesowy:** generować leady na zapis na konkretne edycje szkoleń (Basic 1-dniowe, Level 2 1-dniowe, w roadmapie 2-dniowe i 100-godzinne). Konwersja: użytkownik trafia na stronę kursu → zostawia kontakt LUB klika do karty usługi w BUR.

**Cel nr 2 — SEO/edukacyjny:** stać się merytorycznym hubem o szkoleniach AI z dofinansowaniem w Polsce. Strona ma rankować na hasłach typu „szkolenie AI z dofinansowaniem", „kurs ChatGPT dla firm KFS", „BUR szkolenie AI", „AI dla pracownika biurowego".

**Stack rekomendowany:** **Astro 5+** (content collections, MDX, View Transitions) + **TypeScript** + **Tailwind CSS 4** + deploy na **Cloudflare Pages** lub **Vercel**. Brak SPA, brak ciężkiego JS — czysty SSG z opcjonalną hydracją (`client:visible`) tylko tam, gdzie naprawdę potrzeba (formularz, nawigacja mobilna, kalendarz terminów).

**Dane mistrzowskie kursów:** trzymane w `src/content/courses/*.mdx` (Astro Content Collections z walidacją Zod). Każdy kurs ma frontmatter z polami zgodnymi z polami Karty Usługi BUR — co pozwala traktować repo jako **single source of truth** zarówno dla strony, jak i przy publikacji w BUR.

**Compliance must-haves:** zgodność z **WCAG 2.1 AA** (Ustawa o dostępności cyfrowej), polityka prywatności RODO, deklaracja dostępności, regulamin świadczenia usług, cookie banner z opt-in. To nie są dodatki — to wymóg SUZ-1 (Załącznik 5 do Regulaminu BUR).

**Kluczowe trust signals na stronie:**
- badge „Dostawca usług w BUR — Expert-Sales sp. z o.o.";
- KRS, NIP, REGON w stopce;
- linki do aktywnych kart BUR (deep link do `uslugirozwojowe.parp.gov.pl/wyszukiwarka/uslugi/podglad?id=XXXX`);
- mapowanie efektów uczenia się na **DigComp 2.2**;
- wzmianka o standardach: SUS 3.0 / ISO 9001:2015 / ISO 21001:2018 (jeden z nich — do uzupełnienia, gdy będzie wybrany);
- profil trenera z liczbą godzin szkoleniowych w ostatnich 5 latach (zgodnie z § 6 rozporządzenia BUR).

**Czego NIE robimy w MVP:** systemu rezerwacji online (zapisy idą przez BUR), sklepu e-commerce, własnego systemu logowania uczestników, integracji z platformą wideokonferencyjną. Strona to lead-gen + treść, nie LMS.

**Krytyczne ostrzeżenie SEO i contentowe:** w branży „szkoleń AI" w Polsce konkurencja jest gęsta i homogeniczna (FLOW, AI SHIFT, MTC, CampusAI, Enterprise Advisors, BUZZcenter, Progress Project, Handlowcy.AI). Zabronione frazy w nagłówkach H1 (zbyt generyczne, słabo rankują): „Praktyczne zastosowanie AI", „Wykorzystaj AI w pracy". H1 musi zawierać minimum jedno **konkretne narzędzie** (ChatGPT, Copilot, NotebookLM, Gemini, Claude) i jedną **konkretną korzyść** (oszczędź X godzin, zautomatyzuj Y) lub konkretny **mechanizm finansowania** (KFS, PSF, dofinansowanie do 90%).

---

<a id="1-kontekst-biznesowy"></a>
## 1. Kontekst biznesowy i cele strony

### 1.1. Operator i model biznesowy

**Expert-Sales sp. z o.o.** jest formalnym dostawcą usług rozwojowych wpisanym do BUR (link do karty dostawcy: `https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/dostawca-uslug/podglad?id=199788`). Spółka ma profil PKD 85.59.B (kursy i szkolenia w celu zdobycia wiedzy, umiejętności i kwalifikacji zawodowych w formach pozaszkolnych) oraz 85.59.D, czyli formalnie ma uprawnienia do prowadzenia działalności szkoleniowej.

**Pomeblo** (kontekst współpracy) zajmuje się stroną operacyjną BUR: publikacją kart usług, administracją profilu dostawcy, walidacją statusów uczestników, dokumentacją dla klientów PSF/KFS.

**Przemek Nowak** jest trenerem merytorycznym — autorem programu i prowadzącym szkolenia.

**Strona internetowa Next Mind Academy** jest narzędziem marketingowym, którego rolą jest:
- **przyciąganie ruchu organicznego** z fraz związanych ze szkoleniami AI z dofinansowaniem;
- **edukowanie odwiedzających** o mechanizmach BUR/PSF/KFS (większość małych firm i indywidualnych pracowników nie wie, że może uzyskać 80–90% dofinansowania);
- **konwersja na lead** (formularz kontaktowy lub bezpośrednie przejście do karty BUR);
- **budowanie autorytetu marki** w niszy „AI dla pracowników biurowych" przez treść (blog, materiały do pobrania, kalkulator dofinansowania).

### 1.2. Główne cele biznesowe (mierzalne)

| Cel | KPI | Wartość docelowa (12 m-cy od startu) |
|---|---|---|
| Pozycje SEO | TOP 10 dla 20 fraz kluczowych z listy w sekcji 4 | 20/20 |
| Ruch organiczny | Sesje organic / miesiąc | 5 000+ |
| Lead conversion rate | Form submission / unique visitor | ≥ 2,5% |
| Liczba leadów / miesiąc | Ankiety, zapytania ofertowe, lead magnets | ≥ 50 |
| Engagement na blog | Średni czas na artykule | ≥ 2:30 |
| Klikalność do BUR | CTR z karty kursu do karty BUR | ≥ 8% |

### 1.3. Cele wtórne

- **Brand recall:** użytkownik zapamiętuje markę „Next Mind Academy" jako rzetelnego, nie hype'owego dostawcę szkoleń AI.
- **Wsparcie sprzedaży B2B:** osobny landing dla szkoleń zamkniętych dla firm.
- **Lead magnety:** PDF „Macierz decyzyjna AI dla pracowników biurowych" + „Checklista bezpieczeństwa RODO dla AI" — w zamian za e-mail.
- **Lokalna obecność:** strona ma sekcję „Wrocław / Dolny Śląsk" z odwołaniem do regionalnego operatora PSF (DARR / DAWG) — nawet jeśli szkolenia są online, to konkretne województwo jest istotne dla operatorów.

### 1.4. Co strona NIE robi (out of scope dla MVP)

- Nie obsługuje bezpośrednich płatności online — sprzedaż przez BUR + faktura z dofinansowaniem.
- Nie jest LMS-em — nagrania i materiały dostarczane są innym kanałem (Google Drive / dedykowany link).
- Nie ma logowania uczestnika — to robi BUR przez login.gov.pl (od 1 stycznia 2026 r. logowanie do BUR wyłącznie przez login.gov.pl).
- Nie ma kalendarza wewnętrznego z możliwością „zapisz się" — kalendarz pokazuje terminy z linkiem do BUR.

---

<a id="2-tozsamosc-marki"></a>
## 2. Tożsamość marki i pozycjonowanie

### 2.1. Pozycjonowanie

> **Next Mind Academy to akademia AI dla pracowników biurowych spoza IT, którzy chcą uczyć się od praktyka, na realnych zadaniach, w kameralnej grupie online, z możliwością dofinansowania nawet 90% z KFS lub PSF.**

**Co nas różni (10 wyróżników do eksploatacji w copy):**

1. **Praktyk, nie YouTuber.** Trener prowadzi realne wdrożenia, nie tylko opowiada o promptach.
2. **Kameralna grupa (4–10 osób).** Większość konkurencji robi grupy 12–30 — u nas każdy uczestnik dostaje uwagę.
3. **Mapowanie na DigComp 2.2.** Efekty uczenia się są zmapowane na europejską ramę kompetencji cyfrowych — co jest premiowane przez wielu operatorów PSF.
4. **Pełne wsparcie z dofinansowaniem.** Pomagamy wypełnić wniosek u operatora regionalnego (PSF) lub w Urzędzie Pracy (KFS).
5. **Walidacja dwumetodowa.** Test wiedzy + zadanie praktyczne — nie tylko quiz online (zgodne z dobrą praktyką SUS 3.0).
6. **Promptoteka 50+ szablonów** branżowych do pobrania po szkoleniu (HR, sprzedaż, finanse, marketing, administracja).
7. **Aktualność programu.** Co kwartał aktualizujemy treści — w 2026 r. modele AI zmieniają się co miesiąc.
8. **Społeczność absolwentów.** Zamknięta grupa LinkedIn / Slack do wymiany promptów.
9. **Gwarancja satysfakcji.** Jeśli po pierwszym module uznasz, że szkolenie nie przynosi wartości — pełen zwrot.
10. **Strumień edukacyjny:** od 1-dniowego Basic, przez 1-dniowy Level 2, do 100-godzinnego programu rozwojowego (planowany Q3 2026).

### 2.2. Voice & tone

- **Rzeczowy, nie korpo-bełkot.** Piszemy „nauczysz się", nie „zapewniamy podniesienie kompetencji w zakresie...".
- **Pewny siebie, ale bez przesady.** Nie obiecujemy „stania się ekspertem AI w 1 dzień".
- **Polski, nie kalkowany z angielskiego.** „Asystent AI", nie „AI Asistant"; „prompt" zostaje (utarte).
- **Konkretne liczby > ogólniki.** „Oszczędzisz 5–8 godzin tygodniowo" zamiast „zwiększysz efektywność".
- **Odważny w nazwach modułów.** „Co NIGDY nie wklejać do ChatGPT" — nie „Aspekty bezpieczeństwa danych".
- **Bez emoji w treści marketingowej.** Tylko w blogu, jeśli kontekst wymaga.

### 2.3. Wyróżniki vs. konkurencja (do uwzględnienia w copy strony O nas)

Na rynku polskim w 2026 r. dominują:
- **CampusAI** (lider liczby uczestników, mocno hype'owy, drogi);
- **MTC** (premium, korporacyjny);
- **FLOW** (mocna karta BUR „Podstawy ChatGPT");
- **Enterprise Advisors** (mocne dofinansowanie 90% w małopolskim);
- **Handlowcy.AI** (wąska nisza — sprzedaż);
- **BUZZcenter, Progress Project** (klasyczne firmy szkoleniowe z AI w portfolio).

Nasze pozycjonowanie ma być **„Akademia dla pracownika biurowego, nie dla menedżera CIO"** — dosłownie: prosty język, konkretne narzędzia, kameralność, dofinansowanie krok po kroku.

### 2.4. Logo i identyfikacja wizualna

**MVP (do dostarczenia razem z brief):** logo tekstowe — „Next Mind Academy" (wordmark) + monogram „NMA" w wariantach.

**Sugerowane parametry do logotypu:**
- Sans-serif geometryczny, nowoczesny: Geist Sans, Inter Display, Manrope, Outfit;
- Monogram „NMA" w okrągłej lub kwadratowej tarczy — do faviconu i social media;
- Wariant ciemny (na jasne tło) i jasny (na ciemne tło) jako SVG.

Jeśli logo nie zostanie dostarczone razem ze stroną — Claude Code generuje **placeholder logotypowy w SVG** (czysty, czytelny tekst „Next Mind Academy" w wybranej palecie) i oznacza ten placeholder w dokumentacji do podmiany.

### 2.5. Paleta kolorów (rekomendacja)

Cel palety: **profesjonalna, godna zaufania, lekko technologiczna, nie wpadająca w corporate blue ani w „AI startup neon"**.

```
Primary 900  #0B1220   — granat głęboki (header, footer, nagłówki H1)
Primary 700  #1E293B   — slate dark (tekst nagłówków)
Primary 500  #334155   — slate medium (tekst body)
Primary 300  #94A3B8   — slate light (tekst secondary)
Primary 100  #F1F5F9   — tło sekcji
Primary 50   #F8FAFC   — tło bazowe (off-white)

Accent 500   #2563EB   — blue (CTA, linki)
Accent 600   #1D4ED8   — blue hover
Accent 50    #EFF6FF   — soft blue background

Success 500  #10B981   — zielony (badge „Dofinansowanie", success messages)
Warning 500  #F59E0B   — amber (badge „Tylko 3 miejsca")
Danger 500   #EF4444   — czerwony (errors)
```

**Dlaczego nie "AI fioletowy" ani „neon green":** target to pracownicy biurowi i HR-owcy, nie hackerzy. Spokojny granat + niebieski akcent budują wiarygodność.

### 2.6. Typografia

- **Headings:** Inter Display (font weight 600/700) — z fallbackiem do `system-ui`.
- **Body:** Inter (400/500) — z fallbackiem do `-apple-system, BlinkMacSystemFont, sans-serif`.
- **Code/mono (cytaty promptów na blogu):** JetBrains Mono.

Wczytywanie fontów: `<link rel="preload">` + `font-display: swap`. Tylko subset łacińsko-środkowoeuropejski (`latin-ext`) — Polska potrzebuje znaków diakrytycznych.

### 2.7. Skala i rytm

- Bazowy rozmiar: 16px (1rem).
- Skala typograficzna: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 px (Tailwind text-xs do text-6xl).
- Spacing: standardowa skala Tailwind 4 (0.5rem / 1rem / 1.5rem / 2rem / 3rem / 4rem / 6rem / 8rem).
- Kontener: max-width 1200px (`max-w-screen-xl`), boczny padding 24px mobile / 32px desktop.
- Wcięcia w sekcjach: padding-y 64px mobile / 96px desktop.

---

<a id="3-persony"></a>
## 3. Persony użytkowników i ścieżki konwersji

### 3.1. Persona A — Anna, specjalistka HR (33 lata)

- Pracuje w średniej firmie (50–250 osób), woj. dolnośląskie.
- Słyszała o ChatGPT, próbowała raz, ale „jakoś nie wyszło".
- Chce: nauczyć się AI praktycznie, ale bez programowania.
- Boi się: „że zostanie zastąpiona przez AI", że szef nie zgodzi się na szkolenie, że będzie za technicznie.
- Trafia na stronę z Google: „szkolenie ChatGPT dla HR".
- **Co musi zobaczyć w pierwszych 5 sekundach:** „Dla pracowników biurowych spoza IT", „dofinansowanie do 90%", „kameralna grupa", „1 dzień online".
- **Konwersja:** wypełnia formularz „chcę dofinansowanie KFS" — dostaje PDF z instrukcją krok po kroku + kontakt do nas.

### 3.2. Persona B — Marek, właściciel JDG (45 lat)

- Prowadzi jednoosobową działalność — tłumaczenia / księgowość / mała kancelaria.
- Wie, że AI to przyszłość, chce zacząć, ale jest sam i nie wie, od czego.
- Trafia z Google: „kurs AI dla freelancera", „AI dla małej firmy".
- **Co musi zobaczyć:** możliwość dofinansowania jako mikroprzedsiębiorca (KFS — 90%), program z konkretnymi efektami, ROI w godzinach, brak wymogu wiedzy technicznej.
- **Konwersja:** zapisuje się na newsletter „AI dla małej firmy" + przegląda termin Basic 1-day.

### 3.3. Persona C — Karolina, kierownik L&D w korporacji (39 lat)

- Odpowiada za rozwój pracowników w firmie 500+ osób.
- Szuka dostawcy, który zorganizuje szkolenie zamknięte dla 12-osobowej grupy.
- Kluczowe dla niej: certyfikat, mapowanie na DigComp 2.2, możliwość rozliczenia z KFS lub własnego budżetu.
- Trafia z Google: „szkolenie zamknięte AI dla firm", „wewnętrzne szkolenie AI z certyfikatem".
- **Co musi zobaczyć:** dedykowany landing /firmy z formularzem zapytania ofertowego, lista certyfikatów dostawcy, próbka programu, case studies.
- **Konwersja:** wypełnia formularz „zapytanie ofertowe — szkolenie zamknięte" + umawia rozmowę.

### 3.4. Persona D — Tomasz, AI Lead w MŚP (37 lat)

- W swojej firmie został „tym od AI", choć nie jest programistą.
- Już zna ChatGPT, robi proste prompty — chce poziom 2: Custom GPT, Zapier, automatyzacje.
- Trafia z Google: „Custom GPT szkolenie", „AI Studio kurs polski", „n8n dla nieprogramistów".
- **Co musi zobaczyć:** Level 2 z konkretnymi narzędziami (AI Studio, Claude Projects, Zapier/Make), porównanie z poziomem Basic, ścieżka rozwoju.
- **Konwersja:** rezerwuje termin Level 2, ewentualnie dopisuje się na 100-godzinny program.

### 3.5. Mapy ścieżek konwersji (uproszczone)

```
Anna   →  /szkolenia/ai-w-pracy-biurowej-podstawy
       →  scroll do "Dofinansowanie"
       →  klik "Sprawdź, czy dostaniesz KFS"
       →  modal z formularzem (firma, województwo, typ pracownika)
       →  thank-you page + e-mail z PDF + zaproszenie do rozmowy

Marek  →  /dofinansowanie/kfs-priorytet-3
       →  klik kalkulator (90% × 1490 zł = 149 zł netto z kieszeni)
       →  scroll do CTA "Zapisz się na newsletter"
       →  sign-up

Karolina → /firmy
         → scroll do programu
         → "Zapytaj o szkolenie zamknięte" → form
         → call-back w 24h

Tomasz   → /szkolenia/ai-w-pracy-biurowej-level-2
         → klik "Termin 24.06.2026"
         → /terminy/level-2-2026-06-24
         → klik "Zapisz się przez BUR" → external link
```

---

<a id="4-seo"></a>
## 4. Strategia SEO — frazy, intencje, struktura

### 4.1. Klastry słów kluczowych (priorytet wdrożenia)

**KLASTER 1 — Transakcyjne / wysokie intencje (wdrożenie: priorytet 0, na start)**

| Fraza kluczowa | Miesięczny wolumen* | Konkurencja | Strona docelowa |
|---|---|---|---|
| szkolenie AI dofinansowanie | wysoki | wysoka | /dofinansowanie |
| kurs ChatGPT dofinansowanie | wysoki | wysoka | /szkolenia/ai-w-pracy-biurowej-podstawy |
| szkolenie z AI dla firm | wysoki | b. wysoka | /firmy |
| szkolenie ChatGPT online | wysoki | b. wysoka | /szkolenia/ai-w-pracy-biurowej-podstawy |
| szkolenie AI BUR | średni | średnia | /dofinansowanie/bur-jak-zapisac |
| AI dla pracowników biurowych | średni | średnia | / (homepage) |
| kurs AI z certyfikatem | średni | wysoka | /szkolenia |
| szkolenie KFS AI 2026 | średni | niska | /dofinansowanie/kfs-priorytet-3 |
| szkolenie ChatGPT KFS | niski | niska | /dofinansowanie/kfs-priorytet-3 |
| AI dla pracownika biurowego szkolenie | średni | niska | /szkolenia/ai-w-pracy-biurowej-podstawy |

*Wolumeny do zweryfikowania w Ahrefs / Ubersuggest / Senuto przed launchem — zostawiamy hooki w copy, ale **nie hardkodujemy** liczb.

**KLASTER 2 — Long-tail / informacyjne (priorytet 1, blog + landing pages)**

- jak uzyskać dofinansowanie KFS na szkolenie AI 2026
- jak zapisać się na szkolenie z dofinansowaniem BUR
- PSF a KFS różnice
- DigComp 2.2 polska wersja
- KFS Priorytet 3 lista szkoleń
- co to jest BUR PARP
- ile kosztuje szkolenie z AI z dofinansowaniem
- VAT przy szkoleniach dofinansowanych
- ChatGPT dla księgowych
- ChatGPT dla HR-owca
- Custom GPT jak zrobić
- NotebookLM polski tutorial
- prompt engineering dla pracownika biurowego

**KLASTER 3 — Brand / nawigacyjne (priorytet 2)**

- Next Mind Academy
- NextMindAcademy szkolenia
- Expert-Sales szkolenia AI
- Przemek Nowak trener AI
- Next Mind Academy opinie

**KLASTER 4 — Geo (priorytet 2, tylko jeśli będą szkolenia stacjonarne)**

- szkolenie AI Wrocław
- szkolenie ChatGPT Dolny Śląsk
- kurs AI online w Polsce

### 4.2. Mapowanie intencji → typ contentu

| Intencja | Typ strony | Format CTA |
|---|---|---|
| Transakcyjna („chcę kupić szkolenie") | Strona kursu, strona terminu | „Zapisz się przez BUR" + „Zapytaj o dofinansowanie" |
| Informacyjna ("jak działa BUR") | Landing page edukacyjny + artykuł blog | „Pobierz PDF: BUR krok po kroku" |
| Porównawcza ("KFS vs PSF") | Artykuł blog / FAQ | „Sprawdź, co jest dla mnie" — interaktywny kalkulator |
| Brand | Strona O nas, Trener | „Dołącz do społeczności" / „Zapisz się na newsletter" |

### 4.3. Wymagania SEO techniczne (skrót)

- Każda strona ma unikalne `<title>` (max 60 znaków) i `<meta description>` (max 160 znaków).
- Każda strona kursu ma **strukturalne dane Schema.org**: `Course`, `Organization`, `Offer`, `FAQPage` (gdzie dotyczy).
- Sitemap XML generowany automatycznie (`@astrojs/sitemap`).
- `robots.txt` z odwołaniem do sitemapy.
- Canonical URL na każdej stronie.
- OpenGraph i Twitter Cards na każdej stronie.
- Breadcrumbs wizualne + `BreadcrumbList` w schema.org.
- Hreflang: `pl-PL` (na razie tylko polska wersja).

### 4.4. Architektura linkowania wewnętrznego

```
Homepage → 3 kursy (Basic, Level 2, Roadmap)
        → Hub /dofinansowanie (4 podstrony)
        → /firmy
        → /blog (top 3 artykuły)
        → /trener
        → /o-akademii

Każda strona kursu →
        → Inny kurs (cross-sell)
        → /trener (kto prowadzi)
        → /dofinansowanie (jak płacić)
        → /faq (top 5 pytań)

Każdy artykuł blogu →
        → Inne artykuły z tego samego klastra
        → Jedna strona kursu (kontekstowo)
        → /dofinansowanie (uniwersalnie)
```

Każda strona kursu ma **dokładnie 3 powiązane podstrony** w sekcji „Czytaj dalej": (1) inny kurs, (2) artykuł o dofinansowaniu, (3) artykuł merytoryczny pasujący do tematu.

### 4.5. Content velocity (po MVP)

Po MVP plan publikacji bloga: **2 artykuły / miesiąc** przez pierwsze 6 m-cy = 12 artykułów. Lista priorytetowa w Załączniku D.


---

<a id="5-ia"></a>
## 5. Architektura informacji (sitemap + URL strategy)

### 5.1. Pełna mapa strony (sitemap)

```
/
├── /szkolenia/                                  [katalog]
│   ├── /szkolenia/ai-w-pracy-biurowej-podstawy
│   ├── /szkolenia/ai-w-pracy-biurowej-level-2
│   └── /szkolenia/ai-w-pracy-biurowej-program-100h     [planowany]
│
├── /terminy/                                    [kalendarz wszystkich edycji]
│   ├── /terminy/podstawy-2026-06-10
│   ├── /terminy/podstawy-2026-07-08
│   ├── /terminy/level-2-2026-06-24
│   └── /terminy/level-2-2026-07-22
│
├── /dofinansowanie/                             [hub]
│   ├── /dofinansowanie/bur-jak-zapisac
│   ├── /dofinansowanie/kfs-priorytet-3
│   ├── /dofinansowanie/psf-podmiotowy-system-finansowania
│   ├── /dofinansowanie/fers-akademia-hr
│   └── /dofinansowanie/kalkulator
│
├── /firmy/                                      [B2B landing]
│
├── /trener/                                     [profil Przemka]
│
├── /o-akademii/                                 [O nas + Expert-Sales]
│
├── /blog/                                       [katalog artykułów]
│   ├── /blog/[slug-artykulu]
│   └── /blog/kategoria/[kategoria]
│
├── /faq/
│
├── /kontakt/
│
├── /materialy/                                  [lead magnety – gated content]
│   ├── /materialy/macierz-decyzyjna-ai
│   └── /materialy/checklista-rodo-ai
│
├── /thank-you/                                  [confirmation pages]
│   ├── /thank-you/zapis-newsletter
│   └── /thank-you/zapytanie-firma
│
├── /regulamin/
├── /polityka-prywatnosci/
├── /deklaracja-dostepnosci/
├── /polityka-cookies/
└── /404
```

### 5.2. URL strategy — zasady

- Wszystkie URL-e małymi literami, słowa rozdzielone myślnikiem (`-`).
- Bez polskich znaków diakrytycznych w slugu (np. `dofinansowanie`, nie `dofinansowanie-z-żadnym-niczym`).
- Bez końcowego slasha LUB konsekwentnie ze slashem — Astro domyślnie z trailing slash, używamy `trailingSlash: 'always'` w konfiguracji.
- Slug strony kursu = slug karty BUR (gdzie to możliwe), żeby ułatwić rozpoznawanie po linku.
- Slug terminu: `/{kurs-slug}-{rrrr}-{mm}-{dd}` (np. `/terminy/podstawy-2026-06-10`).
- Brak parametrów query w URL-ach indeksowalnych (oprócz UTM).

### 5.3. Główna nawigacja (top bar)

```
[Logo NMA]  Szkolenia  ▾   Dofinansowanie  ▾   Dla firm   Trener   Blog       [Termin: 10.06.2026]  [Kontakt]
                ↓                  ↓
         - Basic 1-day      - BUR krok po kroku
         - Level 2 1-day    - KFS Priorytet 3
         - Program 100h     - PSF
         - Wszystkie        - Kalkulator
            terminy
```

Mobilna: hamburger menu, ten sam układ rozwinięty pionowo.

### 5.4. Footer

```
Kolumna 1 — Szkolenia
  Basic 1-day
  Level 2 1-day
  Program 100h (wkrótce)
  Wszystkie terminy
  Dla firm

Kolumna 2 — Dofinansowanie
  Jak zapisać się przez BUR
  KFS Priorytet 3
  PSF
  Kalkulator dofinansowania

Kolumna 3 — O akademii
  Trener
  O Expert-Sales
  Blog
  FAQ
  Kontakt

Kolumna 4 — Dane prawne
  Regulamin
  Polityka prywatności
  Polityka cookies
  Deklaracja dostępności

Linia poniżej:
  Operator: Expert-Sales sp. z o.o.
  ul. Słoneczna 6, 68-200 Żary
  KRS 0000549030 | NIP 9282081467 | REGON 361035409
  Wpisana do Bazy Usług Rozwojowych — Karta dostawcy [link]
  © 2026 Next Mind Academy. Wszelkie prawa zastrzeżone.
```

---

<a id="6-strony"></a>
## 6. Specyfikacja stron — page by page

> **Konwencja:** dla każdej strony podaję: cel, sekcje (above/below the fold), copy hooks, CTA, schema.org, meta-tagi, komponenty UI.

### 6.1. Homepage (/)

**Cel strony:** w 8 sekundach przekazać odwiedzającemu (1) co oferujemy, (2) dla kogo, (3) że jest dofinansowanie, (4) skąd autorytet.

**Sekcje (od góry do dołu):**

**S1 — Hero**
- H1: „**Naucz się AI w pracy biurowej. W jeden dzień. Z dofinansowaniem do 90%.**"
- Subline: „Praktyczne szkolenia z ChatGPT, Gemini, Claude i NotebookLM dla pracowników spoza IT. Online live, kameralna grupa, certyfikat zgodny z DigComp 2.2."
- 2 CTA: prymarne „Zobacz szkolenia" (scroll do S3); sekundarne „Sprawdź dofinansowanie" (do `/dofinansowanie/kalkulator`).
- Trust strip: badge'y w jednym rzędzie:
  - „Dostawca BUR — Expert-Sales sp. z o.o."
  - „DigComp 2.2"
  - „Walidacja dwumetodowa"
  - „Kameralna grupa 4–10 osób"
- Wizualizacja: SVG hero (graficzna kompozycja symbolizująca AI + biuro — bez stockowych zdjęć z robotami).

**S2 — Pasek logiki kosztu (USP nr 1: cena)**
- Zegarowa ilustracja: „Cena rynkowa 1490 zł netto → z dofinansowaniem KFS 90% = **149 zł netto** z Twojej kieszeni."
- Mini-CTA: „Sprawdź, czy dostaniesz dofinansowanie" → do kalkulatora.
- Disclaimer drobnym drukiem: „Dofinansowanie zależy od województwa, statusu firmy i priorytetu KFS. Sprawdź indywidualnie."

**S3 — Trzy szkolenia (kafelki)**
- Karta 1: **Basic 1-day** — „Dla osób bez doświadczenia z AI" — 8h online — najbliższy termin — cena.
- Karta 2: **Level 2 1-day** — „Dla osób, które już znają ChatGPT" — 8h online — najbliższy termin — cena.
- Karta 3: **Program 100h** — „Dogłębna transformacja zawodowa" — 100h — „Dostępny od Q3 2026" — „Zostaw kontakt".

**S4 — Dla kogo to szkolenie**
- 6 kafelków-personas: HR, sprzedaż, finanse, marketing, asystent zarządu, mikroprzedsiębiorca.
- Każdy ma 1 zdanie: „Co AI zmieni w Twojej pracy".

**S5 — Trener**
- Zdjęcie + 3-zdaniowy bio Przemka.
- Liczby: „X przeprowadzonych godzin", „Y uczestników w 2024–2026", „Z certyfikatów".
- CTA: „Poznaj trenera" → /trener.

**S6 — Jak działa dofinansowanie (skrócony)**
- 3-stopniowy timeline: 1) Dobierz szkolenie 2) Złóż wniosek (pomożemy) 3) Bierzesz udział i płacisz tylko swoją część.
- CTA: „Pełen poradnik: BUR krok po kroku" → /dofinansowanie/bur-jak-zapisac.

**S7 — Społeczność i materiały**
- „Po szkoleniu otrzymasz: promptotekę 50+ szablonów, dostęp do społeczności absolwentów, comiesięczne aktualizacje narzędzi."
- 1 CTA: pobierz darmowy „Macierz decyzyjna AI dla pracownika biurowego" (lead magnet).

**S8 — FAQ (top 5)**
- Akordeon: 5 najczęstszych pytań (z /faq).

**S9 — Final CTA + newsletter**
- „Następna edycja Basic: środa, 10 czerwca 2026. Tylko 8 miejsc."
- Form: „Otrzymuj informacje o terminach i nowych szkoleniach" — pole e-mail + checkbox RODO.

**Meta-tagi homepage:**
- `<title>`: „Next Mind Academy — szkolenia AI dla pracowników biurowych | dofinansowanie do 90%"
- `<meta description>`: „Praktyczne szkolenia z ChatGPT, Gemini, Claude i NotebookLM. Online live, kameralna grupa 4–10 osób, certyfikat zgodny z DigComp 2.2. Dofinansowanie z KFS, PSF i BUR."
- OG image: 1200×630 z H1 i logiem.

**Schema.org (homepage):** `Organization`, `WebSite` (z polem `potentialAction` dla SearchAction).

### 6.2. Strona katalogu szkoleń (/szkolenia/)

**Cel:** pomóc odwiedzającemu wybrać między Basic / Level 2 / Program 100h.

**Sekcje:**
- Hero: H1 „Szkolenia AI dla pracowników biurowych".
- Sekcja porównawcza (tabela): kolumny — Basic / Level 2 / Program 100h; wiersze — Czas trwania, Poziom, Główne narzędzia, Cena, Dofinansowanie, Certyfikat, Następna edycja.
- 3 sekcje — każda to skondensowana karta jednego szkolenia (z linkiem do pełnej strony).
- Sekcja „Nie wiesz, które wybrać?" — quiz w 3 pytaniach: 1) Czy próbowałeś już ChatGPT? 2) Ile masz czasu? 3) Czy chcesz tworzyć własnych asystentów AI? — wynik podpowiada szkolenie.
- CTA finałowy: rozmowa z trenerem (booking link).

**Meta:**
- `<title>`: „Szkolenia AI z dofinansowaniem | Basic, Level 2, Program 100h | Next Mind Academy"
- `<meta description>`: „Wybierz szkolenie AI dopasowane do Twojego poziomu. Online live, kameralna grupa, dofinansowanie z KFS lub PSF do 90%. Sprawdź terminy."

### 6.3. Strona kursu — Basic 1-day (/szkolenia/ai-w-pracy-biurowej-podstawy)

**Cel:** sprzedać konkretną edycję, dostarczyć wszystkich informacji do podjęcia decyzji + linku do BUR.

**Sekcje (rzeczywista długość strony — long-form, ~3000 słów copy):**

1. **Hero**
   - Eyebrow: „Szkolenie 1-dniowe • Online live • Poziom podstawowy"
   - H1: „Praktyczne AI dla pracowników biurowych: ChatGPT, Gemini, NotebookLM, Claude. W jeden dzień."
   - Sub: „Naucz się bezpiecznie i skutecznie wdrożyć AI w codziennej pracy biurowej. Bez programowania. Bez wiedzy technicznej."
   - Mini-info bar: „8 godzin dydaktycznych • 4–10 osób • Polski • Następna edycja: 10 czerwca 2026"
   - 2 CTA: „Zapisz się przez BUR" (deep link) + „Zapytaj o dofinansowanie".
   - Boczna kolumna „sticky" z desktopu: cena + następne 2 terminy + CTA.

2. **Dla kogo to szkolenie**
   - Lista 6 ról (z 1.2 kontekstu).
   - Wymagania wstępne: laptop, kamera, podstawy obsługi przeglądarki, znajomość polskiego B2.

3. **Czego się nauczysz** (efekty uczenia się)
   - **Tabela 3-kolumnowa**: Efekt | Kryterium weryfikacji | Metoda walidacji.
   - Mapowanie na DigComp 2.2 (obszary 1, 3, 4, 5).
   - Format: 5 efektów wiedzy + 8 umiejętności + 4 kompetencje społeczne (zgodnie z draftem specyfikacji szkolenia, sekcja 4).

4. **Program — 4 moduły × 90 min**
   - Akordeon, każdy moduł rozwija się indywidualnie.
   - Dla każdego modułu: tytuł, czas, narzędzia (ChatGPT, Claude, etc.), 5–8 punktów programowych, ćwiczenia praktyczne.

5. **Harmonogram dnia**
   - Tabela: Nr / Godzina / Czas / Temat / Forma — rzetelny rozkład 9:00–16:00.

6. **Trener**
   - Zdjęcie Przemka, 4-zdaniowy bio, zaakcentowanie 5-letniego doświadczenia (wymóg § 6 rozporządzenia BUR).
   - Link do pełnego profilu /trener.

7. **Walidacja i certyfikat**
   - Sekcja „Jak weryfikujemy, czy się nauczyłeś":
     - Test wiedzy 10 pytań (próg 60%);
     - Zadanie praktyczne podczas warsztatu;
     - Walidacja przez Krzysztofa Liszkę — Prezesa Zarządu Expert-Sales (zasada rozdzielności funkcji).
   - „Otrzymasz imienny certyfikat ukończenia szkolenia z mapowaniem DigComp 2.2."

8. **Materiały dla uczestnika**
   - Lista 10 pozycji (zgodnie z draftem specyfikacji): prezentacja PDF, biblioteka 20+ promptów, checklisty, plan wdrożenia 30 dni, nagranie 30 dni, certyfikat, dostęp do społeczności.
   - Adnotacja o licencji (SUZ-3).

9. **Warunki techniczne**
   - Komputer / kamera / mikrofon / łącze 8 Mbps / aktualna przeglądarka / konta Google + OpenAI (darmowe).

10. **Cena, dofinansowanie i VAT**
    - Cena netto: 1 490 zł / osoba (placeholder — do ustalenia z Expert-Sales).
    - Z dofinansowaniem KFS 90%: **149 zł** z Twojej kieszeni.
    - Z dofinansowaniem PSF (woj. dolnośląskie 80%): **298 zł**.
    - VAT: zwolniony przy dofinansowaniu ≥70% (art. 43 ust. 1 pkt 29 ustawy o VAT).
    - CTA: „Sprawdź, ile zapłacisz Ty" → kalkulator.

11. **Najbliższe terminy**
    - Lista 2–3 najbliższych terminów z linkiem do BUR.

12. **FAQ tej strony** (specyficzne dla kursu, 6–8 pytań).

13. **Czytaj dalej** (3 powiązane strony).

14. **Final CTA**: „Zapisz się przez BUR" + „Zapytaj o szkolenie zamknięte".

**Meta:**
- `<title>`: „Szkolenie AI dla pracowników biurowych — ChatGPT, Gemini, NotebookLM | Online 1 dzień"
- `<meta description>`: „Praktyczne 1-dniowe szkolenie online: prompting, NotebookLM, RODO i AI. Dofinansowanie do 90% z KFS lub PSF. Następna edycja: 10 czerwca 2026."

**Schema.org:** `Course` z polami `provider` (Organization Expert-Sales), `hasCourseInstance` z `courseMode: "online"`, `inLanguage: "pl"`, `coursePrerequisites`, `educationalCredentialAwarded`. Plus `Offer` z `price`, `priceCurrency: "PLN"`, `availability`. Plus `FAQPage` dla sekcji FAQ.

### 6.4. Strona kursu — Level 2 1-day (/szkolenia/ai-w-pracy-biurowej-level-2)

Struktura analogiczna jak Basic, ale:
- Eyebrow: „Poziom średniozaawansowany • Wymagane podstawy AI"
- H1: „Buduj własnych asystentów AI: Google AI Studio, Custom GPT, Claude Projects, automatyzacja Zapier"
- Akcent na to, że to **kontynuacja** Basic.
- Sekcja „Wymagania wstępne" wyraźniej eksponowana — minimum 3 m-ce pracy z LLM.
- Przykłady „co zbudujesz na warsztatach": własna aplikacja AI Studio, własny Gemini Gem, workflow Zapier z 3 krokami.
- CTA dodatkowy: „Nie czujesz się gotowy? Zacznij od Basic" — link do strony Basic.

### 6.5. Strona kursu — Program 100h (/szkolenia/ai-w-pracy-biurowej-program-100h) — placeholder

W MVP — placeholder z H1, krótkim opisem („Dogłębna 100-godzinna transformacja zawodowa — startujemy w Q3 2026") i formularzem „Zapisz się na listę oczekujących". Strona wymaga indeksacji, bo zaczyna budować autorytet pod tę frazę long-tail.

### 6.6. Strona terminu (/terminy/podstawy-2026-06-10)

**Cel:** dostarczyć ostatecznych informacji do zapisu + ułatwić techniczne zaplanowanie.

**Sekcje:**
- H1: „Praktyczne AI dla pracowników biurowych — środa, 10 czerwca 2026"
- Boks z faktami: data, godziny (9:00–16:00), platforma (Zoom/Meet/Teams), prowadzący Przemek Nowak, walidator Krzysztof Liszka.
- Status liczby miejsc: dynamiczny (ile zostało) — w MVP statycznie, potem opcjonalnie z API BUR.
- Harmonogram szczegółowy (z xlsx — rzeczywiste godziny z `1__harmonogram_1_dniowe_10_06_2026.xlsx`).
- CTA prymarne: „Zapisz się przez BUR" — link do karty BUR (do uzupełnienia po publikacji karty).
- CTA sekundarne: „Pobierz harmonogram PDF".
- Sekcja „Co przygotować przed szkoleniem": lista 8 punktów onboardingu (zgodnie z SUZ-11).

**Schema.org:** `Event` z `eventAttendanceMode: "OnlineEventAttendanceMode"`, `eventStatus: "EventScheduled"`, `location: VirtualLocation`.

### 6.7. Strona /dofinansowanie/ (hub)

**Cel:** stać się **definitywnym przewodnikiem** po dofinansowaniach szkoleń AI w Polsce.

**Sekcje:**
- Hero: H1 „Szkolenia AI z dofinansowaniem — KFS, PSF, BUR. Wszystko, co musisz wiedzieć w 2026 r."
- Mini-quiz na początku: „Jakim jesteś podmiotem? (firma / pracownik / freelancer)" → kieruje do odpowiedniej sub-strony.
- Tabela porównawcza KFS / PSF / FERS — najważniejsze wymiary (kto, ile, jak, kiedy).
- 4 kafelki do podstron.
- CTA: „Sprawdź, ile dostaniesz" — kalkulator.

### 6.8. /dofinansowanie/bur-jak-zapisac/

Step-by-step poradnik z screenshotami (placeholder w MVP):
1. Załóż profil w BUR przez login.gov.pl.
2. Znajdź szkolenie w wyszukiwarce.
3. Skontaktuj się z operatorem PSF w swoim województwie.
4. Złóż wniosek (z naszą pomocą).
5. Dostań ID wsparcia.
6. Zapisz się na konkretną edycję.
7. Bierzesz udział i otrzymujesz fakturę.

### 6.9. /dofinansowanie/kfs-priorytet-3/

Skupienie się na priorytecie 3 KFS 2026 — „umiejętności cyfrowe, AI oraz zielone". Przykłady wniosków, lista pytań UP.

### 6.10. /dofinansowanie/psf-podmiotowy-system-finansowania/

Lista operatorów per województwo, linki do ich stron, średnie poziomy dofinansowań, pułapy cenowe.

### 6.11. /dofinansowanie/kalkulator/

Interaktywny komponent (jedyna sekcja z `client:visible` na tej stronie):
- Pola: typ podmiotu (mikro / małe / średnie / duże / JDG / pracownik), województwo, priorytet (KFS Prio 3 / inne / PSF).
- Wynik: „Z 1 490 zł zapłacisz X zł. Pokrycie: Y%."
- Disclaimer: „To szacunek. Faktyczna kwota zależy od decyzji operatora."

### 6.12. /firmy/ (B2B landing)

**Cel:** zebrać zapytania ofertowe na szkolenia zamknięte / dedykowane.

**Sekcje:**
- Hero: H1 „Szkolenia AI zamknięte dla zespołów"
- 3 wersje oferty: 1-day Basic dla zespołu / 1-day Level 2 / 24h corporate (z dostosowaniem do branży).
- Logo klientów (placeholder w MVP).
- Case studies — placeholder „pierwsze case studies wkrótce".
- Form: „Zapytaj o ofertę" — pola firma / liczba uczestników / preferowany termin / wymagania.

### 6.13. /trener/

**Cel:** zbudować wiarygodność osobistą Przemka.

**Sekcje:**
- Hero: zdjęcie + H1 „Przemek Nowak — trener AI Next Mind Academy"
- Bio (4 akapity): kim jest, dlaczego AI, dlaczego szkoli, podejście dydaktyczne.
- Kwalifikacje: certyfikaty z ostatnich 5 lat (Microsoft AI / OpenAI / Google / kursy DeepLearning.AI — do uzupełnienia z CV).
- Statystyki: liczba godzin szkoleniowych, liczba uczestników, liczba projektów wdrożeniowych.
- Publikacje / wystąpienia (jeśli są).
- LinkedIn link.
- CTA: „Zobacz najbliższe szkolenia" + „Zapytaj o szkolenie zamknięte".

### 6.14. /o-akademii/

**Sekcje:**
- Misja akademii.
- Operator: Expert-Sales sp. z o.o. — pełne dane prawne, KRS, NIP, REGON, link do karty BUR.
- Standardy jakości: „Pracujemy zgodnie z [SUS 3.0 / ISO 9001:2015 — do uzupełnienia po wyborze]" + link do certyfikatu (placeholder).
- Zespół (Przemek + Krzysztof Liszka jako Prezes/walidator + ewentualny zespół wsparcia).
- Współpraca z Pomeblo (krótkie wspomnienie partnerstwa operacyjnego).
- Wartości / metodologia (ADDIE).
- CTA: „Zobacz szkolenia" + „Skontaktuj się".

### 6.15. /blog/

**MVP:** layout katalogu (lista artykułów z miniaturkami, paginacja), pojedyncza strona artykułu, kategorie. Pierwsze 3 artykuły do napisania jednocześnie ze stroną (lista w sekcji 13.4).

### 6.16. /faq/

Akordeon 20+ pytań w 4 kategoriach: Szkolenia / Dofinansowanie / Walidacja i certyfikat / Techniczne. Schema `FAQPage`.

### 6.17. /kontakt/

- Adres rejestrowy Expert-Sales.
- Email kontaktowy: kontakt@nextmindacademy.pl (placeholder).
- Telefon (do uzupełnienia).
- Form kontaktowy uniwersalny.
- Mapa Google (osadzona — opcjonalnie, bo to siedziba w Żarach, a działalność online).
- Godziny obsługi telefonicznej.

### 6.18. Strony legalne

- **/regulamin** — regulamin świadczenia usług (do napisania prawnie, w MVP placeholder z TODO).
- **/polityka-prywatnosci** — RODO compliant.
- **/polityka-cookies** — pełna lista cookies, sposób zarządzania zgodami.
- **/deklaracja-dostepnosci** — wymóg Ustawy z 4 kwietnia 2019 r. o dostępności cyfrowej + procedura skargowa.

---

<a id="7-dane"></a>
## 7. Model danych — kursy, terminy, trenerzy

Dane są w plikach Markdown/MDX z Astro Content Collections (`src/content/`), walidowane przez Zod. To pozwala traktować repo jako pojedyncze źródło prawdy.

### 7.1. Schema kolekcji `courses`

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const coursesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Metadata podstawowa
    slug: z.string(),
    title: z.string(),                    // H1
    titleSeo: z.string().max(60),         // <title>
    metaDescription: z.string().max(160), // <meta description>
    eyebrow: z.string(),                  // np. "Szkolenie 1-dniowe • Online live"
    summary: z.string(),                  // 1-2 zdania nad fold
    
    // Klasyfikacja
    level: z.enum(['podstawowy', 'sredniozaawansowany', 'zaawansowany']),
    durationHours: z.number(),            // w godzinach dydaktycznych
    durationLabel: z.string(),            // human-readable: "1 dzień (8h)"
    format: z.enum(['online-live', 'stacjonarne', 'hybrydowe']),
    language: z.string().default('polski'),
    minParticipants: z.number(),
    maxParticipants: z.number(),
    
    // Powiązania BUR
    burCardId: z.string().optional(),     // ID karty BUR jeśli opublikowana
    burCardUrl: z.string().url().optional(),
    
    // Cena (PLN netto)
    priceNet: z.number(),
    priceGross: z.number().optional(),
    vatExemptInfo: z.string().default('Zwolniony z VAT przy dofinansowaniu ≥70%'),
    
    // Trener i walidator
    trainer: z.string(),                  // ref do trainers collection
    validator: z.string(),                // ref do validators collection
    
    // Grupa docelowa
    targetAudience: z.array(z.string()),  // listy ról
    prerequisites: z.array(z.string()),
    
    // Treść — bardziej kompleksowa
    educationalGoal: z.string(),
    businessGoal: z.string().optional(),
    
    // Efekty uczenia się — TABELA 3-KOLUMNOWA
    learningOutcomes: z.array(z.object({
      area: z.enum(['wiedza', 'umiejetnosci', 'kompetencje-spoleczne']),
      outcome: z.string(),
      verificationCriterion: z.string(),
      validationMethod: z.string(),
      digcompMapping: z.string().optional(), // np. "DigComp 3.1, poz. 5"
    })),
    
    // Moduły
    modules: z.array(z.object({
      title: z.string(),
      durationMin: z.number(),
      summary: z.string(),
      tools: z.array(z.string()),         // ChatGPT, Claude, NotebookLM...
      content: z.array(z.string()),       // bullet points
      exercises: z.array(z.string()),
    })),
    
    // Walidacja
    validationMethod: z.object({
      summary: z.string(),
      components: z.array(z.string()),
      passingThreshold: z.string(),
    }),
    
    // Materiały
    materials: z.array(z.string()),
    licenseInfo: z.string(),
    
    // Warunki techniczne
    technicalRequirements: z.array(z.string()),
    
    // Cross-sell
    relatedCourses: z.array(z.string()).optional(),
    relatedArticles: z.array(z.string()).optional(),
  }),
});

export const collections = {
  courses: coursesCollection,
  // ... inne
};
```

### 7.2. Schema kolekcji `editions` (terminy)

```typescript
const editionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    courseSlug: z.string(),               // referencja do kursu
    date: z.coerce.date(),
    startTime: z.string(),                // "09:00"
    endTime: z.string(),                  // "16:00"
    timezone: z.string().default('Europe/Warsaw'),
    platform: z.enum(['Zoom', 'Microsoft Teams', 'Google Meet']),
    seatsTotal: z.number(),
    seatsAvailable: z.number(),
    burEditionUrl: z.string().url().optional(),
    status: z.enum(['planned', 'open-for-signup', 'closing-soon', 'fully-booked', 'completed', 'cancelled']),
    schedule: z.array(z.object({
      no: z.string(),
      timeFrom: z.string(),
      timeTo: z.string(),
      duration: z.number(),               // min
      topic: z.string(),
      form: z.string(),
    })),
  }),
});
```

### 7.3. Schema kolekcji `trainers` i `validators`

```typescript
const trainersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    title: z.string(),                    // np. "Trener wiodący"
    photo: z.string(),                    // ścieżka do pliku
    bio: z.string(),                      // markdown
    yearsOfExperience: z.number(),
    hoursDelivered: z.number(),           // ostatnie 5 lat (wymóg BUR)
    participantsTrained: z.number(),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      year: z.number(),
      url: z.string().url().optional(),
    })),
    publications: z.array(z.string()).optional(),
    linkedin: z.string().url().optional(),
  }),
});

const validatorsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    role: z.string(),
    affiliation: z.string(),              // np. "Prezes Zarządu Expert-Sales sp. z o.o."
    bio: z.string().optional(),
    qualifications: z.array(z.string()),
  }),
});
```

### 7.4. Pliki danych — przykłady

**`src/content/courses/ai-w-pracy-biurowej-podstawy.mdx`** (skrót — pełny w Załączniku B):

```yaml
---
slug: ai-w-pracy-biurowej-podstawy
title: "Praktyczne AI dla pracowników biurowych: ChatGPT, Gemini, NotebookLM, Claude. W jeden dzień."
titleSeo: "Szkolenie AI dla pracowników biurowych — ChatGPT, Gemini, NotebookLM | Online 1 dzień"
metaDescription: "Praktyczne 1-dniowe szkolenie online z AI dla pracowników biurowych. Dofinansowanie KFS/PSF do 90%. Następna edycja: 10 czerwca 2026."
eyebrow: "Szkolenie 1-dniowe • Online live • Poziom podstawowy"
summary: "Naucz się bezpiecznie wdrożyć AI w codziennej pracy biurowej. Bez programowania."
level: podstawowy
durationHours: 8
durationLabel: "1 dzień (8h dydaktycznych)"
format: online-live
minParticipants: 4
maxParticipants: 10
priceNet: 1490
trainer: przemek-nowak
validator: krzysztof-liszka
# ... (pełna struktura w Załączniku B)
---

# Treść MDX (sekcje strony — opcjonalnie)
```

### 7.5. Trzymanie statusu liczby miejsc

W MVP — pole `seatsAvailable` w pliku `editions/*.json` aktualizowane manualnie w repo (commit). Po MVP — można zsynchronizować z API BUR (jeśli będzie dostępne) lub Airtable jako proste backstage'owe CMS.

---

<a id="8-design-system"></a>
## 8. System projektowy (design system)

### 8.1. Tokeny CSS / Tailwind config

Zdefiniować w `tailwind.config.js` (Tailwind 4 — nowy CSS-first config przez `@theme`):

```css
@theme {
  /* Colors — sekcja 2.5 */
  --color-primary-900: #0B1220;
  --color-primary-700: #1E293B;
  /* ... */
  --color-accent-500: #2563EB;
  --color-accent-600: #1D4ED8;
  
  /* Typography */
  --font-sans: 'Inter', ui-sans-serif, system-ui;
  --font-display: 'Inter Display', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace;
  
  /* Spacing — bazowe Tailwind, plus: */
  --spacing-section-mobile: 4rem;       /* 64px */
  --spacing-section-desktop: 6rem;      /* 96px */
  
  /* Border-radius */
  --radius-card: 0.75rem;               /* 12px */
  --radius-button: 0.5rem;              /* 8px */
  
  /* Shadow */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05);
  --shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### 8.2. Komponenty (lista pełna w Załączniku C)

Komponenty głównie atomowe i molekularne — bez SPA-owej hydracji, gdzie nie trzeba.

**Kategorie:**
- Layout: Header, Footer, Container, Section, Grid
- Typography: Heading (H1-H6), Eyebrow, Lead, Prose (do MDX)
- Navigation: NavLink, MobileMenu, Breadcrumbs
- Action: Button (primary/secondary/ghost/danger), Link
- Form: Input, Textarea, Select, Checkbox, RadioGroup, FormField, Submit
- Feedback: Alert, Toast, EmptyState, ErrorMessage
- Display: Card, CourseCard, EditionCard, TrainerCard, Tag, Badge, Avatar
- Data: ComparisonTable, OutcomesTable (3-kolumnowa do efektów uczenia się), PriceCard
- Disclosure: Accordion, Tabs, Modal/Dialog, Tooltip
- Interactive (z `client:visible`): FundingCalculator, CourseQuiz, NewsletterForm, ContactForm
- Marketing: HeroSection, TrustStrip, TestimonialCard, FAQAccordion, CTABlock
- Utility: SkipLink, ScreenReaderOnly, FormatDate, FormatPrice

### 8.3. Stany interakcji

Każdy interaktywny element ma 5 stanów: default, hover, focus (visible ring), active, disabled.

**Focus ring:** `outline-2 outline-offset-2 outline-accent-500` — widoczny i zgodny z WCAG.

### 8.4. Responsywność

- Mobile-first.
- Breakpointy Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.
- Layout grid: 1 kolumna na mobile, 2 kolumny na md, 3 kolumny na lg dla większości list.
- Header collapse do hamburgera < 1024px.
- Tabele na mobile: scroll horizontal (`overflow-x-auto`).

### 8.5. Ikony

Lucide Icons (`lucide-static` jako SVG inline lub `lucide-react`/`@iconify` przez Astro). Nie używać emoji.

### 8.6. Obrazy i grafika

- Hero ilustracje: SVG (sygnowane przez NMA, do dostarczenia lub wygenerowane jako placeholder).
- Zdjęcie trenera: zdjęcie portretowe, format 1:1, optymalizacja przez `astro:assets`.
- Brak stockowych zdjęć z robotami AI / „mózgiem cyfrowym" / „digital handshake" — wyklucza się ich.

### 8.7. Tryb ciemny

W MVP — **nie**. (Strona marketingowa, nie aplikacja). Można dodać w v2 — wszystkie tokeny już CSS-zmiennymi, więc to jest 1 dzień pracy.

---

<a id="9-stack"></a>
## 9. Stack technologiczny i struktura repozytorium

### 9.1. Stack wybrany — uzasadnienie

**Astro 5+** zamiast Next.js / SvelteKit. Powody:
1. **SSG-first.** Strona jest w 95% statyczna — Astro generuje czystą HTML. Świetne dla SEO i Core Web Vitals.
2. **Zero JS by default.** JS jest hydrowany tylko tam, gdzie jawnie zaznaczone (`client:visible`, `client:idle`). Lighthouse ~100 out of the box.
3. **Content Collections z Zod.** Idealne do katalogu kursów — typowane dane, walidacja przy buildzie.
4. **MDX** dla bloga i opisów modułów — można osadzać komponenty React/Svelte/Vue w treści.
5. **View Transitions API** — natywna obsługa płynnych przejść między stronami.
6. **Image optimization** (`astro:assets`) — automatyczne WebP/AVIF, lazy loading, placeholder.
7. **Mniejsze repo, mniejszy CI build, niższy koszt hostingu.**

**Alternatywa rozważana:** Next.js 15 z App Router + RSC. Powód odrzucenia: nadmiarowe dla strony marketingowej, większy framework lock-in, tendencja do hydratacji więcej niż potrzeba.

### 9.2. Pełny stack

| Warstwa | Technologia | Wersja |
|---|---|---|
| Framework | Astro | 5.x |
| Język | TypeScript | 5.x |
| Style | Tailwind CSS | 4.x |
| Komponenty interaktywne | React 19 (przez @astrojs/react) | 19.x |
| MDX | @astrojs/mdx | latest |
| Sitemap | @astrojs/sitemap | latest |
| Image | astro:assets (built-in) | — |
| Forms backend | Resend (e-mail) + Cloudflare Workers | — |
| Analytics | Plausible | — |
| Hosting | Cloudflare Pages | — |
| Domena | nextmindacademy.pl (do zarejestrowania) | — |
| Repo | GitHub (private) | — |
| CI/CD | GitHub Actions → Cloudflare Pages | — |
| Lint | ESLint + Prettier + Astro plugin | — |
| Test | Vitest (unit) + Playwright (e2e top-flow) | — |

### 9.3. Struktura repo

```
next-mind-academy/
├── public/
│   ├── favicon.svg
│   ├── og-image-default.png
│   ├── robots.txt
│   └── images/
│       ├── trener/
│       └── og/                          # generowane OG images per page
│
├── src/
│   ├── components/
│   │   ├── layout/                      # Header, Footer, Container, Section
│   │   ├── navigation/                  # NavLink, MobileMenu, Breadcrumbs
│   │   ├── ui/                          # Button, Card, Input, etc.
│   │   ├── courses/                     # CourseCard, OutcomesTable, ModuleAccordion
│   │   ├── marketing/                   # HeroSection, TrustStrip, CTABlock
│   │   ├── interactive/                 # (React) FundingCalculator, CourseQuiz, Forms
│   │   └── seo/                         # MetaTags, StructuredData, Breadcrumbs
│   │
│   ├── content/
│   │   ├── config.ts                    # Zod schemas
│   │   ├── courses/                     # MDX
│   │   ├── editions/                    # JSON
│   │   ├── trainers/                    # MDX
│   │   ├── validators/                  # JSON
│   │   ├── articles/                    # MDX (blog)
│   │   └── faqs/                        # JSON
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro             # html + head + body skeleton
│   │   ├── MarketingLayout.astro        # z Header + Footer
│   │   ├── CourseLayout.astro
│   │   └── ArticleLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro                  # /
│   │   ├── szkolenia/
│   │   │   ├── index.astro              # /szkolenia/
│   │   │   └── [slug].astro             # /szkolenia/:slug/
│   │   ├── terminy/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── dofinansowanie/
│   │   │   ├── index.astro
│   │   │   ├── bur-jak-zapisac.astro
│   │   │   ├── kfs-priorytet-3.astro
│   │   │   ├── psf-podmiotowy-system-finansowania.astro
│   │   │   ├── fers-akademia-hr.astro
│   │   │   └── kalkulator.astro
│   │   ├── firmy.astro
│   │   ├── trener.astro
│   │   ├── o-akademii.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   ├── [slug].astro
│   │   │   └── kategoria/[kategoria].astro
│   │   ├── faq.astro
│   │   ├── kontakt.astro
│   │   ├── materialy/
│   │   │   ├── macierz-decyzyjna-ai.astro
│   │   │   └── checklista-rodo-ai.astro
│   │   ├── thank-you/
│   │   │   ├── zapis-newsletter.astro
│   │   │   └── zapytanie-firma.astro
│   │   ├── regulamin.astro
│   │   ├── polityka-prywatnosci.astro
│   │   ├── deklaracja-dostepnosci.astro
│   │   ├── polityka-cookies.astro
│   │   ├── 404.astro
│   │   └── api/
│   │       ├── newsletter.ts            # endpoint dla form newsletter
│   │       ├── kontakt.ts               # endpoint dla form kontakt
│   │       └── firma.ts                 # endpoint dla form B2B
│   │
│   ├── lib/
│   │   ├── seo.ts                       # helpers do meta-tagów
│   │   ├── schema-org.ts                # builders dla Schema.org
│   │   ├── format.ts                    # formatPrice, formatDate, etc.
│   │   ├── analytics.ts                 # Plausible event helpers
│   │   └── funding-calculator.ts        # logika kalkulatora
│   │
│   ├── styles/
│   │   └── global.css                   # @theme + base styles
│   │
│   └── env.d.ts
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── astro.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── playwright.config.ts
├── README.md
└── LICENSE
```

### 9.4. Konfiguracja Astro (astro.config.mjs)

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://nextmindacademy.pl',
  trailingSlash: 'always',
  output: 'hybrid',                       // SSG + SSR dla form endpoints
  adapter: cloudflare(),
  integrations: [
    tailwind({ applyBaseStyles: false }), // nie nadpisuj naszych base styles
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/thank-you/'),
      i18n: {
        defaultLocale: 'pl',
        locales: { pl: 'pl-PL' },
      },
    }),
    react(),
  ],
  vite: {
    ssr: {
      noExternal: ['react-hook-form', 'zod'],
    },
  },
});
```

### 9.5. ENV variables (.env.example)

```
PUBLIC_SITE_URL=https://nextmindacademy.pl
PUBLIC_PLAUSIBLE_DOMAIN=nextmindacademy.pl
RESEND_API_KEY=
CONTACT_EMAIL_TO=kontakt@nextmindacademy.pl
NEWSLETTER_LIST_ID=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

### 9.6. CI/CD

GitHub Actions:
- `.github/workflows/ci.yml` — na każdy PR: lint + typecheck + unit tests + build.
- `.github/workflows/deploy.yml` — na push do `main`: deploy do Cloudflare Pages.
- Preview deploys na każdy PR (Cloudflare Pages preview).

### 9.7. Wersjonowanie i konwencje

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- PR template z checklistą (build, tests, a11y check, screenshot).
- README z instrukcją lokalnego uruchomienia + struktury projektu + dodawania nowego kursu.

---


---

<a id="10-perf-a11y"></a>
## 10. Performance, dostępność, SEO techniczne

### 10.1. Budżet wydajnościowy (twardy)

| Metryka | Cel | Maksimum |
|---|---|---|
| Lighthouse Performance | ≥ 95 | — |
| Lighthouse Accessibility | 100 | — |
| Lighthouse SEO | 100 | — |
| Lighthouse Best Practices | ≥ 95 | — |
| LCP (Largest Contentful Paint) | < 1,8 s | < 2,5 s |
| FID / INP (Interaction to Next Paint) | < 100 ms | < 200 ms |
| CLS (Cumulative Layout Shift) | < 0,05 | < 0,1 |
| TBT (Total Blocking Time) | < 100 ms | < 200 ms |
| Total page weight (HTML + CSS + JS, gzipped) | < 150 KB | < 300 KB |
| Total page weight wraz z obrazami | < 500 KB | < 1 MB |
| Number of HTTP requests | < 25 | < 50 |

### 10.2. Optymalizacje wymagane

- **Astro built-in image optimization** dla wszystkich zdjęć (`<Image src={...} />`).
- **WebP/AVIF** zamiast JPEG/PNG.
- **Preload** font Inter latin-ext, subset wyłącznie potrzebny (nie cała rodzina).
- **Critical CSS** inline (Astro robi to defaultowo dla SSG).
- **Lazy load** wszystkich obrazów poniżej fold (`loading="lazy"`).
- **No layout shifts** — wszystkie obrazy z `width` i `height`.
- **Brak `@import` w CSS** — wszystko bundlowane.
- **JS hydration** tylko `client:visible` lub `client:idle` — nigdy `client:load`.
- **Plausible script** ładowany jako `defer`.
- **Brak third-party scripts** poza Plausible (no Google Tag Manager, no Hotjar, no chatbot — chyba że świadomie dodajemy później).
- **Cache-Control** dla statycznych assetów: `max-age=31536000, immutable` (przez Cloudflare Pages headers config).

### 10.3. Dostępność (WCAG 2.1 AA — minimalny zestaw kontroli)

**Strukturalne:**
- Każda strona ma jedno H1 i logiczną hierarchię nagłówków (H1 → H2 → H3, bez przeskoków).
- Wszystkie obrazy informacyjne mają `alt`. Obrazy dekoracyjne mają `alt=""` lub `aria-hidden`.
- Wszystkie linki mają tekst opisowy (nie „kliknij tutaj").
- Wszystkie formularze mają `<label>` powiązane przez `for`/`id`.
- Wszystkie pola wymagane są oznaczone i komunikowane przez `aria-required="true"`.
- Wszystkie błędy formularzy są ogłaszane (`role="alert"` lub `aria-live="polite"`).
- `<html lang="pl">` na każdej stronie.
- Nawigacja klawiaturą — pełna, każdy interaktywny element osiągalny przez Tab.
- Skip link „Przejdź do głównej treści" jako pierwszy element po `<body>`.
- Focus visible — kontrastowy ring (`outline-2 outline-offset-2`).
- Brak pułapek tab (`tabindex` tylko dla skip linków lub modali z trapem).

**Wizualne:**
- Kontrast tekstu: ≥ 4.5:1 dla regular text, ≥ 3:1 dla large text.
- Tekst nie jest umieszczony w obrazach.
- Strona działa przy zoomie 200% bez utraty funkcjonalności.
- Animacje respektują `prefers-reduced-motion`.

**Sprawdzenie automatyczne:**
- Każdy build odpala `axe-core` przeciw kluczowym stronom (testy Playwright).
- Lighthouse Accessibility = 100.

**Sprawdzenie ręczne:**
- Test z czytnikiem ekranu (NVDA / VoiceOver) na 3 kluczowych stronach (Home, /szkolenia/podstawy, /kontakt).
- Test klawiaturą (bez myszki) — przejście całej ścieżki konwersji.

**Deklaracja dostępności** — wymóg Ustawy z 4 kwietnia 2019 r. o dostępności cyfrowej. Strona `/deklaracja-dostepnosci` musi zawierać:
- Datę publikacji deklaracji.
- Datę ostatniej aktualizacji.
- Status zgodności (zgodność / częściowa zgodność / brak zgodności) z ustawą.
- Listę treści niedostępnych (jeśli dotyczy).
- Procedurę składania wniosków o zapewnienie dostępności / żądania.
- Dane kontaktowe (e-mail, telefon).
- Link do RPO.

### 10.4. SEO techniczne

**Każda strona MUSI zawierać:**
- Unikalny `<title>` (≤ 60 znaków).
- Unikalny `<meta name="description">` (≤ 160 znaków).
- `<link rel="canonical">` z absolutnym URL.
- OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`).
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
- Strukturalne dane Schema.org JSON-LD (zależne od typu strony — przykłady w Załączniku A).

**Sitemap:**
- Auto-generowany `/sitemap-index.xml` (Astro plugin).
- Wykluczone: strony thank-you, materiały gated, /api/.

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /thank-you/

Sitemap: https://nextmindacademy.pl/sitemap-index.xml
```

**Indeksowalność:**
- Strony „thank-you" mają `<meta name="robots" content="noindex, nofollow">`.
- Strony lead-magnet (gated) mają `noindex` po stronie wewnętrznej, indeksowane są tylko publiczne strony pre-download.

**Strukturalne dane (Schema.org JSON-LD):**
- Homepage: `Organization` + `WebSite`.
- Strona kursu: `Course` + `Offer` + `FAQPage`.
- Strona terminu: `Event` + `Course`.
- Trener: `Person`.
- Artykuł blogu: `Article` + `Person` (author) + `Organization` (publisher).
- Każda strona z breadcrumbsami: `BreadcrumbList`.

**Indeksacja w GSC:**
- Po deploy → ręczna submisja sitemapy w Google Search Console.
- Monitoring purposes coverage — alert na drop w impressions.

### 10.5. Open Graph images (dynamiczne)

Każda strona kursu ma własną OG image generowaną przy buildzie (Satori + Astro). Format: 1200×630, brand colors, H1 strony, logo NMA. Plik zapisany w `/public/og/[slug].png`.

W MVP — można też użyć jednego statycznego OG image dla wszystkich stron. Decyzja: do podjęcia po pierwszych 3 m-cach na podstawie CTR z social.

---

<a id="11-compliance"></a>
## 11. Compliance i strony legalne

### 11.1. RODO — Polityka prywatności

Strona `/polityka-prywatnosci` musi zawierać minimum (wymóg art. 13 RODO):
- Tożsamość administratora (Expert-Sales sp. z o.o. + dane).
- Dane kontaktowe IOD (jeśli powołany — zalecam: `iod@nextmindacademy.pl`).
- Cele i podstawy prawne przetwarzania (lead-form: art. 6 ust. 1 lit. f RODO; newsletter: art. 6 ust. 1 lit. a RODO; rejestracja na szkolenie: art. 6 ust. 1 lit. b RODO).
- Kategorie odbiorców (operator BUR/PARP, hosting Cloudflare, Resend, Plausible, Google).
- Okres przechowywania danych.
- Prawa osoby (dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, przenoszenie).
- Prawo do skargi do PUODO.
- Informacja o profilowaniu (jeśli dotyczy — Plausible nie profiluje, więc nie).
- Informacja o przekazaniu do państw trzecich (Cloudflare — USA — z wskazaniem standard contractual clauses).

Plik źródłowy: `src/content/legal/polityka-prywatnosci.mdx` — pełny tekst do napisania przez prawnika lub na podstawie wzorów PUODO. W MVP — placeholder z TODO.

### 11.2. Cookies

Strona `/polityka-cookies` musi zawierać:
- Definicję cookies.
- Listę cookies używanych z podziałem na: niezbędne (sesja, CSRF), funkcjonalne, statystyczne (Plausible), marketingowe.
- **Plausible nie używa cookies** ani PII — to przewaga GDPR.
- Sposób zarządzania zgodami przez przeglądarkę.

**Cookie banner:**
- W MVP — minimalistyczny banner z opcjami: „Akceptuję wszystkie" / „Tylko niezbędne".
- Pozycja: bottom, sticky, dismissible.
- Zgoda zapamiętywana w `localStorage`.
- Skrypty marketingowe ładują się **tylko po akceptacji**.

Komponent: `<CookieBanner client:idle />`.

### 11.3. Regulamin świadczenia usług

Strona `/regulamin` z zawartością:
- Definicje (Usługodawca, Klient, Usługa).
- Zasady świadczenia usług szkoleniowych.
- Warunki zawarcia umowy (przez formularz BUR + akceptacja regulaminu).
- Cena, VAT, formy płatności.
- Reklamacje (procedura zgodna z Kodeksem cywilnym).
- Prawo odstąpienia (konsumenci — 14 dni; B2B — wyłączone).
- Prawa autorskie do materiałów (SUZ-3).
- RODO (skrót).
- Postanowienia końcowe.

W MVP — szablon do uzupełnienia przez prawnika.

### 11.4. Deklaracja dostępności

Punkt 10.3 — pełen wymóg.

### 11.5. Compliance contentowy

- Wszystkie ceny i poziomy dofinansowań pokazywane na stronie muszą mieć **disclaimer o aktualności** ("informacje na podstawie stanu prawnego z [data]; faktyczne warunki zależą od indywidualnej oceny operatora").
- Wszystkie odwołania do KFS Priorytet 3 i PSF muszą mieć link do oficjalnego źródła.
- Wszystkie hasła typu „dofinansowanie 90%" muszą być doprecyzowane (warunek: mikroprzedsiębiorca, KFS Priorytet 3 — rzeczywiste warunki).
- Brak fałszywych obietnic typu „gwarancja zwiększenia produktywności o 200%".

### 11.6. Compliance prawno-szkoleniowy (BUR)

Strona musi:
- Zawierać kompletne dane operatora (Expert-Sales).
- Umożliwiać weryfikację wpisu do BUR (link do karty dostawcy).
- Nie mylić użytkownika co do statusu („Dostawca usług w BUR z możliwością świadczenia usług z dofinansowaniem" — pełna formuła).
- Nie sugerować, że NMA jest podmiotem certyfikującym, jeśli nim nie jest.
- Nie reklamować się jako „akredytowany przez PARP" (PARP nie wydaje akredytacji w tym sensie).

---

<a id="12-leady"></a>
## 12. Lead capture i integracje

### 12.1. Formularze (lista i pola)

**F1 — Newsletter (mały, w stopce + na stronie po kursie)**
- Pola: e-mail, checkbox „Wyrażam zgodę na otrzymywanie newslettera" (RODO).
- Submit: POST `/api/newsletter`.
- Backend: zapis do listy w wybranej platformie (np. Buttondown / MailerLite / Resend Audiences).

**F2 — Zapytanie o szkolenie (na stronach kursów)**
- Pola: imię, e-mail, telefon (opcjonalnie), wiadomość (textarea), dropdown „Województwo", checkbox „Jestem mikroprzedsiębiorcą" (do kalkulatora KFS), zgoda RODO.
- Submit: POST `/api/kontakt`.
- Backend: e-mail do `kontakt@nextmindacademy.pl` przez Resend + autoresponder do osoby.

**F3 — Zapytanie ofertowe firma (na /firmy)**
- Pola: nazwa firmy, NIP (opcjonalnie), imię i nazwisko, stanowisko, e-mail służbowy, telefon, liczba osób do przeszkolenia, preferowany termin, wybrane szkolenie, dodatkowe wymagania.
- Submit: POST `/api/firma`.
- Backend: e-mail z priorytetem high + utworzenie rekordu w prostym CRM (Airtable / Notion DB).

**F4 — Pobranie lead-magnetu (PDF)**
- Pola: e-mail, zgoda na newsletter (opt-in checkbox).
- Submit: POST `/api/material`.
- Backend: e-mail z linkiem do PDF + dodanie do listy newsletter (jeśli zgoda).

**F5 — Kalkulator dofinansowania (interaktywny)**
- Bez submisji — czysty `client:visible` komponent, oblicza w przeglądarce.
- Po obliczeniu: CTA „Skontaktuj się — pomożemy z wnioskiem" → przekierowanie do F2 z prefilled context.

### 12.2. Antyspam

- **Cloudflare Turnstile** na każdym formularzu (free, lepszy niż reCAPTCHA pod kątem RODO).
- Honeypot field (ukryte pole `website` — bot wypełnia, człowiek nie).
- Server-side rate limiting (max 5 submissions / min / IP) — przez Cloudflare Workers.

### 12.3. Walidacja

- Client-side: `react-hook-form` + `zod` schema.
- Server-side: ten sam Zod schema na endpoint.
- Inline error messages.
- Aria announcements (screen reader friendly).

### 12.4. Analityka i tracking

**Plausible** (privacy-first, no cookies):
- Goal: `course_view` (każda strona kursu).
- Goal: `cta_signup_click` (klik „Zapisz się przez BUR").
- Goal: `form_newsletter_submit`.
- Goal: `form_kontakt_submit`.
- Goal: `form_firma_submit`.
- Goal: `material_download`.
- Goal: `calculator_used`.
- UTM tracking automatyczny.

**Google Search Console** — registered, sitemap submitted.

**Brak Google Analytics** w MVP. Decyzja może zostać zmieniona, jeśli zespół potrzebuje danych demograficznych — wtedy GA4 z anonimizacją IP i consent mode.

### 12.5. Email automation (post-MVP)

W roadmapie po MVP — sequence:
- Subskrypcja newsletter → welcome email z linkiem do darmowego materiału.
- 3 dni później — e-mail „Co to jest BUR i jak się zapisać".
- 7 dni później — zaproszenie na najbliższy termin.

W MVP — tylko welcome email, reszta manualnie.

---

<a id="13-copywriting"></a>
## 13. Treści — copywriting brief

### 13.1. Zasady ogólne

- **Czasowniki operacyjne, nie ogólniki.** „Nauczysz się tworzyć Custom GPT", nie „Poznasz kwestie związane z tworzeniem asystentów AI".
- **Konkretna liczba, nie ogólnik.** „Oszczędzisz 5–8 godzin tygodniowo", nie „znacząco zwiększysz efektywność".
- **Ty / Twój, nie my / nasz.** „Twój zespół zaoszczędzi", nie „nasze szkolenie pozwala".
- **Krótkie zdania.** Średnio 12–15 słów. Akapity 2–4 zdania.
- **Bullet listy** dla informacji równorzędnych.
- **Boldowanie** kluczowych liczb i fraz (oszczędnie, max 3x na akapit).
- **Brak żargonu marketingowego:** „synergia", „transformacja", „best practice" — out.
- **Brak frazesów AI:** „rewolucja AI", „nowa era", „zmienić Twoje życie" — out.

### 13.2. Wzorce nagłówków

**Wzorzec H1 (strony kursów):**
> [Konkretny benefit / co zrobisz]: [konkretne narzędzia]. [Format/ramka].

**Przykłady dobrych H1:**
- „Praktyczne AI dla pracowników biurowych: ChatGPT, Gemini, NotebookLM, Claude. W jeden dzień."
- „Buduj własnych asystentów AI: Google AI Studio, Custom GPT, Claude Projects, Zapier."
- „Naucz się AI w pracy biurowej. W jeden dzień. Z dofinansowaniem do 90%."

**Złe H1 (NIE):**
- „Praktyczne zastosowanie AI w pracy biurowej" — generyczne, słabo rankuje.
- „Wykorzystaj sztuczną inteligencję" — pusty marketing.

### 13.3. Mikro-copy (microcopy)

- Submit button: „Zapisz się na newsletter" (nie „Wyślij").
- Form labels: pełne, opisowe ("Twój e-mail służbowy" zamiast "E-mail").
- Error messages: konkretne, pomocne ("E-mail wygląda na niepoprawny — sprawdź formatowanie").
- Success messages: pozytywne („Świetnie! Sprawdź skrzynkę — wysłaliśmy potwierdzenie na e-mail").
- 404 page: „Tej strony już nie ma. Zajrzyj do [katalogu szkoleń] albo [bloga]."

### 13.4. Plan contentowy — pierwsze 12 artykułów blogu

Priorytet 0 (publikacja w MVP):
1. **„BUR krok po kroku: jak zapisać się na szkolenie z dofinansowaniem w 2026 r."** — pillar artykuł, 3000+ słów, target: „BUR jak zapisać się", „BUR szkolenia dofinansowanie".
2. **„KFS Priorytet 3 w 2026 r. — kompletny przewodnik dla pracodawców"** — 2500+ słów, target: „KFS 2026 priorytet 3", „dofinansowanie KFS na AI".
3. **„ChatGPT vs Gemini vs Claude — który model do jakiego zadania w pracy biurowej?"** — 2000+ słów, target: „ChatGPT vs Claude", „porównanie modeli AI", „który model AI wybrać".

Priorytet 1 (m-c 1–3 po launchu):
4. „PSF a KFS — co lepsze dla mojej firmy?"
5. „Co NIGDY nie wklejać do ChatGPT — checklista RODO dla pracownika biurowego"
6. „NotebookLM po polsku: jak zbudować firmową bazę wiedzy w 1 godzinę"
7. „DigComp 2.2 — co to jest i dlaczego pracodawcy o tym mówią w 2026 r."

Priorytet 2 (m-c 4–6):
8. „Custom GPT, Gemini Gem, Claude Project — który asystent dla kogo"
9. „Prompt engineering bez bzdur: framework Rola + Kontekst + Zadanie + Format"
10. „Zapier vs Make vs n8n — którą platformę no-code wybrać"
11. „AI dla księgowych: 7 konkretnych zastosowań, które oszczędzą Ci 10 godzin tygodniowo"
12. „Jak rozliczyć szkolenie AI z KFS — wzór wniosku i lista dokumentów"

Każdy artykuł musi mieć:
- H1 z frazą kluczową.
- Spis treści (ToC) na początku.
- Tabelki, listy, screenshoty (placeholder w MVP).
- Cytaty rzetelnych źródeł (PARP, JRC, MFiPR).
- 2–3 linki do stron kursów (kontekstowo, nie spamerysko).
- Final CTA: „Zobacz szkolenie XYZ" / „Zapisz się na newsletter".

### 13.5. Lead-magnety (PDF do pobrania)

**LM1 — Macierz decyzyjna AI dla pracownika biurowego (1 strona, format A4)**
- Tabela: Zadanie × Najlepsze narzędzie (ChatGPT / Claude / Gemini / Perplexity / NotebookLM).
- Skuteczne hookery: „Wybierz właściwe narzędzie w 30 sekund".

**LM2 — Checklista bezpieczeństwa RODO dla pracy z AI (1 strona, format A4)**
- 10 punktów: czego nie wklejać, jak anonimizować, jak konfigurować ustawienia danych.

**LM3 — BUR krok po kroku (PDF wyciągnięty z artykułu pillarowego)**
- Wersja "save & print" pillarowego artykułu, 5–7 stron.

W MVP dostarczyć minimum 2 lead-magnety.

### 13.6. Opisy wszystkich 4 modułów Basic (do wkleiena na stronę kursu)

**Moduł 1. Fundamenty AI i bezpieczeństwo pracy z danymi (90 min)**
> Moduł wprowadzający. Buduje wspólną bazę pojęciową i od razu adresuje najważniejszą obawę biznesu — bezpieczeństwo danych i zgodność z RODO. Zaczynamy od krótkiego przeglądu rynku 2026: ChatGPT, Gemini, Claude, Copilot, Perplexity. Każde narzędzie ma swoje zastosowanie i swoje ograniczenia. Pokazujemy różnicę między wersjami darmowymi a płatnymi — gdzie warto dopłacić, gdzie nie. Przechodzimy do RODO: co mówi prawo, co robią firmy, czego absolutnie nie wolno. Dostajesz checklistę „Zanim wkleisz → sprawdź" — gotową do druku, do położenia obok klawiatury. Na koniec — macierz decyzyjna: jakie dane są publiczne, wewnętrzne, poufne, wrażliwe i co z nimi możesz robić w AI.

(Analogicznie 3 kolejne moduły — pełne opisy w pliku `src/content/courses/ai-w-pracy-biurowej-podstawy.mdx` zgodnie z istniejącym draftem specyfikacji.)

### 13.7. FAQ — 20 pytań do napisania

**Szkolenia (5):**
1. Czy szkolenie jest dla mnie, jeśli nie znam ChatGPT?
2. Czy potrzebuję płatnego konta ChatGPT, żeby uczestniczyć?
3. Czy szkolenie jest nagrywane?
4. Co dostaję po szkoleniu?
5. Czy mogę zorganizować szkolenie zamknięte dla mojej firmy?

**Dofinansowanie (5):**
6. Kto może dostać dofinansowanie z KFS?
7. Ile wynosi dofinansowanie z PSF w moim województwie?
8. Czy jako JDG dostanę dofinansowanie?
9. Jak długo trwa proces wnioskowania?
10. Co, jeśli moje województwo nie ma już budżetu?

**Walidacja i certyfikat (5):**
11. Co to jest walidacja efektów uczenia się?
12. Co, jeśli nie zaliczę testu?
13. Czy certyfikat jest uznawany na rynku?
14. Czy certyfikat jest zgodny z DigComp?
15. Czy certyfikat jest po polsku czy po angielsku?

**Techniczne (5):**
16. Jakie są wymagania techniczne?
17. Co jeśli mam wolne łącze?
18. Czy potrzebuję kamery?
19. Co jeśli wypadnie mi termin?
20. Jak zgłosić problem z dostępnością?

---

<a id="14-milestones"></a>
## 14. Plan dostarczenia (milestones)

### Milestone 1 — Foundation (1–2 dni roboczych)
- [ ] Inicjalizacja repo Astro + TypeScript + Tailwind.
- [ ] Setup CI/CD (GitHub Actions → Cloudflare Pages).
- [ ] Setup Plausible.
- [ ] Konfiguracja Content Collections z Zod schemas.
- [ ] Layout bazowy (BaseLayout, Header, Footer).
- [ ] Komponenty UI bazowe (Button, Card, Input, Container, Section).
- [ ] Style globalne, font Inter, paleta kolorów.

### Milestone 2 — Strony kluczowe (2–3 dni)
- [ ] Homepage z wszystkimi sekcjami.
- [ ] Strona kursu Basic z wszystkimi sekcjami (treść z istniejącej specyfikacji).
- [ ] Strona kursu Level 2.
- [ ] Strona katalogu /szkolenia/.
- [ ] Strona terminu (template + 2 instances dla 10.06 i 08.07).
- [ ] Strona /trener.
- [ ] Strona /o-akademii.

### Milestone 3 — Hub dofinansowania (1–2 dni)
- [ ] /dofinansowanie/ (hub).
- [ ] /dofinansowanie/bur-jak-zapisac.
- [ ] /dofinansowanie/kfs-priorytet-3.
- [ ] /dofinansowanie/psf-podmiotowy-system-finansowania.
- [ ] /dofinansowanie/kalkulator (komponent React `client:visible`).

### Milestone 4 — B2B + Blog + FAQ (1–2 dni)
- [ ] /firmy.
- [ ] /blog/ + 3 pierwsze artykuły (priorytet 0 z 13.4).
- [ ] /faq z akordeonem.
- [ ] /kontakt.
- [ ] /materialy/ z 2 lead-magnetami.

### Milestone 5 — Compliance + formularze (1 dzień)
- [ ] /regulamin (placeholder do uzupełnienia prawnie).
- [ ] /polityka-prywatnosci.
- [ ] /polityka-cookies.
- [ ] /deklaracja-dostepnosci.
- [ ] CookieBanner.
- [ ] Wszystkie endpointy `/api/*` z Resend.
- [ ] Cloudflare Turnstile na wszystkich form.
- [ ] Strony /thank-you/.
- [ ] /404.

### Milestone 6 — SEO + performance polish (1 dzień)
- [ ] Wszystkie meta-tagi.
- [ ] Schema.org JSON-LD per strona.
- [ ] OG images (statyczne lub generowane).
- [ ] Sitemap, robots.txt.
- [ ] Lighthouse audit + fix > 95.
- [ ] axe accessibility audit + fix do 100.
- [ ] Testy e2e (Playwright) dla 5 kluczowych ścieżek.

### Milestone 7 — Launch (0,5 dnia)
- [ ] Domena (DNS przez Cloudflare).
- [ ] HTTPS / HSTS.
- [ ] Pre-launch checklist (sekcja 15).
- [ ] Google Search Console + Plausible verification.
- [ ] Sitemapy w GSC.
- [ ] Pierwsza kampania (newsletter do istniejących leadów).

**Łączny czas:** ~ 8–11 dni roboczych dla doświadczonego full-stacka. Claude Code może to zrobić w jednym sprincie kilkudniowym przy aktywnym feedbacku użytkownika.

---

<a id="15-acceptance"></a>
## 15. Kryteria akceptacji

Strona uznana jest za gotową do launchu, gdy spełnione są wszystkie poniższe:

### 15.1. Funkcjonalne
- [ ] Wszystkie strony z sitemapy (sekcja 5.1) są dostępne i wyrenderowane.
- [ ] Każda strona kursu wyświetla pełną tabelę efektów uczenia się.
- [ ] Każda strona kursu ma działający link „Zapisz się przez BUR" (lub „Wkrótce" jeśli karta nie opublikowana).
- [ ] Wszystkie 4 formularze działają end-to-end (test e-mail dociera do skrzynki kontaktowej).
- [ ] Cookie banner działa poprawnie.
- [ ] Kalkulator dofinansowania zwraca poprawne wartości dla 5 testowych scenariuszy (mikro/Prio 3/woj. dolnośląskie itd.).

### 15.2. Performance i SEO
- [ ] Lighthouse Performance ≥ 95 dla 5 kluczowych stron (Home, /szkolenia/podstawy, /szkolenia/level-2, /dofinansowanie/, /firmy).
- [ ] Lighthouse Accessibility = 100 dla tych samych 5 stron.
- [ ] Lighthouse SEO = 100 dla tych samych 5 stron.
- [ ] Sitemap zwalidowana przez Google Search Console.
- [ ] Każda strona ma unikalny `<title>` i `<meta description>`.
- [ ] Schema.org JSON-LD przechodzi walidację Google Rich Results Test.

### 15.3. Compliance
- [ ] /polityka-prywatnosci jest opublikowana (nawet jako wersja podstawowa do uzupełnienia prawnie).
- [ ] /deklaracja-dostepnosci jest opublikowana z aktualną datą.
- [ ] /polityka-cookies jest opublikowana.
- [ ] /regulamin jest opublikowany (lub placeholder z TODO).
- [ ] Stopka zawiera: KRS, NIP, REGON, link do karty BUR.

### 15.4. Treść
- [ ] Wszystkie 2 strony kursów (Basic i Level 2) zawierają pełną treść z istniejących specyfikacji.
- [ ] Strona /trener zawiera pełne bio Przemka z liczbami (placeholder z TODO, jeśli liczby do uzupełnienia).
- [ ] 3 pierwsze artykuły blogu są opublikowane.
- [ ] FAQ ma minimum 15 pytań.
- [ ] 2 lead-magnety (PDF) są dostępne do pobrania po e-mailu.

### 15.5. Techniczne
- [ ] Repo na GitHub z CI/CD.
- [ ] Każdy PR przechodzi build + lint + typecheck.
- [ ] Domena nextmindacademy.pl (lub inna do potwierdzenia) wskazuje na Cloudflare Pages.
- [ ] HTTPS aktywne (Cloudflare Universal SSL).
- [ ] DNS records (A/AAAA, MX, TXT dla SPF/DKIM/DMARC dla e-maili).

### 15.6. Sanity checks
- [ ] Linki do BUR (`uslugirozwojowe.parp.gov.pl`) zwracają 200.
- [ ] Wszystkie formularze działają z włączonym JavaScript i bez (graceful degradation, jeśli możliwe).
- [ ] Strona działa na: Chrome 120+, Firefox 120+, Safari 17+, Edge 120+ (desktop) i mobilne wersje tych samych.
- [ ] Test klawiaturą — pełna ścieżka konwersji (Home → Basic → Form Submit).

---

<a id="zal-a"></a>
## Załącznik A — Przykładowe meta-tagi i schema.org

### A.1. Strona kursu — kompletny przykład

```html
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <title>Szkolenie AI dla pracowników biurowych — ChatGPT, Gemini, NotebookLM | Online 1 dzień</title>
  <meta name="description" content="Praktyczne 1-dniowe szkolenie online z AI dla pracowników biurowych. Dofinansowanie KFS/PSF do 90%. Następna edycja: 10 czerwca 2026." />
  
  <link rel="canonical" href="https://nextmindacademy.pl/szkolenia/ai-w-pracy-biurowej-podstawy/" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Szkolenie AI dla pracowników biurowych — ChatGPT, Gemini, NotebookLM" />
  <meta property="og:description" content="Praktyczne 1-dniowe szkolenie online. Dofinansowanie do 90%." />
  <meta property="og:url" content="https://nextmindacademy.pl/szkolenia/ai-w-pracy-biurowej-podstawy/" />
  <meta property="og:image" content="https://nextmindacademy.pl/og/ai-w-pracy-biurowej-podstawy.png" />
  <meta property="og:locale" content="pl_PL" />
  <meta property="og:site_name" content="Next Mind Academy" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Szkolenie AI dla pracowników biurowych — ChatGPT, Gemini" />
  <meta name="twitter:description" content="Praktyczne 1-dniowe szkolenie online. Dofinansowanie do 90%." />
  <meta name="twitter:image" content="https://nextmindacademy.pl/og/ai-w-pracy-biurowej-podstawy.png" />
  
  <!-- Schema.org Course -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": "https://nextmindacademy.pl/szkolenia/ai-w-pracy-biurowej-podstawy/#course",
        "name": "Praktyczne AI dla pracowników biurowych",
        "description": "Praktyczne 1-dniowe szkolenie online live z AI dla pracowników biurowych spoza IT.",
        "provider": {
          "@type": "Organization",
          "name": "Expert-Sales sp. z o.o.",
          "url": "https://nextmindacademy.pl",
          "sameAs": "https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/dostawca-uslug/podglad?id=199788"
        },
        "courseCode": "NMA-AI-BASIC-1D",
        "educationalLevel": "Beginner",
        "inLanguage": "pl",
        "teaches": [
          "Konstruowanie skutecznych promptów do ChatGPT, Gemini, Claude",
          "Bezpieczne korzystanie z AI w pracy zgodne z RODO",
          "Budowa firmowej bazy wiedzy w NotebookLM",
          "Tworzenie planu wdrożenia AI w pracy biurowej"
        ],
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "Online",
          "courseSchedule": {
            "@type": "Schedule",
            "duration": "PT8H",
            "repeatFrequency": "Monthly"
          },
          "instructor": {
            "@type": "Person",
            "name": "Przemek Nowak",
            "url": "https://nextmindacademy.pl/trener/"
          },
          "startDate": "2026-06-10T09:00",
          "endDate": "2026-06-10T16:00",
          "location": {
            "@type": "VirtualLocation",
            "url": "https://nextmindacademy.pl/terminy/podstawy-2026-06-10/"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": "1490",
          "priceCurrency": "PLN",
          "availability": "https://schema.org/InStock",
          "validFrom": "2026-04-30",
          "url": "https://nextmindacademy.pl/szkolenia/ai-w-pracy-biurowej-podstawy/"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://nextmindacademy.pl/" },
          { "@type": "ListItem", "position": 2, "name": "Szkolenia", "item": "https://nextmindacademy.pl/szkolenia/" },
          { "@type": "ListItem", "position": 3, "name": "AI w pracy biurowej — podstawy" }
        ]
      }
    ]
  }
  </script>
</head>
```

### A.2. Homepage — Schema.org Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://nextmindacademy.pl/#organization",
  "name": "Next Mind Academy",
  "alternateName": "NMA",
  "legalName": "Expert-Sales sp. z o.o.",
  "url": "https://nextmindacademy.pl",
  "logo": "https://nextmindacademy.pl/logo.svg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Słoneczna 6",
    "postalCode": "68-200",
    "addressLocality": "Żary",
    "addressCountry": "PL"
  },
  "taxID": "9282081467",
  "vatID": "PL9282081467",
  "identifier": [
    { "@type": "PropertyValue", "propertyID": "KRS", "value": "0000549030" },
    { "@type": "PropertyValue", "propertyID": "REGON", "value": "361035409" }
  ],
  "sameAs": [
    "https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/dostawca-uslug/podglad?id=199788"
  ]
}
```

---

<a id="zal-b"></a>
## Załącznik B — Schematy treści (JSON examples)

### B.1. Pełny przykład pliku kursu (`src/content/courses/ai-w-pracy-biurowej-podstawy.mdx`)

```yaml
---
slug: "ai-w-pracy-biurowej-podstawy"
title: "Praktyczne AI dla pracowników biurowych: ChatGPT, Gemini, NotebookLM, Claude. W jeden dzień."
titleSeo: "Szkolenie AI dla pracowników biurowych | ChatGPT, Gemini, NotebookLM | 1 dzień online"
metaDescription: "Praktyczne 1-dniowe szkolenie online z AI dla pracowników biurowych. Dofinansowanie KFS/PSF do 90%. Następna edycja: 10 czerwca 2026."
eyebrow: "Szkolenie 1-dniowe • Online live • Poziom podstawowy"
summary: "Naucz się bezpiecznie i skutecznie wdrożyć AI w codziennej pracy biurowej. Bez programowania, bez wiedzy technicznej."
level: podstawowy
durationHours: 8
durationLabel: "1 dzień (8h dydaktycznych)"
format: online-live
language: polski
minParticipants: 4
maxParticipants: 10

burCardId: "DO-UZUPELNIENIA-PO-PUBLIKACJI"
burCardUrl: "https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/uslugi/podglad?id=DO_UZUPELNIENIA"

priceNet: 1490
priceGross: 1832.70
vatExemptInfo: "Zwolniony z VAT przy dofinansowaniu ≥70% (art. 43 ust. 1 pkt 29 ustawy o VAT)."

trainer: "przemek-nowak"
validator: "krzysztof-liszka"

targetAudience:
  - "Pracownicy administracyjni i biurowi"
  - "Specjaliści ds. marketingu, sprzedaży, HR i obsługi klienta"
  - "Asystenci zarządu, koordynatorzy projektów, kierownicy zespołów"
  - "Pracownicy działów finansowych, księgowości i controllingu"
  - "Osoby samozatrudnione i mikroprzedsiębiorcy"
  - "Każdy pracownik pracujący codziennie z mailami, dokumentami, prezentacjami lub danymi"

prerequisites:
  - "Podstawowa umiejętność obsługi komputera"
  - "Znajomość przeglądarki internetowej i pakietu biurowego"
  - "Konto Google (darmowe) — do pracy z Gemini i NotebookLM"
  - "Konto OpenAI (darmowe) — do pracy z ChatGPT"
  - "Brak wiedzy technicznej ani programistycznej"

educationalGoal: "Po szkoleniu uczestnik samodzielnie tworzy efektywne prompty do ChatGPT, Gemini i Claude, wykorzystuje NotebookLM do analizy dokumentów, projektuje 30-dniowy plan wdrożenia AI w swoim stanowisku pracy, przy zachowaniu zasad RODO i polityki danych."

businessGoal: "Oszczędność 5–8 godzin pracy tygodniowo na zadaniach powtarzalnych w ciągu 30 dni po szkoleniu."

learningOutcomes:
  - area: wiedza
    outcome: "Wymienia najważniejsze narzędzia AI generatywnego dostępne w 2026 r. i ich obszary zastosowań."
    verificationCriterion: "Poprawnie przypisuje minimum 4 z 5 narzędzi do ich głównych zastosowań."
    validationMethod: "Test wiedzy: pyt. 1–2"
    digcompMapping: "DigComp 3.1, poz. 4"
  - area: wiedza
    outcome: "Opisuje różnice między ChatGPT, Gemini, Claude i Copilot oraz dobiera narzędzie do zadania."
    verificationCriterion: "Wymienia minimum 3 kryteria doboru narzędzia."
    validationMethod: "Test wiedzy: pyt. 3"
    digcompMapping: "DigComp 5.3, poz. 4"
  # ... (5 efektów wiedzy + 8 umiejętności + 4 kompetencje społeczne)

modules:
  - title: "Fundamenty AI i bezpieczeństwo pracy z danymi"
    durationMin: 90
    summary: "Moduł wprowadzający — buduje wspólną bazę pojęciową i adresuje obawy biznesu."
    tools: ["ChatGPT", "Google Gemini", "Claude", "Microsoft Copilot", "Perplexity"]
    content:
      - "Czym jest generatywna AI i jak działają modele językowe (bez szczegółów technicznych)"
      - "Przegląd rynku 2026: ChatGPT, Gemini, Claude, Copilot, Perplexity — co do czego"
      - "Wersje darmowe vs płatne — kiedy warto dopłacić, kiedy nie"
      - "Możliwości i ograniczenia: halucynacje, brak wiedzy po dacie odcięcia, stronniczość"
      - "RODO a publiczne narzędzia AI"
      - "Klasyfikacja danych: publiczne, wewnętrzne, poufne, wrażliwe"
      - "Czego NIGDY nie wklejać"
      - "Bezpieczna anonimizacja danych"
      - "Checklista 'zanim wkleisz'"
    exercises:
      - "Klasyfikacja przykładowych danych firmowych do macierzy"
      - "Anonimizacja przykładowego dokumentu HR"

  # ... 3 pozostałe moduły analogicznie

validationMethod:
  summary: "Walidacja dwumetodowa: test wiedzy + zadanie praktyczne. Walidator inny niż prowadzący (zgodnie z zasadą rozdzielności funkcji BUR)."
  components:
    - "Test wiedzy: 10 pytań zamkniętych jednokrotnego wyboru, próg 60%, czas 15 min"
    - "Zadanie praktyczne: stworzenie 3 promptów na zadany case + prezentacja wyników"
  passingThreshold: "Min. 60% testu + wykonanie zadania praktycznego"

materials:
  - "Prezentacja szkoleniowa (PDF) — wszystkie 4 moduły"
  - "Biblioteka 20+ szablonów promptów (mail, raport, notatka, analiza, feedback)"
  - "Checklista bezpieczeństwa RODO 'Zanim wkleisz do AI' (1 strona, do druku)"
  - "Macierz decyzyjna: które narzędzie do jakiego zadania"
  - "Szablon planu wdrożenia AI 30/60/90 dni"
  - "Wzorcowy NotebookLM z przykładową firmową bazą wiedzy"
  - "Lista rekomendowanych narzędzi AI z aktualnymi cenami"
  - "Nagranie szkolenia z dostępem na 30 dni"
  - "Imienny certyfikat ukończenia (po pozytywnej walidacji)"
  - "Dostęp do zamkniętej grupy absolwentów"

licenseInfo: "Materiały na licencji niewyłącznej do użytku własnego uczestnika. Dystrybucja do osób trzecich wymaga pisemnej zgody."

technicalRequirements:
  - "Komputer z Windows 10+, macOS 12+ lub Linux"
  - "Min. 8 GB RAM"
  - "Działająca kamera i mikrofon"
  - "Łącze min. 8 Mbps download / 4 Mbps upload (rekomendowany kabel Ethernet)"
  - "Aktualna przeglądarka (Chrome, Edge, Firefox, Safari)"

relatedCourses: ["ai-w-pracy-biurowej-level-2"]
relatedArticles: ["bur-krok-po-kroku", "kfs-priorytet-3-przewodnik", "chatgpt-vs-gemini-vs-claude"]
---

(Opcjonalna treść MDX — sekcje strony jako custom components, np. specjalne CTA tylko dla tego kursu)
```

### B.2. Przykład pliku terminu (`src/content/editions/podstawy-2026-06-10.json`)

```json
{
  "courseSlug": "ai-w-pracy-biurowej-podstawy",
  "date": "2026-06-10",
  "startTime": "09:00",
  "endTime": "16:00",
  "timezone": "Europe/Warsaw",
  "platform": "Zoom",
  "seatsTotal": 10,
  "seatsAvailable": 6,
  "burEditionUrl": "https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/uslugi/podglad?id=DO_UZUPELNIENIA",
  "status": "open-for-signup",
  "schedule": [
    { "no": "1", "timeFrom": "09:00", "timeTo": "09:45", "duration": 45,
      "topic": "T1. Fundamenty AI — przegląd narzędzi generatywnych w 2026 (ChatGPT, Gemini, Claude, Copilot, Perplexity)",
      "form": "wykład + demo" },
    { "no": "2", "timeFrom": "09:45", "timeTo": "10:30", "duration": 45,
      "topic": "T2. Bezpieczeństwo, RODO i klasyfikacja danych w pracy z AI",
      "form": "wykład + ćwicz." },
    { "no": "—", "timeFrom": "10:30", "timeTo": "10:45", "duration": 15,
      "topic": "Przerwa", "form": "—" },
    { "no": "3", "timeFrom": "10:45", "timeTo": "11:30", "duration": 45,
      "topic": "T3. Framework promptowania: Rola + Kontekst + Zadanie + Format",
      "form": "warsztat" },
    { "no": "4", "timeFrom": "11:30", "timeTo": "12:15", "duration": 45,
      "topic": "T4. Zaawansowane techniki promptowania: few-shot, chain-of-thought, iteracja",
      "form": "warsztat" },
    { "no": "—", "timeFrom": "12:15", "timeTo": "12:30", "duration": 15,
      "topic": "Przerwa", "form": "—" },
    { "no": "5", "timeFrom": "12:30", "timeTo": "13:15", "duration": 45,
      "topic": "T5. Praca z dokumentami: maile, raporty, streszczenia, analiza plików",
      "form": "warsztat" },
    { "no": "6", "timeFrom": "13:15", "timeTo": "14:00", "duration": 45,
      "topic": "T6. NotebookLM — budowa firmowej bazy wiedzy z cytowaniami źródeł",
      "form": "warsztat" },
    { "no": "—", "timeFrom": "14:00", "timeTo": "14:15", "duration": 15,
      "topic": "Przerwa", "form": "—" },
    { "no": "7", "timeFrom": "14:15", "timeTo": "15:00", "duration": 45,
      "topic": "T7. Research i analiza z AI: Perplexity, Gemini Deep Research, weryfikacja źródeł",
      "form": "warsztat" },
    { "no": "8", "timeFrom": "15:00", "timeTo": "15:45", "duration": 45,
      "topic": "T8. Prezentacje i materiały wizualne (Gamma, Canva Magic Studio) + plan wdrożenia 30 dni",
      "form": "warsztat" },
    { "no": "W", "timeFrom": "15:45", "timeTo": "16:00", "duration": 15,
      "topic": "Walidacja efektów uczenia się — test końcowy",
      "form": "walidacja" }
  ]
}
```

### B.3. Przykład pliku trenera (`src/content/trainers/przemek-nowak.mdx`)

```yaml
---
slug: "przemek-nowak"
name: "Przemek Nowak"
title: "Trener wiodący Next Mind Academy"
photo: "/images/trener/przemek-nowak.jpg"
yearsOfExperience: 6
hoursDelivered: 0  # DO UZUPEŁNIENIA — wymóg § 6 rozporządzenia BUR
participantsTrained: 0  # DO UZUPEŁNIENIA
certifications:
  - name: "DO UZUPEŁNIENIA — np. Microsoft Certified: Azure AI Engineer Associate"
    issuer: "Microsoft"
    year: 2024
publications: []
linkedin: "https://www.linkedin.com/in/DO_UZUPELNIENIA"
---

# Bio (markdown)

Przemek prowadzi szkolenia z praktycznego zastosowania AI od ... (DO UZUPEŁNIENIA — bio na podstawie CV trenera).

Specjalizuje się w...
```

---

<a id="zal-c"></a>
## Załącznik C — Lista komponentów UI

### C.1. Komponenty Astro (statyczne)

| Komponent | Lokalizacja | Cel |
|---|---|---|
| `Container` | layout/Container.astro | max-w-screen-xl + padding |
| `Section` | layout/Section.astro | py-16 / py-24 z ramką |
| `Header` | layout/Header.astro | Top nav z logo i menu |
| `Footer` | layout/Footer.astro | 4-kolumnowy footer + dane prawne |
| `Breadcrumbs` | navigation/Breadcrumbs.astro | nav z aria-label="breadcrumb" |
| `NavLink` | navigation/NavLink.astro | link nawigacyjny z active state |
| `Button` | ui/Button.astro | primary/secondary/ghost + as=button/a |
| `Card` | ui/Card.astro | Bazowa karta z paddingiem i shadowem |
| `Badge` | ui/Badge.astro | Tag z kolorami (success/warning/info) |
| `Tag` | ui/Tag.astro | Pill dla tagów artykułów |
| `Heading` | ui/Heading.astro | H1-H6 z odpowiednimi stylami |
| `Eyebrow` | ui/Eyebrow.astro | Mała etykieta nad H1 |
| `Lead` | ui/Lead.astro | Większy paragraf wprowadzający |
| `OutcomesTable` | courses/OutcomesTable.astro | Tabela 3-kolumnowa efektów uczenia się |
| `ModuleAccordion` | courses/ModuleAccordion.astro | Akordeon modułów (CSS-only details) |
| `CourseCard` | courses/CourseCard.astro | Karta kursu w katalogu |
| `EditionCard` | courses/EditionCard.astro | Karta terminu w kalendarzu |
| `TrainerCard` | courses/TrainerCard.astro | Karta trenera |
| `PriceCard` | courses/PriceCard.astro | Boks z ceną i CTA |
| `ScheduleTable` | courses/ScheduleTable.astro | Tabela harmonogramu dnia |
| `HeroSection` | marketing/HeroSection.astro | Hero z H1, sub, CTA, ilustracją |
| `TrustStrip` | marketing/TrustStrip.astro | Pasek z badge'ami |
| `CTABlock` | marketing/CTABlock.astro | Sekcja końcowa z big CTA |
| `FAQAccordion` | marketing/FAQAccordion.astro | Akordeon FAQ + Schema.org FAQPage |
| `MetaTags` | seo/MetaTags.astro | Wszystkie meta-tagi |
| `StructuredData` | seo/StructuredData.astro | JSON-LD per typ strony |
| `OGImage` | seo/OGImage.astro | Generator OG przez Satori |

### C.2. Komponenty React (interaktywne, hydrowane `client:visible`)

| Komponent | Lokalizacja | Cel |
|---|---|---|
| `MobileMenu` | interactive/MobileMenu.tsx | Hamburger + drawer |
| `CookieBanner` | interactive/CookieBanner.tsx | Banner cookies |
| `NewsletterForm` | interactive/NewsletterForm.tsx | Form newsletter z walidacją |
| `ContactForm` | interactive/ContactForm.tsx | Form kontaktowy |
| `B2BForm` | interactive/B2BForm.tsx | Form B2B z większą liczbą pól |
| `MaterialDownloadForm` | interactive/MaterialDownloadForm.tsx | Form do pobrania PDF |
| `FundingCalculator` | interactive/FundingCalculator.tsx | Kalkulator KFS/PSF |
| `CourseQuiz` | interactive/CourseQuiz.tsx | Quiz "Które szkolenie dla Ciebie" |
| `Tabs` | interactive/Tabs.tsx | Taby z keyboard nav |

### C.3. Wymagania techniczne komponentów

- Każdy komponent ma TypeScript z explicytnymi typami props.
- Każdy interaktywny komponent ma testy unit (Vitest).
- Każdy komponent jest dokumentowany w pliku `*.stories.mdx` (opcjonalnie — jeśli będzie Storybook po MVP).

---

<a id="zal-d"></a>
## Załącznik D — Roadmap rozszerzeń (po MVP)

### D.1. Faza 2 — Content velocity (m-c 1–3)

- 6 nowych artykułów blogu (z listy 13.4).
- 2 nowe lead-magnety (PDF).
- Strona /historie-sukcesu z 3 case studies (po pierwszych edycjach).
- Strona /opinie / testimoniale.
- Newsletter automation (welcome + 3-day onboarding sequence).

### D.2. Faza 3 — Konwersja i lejek (m-c 4–6)

- A/B test wariantów hero na homepage.
- Heatmapy (Microsoft Clarity — RODO compliant) na top 5 stronach.
- Pop-up exit intent z lead-magnetem (na /szkolenia/).
- Live chat (Crisp / Tawk) z opcją wyłączenia.
- Strona /partner — model afiliacyjny dla operatorów PSF i konsultantów HR.

### D.3. Faza 4 — Skala (m-c 7–12)

- Strona kursu Program 100h (pełna).
- Specjalistyczne warianty: AI dla księgowych, AI dla HR, AI dla sprzedaży, AI dla administracji (4 osobne karty BUR + osobne strony, ten sam silnik).
- Wersja angielska (jeśli pojawi się popyt — `en/`).
- Sklep z dodatkowymi materiałami (e-booki, promptoteki tematyczne) — model jednorazowych płatności przez Stripe.
- Dashboard absolwenta — wymaga logowania (poza scope statycznej strony — separate app).

### D.4. Faza 5 — Społeczność (m-c 12+)

- Forum / community board (Discord / Circle) — link na stronie.
- Webinary cykliczne — landing /webinary z zapisem.
- Konferencja / meetup AI w Polsce — spinoff brand.

---

## Notatki końcowe i otwarte pytania

**Do uzupełnienia przed finalnym buildem (przez właściciela / Pomeblo):**

1. **Ostateczna nazwa marki i domena.** Sugestia: `nextmindacademy.pl` (zgodne z briefem). Sprawdzić dostępność domeny — w MVP zakładam, że jest wolna.
2. **Cena bazowa szkoleń** (placeholdery 1 490 zł / 1 990 zł — do zmiany na finalne).
3. **Bio i liczby trenera** — godziny szkoleniowe w ostatnich 5 latach, liczba uczestników, certyfikaty. Wymóg BUR + wiarygodność.
4. **Standard jakości** — które wybieracie: SUS 3.0 (4 790 zł netto, audyt PIFS) czy ISO 9001:2015 (różny koszt zależnie od audytora). Decyzja wpływa na to, co piszemy w stopce i na /o-akademii.
5. **Karty BUR** — czy w momencie launchu będą już opublikowane? Jeśli nie, na stronach kursów dajemy „Wkrótce dostępna karta w BUR" zamiast aktywnego linku.
6. **Logo i identyfikacja** — czy jest brand book? Czy zlecamy projekt? W MVP używam wordmarku tekstowego.
7. **Treść regulaminu i polityki prywatności** — w MVP daję placeholdery z TODO. Finalne wersje powinien zatwierdzić prawnik (znajomy / Lex Marketing / kancelaria z doświadczeniem RODO + szkolenia).
8. **E-mail do kontaktu** (`kontakt@nextmindacademy.pl` — placeholder; trzeba ustawić DNS dla domeny).
9. **Numer telefonu kontaktowy** — czy używamy biznesowego numeru Expert-Sales czy nowego dedykowanego dla NMA?
10. **Plan publikacji bloga** — kto pisze? (Trener? AI z weryfikacją? Pomeblo? Ghost-writer?)

**Otwarte decyzje techniczne (Claude Code do podjęcia podczas implementacji):**

- Cloudflare Pages vs Vercel — sugeruję Cloudflare Pages (tańszy, szybszy CDN w Polsce).
- React 19 vs Solid vs Svelte 5 dla komponentów interaktywnych — sugeruję React (największy ekosystem, najwięcej resourców).
- Tina CMS / Sanity czy plain MDX — w MVP plain MDX (mniej kosztu, prostszy onboarding).
- Resend czy SendGrid czy Postmark do e-maili — Resend (najnowszy DX, fair pricing dla małych wolumenów).

**Sugerowany skip w MVP (do rozważenia po pierwszych metrykach):**
- Generator OG images (Satori) — w MVP może być jeden statyczny OG image dla wszystkich stron.
- Kalkulator dofinansowania — w MVP wystarczy tabela porównawcza (interaktywność v2).
- Quiz „Które szkolenie dla Ciebie" — v2.

---

**Koniec specyfikacji**

> Dokument przygotowany jako brief wdrożeniowy dla Claude Code.
> Wersja 1.0 — 30 kwietnia 2026.
> Operator marki: Expert-Sales sp. z o.o. (KRS 0000549030, NIP 9282081467).
> Marka: Next Mind Academy.
