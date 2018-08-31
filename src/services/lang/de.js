export default {
  headlines: {
    dashboard: 'Übersicht',
    todos: 'Aufgaben',
    organisations: 'Akteur | Akteure',
    events: 'Veranstaltung | Veranstaltungen',
    location: 'Ort',
    contact: 'Kontakt',
    annotations: 'Anmerkung | Anmerkungen',
    search: 'Suche',
    searchPlaceholder: 'Suche nach',
    categories: 'Kategorie | Kategorien',
    categoriesDresden: 'Dresden',
    categoriesLeipzig: 'Leipzig',
    categoriesBautzen: 'Bautzen',
    logout: 'Logout',
    new: 'Neu',
    edit: 'Ändern',
    show: 'Anzeigen',
    contactNew: 'Kontakt hinzufügen',
    contactEdit: 'Kontakt ändern',
    status: 'Status',
    time: 'Zeit',
    parentOrga: 'Übergeordnete Orga',
    subOrgas: 'Untergeordnete Orgas',
    organizer: 'Veranstaltende',
    upcomingEvents: 'Kommende Veranstaltungen',
    upcomingEventsShort: 'Kommende',
    pastEvents: 'Vergangene Veranstaltungen',
    pastEventsShort: 'Vergangene',
    systemLanguage: 'Sprache',
    preview: 'Vorschau',
    support_wanted: 'Unterstützung wird benötigt',
    translations: 'Übersetzungen',
    usersettings: 'Meine Einstellungen',
    spokenLanguages: 'Gesprochene Sprache | Gesprochene Sprachen',
    tags: 'Tags',
    chapters: 'Wissensportal',
    singleChapter: 'Kapitel',
    facetItemAssociate: 'Zuordnen',
    navigation: 'Navigation'
  },
  facets: {
    ownerTypeOrga: 'Akteur',
    ownerTypeOffer: 'Angebot',
    ownerTypeEvent: 'Veranstaltung'
  },
  offers: {
    offer: 'Angebot | Angebote',
    newOffer: 'Neues Angebot'
  },
  tabs: {
    general: 'Allgemeines',
    annotations: 'Anmerkungen',
    contactTab: 'Kontakt',
    networkMembers: 'Netzwerkmitglieder',
    projects: 'Projekte',
    events: 'Veranstaltungen',
    upcomingEvents: 'Kommende',
    pastEvents: 'Vergangene',
    resources: 'Ressourcen',
    offers: 'Angebote',
    todos: 'Aufgaben',
    overview: 'Übersicht',
    attributes: 'Attribute'
  },
  orgaTypes: {
    '2': {
      name: 'Organisation',
      description: 'Organisationen bilden Vereine und Zusammenschlüsse in der Realität ab.'
    },
    '3': {
      name: 'Projekt',
      description: 'Projekte sind kleinere Einheiten und immer Teil einer Organisation. Dabei können sie zu mehreren Organisationen hinzugefügt werden.'
    },
    '4': {
      name: 'Ort',
      description: 'Der Typ "Ort" befindet sich noch in der Entwicklung. Langfristig sollen damit reele Orte abgebildet werden.'
    },
    '5': {
      name: 'Netzwerk',
      description: 'Mit Netzwerken werden komplexere Strukturen, bestehende aus Organisationen, abgebildet. Ein Netzwerk hat immer einen Träger und beliebig viele Teilnehmer.'
    }
  },
  errors: {
    noContactPresent: 'Keine Kontaktinformationen vorhanden',
    noLocationPresent: 'Keine Ortsinformation vorhanden',
    noAnnotationPresent: 'Keine Annoation vorhanden',
    noLinksPresent: 'Keine Zugehörigkeiten vorhanden',
    noParentOrgaPresent: 'Keine übergeordnete Orga vorhanden',
    noSubOrgaPresent: 'Keine untergeordneten Orgas vorhanden',
    noEventsForOrga: 'Keine Events zu dieser Orga vorhanden',
    loadingImageError: 'Fehler beim Laden des Bildes. Bitte URL anpassen:',
    loadingEntryError: 'Fehler beim Laden des Eintrags',
    loadingOfferError: 'Fehler beim Laden des Angebots',
    loadingDataError: 'Fehler beim Laden von Daten',
    loadingNavigationError: 'Fehler beim Laden der Navigation',
    loadingNavigationItemError: 'Fehler beim Laden des Menüpunktes',
    loadingCategoryError: 'Fehler beim Laden der Kategorie'
  },
  entries: {
    date_start: 'Startdatum',
    date_end: 'Enddatum',
    time_start: 'Startzeit',
    time_end: 'Endzeit',
    date: 'Datum',
    title: 'Titel',
    image_link: 'Link zum Bild',
    description: 'Beschreibung',
    active: 'Aktiv',
    created_at: 'Erstellt',
    updated_at: 'Geändert',
    state_changed_at: 'Aktiviert',
    category: 'Kategorie',
    sub_category: 'Unterkategorie',
    geo_coordinates: 'Geokoordinaten',
    address: 'Adresse',
    lat: 'Breitengrad',
    lon: 'Längengrad',
    street: 'Straße',
    city: 'Stadt',
    placename: 'Ortsbezeichnung',
    person: 'Ansprechpartner*in',
    mail: 'Email',
    phone: 'Telefonnummer',
    openingHours: 'Öffnungszeiten',
    web: 'Homepage',
    socialMedia: 'Social Media',
    directions: 'Anfahrtsweg',
    short_description: 'Kurze Beschreibung',
    support_wanted: 'Unterstützung',
    support_wanted_yes: 'Wird benötigt',
    support_wanted_no: 'Wird nicht benötigt',
    support_wanted_detail: 'Beschreibung der benötigten Unterstützung',
    certified_sfr: 'Zertifiziert vom Sächsischen Flüchtlingsrat',
    certified_sfr_yes: 'Zertifiziert',
    certified_sfr_no: 'Nicht zertifiziert',
    tags: 'Tag | Tags',
    additionally_informations: 'Zusätzliche Informationen vom übergeordneten Eintrag',
    media_url: 'Link zum Bild',
    id: 'ID'
  },
  usersettings: {
    first_name: 'Vorname',
    last_name: 'Nachname',
    organization: 'Organisation'
  },
  status: {
    load_event: 'Lade Event',
    load_orga: 'Lade Akteur',
    load_offer: 'Lade Angebot',
    load_data: 'Lade Daten',
    load_navigation: 'Lade Navigation',
    load_navigation_item: 'Lade Menüpunkt',
    load_categories: 'Lade Kategorien',
    load_category: 'Lade Kategorie',
    no: 'Keine',
    all: 'Alle',
    any: 'Alles',
    added: 'Hinzugefügt am',
    changed: 'Zuletzt geändert am',
    time: 'Zeitpunkt',
    searching: 'Suche Einträge',
    noResults: '0 Einträge'
  },
  pagination: {
    entries: 'Eintrag | Einträge',
    page: 'Seite',
    of: 'von',
    per_page: 'pro Seite',
    set_page_size: 'Seiteneinträge'
  },
  buttons: {
    activate: 'Veröffentlichen',
    deactivate: 'Verbergen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    search: 'Suche',
    cancel: 'Abbrechen'
  },
  infos: {
    mandatory_field: 'Pflichtfeld',
    no_category: 'Keine Kategorie angegeben',
    no_subcategory: 'Keine Unterkategorie angegeben',
    search_field: 'Suche im Feld'
  },
  languages: {
    de: 'Deutsch',
    en: 'Englisch',
    test: '*'
  },
  hints: {
    edit_annotations: 'Durch das Bearbeiten des Eintrags können Anmerkungen entfernt und hinzugefügt werden.',
    annotation_detail: 'Klicken um Beschreibung anzugeben',
    user_status: 'Der Name der aktuell eingeloggten Nutzer:in.',
    area_status: 'Zeigt dir zugeordnete Region der eingeloggten Nutzer:in.'
  },
  messages: {
    loading: 'Lädt'
  },
  multiselect: {
    selectLabel: 'Zur Auswahl Enter drücken',
    selectedLabel: 'Ausgewählt',
    deselectLabel: 'Zum Entfernen Enter drücken',
    noResult: 'Keine Einträge gefunden. Bitte Suchanfrage ändern.',
    noSelection: 'Kein Eintag ausgewählt',
    addTag: 'Tag hinzufügen',
    selectOrga: 'Bitte wähle eine Organisation aus',
    selectChapter: 'Bitte wähle ein Kapitel aus'
  },
  tinymce: {
    insertOrga: 'Akteur verknüpfen',
    insertChapter: 'Kaptiel verknüpfen',
    insertOrgaTooltip: 'Der ausgewählte Text wird in einen entsprechenden Link zum Akteur umgewandelt.',
    noSelectionTitle: 'Fehler beim Einfügen',
    noSelectionDescription: 'Du hast keinen Text ausgewählt.'
  },
  categories: {
    'asylum-counselling': 'Migrationsberatung',
    'authority': 'Behörden',
    'childcare': 'Kinderbetreuung',
    'christian': 'Christliche Gemeinschaft',
    'clothes': 'Kleidung',
    'community': 'Gemeinschaft',
    'congress': 'Kongresse + Messen',
    'consultation': 'Beratung',
    'cooking': 'Kochen',
    'craft-art': 'Handwerk + Kunst',
    'donation': 'Spenden',
    'education-counselling': 'Bildungsberatung',
    'education-sponsorship': 'Bildungsunterstützung',
    'eventseries': 'Veranstaltungsreihe',
    'external-event': 'integrierte Daten',
    'family-counselling': 'Familienberatung',
    'fb-event': 'facebook Event',
    'festival': 'Fest',
    'film': 'Film',
    'food': 'Lebensmittel',
    'foreign-language': 'Fremdsprachen',
    'furniture': 'Möbel',
    'gardening': 'Garten',
    'general': 'Allgemeines',
    'german-course': 'freier Deutschkurs',
    'german-course-state': 'staatlicher Deutschkurs',
    'hospital': 'Krankenhaus',
    'housing-project': 'Wohnprojekte',
    'interpreter': 'Übersetzer/ Dolmetscher',
    'islam': 'Islamische Gemeinschaft',
    'iwgr': 'Internationale Wochen gegen Rassismus',
    'jewish': 'Jüdische Gemeinschaft',
    'job-counselling': 'Berufsberatung',
    'jobs': 'Arbeit + Bildung',
    'language': 'Sprache',
    'learning-place': 'Lernort',
    'lecture': 'Vortrag',
    'legal-advice': 'Rechtsberatung',
    'leisure': 'Freizeit',
    'lgbt': 'LGBT',
    'library': 'Bibliothek',
    'medic': 'Gesundheit',
    'medical-care': 'Medizinische Versorgung',
    'medical-counselling': 'Medizinische Beratung',
    'meet-and-speak': 'Sprachtreff',
    'meeting-place': 'Treffpunkt',
    'museum': 'Museum',
    'music': 'Musik',
    'nature': 'Parks + Gärten',
    'other': 'Sonstige',
    'police': 'Polizei',
    'political-education': 'Politische Bildung',
    'psychological-counselling': 'Psychologische Beratung',
    'public-transport': 'Haltestelle',
    'religious-other': 'Religiöse Einrichtung',
    'shop': 'Interkultureller Einkaufsladen',
    'social-counselling': 'Sozialberatung',
    'sponsorship': 'Patenschaften',
    'sports': 'Sport',
    'stage': 'Bühne',
    'swimming': 'Schwimmen',
    'tandem': 'Tandem',
    'tram': 'Straßenbahn',
    'volunteer-coordination': 'Ehrenamtskoordination',
    'welcome-network': 'Willkommensbündnis',
    'wifi': 'Kostenloses WLAN',
    'women-counselling': 'Frauenberatung',
    'workshop': 'Workshop',
    'workspace': 'Räume + Werkstätten',
    'youth-club': 'Jugendtreff',

    // LEIPZIG
    'hotspots': 'Hot Spots',
    'social-advice': 'Sozialberatung',
    'advice-and-support': 'Rat und Begleitung',
    'buddy-programme': 'Patenschaften',
    'daily-life': 'Alltag',
    'family': 'Kinder, Familie & Co',
    'health': 'Gesundheit',
    'housing': 'Wohnen',
    'kita-and-school': 'Kindergarten und Schule',
    'learning-german': 'Deutsch lernen',
    'living-in-leipzig': 'Leben in Leipzig',
    'mobility': 'Mobil sein',
    'participate': 'Mitwirken und sich einmischen',
    'religion': 'Religion',
    'work-and-education': 'Bildung + Arbeit',
    'work-learn-study': 'Arbeit, Ausbildung, Studium'
  }
}
