export default {
  getLanguageFromCode: function (isoCode) {
    let obj = this.data.find(x => x.iso639v1 === isoCode)
    if (!obj) {
      throw new Error(`Unknown ISO 639 Code: ${isoCode}`)
    }
    return obj
  },
  // downloaded from http://heimsath.org/blog/articles/iso-sprachen/
  // removed incomplete langauges, removed french translation and renamed certain keys
  data: [
    {
      'de': 'Danakil-Sprache',
      'en': 'Afar',
      'iso639v1': 'aa'
    },
    {
      'de': 'Abchasisch',
      'en': 'Abkhazian',
      'iso639v1': 'ab'
    },
    {
      'de': 'Afrikaans',
      'en': 'Afrikaans',
      'iso639v1': 'af'
    },
    {
      'de': 'Akan-Sprache',
      'en': 'Akan',
      'iso639v1': 'ak'
    },
    {
      'de': 'Albanisch',
      'en': 'Albanian',
      'iso639v1': 'sq'
    },
    {
      'de': 'Albanisch',
      'en': 'Albanian',
      'iso639v1': 'sq'
    },
    {
      'de': 'Amharisch',
      'en': 'Amharic',
      'iso639v1': 'am'
    },
    {
      'de': 'Arabisch',
      'en': 'Arabic',
      'iso639v1': 'ar'
    },
    {
      'de': 'Aragonesisch',
      'en': 'Aragonese',
      'iso639v1': 'an'
    },
    {
      'de': 'Armenisch',
      'en': 'Armenian',
      'iso639v1': 'hy'
    },
    {
      'de': 'Assamesisch',
      'en': 'Assamese',
      'iso639v1': 'as'
    },
    {
      'de': 'Awarisch',
      'en': 'Avaric',
      'iso639v1': 'av'
    },
    {
      'de': 'Avestisch',
      'en': 'Avestan',
      'iso639v1': 'ae'
    },
    {
      'de': 'Aymará-Sprache',
      'en': 'Aymara',
      'iso639v1': 'ay'
    },
    {
      'de': 'Aserbeidschanisch',
      'en': 'Azerbaijani',
      'iso639v1': 'az'
    },
    {
      'de': 'Baschkirisch',
      'en': 'Bashkir',
      'iso639v1': 'ba'
    },
    {
      'de': 'Bambara-Sprache',
      'en': 'Bambara',
      'iso639v1': 'bm'
    },
    {
      'de': 'Weißrussisch',
      'en': 'Belarusian',
      'iso639v1': 'be'
    },
    {
      'de': 'Bengali',
      'en': 'Bengali',
      'iso639v1': 'bn'
    },
    {
      'de': 'Bihari (Andere)',
      'en': 'Bihari languages',
      'iso639v1': 'bh'
    },
    {
      'de': 'Beach-la-mar',
      'en': 'Bislama',
      'iso639v1': 'bi'
    },
    {
      'de': 'Tibetisch',
      'en': 'Tibetan',
      'iso639v1': 'bo'
    },
    {
      'de': 'Bosnisch',
      'en': 'Bosnian',
      'iso639v1': 'bs'
    },
    {
      'de': 'Bretonisch',
      'en': 'Breton',
      'iso639v1': 'br'
    },
    {
      'de': 'Bulgarisch',
      'en': 'Bulgarian',
      'iso639v1': 'bg'
    },
    {
      'de': 'Birmanisch',
      'en': 'Burmese',
      'iso639v1': 'my'
    },
    {
      'de': 'Katalanisch',
      'en': 'Catalan; Valencian',
      'iso639v1': 'ca'
    },
    {
      'de': 'Chamorro-Sprache',
      'en': 'Chamorro',
      'iso639v1': 'ch'
    },
    {
      'de': 'Tschetschenisch',
      'en': 'Chechen',
      'iso639v1': 'ce'
    },
    {
      'de': 'Chinesisch',
      'en': 'Chinese',
      'iso639v1': 'zh'
    },
    {
      'de': 'Kirchenslawisch',
      'en': 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic',
      'iso639v1': 'cu'
    },
    {
      'de': 'Tschuwaschisch',
      'en': 'Chuvash',
      'iso639v1': 'cv'
    },
    {
      'de': 'Kornisch',
      'en': 'Cornish',
      'iso639v1': 'kw'
    },
    {
      'de': 'Korsisch',
      'en': 'Corsican',
      'iso639v1': 'co'
    },
    {
      'de': 'Cree-Sprache',
      'en': 'Cree',
      'iso639v1': 'cr'
    },
    {
      'de': 'Kymrisch',
      'en': 'Welsh',
      'iso639v1': 'cy'
    },
    {
      'de': 'Tschechisch',
      'en': 'Czech',
      'iso639v1': 'cs'
    },
    {
      'de': 'Tschechisch',
      'en': 'Czech',
      'iso639v1': 'cs'
    },
    {
      'de': 'Dänisch',
      'en': 'Danish',
      'iso639v1': 'da'
    },
    {
      'de': 'Deutsch',
      'en': 'German',
      'iso639v1': 'de'
    },
    {
      'de': 'Maledivisch',
      'en': 'Divehi; Dhivehi; Maldivian',
      'iso639v1': 'dv'
    },
    {
      'de': 'Niederländisch',
      'en': 'Dutch; Flemish',
      'iso639v1': 'nl'
    },
    {
      'de': 'Dzongkha',
      'en': 'Dzongkha',
      'iso639v1': 'dz'
    },
    {
      'de': 'Neugriechisch',
      'en': 'Greek, Modern (1453-)',
      'iso639v1': 'el'
    },
    {
      'de': 'Englisch',
      'en': 'English',
      'iso639v1': 'en'
    },
    {
      'de': 'Esperanto',
      'en': 'Esperanto',
      'iso639v1': 'eo'
    },
    {
      'de': 'Estnisch',
      'en': 'Estonian',
      'iso639v1': 'et'
    },
    {
      'de': 'Ewe-Sprache',
      'en': 'Ewe',
      'iso639v1': 'ee'
    },
    {
      'de': 'Färöisch',
      'en': 'Faroese',
      'iso639v1': 'fo'
    },
    {
      'de': 'Persisch',
      'en': 'Persian',
      'iso639v1': 'fa'
    },
    {
      'de': 'Fidschi-Sprache',
      'en': 'Fijian',
      'iso639v1': 'fj'
    },
    {
      'de': 'Finnisch',
      'en': 'Finnish',
      'iso639v1': 'fi'
    },
    {
      'de': 'Französisch',
      'en': 'French',
      'iso639v1': 'fr'
    },
    {
      'de': 'Französisch',
      'en': 'French',
      'iso639v1': 'fr'
    },
    {
      'de': 'Friesisch',
      'en': 'Western Frisian',
      'iso639v1': 'fy'
    },
    {
      'de': 'Ful',
      'en': 'Fulah',
      'iso639v1': 'ff'
    },
    {
      'de': 'Georgisch',
      'en': 'Georgian',
      'iso639v1': 'ka'
    },
    {
      'de': 'Gälisch-Schottisch',
      'en': 'Gaelic; Scottish Gaelic',
      'iso639v1': 'gd'
    },
    {
      'de': 'Irisch',
      'en': 'Irish',
      'iso639v1': 'ga'
    },
    {
      'de': 'Galicisch',
      'en': 'Galician',
      'iso639v1': 'gl'
    },
    {
      'de': 'Manx',
      'en': 'Manx',
      'iso639v1': 'gv'
    },
    {
      'de': 'Neugriechisch',
      'en': 'Greek, Modern (1453-)',
      'iso639v1': 'el'
    },
    {
      'de': 'Guaraní-Sprache',
      'en': 'Guarani',
      'iso639v1': 'gn'
    },
    {
      'de': 'Gujarati-Sprache',
      'en': 'Gujarati',
      'iso639v1': 'gu'
    },
    {
      'de': 'Haïtien (Haiti-Kreolisch)',
      'en': 'Haitian; Haitian Creole',
      'iso639v1': 'ht'
    },
    {
      'de': 'Haussa-Sprache',
      'en': 'Hausa',
      'iso639v1': 'ha'
    },
    {
      'de': 'Hebräisch',
      'en': 'Hebrew',
      'iso639v1': 'he'
    },
    {
      'de': 'Herero-Sprache',
      'en': 'Herero',
      'iso639v1': 'hz'
    },
    {
      'de': 'Hindi',
      'en': 'Hindi',
      'iso639v1': 'hi'
    },
    {
      'de': 'Hiri-Motu',
      'en': 'Hiri Motu',
      'iso639v1': 'ho'
    },
    {
      'de': 'Kroatisch ',
      'en': 'Croatian',
      'iso639v1': 'hr'
    },
    {
      'de': 'Ungarisch',
      'en': 'Hungarian',
      'iso639v1': 'hu'
    },
    {
      'de': 'Armenisch',
      'en': 'Armenian',
      'iso639v1': 'hy'
    },
    {
      'de': 'Ibo-Sprache',
      'en': 'Igbo',
      'iso639v1': 'ig'
    },
    {
      'de': 'Isländisch',
      'en': 'Icelandic',
      'iso639v1': 'is'
    },
    {
      'de': 'Ido',
      'en': 'Ido',
      'iso639v1': 'io'
    },
    {
      'de': 'Lalo-Sprache',
      'en': 'Sichuan Yi; Nuosu',
      'iso639v1': 'ii'
    },
    {
      'de': 'Inuktitut',
      'en': 'Inuktitut',
      'iso639v1': 'iu'
    },
    {
      'de': 'Interlingue',
      'en': 'Interlingue; Occidental',
      'iso639v1': 'ie'
    },
    {
      'de': 'Interlingua',
      'en': 'Interlingua (International Auxiliary Language Association)',
      'iso639v1': 'ia'
    },
    {
      'de': 'Bahasa Indonesia',
      'en': 'Indonesian',
      'iso639v1': 'id'
    },
    {
      'de': 'Inupik',
      'en': 'Inupiaq',
      'iso639v1': 'ik'
    },
    {
      'de': 'Isländisch',
      'en': 'Icelandic',
      'iso639v1': 'is'
    },
    {
      'de': 'Italienisch',
      'en': 'Italian',
      'iso639v1': 'it'
    },
    {
      'de': 'Javanisch',
      'en': 'Javanese',
      'iso639v1': 'jv'
    },
    {
      'de': 'Japanisch',
      'en': 'Japanese',
      'iso639v1': 'ja'
    },
    {
      'de': 'Grönländisch',
      'en': 'Kalaallisut; Greenlandic',
      'iso639v1': 'kl'
    },
    {
      'de': 'Kannada',
      'en': 'Kannada',
      'iso639v1': 'kn'
    },
    {
      'de': 'Kaschmiri',
      'en': 'Kashmiri',
      'iso639v1': 'ks'
    },
    {
      'de': 'Georgisch',
      'en': 'Georgian',
      'iso639v1': 'ka'
    },
    {
      'de': 'Kanuri-Sprache',
      'en': 'Kanuri',
      'iso639v1': 'kr'
    },
    {
      'de': 'Kasachisch',
      'en': 'Kazakh',
      'iso639v1': 'kk'
    },
    {
      'de': 'Kambodschanisch',
      'en': 'Central Khmer',
      'iso639v1': 'km'
    },
    {
      'de': 'Kikuyu-Sprache',
      'en': 'Kikuyu; Gikuyu',
      'iso639v1': 'ki'
    },
    {
      'de': 'Rwanda-Sprache',
      'en': 'Kinyarwanda',
      'iso639v1': 'rw'
    },
    {
      'de': 'Kirgisisch',
      'en': 'Kirghiz; Kyrgyz',
      'iso639v1': 'ky'
    },
    {
      'de': 'Komi-Sprache',
      'en': 'Komi',
      'iso639v1': 'kv'
    },
    {
      'de': 'Kongo-Sprache',
      'en': 'Kongo',
      'iso639v1': 'kg'
    },
    {
      'de': 'Koreanisch',
      'en': 'Korean',
      'iso639v1': 'ko'
    },
    {
      'de': 'Kwanyama-Sprache',
      'en': 'Kuanyama; Kwanyama',
      'iso639v1': 'kj'
    },
    {
      'de': 'Kurdisch',
      'en': 'Kurdish',
      'iso639v1': 'ku'
    },
    {
      'de': 'Laotisch',
      'en': 'Lao',
      'iso639v1': 'lo'
    },
    {
      'de': 'Latein',
      'en': 'Latin',
      'iso639v1': 'la'
    },
    {
      'de': 'Lettisch',
      'en': 'Latvian',
      'iso639v1': 'lv'
    },
    {
      'de': 'Limburgisch',
      'en': 'Limburgan; Limburger; Limburgish',
      'iso639v1': 'li'
    },
    {
      'de': 'Lingala',
      'en': 'Lingala',
      'iso639v1': 'ln'
    },
    {
      'de': 'Litauisch',
      'en': 'Lithuanian',
      'iso639v1': 'lt'
    },
    {
      'de': 'Luxemburgisch',
      'en': 'Luxembourgish; Letzeburgesch',
      'iso639v1': 'lb'
    },
    {
      'de': 'Luba-Katanga-Sprache',
      'en': 'Luba-Katanga',
      'iso639v1': 'lu'
    },
    {
      'de': 'Ganda-Sprache',
      'en': 'Ganda',
      'iso639v1': 'lg'
    },
    {
      'de': 'Makedonisch',
      'en': 'Macedonian',
      'iso639v1': 'mk'
    },
    {
      'de': 'Makedonisch',
      'en': 'Macedonian',
      'iso639v1': 'mk'
    },
    {
      'de': 'Marschallesisch',
      'en': 'Marshallese',
      'iso639v1': 'mh'
    },
    {
      'de': 'Malayalam',
      'en': 'Malayalam',
      'iso639v1': 'ml'
    },
    {
      'de': 'Maori-Sprache',
      'en': 'Maori',
      'iso639v1': 'mi'
    },
    {
      'de': 'Maori-Sprache',
      'en': 'Maori',
      'iso639v1': 'mi'
    },
    {
      'de': 'Marathi',
      'en': 'Marathi',
      'iso639v1': 'mr'
    },
    {
      'de': 'Malaiisch',
      'en': 'Malay',
      'iso639v1': 'ms'
    },
    {
      'de': 'Malaiisch',
      'en': 'Malay',
      'iso639v1': 'ms'
    },
    {
      'de': 'Makedonisch',
      'en': 'Macedonian',
      'iso639v1': 'mk'
    },
    {
      'de': 'Makedonisch',
      'en': 'Macedonian',
      'iso639v1': 'mk'
    },
    {
      'de': 'Malagassi-Sprache',
      'en': 'Malagasy',
      'iso639v1': 'mg'
    },
    {
      'de': 'Maltesisch',
      'en': 'Maltese',
      'iso639v1': 'mt'
    },
    {
      'de': 'Mongolisch',
      'en': 'Mongolian',
      'iso639v1': 'mn'
    },
    {
      'de': 'Maori-Sprache',
      'en': 'Maori',
      'iso639v1': 'mi'
    },
    {
      'de': 'Maori-Sprache',
      'en': 'Maori',
      'iso639v1': 'mi'
    },
    {
      'de': 'Malaiisch',
      'en': 'Malay',
      'iso639v1': 'ms'
    },
    {
      'de': 'Malaiisch',
      'en': 'Malay',
      'iso639v1': 'ms'
    },
    {
      'de': 'Birmanisch',
      'en': 'Burmese',
      'iso639v1': 'my'
    },
    {
      'de': 'Nauruanisch',
      'en': 'Nauru',
      'iso639v1': 'na'
    },
    {
      'de': 'Navajo-Sprache',
      'en': 'Navajo; Navaho',
      'iso639v1': 'nv'
    },
    {
      'de': 'Ndebele-Sprache (Transvaal)',
      'en': 'Ndebele, South; South Ndebele',
      'iso639v1': 'nr'
    },
    {
      'de': 'Ndebele-Sprache (Simbabwe)',
      'en': 'Ndebele, North; North Ndebele',
      'iso639v1': 'nd'
    },
    {
      'de': 'Ndonga',
      'en': 'Ndonga',
      'iso639v1': 'ng'
    },
    {
      'de': 'Nepali',
      'en': 'Nepali',
      'iso639v1': 'ne'
    },
    {
      'de': 'Niederländisch',
      'en': 'Dutch; Flemish',
      'iso639v1': 'nl'
    },
    {
      'de': 'Nynorsk',
      'en': 'Norwegian Nynorsk; Nynorsk, Norwegian',
      'iso639v1': 'nn'
    },
    {
      'de': 'Bokmål',
      'en': 'Bokmål, Norwegian; Norwegian Bokmål',
      'iso639v1': 'nb'
    },
    {
      'de': 'Norwegisch',
      'en': 'Norwegian',
      'iso639v1': 'no'
    },
    {
      'de': 'Nyanja-Sprache',
      'en': 'Chichewa; Chewa; Nyanja',
      'iso639v1': 'ny'
    },
    {
      'de': 'Okzitanisch',
      'en': 'Occitan (post 1500)',
      'iso639v1': 'oc'
    },
    {
      'de': 'Ojibwa-Sprache',
      'en': 'Ojibwa',
      'iso639v1': 'oj'
    },
    {
      'de': 'Oriya-Sprache',
      'en': 'Oriya',
      'iso639v1': 'or'
    },
    {
      'de': 'Galla-Sprache',
      'en': 'Oromo',
      'iso639v1': 'om'
    },
    {
      'de': 'Ossetisch',
      'en': 'Ossetian; Ossetic',
      'iso639v1': 'os'
    },
    {
      'de': 'Pandschabi-Sprache',
      'en': 'Panjabi; Punjabi',
      'iso639v1': 'pa'
    },
    {
      'de': 'Persisch',
      'en': 'Persian',
      'iso639v1': 'fa'
    },
    {
      'de': 'Pali',
      'en': 'Pali',
      'iso639v1': 'pi'
    },
    {
      'de': 'Polnisch',
      'en': 'Polish',
      'iso639v1': 'pl'
    },
    {
      'de': 'Portugiesisch',
      'en': 'Portuguese',
      'iso639v1': 'pt'
    },
    {
      'de': 'Paschtu',
      'en': 'Pushto; Pashto',
      'iso639v1': 'ps'
    },
    {
      'de': 'Quechua-Sprache',
      'en': 'Quechua',
      'iso639v1': 'qu'
    },
    {
      'de': 'Rätoromanisch',
      'en': 'Romansh',
      'iso639v1': 'rm'
    },
    {
      'de': 'Rumänisch',
      'en': 'Romanian; Moldavian; Moldovan',
      'iso639v1': 'ro'
    },
    {
      'de': 'Rumänisch',
      'en': 'Romanian; Moldavian; Moldovan',
      'iso639v1': 'ro'
    },
    {
      'de': 'Rundi-Sprache',
      'en': 'Rundi',
      'iso639v1': 'rn'
    },
    {
      'de': 'Russisch',
      'en': 'Russian',
      'iso639v1': 'ru'
    },
    {
      'de': 'Sango-Sprache',
      'en': 'Sango',
      'iso639v1': 'sg'
    },
    {
      'de': 'Sanskrit',
      'en': 'Sanskrit',
      'iso639v1': 'sa'
    },
    {
      'de': 'Singhalesisch',
      'en': 'Sinhala; Sinhalese',
      'iso639v1': 'si'
    },
    {
      'de': 'Slowakisch',
      'en': 'Slovak',
      'iso639v1': 'sk'
    },
    {
      'de': 'Slowakisch',
      'en': 'Slovak',
      'iso639v1': 'sk'
    },
    {
      'de': 'Slowenisch',
      'en': 'Slovenian',
      'iso639v1': 'sl'
    },
    {
      'de': 'Nordsaamisch',
      'en': 'Northern Sami',
      'iso639v1': 'se'
    },
    {
      'de': 'Samoanisch',
      'en': 'Samoan',
      'iso639v1': 'sm'
    },
    {
      'de': 'Schona-Sprache',
      'en': 'Shona',
      'iso639v1': 'sn'
    },
    {
      'de': 'Sindhi-Sprache',
      'en': 'Sindhi',
      'iso639v1': 'sd'
    },
    {
      'de': 'Somali',
      'en': 'Somali',
      'iso639v1': 'so'
    },
    {
      'de': 'Süd-Sotho-Sprache',
      'en': 'Sotho, Southern',
      'iso639v1': 'st'
    },
    {
      'de': 'Spanisch',
      'en': 'Spanish; Castilian',
      'iso639v1': 'es'
    },
    {
      'de': 'Albanisch',
      'en': 'Albanian',
      'iso639v1': 'sq'
    },
    {
      'de': 'Sardisch',
      'en': 'Sardinian',
      'iso639v1': 'sc'
    },
    {
      'de': 'Serbisch ',
      'en': 'Serbian',
      'iso639v1': 'sr'
    },
    {
      'de': 'Swasi-Sprache',
      'en': 'Swati',
      'iso639v1': 'ss'
    },
    {
      'de': 'Sundanesisch',
      'en': 'Sundanese',
      'iso639v1': 'su'
    },
    {
      'de': 'Swahili',
      'en': 'Swahili',
      'iso639v1': 'sw'
    },
    {
      'de': 'Schwedisch',
      'en': 'Swedish',
      'iso639v1': 'sv'
    },
    {
      'de': 'Tahitisch',
      'en': 'Tahitian',
      'iso639v1': 'ty'
    },
    {
      'de': 'Tamil',
      'en': 'Tamil',
      'iso639v1': 'ta'
    },
    {
      'de': 'Tatarisch',
      'en': 'Tatar',
      'iso639v1': 'tt'
    },
    {
      'de': 'Telugu-Sprache',
      'en': 'Telugu',
      'iso639v1': 'te'
    },
    {
      'de': 'Tadschikisch',
      'en': 'Tajik',
      'iso639v1': 'tg'
    },
    {
      'de': 'Tagalog',
      'en': 'Tagalog',
      'iso639v1': 'tl'
    },
    {
      'de': 'Thailändisch',
      'en': 'Thai',
      'iso639v1': 'th'
    },
    {
      'de': 'Tibetisch',
      'en': 'Tibetan',
      'iso639v1': 'bo'
    },
    {
      'de': 'Tigrinja-Sprache',
      'en': 'Tigrinya',
      'iso639v1': 'ti'
    },
    {
      'de': 'Tongaisch',
      'en': 'Tonga (Tonga Islands)',
      'iso639v1': 'to'
    },
    {
      'de': 'Tswana-Sprache',
      'en': 'Tswana',
      'iso639v1': 'tn'
    },
    {
      'de': 'Tsonga-Sprache',
      'en': 'Tsonga',
      'iso639v1': 'ts'
    },
    {
      'de': 'Turkmenisch',
      'en': 'Turkmen',
      'iso639v1': 'tk'
    },
    {
      'de': 'Türkisch',
      'en': 'Turkish',
      'iso639v1': 'tr'
    },
    {
      'de': 'Twi-Sprache',
      'en': 'Twi',
      'iso639v1': 'tw'
    },
    {
      'de': 'Uigurisch',
      'en': 'Uighur; Uyghur',
      'iso639v1': 'ug'
    },
    {
      'de': 'Ukrainisch',
      'en': 'Ukrainian',
      'iso639v1': 'uk'
    },
    {
      'de': 'Urdu',
      'en': 'Urdu',
      'iso639v1': 'ur'
    },
    {
      'de': 'Usbekisch',
      'en': 'Uzbek',
      'iso639v1': 'uz'
    },
    {
      'de': 'Venda-Sprache',
      'en': 'Venda',
      'iso639v1': 've'
    },
    {
      'de': 'Vietnamesisch',
      'en': 'Vietnamese',
      'iso639v1': 'vi'
    },
    {
      'de': 'Volapük',
      'en': 'Volapük',
      'iso639v1': 'vo'
    },
    {
      'de': 'Kymrisch',
      'en': 'Welsh',
      'iso639v1': 'cy'
    },
    {
      'de': 'Wallonisch',
      'en': 'Walloon',
      'iso639v1': 'wa'
    },
    {
      'de': 'Wolof-Sprache',
      'en': 'Wolof',
      'iso639v1': 'wo'
    },
    {
      'de': 'Xhosa-Sprache',
      'en': 'Xhosa',
      'iso639v1': 'xh'
    },
    {
      'de': 'Jiddisch',
      'en': 'Yiddish',
      'iso639v1': 'yi'
    },
    {
      'de': 'Yoruba-Sprache',
      'en': 'Yoruba',
      'iso639v1': 'yo'
    },
    {
      'de': 'Zhuang',
      'en': 'Zhuang; Chuang',
      'iso639v1': 'za'
    },
    {
      'de': 'Chinesisch',
      'en': 'Chinese',
      'iso639v1': 'zh'
    },
    {
      'de': 'Zulu-Sprache',
      'en': 'Zulu',
      'iso639v1': 'zu'
    }
  ]
}

