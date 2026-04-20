export type QuizItem = {
  id: number;
  question?: string;
  wordToDefine?: string;
  options?: string[];
  correct?: string;
  centerWord?: string;
  hint?: string;
  relatedWords?: string[];
  clues?: string[];
  term?: string;
};

export type Chapter = {
  id: number;
  tag: string;
  title: string;
  nobela: string;
  quizType: 'multiple-choice' | 'mind-map' | 'punan-mo' | 'matching' | 'line-connect';
  quizTitle?: string;
  quizInstructions?: string;
  quiz: QuizItem[];
  matchingChoices?: string[];
};

export const chaptersData: Chapter[] = [
  {
    id: 1,
    tag: 'KABANATA I',
    title: 'Isang Pagtitipon',
    quizType: 'multiple-choice',
    nobela: `Isang marangyang salo-salo ang ipinag-anyaya ni Don Santiago de los Santos na higit na popular sa taguring Kapitan Tiyago. Ang handaan ay gagawin sa kanyang bahay na nasa Kalye Anloague (na ngayo'y Kalye Juan Luna) na karatig ng Ilog Binundok.

Ang paanyaya ay madaling kumalat sa lahat ng sulok ng Maynila. Bawat isa ay gustong dumato sapagkat ang mayamang kapitan ay kilala bilang isang mabuting tao, mapagbigay at laging bukas ang palad sa mga nangangailangan. 

Dahil dito, ang iba ay nababalino kung ano ang isusuot at sasabihin sa mismong araw ng handaan. Nang gabing iyon dagsa ang mga panauhin na gaya ng dapat asahan. Puno ang bulwagan. Ang nag-iistima sa mga bisita ay si Tiya Isabel, isang matandang babae na pinsan ng may-bahay. 

Kabilang sa mga bisita sina tenyente ng guardia civil, Padre Sibyla, ang kura paroko ng Binundok, si Padre Damaso na madaldal at mahahayap ang mga salita at dalawang paisano. Ang isa ay kararating lamang sa Pilipinas.

Ang kararating na dayuhan ay nagtatanong tungkol sa mga asal ng mga katutubong Pilipino. Ipinaliwanag niya na ang pagpunta niya sa bansa ay sarili niyang gastos. Ang pakay ng kanyang paglalakbay ay upang magkaroon ng kabatiran tungkol sa lupain ng mga Indiyo.

Nagkaroon ng mainitang balitaktakan ng mabanggit ng dayuhan ang tungkol sa monopolyo ng tabako. Nailabas ni Padre Damaso ang kanyang mapanlait na ugali. Nilibak niya ang mga Indiyo. Ang tingin niya sa mga ito ay hamak at mababa. Lumitaw din sa usapan ang panlalait ng mga Espanyol tungkol sa mga Pilipino noong mga nakalipas na araw.

Mapanlibak si Padre Damaso. Kung kaya't iniba ni Padre Sibyla ang usapan. Napadako ang usapan tungkol sa pagkakalipat sa ibang bayan ni Padre Damaso pagkatapos ng makapagsilbi sa loob ng 20 taon bilang kura paroko ng San Diego. Sinabi niya kahit na ang hari ay hindi dapat manghimasok sa pagpaparusa ng simbahan sa mga erehe.

Pero, ito ay tinutulan ng Tenyente ng Guardia Civil sa pagsasabing may karapatan ang Kapitan Heneral sapagkat ito ang kinatawan ng hari ng bansa. Ipinaliwanag pa ng tenyente ang dahilan ng pagkakalipat ni Padre Damaso. 

Ito umano ang nag-utos na hukayin at ilipat ang bangkay ng isang marangal na lalaki na napagbintangang isang erehe ng pari dahil lamang sa hindi pangungumpisal.

Ang ginawa ay itinuturing sa isang kabuktutan ng Kapitan Heneral. Kung kaya inutos nito ang paglilipat sa ibang parokya ang paring Pransiskano bilang parusa. Nagpupuyos sa galit ang pari kapag naaalala niya ang mga kasulatang nawaglit.

Iniwanan na ni Tenyente ang umpukan, pagka-tapos nitong makapagpaliwanag. Sinikap ni Padre Sibyla na pakalmahin ang loob ni Padre Damaso. Lumawig muli ang talayan. Dumating ang ilan pang mga bagong panauhin. Ilan sa mga ito ay ang mag-asawang sina Dr. de Espadaña at Donya Victorina.`,
    quiz: [
      {
        id: 1,
        question: 'Nababalino ang mga tao dahil sa malakas na lindol kanina.',
        wordToDefine: 'Nababalino',
        options: ['Naguguluhan', 'Nalulungkot', 'Nalilinaw', 'Nababalisa'],
        correct: 'Nababalisa',
      },
      {
        id: 2,
        question: 'Dahil sa kanyang mahahayap na pananalita, nawalan siya ng mga kaibigan.',
        wordToDefine: 'mahahayap',
        options: ['Magiliw', 'Mapanakit', 'Mahinahon', 'Magaspang'],
        correct: 'Mapanakit',
      },
      {
        id: 3,
        question: 'Masigla ang balitaktakan ng mga mag-aaral tungkol sa kahalagahan ng pagbabasa ng Noli Me Tangere.',
        wordToDefine: 'balitaktakan',
        options: ['Kuwentuhan', 'Tunggalian', 'Talakayan', 'Diskusyon'],
        correct: 'Diskusyon',
      },
      {
        id: 4,
        question: 'Sa harap ng maraming tao, nilibak siya ng mga kaklase dahil sa kanyang pagkakamali.',
        wordToDefine: 'nilibak',
        options: ['Sinaktan', 'Minaliit', 'Tinawanan', 'Iniwanan'],
        correct: 'Tinawanan',
      },
      {
        id: 5,
        question: 'Sa nobelang Noli Me Tangere, tinawag na erehe si Ibarra dahil sa kanyang mga makabagong kaisipan.',
        wordToDefine: 'erehe',
        options: ['Naghihimagsik', 'Rebelde', 'Kalaban', 'Malikhain'],
        correct: 'Rebelde',
      },
    ],
  },
  {
    id: 2,
    tag: 'KABANATA II',
    title: 'Crisostomo Ibarra',
    quizType: 'mind-map',
    nobela: `Kasamang dumating ni Kapitan Tiyago ang binatang si Crisostomo Ibarra na nakadamit panluksa. Masayang binati ng kapitan ang mga panauhin at humalik sa mga kamay ng pari na hindi siya benindisyonan dahil sa pagkagulat. Si Padre Damaso ay hindi nakaimik at namutla sa pagkakita kay Ibarra. 

Si Ibarra ay ipinakilala ni Kapitan Tiyago na anak ng kanyang kaibigang namatay. Kararating pa lamang nito sa Europa kung saan siya ay tumira nang pitong taon upang mag-aral. Si Crisostomo Ibarra ay kayumanggi kahit na ito ay may dugong Espanyol. 

Tumangging makipagkamay si Padre Damaso kay Ibarra at ikinaila nito na kaibigan niya ang yumaong ama ng binata. Iniurong ni Ibarra ang kanyang palad at tumalikod na lamang. Kinausap naman siya ng tenyente na nagpasalamat at dumating siyang ligtas.

Sa pag-uusap nila, pinuri ng tenyente ang nasira niyang ama na ikinagalak ni Ibarra dahil maganda pala ang pagkakakilala nito sa kanyang ama. Patuloy ang masamang sulyap ni Padre Damaso sa tenyente na ikinainis nito at lumayo na lamang siya kay Ibarra.

Naiwan si Ibarra na walang makausap. Dahil sa kaugaliang natutunan niya sa ibang bansa, hindi siya nahiyang lapitan ang mga panauhin upang ipakilala ang kanyang sarili. Hindi sumagot ang mga babae upang magpakilala. Ang mga lalaki lamang ang nakipagkamay at nagsabi ng pangalan.

Isa rito ay ang manunulat na huminto na sa pagsusulat. Lumapit kay Ibarra ang isang panauhin, si Kapitan Tinong, upang anyayahan siya sa tanghalian kinabukasan. Tumanggi siya dahil pauwi na siya sa San Diego.
`,
    quiz: [
      {
        id: 1,
        centerWord: 'IKINAILA',
        hint: 'Ginagamit ito upang ipahayag na ang isang tao ay hindi umamin o sadyang itinago ang isang bagay. Karaniwan ay isang katotohanan, damdamin, o pagkakasangkot.',
      },
    ],
  },
  {
    id: 3,
    tag: 'KABANATA III',
    title: 'Ang Hapunan',
    quizType: 'punan-mo',
    nobela: `Oras na ng kainan at ang mga panauhin ay nagtipon sa hapag-kainan. Samantalang siyang-siya si Padre Sybila, si Padre Damaso naman ay inis na pinagsisikaran ang bawa't madaanan. Hindi siya pinapansin ng ibang panauhin na abala sa pagkain at pagpuri sa masarap na handa.

Nainis naman si Donya Victorina sa tenyente sapagkat natapakan ang kola ng kanyang saya habang tinitingnan nito ang pagkakulot ng kanyang buhok. Sa kabisera umupo si Crisostomo Ibarra habang nagtatalo ang dalawang pati kung sino ang uupo sa kabilang dolo. 

Gusto ni Padre Sybila na maupo si Padre Damaso sa kabisera dahil ito ang padre kompesor ng pamilya ni Kapitan Tiyago. Pero tumanggi si Padre Damaso dahil si Padre Sybila ang kura paroko. 

Napapayag si Padre Sybila pero naudlot siya sa pag-upo upang ialok ang upuan sa tenyente. Tumanggi ang tenyente dahil ayaw niyang makitabi sa dalawang pari. Inanyayahan ni Ibarra si Kapitan Tiyago upang maupo pero tumanggi ang kapitan dahil abala siya sa pag-asikaso sa mga panauhin. Galit si Padre Damaso sa isinilbi sa kanyang tinola.

Napansin niya na puro leeg at pakpak ang sa kanya samantalang ang kay Ibarra ay ang masasarap na bahagi ng manok. Sa pakikipag-usap sa mga ibang panauhin, nalaman na si Crisostomo Ibarra ay wala sa Pilipinas nang matagal at walang nakapagsabi sa kanya kung ano talaga ang nangyari sa kanyang amang si Don Rafael.

Inusisa ni Donya Victorina kung bakit hindi nagpadala ng hatid-kawad ang binata kagaya ng ginawa ng kanyang asawang si Don Tiburcio noong sila ay ikinasal.

Sa kuwento ng binata, nalaman ng mga kausap niya na marami siyang bansang napuntahan kung saan pinag-aralan niya ang kanilang wika at kasaysayan. Pinaliwanag niya na ang mga bansa ay pare-pareho lang sa kabuhayan, politika at relihiyon. Sumabat si Padre Damaso na kahit bata ay alam ang mga sinasabi niya.

Nagulat ang mga tao sa sinabi ng pari. Sumagot si Ibarra na ang mga sinasabi niya ay mga alaala niya noong pumupunta pa siya sa bahay nila upang kumain. Nagpaalam si Ibarra upang umalis kahit na siya ay pinigilan ni Kapitan Tiyago dahil darating na si Maria Clara. Naiwang nagdadaldal si Padre Damaso tungkol sa pagbawal ng pamahalaan sa pagpapahintulot sa indiyo na mag-aral sa ibang bansa.
`,
    quiz: [
      {
        id: 1,
        question: 'Ang pinagsisikaran ng mga mamamayan ay ang pagpapatupad ng bagong batas sa kanilang barangay.',
        wordToDefine: 'pinagsisikaran',
        correct: 'PAGIINITAN',
        clues: ['P', '', 'G', '', 'U', '', 'O', 'L'],
      },
      {
        id: 2,
        question: 'Humanga ang lahat sa mahabang kola ng kanyang damit na may magandang disenyo.',
        wordToDefine: 'kola',
        correct: 'DULO',
        clues: ['D', '', 'Y', 'L', '', 'Y', 'A', ''],
      },
      {
        id: 3,
        question: 'Sa pulong, sumabad ang isang kasapi kahit hindi pa siya tinatawag.',
        wordToDefine: 'sumabad',
        correct: 'NAKISABAT',
        clues: ['N', '', 'K', '', 'S', '', 'B', '', 'T'],
      },
      {
        id: 4,
        question: 'Nakatanggap ng hatid-kawad ang pamilya mula sa kanilang kaanak na nasa probinsya.',
        wordToDefine: 'hatid-kawad',
        correct: 'MENSAHE',
        clues: ['M', '', '', '', '', 'H', 'E'],
      },
      {
        id: 5,
        question: 'Noong panahon ng kolonyalismong Kastila, maraming Indio ang napilitang magtrabaho sa hacienda.',
        wordToDefine: 'Indio',
        correct: 'MANGMANG',
        clues: ['M', '', 'N', '', 'M', '', 'N', ''],
      },
    ],
  },
  {
    id: 4,
    tag: 'KABANATA IV',
    title: 'Erehe at Pilibustero',
    quizType: 'matching',
    quizTitle: 'PARES SALITA!',
    quizInstructions: 'Piliin sa kahon ang wastong kahulugan ng salita sa bawat bilang.',
    nobela: `Naglakad na si Ibarra nang walang tiyak na paroroonan hanggang marating niya ang liwasan ng Binundok. Wala pa rin siyang nakitang pagbabago mula nang siya ay umalis. Hindi niya alam sinundan pala siya ni Tenyente Guevarra. Pinaalalahanan siya ng tenyente na mag-ingat dahil baka mapahamak din siyang katulad ng kanyang ama. 

Inusisa ni Ibarra kung ano ang tunay na nangyari sa kanyang ama. Ang alam lang niya ay abala ito sa mga gawain kaya huminging paumanhin kung hindi siya makasulat sa anak. Isinalaysay ng tenyente ang gustong malaman ni Ibarra. 

Bagama't pinakamayaman si Don Rafael sa lalawigan, marami rin siyang mga kaaway na karamihan ay naiinggit. Ang mga nuno nila ay Espanyol din, ngunit marami siyang kagalit na Espanyol at mga pari. 

Kasama rito si Padre Damaso na nakaaway ni Don Rafael dahil hindi raw ito nangungumpisal. Pinagbintangan siyang pumatay sa isang naniningil ng buwis at siya ay nabilanggo. Ang taong ito, na isang artilyero, ay sinaway lamang ni Don Rafael sa pananakit sa mga batang nanunukso sa kanya. 

Nang gumanti ang lalaki, napilitang ipagtanggol niya ang kanyang sarili. Sa kanilang paglalaban, bigla na lamang sumuray-suray ang artilyero at dahan-dahang nabuwal. Terible ang kanyang pagkakabuwal sapagkat ang kanyang ulo ay tumama sa isang tipak na bato. 

Nagduduwal ito at hindi nagkamalay hanggang sa tuluyang mapugto ang hininga. Dahil dito, nabilanggo si Don Rafael. Pinagbintangan siyang erehe at pilibustero. Masakit sa kanya ang ganito sapagkat iyon ang itinuturing na pinakamabigat na parusa.

Dinagdagan pa ang mga paratang kagaya nang pagbabasa ng pinagbabawal na aklat at pagtago ng larawan ng paring binitay sa salang pangangamkam ng lupa. Ipinagtapat ng tenyente na ginawa niya ang lahat para matulungan si Don Rafael sa pamamagitan ng pagkuha ng abogadong magtatanggol sa kanya. 

Sa pagsisiyasat, ay napatunayang namatay ang artilyero dahil sa namuong dugo nito sa ulo. Nang malapit nang lumaya si Don Rafael, namatay ito, marahil, sa hindi nakayanang mga sama ng loob at pahirap. Dumating na sila sa harap ng kuwartel kaya kinamayan na lang ng tenyente si Ibarra at sinabihang tanungin si Kapitan Tiyago sa mga iba pang nangyari. Sumakay na si Ibarra sa kalesa.
`,
    quiz: [
      { id: 1, term: 'Erehe', correct: 'Lumalabag sa aral ng simbahan' },
      { id: 2, term: 'Pilibustero', correct: 'Kaaway ng pamahalaan' },
      { id: 3, term: 'Sumuray-suray', correct: 'Hindi nababalanse ang lakad' },
      { id: 4, term: 'Artilyero', correct: 'Sundalong may kanyon' },
      { id: 5, term: 'Pag-uusig', correct: 'Malupit na pang-aapi' },
    ],
    matchingChoices: [
      'Hindi nababalanse ang lakad',
      'Sundalong may kanyon',
      'Kaaway ng pamahalaan',
      'Malupit na pang-aapi',
      'Lumalabag sa aral ng simbahan',
    ],
  },
  {
    id: 5,
    tag: 'KABANATA V',
    title: 'Isang Tala sa Gabing Madilim',
    quizType: 'matching',
    quizTitle: 'HANAPIN MO!',
    quizInstructions: 'Hanapin ang kahulugan ng inilalahad sa bawat numero. Ilagay ang iyong sagot sa espasyo bago ang numero.',
    nobela: `Sakay ng kalesa, dumating si Ibarra sa Fonda de Lala. (Ito ay isang uri ng panuluyan, na tinutuluyan niya kapag siya ay nasa Maynila). Kaagad na nagtuloy si Ibarra sa kanyang silid at naupo sa isang silyon. Sa sinapit ng ama, gulong-gulo ang isip nito. Maya-maya ginala ang paningin sa kalawakan ng himpapawid.

Mula sa bintana, natanaw niya ang isang maliwanag na bahay sa kabila ng ilog. Naririnig niya ang kalansing ng mga kubyertos at pinggan. Dinig din niya ang tugtugin ng orkestra.

Kung nagmasid lamang nang husto sa bahay na iyon si Ibarra, makikita niya kung sino-sino ang naroroon. May isang magandang binibini na nababalot ng manipis na habi, may suot na diyamante at ginto. Sa likuran naman may mga anghel, pastol at dalagang nag-aalay ng bulaklak. 

Ang mga umpukan naman ng mga Espanyol, Pilipino, pari, Intsik, militar ay nakatuon lahat sa kagandahan ni Maria Clara. Giliw na giliw silang nakatingin sa dalaga, maliban sa isang batang Pransiskano na payat at putlain. Iba ang kanyang nadarama.

Si Padre Sibyla ay siyang-siya sa pakikipag-usap sa mga dilag samantalang si Donya Victoria ay matiyagang inaayos ang buhok ng dalagang hinahangaan ng lahat. Dahil sa pagal ang isip at katawan ni Ibarra sa paglalim ng gabi, madali siyang naktulog at nagising kinabukasan na. Ang tanging hindi inabot ng antok ay ang batang Pransiskano.
`,
    quiz: [
      {
        id: 1,
        term: 'Isang sasakyang pangtao na hinihila ng kabayo at karaniwang ginagamit noong unang panahon.',
        correct: 'Kalesa',
      },
      {
        id: 2,
        term: 'Ito ay maliit at hindi palagiang tindahang-bayan, karaniwan kung pista.',
        correct: 'Fonda',
      },
      {
        id: 3,
        term: 'Tunog na nililikha kapag nagsasalpukan ang mga metal na bagay tulad ng pinggan o kubyertos.',
        correct: 'Kalansing',
      },
      {
        id: 4,
        term: 'Tela o pinagtagpi-tagping materyal na ginagamit sa paggawa ng damit o iba pang gamit.',
        correct: 'Habi',
      },
      {
        id: 5,
        term: 'Isang grupo ng mga musikero na tumutugtog ng magkakasamang musika.',
        correct: 'Orkestra',
      },
    ],
    matchingChoices: ['Kalesa', 'Fonda', 'Kalansing', 'Habi', 'Orkestra'],
  },
  {
    id: 6,
    tag: 'KABANATA VI',
    title: 'Si Kapitan Tiyago',
    quizType: 'line-connect',
    quizTitle: 'HULAAN MO!',
    quizInstructions: 'Basahin ang mga salita at iugnay ang bawat salita ng tamang pangungusap sa kanang bahagi.',
    nobela: `Ang mga katangian ni Kapitan Tiyago ay itinuturing na hulog ng langit. Siya ay pandak, 'di kaputian at may bilugang mukha. Siya ay tinatayang nasa pagitan ng 35 taong gulang. Maitim ang kanyang buhok at kung hindi lamang gumagamit ng tabako at ngumanganga, maituturing na siya ay magandang lalaki. 

Siya ang pinakamayaman sa Binundok dahil marami siyang negosyo at mga iba pang klase ng ari-arian. Tanyag din siya sa Pampanga at Laguna bilang asendero. Hindi kataka-taka na para siyang lubong hinihipan sa pagpintog ng kanyang yaman. 

Dahil siya ay mayaman, siya ay isang maimpluwensyang tao. Siya ay malakas sa mga taong nasa gobyerno at halos kaibigan niya ang lahat ng mga prayle. Ang turing niya sa sarili ay isang tunay na Espanyol, hindi Pilipino. Kasundo niya ang Diyos dahil nagagawa niyang bilhin ang kabanalan.

Katunayan, siya ay nagpapamisa at nagpapadasal tungkol sa kanyang sarili. Ipinalalagay ng balana na siya ay nakapagtatamo ng kalangitan. Iisipin na lamang na nasa kanyang silid ang lahat ng mga santo at santang sinasamba katulad nina Sta. Lucia, San Pascual Bailon, San Antonio de Padua, San Francisco de Asis, San Antonio Abad, San Miquel, Sto. Domingo, Hesukristo at ang banal na mag-anak.

Para kay Kapitan Tiyago kahit na ano ang itakda ng mga Espanyol, yaon ay karapat-dapat at kapuri-puri. Dahil sa kanyang pagpupula sa mga Pilipino, siya ay naglilingkod bilang gobernadocillo. Basta opisyal, sinusunod niya.

Anumang reglamento o patakaran ay kanyang sinusunod. Sipsip din siya sa mga taong nasa poder. Basta may okasyon na katulad ng kapanganakan at kapistahan, lagi siyang may handog na regalo. 

Si Kapitan Tiyago ang tanging kuripot na mangangalakal ng asukal sa Malabon. Dahil sa kakuriputan ng ama, siya ay hindi pinag-aral. Naging katulong at tinuruan siya ng isang paring Dominiko. Nang mamatay ang pari at ama nito, siya'y mag-isang nangalakal. Nakilala nya si Pia Alba na isang magandang dalagang taga Sta. Cruz. 

Nagkatulong sila sa paghahanapbuhay hanggang sa yumaman nang husto at nakilala sa alta sosyedad. Ang pagbili nila ng lupain sa San Diego ang naging daan upang maging kaututang dila roon ang kura na si Padre Damaso.

Naging kaibigan din nila ang pinakamayaman sa buong San Diego si Don Rafael Ibarra, ang ama ni Crisostomo Ibarra. Sa anim na taon ng pagsasama sina Tiyago at Pia, hindi sila nagkaroon ng anak kahit na saan-saan sila namanata. 

Dahil dito ipinayo ni Padre Damaso na sa Obando sila pumunta, kina San Pascual Baylon at Sta. Clara at sa Nuestra Sra. de Salambaw. Parang dininig ang dasal ni Pia. Siya ay naglihi; gayunman naging masakitin si Pia nang siya ay nagdalantao. Pagkapanganak niya, siya ay namatay. 

Si Padre Damaso ang nag-anak sa binyag sa anak ni Pia na pinangalanang Maria Clara bilang pagbibigay karangalan sa dalawang pintakasi sa Obando. Si Tiya Isabel, pinsan ni Kapitan Tiyago, ang natokang mag-aruga kay Maria. 

Lumaki sya sa pagmamahal na inukol ni Tiya Isabel, ng kanyang ama, at ng mga prayle. Katorse anyos si Maria nang ipinasok siya sa beaterio ng Sta. Catalina. Luhaan siyang nagpaalam kay Padre Damaso at sa kanyang kaibigan at kababatang si Crisostomo Ibarra.

Pagpasok ni Maria sa kombento, nagpunta naman si Ibarra sa Europa upang mag-aral. Gayunman, nagkasundo sina Don Rafael at Kapitan Tiyago na, maski nagkalayo ang kanilang mga anak, pagdating ng tamang panahon, silang dalawa ay pag-iisahing dibdib. Ito ay sa kanilang paniniwala na ang dalawa ay tunay na nag-iibigan.
`,
    quiz: [
      {
        id: 1,
        term: 'Kabanalan',
        correct: 'Uri ng matibay na pananalig o paniniwala na sinusukat sa pamamagitan ng pagsunod sa batas o ritwal.',
      },
      {
        id: 2,
        term: 'Kakuriputan',
        correct: 'Ang kilos o ugali ng sobrang pagtitipid o pag-iingat sa pera na madalas humahadlang sa sariling kaginhawaan.',
      },
      {
        id: 3,
        term: 'Pagpupula',
        correct: 'Tunay na sukatan ng yaman, kung saan ipinapakita ng isang tao ang kanyang ari-arian at negosyo upang makilala sa lipunan.',
      },
      {
        id: 4,
        term: 'Sipsip',
        correct: 'Ang kilos ng sobrang pagyuko o pakikisama sa mga may kapangyarihan upang makamit ang pansariling kapakinabangan.',
      },
      {
        id: 5,
        term: 'Handog',
        correct: 'Ang pagkilos na naglalayong mapagkalooban ng pabor o gantimpala ang iba sa tuwing may okasyon o pagdiriwang.',
      },
    ],
    matchingChoices: [
      'Ito ay sumasagisag sa negatibong damdamin na maaaring makasira sa pagkakaisa at mabuting samahan ng bawat isa.',
      'Uri ng matibay na pananalig o paniniwala na sinusukat sa pamamagitan ng pagsunod sa batas o ritwal.',
      'Ang pagkilos na naglalayong mapagkalooban ng pabor o gantimpala ang iba sa tuwing may okasyon o pagdiriwang.',
      'Ang kilos o ugali ng sobrang pagtitipid o pag-iingat sa pera na madalas humahadlang sa sariling kaginhawaan.',
      'Tunay na sukatan ng yaman, kung saan ipinapakita ng isang tao ang kanyang ari-arian at negosyo upang makilala sa lipunan.',
    ],
  },
];