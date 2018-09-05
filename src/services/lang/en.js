export default {
  headlines: {
    dashboard: 'Dashboard',
    todos: 'Todos',
    organisations: 'Actor | Actors',
    events: 'Event | Events',
    location: 'Location',
    contact: 'Contact Info',
    annotations: 'Annotation | Annotations',
    search: 'Search',
    searchPlaceholder: 'search for',
    categories: 'Category | Categories',
    categoriesDresden: 'Dresden',
    categoriesLeipzig: 'Leipzig',
    categoriesBautzen: 'Bautzen',
    logout: 'Logout',
    new: 'New',
    newest: 'New',
    edit: 'Edit',
    show: 'Show',
    contactNew: 'Add Contact',
    contactEdit: 'Edit Contact',
    status: 'Status',
    time: 'Time',
    parentOrga: 'Parent Organization',
    subOrgas: 'Sub Organizations',
    organizer: 'Organizer',
    upcomingEvents: 'Upcoming Events',
    upcomingEventsShort: 'Upcoming',
    pastEvents: 'Past Events',
    pastEventsShort: 'Past',
    systemLanguage: 'Language',
    preview: 'Preview',
    support_wanted: 'Support wanted',
    translations: 'Translations',
    usersettings: 'My Account',
    spokenLanguages: 'Spoken Language | Spoken Languages',
    tags: 'Tags',
    chapters: 'Wiki',
    singleChapter: 'Chapter',
    facetItemAssociate: 'Associate',
    navigation: 'Navigation',
    newFromActor: 'Convert Actor to Offer'
  },
  facets: {
    ownerTypeOrga: 'Actor',
    ownerTypeOffer: 'Offer',
    ownerTypeEvent: 'Event'
  },
  offers: {
    offer: 'Offer | Offers',
    newOffer: 'New Offer'
  },
  tabs: {
    general: 'General',
    annotations: 'Annotations',
    contactTab: 'Contact',
    networkMembers: 'Network Members',
    projects: 'Projects',
    events: 'Events',
    upcomingEvents: 'Upcoming',
    pastEvents: 'Past',
    resources: 'Resources',
    offers: 'Offers',
    todos: 'Todos',
    overview: 'Overview',
    attributes: 'Attributes'
  },
  orgaTypes: {
    '2': {
      name: 'Organization',
      description: 'Description for Organization @todo'
    },
    '3': {
      name: 'Project',
      description: 'Description for Project @todo'
    },
    '4': {
      name: 'Location',
      description: 'Description for Location @todo'
    },
    '5': {
      name: 'Network',
      description: 'Description for Network @todo'
    }
  },
  errors: {
    noContactPresent: 'No contact information present',
    noLocationPresent: 'No location information present',
    noAnnotationPresent: 'No annotation present',
    noLinksPresent: 'No links present',
    noParentOrgaPresent: 'No parent organizations present',
    noSubOrgaPresent: 'No sub organizations present',
    noEventsForOrga: 'No events for organiszation present',
    loadingImageError: 'Error loading image. Please adjust the image URL:',
    loadingEntryError: 'Error loading entry',
    loadingOfferError: 'Error loading offer',
    loadingDataError: 'Error loading data',
    loadingNavigationError: 'Error loading navigation',
    loadingNavigationItemError: 'Error loading navigation item',
    loadingCategoryError: 'Error loading category'
  },
  entries: {
    date_start: 'Start date',
    date_end: 'End Date',
    time_start: 'Start time',
    time_end: 'End time',
    date: 'Date',
    title: 'Title',
    image_link: 'Image link',
    description: 'Description',
    active: 'Active',
    created_at: 'Created at',
    updated_at: 'Updated at',
    state_changed_at: 'Status Changed at',
    category: 'Category',
    sub_category: 'Subcategory',
    geo_coordinates: 'Geocoordinates',
    address: 'Address',
    lat: 'Lattitude',
    lon: 'Longitude',
    street: 'Street',
    city: 'City',
    placename: 'Placename',
    person: 'Contact Person',
    mail: 'Email',
    phone: 'Phone number',
    openingHours: 'Opening hours',
    web: 'Webpage',
    socialMedia: 'Social Media',
    directions: 'Directions',
    short_description: 'Short description',
    support_wanted: 'Support',
    support_wanted_yes: 'Wanted',
    support_wanted_no: 'Not wanted',
    support_wanted_detail: 'Description of Support',
    certified_sfr: 'Certified by Sächsischer Flüchtlingsrat',
    certified_sfr_yes: 'Certified',
    certified_sfr_no: 'Not certified',
    tags: 'Tag | Tags',
    additionally_informations: 'Additionally informations from parent entry',
    media_url: 'url to image',
    id: 'ID'
  },
  type: {
    orgas: 'Actor',
    offers: 'Offer',
    events: 'Event'
  },
  usersettings: {
    first_name: 'First name',
    last_name: 'Last name',
    organization: 'Organization'
  },
  status: {
    load_event: 'Load event',
    load_orga: 'Load orga',
    load_offer: 'Load offer',
    load_data: 'Load data',
    load_navigation: 'Load navigation',
    load_navigation_item: 'Load navigation item',
    load_categories: 'Load categories',
    load_category: 'Load category',
    no: 'No',
    all: 'All',
    any: 'Any',
    added: 'Added on',
    changed: 'Last change on',
    time: 'Time',
    searching: 'Looking for Entries',
    noResults: '0 Entries'
  },
  pagination: {
    entries: 'Entry | Entries',
    page: 'Page',
    of: 'of',
    per_page: 'per page',
    set_page_size: 'set page size'
  },
  buttons: {
    activate: 'Publish',
    deactivate: 'Unpublish',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    cancel: 'Cancel'
  },
  infos: {
    mandatory_field: 'mandatory',
    no_category: 'No category existing',
    no_subcategory: 'No subcategory existing',
    search_field: 'search on field'
  },
  languages: {
    de: 'German',
    en: 'English',
    test: '*'
  },
  hints: {
    edit_annotations: 'You can add and delete annotations if you edit the entry.',
    annotation_detail: 'Click to enter detailed information',
    user_status: 'Shows the name of the current user.',
    area_status: 'Shows the associated area of the current user.'
  },
  messages: {
    loading: 'Loading'
  },
  multiselect: {
    selectLabel: 'Press enter to select',
    selectedLabel: 'Selected',
    deselectLabel: 'Press enter to remove',
    noResult: 'No elements found. Consider changing the search query.',
    noSelection: 'Nothing selected',
    addTag: 'Add Tag',
    selectOrga: 'Please select an organization',
    selectChapter: 'Please select a chapter'
  },
  tinymce: {
    insertOrga: 'Add Actor link',
    insertChapter: 'Add Chapter link',
    insertOrgaTooltip: 'This button makes the current text selection to an actual link to the Actor',
    noSelectionTitle: 'Error while adding Actor',
    noSelectionDescription: 'There is no text selected.'
  },
  categories: {
    'asylum-counselling': 'Migration counselling',
    'authority': 'Authorities',
    'childcare': 'Child care',
    'christian': 'Christian Community',
    'clothes': 'Clothes',
    'community': 'Community',
    'congress': 'Conferences + Fairs',
    'consultation': 'Consultation',
    'cooking': 'Cooking',
    'craft-art': 'Craft + Art',
    'donation': 'Donations',
    'education-counselling': 'Education counselling',
    'education-sponsorship': 'Education sponsorship',
    'eventseries': 'Series of Events',
    'external-event': 'integrierte Daten',
    'family-counselling': 'Family counselling',
    'fb-event': 'facebook Event',
    'festival': 'Festival',
    'film': 'Movies',
    'food': 'Food',
    'foreign-language': 'Foreign languages',
    'furniture': 'Furniture',
    'gardening': 'Gardening',
    'general': 'General',
    'german-course': 'Free German course (Deutschkurs)',
    'german-course-state': 'Official German course (Deutschkurs)',
    'hospital': 'Hospital',
    'housing-project': 'Housing projects',
    'interpreter': 'Interpreters + Translators',
    'islam': 'Islamic Community',
    'iwgr': 'The International Weeks against Racial Discrimination',
    'jewish': 'Jewish Community',
    'job-counselling': 'Job counselling',
    'jobs': 'Jobs + Education',
    'language': 'Language',
    'learning-place': 'Learning place',
    'lecture': 'Lecture',
    'legal-advice': 'Legal advice',
    'leisure': 'Leisure',
    'lgbt': 'LGBT',
    'library': 'Library',
    'medic': 'Health care',
    'medical-care': 'Medical care',
    'medical-counselling': 'Medical counselling',
    'meet-and-speak': 'Meet & Speak',
    'meeting-place': 'Meeting point',
    'museum': 'Museum',
    'music': 'Music',
    'nature': 'Parks + Gardens',
    'other': 'Other',
    'police': 'Police',
    'political-education': 'Political education',
    'psychological-counselling': 'Psychological counselling',
    'public-transport': 'Public transport',
    'religious-other': 'Religious institution',
    'shop': 'Intercultural shop',
    'social-counselling': 'Social counselling',
    'sponsorship': 'Sponsorship',
    'sports': 'Sports',
    'stage': 'Stage',
    'swimming': 'Swimming',
    'tandem': 'Tandem',
    'tram': 'Tram',
    'volunteer-coordination': 'Volunteers\' coordination',
    'welcome-network': 'Welcoming organisations',
    'wifi': 'Free WIFI',
    'women-counselling': 'Women counselling',
    'workshop': 'Workshop',
    'workspace': 'Rooms + Workplaces',
    'youth-club': 'Youth club',

    // LEIPZIG
    'hotspots': 'Hotspots',
    'social-advice': 'Social Advice',
    'advice-and-support': 'Rat und Begleitung',
    'buddy-programme': 'Patenschaften',
    'daily-life': 'Daily Life',
    'family': 'Family, Children & Co',
    'health': 'Health',
    'housing': 'Housing',
    'kita-and-school': 'Kindergarden and School',
    'learning-german': 'Learning German',
    'living-in-leipzig': 'Living in Leipzig',
    'mobility': 'Mobility',
    'participate': 'Participate',
    'religion': 'Religion',
    'work-and-education': 'Work and Education',
    'work-learn-study': 'Arbeit, Ausbildung, Studium'
  }
}
