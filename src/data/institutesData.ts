export interface SfuGroup {
  id: string;
  name: string;
  course: number;
}

export interface SfuInstitute {
  id: string;
  shortName: string;
  fullName: string;
  groups: SfuGroup[];
}

export const SFU_INSTITUTES: SfuInstitute[] = [
  {
    id: 'ikit',
    shortName: 'ИКИТ',
    fullName: 'Институт космических и информационных технологий',
    groups: [
      { id: 'ki22-17b', name: 'КИ22-17Б', course: 3 },
      { id: 'ki22-16b', name: 'КИ22-16Б', course: 3 },
      { id: 'ki23-17b', name: 'КИ23-17Б', course: 2 },
      { id: 'ki24-17b', name: 'КИ24-17Б', course: 1 },
      { id: 'ki21-17b', name: 'КИ21-17Б', course: 4 },
      { id: 'ki22-08b', name: 'КИ22-08Б (ИБ)', course: 3 },
      { id: 'ki22-11b', name: 'КИ22-11Б (ИВТ)', course: 3 },
      { id: 'ki23-05b', name: 'КИ23-05Б (ПИ)', course: 2 },
    ],
  },
  {
    id: 'pi',
    shortName: 'ПИ',
    fullName: 'Политехнический институт',
    groups: [
      { id: 'pe22-01b', name: 'ПЭ22-01Б', course: 3 },
      { id: 'pm22-04b', name: 'ПМ22-04Б', course: 3 },
      { id: 'pa23-02b', name: 'ПА23-02Б', course: 2 },
      { id: 'pt24-01b', name: 'ПТ24-01Б', course: 1 },
    ],
  },
  {
    id: 'inig',
    shortName: 'ИНиГ',
    fullName: 'Институт нефти и газа',
    groups: [
      { id: 'ng22-01b', name: 'НГ22-01Б', course: 3 },
      { id: 'nb22-02b', name: 'НБ22-02Б', course: 3 },
      { id: 'nr23-03b', name: 'НР23-03Б', course: 2 },
      { id: 'nt24-01b', name: 'НТ24-01Б', course: 1 },
    ],
  },
  {
    id: 'ui',
    shortName: 'ЮИ',
    fullName: 'Юридический институт',
    groups: [
      { id: 'ur22-01b', name: 'ЮР22-01Б', course: 3 },
      { id: 'ur22-02b', name: 'ЮР22-02Б', course: 3 },
      { id: 'ur23-05b', name: 'ЮР23-05Б', course: 2 },
      { id: 'ur24-03b', name: 'ЮР24-03Б', course: 1 },
    ],
  },
  {
    id: 'imifi',
    shortName: 'ИМиФИ',
    fullName: 'Институт математики и фундаментальной информатики',
    groups: [
      { id: 'mm22-01b', name: 'ММ22-01Б', course: 3 },
      { id: 'mf23-02b', name: 'МФ23-02Б', course: 2 },
      { id: 'mi24-01b', name: 'МИ24-01Б', course: 1 },
    ],
  },
  {
    id: 'iifire',
    shortName: 'ИИФиРЭ',
    fullName: 'Институт инженерной физики и радиоэлектроники',
    groups: [
      { id: 'fr22-01b', name: 'ФР22-01Б', course: 3 },
      { id: 'fe23-02b', name: 'ФЭ23-02Б', course: 2 },
      { id: 'fn24-01b', name: 'ФН24-01Б', course: 1 },
    ],
  },
  {
    id: 'iaid',
    shortName: 'ИАиД',
    fullName: 'Институт архитектуры и дизайна',
    groups: [
      { id: 'ar22-01b', name: 'АР22-01Б', course: 3 },
      { id: 'ad23-02b', name: 'АД23-02Б', course: 2 },
      { id: 'ag24-01b', name: 'АГ24-01Б', course: 1 },
    ],
  },
  {
    id: 'gi',
    shortName: 'ГИ',
    fullName: 'Гуманитарный институт',
    groups: [
      { id: 'is22-01b', name: 'ИС22-01Б', course: 3 },
      { id: 'fl23-02b', name: 'ФЛ23-02Б', course: 2 },
      { id: 'gs24-01b', name: 'ГС24-01Б', course: 1 },
    ],
  },
  {
    id: 'isi',
    shortName: 'ИСИ',
    fullName: 'Инженерно-строительный институт',
    groups: [
      { id: 'st22-01b', name: 'СТ22-01Б', course: 3 },
      { id: 'sg23-02b', name: 'СГ23-02Б', course: 2 },
      { id: 'sb24-01b', name: 'СБ24-01Б', course: 1 },
    ],
  },
  {
    id: 'ifksit',
    shortName: 'ИФКСиТ',
    fullName: 'Институт физической культуры, спорта и туризма',
    groups: [
      { id: 'fk22-01b', name: 'ФК22-01Б', course: 3 },
      { id: 'ft23-02b', name: 'ФТ23-02Б', course: 2 },
      { id: 'fs24-01b', name: 'ФС24-01Б', course: 1 },
    ],
  },
  {
    id: 'ieguif',
    shortName: 'ИЭГУиФ',
    fullName: 'Институт экономики, гос. управления и финансов',
    groups: [
      { id: 'ek22-01b', name: 'ЭК22-01Б', course: 3 },
      { id: 'me22-02b', name: 'МЭ22-02Б', course: 3 },
      { id: 'fn23-01b', name: 'ФН23-01Б', course: 2 },
    ],
  },
  {
    id: 'iubp',
    shortName: 'ИУБП',
    fullName: 'Институт управления бизнес-процессами',
    groups: [
      { id: 'mb22-01b', name: 'МБ22-01Б', course: 3 },
      { id: 'ub23-02b', name: 'УБ23-02Б', course: 2 },
    ],
  },
  {
    id: 'icm',
    shortName: 'ИЦМ',
    fullName: 'Институт цветных металлов',
    groups: [
      { id: 'mt22-01b', name: 'МТ22-01Б', course: 3 },
      { id: 'cm23-02b', name: 'ЦМ23-02Б', course: 2 },
    ],
  },
  {
    id: 'ifbibt',
    shortName: 'ИФБиБТ',
    fullName: 'Институт фундаментальной биологии и биотехнологии',
    groups: [
      { id: 'bf22-01b', name: 'БФ22-01Б', course: 3 },
      { id: 'bt23-02b', name: 'БТ23-02Б', course: 2 },
    ],
  },
  {
    id: 'ifiyak',
    shortName: 'ИФиЯК',
    fullName: 'Институт филологии и языковой коммуникации',
    groups: [
      { id: 'lk22-01b', name: 'ЛК22-01Б', course: 3 },
      { id: 'ia23-02b', name: 'ИА23-02Б', course: 2 },
    ],
  },
  {
    id: 'ieig',
    shortName: 'ИЭиГ',
    fullName: 'Институт экологии и географии',
    groups: [
      { id: 'eg22-01b', name: 'ЭГ22-01Б', course: 3 },
      { id: 'gg23-02b', name: 'ГГ23-02Б', course: 2 },
    ],
  },
  {
    id: 'ipps',
    shortName: 'ИППС',
    fullName: 'Институт педагогики, психологии и социологии',
    groups: [
      { id: 'ps22-01b', name: 'ПС22-01Б', course: 3 },
      { id: 'pd23-02b', name: 'ПД23-02Б', course: 2 },
    ],
  },
  {
    id: 'itisu',
    shortName: 'ИТиСУ',
    fullName: 'Институт торговли и сферы услуг',
    groups: [
      { id: 'tr22-01b', name: 'ТР22-01Б', course: 3 },
      { id: 'tu23-02b', name: 'ТУ23-02Б', course: 2 },
    ],
  },
  {
    id: 'vii',
    shortName: 'ВИИ',
    fullName: 'Военно-инженерный институт',
    groups: [
      { id: 'vi22-01b', name: 'ВИ22-01Б', course: 3 },
      { id: 'vi23-02b', name: 'ВИ23-02Б', course: 2 },
    ],
  },
  {
    id: 'gastronomy',
    shortName: 'ИТиЭ (Гастрономия)',
    fullName: 'Институт гастрономии СФУ',
    groups: [
      { id: 'gs22-01b', name: 'ГС22-01Б', course: 3 },
      { id: 'gs23-02b', name: 'ГС23-02Б', course: 2 },
    ],
  },
];
