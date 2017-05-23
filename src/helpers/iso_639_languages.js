export default {
  getLanguageFromCode: function (isoCode) {
    let obj = this.data.find(x => x.iso639v1 === isoCode)
    if (!obj) {
      throw new Error(`Unknown ISO 639 Code: ${isoCode}`)
    }
    return obj
  },
  data: [
    {
      'german': 'Danakil-Sprache',
      'english': 'Afar',
      'iso639v1': 'aa'
    },
    {
      'german': 'Abchasisch',
      'english': 'Abkhazian',
      'iso639v1': 'ab'
    },
    {
      'german': 'Afrikaans',
      'english': 'Afrikaans',
      'iso639v1': 'af'
    },
    {
      'german': 'Akan-Sprache',
      'english': 'Akan',
      'iso639v1': 'ak'
    },
    {
      'german': 'Albanisch',
      'english': 'Albanian',
      'iso639v1': 'sq'
    },
    {
      'german': 'Albanisch',
      'english': 'Albanian',
      'iso639v1': 'sq'
    },
    {
      'german': 'Amharisch',
      'english': 'Amharic',
      'iso639v1': 'am'
    },
    {
      'german': 'Arabisch',
      'english': 'Arabic',
      'iso639v1': 'ar'
    },
    {
      'german': 'Aragonesisch',
      'english': 'Aragonese',
      'iso639v1': 'an'
    },
    {
      'german': 'Armenisch',
      'english': 'Armenian',
      'iso639v1': 'hy'
    },
    {
      'german': 'Assamesisch',
      'english': 'Assamese',
      'iso639v1': 'as'
    },
    {
      'german': 'Awarisch',
      'english': 'Avaric',
      'iso639v1': 'av'
    },
    {
      'german': 'Avestisch',
      'english': 'Avestan',
      'iso639v1': 'ae'
    },
    {
      'german': 'Aymará-Sprache',
      'english': 'Aymara',
      'iso639v1': 'ay'
    },
    {
      'german': 'Aserbeidschanisch',
      'english': 'Azerbaijani',
      'iso639v1': 'az'
    },
    {
      'german': 'Baschkirisch',
      'english': 'Bashkir',
      'iso639v1': 'ba'
    },
    {
      'german': 'Bambara-Sprache',
      'english': 'Bambara',
      'iso639v1': 'bm'
    },
    {
      'german': 'Weißrussisch',
      'english': 'Belarusian',
      'iso639v1': 'be'
    },
    {
      'german': 'Bengali',
      'english': 'Bengali',
      'iso639v1': 'bn'
    },
    {
      'german': 'Bihari (Andere)',
      'english': 'Bihari languages',
      'iso639v1': 'bh'
    },
    {
      'german': 'Beach-la-mar',
      'english': 'Bislama',
      'iso639v1': 'bi'
    },
    {
      'german': 'Tibetisch',
      'english': 'Tibetan',
      'iso639v1': 'bo'
    },
    {
      'german': 'Bosnisch',
      'english': 'Bosnian',
      'iso639v1': 'bs'
    },
    {
      'german': 'Bretonisch',
      'english': 'Breton',
      'iso639v1': 'br'
    },
    {
      'german': 'Bulgarisch',
      'english': 'Bulgarian',
      'iso639v1': 'bg'
    },
    {
      'german': 'Birmanisch',
      'english': 'Burmese',
      'iso639v1': 'my'
    },
    {
      'german': 'Katalanisch',
      'english': 'Catalan; Valencian',
      'iso639v1': 'ca'
    },
    {
      'german': 'Chamorro-Sprache',
      'english': 'Chamorro',
      'iso639v1': 'ch'
    },
    {
      'german': 'Tschetschenisch',
      'english': 'Chechen',
      'iso639v1': 'ce'
    },
    {
      'german': 'Chinesisch',
      'english': 'Chinese',
      'iso639v1': 'zh'
    },
    {
      'german': 'Kirchenslawisch',
      'english': 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic',
      'iso639v1': 'cu'
    },
    {
      'german': 'Tschuwaschisch',
      'english': 'Chuvash',
      'iso639v1': 'cv'
    },
    {
      'german': 'Kornisch',
      'english': 'Cornish',
      'iso639v1': 'kw'
    },
    {
      'german': 'Korsisch',
      'english': 'Corsican',
      'iso639v1': 'co'
    },
    {
      'german': 'Cree-Sprache',
      'english': 'Cree',
      'iso639v1': 'cr'
    },
    {
      'german': 'Kymrisch',
      'english': 'Welsh',
      'iso639v1': 'cy'
    },
    {
      'german': 'Tschechisch',
      'english': 'Czech',
      'iso639v1': 'cs'
    },
    {
      'german': 'Tschechisch',
      'english': 'Czech',
      'iso639v1': 'cs'
    },
    {
      'german': 'Dänisch',
      'english': 'Danish',
      'iso639v1': 'da'
    },
    {
      'german': 'Deutsch',
      'english': 'German',
      'iso639v1': 'de'
    },
    {
      'german': 'Maledivisch',
      'english': 'Divehi; Dhivehi; Maldivian',
      'iso639v1': 'dv'
    },
    {
      'german': 'Niederländisch',
      'english': 'Dutch; Flemish',
      'iso639v1': 'nl'
    },
    {
      'german': 'Dzongkha',
      'english': 'Dzongkha',
      'iso639v1': 'dz'
    },
    {
      'german': 'Neugriechisch',
      'english': 'Greek, Modern (1453-)',
      'iso639v1': 'el'
    },
    {
      'german': 'Englisch',
      'english': 'English',
      'iso639v1': 'en'
    },
    {
      'german': 'Esperanto',
      'english': 'Esperanto',
      'iso639v1': 'eo'
    },
    {
      'german': 'Estnisch',
      'english': 'Estonian',
      'iso639v1': 'et'
    },
    {
      'german': 'Ewe-Sprache',
      'english': 'Ewe',
      'iso639v1': 'ee'
    },
    {
      'german': 'Färöisch',
      'english': 'Faroese',
      'iso639v1': 'fo'
    },
    {
      'german': 'Persisch',
      'english': 'Persian',
      'iso639v1': 'fa'
    },
    {
      'german': 'Fidschi-Sprache',
      'english': 'Fijian',
      'iso639v1': 'fj'
    },
    {
      'german': 'Finnisch',
      'english': 'Finnish',
      'iso639v1': 'fi'
    },
    {
      'german': 'Französisch',
      'english': 'French',
      'iso639v1': 'fr'
    },
    {
      'german': 'Französisch',
      'english': 'French',
      'iso639v1': 'fr'
    },
    {
      'german': 'Friesisch',
      'english': 'Western Frisian',
      'iso639v1': 'fy'
    },
    {
      'german': 'Ful',
      'english': 'Fulah',
      'iso639v1': 'ff'
    },
    {
      'german': 'Georgisch',
      'english': 'Georgian',
      'iso639v1': 'ka'
    },
    {
      'german': 'Deutsch',
      'english': 'German',
      'iso639v1': 'de'
    },
    {
      'german': 'Gälisch-Schottisch',
      'english': 'Gaelic; Scottish Gaelic',
      'iso639v1': 'gd'
    },
    {
      'german': 'Irisch',
      'english': 'Irish',
      'iso639v1': 'ga'
    },
    {
      'german': 'Galicisch',
      'english': 'Galician',
      'iso639v1': 'gl'
    },
    {
      'german': 'Manx',
      'english': 'Manx',
      'iso639v1': 'gv'
    },
    {
      'german': 'Neugriechisch',
      'english': 'Greek, Modern (1453-)',
      'iso639v1': 'el'
    },
    {
      'german': 'Guaraní-Sprache',
      'english': 'Guarani',
      'iso639v1': 'gn'
    },
    {
      'german': 'Gujarati-Sprache',
      'english': 'Gujarati',
      'iso639v1': 'gu'
    },
    {
      'german': 'Haïtien (Haiti-Kreolisch)',
      'english': 'Haitian; Haitian Creole',
      'iso639v1': 'ht'
    },
    {
      'german': 'Haussa-Sprache',
      'english': 'Hausa',
      'iso639v1': 'ha'
    },
    {
      'german': 'Hebräisch',
      'english': 'Hebrew',
      'iso639v1': 'he'
    },
    {
      'german': 'Herero-Sprache',
      'english': 'Herero',
      'iso639v1': 'hz'
    },
    {
      'german': 'Hindi',
      'english': 'Hindi',
      'iso639v1': 'hi'
    },
    {
      'german': 'Hiri-Motu',
      'english': 'Hiri Motu',
      'iso639v1': 'ho'
    },
    {
      'german': 'Kroatisch ',
      'english': 'Croatian',
      'iso639v1': 'hr'
    },
    {
      'german': 'Ungarisch',
      'english': 'Hungarian',
      'iso639v1': 'hu'
    },
    {
      'german': 'Armenisch',
      'english': 'Armenian',
      'iso639v1': 'hy'
    },
    {
      'german': 'Ibo-Sprache',
      'english': 'Igbo',
      'iso639v1': 'ig'
    },
    {
      'german': 'Isländisch',
      'english': 'Icelandic',
      'iso639v1': 'is'
    },
    {
      'german': 'Ido',
      'english': 'Ido',
      'iso639v1': 'io'
    },
    {
      'german': 'Lalo-Sprache',
      'english': 'Sichuan Yi; Nuosu',
      'iso639v1': 'ii'
    },
    {
      'german': 'Inuktitut',
      'english': 'Inuktitut',
      'iso639v1': 'iu'
    },
    {
      'german': 'Interlingue',
      'english': 'Interlingue; Occidental',
      'iso639v1': 'ie'
    },
    {
      'german': 'Interlingua',
      'english': 'Interlingua (International Auxiliary Language Association)',
      'iso639v1': 'ia'
    },
    {
      'german': 'Bahasa Indonesia',
      'english': 'Indonesian',
      'iso639v1': 'id'
    },
    {
      'german': 'Inupik',
      'english': 'Inupiaq',
      'iso639v1': 'ik'
    },
    {
      'german': 'Isländisch',
      'english': 'Icelandic',
      'iso639v1': 'is'
    },
    {
      'german': 'Italienisch',
      'english': 'Italian',
      'iso639v1': 'it'
    },
    {
      'german': 'Javanisch',
      'english': 'Javanese',
      'iso639v1': 'jv'
    },
    {
      'german': 'Japanisch',
      'english': 'Japanese',
      'iso639v1': 'ja'
    },
    {
      'german': 'Grönländisch',
      'english': 'Kalaallisut; Greenlandic',
      'iso639v1': 'kl'
    },
    {
      'german': 'Kannada',
      'english': 'Kannada',
      'iso639v1': 'kn'
    },
    {
      'german': 'Kaschmiri',
      'english': 'Kashmiri',
      'iso639v1': 'ks'
    },
    {
      'german': 'Georgisch',
      'english': 'Georgian',
      'iso639v1': 'ka'
    },
    {
      'german': 'Kanuri-Sprache',
      'english': 'Kanuri',
      'iso639v1': 'kr'
    },
    {
      'german': 'Kasachisch',
      'english': 'Kazakh',
      'iso639v1': 'kk'
    },
    {
      'german': 'Kambodschanisch',
      'english': 'Central Khmer',
      'iso639v1': 'km'
    },
    {
      'german': 'Kikuyu-Sprache',
      'english': 'Kikuyu; Gikuyu',
      'iso639v1': 'ki'
    },
    {
      'german': 'Rwanda-Sprache',
      'english': 'Kinyarwanda',
      'iso639v1': 'rw'
    },
    {
      'german': 'Kirgisisch',
      'english': 'Kirghiz; Kyrgyz',
      'iso639v1': 'ky'
    },
    {
      'german': 'Komi-Sprache',
      'english': 'Komi',
      'iso639v1': 'kv'
    },
    {
      'german': 'Kongo-Sprache',
      'english': 'Kongo',
      'iso639v1': 'kg'
    },
    {
      'german': 'Koreanisch',
      'english': 'Korean',
      'iso639v1': 'ko'
    },
    {
      'german': 'Kwanyama-Sprache',
      'english': 'Kuanyama; Kwanyama',
      'iso639v1': 'kj'
    },
    {
      'german': 'Kurdisch',
      'english': 'Kurdish',
      'iso639v1': 'ku'
    },
    {
      'german': 'Laotisch',
      'english': 'Lao',
      'iso639v1': 'lo'
    },
    {
      'german': 'Latein',
      'english': 'Latin',
      'iso639v1': 'la'
    },
    {
      'german': 'Lettisch',
      'english': 'Latvian',
      'iso639v1': 'lv'
    },
    {
      'german': 'Limburgisch',
      'english': 'Limburgan; Limburger; Limburgish',
      'iso639v1': 'li'
    },
    {
      'german': 'Lingala',
      'english': 'Lingala',
      'iso639v1': 'ln'
    },
    {
      'german': 'Litauisch',
      'english': 'Lithuanian',
      'iso639v1': 'lt'
    },
    {
      'german': 'Luxemburgisch',
      'english': 'Luxembourgish; Letzeburgesch',
      'iso639v1': 'lb'
    },
    {
      'german': 'Luba-Katanga-Sprache',
      'english': 'Luba-Katanga',
      'iso639v1': 'lu'
    },
    {
      'german': 'Ganda-Sprache',
      'english': 'Ganda',
      'iso639v1': 'lg'
    },
    {
      'german': 'Makedonisch',
      'english': 'Macedonian',
      'iso639v1': 'mk'
    },
    {
      'german': 'Makedonisch',
      'english': 'Macedonian',
      'iso639v1': 'mk'
    },
    {
      'german': 'Marschallesisch',
      'english': 'Marshallese',
      'iso639v1': 'mh'
    },
    {
      'german': 'Malayalam',
      'english': 'Malayalam',
      'iso639v1': 'ml'
    },
    {
      'german': 'Maori-Sprache',
      'english': 'Maori',
      'iso639v1': 'mi'
    },
    {
      'german': 'Maori-Sprache',
      'english': 'Maori',
      'iso639v1': 'mi'
    },
    {
      'german': 'Marathi',
      'english': 'Marathi',
      'iso639v1': 'mr'
    },
    {
      'german': 'Malaiisch',
      'english': 'Malay',
      'iso639v1': 'ms'
    },
    {
      'german': 'Malaiisch',
      'english': 'Malay',
      'iso639v1': 'ms'
    },
    {
      'german': 'Makedonisch',
      'english': 'Macedonian',
      'iso639v1': 'mk'
    },
    {
      'german': 'Makedonisch',
      'english': 'Macedonian',
      'iso639v1': 'mk'
    },
    {
      'german': 'Malagassi-Sprache',
      'english': 'Malagasy',
      'iso639v1': 'mg'
    },
    {
      'german': 'Maltesisch',
      'english': 'Maltese',
      'iso639v1': 'mt'
    },
    {
      'german': 'Mongolisch',
      'english': 'Mongolian',
      'iso639v1': 'mn'
    },
    {
      'german': 'Maori-Sprache',
      'english': 'Maori',
      'iso639v1': 'mi'
    },
    {
      'german': 'Maori-Sprache',
      'english': 'Maori',
      'iso639v1': 'mi'
    },
    {
      'german': 'Malaiisch',
      'english': 'Malay',
      'iso639v1': 'ms'
    },
    {
      'german': 'Malaiisch',
      'english': 'Malay',
      'iso639v1': 'ms'
    },
    {
      'german': 'Birmanisch',
      'english': 'Burmese',
      'iso639v1': 'my'
    },
    {
      'german': 'Nauruanisch',
      'english': 'Nauru',
      'iso639v1': 'na'
    },
    {
      'german': 'Navajo-Sprache',
      'english': 'Navajo; Navaho',
      'iso639v1': 'nv'
    },
    {
      'german': 'Ndebele-Sprache (Transvaal)',
      'english': 'Ndebele, South; South Ndebele',
      'iso639v1': 'nr'
    },
    {
      'german': 'Ndebele-Sprache (Simbabwe)',
      'english': 'Ndebele, North; North Ndebele',
      'iso639v1': 'nd'
    },
    {
      'german': 'Ndonga',
      'english': 'Ndonga',
      'iso639v1': 'ng'
    },
    {
      'german': 'Nepali',
      'english': 'Nepali',
      'iso639v1': 'ne'
    },
    {
      'german': 'Niederländisch',
      'english': 'Dutch; Flemish',
      'iso639v1': 'nl'
    },
    {
      'german': 'Nynorsk',
      'english': 'Norwegian Nynorsk; Nynorsk, Norwegian',
      'iso639v1': 'nn'
    },
    {
      'german': 'Bokmål',
      'english': 'Bokmål, Norwegian; Norwegian Bokmål',
      'iso639v1': 'nb'
    },
    {
      'german': 'Norwegisch',
      'english': 'Norwegian',
      'iso639v1': 'no'
    },
    {
      'german': 'Nyanja-Sprache',
      'english': 'Chichewa; Chewa; Nyanja',
      'iso639v1': 'ny'
    },
    {
      'german': 'Okzitanisch',
      'english': 'Occitan (post 1500)',
      'iso639v1': 'oc'
    },
    {
      'german': 'Ojibwa-Sprache',
      'english': 'Ojibwa',
      'iso639v1': 'oj'
    },
    {
      'german': 'Oriya-Sprache',
      'english': 'Oriya',
      'iso639v1': 'or'
    },
    {
      'german': 'Galla-Sprache',
      'english': 'Oromo',
      'iso639v1': 'om'
    },
    {
      'german': 'Ossetisch',
      'english': 'Ossetian; Ossetic',
      'iso639v1': 'os'
    },
    {
      'german': 'Pandschabi-Sprache',
      'english': 'Panjabi; Punjabi',
      'iso639v1': 'pa'
    },
    {
      'german': 'Persisch',
      'english': 'Persian',
      'iso639v1': 'fa'
    },
    {
      'german': 'Pali',
      'english': 'Pali',
      'iso639v1': 'pi'
    },
    {
      'german': 'Polnisch',
      'english': 'Polish',
      'iso639v1': 'pl'
    },
    {
      'german': 'Portugiesisch',
      'english': 'Portuguese',
      'iso639v1': 'pt'
    },
    {
      'german': 'Paschtu',
      'english': 'Pushto; Pashto',
      'iso639v1': 'ps'
    },
    {
      'german': 'Quechua-Sprache',
      'english': 'Quechua',
      'iso639v1': 'qu'
    },
    {
      'german': 'Rätoromanisch',
      'english': 'Romansh',
      'iso639v1': 'rm'
    },
    {
      'german': 'Rumänisch',
      'english': 'Romanian; Moldavian; Moldovan',
      'iso639v1': 'ro'
    },
    {
      'german': 'Rumänisch',
      'english': 'Romanian; Moldavian; Moldovan',
      'iso639v1': 'ro'
    },
    {
      'german': 'Rundi-Sprache',
      'english': 'Rundi',
      'iso639v1': 'rn'
    },
    {
      'german': 'Russisch',
      'english': 'Russian',
      'iso639v1': 'ru'
    },
    {
      'german': 'Sango-Sprache',
      'english': 'Sango',
      'iso639v1': 'sg'
    },
    {
      'german': 'Sanskrit',
      'english': 'Sanskrit',
      'iso639v1': 'sa'
    },
    {
      'german': 'Singhalesisch',
      'english': 'Sinhala; Sinhalese',
      'iso639v1': 'si'
    },
    {
      'german': 'Slowakisch',
      'english': 'Slovak',
      'iso639v1': 'sk'
    },
    {
      'german': 'Slowakisch',
      'english': 'Slovak',
      'iso639v1': 'sk'
    },
    {
      'german': 'Slowenisch',
      'english': 'Slovenian',
      'iso639v1': 'sl'
    },
    {
      'german': 'Nordsaamisch',
      'english': 'Northern Sami',
      'iso639v1': 'se'
    },
    {
      'german': 'Samoanisch',
      'english': 'Samoan',
      'iso639v1': 'sm'
    },
    {
      'german': 'Schona-Sprache',
      'english': 'Shona',
      'iso639v1': 'sn'
    },
    {
      'german': 'Sindhi-Sprache',
      'english': 'Sindhi',
      'iso639v1': 'sd'
    },
    {
      'german': 'Somali',
      'english': 'Somali',
      'iso639v1': 'so'
    },
    {
      'german': 'Süd-Sotho-Sprache',
      'english': 'Sotho, Southern',
      'iso639v1': 'st'
    },
    {
      'german': 'Spanisch',
      'english': 'Spanish; Castilian',
      'iso639v1': 'es'
    },
    {
      'german': 'Albanisch',
      'english': 'Albanian',
      'iso639v1': 'sq'
    },
    {
      'german': 'Sardisch',
      'english': 'Sardinian',
      'iso639v1': 'sc'
    },
    {
      'german': 'Serbisch ',
      'english': 'Serbian',
      'iso639v1': 'sr'
    },
    {
      'german': 'Swasi-Sprache',
      'english': 'Swati',
      'iso639v1': 'ss'
    },
    {
      'german': 'Sundanesisch',
      'english': 'Sundanese',
      'iso639v1': 'su'
    },
    {
      'german': 'Swahili',
      'english': 'Swahili',
      'iso639v1': 'sw'
    },
    {
      'german': 'Schwedisch',
      'english': 'Swedish',
      'iso639v1': 'sv'
    },
    {
      'german': 'Tahitisch',
      'english': 'Tahitian',
      'iso639v1': 'ty'
    },
    {
      'german': 'Tamil',
      'english': 'Tamil',
      'iso639v1': 'ta'
    },
    {
      'german': 'Tatarisch',
      'english': 'Tatar',
      'iso639v1': 'tt'
    },
    {
      'german': 'Telugu-Sprache',
      'english': 'Telugu',
      'iso639v1': 'te'
    },
    {
      'german': 'Tadschikisch',
      'english': 'Tajik',
      'iso639v1': 'tg'
    },
    {
      'german': 'Tagalog',
      'english': 'Tagalog',
      'iso639v1': 'tl'
    },
    {
      'german': 'Thailändisch',
      'english': 'Thai',
      'iso639v1': 'th'
    },
    {
      'german': 'Tibetisch',
      'english': 'Tibetan',
      'iso639v1': 'bo'
    },
    {
      'german': 'Tigrinja-Sprache',
      'english': 'Tigrinya',
      'iso639v1': 'ti'
    },
    {
      'german': 'Tongaisch',
      'english': 'Tonga (Tonga Islands)',
      'iso639v1': 'to'
    },
    {
      'german': 'Tswana-Sprache',
      'english': 'Tswana',
      'iso639v1': 'tn'
    },
    {
      'german': 'Tsonga-Sprache',
      'english': 'Tsonga',
      'iso639v1': 'ts'
    },
    {
      'german': 'Turkmenisch',
      'english': 'Turkmen',
      'iso639v1': 'tk'
    },
    {
      'german': 'Türkisch',
      'english': 'Turkish',
      'iso639v1': 'tr'
    },
    {
      'german': 'Twi-Sprache',
      'english': 'Twi',
      'iso639v1': 'tw'
    },
    {
      'german': 'Uigurisch',
      'english': 'Uighur; Uyghur',
      'iso639v1': 'ug'
    },
    {
      'german': 'Ukrainisch',
      'english': 'Ukrainian',
      'iso639v1': 'uk'
    },
    {
      'german': 'Urdu',
      'english': 'Urdu',
      'iso639v1': 'ur'
    },
    {
      'german': 'Usbekisch',
      'english': 'Uzbek',
      'iso639v1': 'uz'
    },
    {
      'german': 'Venda-Sprache',
      'english': 'Venda',
      'iso639v1': 've'
    },
    {
      'german': 'Vietnamesisch',
      'english': 'Vietnamese',
      'iso639v1': 'vi'
    },
    {
      'german': 'Volapük',
      'english': 'Volapük',
      'iso639v1': 'vo'
    },
    {
      'german': 'Kymrisch',
      'english': 'Welsh',
      'iso639v1': 'cy'
    },
    {
      'german': 'Wallonisch',
      'english': 'Walloon',
      'iso639v1': 'wa'
    },
    {
      'german': 'Wolof-Sprache',
      'english': 'Wolof',
      'iso639v1': 'wo'
    },
    {
      'german': 'Xhosa-Sprache',
      'english': 'Xhosa',
      'iso639v1': 'xh'
    },
    {
      'german': 'Jiddisch',
      'english': 'Yiddish',
      'iso639v1': 'yi'
    },
    {
      'german': 'Yoruba-Sprache',
      'english': 'Yoruba',
      'iso639v1': 'yo'
    },
    {
      'german': 'Zhuang',
      'english': 'Zhuang; Chuang',
      'iso639v1': 'za'
    },
    {
      'german': 'Chinesisch',
      'english': 'Chinese',
      'iso639v1': 'zh'
    },
    {
      'german': 'Zulu-Sprache',
      'english': 'Zulu',
      'iso639v1': 'zu'
    }
  ]
}

