// Clinician-authored (Dr. Selma) FAQ knowledge base.
//
// Swedish answers are kept VERBATIM from the source — do not reword or "fix"
// typography. English is the provided translation. Each item has a stable `id`
// so the same Q&A can be referenced from the dedicated /faqs page AND surfaced
// as a relevant subset under individual articles (see `articleFaqIds`).
//
// Both the visible accordion and the FAQPage JSON-LD render from this single
// source, so schema always matches on-page content (2026 GEO best practice:
// FAQ schema is now primarily an AI-citation signal for ChatGPT/Perplexity/
// Google AI Overviews rather than a Google rich-result).

import type { FaqContent } from '@/types/faq-types';

export const faqContent: FaqContent = {
  sv: [
    {
      id: 'basics',
      title: 'Om övervikt och fetma',
      items: [
        { id: 'b1', q: 'Vad är övervikt?', a: 'Övervikt innebär en förhöjd mängd kroppsfett och definieras som BMI 25–29,9. Det ökar risken för metabola sjukdomar men är inte alltid kopplat till ohälsa.' },
        { id: 'b2', q: 'Vad är obesitas/fetma, vilka gränser gäller?', a: 'Obesitas är en kronisk sjukdom med onormalt mycket kroppsfett. Gränser: BMI ≥30 (klass I: 30–34,9, klass II: 35–39,9, klass III: ≥40).' },
        { id: 'b3', q: 'Är fetma en sjukdom?', a: 'Ja, WHO och Socialstyrelsen klassar obesitas som en kronisk sjukdom med biologiska, hormonella och genetiska orsaker.' },
        { id: 'b4', q: 'Hur behandlas fetma?', a: 'Behandling kombinerar livsstilsförändringar, beteendestöd, läkemedel och ibland kirurgi. Målet är varaktig viktminskning och minskad sjukdomsrisk.' },
        { id: 'b5', q: 'Varför räcker inte diet och träning för alla?', a: 'Hungerhormoner, genetik, hjärnans belöningssystem och kroppens ”svältrespons” gör att många återgår till ursprungsvikt trots livsstilsförändringar.' },
        { id: 'b6', q: 'Kan man ha fetma även om man ”äter normalt”?', a: 'Ja, många har biologiska faktorer som gör att kroppen lagrar mer fett trots normal kost. Hormoner, genetik, stress och sömn påverkar hur kroppen reglerar hunger och ämnesomsättning, vilket gör att vissa går upp i vikt även utan överätning.' },
        { id: 'b7', q: 'Varför går jag upp i vikt trots att jag tränar?', a: 'Träning kan öka aptiten och leda till att man omedvetet äter mer. Dessutom kan stress, sömnbrist och vissa mediciner påverka hormoner som gör viktnedgång svårare trots fysisk aktivitet.' },
        { id: 'b8', q: 'Är det svårare att gå ner i vikt efter 40–60 års ålder?', a: 'Ja, ämnesomsättningen sjunker naturligt med åldern och muskelmassan minskar, vilket gör att kroppen förbrukar färre kalorier. Hormonförändringar och sämre sömn kan också bidra till viktuppgång och svårare viktnedgång.' },
        { id: 'b9', q: 'Hur påverkar sömn viktuppgång?', a: 'Sömnbrist ökar hungerhormonet ghrelin och minskar mättnadshormonet leptin, vilket gör att man blir mer sugen på snabb energi. Då försämras blodsockerregleringen och risken för överätning och viktuppgång ökar.' },
        { id: 'b10', q: 'Kan stress orsaka viktökning även om man äter bra?', a: 'Ja, höga kortisolnivåer ökar aptit, fettinlagring och sug efter energität mat. Stress påverkar också sömn och insulinresistens, vilket gör att kroppen lättare går upp i vikt.' },
        { id: 'b11', q: 'Är insulinresistens samma sak som fetma?', a: 'Nej, men de är nära kopplade. Insulinresistens gör att kroppen lagrar mer fett och har svårare att använda energi effektivt, vilket gör viktnedgång mer utmanande.' },
        { id: 'b12', q: 'Kan vissa mediciner göra det svårare att gå ner i vikt?', a: 'Ja, flera vanliga läkemedel påverkar hunger, ämnesomsättning eller vätskeretention. Exempel är antidepressiva, kortison, antipsykotika och insulin, som alla kan bidra till viktuppgång.' },
        { id: 'b13', q: 'Är det farligt att vara ”normalviktig men metabolt sjuk”?', a: 'Ja, man kan ha normalt BMI men högt visceralt fett, insulinresistens eller höga blodfetter. Detta ökar risken för hjärt-kärlsjukdom och diabetes trots normal vikt.' },
      ],
    },
    {
      id: 'nutrition',
      title: 'Kost och näring',
      items: [
        { id: 'n1', q: 'Vad ska man äta vid fetma?', a: 'Proteinrik, fiberrik och energisnål kost med mycket grönsaker, fullkorn, baljväxter och begränsat intag av ultraprocessad mat.' },
        { id: 'n2', q: 'Varför är protein och fiber viktigt vid fetma?', a: 'Protein ökar mättnad och bevarar muskelmassa; fiber stabiliserar blodsocker, minskar hunger och förbättrar tarmhälsa.' },
        { id: 'n3', q: 'Räcker koständring ensamt för att gå ner i vikt?', a: 'För vissa ja, men många behöver kombination av kost, beteendestöd, fysisk aktivitet och ibland läkemedel för varaktig effekt.' },
        { id: 'n4', q: 'Hur påverkar tarmfloran vikten?', a: 'Tarmfloran påverkar hunger, inflammation och hur effektivt kroppen använder energi. En fiberrik kost förbättrar balansen och kan underlätta viktnedgång.' },
        { id: 'n5', q: 'Är ultraprocessad mat värre för vikten än kalorier i sig?', a: 'Ja, den påverkar hungerhormoner, blodsocker och hjärnans belöningssystem mer än naturlig mat. Detta gör att man lättare överäter även vid samma kaloriintag.' },
      ],
    },
    {
      id: 'exercise',
      title: 'Träning och fysisk aktivitet',
      items: [
        { id: 'ex1', q: 'Varför är träning viktig vid övervikt?', a: 'Träning förbättrar insulinresistens, blodtryck, humör och minskar risken för återgång i vikt även om viktnedgången i sig är måttlig.' },
        { id: 'ex2', q: 'Vilken träning passar vid viktnedgång?', a: 'En kombination av styrketräning (bevarar muskelmassa) och konditionsträning (ökar energiförbrukning). Låg belastning passar vid ledbesvär.' },
        { id: 'ex3', q: 'Hur mycket rörelse behövs varje vecka?', a: 'Minst 150–300 min måttlig aktivitet/vecka + 2 styrkepass, enligt WHO. Mer kan behövas för viktstabilitet.' },
        { id: 'ex4', q: 'Kan man gå ner i vikt utan att tappa muskelmassa?', a: 'Ja, med tillräckligt protein, styrketräning och långsam viktnedgång. GLP-1-behandling minskar ofta muskelförlust jämfört med traditionell bantning.' },
      ],
    },
    {
      id: 'medications',
      title: 'Läkemedel mot övervikt',
      items: [
        { id: 'm1', q: 'När kan GLP-1-mediciner användas?', a: 'Vid BMI ≥30 eller BMI ≥27 med viktrelaterad sjukdom (t.ex. diabetes, hypertoni, sömnapné), efter medicinsk bedömning.' },
        { id: 'm2', q: 'Skillnaden mellan Ozempic, Wegovy och Mounjaro?', a: 'Ozempic (semaglutid) för diabetes; Wegovy (semaglutid) för obesitas; Mounjaro (tirzepatid) verkar på både GLP-1 och GIP och ger ofta större viktnedgång.' },
        { id: 'm3', q: 'Vilket läkemedel är bäst?', a: 'Det beror på individens hälsa, biverkningar, mål och tidigare behandling. Ingen ”bäst” för alla.' },
        { id: 'm4', q: 'Vem kan bestämma vilket läkemedel som passar?', a: 'En legitimerad läkare med kunskap om obesitas, patientens sjukdomar och läkemedlens risk–nytta.' },
        { id: 'm5', q: 'Måste man ta medicinen livet ut?', a: 'Obesitas är kroniskt; många behöver långvarig behandling. Avslut leder ofta till viktuppgång, men beslut tas individuellt.' },
        { id: 'm6', q: 'Vilka kriterier gäller för medicinsk behandling av fetma?', a: 'BMI ≥30 eller BMI ≥27 med följdsjukdom + att livsstilsbehandling prövats + medicinsk lämplighet och riskbedömning.' },
        { id: 'm7', q: 'Hur fungerar Ozempic/Wegovy i kroppen?', a: 'Semaglutid efterliknar hormonet GLP-1 som minskar hunger, ökar mättnad, sänker blodsocker och bromsar magsäckstömning.' },
        { id: 'm8', q: 'Hur fungerar Mounjaro i kroppen?', a: 'Tirzepatid stimulerar både GLP-1 och GIP-receptorer, vilket ger starkare aptitdämpning, bättre blodsockerkontroll och större viktnedgång.' },
        { id: 'm9', q: 'Hur många procent svarar på Ozempic/Mounjaro?', a: 'Majoriteten: ca 70–85 % når kliniskt betydande viktnedgång (≥5 %). Mounjaro har högst svarsfrekvens i studier.' },
        { id: 'm10', q: 'Finns det de som inte svarar på injektionsbehandling?', a: 'Ja, 10–30 % får begränsad effekt p.g.a. genetik, hormoner, mediciner eller otillräcklig dos.' },
        { id: 'm11', q: 'Hur många kilon kan man gå ner?', a: 'Wegovy: ca 10–15 % av kroppsvikten. Mounjaro: ca 15–22 %. Variation är stor mellan individer.' },
        { id: 'm12', q: 'Blir man beroende av dessa läkemedel?', a: 'Nej, de skapar inte beroende. Men eftersom obesitas är kroniskt behövs ofta långvarig behandling.' },
        { id: 'm13', q: 'Vad kostar läkemedlen i Sverige?', a: 'Wegovy/Mounjaro kostar ca 1500-3 500 kr/månad utan subvention. Priser varierar mellan apotek.' },
        { id: 'm14', q: 'Finns det tabletter som hjälper mot fetma?', a: 'Ja, t.ex. orlistat och naltrexon/bupropion. Även Rybelsus som är diabetesmedicin kan förskrivas ”off-record”.  Hos dem som av olika skäl inte kan ta injektion. Effekten är måttlig jämfört med injektionsbehandling.' },
        { id: 'm15', q: 'Hur lång tid tar det innan GLP-1-läkemedel fungerar?', a: 'De flesta känner minskad aptit inom 1–2 veckor. Full effekt på vikt och blodsocker kommer när dosen är upptrappad, vanligtvis efter 8–12 veckor' },
      ],
    },
    {
      id: 'sideeffects',
      title: 'Biverkningar och säkerhet',
      items: [
        { id: 'se1', q: 'Vanliga biverkningar vid läkemedel mot övervikt?', a: 'Illamående, diarré, förstoppning, rapningar och minskad aptit. Oftast övergående och dosberoende.' },
        { id: 'se2', q: 'Varför kan man känna sig yr av injektioner mot övervikt?', a: 'Yrsel kan bero på tillfälligt sänkt blodtryck, minskat kaloriintag, lågt blodsocker, vätskebrist eller snabb viktnedgång. Vanligtvis övergående.' },
        { id: 'se3', q: 'Riskerar man håravfall av Ozempic/Wegovy/Mounjaro?', a: 'Håravfall är ovanligt och beror oftare på snabb viktnedgång eller näringsbrist än på läkemedlet i sig.' },
        { id: 'se4', q: 'Ska man ta extra vitaminer vid injektionsbehandling?', a: 'Inte rutinmässigt, men vissa kan behöva extra D-vitamin, B12 eller järn vid lågt intag. Bedöms individuellt.' },
        { id: 'se5', q: 'Är det vanligt att bli blind av Ozempic/Wegovy/Mounjaro?', a: 'Nej. Blindhet är inte en känd biverkning.' },
        { id: 'se6', q: 'Vilket läkemedel har minst biverkningar?', a: 'Alla har liknande magbiverkningar. Mounjaro ger ofta något fler GI-symtom men också större effekt.' },
        { id: 'se7', q: 'När ska man avsluta inför operation?', a: 'GLP-1-läkemedel pausas vanligtvis 1 vecka före narkos p.g.a. fördröjd magsäckstömning.' },
        { id: 'se8', q: 'Kan man resa med Wegovy/Mounjaro och behövs kylväska?', a: 'Oöppnade pennor ska förvaras kallt (2–8°C). Öppnade kan förvaras i rumstemperatur upp till 28–30 dagar beroende på preparat.' },
        { id: 'se9', q: 'Varför mår vissa illa av GLP-1 medan andra inte gör det?', a: 'Illamående beror på att magsäckstömningen går långsammare och kroppen behöver vänja sig. Individuell känslighet, måltidsstorlek och dos påverkar hur starka symtomen blir.' },
        { id: 'se10', q: 'Kan GLP-1 påverka sköldkörteln?', a: 'Hos människor har man inte sett någon påverkan på sköldkörtelhormoner. Varningen om tumörer kommer från råttstudier där doserna var mycket högre än vad människor får.' },
        { id: 'se11', q: 'Är det farligt att dricka alkohol när man tar GLP-1?', a: 'Måttlig alkohol går oftast bra men kan öka illamående och påverka blodsockerreglering. Större mängder kan belasta bukspottkörteln och bör undvikas.' },
        { id: 'se12', q: 'Kan GLP-1 påverka humöret?', a: 'Många upplever förbättrat välmående tack vare stabilare blodsocker och viktnedgång. En liten andel kan få nedstämdhet eller oro, och då bör man kontakta läkare.' },
        { id: 'se13', q: 'Vad händer om man hoppar över en dos?', a: 'En missad dos påverkar sällan långtidsresultatet. Men om flera doser missas kan biverkningar öka när man börjar om, eftersom kroppen behöver vänja sig igen.' },
        { id: 'se14', q: 'Är det farligt att ta för hög dos av misstag?', a: 'Det kan ge kraftigt illamående, kräkningar och yrsel eftersom magen stannar av. Vid svåra symtom bör man söka vård och inte ta nästa dos förrän man fått råd.' },
        { id: 'se15', q: 'Kan GLP-1 orsaka gallsten?', a: 'Läkemedlet i sig orsakar inte gallsten, men snabb viktnedgång ökar risken. Detta gäller alla metoder för snabb viktminskning.' },
        { id: 'se16', q: 'Är det säkert att kombinera GLP-1 med andra viktläkemedel?', a: 'Kombinationer används sällan eftersom biverkningarna kan öka. Bedömning görs alltid av läkare och baseras på risk–nytta.' },
      ],
    },
    {
      id: 'women',
      title: 'Kvinnohälsa och hormoner',
      items: [
        { id: 'w1', q: 'Hur påverkar fetma fertilitet och graviditet?', a: 'Obesitas försämrar ägglossning, ökar risken för graviditetsdiabetes, havandeskapsförgiftning och komplikationer för både mor och barn.' },
        { id: 'w2', q: 'Vad är PCOS och hur hänger det ihop med övervikt?', a: 'PCOS är en hormonell störning med oregelbunden ägglossning och insulinresistens. Övervikt kan förvärra symtomen och hormonbalansen.' },
        { id: 'w3', q: 'Kan viktnedgång förbättra chansen att bli gravid?', a: 'Ja, 5–10 % viktnedgång kan förbättra ägglossning, hormonbalans och fertilitet vid både PCOS och obesitas.' },
        { id: 'w4', q: 'Kan klimakteriet öka risken för övervikt?', a: 'Ja, hormonförändringar minskar ämnesomsättningen, ökar fettinlagring och påverkar hunger och sömn.' },
        { id: 'w5', q: 'När ska man avsluta behandling om man planerar graviditet (kvinnor/män)?', a: 'Semaglutid och tirzepatid bör pausas minst 2 månader före graviditetsförsök för både kvinnor och män.' },
        { id: 'w6', q: 'Hur vet jag om jag har hormonell övervikt?', a: 'Tecken kan vara bukfetma, starkt sug, trötthet, oregelbunden mens eller svårigheter att gå ner i vikt. Orsaker kan vara PCOS, sköldkörtelproblem eller insulinresistens och bör utredas av läkare.' },
        { id: 'w7', q: 'Kan GLP-1 påverka menstruationscykeln?', a: 'Viktnedgång och förbättrad insulinresistens kan normalisera cykeln, särskilt vid PCOS. Vissa kan få tillfälliga förändringar när kroppen anpassar sig.' },
      ],
    },
    {
      id: 'process',
      title: 'Viktnedgång: kropp och process',
      items: [
        { id: 'p1', q: 'Vilka livsstilsförändringar är viktiga under behandlingen?', a: 'Proteinrik kost, fiber, regelbundna måltider, styrketräning, vardagsrörelse, sömn och stresshantering.' },
        { id: 'p2', q: 'Kan artros bli bättre av viktnedgång?', a: 'Ja, även 5–10 % viktnedgång minskar smärta och belastning på knän och höfter.' },
        { id: 'p3', q: 'Hur snabbt är det säkert att gå ner i vikt?', a: '1–4 kg per månad är oftast hållbart och minskar risken för muskelförlust. Snabbare viktnedgång kan vara medicinskt säker under övervakning men kräver professionell uppföljning.' },
        { id: 'p4', q: 'Varför stannar viktnedgången av efter några månader?', a: 'Kroppen försvarar sin tidigare vikt genom att sänka ämnesomsättningen och öka hungerhormoner. Detta är en normal biologisk platå och inte ett tecken på misslyckande.' },
        { id: 'p5', q: 'Hur mycket muskler förlorar man vid viktnedgång?', a: 'Utan styrketräning kan upp till en tredjedel av viktminskningen vara muskelmassa. Proteinrik kost och styrketräning minskar förlusten betydligt.' },
        { id: 'p6', q: 'Varför får man förstoppning när man går ner i vikt?', a: 'Mindre matvolym, mer protein och långsammare magtömning kan bidra. Fiber, vätska och rörelse hjälper magen att fungera bättre.' },
        { id: 'p7', q: 'Är ”set point theory” verklig?', a: 'Ja, kroppen försvarar en viss vikt genom hormonella och metabola mekanismer. GLP-1 kan hjälpa till att sänka denna set point över tid.' },
        { id: 'p8', q: 'Varför fryser man mer när man går ner i vikt?', a: 'Mindre kroppsfett och lägre energiintag gör att kroppen producerar mindre värme. Ämnesomsättningen sjunker också när man går ner i vikt.' },
        { id: 'p9', q: 'Hur påverkar viktminskning huden?', a: 'Snabb viktnedgång kan ge lös hud eftersom huden inte hinner dra ihop sig. Ålder, genetik och mängden vikt spelar stor roll.' },
        { id: 'p10', q: 'Kan man förebygga lös hud?', a: 'Långsam viktnedgång, styrketräning, protein och hudvård kan minska risken. Större hudöverskott kan kräva kirurgi för att tas bort.' },
      ],
    },
  ],
  en: [
    {
      id: 'basics',
      title: 'About overweight and obesity',
      items: [
        { id: 'b1', q: 'What is overweight?', a: 'Overweight means an increased amount of body fat and is defined as a BMI of 25–29.9. It raises the risk of metabolic diseases but is not always linked to poor health.' },
        { id: 'b2', q: 'What is obesity and what are the cut-offs?', a: 'Obesity is a chronic disease characterized by excessive body fat. Cut-offs: BMI ≥30 (Class I: 30–34.9, Class II: 35–39.9, Class III: ≥40).' },
        { id: 'b3', q: 'Is obesity a disease?', a: 'Yes. WHO and national health authorities classify obesity as a chronic disease with biological, hormonal and genetic causes.' },
        { id: 'b4', q: 'How is obesity treated?', a: 'Treatment combines lifestyle changes, behavioural support, medication and sometimes surgery. The goal is sustainable weight loss and reduced disease risk.' },
        { id: 'b5', q: 'Why aren’t diet and exercise enough for everyone?', a: 'Hunger hormones, genetics, the brain’s reward system and the body’s “starvation response” make many regain weight despite lifestyle changes.' },
        { id: 'b6', q: 'Can you have obesity even if you “eat normally”?', a: 'Yes, many people have biological factors that make the body store more fat despite normal eating. Hormones, genetics, stress and sleep influence how the body regulates hunger and metabolism, which means some gain weight even without overeating.' },
        { id: 'b7', q: 'Why am I gaining weight even though I exercise?', a: 'Exercise can increase appetite and lead to unconscious overeating. In addition, stress, poor sleep and certain medications can alter hormones that make weight loss harder despite physical activity.' },
        { id: 'b8', q: 'Is it harder to lose weight after age 40–60?', a: 'Yes, metabolism naturally slows with age and muscle mass decreases, which lowers daily energy expenditure. Hormonal changes and poorer sleep also contribute to weight gain and slower weight loss.' },
        { id: 'b9', q: 'How does sleep affect weight gain?', a: 'Lack of sleep increases the hunger hormone ghrelin and decreases the satiety hormone leptin, making cravings stronger. This disrupts blood sugar regulation and increases the risk of overeating and weight gain.' },
        { id: 'b10', q: 'Can stress cause weight gain even if you eat well?', a: 'Yes, high cortisol levels increase appetite, fat storage and cravings for energy-dense foods. Stress also affects sleep and insulin resistance, making weight gain more likely.' },
        { id: 'b11', q: 'Is insulin resistance the same as obesity?', a: 'No, but they are closely linked. Insulin resistance makes the body store more fat and use energy less efficiently, which makes weight loss more challenging.' },
        { id: 'b12', q: 'Can certain medications make weight loss harder?', a: 'Yes, several common medications affect appetite, metabolism or fluid retention. Examples include antidepressants, corticosteroids, antipsychotics and insulin, all of which can contribute to weight gain.' },
        { id: 'b13', q: 'Is it dangerous to be “normal weight but metabolically unhealthy”?', a: 'Yes, you can have a normal BMI but high visceral fat, insulin resistance or abnormal blood lipids. This increases the risk of cardiovascular disease and diabetes despite a normal weight.' },
      ],
    },
    {
      id: 'nutrition',
      title: 'Diet and nutrition',
      items: [
        { id: 'n1', q: 'What should you eat when living with obesity?', a: 'A protein-rich, fibre-rich and energy-reduced diet with plenty of vegetables, whole grains, legumes and limited ultra-processed foods.' },
        { id: 'n2', q: 'Why are protein and fibre important in obesity?', a: 'Protein increases satiety and preserves muscle mass; fibre stabilises blood sugar, reduces hunger and supports gut health.' },
        { id: 'n3', q: 'Is diet alone enough for weight loss?', a: 'For some, yes. But many need a combination of diet, behavioural support, physical activity and sometimes medication for lasting results.' },
        { id: 'n4', q: 'How does the gut microbiome affect weight?', a: 'The microbiome influences hunger, inflammation and how efficiently the body uses energy. A fibre-rich diet improves balance and may support weight loss.' },
        { id: 'n5', q: 'Is ultra-processed food worse for weight than calories alone?', a: 'Yes, it affects hunger hormones, blood sugar and the brain’s reward system more strongly than whole foods. This makes overeating easier even at the same calorie intake.' },
      ],
    },
    {
      id: 'exercise',
      title: 'Exercise and physical activity',
      items: [
        { id: 'ex1', q: 'Why is exercise important in overweight?', a: 'Exercise improves insulin resistance, blood pressure, mood and reduces the risk of weight regain even if weight loss itself is modest.' },
        { id: 'ex2', q: 'What type of exercise is suitable for weight loss?', a: 'A combination of strength training (preserves muscle mass) and aerobic exercise (increases energy expenditure). Low-impact options suit joint pain.' },
        { id: 'ex3', q: 'How much physical activity is needed each week?', a: 'At least 150–300 minutes of moderate activity per week + 2 strength sessions, according to WHO. More may be needed for weight maintenance.' },
        { id: 'ex4', q: 'Can you lose weight without losing muscle?', a: 'Yes, with adequate protein, strength training and gradual weight loss. GLP-1 treatment often reduces muscle loss compared to traditional dieting' },
      ],
    },
    {
      id: 'medications',
      title: 'Weight-loss medications',
      items: [
        { id: 'm1', q: 'When can GLP-1 medications be used?', a: 'For BMI ≥30, or BMI ≥27 with weight-related conditions (e.g., diabetes, hypertension, sleep apnoea), after medical assessment.' },
        { id: 'm2', q: 'What is the difference between Ozempic, Wegovy and Mounjaro?', a: 'Ozempic (semaglutide) is for diabetes; Wegovy (semaglutide) is for obesity; Mounjaro (tirzepatide) acts on both GLP-1 and GIP and often results in greater weight loss.' },
        { id: 'm3', q: 'Which medication is best?', a: 'It depends on individual health, side effects, goals and previous treatments. There is no single “best” option.' },
        { id: 'm4', q: 'Who decides which medication is appropriate?', a: 'A licensed physician with expertise in obesity, the patient’s medical history and the risk–benefit profile of each medication.' },
        { id: 'm5', q: 'Do you need to take the medication for life?', a: 'Obesity is chronic; many require long-term treatment. Stopping often leads to weight regain, but decisions are individual.' },
        { id: 'm6', q: 'What are the criteria for medical obesity treatment?', a: 'BMI ≥30, or BMI ≥27 with comorbidities + prior lifestyle attempts + medical suitability and risk assessment.' },
        { id: 'm7', q: 'How do Ozempic/Wegovy work in the body?', a: 'Semaglutide mimics the GLP-1 hormone, reducing hunger, increasing satiety, lowering blood sugar and slowing stomach emptying.' },
        { id: 'm8', q: 'How does Mounjaro work in the body?', a: 'Tirzepatide activates both GLP-1 and GIP receptors, providing stronger appetite suppression, improved glucose control and greater weight loss.' },
        { id: 'm9', q: 'How many respond to Ozempic/Mounjaro?', a: 'Most patients: about 70–85% achieve clinically meaningful weight loss (≥5%). Mounjaro shows the highest response rates in studies.' },
        { id: 'm10', q: 'Are there people who do not respond to injections?', a: 'Yes. About 10–30% have limited effect due to genetics, hormones, medications or insufficient dose.' },
        { id: 'm11', q: 'How much weight can you lose?', a: 'Wegovy: about 10–15% of body weight. Mounjaro: about 15–22%. Individual variation is large.' },
        { id: 'm12', q: 'Do these medications cause addiction?', a: 'No, they are not addictive. But because obesity is chronic, long-term treatment is often needed.' },
        { id: 'm13', q: 'What do the medications cost in Sweden?', a: 'Wegovy/Mounjaro cost approximately 1,500–3,500 SEK per month without subsidy. Prices vary between pharmacies.' },
        { id: 'm14', q: 'Are there tablets that help with obesity?', a: 'Yes, such as orlistat and naltrexone/bupropion. Rybelsus (oral semaglutide) may be prescribed off-label for those unable to use injections. Effects are more modest than injectable treatments.' },
        { id: 'm15', q: 'How long does it take for GLP-1 medications to work?', a: 'Most people feel reduced appetite within 1–2 weeks. Full effects on weight and blood sugar appear once the dose is titrated, usually after 8–12 weeks.' },
      ],
    },
    {
      id: 'sideeffects',
      title: 'Side effects and safety',
      items: [
        { id: 'se1', q: 'Common side effects of weight-loss medications?', a: 'Nausea, diarrhoea, constipation, belching and reduced appetite. Usually temporary and dose-dependent.' },
        { id: 'se2', q: 'Why can injections for weight loss cause dizziness?', a: 'Dizziness may result from temporarily lowered blood pressure, reduced calorie intake, low blood sugar, dehydration or rapid weight loss. Usually temporary.' },
        { id: 'se3', q: 'Can Ozempic/Wegovy/Mounjaro cause hair loss?', a: 'Hair loss is uncommon and more often related to rapid weight loss or nutrient deficiency than to the medication itself.' },
        { id: 'se4', q: 'Should you take extra vitamins during treatment?', a: 'Not routinely, but some may need extra vitamin D, B12 or iron if intake is low. Assessed individually.' },
        { id: 'se5', q: 'Is blindness a common side effect?', a: 'No. Blindness is not a known side effect. (Only rapid glucose improvement in diabetes can temporarily affect vision.)' },
        { id: 'se6', q: 'Which medication has the fewest side effects?', a: 'All have similar gastrointestinal side effects. Mounjaro may cause slightly more GI symptoms but also greater weight loss.' },
        { id: 'se7', q: 'When should treatment be paused before surgery?', a: 'GLP-1 medications are usually paused 1 week before anaesthesia due to delayed stomach emptying.' },
        { id: 'se8', q: 'Can you travel with Wegovy/Mounjaro and do you need a cooling bag?', a: 'Unopened pens must be kept cold (2–8°C). Opened pens can be stored at room temperature for 28–30 days depending on the product.' },
        { id: 'se9', q: 'Why do some people feel nauseous on GLP-1 while others don’t?', a: 'Nausea occurs because stomach emptying slows and the body needs time to adjust. Individual sensitivity, meal size and dose all influence how strong the symptoms become.' },
        { id: 'se10', q: 'Can GLP-1 affect the thyroid?', a: 'No effects on thyroid hormones have been seen in humans. The tumour warning comes from rodent studies where doses were far higher than those used in humans.' },
        { id: 'se11', q: 'Is it dangerous to drink alcohol while taking GLP-1?', a: 'Moderate alcohol is usually fine but may increase nausea and affect blood sugar regulation. Larger amounts can stress the pancreas and should be avoided.' },
        { id: 'se12', q: 'Can GLP-1 affect mood?', a: 'Many experience improved well-being due to more stable blood sugar and weight loss. A small number may experience low mood or anxiety, and should contact a doctor if symptoms persist.' },
        { id: 'se13', q: 'What happens if you skip a dose?', a: 'One missed dose rarely affects long-term results. But if several doses are missed, side effects may increase when restarting because the body needs to readjust.' },
        { id: 'se14', q: 'Is it dangerous to take too high a dose by mistake?', a: 'It can cause severe nausea, vomiting and dizziness because stomach emptying slows dramatically. For severe symptoms, medical care is recommended and the next dose should be delayed until advised.' },
        { id: 'se15', q: 'Can GLP-1 cause gallstones?', a: 'The medication itself does not cause gallstones, but rapid weight loss increases the risk. This applies to all methods of rapid weight reduction.' },
        { id: 'se16', q: 'Is it safe to combine GLP-1 with other weight-loss medications?', a: 'Combinations are rarely used because side effects may increase. A doctor must always assess risks and benefits.' },
      ],
    },
    {
      id: 'women',
      title: 'Women’s health and hormones',
      items: [
        { id: 'w1', q: 'How does obesity affect fertility and pregnancy?', a: 'Obesity impairs ovulation and increases the risk of gestational diabetes, pre-eclampsia and complications for both mother and baby.' },
        { id: 'w2', q: 'What is PCOS and how is it linked to overweight?', a: 'PCOS is a hormonal disorder with irregular ovulation and insulin resistance. Excess weight can worsen symptoms and hormonal imbalance.' },
        { id: 'w3', q: 'Can weight loss improve the chance of getting pregnant?', a: 'Yes. A 5–10% weight loss can improve ovulation, hormone balance and fertility in both PCOS and obesity.' },
        { id: 'w4', q: 'Can menopause increase the risk of weight gain?', a: 'Yes. Hormonal changes reduce metabolism, increase fat storage and affect hunger and sleep.' },
        { id: 'w5', q: 'When should treatment be stopped if planning pregnancy (women/men)?', a: 'Semaglutide and tirzepatide should be stopped at least 2 months before trying to conceive for both women and men.' },
        { id: 'w6', q: 'How do I know if I have hormonal weight gain?', a: 'Signs include abdominal fat, strong cravings, fatigue, irregular periods or difficulty losing weight. Causes may include PCOS, thyroid disorders or insulin resistance and should be evaluated by a doctor.' },
        { id: 'w7', q: 'Can GLP-1 affect the menstrual cycle?', a: 'Weight loss and improved insulin resistance can normalize cycles, especially in PCOS. Some may experience temporary changes as the body adapts.' },
      ],
    },
    {
      id: 'process',
      title: 'Weight loss: the body and the process',
      items: [
        { id: 'p1', q: 'Which lifestyle changes are important during treatment?', a: 'Protein-rich meals, fibre, regular eating patterns, strength training, daily movement, good sleep and stress management.' },
        { id: 'p2', q: 'Can osteoarthritis improve with weight loss?', a: 'Yes. Even 5–10% weight loss reduces pain and joint load in knees and hips.' },
        { id: 'p3', q: 'How fast is it safe to lose weight?', a: 'Losing 1–4 kg per month is usually sustainable and reduces the risk of muscle loss. Faster weight loss can be medically safe under supervision but requires professional monitoring.' },
        { id: 'p4', q: 'Why does weight loss plateau after a few months?', a: 'The body defends its previous weight by lowering metabolism and increasing hunger hormones. This is a normal biological plateau and not a sign of failure.' },
        { id: 'p5', q: 'How much muscle do you lose during weight loss?', a: 'Without strength training, up to one-third of weight loss can be muscle. A protein-rich diet and resistance training significantly reduce muscle loss.' },
        { id: 'p6', q: 'Why does constipation occur during weight loss?', a: 'Smaller food volume, higher protein intake and slower stomach emptying can contribute. Fibre, hydration and movement help the gut function better.' },
        { id: 'p7', q: 'Is the “set point theory” real?', a: 'Yes, the body defends a certain weight through hormonal and metabolic mechanisms. GLP-1 can help lower this set point over time.' },
        { id: 'p8', q: 'Why do you feel colder when losing weight?', a: 'Less body fat and lower energy intake reduce heat production. Metabolism also slows during weight loss, making you feel colder.' },
        { id: 'p9', q: 'How does weight loss affect the skin?', a: 'Rapid weight loss can cause loose skin because the skin cannot shrink quickly enough. Age, genetics and the amount of weight lost all play a role.' },
        { id: 'p10', q: 'Can loose skin be prevented?', a: 'Slow weight loss, strength training, protein intake and good skincare can reduce the risk. Larger excess skin may require surgery to remove.' },
      ],
    },
  ],
};

/**
 * Which FAQ item ids (4–8 per article, the GEO sweet spot) surface as a
 * relevant block under each article. Ids reference faqContent items above.
 */
export const articleFaqIds: Record<string, string[]> = {
  'what-is-obesity': ['b1', 'b2', 'b3', 'b5', 'b6', 'b11', 'b13'],
  'treating-obesity': ['b4', 'm1', 'm6', 'p1', 'p3', 'p4', 'p7'],
  'women-health-obesity': ['w1', 'w2', 'w3', 'w4', 'w6', 'w7'],
  'nutrition-obesity': ['n1', 'n2', 'n3', 'n4', 'n5', 'p6'],
  'exercise-obesity': ['ex1', 'ex2', 'ex3', 'ex4', 'p5'],
  'semaglutide-vs-tirzepatide': ['m2', 'm3', 'm7', 'm8', 'm9', 'm11', 'm15', 'se9'],
};

/** Flat lookup of every item by id (locale-aware), for article subsets. */
export const faqItemsById = (locale: 'sv' | 'en') => {
  const map = new Map<string, { id: string; q: string; a: string }>();
  for (const cat of faqContent[locale]) {
    for (const item of cat.items) map.set(item.id, item);
  }
  return map;
};
