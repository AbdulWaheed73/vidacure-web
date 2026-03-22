type ResourceSection = {
  heading: string;
  body?: string;
  bullets?: string[];
};

type ResourceArticle = {
  id: string;
  titleEn: string;
  titleSv: string;
  descriptionEn: string;
  descriptionSv: string;
  icon: string;
  category: string;
  contentEn: ResourceSection[];
  contentSv: ResourceSection[];
};

export const patientResources: ResourceArticle[] = [
  {
    id: 'blood-testing',
    titleEn: 'Blood Testing',
    titleSv: 'Provtagning',
    descriptionEn: 'Evidence-based risk profiling for cardiovascular disease, diabetes, and related conditions.',
    descriptionSv: 'Evidensbaserad riskprofilering för hjärt\u2013kärlsjukdom, diabetes och relaterade tillstånd.',
    icon: 'TestTubes',
    category: 'testing',
    contentEn: [
      {
        heading: 'Blood Testing',
        body: 'In cases of overweight and obesity, blood testing is recommended as an important part of the medical evaluation. According to current guidelines, an individual\u2019s cardiovascular risk profile should be assessed before treatment is initiated, especially when BMI is between 27\u201329. Blood tests help identify risk factors for cardiovascular disease, diabetes, and other related conditions, and provide a safe foundation for planning appropriate treatment and follow\u2011up.',
      },
      {
        heading: 'Evidence\u2011based risk profiling for cardiovascular disease, diabetes, and related conditions',
        body: 'With overweight and obesity, the risk of cardiovascular disease, diabetes, and other chronic conditions increases. Therefore, it is important to regularly check certain blood tests to detect abnormalities early and initiate appropriate treatment in time. Our testing program is based on current evidence and guidelines for preventive health care and provides you with a clear, medically relevant picture of your health status.\n\nAfter the blood tests, a physician reviews your results and provides written medical feedback with recommendations for continued treatment. If any value deviates in a way that requires further investigation, we will refer you to your primary care provider.',
      },
      {
        heading: 'Our Test Packages',
      },
      {
        heading: 'Basic Panel \u2013 included in the medical/lifestyle program',
        body: 'This package contains the tests that are required according to guidelines to assess the risk of cardiovascular disease, diabetes, and related conditions.\n\nIncluded:',
        bullets: [
          'Blood lipids (cholesterol, LDL, HDL, triglycerides \u2014 used to detect hyperlipidemia)',
          'Fasting glucose and HbA1c (long\u2011term blood sugar \u2014 used to screen for elevated glucose, prediabetes, or diabetes)',
          'Thyroid function test (important to rule out underactive thyroid function)',
          'Kidney and liver function test',
          'Current Weight',
        ],
      },
      {
        heading: '',
        body: 'In addition to these blood tests, we strongly recommend that you have your blood pressure checked at your Health Care Center or at any pharmacy that offers this service.',
      },
    ],
    contentSv: [
      {
        heading: 'Provtagning',
        body: 'Vid övervikt och obesitas rekommenderas provtagning som en viktig del av den medicinska utredningen. Enligt gällande riktlinjer behöver man utvärdera individens hjärtkärlmässiga riskprofil innan behandling påbörjas, särskilt om BMI ligger mellan 27\u201329. Blodprover hjälper till att identifiera riskfaktorer för hjärt\u2013kärlsjukdom, diabetes och andra relaterade tillstånd, och ger en säker grund för att planera rätt behandling och uppföljning.',
      },
      {
        heading: 'Evidensbaserad riskprofilering för hjärt\u2013kärlsjukdom, diabetes och relaterade tillstånd',
        body: 'Vid övervikt och obesitas ökar risken för hjärt\u2013kärlsjukdomar, diabetes och andra kroniska tillstånd. Därför är det viktigt att regelbundet kontrollera vissa blodprover för att tidigt upptäcka avvikelser och kunna sätta in rätt behandling i tid. Vårt provtagningsprogram bygger på aktuell evidens och riktlinjer för preventivt hälsoarbete och ger dig en tydlig, medicinskt relevant bild av din hälsostatus.\n\nEfter provtagningen går en läkare igenom dina resultat och ger en skriftlig medicinsk återkoppling med rekommendationer för fortsatt behandling. Om något värde avviker på ett sätt som kräver vidare utredning hänvisar vi dig till din vårdcentral. Instruktioner för hur provtagningen går till kommer du att få när du beställer dina prover.',
      },
      {
        heading: 'Våra provpaket',
      },
      {
        heading: 'Basprov \u2013 ingår i medicinskt/livsstilsprogrammet',
        body: 'Detta paket innehåller de prover som enligt riktlinjer är nödvändiga för att bedöma risk för hjärt\u2013kärlsjukdom, diabetes och relaterade tillstånd.\n\nInnehåll:',
        bullets: [
          'Blodfetter (kolesterol, LDL, HDL, triglycerider \u2014 avslöjar om man har hyperlipidemi)',
          'Faste-glukos och HbA1c (långtidssocker \u2014 dessa tas för att screena för förhöjt blodsocker, prediabetes eller diabetes)',
          'Leverprover (Förhöjda leverprover kan tyda på fettlever)',
          'Njurfunktion (Njursvikt kan tyda på kärlsjukdom)',
          'Blodstatus (Blodvärde och relaterade prover om blodkroppar)',
          'Sköldkörtelprov (Viktigt att utesluta underfunktion av sköldkörtel)',
        ],
      },
    ],
  },
  {
    id: 'tips-glp1',
    titleEn: 'Tips for GLP-1/GIP Treatment',
    titleSv: 'Tips för GLP-1/GIP-behandling',
    descriptionEn: 'Nutrition, activity, and lifestyle tips to support your treatment with Wegovy, Ozempic, or Mounjaro.',
    descriptionSv: 'Kost-, aktivitets- och livsstilstips som stödjer din behandling med Wegovy, Ozempic eller Mounjaro.',
    icon: 'Lightbulb',
    category: 'tips',
    contentEn: [
      {
        heading: 'TIPS TO SUPPORT YOUR TREATMENT WITH GLP-1/GIP',
        body: 'Wegovy \u00b7 Ozempic \u00b7 Mounjaro',
      },
      {
        heading: 'Nutrition Habits That Support Treatment',
        bullets: [
          'Prioritize protein at each meal to help maintain muscle mass and improve satiety.',
          'Increase fiber intake through vegetables, legumes, whole grains, and berries.',
          'Stay well-hydrated, as dehydration can worsen nausea and constipation.',
          'Limit sugar, alcohol, and ultra-processed foods, which can trigger cravings or stomach discomfort.',
          'Avoid late-night eating, giving your digestive system time to rest.',
          'Reduce artificial sweeteners if they cause bloating or cravings.',
        ],
      },
      {
        heading: 'Physical Activity That Works Well With GLP-1/GIP Medications',
        bullets: [
          'Strength training two to three times per week helps preserve muscle mass during weight loss.',
          'Daily movement, such as walking, cycling, or light activity, supports metabolism and digestion.',
          'Low-intensity exercise is often easier to maintain during the first weeks of treatment when nausea may occur.',
          'Consistency matters more than intensity; small, regular habits are more effective long-term.',
        ],
      },
      {
        heading: 'Lifestyle Routines That Improve Results',
        bullets: [
          'Regular meal timing helps stabilize hunger signals.',
          'Quality sleep supports appetite regulation and energy levels.',
          'Stress management through mindfulness, breathing exercises, yoga, or meditation can reduce emotional eating.',
          'Slow eating helps you recognize fullness earlier and avoid overeating.',
        ],
      },
      {
        heading: 'Medication-Related Habits That Make Treatment Smoother',
        bullets: [
          'Eat smaller meals to reduce nausea.',
          'Avoid heavy, greasy, or fried foods, especially on injection day.',
          'Stop eating when you feel comfortably full, even if food remains on the plate.',
          'Keep track of your weekly injection day to maintain a stable routine.',
          'Rotate injection sites to avoid irritation.',
        ],
      },
      {
        heading: 'Supporting Long-Term Weight Stability',
        bullets: [
          'Build sustainable routines early, not only when tapering begins.',
          'Focus on habits, not perfection; small improvements accumulate.',
          'Monitor hunger and fullness cues, which may change as the dose adjusts.',
          'Plan for maintenance, including nutrition, activity, and behavioral strategies.',
        ],
      },
      {
        heading: 'Behavioral Strategies That Help Many Patients',
        bullets: [
          'Identify emotional triggers for eating and plan alternative coping strategies.',
          'Use mindful eating techniques, such as pausing between bites.',
          'Set realistic goals and track progress in small steps.',
          'Create structured routines, such as meal planning or scheduled activity.',
          'Seek support from coaching or counseling if motivation fluctuates.',
        ],
      },
      {
        heading: 'How can Vidacure help you with changing your lifestyle habits?',
        body: 'Health coaching and behavioral coaching\n\nFor many patients, medication is only one part of the treatment. Lifestyle changes and behavioral support are crucial for long-term results. On our website www.vidacure.se, after consultation with your treating physician, you can choose the package that suits you best.',
      },
      {
        heading: 'Health coaching \u2013 focus on:',
        bullets: [
          'Eating habits',
          'Physical activity',
          'Sleep',
          'Stress management',
        ],
      },
      {
        heading: 'Behavioral coaching \u2013 focus on:',
        bullets: [
          'Eating behaviors',
          'Emotional eating',
          'Motivation',
          'Routines and habits',
        ],
      },
      {
        heading: 'When should you add or switch to a coaching package?',
        body: 'We recommend adding or switching to a coaching package when:',
        bullets: [
          'You want more support in daily life',
          'You feel your motivation is declining',
          'You are not achieving the expected results with medication alone',
          'You struggle to establish sustainable routines',
          'You are approaching tapering and want to secure long-term results',
          'You want to continue developing after completing medication',
        ],
      },
    ],
    contentSv: [
      {
        heading: 'TIPS SOM STÖDJER DIN BEHANDLING MED GLP-1/GIP',
        body: 'Wegovy \u00b7 Ozempic \u00b7 Mounjaro',
      },
      {
        heading: 'Kostvanor som stödjer behandlingen',
        bullets: [
          'Prioritera protein vid varje måltid för att bevara muskelmassa och öka mättnadskänslan.',
          'Öka intaget av fibrer genom grönsaker, baljväxter, fullkorn och bär.',
          'Håll dig väl hydrerad, eftersom vätskebrist kan förvärra illamående och förstoppning.',
          'Begränsa socker, alkohol och ultraprocessade livsmedel som kan trigga sug eller orsaka magbesvär.',
          'Undvik att äta sent på kvällen så att matsmältningen får vila.',
          'Minska mängden sötningsmedel om de orsakar uppblåsthet eller ökat sug.',
        ],
      },
      {
        heading: 'Fysisk aktivitet som fungerar väl med GLP-1/GIP-läkemedel',
        bullets: [
          'Styrketräning två till tre gånger per vecka hjälper till att bevara muskelmassa under viktnedgång.',
          'Daglig rörelse, såsom promenader, cykling eller lätt aktivitet, stödjer ämnesomsättning och matsmältning.',
          'Lågintensiv träning är ofta lättare att upprätthålla under de första veckorna av behandlingen när illamående kan förekomma.',
          'Regelbundenhet är viktigare än intensitet; små, återkommande vanor ger bäst långsiktiga resultat.',
        ],
      },
      {
        heading: 'Livsstilsrutiner som förbättrar resultaten',
        bullets: [
          'Regelbundna måltider hjälper till att stabilisera hungersignaler.',
          'God sömn stödjer aptitreglering och energinivåer.',
          'Stresshantering genom mindfulness, andningsövningar, yoga eller meditation kan minska känsloätande.',
          'Att äta långsamt hjälper dig att känna mättnad tidigare och undvika överätning.',
        ],
      },
      {
        heading: 'Läkemedelsrelaterade vanor som gör behandlingen smidigare',
        bullets: [
          'Ät mindre måltider för att minska illamående.',
          'Undvik tung, fet eller friterad mat, särskilt på injektionsdagen.',
          'Sluta äta när du känner dig behagligt mätt, även om det finns mat kvar.',
          'Håll koll på din veckovisa injektionsdag för att skapa en stabil rutin.',
          'Variera injektionsställe för att undvika irritation.',
        ],
      },
      {
        heading: 'Att stödja långsiktig viktstabilitet',
        bullets: [
          'Bygg hållbara rutiner tidigt, inte bara inför nedtrappning.',
          'Fokusera på vanor, inte perfektion; små förbättringar ger stora resultat över tid.',
          'Följ dina hunger- och mättnadssignaler, som kan förändras när dosen justeras.',
          'Planera för viktstabilitet genom kost, aktivitet och beteendestrategier.',
        ],
      },
      {
        heading: 'Beteendestrategier som hjälper många patienter',
        bullets: [
          'Identifiera känslomässiga triggers för ätande och planera alternativa strategier.',
          'Använd mindful eating-tekniker, som att pausa mellan tuggorna.',
          'Sätt realistiska mål och följ dina framsteg i små steg.',
          'Skapa strukturerade rutiner, såsom måltidsplanering eller schemalagd aktivitet.',
          'Sök stöd genom coaching eller samtal om motivationen varierar.',
        ],
      },
    ],
  },
  {
    id: 'patient-information',
    titleEn: 'Patient Information',
    titleSv: 'Patientinformation',
    descriptionEn: 'Important information about your treatment with GLP-1/GIP medications including dosing, injection technique, and side effects.',
    descriptionSv: 'Viktig information om din behandling med GLP-1/GIP-läkemedel inklusive dosering, injektionsteknik och biverkningar.',
    icon: 'FileText',
    category: 'information',
    contentEn: [
      {
        heading: 'IMPORTANT INFORMATION ABOUT YOUR TREATMENT',
        body: 'Treatment with GLP-1/GIP medications\nMounjaro \u2022 Ozempic \u2022 Wegovy',
      },
      {
        heading: 'About the treatment',
        body: 'GLP-1 and GIP-based medications affect the body\u2019s regulation of appetite, satiety, and blood sugar. These effects can help reduce energy intake, improve satiety, and support weight loss in individuals with obesity. The treatment is a complement to diet, physical activity, and lifestyle changes.',
      },
      {
        heading: 'Who the treatment is intended for',
        body: 'The treatment is used for adults with:',
        bullets: [
          'BMI 30 or higher',
          'BMI 27 or higher together with a weight-related health condition, such as type 2 diabetes, high blood lipids, high blood pressure, or sleep apnea',
        ],
      },
      {
        heading: '',
        body: 'The assessment is made by your healthcare provider at Vidacure.se.',
      },
      {
        heading: 'Dosing routine',
        body: 'The medication is taken once weekly, on the same day each week. The dose can be taken at any time of day, with or without food.',
      },
      {
        heading: 'Changing your dosing day',
        body: 'At least three days must have passed since the previous injection.',
      },
      {
        heading: 'Missed dose',
        bullets: [
          'Four days or less: take the dose as soon as you remember.',
          'More than four days: skip the missed dose and take the next one as scheduled.',
          'Never take a double dose.',
        ],
      },
      {
        heading: 'Preparation',
        bullets: [
          'Wash your hands.',
          'Check that the pen is intact and that the liquid is clear.',
          'Check the expiration date.',
          'Always use a new needle.',
        ],
      },
      {
        heading: 'Injection technique',
        bullets: [
          'Dial up the intended dose by turning the pen. Follow your doctor\u2019s instructions regarding dose escalation.',
          'Attach the needle according to your pen\u2019s instructions.',
          'Set the dose according to the pen\u2019s markings.',
          'Insert the needle into the skin and press the dosing button until it stops.',
          'Keep the pen in the skin for ten seconds.',
          'Dispose of the needle in a sharps container.',
        ],
      },
      {
        heading: 'Injection sites',
        body: 'The medication is given subcutaneously (under the skin) in:',
        bullets: [
          'The abdomen (at least 5 cm from the navel)',
          'The thigh',
          'The back of the upper arm (if someone else administers the injection)',
        ],
      },
      {
        heading: '',
        body: 'Rotate injection sites within the same area each week.',
      },
      {
        heading: 'Tapering and discontinuation of the medication',
        body: 'As you approach your goal, your doctor will plan a controlled taper. The purpose is to:',
        bullets: [
          'Avoid sudden increases in hunger',
          'Reduce the risk of weight regain',
          'Give the body time to stabilize',
        ],
      },
      {
        heading: 'How tapering works:',
        bullets: [
          'The dose is reduced stepwise',
          'You receive individualized instructions',
          'Focus shifts to lifestyle routines and behavioral support',
        ],
      },
      {
        heading: 'Common side effects',
        body: 'Most side effects are mild and temporary. The most common are nausea, vomiting, diarrhea, constipation, reduced appetite, and gas.',
      },
      {
        heading: 'How to relieve symptoms',
        bullets: [
          'Eat smaller portions and more frequently.',
          'Avoid fatty, fried, or heavy foods.',
          'Stop eating when you feel full.',
          'Drink enough water.',
        ],
      },
      {
        heading: 'When to contact healthcare',
        body: 'Seek medical care if you experience:',
        bullets: [
          'Severe abdominal pain radiating to the back',
          'Allergic reactions such as swelling or difficulty breathing',
          'Signs of dehydration, such as dizziness or dark urine',
          'Persistent or severe vomiting',
        ],
      },
      {
        heading: 'If you use insulin or sulfonylurea',
        body: 'There is a risk of low blood sugar. Symptoms may include sweating, shaking, hunger, palpitations, or headache. Your doctor may need to adjust the dose of these medications.',
      },
      {
        heading: 'Pregnancy and breastfeeding',
        body: 'These medications should not be used during pregnancy or breastfeeding. Contraception is recommended during treatment. Stop the medication well in advance of attempting pregnancy according to your provider\u2019s guidance.',
      },
      {
        heading: 'Before surgery',
        body: 'If general anesthesia is planned, the medication must be paused in good time. Contact us.',
      },
      {
        heading: 'Storage',
        bullets: [
          'Unused pens should be stored in the refrigerator (2\u20138\u00b0C).',
          'An opened pen may be stored at room temperature for a limited time (varies between medications).',
          'Do not freeze.',
          'Keep out of reach of children.',
          'Dispose of needles in a sharps container.',
        ],
      },
      {
        heading: '',
        body: 'For detailed instructions on injection technique, please visit:\nwww.medicininstruktioner.se\nThere you can search for Wegovy/Ozempic/Mounjaro and watch videos on how to use the medication.',
      },
    ],
    contentSv: [
      {
        heading: 'VIKTIG INFORMATION OM DIN BEHANDLING',
        body: 'Behandling med GLP-1/GIP-läkemedel\nMounjaro \u2022 Ozempic \u2022 Wegovy',
      },
      {
        heading: 'Om behandlingen',
        body: 'GLP-1- och GIP-baserade läkemedel påverkar kroppens reglering av aptit, mättnad och blodsocker. Effekterna kan bidra till minskat energiintag, förbättrad mättnadskänsla, viktnedgång hos personer med Obesitas. Behandlingen är ett komplement till kost, rörelse och livsstilsförändringar.',
      },
      {
        heading: 'Vem behandlingen är avsedd för',
        body: 'Behandlingen används för vuxna med:',
        bullets: [
          'BMI 30 eller högre',
          'BMI 27 eller högre tillsammans med ett viktrelaterat hälsoproblem, exempelvis typ 2-diabetes, höga blodfetter, högt blodtryck eller sömnapné',
        ],
      },
      {
        heading: '',
        body: 'Bedömningen görs av behandlande vårdgivare på Vidacure.se.',
      },
      {
        heading: 'Doseringsrutiner',
        body: 'Läkemedlet tas en gång i veckan, samma veckodag. Dosen kan tas när som helst på dagen, med eller utan mat.',
      },
      {
        heading: 'Byte av doseringsdag',
        body: 'Det måste ha gått minst tre dagar sedan föregående injektion.',
      },
      {
        heading: 'Missad dos',
        bullets: [
          'Fyra dagar eller mindre: ta dosen så snart du kommer ihåg.',
          'Mer än fyra dagar: hoppa över dosen och ta nästa som vanligt.',
          'Ta aldrig dubbel dos.',
        ],
      },
      {
        heading: 'Förberedelser',
        bullets: [
          'Tvätta händerna.',
          'Kontrollera att pennan är hel och att vätskan är klar.',
          'Kontrollera utgångsdatum.',
          'Använd alltid en ny kanyl.',
        ],
      },
      {
        heading: 'Injektionsteknik',
        bullets: [
          'Dra upp den tänkta dosen i pennan genom att vrida på pennan. Följ läkarens instruktioner om upptrappning av ditt läkemedel.',
          'Fäst kanylen enligt instruktionerna för din penna.',
          'Ställ in dosen enligt pennans markeringar.',
          'Stick in kanylen i huden och tryck in doseringsknappen tills den tar stopp.',
          'Håll kvar pennan i huden i tio sekunder.',
          'Kassera kanylen i behållare för vassa föremål.',
        ],
      },
      {
        heading: 'Injektionsställen',
        body: 'Läkemedlet ges subkutant (under huden) i:',
        bullets: [
          'Buken (minst 5 cm från naveln)',
          'Låret',
          'Överarmens baksida (om någon annan ger injektionen)',
        ],
      },
      {
        heading: '',
        body: 'Byt injektionsställe inom samma område varje vecka.',
      },
      {
        heading: 'Vanliga biverkningar',
        body: 'De flesta biverkningar är milda och övergående. Vanligast är illamående, kräkningar, diarré, förstoppning, minskad aptit och gaser.',
      },
      {
        heading: 'Så kan besvären lindras',
        bullets: [
          'Ät mindre portioner och oftare.',
          'Undvik fet, friterad eller tung mat.',
          'Sluta äta när du känner dig mätt.',
          'Drick tillräckligt med vatten.',
        ],
      },
      {
        heading: 'När du ska kontakta vården',
        body: 'Sök vård vid:',
        bullets: [
          'Kraftiga buksmärtor som strålar mot ryggen',
          'Allergiska reaktioner som svullnad eller andningssvårigheter',
          'Tecken på uttorkning, exempelvis yrsel eller mörk urin',
          'Ihållande eller svåra kräkningar',
        ],
      },
      {
        heading: 'Om du använder insulin eller sulfonylurea',
        body: 'Det finns risk för lågt blodsocker. Symtom kan vara svettningar, darrningar, hunger, hjärtklappning eller huvudvärk. Behandlande läkare kan behöva justera dosen av dessa läkemedel.',
      },
      {
        heading: 'Graviditet och amning',
        body: 'Läkemedlen ska inte användas under graviditet eller amning. Preventivmedel rekommenderas under behandling. Avsluta behandlingen i god tid innan graviditetsförsök enligt vårdgivarens råd.',
      },
      {
        heading: 'Inför operation',
        body: 'Vid planerad narkos måste läkemedlet pausas i god tid. Kontakta oss.',
      },
      {
        heading: 'Förvaring',
        bullets: [
          'Oanvända pennor förvaras i kylskåp (2\u20138\u00b0C).',
          'En öppnad penna kan förvaras i rumstemperatur under en begränsad tid (varierar mellan läkemedlen).',
          'Får inte frysas.',
          'Förvara utom räckhåll för barn.',
          'Kanyler kastas i behållare för vassa föremål.',
        ],
      },
      {
        heading: '',
        body: 'För närmare detaljer kring injektionsteknik hänvisar vi till hemsidan:\nwww.medicininstruktioner.se\nDär kan du söka på Wegovy/Ozempic/Mounjaro och se film på hur du ska ta läkemedlet.',
      },
      {
        heading: 'Viktigt att tänka på under behandlingen',
      },
      {
        heading: 'Kost',
        bullets: [
          'öka protein och fibrer',
          'Drick rikligt med vatten.',
          'minska socker, alkohol och tomma kalorier',
          'undvik att äta sent på kvällen',
          'undvik sötningsmedel',
        ],
      },
      {
        heading: 'Fysisk aktivitet',
        bullets: [
          'Styrketräning för att bevara muskelmassa',
          'Promenader och vardagsmotion räcker långt',
        ],
      },
      {
        heading: 'Livsstil',
        bullets: [
          'Regelbundna måltider',
          'God sömn',
          'Stresshantering genom mindfulness, yoga eller meditation',
        ],
      },
      {
        heading: 'Nedtrappning och avslut av läkemedel',
        body: 'När du närmar dig ditt mål kommer läkaren att planera en kontrollerad nedtrappning. Syftet är att:',
        bullets: [
          'Undvika plötslig hungerökning',
          'Minska risken för viktuppgång',
          'Ge kroppen tid att stabilisera sig',
        ],
      },
      {
        heading: 'Hur nedtrappningen går till:',
        bullets: [
          'Dosen sänks stegvis',
          'Du får individuella instruktioner',
          'Fokus flyttas till livsstilsrutiner och beteendestöd',
        ],
      },
      {
        heading: 'Hälsocoachning och beteendecoachning',
        body: 'För många patienter är medicinen bara en del av behandlingen. Livsstilsförändringar och beteendestöd är avgörande för långsiktiga resultat. På vår hemsida kan du efter konsultation med din behandlande läkare välja vilket paket som kan passa dig.',
      },
      {
        heading: 'Hälsocoachning \u2013 fokus på:',
        bullets: [
          'Kostvanor',
          'Fysisk aktivitet',
          'Sömn',
          'Stresshantering',
        ],
      },
      {
        heading: 'Beteendecoachning \u2013 fokus på:',
        bullets: [
          'Matbeteenden',
          'Känsloätande',
          'Motivation',
          'Rutiner och vanor',
        ],
      },
      {
        heading: 'När ska du välja till eller byta paket?',
        body: 'Vi rekommenderar att du lägger till eller byter till ett coachningspaket när:',
        bullets: [
          'Du vill ha mer stöd i vardagen',
          'Du upplever att motivationen sviktar',
          'Du får inte det förväntade resultatet endast med läkemedelsbehandling',
          'Du har svårt att skapa hållbara rutiner',
          'Du närmar dig nedtrappning och vill säkra långsiktiga resultat',
          'Du vill fortsätta utvecklas efter avslutad medicinering',
        ],
      },
      {
        heading: '',
        body: 'Vid frågor är du välkommen att kontakta din behandlande läkare eller oss på Vidacure.se\n\nVi önskar dig lycka till med din behandling!\n\nVidacure',
      },
    ],
  },
];
