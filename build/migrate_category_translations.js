/* only for temporary use*/

var fs = require('fs');

/* values copied from phraseapp */
let enInput = {
  "button.locate": {
    "message": "Show my location"
  },
  "cat.asylum-counselling": {
    "message": "Asylum counselling"
  },
  "cat.asylum-counselling.description": {
    "message": "Assistance in issues related to asylum and migration"
  },
  "cat.authority": {
    "message": "Authorities"
  },
  "cat.authority.description": {
    "message": "Official organizations or offices"
  },
  "cat.childcare": {
    "message": "Child care"
  },
  "cat.childcare.description": {
    "message": "day-care, programs for children"
  },
  "cat.christian": {
    "message": "Christian Community"
  },
  "cat.christian.description": {
    "message": "Churches and Christian communities"
  },
  "cat.clothes": {
    "message": "Clothes"
  },
  "cat.clothes.description": {
    "message": "Places for clothing donations and distribution centers"
  },
  "cat.community": {
    "message": "Community"
  },
  "cat.community.description": {
    "message": "Social organizations and networks"
  },
  "cat.congress": {
    "message": "Conferences + Fairs"
  },
  "cat.congress.description": {
    "message": "Conferences, Conventions and Fairs"
  },
  "cat.consultation": {
    "message": "Consultation"
  },
  "cat.consultation.description": {
    "message": "Places for professional help in different issues"
  },
  "cat.cooking": {
    "message": "Cooking"
  },
  "cat.cooking.description": {
    "message": "Meetings for cooking together"
  },
  "cat.craft-art": {
    "message": "Craft + Art"
  },
  "cat.craft-art.description": {
    "message": "Events or meetings for teaching or doing art together"
  },
  "cat.donation": {
    "message": "Donations"
  },
  "cat.donation.description": {
    "message": "Places for donating and donation distribution centers "
  },
  "cat.education-counselling": {
    "message": "Education counselling"
  },
  "cat.education-counselling.description": {
    "message": "Assistance in education issues (University, Career preparation..etc)"
  },
  "cat.eventseries": {
    "message": "Series of Events"
  },
  "cat.external-event": {
    "message": "integrierte Daten"
  },
  "cat.family-counselling": {
    "message": "Family counselling"
  },
  "cat.family-counselling.description": {
    "message": "Assistance for families, children, and parents"
  },
  "cat.fb-event": {
    "message": "facebook Event"
  },
  "cat.festival": {
    "message": "Festival"
  },
  "cat.festival.description": {
    "message": "Festivals, parties"
  },
  "cat.film": {
    "message": "Movies"
  },
  "cat.film.description": {
    "message": "Cinema and film screenings"
  },
  "cat.food": {
    "message": "Food"
  },
  "cat.food.description": {
    "message": "Places for free food distribution "
  },
  "cat.foreign-language": {
    "message": "Foreign languages"
  },
  "cat.foreign-language.description": {
    "message": "Courses for other foreign languages "
  },
  "cat.furniture": {
    "message": "Furniture"
  },
  "cat.furniture.description": {
    "message": "Places for furniture donations and distribution centers"
  },
  "cat.gardening": {
    "message": "Gardening"
  },
  "cat.gardening.description": {
    "message": "Projects for taking care of gardens together"
  },
  "cat.general": {
    "message": "General"
  },
  "cat.general.description": {
    "message": "Places of interest like public offices, churches, WIFI hotspots.."
  },
  "cat.german-course": {
    "message": "Free German course (Deutschkurs)"
  },
  "cat.german-course-state": {
    "message": "Official German course (Deutschkurs)"
  },
  "cat.german-course-state.description": {
    "message": "German courses offered by the state"
  },
  "cat.german-course.description": {
    "message": "Free German courses offered by volunteers"
  },
  "cat.hospital": {
    "message": "Hospital"
  },
  "cat.hospital.description": {
    "message": "Hospitals and clinics"
  },
  "cat.housing-project": {
    "message": "Housing projects"
  },
  "cat.housing-project.description": {
    "message": "Housing communities and help with appartment search "
  },
  "cat.interpreter": {
    "message": "Interpreters + Translators"
  },
  "cat.interpreter.description": {
    "message": "Interpreting and translating services"
  },
  "cat.islam": {
    "message": "Islamic Community"
  },
  "cat.islam.description": {
    "message": "Mosques and Islamic communities "
  },
  "cat.iwgr": {
    "message": "The International Weeks against Racial Discrimination"
  },
  "cat.jewish": {
    "message": "Jewish Community"
  },
  "cat.jewish.description": {
    "message": "Synagogues and Jewish communities "
  },
  "cat.job-counselling": {
    "message": "Job counselling"
  },
  "cat.job-counselling.description": {
    "message": "Assistance in issues related to finding jobs and careers "
  },
  "cat.jobs": {
    "message": "Jobs + Education"
  },
  "cat.jobs.description": {
    "message": "Counselling offers for jobs and education"
  },
  "cat.language": {
    "message": "Language"
  },
  "cat.language.description": {
    "message": "Language courses, meetings, translators"
  },
  "cat.learning-place": {
    "message": "Learning place"
  },
  "cat.learning-place.description": {
    "message": "Places to study in"
  },
  "cat.lecture": {
    "message": "Lecture"
  },
  "cat.lecture.description": {
    "message": "Lectures and seminars on different topics"
  },
  "cat.legal-advice": {
    "message": "Legal advice"
  },
  "cat.legal-advice.description": {
    "message": "Advice from lawyers and institutions in legal issues"
  },
  "cat.leisure": {
    "message": "Leisure"
  },
  "cat.leisure.description": {
    "message": "Things to do in your free time"
  },
  "cat.lgbt": {
    "message": "LGBT"
  },
  "cat.lgbt.description": {
    "message": "Organisations for lesbian, gay, bisexual, and transgender people."
  },
  "cat.library": {
    "message": "Library"
  },
  "cat.library.description": {
    "message": "Libraries to borrow books from, to study in, or to get internet access "
  },
  "cat.medic": {
    "message": "Health care"
  },
  "cat.medic.description": {
    "message": "Health organisations"
  },
  "cat.medical-care": {
    "message": "Medical care"
  },
  "cat.medical-counselling": {
    "message": "Medical counselling"
  },
  "cat.medical-counselling.description": {
    "message": "Places for assistance in health issues"
  },
  "cat.meet-and-speak": {
    "message": "Meet & Speak"
  },
  "cat.meet-and-speak.description": {
    "message": "Meetings to improve your language skills and for homework support "
  },
  "cat.meeting-place": {
    "message": "Meeting point"
  },
  "cat.meeting-place.description": {
    "message": "Places for meeting new people"
  },
  "cat.museum": {
    "message": "Museum"
  },
  "cat.museum.description": {
    "message": "Exhibitions"
  },
  "cat.music": {
    "message": "Music"
  },
  "cat.music.description": {
    "message": "Concerts and places to play music"
  },
  "cat.nature": {
    "message": "Parks + Gardens"
  },
  "cat.nature.description": {
    "message": "Free gardens and parks"
  },
  "cat.other": {
    "message": "Other"
  },
  "cat.other.description": {
    "message": "Other things"
  },
  "cat.police": {
    "message": "Police"
  },
  "cat.police.description": {
    "message": "Police stations"
  },
  "cat.political-education": {
    "message": "Political education"
  },
  "cat.political-education.description": {
    "message": "Events and organisations for political education"
  },
  "cat.psychological-counselling": {
    "message": "Psychological counselling"
  },
  "cat.psychological-counselling.description": {
    "message": "Assistance in psychological issues"
  },
  "cat.public-transport": {
    "message": "Public transport"
  },
  "cat.public-transport.description": {
    "message": "Tram and bus stops for public transportation"
  },
  "cat.religious-other": {
    "message": "Religious institution"
  },
  "cat.religious-other.description": {
    "message": "Other religious communities"
  },
  "cat.shop": {
    "message": "Intercultural shop"
  },
  "cat.shop.description": {
    "message": "Shops that sell eastern or/and western products"
  },
  "cat.social-counselling": {
    "message": "Social counselling"
  },
  "cat.social-counselling.description": {
    "message": "Assistance in different social life issues"
  },
  "cat.sponsorship": {
    "message": "Sponsorship"
  },
  "cat.sponsorship.description": {
    "message": "Buddy-programs, tandems, friendships"
  },
  "cat.sports": {
    "message": "Sports"
  },
  "cat.sports.description": {
    "message": "Places or people to play sports in/with"
  },
  "cat.stage": {
    "message": "Stage"
  },
  "cat.stage.description": {
    "message": "Theater, plays, opera..etc"
  },
  "cat.tram": {
    "message": "Tram"
  },
  "cat.tram.description": {
    "message": "Tram"
  },
  "cat.volunteer-coordination": {
    "message": "Volunteers' coordination"
  },
  "cat.volunteer-coordination.description": {
    "message": "Places that help supporters and volunteers"
  },
  "cat.welcome-network": {
    "message": "Welcoming organisations"
  },
  "cat.welcome-network.description": {
    "message": "Local organisations that help new people in new cities"
  },
  "cat.wifi": {
    "message": "Free WIFI"
  },
  "cat.wifi.description": {
    "message": "Free WIFI"
  },
  "cat.women-counselling": {
    "message": "Women counselling"
  },
  "cat.women-counselling.description": {
    "message": "Assistance for women"
  },
  "cat.workshop": {
    "message": "Workshop"
  },
  "cat.workshop.description": {
    "message": "Meetings for doing an activity on a subject or a project"
  },
  "cat.workspace": {
    "message": "Rooms + Workplaces"
  },
  "cat.workspace.description": {
    "message": "Places to work in"
  },
  "cat.youth-club": {
    "message": "Youth club"
  },
  "cat.youth-club.description": {
    "message": "Meetings for young people"
  },
  "category": {
    "message": "Category"
  },
  "entity.event": {
    "message": "Events"
  },
  "entity.market": {
    "message": "Small ad"
  },
  "entity.market.offer": {
    "message": "Small ad (offer)"
  },
  "entity.market.request": {
    "message": "Small ad (request)"
  },
  "entity.orga": {
    "message": "Organizations and Projects"
  },
  "entry.type": {
    "message": "Entry type"
  },
  "external.wifi.description": {
    "message": "Free + secure Wi-Fi: Freifunk stands for free communication in digital data networks. Free means to us: publicly accessible, non-profit, in possession of the community and uncensored."
  },
  "form.button.cancel": {
    "message": "Cancel"
  },
  "form.button.newEntry.submit": {
    "message": "Eintragen"
  },
  "form.button.submit": {
    "message": "Send"
  },
  "form.disclaimer.newEntry": {
    "message": "Ich versichere zur Eingabe der bereitgestellten Informationen berechtigt zu sein und willige ein, dass diese zur Veröffentlichung auf der Website www.afeefa.de und weiteren digitalen und analogen Medien, die durch Dresden für Alle e.V. herausgegeben werden, verwendet werden dürfen."
  },
  "form.emptyOption.category": {
    "message": "Select category"
  },
  "form.emptyOption.datePeriodic": {
    "message": "Select repetition"
  },
  "form.emptyOption.subCategory": {
    "message": "Select sub category"
  },
  "form.event": {
    "message": "Enter new event"
  },
  "form.fail": {
    "message": "Something went wrong. Please try again."
  },
  "form.feedbackSent": {
    "message": "We received your feedback. Thanks a lot!"
  },
  "form.field.category": {
    "message": "Kategorie"
  },
  "form.field.descriptionShort": {
    "message": "Kurze Beschreibung"
  },
  "form.field.entryType": {
    "message": "Art des Eintrags"
  },
  "form.field.mail": {
    "message": "E-Mail address"
  },
  "form.field.message": {
    "message": "Your message"
  },
  "form.field.newEntry.comment": {
    "message": "Anmerkung für die Redaktion"
  },
  "form.field.phone": {
    "message": "Phone number"
  },
  "form.field.supportWantedDescription": {
    "message": "Genaue Beschreibung der benötigten Unterstützung"
  },
  "form.field.title": {
    "message": "Titel"
  },
  "form.heading.contact": {
    "message": "Nachricht schreiben"
  },
  "form.heading.feedback": {
    "message": "Feedback to the Afeefa team"
  },
  "form.heading.newEntry": {
    "message": "Eigenen Eintrag hinzufügen"
  },
  "form.initiative": {
    "message": "Create new organization or project"
  },
  "form.label.recipient": {
    "message": "An"
  },
  "form.locationBtn.add": {
    "message": "+ Add location"
  },
  "form.locationBtn.remove": {
    "message": "- Remove location"
  },
  "form.marketentry": {
    "message": "Place a small ad"
  },
  "form.placeholder.city": {
    "message": "Name of the city"
  },
  "form.placeholder.dateFrom": {
    "message": "Start date"
  },
  "form.placeholder.dateTo": {
    "message": "End date"
  },
  "form.placeholder.description": {
    "message": "Short description"
  },
  "form.placeholder.facebook": {
    "message": "facebook link"
  },
  "form.placeholder.forChildren": {
    "message": "suitable for children"
  },
  "form.placeholder.name": {
    "message": "Title"
  },
  "form.placeholder.placename": {
    "message": "Name of the location (e.g. town hall)"
  },
  "form.placeholder.speakerPublic": {
    "message": "Name of the contact person"
  },
  "form.placeholder.spokenLanguages": {
    "message": "Select the languages you understand ..."
  },
  "form.placeholder.street": {
    "message": "Street"
  },
  "form.placeholder.supportWanted": {
    "message": "new supporters wanted"
  },
  "form.placeholder.timeFrom": {
    "message": "Start time"
  },
  "form.placeholder.web": {
    "message": "Website URL"
  },
  "form.placeholder.zip": {
    "message": "Zip code"
  },
  "form.preamble.newEntry": {
    "message": "Die Eintragung ist kostenlos. Verantwortliche Redakteure werden den Eintrag schnellstmöglich prüfen und Ihnen eine E-Mail senden, sobald der Eintrag veröffentlicht ist."
  },
  "form.section.newEntry.contact": {
    "message": "Kontaktangaben"
  },
  "form.section.newEntry.location": {
    "message": "Ort (optional)"
  },
  "form.success": {
    "message": "Thank you! We will verify your entry and release it as soon as possible."
  },
  "form.text.contactinfo": {
    "message": "The contact data will be published to allow interested persons to get in touch with you. Please be aware of the information you provide here."
  },
  "form_placeholder_timeTo": {
    "message": "End time"
  },
  "freifunk.descriptionShort": {
    "message": "Free and secure access to the Internet - made possible by Freifunk Dresden."
  },
  "intro.button.cancel": {
    "message": "Stop"
  },
  "intro.button.cancel.forever": {
    "message": "I can manage myself"
  },
  "intro.button.finish": {
    "message": "Finish"
  },
  "intro.button.next": {
    "message": "Next"
  },
  "intro.step.guide.text": {
    "message": "Here you can find our \"Guide for Refugees\". It provides useful background information on the subjects of asylum, living, work, studying, health, and a lot more..."
  },
  "intro.step.guide.title": {
    "message": "Guide"
  },
  "intro.step.language.text": {
    "message": "You can choose your language here. Not everything is translated, but we're working on it."
  },
  "intro.step.language.title": {
    "message": "Your language"
  },
  "intro.step.legend.text": {
    "message": "In the legend you find explanations for the symbols on the map and an overview of all the available categories. You can also use the categories as a filter search."
  },
  "intro.step.legend.title": {
    "message": "Legend & filter"
  },
  "intro.step.map.text": {
    "message": "You can also find everything with a location on our map. Here you can go through an intercultural voyage of discovery in Dresden!"
  },
  "intro.step.map.title": {
    "message": "Map"
  },
  "intro.step.plus.text": {
    "message": "If you have any questions or just want to send us feedback, then send us a message."
  },
  "intro.step.plus.title": {
    "message": "Get in touch with the Afeefa Team"
  },
  "intro.step.search.text": {
    "message": "Afeefa.de connects people and encourages integration through a wide range of the latest events, projects, initiatives and organizations in Dresden."
  },
  "intro.step.search.title": {
    "message": "Welcome to Dresden"
  },
  "lan.ar": {
    "message": "Arabic"
  },
  "lan.az": {
    "message": "Azerbaijani"
  },
  "lan.ba": {
    "message": "Bashkir"
  },
  "lan.ce": {
    "message": "Chechen"
  },
  "lan.cs": {
    "message": "Czech"
  },
  "lan.de": {
    "message": "German"
  },
  "lan.el": {
    "message": "Greek"
  },
  "lan.en": {
    "message": "English"
  },
  "lan.es": {
    "message": "Spanish"
  },
  "lan.fa": {
    "message": "Farsi"
  },
  "lan.fr": {
    "message": "French"
  },
  "lan.hu": {
    "message": "Hungarian"
  },
  "lan.it": {
    "message": "Italian"
  },
  "lan.ja": {
    "message": "Japanese"
  },
  "lan.ko": {
    "message": "Korean"
  },
  "lan.ku": {
    "message": "Kurdish"
  },
  "lan.nl": {
    "message": "Dutch"
  },
  "lan.pa": {
    "message": "Punjabi"
  },
  "lan.pl": {
    "message": "Polish"
  },
  "lan.ps": {
    "message": "Pashto"
  },
  "lan.pt": {
    "message": "Portuguese"
  },
  "lan.ru": {
    "message": "Russian"
  },
  "lan.sq": {
    "message": "Albanian"
  },
  "lan.sr": {
    "message": "Serbian"
  },
  "lan.ti": {
    "message": "Tigrinya"
  },
  "lan.tr": {
    "message": "Turkish"
  },
  "lan.uk": {
    "message": "Ukrainian"
  },
  "lan.ur": {
    "message": "Urdu"
  },
  "lan.za": {
    "message": "Zhuang"
  },
  "lan.zh": {
    "message": "Chinese"
  },
  "languageselection.button.main": {
    "message": "Choose Language"
  },
  "menu.about": {
    "message": "About Afeefa"
  },
  "menu.cancel": {
    "message": "Cancel search"
  },
  "menu.facebook": {
    "message": "facebook"
  },
  "menu.imprint": {
    "message": "Impressum"
  },
  "menu.menu": {
    "message": "Menu"
  },
  "menu.press": {
    "message": "Press"
  },
  "menu.refugee": {
    "message": "Guide for asylum seekers"
  },
  "menu.supporter": {
    "message": "Guide for supporters"
  },
  "message.survey.text": {
    "message": "Through your small feedback you help the Afeefa project and its development!"
  },
  "message.survey.title": {
    "message": "How do you use Afeefa.de"
  },
  "misc.filterReset": {
    "message": "Reset filter"
  },
  "misc.notVerifiedEntry": {
    "message": "not verified"
  },
  "misc.verifiedEntry": {
    "message": "verified"
  },
  "old.misc.officialEntry": {
    "message": "official entry"
  },
  "old.misc.privateEntry": {
    "message": "private entry"
  },
  "plus.entry": {
    "message": "Add entry"
  },
  "plus.feedback": {
    "message": "Send feedback"
  },
  "prop.arrival": {
    "message": "Directions"
  },
  "prop.author": {
    "message": "Name"
  },
  "prop.category": {
    "message": "Category"
  },
  "prop.city": {
    "message": "City"
  },
  "prop.dateday": {
    "message": "exact day"
  },
  "prop.dateFrom": {
    "message": "from"
  },
  "prop.datePeriodic": {
    "message": "Frequence/Repetition"
  },
  "prop.datePeriodic.daily": {
    "message": "daily"
  },
  "prop.datePeriodic.monthly": {
    "message": "monthly"
  },
  "prop.datePeriodic.secondWeekly": {
    "message": "every 2 weeks"
  },
  "prop.datePeriodic.weekly": {
    "message": "weekly"
  },
  "prop.dateTo": {
    "message": "to"
  },
  "prop.description": {
    "message": "Description"
  },
  "prop.facebook": {
    "message": "Facebook"
  },
  "prop.fax": {
    "message": "Fax"
  },
  "prop.forChildren": {
    "message": "for children + young adults"
  },
  "prop.location": {
    "message": "Location"
  },
  "prop.location.none": {
    "message": "No location given"
  },
  "prop.mail": {
    "message": "E-Mail"
  },
  "prop.message": {
    "message": "Message"
  },
  "prop.name": {
    "message": "Title"
  },
  "prop.offer.offer": {
    "message": "Offer"
  },
  "prop.offer.request": {
    "message": "Request"
  },
  "prop.openingHours": {
    "message": "Opening hours"
  },
  "prop.phone": {
    "message": "Phone"
  },
  "prop.scope": {
    "message": "district only"
  },
  "prop.speakerPublic": {
    "message": "Contact person"
  },
  "prop.spokenLanguages": {
    "message": "We understand the following languages"
  },
  "prop.street": {
    "message": "Street"
  },
  "prop.supportWanted": {
    "message": "Supporters wanted"
  },
  "prop.timeAt": {
    "message": "at"
  },
  "prop.timeFrom": {
    "message": "from"
  },
  "prop.times": {
    "message": "Time"
  },
  "prop.timeTo": {
    "message": "to"
  },
  "prop.until": {
    "message": "until"
  },
  "prop.web": {
    "message": "Website"
  },
  "prop.zip": {
    "message": "Postal code"
  },
  "search.label.about": {
    "message": "Über Afeefa.de"
  },
  "search.label.activity": {
    "message": "Afeefa mitgestalten"
  },
  "search.label.addentry": {
    "message": "Add your entry"
  },
  "search.label.certified": {
    "message": "Recommended by the Sächsische Flüchtlingsrat"
  },
  "search.label.forchildren": {
    "message": "Offers for children and young adults"
  },
  "search.label.forwomen": {
    "message": "Offers for women"
  },
  "search.label.help": {
    "message": "Help"
  },
  "search.label.highlights": {
    "message": "Highlights"
  },
  "search.label.intro": {
    "message": "Tutorial"
  },
  "search.label.iwgr": {
    "message": "The International Weeks against Racial Discrimination"
  },
  "search.label.lists": {
    "message": "Useful lists"
  },
  "search.label.newentries": {
    "message": "New projects"
  },
  "search.label.nothingfound": {
    "message": "Leider nichts gefunden :/"
  },
  "search.label.refugeeGuide": {
    "message": "Guide for asylum seekers"
  },
  "search.label.supporterGuide": {
    "message": "Guide for supporters"
  },
  "search.label.supportwanted": {
    "message": "Supporters wanted"
  },
  "search.label.type.0": {
    "message": "Organisations and Projects"
  },
  "search.label.type.1": {
    "message": "Small ads"
  },
  "search.label.upcomingevents": {
    "message": "Upcoming events"
  },
  "search.phrase.forwomen": {
    "message": "#women"
  },
  "search.placeholder": {
    "message": "Search Afeefa..."
  },
  "search.sublabel.about": {
    "message": "Wissenswertes zum Afeefa Projekt"
  },
  "search.sublabel.addentry": {
    "message": "Contribute to Afeefa and add your own content"
  },
  "search.sublabel.certified": {
    "message": "These projects are known by the Flüchtlingsrat and are worth supporting"
  },
  "search.sublabel.feedback": {
    "message": "Ideas? Criticism? Praise? We are pleased about your message!"
  },
  "search.sublabel.forchildren": {
    "message": "Projects and activities by and with children and young adults"
  },
  "search.sublabel.forwomen": {
    "message": "Projects and activities from and for women"
  },
  "search.sublabel.intro": {
    "message": "Introduction to the functionalities of this website"
  },
  "search.sublabel.iwgr": {
    "message": "All Events"
  },
  "search.sublabel.nothingfound": {
    "message": "Irgendwann findet jedes Huhn einmal ein Korn"
  },
  "search.sublabel.refugeeGuide": {
    "message": "Useful information for newcomers in Dresden"
  },
  "search.sublabel.supporterGuide": {
    "message": "Important information on voluntary engagement"
  },
  "search.sublabel.supportwanted": {
    "message": "Projects which urgently need supporters"
  },
  "search.tag.certified": {
    "message": "Recommended by the SFR"
  },
  "search.tag.supportwanted": {
    "message": "Supporters wanted"
  },
  "tooltip.certificate": {
    "message": "This project is known by Sächsischer Flüchtlingsrat and is therefore considered as worth supporting."
  }
}
/* values copied from phraseapp */
let deInput = {
  "button.locate": {
    "message": "Meinen Standort anzeigen"
  },
  "cat.asylum-counselling": {
    "message": "Asylberatung"
  },
  "cat.asylum-counselling.description": {
    "message": "Beratung zum Thema Asyl und Migration"
  },
  "cat.authority": {
    "message": "Behörden"
  },
  "cat.authority.description": {
    "message": "Ämter und Behörden"
  },
  "cat.childcare": {
    "message": "Kinderbetreuung"
  },
  "cat.childcare.description": {
    "message": "Kitas, Kinderprogramme"
  },
  "cat.christian": {
    "message": "Christliche Gemeinschaft"
  },
  "cat.christian.description": {
    "message": "Kirchen und christliche Gemeinden"
  },
  "cat.clothes": {
    "message": "Kleidung"
  },
  "cat.clothes.description": {
    "message": "Annahme und Ausgabe von Kleiderspenden"
  },
  "cat.community": {
    "message": "Gemeinschaft"
  },
  "cat.community.description": {
    "message": "Soziale Vereine und Netzwerke"
  },
  "cat.congress": {
    "message": "Kongresse + Messen"
  },
  "cat.congress.description": {
    "message": "Kongresse, Konferenzen und Messen"
  },
  "cat.consultation": {
    "message": "Beratung"
  },
  "cat.consultation.description": {
    "message": "Professionelle Hilfe für unterschiedliche Angelegenheiten"
  },
  "cat.cooking": {
    "message": "Kochen"
  },
  "cat.cooking.description": {
    "message": "Treffen für gemeinsames Kochen"
  },
  "cat.craft-art": {
    "message": "Handwerk + Kunst"
  },
  "cat.craft-art.description": {
    "message": "Veranstaltungen um gemeinsam künstlerisch tätig zu sein"
  },
  "cat.donation": {
    "message": "Spenden"
  },
  "cat.donation.description": {
    "message": "Spendenannahme und -ausgabestellen"
  },
  "cat.education-counselling": {
    "message": "Bildungsberatung"
  },
  "cat.education-counselling.description": {
    "message": "Beratung zum Thema Bildung (Universität, Berufsvorbereitung...)"
  },
  "cat.eventseries": {
    "message": "Veranstaltungsreihe"
  },
  "cat.external-event": {
    "message": "integrierte Daten"
  },
  "cat.family-counselling": {
    "message": "Familienberatung"
  },
  "cat.family-counselling.description": {
    "message": "Beratung für Familien, Kinder und Eltern"
  },
  "cat.fb-event": {
    "message": "facebook Event"
  },
  "cat.festival": {
    "message": "Fest"
  },
  "cat.festival.description": {
    "message": "Veranstaltungen, Partys"
  },
  "cat.film": {
    "message": "Film"
  },
  "cat.film.description": {
    "message": "Kino und Filmvorführungen"
  },
  "cat.food": {
    "message": "Lebensmittel"
  },
  "cat.food.description": {
    "message": "Kostenlose Ausgabestellen für Lebensmittel"
  },
  "cat.foreign-language": {
    "message": "Fremdsprachen"
  },
  "cat.foreign-language.description": {
    "message": "Kurse für andere Sprachen"
  },
  "cat.furniture": {
    "message": "Möbel"
  },
  "cat.furniture.description": {
    "message": "Annahme und Ausgabe von Möbelspenden"
  },
  "cat.gardening": {
    "message": "Garten"
  },
  "cat.gardening.description": {
    "message": "Orte für gemeinsame Gartenarbeit"
  },
  "cat.general": {
    "message": "Allgemeines"
  },
  "cat.general.description": {
    "message": "Interessante Orte wie Behörden, Kirchen oder WLAN Hotspots"
  },
  "cat.german-course": {
    "message": "freier Deutschkurs"
  },
  "cat.german-course-state": {
    "message": "staatlicher Deutschkurs"
  },
  "cat.german-course-state.description": {
    "message": "staatlicher Deutschkurs"
  },
  "cat.german-course.description": {
    "message": "Kostenlose Deutschkurse von Freiwilligen"
  },
  "cat.hospital": {
    "message": "Krankenhaus"
  },
  "cat.hospital.description": {
    "message": "Krankenhäuser und Kliniken "
  },
  "cat.housing-project": {
    "message": "Wohnprojekte"
  },
  "cat.housing-project.description": {
    "message": "Wohngemeinschaften und Hilfe bei Wohnungssuche "
  },
  "cat.interpreter": {
    "message": "Übersetzer/ Dolmetscher"
  },
  "cat.interpreter.description": {
    "message": "Dolmetscher und Übersetzer"
  },
  "cat.islam": {
    "message": "Islamische Gemeinschaft"
  },
  "cat.islam.description": {
    "message": "Moscheen und muslimische Gemeinden "
  },
  "cat.iwgr": {
    "message": "Internationale Wochen gegen Rassismus"
  },
  "cat.jewish": {
    "message": "Jüdische Gemeinschaft"
  },
  "cat.jewish.description": {
    "message": "Synagogen und jüdische Gemeinden\n"
  },
  "cat.job-counselling": {
    "message": "Berufsberatung"
  },
  "cat.job-counselling.description": {
    "message": "Beratungsangebote zum Thema Arbeitssuche und Berufswahl"
  },
  "cat.jobs": {
    "message": "Arbeit + Bildung"
  },
  "cat.jobs.description": {
    "message": "Beratungsangebote für Arbeit und Bildung"
  },
  "cat.language": {
    "message": "Sprache"
  },
  "cat.language.description": {
    "message": "Sprachangebote"
  },
  "cat.learning-place": {
    "message": "Lernort"
  },
  "cat.learning-place.description": {
    "message": "Lernorte"
  },
  "cat.lecture": {
    "message": "Vortrag"
  },
  "cat.lecture.description": {
    "message": "Reden und Seminare zu verschiedenen Themen"
  },
  "cat.legal-advice": {
    "message": "Rechtsberatung"
  },
  "cat.legal-advice.description": {
    "message": "Beratung durch Anwälte und Institutionen zum Recht"
  },
  "cat.leisure": {
    "message": "Freizeit"
  },
  "cat.leisure.description": {
    "message": "Freizeitangebote"
  },
  "cat.lgbt": {
    "message": "LGBT"
  },
  "cat.lgbt.description": {
    "message": "Organisationen für Lesben, Schwule, Bisexuelle und Transgender"
  },
  "cat.library": {
    "message": "Bibliothek"
  },
  "cat.library.description": {
    "message": "Leihbücherei, Internet, Lernort"
  },
  "cat.medic": {
    "message": "Gesundheit"
  },
  "cat.medic.description": {
    "message": "medizinische Organisationen"
  },
  "cat.medical-care": {
    "message": "Medizinische Versorgung"
  },
  "cat.medical-counselling": {
    "message": "Medizinische Beratung"
  },
  "cat.medical-counselling.description": {
    "message": "medizinische Beratung"
  },
  "cat.meet-and-speak": {
    "message": "Sprachtreff"
  },
  "cat.meet-and-speak.description": {
    "message": "Treffen für Hausaufgabenhilfe und um Sprachkenntnisse zu verbessern "
  },
  "cat.meeting-place": {
    "message": "Treffpunkt"
  },
  "cat.meeting-place.description": {
    "message": "Orte um neue Leute kennenzulernen, Begegnungstreffs "
  },
  "cat.museum": {
    "message": "Museum"
  },
  "cat.museum.description": {
    "message": "Ausstellungen"
  },
  "cat.music": {
    "message": "Musik"
  },
  "cat.music.description": {
    "message": "Konzerte und Orte für Musik"
  },
  "cat.nature": {
    "message": "Parks + Gärten"
  },
  "cat.nature.description": {
    "message": "Offene Gärten und Parks"
  },
  "cat.other": {
    "message": "Sonstige"
  },
  "cat.other.description": {
    "message": "Andere Dinge"
  },
  "cat.police": {
    "message": "Polizei"
  },
  "cat.police.description": {
    "message": "Polizeitsationen "
  },
  "cat.political-education": {
    "message": "Politische Bildung"
  },
  "cat.political-education.description": {
    "message": "Veranstaltungen und Organisation für politische Bildung"
  },
  "cat.psychological-counselling": {
    "message": "Psychologische Beratung"
  },
  "cat.psychological-counselling.description": {
    "message": "Psychologische Beratung"
  },
  "cat.public-transport": {
    "message": "Haltestelle"
  },
  "cat.public-transport.description": {
    "message": "Haltestellen für Busse und Bahnen"
  },
  "cat.religious-other": {
    "message": "Religiöse Einrichtung"
  },
  "cat.religious-other.description": {
    "message": "Sonstige religiöse Gemeinschaften"
  },
  "cat.shop": {
    "message": "Interkultureller Einkaufsladen"
  },
  "cat.shop.description": {
    "message": "Läden die östliche und/oder westliche Produkte anbieten"
  },
  "cat.social-counselling": {
    "message": "Sozialberatung"
  },
  "cat.social-counselling.description": {
    "message": "Hilfe und Beratung in unterschiedlichen Lebenssituationen"
  },
  "cat.sponsorship": {
    "message": "Patenschaften"
  },
  "cat.sponsorship.description": {
    "message": "Buddy-Programme, Tandems, Freundschaften"
  },
  "cat.sports": {
    "message": "Sport"
  },
  "cat.sports.description": {
    "message": "Orte und Gruppen für Sport"
  },
  "cat.stage": {
    "message": "Bühne"
  },
  "cat.stage.description": {
    "message": "Theater, Oper"
  },
  "cat.tram": {
    "message": "Straßenbahn"
  },
  "cat.tram.description": {
    "message": "Straßenbahn"
  },
  "cat.volunteer-coordination": {
    "message": "Ehrenamtskoordination"
  },
  "cat.volunteer-coordination.description": {
    "message": "Beratung für Engagierte und Ehrenamtliche"
  },
  "cat.welcome-network": {
    "message": "Willkommensbündnis"
  },
  "cat.welcome-network.description": {
    "message": "Organisationen die Neuangekommene unterstützen"
  },
  "cat.wifi": {
    "message": "Kostenloses WLAN"
  },
  "cat.wifi.description": {
    "message": "offenes WIFI"
  },
  "cat.women-counselling": {
    "message": "Frauenberatung"
  },
  "cat.women-counselling.description": {
    "message": "Beratung für Frauen"
  },
  "cat.workshop": {
    "message": "Workshop"
  },
  "cat.workshop.description": {
    "message": "Treffen um gemeinsam an Projekten zu arbeiten"
  },
  "cat.workspace": {
    "message": "Räume + Werkstätten"
  },
  "cat.workspace.description": {
    "message": "Offene Orte für unterschiedliche handwerkliche Arbeiten"
  },
  "cat.youth-club": {
    "message": "Jugendtreff"
  },
  "cat.youth-club.description": {
    "message": "Treffen für junge Leute"
  },
  "category": {
    "message": "Kategorie"
  },
  "entity.event": {
    "message": "Veranstaltung"
  },
  "entity.market": {
    "message": "Kleinanzeige"
  },
  "entity.market.offer": {
    "message": "Kleinanzeige (Angebot)"
  },
  "entity.market.request": {
    "message": "Kleinanzeige (Gesuch)"
  },
  "entity.orga": {
    "message": "Organisation/ Projekt"
  },
  "entry.type": {
    "message": "Eintragstyp"
  },
  "external.wifi.description": {
    "message": "Kostenloses + sicheres WLAN: Freifunk steht für freie Kommunikation in digitalen Datennetzen. Wir verstehen frei als öffentlich zugänglich, nicht kommerziell, im Besitz der Gemeinschaft und unzensiert."
  },
  "form.button.cancel": {
    "message": "Abbrechen"
  },
  "form.button.newEntry.submit": {
    "message": "Eintragen"
  },
  "form.button.submit": {
    "message": "Abschicken"
  },
  "form.disclaimer.newEntry": {
    "message": "Ich versichere zur Eingabe der bereitgestellten Informationen berechtigt zu sein und willige ein, dass diese zur Veröffentlichung auf der Website www.afeefa.de und weiteren digitalen und analogen Medien, die durch Dresden für Alle e.V. herausgegeben werden, verwendet werden dürfen."
  },
  "form.emptyOption.category": {
    "message": "Kategorie wählen"
  },
  "form.emptyOption.datePeriodic": {
    "message": "Wiederholung wählen"
  },
  "form.emptyOption.subCategory": {
    "message": "Unterkategorie wählen"
  },
  "form.event": {
    "message": "Event eintragen"
  },
  "form.fail": {
    "message": "Leider hat es nicht geklappt, versuche es bitte noch einmal."
  },
  "form.feedbackSent": {
    "message": "Wir haben dein Feedback erhalten. Herzlichen Dank dafür!"
  },
  "form.field.category": {
    "message": "Kategorie"
  },
  "form.field.descriptionShort": {
    "message": "Kurze Beschreibung"
  },
  "form.field.entryType": {
    "message": "Art des Eintrags"
  },
  "form.field.mail": {
    "message": "E-Mail Adresse"
  },
  "form.field.message": {
    "message": "Deine Nachricht"
  },
  "form.field.newEntry.comment": {
    "message": "Anmerkung für die Redaktion"
  },
  "form.field.phone": {
    "message": "Telefonnummer"
  },
  "form.field.supportWantedDescription": {
    "message": "Genaue Beschreibung der benötigten Unterstützung"
  },
  "form.field.title": {
    "message": "Titel"
  },
  "form.heading.contact": {
    "message": "Nachricht schreiben"
  },
  "form.heading.feedback": {
    "message": "Feedback ans Afeefa Team"
  },
  "form.heading.newEntry": {
    "message": "Eigenen Eintrag hinzufügen"
  },
  "form.initiative": {
    "message": "Initiative oder Projekt anlegen"
  },
  "form.label.recipient": {
    "message": "An"
  },
  "form.locationBtn.add": {
    "message": "+ Ort hinzufügen"
  },
  "form.locationBtn.remove": {
    "message": "- Ort entfernen"
  },
  "form.marketentry": {
    "message": "Inserat aufgeben"
  },
  "form.placeholder.city": {
    "message": "Ort"
  },
  "form.placeholder.dateFrom": {
    "message": "Startdatum"
  },
  "form.placeholder.dateTo": {
    "message": "Enddatum"
  },
  "form.placeholder.description": {
    "message": "Kurze Beschreibung"
  },
  "form.placeholder.facebook": {
    "message": "facebook Link"
  },
  "form.placeholder.forChildren": {
    "message": "explizit für Kinder geeignet"
  },
  "form.placeholder.name": {
    "message": "Titel"
  },
  "form.placeholder.placename": {
    "message": "Bezeichnung des Orts (z.B. Rathaus Empfangshalle)"
  },
  "form.placeholder.speakerPublic": {
    "message": "Name des Ansprechpartners"
  },
  "form.placeholder.spokenLanguages": {
    "message": "Sprache wählen..."
  },
  "form.placeholder.street": {
    "message": "Straße"
  },
  "form.placeholder.supportWanted": {
    "message": "neue Unterstützer gesucht"
  },
  "form.placeholder.timeFrom": {
    "message": "Startzeit"
  },
  "form.placeholder.web": {
    "message": "Website Adresse (URL)"
  },
  "form.placeholder.zip": {
    "message": "PLZ"
  },
  "form.preamble.newEntry": {
    "message": "Die Eintragung ist kostenlos. Verantwortliche Redakteure werden den Eintrag schnellstmöglich prüfen und Ihnen eine E-Mail senden, sobald der Eintrag veröffentlicht ist."
  },
  "form.section.newEntry.contact": {
    "message": "Kontaktangaben"
  },
  "form.section.newEntry.location": {
    "message": "Ort (optional)"
  },
  "form.success": {
    "message": "Danke für deinen Eintrag! Wir behalten uns vor, diesen zu prüfen und geben ihn so schnell wie möglich frei."
  },
  "form.text.contactinfo": {
    "message": "Deine Kontaktdaten werden veröffentlicht, damit Interessenten mit dir in Kontakt treten können. Bitte sei dir bewusst, welche Angaben du hier machen möchtest."
  },
  "form_placeholder_timeTo": {
    "message": "Endzeit"
  },
  "freifunk.descriptionShort": {
    "message": "Kostenloser und sicherer Zugang ins Internet - ermöglicht durch Freifunk Dresden."
  },
  "intro.button.cancel": {
    "message": "Abbrechen"
  },
  "intro.button.cancel.forever": {
    "message": "Ich kenne mich aus"
  },
  "intro.button.finish": {
    "message": "Fertig"
  },
  "intro.button.next": {
    "message": "Weiter"
  },
  "intro.step.guide.text": {
    "message": "Hier findest du unseren Leitfaden für Geflüchtete. Er gibt dir wertvolle Hintergrundinformationen zu den Themen Asyl, Wohnen, Arbeit, Bildung, Gesundheit und vielen mehr..."
  },
  "intro.step.guide.title": {
    "message": "Leitfaden"
  },
  "intro.step.language.text": {
    "message": "Hier kannst du deine Sprache wählen. Nicht alles ist übersetzt, aber es wird stetig mehr."
  },
  "intro.step.language.title": {
    "message": "Deine Sprache"
  },
  "intro.step.legend.text": {
    "message": "In der Legende findest du eine Erklärung der Symbole auf der Karte und eine Übersicht über alle Kategorien. Du kannst die Kategorien auch gleich zum Filtern nutzen."
  },
  "intro.step.legend.title": {
    "message": "Legende & Filter"
  },
  "intro.step.map.text": {
    "message": "Alle Dinge mit einem Ort findest du auch auf unserer Karte. Hier kannst du auf interkulturelle Entdeckungsreise durch Dresden gehen!"
  },
  "intro.step.map.title": {
    "message": "Karte"
  },
  "intro.step.plus.text": {
    "message": "Schreib uns eine Nachricht, wenn du Fragen hast oder Feedback hinterlassen möchtest."
  },
  "intro.step.plus.title": {
    "message": "Kontakt zum Afeefa Team"
  },
  "intro.step.search.text": {
    "message": "Hier auf Afeefa.de werden Menschen vernetzt und Integration gefördert. Passend dazu findest du auf Afeefa.de aktuelle Veranstaltungen und viele Projekte, Initiativen und Organisationen in Dresden."
  },
  "intro.step.search.title": {
    "message": "Willkommen in Dresden"
  },
  "lan.ar": {
    "message": "Arabisch"
  },
  "lan.az": {
    "message": "Aserbeidschanisch"
  },
  "lan.ba": {
    "message": "Baschkirisch"
  },
  "lan.ce": {
    "message": "Tschetschenisch"
  },
  "lan.cs": {
    "message": "Tschechisch"
  },
  "lan.de": {
    "message": "Deutsch"
  },
  "lan.el": {
    "message": "Griechisch"
  },
  "lan.en": {
    "message": "Englisch"
  },
  "lan.es": {
    "message": "Spanisch"
  },
  "lan.fa": {
    "message": "Farsi"
  },
  "lan.fr": {
    "message": "Französisch"
  },
  "lan.hu": {
    "message": "Ungarisch"
  },
  "lan.it": {
    "message": "Italienisch"
  },
  "lan.ja": {
    "message": "Japanisch"
  },
  "lan.ko": {
    "message": "Koreanisch"
  },
  "lan.ku": {
    "message": "Kurdisch"
  },
  "lan.nl": {
    "message": "Holländisch"
  },
  "lan.pa": {
    "message": "Pandschabi"
  },
  "lan.pl": {
    "message": "Polnisch"
  },
  "lan.ps": {
    "message": "Pashto"
  },
  "lan.pt": {
    "message": "Portugiesisch"
  },
  "lan.ru": {
    "message": "Russisch"
  },
  "lan.sq": {
    "message": "Albanisch"
  },
  "lan.sr": {
    "message": "Serbisch"
  },
  "lan.ti": {
    "message": "Tigrinya"
  },
  "lan.tr": {
    "message": "Türkisch"
  },
  "lan.uk": {
    "message": "Ukrainisch"
  },
  "lan.ur": {
    "message": "Urdu"
  },
  "lan.za": {
    "message": "Zhuang"
  },
  "lan.zh": {
    "message": "Chinesisch"
  },
  "languageselection.button.main": {
    "message": "Sprache wählen"
  },
  "menu.about": {
    "message": "Über Afeefa"
  },
  "menu.cancel": {
    "message": "Suche abbrechen"
  },
  "menu.facebook": {
    "message": "facebook"
  },
  "menu.imprint": {
    "message": "Impressum"
  },
  "menu.menu": {
    "message": "Menu"
  },
  "menu.press": {
    "message": "Presse"
  },
  "menu.refugee": {
    "message": "Leitfaden für Geflüchtete"
  },
  "menu.supporter": {
    "message": "Leitfaden für Engagierte"
  },
  "message.survey.text": {
    "message": "Mit einem kurzen Feedback unterstützt du das Afeefa Projekt und dessen Weiterentwicklung!"
  },
  "message.survey.title": {
    "message": "Wie nutzt du Afeefa.de?"
  },
  "misc.filterReset": {
    "message": "Filter zurücksetzen"
  },
  "misc.notVerifiedEntry": {
    "message": "Eintrag nicht geprüft"
  },
  "misc.verifiedEntry": {
    "message": "Eintrag geprüft"
  },
  "old.misc.officialEntry": {
    "message": "offizieller Eintrag"
  },
  "old.misc.privateEntry": {
    "message": "privater Eintrag"
  },
  "plus.entry": {
    "message": "Eintrag hinzufügen"
  },
  "plus.feedback": {
    "message": "Feedback senden"
  },
  "prop.arrival": {
    "message": "Anfahrt"
  },
  "prop.author": {
    "message": "Name"
  },
  "prop.category": {
    "message": "Kategorie"
  },
  "prop.city": {
    "message": "Ort"
  },
  "prop.dateday": {
    "message": "Tag genau"
  },
  "prop.dateFrom": {
    "message": "vom"
  },
  "prop.datePeriodic": {
    "message": "Wiederholung"
  },
  "prop.datePeriodic.daily": {
    "message": "täglich"
  },
  "prop.datePeriodic.monthly": {
    "message": "monatlich"
  },
  "prop.datePeriodic.secondWeekly": {
    "message": "alle 2 Wochen"
  },
  "prop.datePeriodic.weekly": {
    "message": "wöchentlich"
  },
  "prop.dateTo": {
    "message": "bis"
  },
  "prop.description": {
    "message": "Beschreibung"
  },
  "prop.facebook": {
    "message": "Facebook"
  },
  "prop.fax": {
    "message": "Fax"
  },
  "prop.forChildren": {
    "message": "für Kinder + Jugendliche"
  },
  "prop.location": {
    "message": "Ort"
  },
  "prop.location.none": {
    "message": "kein Ort angegeben"
  },
  "prop.mail": {
    "message": "E-Mail"
  },
  "prop.message": {
    "message": "Nachricht"
  },
  "prop.name": {
    "message": "Titel"
  },
  "prop.offer.offer": {
    "message": "Angebot"
  },
  "prop.offer.request": {
    "message": "Gesuch"
  },
  "prop.openingHours": {
    "message": "Öffnungszeiten"
  },
  "prop.phone": {
    "message": "Telefon"
  },
  "prop.scope": {
    "message": "nur im Stadtteil aktiv"
  },
  "prop.speakerPublic": {
    "message": "Ansprechpartner"
  },
  "prop.spokenLanguages": {
    "message": "Wir verstehen folgende Sprachen"
  },
  "prop.street": {
    "message": "Straße"
  },
  "prop.supportWanted": {
    "message": "Unterstützer gesucht"
  },
  "prop.timeAt": {
    "message": "um"
  },
  "prop.timeFrom": {
    "message": "von"
  },
  "prop.times": {
    "message": "Zeit"
  },
  "prop.timeTo": {
    "message": "bis"
  },
  "prop.until": {
    "message": "noch bis"
  },
  "prop.web": {
    "message": "Website"
  },
  "prop.zip": {
    "message": "PLZ"
  },
  "search.label.about": {
    "message": "Über Afeefa.de"
  },
  "search.label.activity": {
    "message": "Afeefa mitgestalten"
  },
  "search.label.addentry": {
    "message": "Eintrag hinzufügen"
  },
  "search.label.certified": {
    "message": "Empfohlen vom Sächsischen Flüchtlingsrat"
  },
  "search.label.forchildren": {
    "message": "Angebote für Kinder und Jugendliche"
  },
  "search.label.forwomen": {
    "message": "Angebote für Frauen"
  },
  "search.label.help": {
    "message": "Hilfe"
  },
  "search.label.highlights": {
    "message": "Höhepunkte"
  },
  "search.label.intro": {
    "message": "Tutorial"
  },
  "search.label.iwgr": {
    "message": "Internationale Wochen gegen Rassismus"
  },
  "search.label.lists": {
    "message": "Nützliche Listen"
  },
  "search.label.newentries": {
    "message": "Neue Projekte"
  },
  "search.label.nothingfound": {
    "message": "Leider nichts gefunden :/"
  },
  "search.label.refugeeGuide": {
    "message": "Leitfaden für Geflüchtete"
  },
  "search.label.supporterGuide": {
    "message": "Leitfaden für Engagierte"
  },
  "search.label.supportwanted": {
    "message": "Unterstützer gesucht"
  },
  "search.label.type.0": {
    "message": "Organisation und Projekte"
  },
  "search.label.type.1": {
    "message": "Kleinanzeigen"
  },
  "search.label.upcomingevents": {
    "message": "Kommende Events"
  },
  "search.phrase.forwomen": {
    "message": "#frauen"
  },
  "search.placeholder": {
    "message": "Suche..."
  },
  "search.sublabel.about": {
    "message": "Wissenswertes zum Afeefa Projekt"
  },
  "search.sublabel.addentry": {
    "message": "Hier kannst du einen eigenen Beitrag hinzufügen"
  },
  "search.sublabel.certified": {
    "message": "Diese Projekte werden vom Flüchtlingsrat als unterstützenswert angesehen"
  },
  "search.sublabel.feedback": {
    "message": "Ideen? Kritik? Lob? Wir freuen uns über deine Nachricht!"
  },
  "search.sublabel.forchildren": {
    "message": "Projekte und Aktivitäten von und mit Kindern und Jugendlichen"
  },
  "search.sublabel.forwomen": {
    "message": "Projekte und Aktivitäten von und mit Frauen"
  },
  "search.sublabel.intro": {
    "message": "Einführung in die Funkionen dieser Website"
  },
  "search.sublabel.iwgr": {
    "message": "Alle Veranstaltungen auf einen Blick"
  },
  "search.sublabel.nothingfound": {
    "message": "Irgendwann findet jedes Huhn einmal ein Korn"
  },
  "search.sublabel.refugeeGuide": {
    "message": "Nützliche Hinweise für Ankommende in Dresden"
  },
  "search.sublabel.supporterGuide": {
    "message": "Wichtige Infos rundum ehrenamtliches Engagement"
  },
  "search.sublabel.supportwanted": {
    "message": "Projekte, die dringend Unterstützer suchen"
  },
  "search.tag.certified": {
    "message": "Empfohlen vom SFR"
  },
  "search.tag.supportwanted": {
    "message": "Unterstützer gesucht"
  },
  "tooltip.certificate": {
    "message": "Dieses Projekt ist dem Sächsischen Flüchtlingsrat bekannt und wird von diesem als unterstützenswert angesehen."
  }
}

function createOutput(input, fileName, makeEmptyValues) {
  let finalResult = {};

  for(let key in input) {
    let catTester = key.split('.');
    if(catTester && catTester[0]==='cat' && catTester[catTester.length-1] != 'description') {
      let finalKey = catTester[1];
      let finalValue = input[key].message;
      if(makeEmptyValues) finalValue = '*';
      finalResult[finalKey] = finalValue;
    }
  }
  console.log(finalResult);
  fs.writeFileSync('./'+fileName, JSON.stringify(finalResult, null, 2).replace(/"/g, "'"), 'utf-8'); 
}
/* create files */
createOutput(enInput, 'en.json');
createOutput(deInput, 'de.json');
createOutput(deInput, 'test.json', true);


