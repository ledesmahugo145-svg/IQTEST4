import { Injectable } from '@angular/core';
import { Question, LanguageCode } from '../types';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // --- PUBLIC METHODS ---

  async getTest(language: LanguageCode): Promise<Question[]> {
    // Artificial delay to mimic computation/loading
    await new Promise(resolve => setTimeout(resolve, 1500));

    let bank = this.questionBank[language] || this.questionBank['en'];
    
    // Shuffle the array to get a random selection
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    // Re-index for UI display (1, 2, 3...)
    return selected.map((q, index) => ({
      ...q,
      id: index + 1 
    }));
  }

  getAnalysis(iq: number, language: LanguageCode, validity: string): string {
    const templates: Record<string, { high: string, avg: string, low: string, invalid: string }> = {
      en: {
        high: "Subject demonstrates exceptional pattern recognition and abstract reasoning capabilities. Cognitive processing speed exceeds the 95th percentile, indicating superior fluid intelligence potential.",
        avg: "Subject displays solid logical reasoning and consistent attention to detail. Cognitive metrics align with a balanced profile, showing strengths in structured problem solving.",
        low: "Performance indicates challenges in abstract logic processing under current test conditions. Further assessment in a distraction-free environment is recommended.",
        invalid: "Assessment validity flagged due to rapid response times. Results likely do not reflect true cognitive potential. Please retake the test with focused attention."
      },
      zh: {
        high: "受试者表现出卓越的模式识别和抽象推理能力。认知处理速度超过第95百分位，表明具有卓越的流体智力潜力。",
        avg: "受试者显示出扎实的逻辑推理能力和持续的细节关注力。认知指标符合平衡的特征，在结构化问题解决方面表现出优势。",
        low: "在当前测试条件下，表现显示出抽象逻辑处理方面的挑战。建议在无干扰的环境中进行进一步评估。",
        invalid: "由于反应时间过快，评估有效性被标记。结果可能无法反映真实的认知潜力。请集中注意力重新进行测试。"
      },
      es: {
        high: "El sujeto demuestra capacidades excepcionales de reconocimiento de patrones y razonamiento abstracto. La velocidad de procesamiento cognitivo supera el percentil 95.",
        avg: "El sujeto muestra un razonamiento lógico sólido y una atención constante a los detalles. Las métricas cognitivas se alinean con un perfil equilibrado.",
        low: "El rendimiento indica desafíos en el procesamiento lógico abstracto bajo las condiciones de prueba actuales.",
        invalid: "Validez de la evaluación marcada debido a tiempos de respuesta rápidos. Es probable que los resultados no reflejen el verdadero potencial cognitivo."
      },
      fr: {
        high: "Le sujet démontre des capacités exceptionnelles de reconnaissance de formes et de raisonnement abstrait. La vitesse de traitement cognitif dépasse le 95e centile.",
        avg: "Le sujet fait preuve d'un raisonnement logique solide et d'une attention constante aux détails. Les métriques cognitivas s'alignent sur un profil équilibré.",
        low: "La performance indique des défis dans le traitement de la logique abstraite dans les conditions actuelles du test.",
        invalid: "Validité de l'évaluation signalée en raison de temps de réponse rapides. Les résultats ne reflètent probably pas le véritable potentiel cognitif."
      },
      de: {
        high: "Die Testperson zeigt außergewöhnliche Fähigkeiten in Mustererkennung und abstraktem Denken. Die kognitive Verarbeitungsgeschwindigkeit liegt über dem 95. Perzentil.",
        avg: "Die Testperson zeigt solides logisches Denken und beständige Aufmerksamkeit für Details. Kognitive Metriken entsprechen einem ausgewogenen Profil.",
        low: "Die Leistung deutet auf Herausforderungen bei der abstrakten Logikverarbeitung unter den aktuellen Testbedingungen hin.",
        invalid: "Die Gültigkeit der Bewertung wurde aufgrund schneller Reaktionszeiten markiert. Die Ergebnisse spiegeln wahrscheinlich nicht das wahre kognitive Potenzial wider."
      },
      ja: {
        high: "被験者は並外れたパターン認識と抽象的推論能力を示しています。認知処理速度は95パーセンタイルを超えており、優れた流動性知能の可能性を示しています。",
        avg: "被験者は確かな論理的推論と一貫した細部への注意を示しています。認知指標はバランスの取れたプロファイルと一致しています。",
        low: "現在のテスト条件下では、抽象的な論理処理に課題があることが示されています。",
        invalid: "応答時間が速すぎるため、評価の妥当性にフラグが立てられました。結果は真の認知能力を反映していない可能性があります。"
      },
      hi: {
        high: "विषय असाधारण पैटर्न मान्यता और अमूर्त तर्क क्षमता प्रदर्शित करता है। संज्ञानात्मक प्रसंस्करण गति 95वें प्रतिशतक से अधिक है।",
        avg: "विषय ठोस तार्किक तर्क और विवरण पर निरंतर ध्यान प्रदर्शित करता है। संज्ञानात्मक मैट्रिक्स एक संतुलित प्रोफ़ाइल के साथ संरेखित होते हैं।",
        low: "प्रदर्शन वर्तमान परीक्षण स्थितियों के तहत अमूर्त तर्क प्रसंस्करण में चुनौतियों का संकेत देता है।",
        invalid: "तेजी से प्रतिक्रिया समय के कारण मूल्यांकन वैधता को चिह्नित किया गया। परिणाम संभवतः वास्तविक संज्ञानात्मक क्षमता को प्रतिबिंबित नहीं करते हैं।"
      },
      ar: {
        high: "يظهر الشخص قدرات استثنائية في التعرف على الأنماط والتفكير المجرد. تتجاوز سرعة المعالجة المعرفية الشريحة المئوية 95.",
        avg: "يظهر الشخص تفكيرًا منطقيًا قويًا واهتمامًا ثابتًا بالتفاصيل. تتماشى المقاييس المعرفية مع ملف تعريف متوازن.",
        low: "يشير الأداء إلى تحديات في معالجة المنطق المجرد في ظل ظروف الاختبار الحالية.",
        invalid: "تم الإبلاغ عن صلاحية التقييم بسبب أوقات الاستجابة السريعة. النتائج على الأرجح لا تعكس الإمكانات المعرفية الحقيقية."
      },
      pt: {
        high: "O sujeito demonstra capacidades excepcionais de reconhecimento de padrões e raciocínio abstrato. A velocidade de processamento cognitivo excede o 95º percentil.",
        avg: "O sujeito exibe raciocínio lógico sólido e atenção consistente aos detalhes. As métricas cognitivas alinham-se com um perfil equilibrado.",
        low: "O desempenho indica desafios no processamento de lógica abstrata nas atuais condições de teste.",
        invalid: "Validade da avaliação sinalizada devido a tempos de resposta rápidos. Os resultados provavelmente não refletem o verdadeiro potencial cognitivo."
      },
      ru: {
        high: "Субъект демонстрирует исключительные способности к распознаванию образов и абстрактному мышлению. Скорость когнитивной обработки превышает 95-й процентиль.",
        avg: "Субъект проявляет твердое логическое мышление и устойчивое внимание к деталям. Когнитивные метрики соответствуют сбалансированному профилю.",
        low: "Результаты указывают на трудности в обработке абстрактной логики в текущих условиях тестирования.",
        invalid: "Валидность оценки поставлена под сомнение из-за быстрого времени ответа. Результаты, вероятно, не отражают истинный когнитивный потенциал."
      }
    };
    
    const getTemplate = (lang: string) => templates[lang] || templates['en'];
    const t = getTemplate(language);

    if (validity.includes('Low')) return t.invalid;
    if (iq >= 120) return t.high;
    if (iq >= 90) return t.avg;
    return t.low;
  }

  // --- STATIC DB (150 Questions) ---
  private questionBank: Record<string, Question[]> = {
    'en': [
      { id: 1, category: 'verbal', correctIndex: 3, text: "Which word is the odd one out?", options: ["House", "Igloo", "Bungalow", "Office"] },
      { id: 2, category: 'math', correctIndex: 2, text: "Sequence: 3, 7, 15, 31, 63, ?", options: ["125", "126", "127", "128"] },
      { id: 3, category: 'spatial', correctIndex: 1, text: "If you rotate the letter 'd' 180 degrees clockwise, what letter do you get?", options: ["b", "p", "q", "g"] },
      { id: 4, category: 'logic', correctIndex: 0, text: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.05", "$0.10", "$1.00", "$1.05"] },
      { id: 5, category: 'math', correctIndex: 3, text: "What is 15% of 15% of 200?", options: ["0.45", "45", "0.045", "4.5"] },
      { id: 6, category: 'verbal', correctIndex: 2, text: "Ogle is to Look as Clamor is to...", options: ["Whisper", "Stare", "Noise", "Quiet"] },
      { id: 7, category: 'spatial', correctIndex: 1, text: "A cube is painted red on all sides. It's cut into 27 smaller cubes. How many have exactly one side painted red?", options: ["4", "6", "8", "12"] },
      { id: 8, category: 'logic', correctIndex: 1, text: "A man says, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is he pointing at?", options: ["His Father", "His Son", "Himself", "His Uncle"] },
      { id: 9, category: 'math', correctIndex: 0, text: "Sequence: 7, 10, 8, 11, 9, 12, ?", options: ["10", "13", "7", "14"] },
      { id: 10, category: 'verbal', correctIndex: 1, text: "Identify the anagram: 'DORMITORY'", options: ["Riot Room", "Dirty Room", "My Root", "Roomy Dirt"] },
      { id: 11, category: 'logic', correctIndex: 3, text: "Mary's mother has four children: April, May, and June. What is the fourth child's name?", options: ["July", "August", "Monday", "Mary"] },
      { id: 12, category: 'spatial', correctIndex: 2, text: "Which 3D shape can be formed by folding a 2D net shaped like a cross?", options: ["Pyramid", "Sphere", "Cube", "Cylinder"] },
      { id: 13, category: 'math', correctIndex: 1, text: "5 machines take 5 minutes to make 5 widgets. How long would it take 100 machines to make 100 widgets?", options: ["100 minutes", "5 minutes", "20 minutes", "1 minute"] },
      { id: 14, category: 'logic', correctIndex: 0, text: "If some Blips are Blops and all Blops are Bleeps, then...", options: ["Some Blips are Bleeps", "All Blips are Bleeps", "No Blips are Bleeps", "All Bleeps are Blips"] },
      { id: 15, category: 'spatial', correctIndex: 3, text: "On a standard die, which number is opposite to 4?", options: ["1", "2", "6", "3"] }
    ],
    'zh': [
      { id: 101, category: 'math', correctIndex: 2, text: "数字规律: 1, 4, 9, 16, 25, ?", options: ["30", "32", "36", "40"] },
      { id: 102, category: 'logic', correctIndex: 3, text: "医生给了你3颗药丸，要你每半小时吃一颗，吃完需要多长时间？", options: ["1.5小时", "2小时", "3小时", "1小时"] },
      { id: 103, category: 'spatial', correctIndex: 2, text: "将一张正方形纸对折两次，再沿对角线对折，剪去一个角，展开后有几个洞？", options: ["2", "4", "8", "1"] },
      { id: 104, category: 'verbal', correctIndex: 0, text: "找出不同类的一项：", options: ["汽车", "轮胎", "方向盘", "发动机"] },
      { id: 105, category: 'math', correctIndex: 1, text: "数列: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
      { id: 106, category: 'logic', correctIndex: 2, text: "所有A都是B。所有B都是C。因此：", options: ["所有C都是A", "部分C是A", "所有A都是C", "没有A是C"] },
      { id: 107, category: 'spatial', correctIndex: 1, text: "哪个图形无法一笔画成？", options: ["五角星", "田字格", "圆", "日字格"] },
      { id: 108, category: 'verbal', correctIndex: 3, text: "“一日三秋”形容的是？", options: ["天气变化快", "过了三年", "一天有三个秋天", "思念心切"] },
      { id: 109, category: 'math', correctIndex: 3, text: "如果 3x3=18, 4x4=32, 5x5=50, 6x6=72, 那么 7x7=?", options: ["84", "90", "96", "98"] },
      { id: 110, category: 'logic', correctIndex: 1, text: "一个房间里有2个妈妈，2个女儿，1个外婆，房间里最少有几个人？", options: ["5", "3", "4", "2"] },
      { id: 111, category: 'spatial', correctIndex: 0, text: "从上面看一个圆锥体是什么形状？", options: ["圆形", "三角形", "正方形", "扇形"] },
      { id: 112, category: 'math', correctIndex: 2, text: "一个农场有鸡和兔共35头，94只脚。鸡有多少只？", options: ["12", "20", "23", "15"] },
      { id: 113, category: 'verbal', correctIndex: 1, text: "“罄竹难书”是形容？", options: ["书太多", "罪行多", "竹子用完了", "写字难"] },
      { id: 114, category: 'logic', correctIndex: 0, text: "如果A是B的哥哥，B是C的哥哥，C是D的爸爸，那么D和A是什么关系？", options: ["叔侄/叔侄女", "兄弟", "表兄弟", "没关系"] },
      { id: 115, category: 'spatial', correctIndex: 3, text: "一个正方体的六个面分别涂上红、黄、蓝、绿、紫、黑，红色对面是什么颜色是不确定的，除非有更多信息。", options: ["黄色", "蓝色", "绿色", "不确定"] }
    ],
    'es': [
      { id: 201, category: 'math', correctIndex: 2, text: "Secuencia: 1, 4, 9, 16, 25, ?", options: ["30", "32", "36", "40"] },
      { id: 202, category: 'logic', correctIndex: 1, text: "Un médico te da 3 pastillas y te dice que tomes una cada media hora. ¿Cuánto tiempo tardas en tomarlas todas?", options: ["1.5 horas", "1 hora", "2 horas", "3 horas"] },
      { id: 203, category: 'spatial', correctIndex: 3, text: "¿Qué forma 3D se puede formar doblando una red 2D en forma de 'T'?", options: ["Esfera", "Pirámide", "Cilindro", "Cubo"] },
      { id: 204, category: 'verbal', correctIndex: 2, text: "Efímero es a Duradero como...", options: ["Corto es a Breve", "Duro es a Sólido", "Dinámico es a Estático", "Ligero es a Pesado"] },
      { id: 205, category: 'math', correctIndex: 1, text: "Secuencia: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
      { id: 206, category: 'logic', correctIndex: 2, text: "Todos los A son B. Todos los B son C. Por lo tanto:", options: ["Todos los C son A", "Algunos C son A", "Todos los A son C", "Ningún A es C"] },
      { id: 207, category: 'spatial', correctIndex: 0, text: "Un reloj marca las 3:15. En un espejo, ¿qué hora parece ser?", options: ["8:45", "9:45", "3:45", "2:15"] },
      { id: 208, category: 'verbal', correctIndex: 0, text: "Encuentra la palabra diferente:", options: ["Coche", "Rueda", "Volante", "Motor"] },
      { id: 209, category: 'math', correctIndex: 3, text: "Si 3x3=18, 4x4=32, 5x5=50, 6x6=72, entonces 7x7=?", options: ["84", "90", "96", "98"] },
      { id: 210, category: 'logic', correctIndex: 1, text: "Hay 2 madres, 2 hijas y 1 abuela en una habitación. ¿Cuál es el número mínimo de personas?", options: ["5", "3", "4", "2"] },
      { id: 211, category: 'spatial', correctIndex: 2, text: "¿Cuántas aristas tiene un cubo?", options: ["6", "8", "12", "10"] },
      { id: 212, category: 'math', correctIndex: 0, text: "Un granjero tiene 17 ovejas y todas menos 9 mueren. ¿Cuántas le quedan?", options: ["9", "8", "17", "0"] },
      { id: 213, category: 'verbal', correctIndex: 3, text: "¿Qué palabra no pertenece al grupo?", options: ["Río", "Lago", "Mar", "Puente"] },
      { id: 214, category: 'logic', correctIndex: 2, text: "Si un avión se estrella en la frontera entre EE. UU. y Canadá, ¿dónde entierran a los supervivientes?", options: ["EE. UU.", "Canadá", "No se les entierra", "En su país de origen"] },
      { id: 215, category: 'spatial', correctIndex: 1, text: "Si apilas 4 cubos uno encima del otro, ¿cuántas caras están expuestas (sin contar las de abajo)?", options: ["12", "17", "16", "20"] }
    ],
    // Added 15 questions for the other 7 languages following the same pattern.
    'fr': [
      { id: 301, category: 'math', correctIndex: 2, text: "Suite : 1, 4, 9, 16, 25, ?", options: ["30", "32", "36", "40"] },
      { id: 302, category: 'logic', correctIndex: 3, text: "Un médecin vous donne 3 pilules à prendre toutes les demi-heures. Combien de temps cela prend-il ?", options: ["1.5 heures", "2 heures", "3 heures", "1 heure"] },
      { id: 303, category: 'spatial', correctIndex: 2, text: "Quelle forme 3D peut être formée en pliant un patron 2D en forme de croix ?", options: ["Pyramide", "Sphère", "Cube", "Cylindre"] },
      { id: 304, category: 'verbal', correctIndex: 2, text: "Éphémère est à Durable ce que...", options: ["Court est à Bref", "Dur est à Solide", "Dynamique est à Statique", "Léger est à Lourd"] },
      { id: 305, category: 'math', correctIndex: 1, text: "Suite : 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
      { id: 306, category: 'logic', correctIndex: 2, text: "Tous les A sont B. Tous les B sont C. Donc :", options: ["Tous les C sont A", "Certains C sont A", "Tous les A sont C", "Aucun A n'est C"] },
      { id: 307, category: 'spatial', correctIndex: 0, text: "Une horloge indique 3:15. Reflétée dans un miroir, quelle heure est-il ?", options: ["8:45", "9:45", "3:45", "2:15"] },
      { id: 308, category: 'verbal', correctIndex: 0, text: "Trouvez l'intrus :", options: ["Voiture", "Roue", "Volant", "Moteur"] },
      { id: 309, category: 'math', correctIndex: 3, text: "Si 3x3=18, 4x4=32, 5x5=50, 6x6=72, alors 7x7=?", options: ["84", "90", "96", "98"] },
      { id: 310, category: 'logic', correctIndex: 1, text: "Combien y a-t-il de mois de 28 jours dans une année ?", options: ["1", "12", "0", "6"] },
      { id: 311, category: 'spatial', correctIndex: 1, text: "Combien de côtés a un hexagone ?", options: ["5", "6", "7", "8"] },
      { id: 312, category: 'math', correctIndex: 2, text: "Un fermier a 17 moutons. Tous sauf 9 meurent. Combien en reste-t-il ?", options: ["17", "8", "9", "0"] },
      { id: 313, category: 'verbal', correctIndex: 3, text: "Quel mot n'appartient pas au groupe ?", options: ["Livre", "Magazine", "Journal", "Bibliothèque"] },
      { id: 314, category: 'logic', correctIndex: 0, text: "Avant que le Mont Everest ne soit découvert, quelle était la plus haute montagne du monde ?", options: ["Mont Everest", "K2", "Kangchenjunga", "Makalu"] },
      { id: 315, category: 'spatial', correctIndex: 2, text: "Si vous coupez une pizza en 4 coupes droites, quel est le nombre maximum de parts que vous pouvez obtenir ?", options: ["6", "10", "11", "12"] }
    ],
    'de': [
      { id: 401, category: 'math', correctIndex: 2, text: "Folge: 1, 4, 9, 16, 25, ?", options: ["30", "32", "36", "40"] },
      { id: 402, category: 'logic', correctIndex: 1, text: "Ein Arzt gibt Ihnen 3 Tabletten, die Sie jede halbe Stunde einnehmen sollen. Wie lange dauert es?", options: ["1.5 Stunden", "1 Stunde", "2 Stunden", "3 Stunden"] },
      { id: 403, category: 'spatial', correctIndex: 2, text: "Welche 3D-Form entsteht durch Falten eines 2D-Netzes in Kreuzform?", options: ["Pyramide", "Kugel", "Würfel", "Zylinder"] },
      { id: 404, category: 'verbal', correctIndex: 2, text: "Vergänglich verhält sich zu Dauerhaft wie...", options: ["Kurz zu Knapp", "Hart zu Fest", "Dynamisch zu Statisch", "Leicht zu Schwer"] },
      { id: 405, category: 'math', correctIndex: 1, text: "Folge: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
      { id: 406, category: 'logic', correctIndex: 2, text: "Alle A sind B. Alle B sind C. Deshalb:", options: ["Alle C sind A", "Einige C sind A", "Alle A sind C", "Kein A ist C"] },
      { id: 407, category: 'spatial', correctIndex: 0, text: "Eine Uhr zeigt 3:15. Im Spiegel, wie spät ist es?", options: ["8:45", "9:45", "3:45", "2:15"] },
      { id: 408, category: 'verbal', correctIndex: 0, text: "Finde das abweichende Wort:", options: ["Auto", "Rad", "Lenkrad", "Motor"] },
      { id: 409, category: 'math', correctIndex: 3, text: "Wenn 3x3=18, 4x4=32, 5x5=50, 6x6=72, dann 7x7=?", options: ["84", "90", "96", "98"] },
      { id: 410, category: 'logic', correctIndex: 2, text: "Wie viele Tiere jeder Art hat Moses auf die Arche mitgenommen?", options: ["2", "1", "0", "7"] },
      { id: 411, category: 'spatial', correctIndex: 0, text: "Was ist die Summe der Innenwinkel eines Dreiecks?", options: ["180°", "360°", "90°", "270°"] },
      { id: 412, category: 'math', correctIndex: 3, text: "Einige Monate haben 31 Tage, andere 30. Wie viele haben 28?", options: ["1", "2", "0", "12"] },
      { id: 413, category: 'verbal', correctIndex: 3, text: "Welches Wort passt nicht?", options: ["Apfel", "Birne", "Banane", "Kartoffel"] },
      { id: 414, category: 'logic', correctIndex: 1, text: "Was kommt einmal in einer Minute, zweimal in einem Moment, aber nie in tausend Jahren?", options: ["Der Buchstabe 'T'", "Der Buchstabe 'M'", "Die Zahl 1", "Die Zeit"] },
      { id: 415, category: 'spatial', correctIndex: 2, text: "Wenn man ein Quadrat entlang seiner beiden Diagonalen schneidet, wie viele Dreiecke erhält man?", options: ["2", "3", "4", "8"] }
    ],
    'ja': [
      { id: 501, category: 'math', correctIndex: 2, text: "数列: 1, 4, 9, 16, 25, ?", options: ["30", "32", "36", "40"] },
      { id: 502, category: 'logic', correctIndex: 1, text: "医者が3錠の薬を30分おきに飲むように言いました。全部飲むのにどのくらいかかりますか？", options: ["1.5時間", "1時間", "2時間", "3時間"] },
      { id: 503, category: 'spatial', correctIndex: 2, text: "十字形の2D展開図を折ってできる3D形状は？", options: ["ピラミッド", "球", "立方体", "円柱"] },
      { id: 504, category: 'verbal', correctIndex: 2, text: "「一時的」と「永続的」の関係は、「動的」と...の関係と同じ", options: ["短い", "硬い", "静的", "重い"] },
      { id: 505, category: 'math', correctIndex: 1, text: "数列: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
      { id: 506, category: 'logic', correctIndex: 2, text: "すべてのAはBである。すべてのBはCである。したがって：", options: ["すべてのCはA", "一部のCはA", "すべてのAはC", "AはCではない"] },
      { id: 507, category: 'spatial', correctIndex: 0, text: "時計は3:15を示しています。鏡に映ると何時に見えますか？", options: ["8:45", "9:45", "3:45", "2:15"] },
      { id: 508, category: 'verbal', correctIndex: 0, text: "仲間外れを選んでください：", options: ["車", "タイヤ", "ハンドル", "エンジン"] },
      { id: 509, category: 'math', correctIndex: 3, text: "3x3=18, 4x4=32, 5x5=50, 6x6=72 の場合, 7x7 = ?", options: ["84", "90", "96", "98"] },
      { id: 510, category: 'logic', correctIndex: 2, text: "ある部屋に母親が2人、娘が2人、祖母が1人います。部屋には最低何人いますか？", options: ["5人", "4人", "3人", "2人"] },
      { id: 511, category: 'spatial', correctIndex: 1, text: "ペンタグラム（五芒星）を一筆書きできますか？", options: ["できない", "できる", "場合による", "不明"] },
      { id: 512, category: 'math', correctIndex: 0, text: "100人の乗客がいる飛行機が墜落しました。生存者はいませんでした。何人生き残りましたか？", options: ["0", "100", "1", "不明"] },
      { id: 513, category: 'verbal', correctIndex: 3, text: "次のうち仲間外れはどれですか？", options: ["犬", "猫", "ライオン", "石"] },
      { id: 514, category: 'logic', correctIndex: 1, text: "入るときは一つ、出るときは二つになるものは何？", options: ["トンネル", "ズボン", "ドア", "川"] },
      { id: 515, category: 'spatial', correctIndex: 2, text: "紙を破らずに、どうやって自分自身を通り抜けさせることができますか？", options: ["不可能", "紙を燃やす", "大きな輪を作る", "紙を食べる"] }
    ],
    'hi': [
      { id: 601, category: 'math', correctIndex: 2, text: "अनुक्रम: 1, 4, 9, 16, 25, ?", options: ["30", "32", "36", "40"] },
      { id: 602, category: 'logic', correctIndex: 1, text: "एक डॉक्टर आपको 3 गोलियाँ देता है और हर आधे घंटे में एक लेने को कहता है। आपको कितना समय लगेगा?", options: ["1.5 घंटे", "1 घंटा", "2 घंटे", "3 घंटे"] },
      { id: 603, category: 'spatial', correctIndex: 2, text: "एक क्रॉस के आकार के 2डी नेट को मोड़ने पर कौन सा 3डी आकार बन सकता है?", options: ["पिरामिड", "गोला", "घन (Cube)", "बेलन"] },
      { id: 604, category: 'verbal', correctIndex: 2, text: "अल्पकालिक का संबंध स्थायी से वैसे ही है जैसे गतिशील का...", options: ["संक्षिप्त", "ठोस", "स्थिर", "भारी"] },
      { id: 605, category: 'math', correctIndex: 1, text: "अनुक्रम: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
      { id: 606, category: 'logic', correctIndex: 2, text: "सभी A, B हैं। सभी B, C हैं। इसलिए:", options: ["सभी C, A हैं", "कुछ C, A हैं", "सभी A, C हैं", "कोई A, C नहीं है"] },
      { id: 607, category: 'spatial', correctIndex: 0, text: "एक घड़ी 3:15 दिखाती है। दर्पण में यह क्या समय दिखेगा?", options: ["8:45", "9:45", "3:45", "2:15"] },
      { id: 608, category: 'verbal', correctIndex: 0, text: "विषम शब्द चुनें:", options: ["कार", "पहिया", "स्टीयरिंग व्हील", "इंजन"] },
      { id: 609, category: 'math', correctIndex: 3, text: "यदि 3x3=18, 4x4=32, 5x5=50, 6x6=72, तो 7x7=?", options: ["84", "90", "96", "98"] },
      { id: 610, category: 'logic', correctIndex: 2, text: "एक कमरे में 2 माताएँ, 2 बेटियाँ और 1 दादी हैं। कमरे में न्यूनतम कितने लोग हैं?", options: ["5", "4", "3", "2"] },
      { id: 611, category: 'spatial', correctIndex: 3, text: "एक वृत्त का क्षेत्रफल क्या है?", options: ["2πr", "πr", "2πd", "πr²"] },
      { id: 612, category: 'math', correctIndex: 1, text: "यदि कल (आने वाला) रविवार है, तो कल (बीता हुआ) क्या था?", options: ["शनिवार", "शुक्रवार", "सोमवार", "मंगलवार"] },
      { id: 613, category: 'verbal', correctIndex: 3, text: "कौन सा शब्द समूह से संबंधित नहीं है?", options: ["सेब", "केला", "संतरा", "गोभी"] },
      { id: 614, category: 'logic', correctIndex: 1, text: "जितना अधिक आप लेते हैं, उतना ही अधिक आप पीछे छोड़ते हैं। मैं क्या हूँ?", options: ["पैसा", "कदम", "समय", "ज्ञान"] },
      { id: 615, category: 'spatial', correctIndex: 0, text: "एक सीधी रेखा में 3 बिंदु हैं। कितने त्रिभुज बन सकते हैं?", options: ["0", "1", "3", "अनंत"] }
    ],
    'ar': [
      { id: 701, category: 'math', correctIndex: 2, text: "التسلسل: 1, 4, 9, 16, 25, ؟", options: ["30", "32", "36", "40"] },
      { id: 702, category: 'logic', correctIndex: 1, text: "طبيب أعطاك 3 حبات دواء، وقال لك أن تأخذ حبة كل نصف ساعة. كم من الوقت تستغرق لتناولها كلها؟", options: ["ساعة ونصف", "ساعة واحدة", "ساعتان", "3 ساعات"] },
      { id: 703, category: 'spatial', correctIndex: 2, text: "ما الشكل ثلاثي الأبعاد الذي يمكن تشكيله بطي شبكة ثنائية الأبعاد على شكل صليب؟", options: ["هرم", "كرة", "مكعب", "اسطوانة"] },
      { id: 704, category: 'verbal', correctIndex: 2, text: "الزائل بالنسبة للدائم مثل الديناميكي بالنسبة لـ...", options: ["قصير", "صلب", "ثابت", "ثقيل"] },
      { id: 705, category: 'math', correctIndex: 1, text: "التسلسل: 2, 6, 12, 20, 30, ؟", options: ["40", "42", "44", "46"] },
      { id: 706, category: 'logic', correctIndex: 2, text: "كل A هي B. كل B هي C. إذن:", options: ["كل C هي A", "بعض C هي A", "كل A هي C", "لا توجد A هي C"] },
      { id: 707, category: 'spatial', correctIndex: 0, text: "تظهر الساعة 3:15. في المرآة، كم يبدو الوقت؟", options: ["8:45", "9:45", "3:45", "2:15"] },
      { id: 708, category: 'verbal', correctIndex: 0, text: "أوجد الكلمة المختلفة:", options: ["سيارة", "عجلة", "مقود", "محرك"] },
      { id: 709, category: 'math', correctIndex: 3, text: "إذا كان 3x3=18، 4x4=32، 5x5=50، 6x6=72، فإن 7x7 = ؟", options: ["84", "90", "96", "98"] },
      { id: 710, category: 'logic', correctIndex: 2, text: "في غرفة يوجد أمان، وابنتان، وجدة واحدة. ما هو أقل عدد ممكن من الأشخاص في الغرفة؟", options: ["5", "4", "3", "2"] },
      { id: 711, category: 'spatial', correctIndex: 1, text: "كم عدد أضلاع الشكل السداسي؟", options: ["5", "6", "7", "8"] },
      { id: 712, category: 'math', correctIndex: 2, text: "كان لدى مزارع 17 خروفاً، ماتوا جميعاً إلا 9. كم خروفاً تبقى لديه؟", options: ["17", "8", "9", "0"] },
      { id: 713, category: 'verbal', correctIndex: 3, text: "أي كلمة لا تنتمي للمجموعة؟", options: ["نهر", "بحيرة", "بحر", "جسر"] },
      { id: 714, category: 'logic', correctIndex: 0, text: "ما هو الشيء الذي له عين واحدة ولكنه لا يرى؟", options: ["إبرة", "إعصار", "بطاطس", "كاميرا"] },
      { id: 715, category: 'spatial', correctIndex: 2, text: "إذا كان لديك مكعب ورسمت كل وجوهه باللون الأحمر، ثم قطعته إلى 27 مكعباً أصغر، فكم عدد المكعبات التي لها وجهان ملونان فقط؟", options: ["6", "8", "12", "24"] }
    ],
    'pt': [
      { id: 801, category: 'math', correctIndex: 2, text: "Sequência: 1, 4, 9, 16, 25, ?", options: ["30", "32", "36", "40"] },
      { id: 802, category: 'logic', correctIndex: 1, text: "Um médico lhe dá 3 pílulas e diz para tomar uma a cada meia hora. Quanto tempo leva?", options: ["1.5 horas", "1 hora", "2 horas", "3 horas"] },
      { id: 803, category: 'spatial', correctIndex: 2, text: "Que forma 3D pode ser formada dobrando uma rede 2D em forma de cruz?", options: ["Pirâmide", "Esfera", "Cubo", "Cilindro"] },
      { id: 804, category: 'verbal', correctIndex: 2, text: "Efêmero está para Duradouro assim como Dinâmico está para...", options: ["Curto", "Duro", "Estático", "Pesado"] },
      { id: 805, category: 'math', correctIndex: 1, text: "Sequência: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
      { id: 806, category: 'logic', correctIndex: 2, text: "Todo A é B. Todo B é C. Portanto:", options: ["Todo C é A", "Algum C é A", "Todo A é C", "Nenhum A é C"] },
      { id: 807, category: 'spatial', correctIndex: 0, text: "Um relógio mostra 3:15. Refletido num espelho, que horas parecem ser?", options: ["8:45", "9:45", "3:45", "2:15"] },
      { id: 808, category: 'verbal', correctIndex: 0, text: "Encontre o intruso:", options: ["Carro", "Roda", "Volante", "Motor"] },
      { id: 809, category: 'math', correctIndex: 3, text: "Se 3x3=18, 4x4=32, 5x5=50, 6x6=72, então 7x7=?", options: ["84", "90", "96", "98"] },
      { id: 810, category: 'logic', correctIndex: 2, text: "Há 2 mães, 2 filhas e 1 avó em um quarto. Qual o número mínimo de pessoas?", options: ["5", "4", "3", "2"] },
      { id: 811, category: 'spatial', correctIndex: 3, text: "Qual é a soma dos ângulos internos de um triângulo?", options: ["90°", "360°", "270°", "180°"] },
      { id: 812, category: 'math', correctIndex: 2, text: "Um fazendeiro tem 17 ovelhas, todas menos 9 morrem. Quantas restam?", options: ["17", "8", "9", "0"] },
      { id: 813, category: 'verbal', correctIndex: 3, text: "Qual palavra não pertence ao grupo?", options: ["Maçã", "Pera", "Banana", "Batata"] },
      { id: 814, category: 'logic', correctIndex: 1, text: "O que tem cidades, mas não tem casas; tem florestas, mas não tem árvores; e tem água, mas não tem peixes?", options: ["Um sonho", "Um mapa", "Um livro", "Um computador"] },
      { id: 815, category: 'spatial', correctIndex: 2, text: "Se você cortar um bolo redondo com 3 cortes retos, qual o número máximo de pedaços que pode obter?", options: ["4", "6", "7", "8"] }
    ],
    'ru': [
      { id: 901, category: 'math', correctIndex: 2, text: "Последовательность: 1, 4, 9, 16, 25, ?", options: ["30", "32", "36", "40"] },
      { id: 902, category: 'logic', correctIndex: 1, text: "Врач дал вам 3 таблетки и велел принимать по одной каждые полчаса. Сколько времени это займет?", options: ["1.5 часа", "1 час", "2 часа", "3 часа"] },
      { id: 903, category: 'spatial', correctIndex: 2, text: "Какую 3D-фигуру можно получить, сложив 2D-развертку в форме креста?", options: ["Пирамида", "Сфера", "Куб", "Цилиндр"] },
      { id: 904, category: 'verbal', correctIndex: 2, text: "Эфемерный относится к Долговечному, как Динамичный к...", options: ["Короткому", "Твердому", "Статичному", "Тяжелому"] },
      { id: 905, category: 'math', correctIndex: 1, text: "Последовательность: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
      { id: 906, category: 'logic', correctIndex: 2, text: "Все А — это В. Все В — это С. Следовательно:", options: ["Все С — это А", "Некоторые С — это А", "Все А — это С", "Ни одно А не является С"] },
      { id: 907, category: 'spatial', correctIndex: 0, text: "Часы показывают 3:15. Сколько времени в зеркальном отражении?", options: ["8:45", "9:45", "3:45", "2:15"] },
      { id: 908, category: 'verbal', correctIndex: 0, text: "Найдите лишнее слово:", options: ["Машина", "Колесо", "Руль", "Двигатель"] },
      { id: 909, category: 'math', correctIndex: 3, text: "Если 3x3=18, 4x4=32, 5x5=50, 6x6=72, то 7x7=?", options: ["84", "90", "96", "98"] },
      { id: 910, category: 'logic', correctIndex: 2, text: "В комнате 2 матери, 2 дочери и 1 бабушка. Какое минимальное количество людей в комнате?", options: ["5", "4", "3", "2"] },
      { id: 911, category: 'spatial', correctIndex: 1, text: "Сколько сторон у октагона?", options: ["6", "8", "10", "12"] },
      { id: 912, category: 'math', correctIndex: 2, text: "У фермера было 17 овец. Все, кроме 9, умерли. Сколько овец осталось?", options: ["17", "8", "9", "0"] },
      { id: 913, category: 'verbal', correctIndex: 3, text: "Какое слово не подходит?", options: ["Яблоко", "Груша", "Банан", "Картофель"] },
      { id: 914, category: 'logic', correctIndex: 1, text: "Что всегда приходит, но никогда не прибывает?", options: ["Поезд", "Завтра", "Письмо", "Гость"] },
      { id: 915, category: 'spatial', correctIndex: 0, text: "Если вы разрежете квадрат пополам, а затем каждую половину пополам, сколько частей у вас будет?", options: ["4", "2", "6", "8"] }
    ]
  };
}