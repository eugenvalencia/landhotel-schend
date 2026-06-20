// Inhalts-Modul der FAQ-Seite, gekeyed nach Locale.
// `de` = EXAKT der bisherige deutsche Text (keine Regression). EN/FR/NL: hochwertige,
// faktentreue Übersetzungen (Preise, Zeiten, Telefon, Adressen unverändert).
import type { Locale } from "../index";

export type FaqMeta = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
};
export type QA = { q: string; a: string };

export const faqMeta: Record<Locale, FaqMeta> = {
  de: {
    title: "Häufige Fragen (FAQ)",
    description:
      "Antworten rund um das Landhaus Schend in der Vulkaneifel: Lage, Zimmer, Halbpension, Restaurant, Wandern, Maare, Saison und Direktbuchung.",
    eyebrow: "Häufige Fragen",
    heading: "Was Gäste oft fragen",
    intro: "Antworten zu Ausstattung, Anreise, Restaurant und Buchung — kurz auf den Punkt.",
  },
  en: {
    title: "Frequently Asked Questions (FAQ)",
    description:
      "Answers about Landhaus Schend in the Volcanic Eifel: location, rooms, half board, restaurant, hiking, the maars, season and direct booking.",
    eyebrow: "FAQ",
    heading: "What guests often ask",
    intro: "Answers on amenities, getting here, the restaurant and booking — short and to the point.",
  },
  fr: {
    title: "Questions fréquentes (FAQ)",
    description:
      "Réponses sur le Landhaus Schend dans l'Eifel volcanique : situation, chambres, demi-pension, restaurant, randonnée, les maars, saison et réservation directe.",
    eyebrow: "FAQ",
    heading: "Les questions fréquentes des clients",
    intro: "Réponses sur l'équipement, l'accès, le restaurant et la réservation — en bref.",
  },
  nl: {
    title: "Veelgestelde vragen (FAQ)",
    description:
      "Antwoorden over Landhaus Schend in de Vulkaaneifel: ligging, kamers, halfpension, restaurant, wandelen, de maren, seizoen en direct boeken.",
    eyebrow: "FAQ",
    heading: "Wat gasten vaak vragen",
    intro: "Antwoorden over voorzieningen, aanreis, het restaurant en boeken — kort en helder.",
  },
};

export const faqItems: Record<Locale, QA[]> = {
  de: [
    { q: "Wo liegt das Landhaus Schend genau?", a: "Das Landhaus Schend liegt in der Hauptstraße 9, 54552 Immerath, mitten in der Vulkaneifel — in der Mulde eines erloschenen Vulkans. Mit dem Auto erreichen Sie Cochem an der Mosel in 25 Min, den Nürburgring in 30 Min, Trier in 43 Min und Köln in 94 Min. Fahrzeiten sind Richtwerte, je nach Verkehr." },
    { q: "Wie reise ich am besten an?", a: "Am bequemsten kommen Sie mit dem Auto (Fahrzeiten sind Richtwerte, je nach Verkehr): Cochem an der Mosel 25 Min, Nürburgring 30 Min, Trier 43 Min, Köln 94 Min, Luxemburg 71 Min. Eine kostenlose Wegbeschreibung und Tipps zur Anreise geben wir Ihnen gern telefonisch unter +49 6573 306." },
    { q: "Wie viele Zimmer hat das Hotel und wie sind sie ausgestattet?", a: "Wir haben 21 Zimmer — 19 Doppelzimmer und 2 Familienzimmer, alle Nichtraucher. Jedes Zimmer hat Dusche/WC, Telefon, Sat-TV, kostenfreies WLAN und einen Safe; die meisten Doppelzimmer haben Balkon oder Terrasse." },
    { q: "Was kostet eine Übernachtung?", a: "Doppelzimmer ab 57 € pro Person/Nacht inklusive Frühstücksbuffet. Doppelzimmer zur Einzelnutzung ab 80 € pro Nacht. Familienzimmer (bis 4 Personen) ab 170 €, Nutzung mit 2 Personen ab 130 €. Kinder bis 2 Jahre übernachten kostenfrei, bis 12 Jahre zum halben Preis." },
    { q: "Gibt es Einzelzimmer?", a: "Klassische Einzelzimmer haben wir nicht. Alleinreisende buchen ein Doppelzimmer zur Einzelnutzung — ab 80 € pro Nacht inklusive Frühstücksbuffet. So haben Sie deutlich mehr Platz als in einem typischen Einzelzimmer." },
    { q: "Habt ihr Zimmer mit Balkon?", a: "Ja, die meisten unserer Zimmer haben einen Balkon oder eine Terrasse mit Blick in die Vulkaneifel-Landschaft. Wenn Sie ein Zimmer mit Balkon möchten, sagen Sie uns bei der Buchung Bescheid — wir berücksichtigen den Wunsch gern." },
    { q: "Ist Frühstück inklusive?", a: "Ja, ein Frühstücksbuffet mit frischen, regionalen Produkten aus der Eifel ist in jedem Übernachtungspreis enthalten. Wer ohne Frühstück anreisen möchte, erhält 8 € pro Person und Nacht Nachlass — sagen Sie uns einfach Bescheid. Auch Gäste ohne Übernachtung sind herzlich zum Frühstück willkommen (15 € pro Person). Auf Wunsch buchen Sie zusätzlich Halbpension (+23 € pro Person/Tag) mit einem 3-Gang-Menü aus der Eifeler Landküche." },
    { q: "Bieten Sie Halbpension an?", a: "Ja, Halbpension ist auf Wunsch für +23 € pro Person und Tag buchbar — ein 3-Gang-Menü aus frischer Eifeler Landküche. Das Frühstücksbuffet ist immer im Übernachtungspreis enthalten. Geben Sie uns bei der Buchung einfach Bescheid." },
    { q: "Hat das Restaurant einen Ruhetag?", a: "Ruhetage sind Montag, Dienstag und Mittwoch — an diesen Tagen ist das À-la-carte-Restaurant geschlossen. Auf Anmeldung verwöhnen wir Sie aber gern mit unseren liebevoll kreierten Menüs. À-la-carte servieren wir Donnerstag bis Samstag von 17:30 bis 20:00 Uhr und sonntags von 12:00 bis 14:00 Uhr sowie 17:30 bis 20:00 Uhr. Die Speisekarte wechselt wöchentlich; das Wochenmenü geben wir morgens bekannt." },
    { q: "Kann ich im Restaurant essen, ohne im Hotel zu übernachten?", a: "Ja, unser Landhaus Restaurant ist auch für Tagesgäste offen — Einheimische und Vorbeireisende sind herzlich willkommen. Wir servieren Eifeler Landküche und internationale Spezialitäten sowie frisch gezapftes Bitburger." },
    { q: "Kann ich mit Hund übernachten?", a: "Hunde sind in unserer Dorfgaststätte willkommen. Im Restaurant-Hauptbereich und in den Zimmern sind Hunde leider nicht erlaubt — dafür bitten wir um Ihr Verständnis." },
    { q: "Sind Sie für Familien mit Kindern geeignet?", a: "Ja. Wir haben zwei Familienzimmer (bis 4 Personen, ab 170 €) mit zwei getrennten Räumen und gemeinsamem Bad (ohne Balkon), auf Wunsch mit zusätzlichen Kinderbetten. Kinder bis 2 Jahre übernachten kostenfrei, bis 12 Jahre zum halben Preis." },
    { q: "Gibt es kostenlose Parkplätze?", a: "Ja, im Hof stehen kostenlose Parkplätze zur Verfügung. Eine Reservierung ist nicht nötig — bei Anreise mit mehreren Fahrzeugen sagen Sie uns vorab gern Bescheid." },
    { q: "Gibt es einen Stellplatz für Motorräder?", a: "Ja, wir haben kostenlose Motorrad-Stellplätze direkt im Hof — beliebt bei Fahrern rund um den Nürburgring und auf den kurvenreichen Straßen der Vulkaneifel. Eine abschließbare Motorradgarage haben wir nicht." },
    { q: "Können Sie Familien- oder Firmenfeiern ausrichten?", a: "Ja. Im Eichelbergzimmer feiern bis zu 70 Personen, im Kaminzimmer 35 Personen, in Dorfgaststätte und auf der Sonnenterrasse jeweils 40 Personen. Ob Geburtstag, Taufe, Hochzeit oder Firmen-Event — wir stellen Menü oder Buffet individuell mit Ihnen zusammen." },
    { q: "Welche Maare können wir vom Hotel aus erwandern?", a: "Das Immerath-Maar erreichen Sie direkt zu Fuß. In rund 15–30 Autominuten liegen die Dauner Maare (Gemündener, Weinfelder, Schalkenmehrener Maar) sowie Pulvermaar, Holzmaar und Meerfelder Maar. Wanderkarten und Tourentipps geben wir Ihnen kostenlos mit." },
    { q: "Welche Wanderwege starten in der Nähe?", a: "Wir liegen an der Eifelsteig-Etappe Daun ↔ Manderscheid; der Premium-Wanderweg führt nahe am Hotel vorbei. Auch der Maare-Mosel-Radweg und viele Rundwege ab Immerath beginnen direkt vor der Tür. Kostenlose Wanderkarten und persönliche Tourenempfehlungen halten wir für Sie bereit." },
    { q: "Was gibt es in der Umgebung zu sehen?", a: "In der Nähe: Maarmuseum Manderscheid, Vulkanhaus Strohn, Wildpark Daun, der Nürburgring und die Mosel mit Cochem (ca. 40 Min). Der Sternenpark im Nationalpark Eifel — erster Dark-Sky-Park Deutschlands — liegt etwa 60–80 Min entfernt." },
    { q: "Warum direkt beim Hotel buchen statt über ein Portal?", a: "Bei Direktbuchung über unsere Website oder telefonisch unter +49 6573 306 zahlen Sie keine Vermittlungs-Provision — provisionsfrei, ohne Aufschlag eines Buchungsportals. Außerdem sind wir bei Sonderwünschen flexibler — und Sie unterstützen direkt unser Familienunternehmen, das es seit 1856 gibt." },
    { q: "Wann hat das Hotel Saison?", a: "Unsere aktuellen Öffnungs- und Saisonzeiten erfragen Sie am besten direkt bei uns — telefonisch unter +49 6573 306 oder per E-Mail an info@landhaus-schend.de. Wir geben Ihnen gern Auskunft." },
    { q: "Wie kann ich direkt buchen?", a: "Direkt über unsere Website mit dem Button 'Anfragen' oder telefonisch unter +49 6573 306. Die Direktbuchung ist provisionsfrei — ohne Aufschlag eines Buchungsportals." },
  ],
  en: [
    { q: "Where exactly is Landhaus Schend?", a: "Landhaus Schend is at Hauptstraße 9, 54552 Immerath, in the heart of the Volcanic Eifel — in the basin of an extinct volcano. By car you reach Cochem on the Moselle in 25 min, the Nürburgring in 30 min, Trier in 43 min and Cologne in 94 min. Travel times are approximate and depend on traffic." },
    { q: "How do I best get there?", a: "The most convenient way is by car (travel times approximate, depending on traffic): Cochem on the Moselle 25 min, Nürburgring 30 min, Trier 43 min, Cologne 94 min, Luxembourg 71 min. We're glad to give you free directions and arrival tips by phone on +49 6573 306." },
    { q: "How many rooms does the hotel have and how are they equipped?", a: "We have 21 rooms — 19 double rooms and 2 family rooms, all non-smoking. Every room has a shower/WC, telephone, satellite TV, free Wi-Fi and a safe; most double rooms have a balcony or terrace." },
    { q: "What does an overnight stay cost?", a: "Double room from €57 per person/night including breakfast buffet. Double room for single use from €80 per night. Family room (up to 4 people) from €170, used by 2 people from €130. Children up to 2 years stay free, up to 12 years at half price." },
    { q: "Are there single rooms?", a: "We don't have classic single rooms. Solo travellers book a double room for single use — from €80 per night including breakfast buffet. That gives you considerably more space than a typical single room." },
    { q: "Do you have rooms with a balcony?", a: "Yes, most of our rooms have a balcony or terrace with a view over the Volcanic Eifel landscape. If you'd like a room with a balcony, let us know when booking — we're happy to take your wish into account." },
    { q: "Is breakfast included?", a: "Yes, a breakfast buffet with fresh, regional products from the Eifel is included in every room rate. If you'd rather arrive without breakfast, you get €8 off per person and night — just let us know. Guests not staying overnight are also warmly welcome for breakfast (€15 per person). On request you can additionally book half board (+€23 per person/day) with a 3-course menu of Eifel country cuisine." },
    { q: "Do you offer half board?", a: "Yes, half board can be booked on request for +€23 per person and day — a 3-course menu of fresh Eifel country cuisine. The breakfast buffet is always included in the room rate. Just let us know when booking." },
    { q: "Does the restaurant have a closing day?", a: "Closing days are Monday, Tuesday and Wednesday — the à la carte restaurant is closed then. By arrangement, however, we're glad to treat you to our lovingly created menus. We serve à la carte Thursday to Saturday from 5:30 to 8:00 pm and on Sundays from 12:00 to 2:00 pm and 5:30 to 8:00 pm. The menu changes weekly; we announce the weekly menu each morning." },
    { q: "Can I eat at the restaurant without staying at the hotel?", a: "Yes, our Landhaus restaurant is also open to day guests — locals and passers-by are warmly welcome. We serve Eifel country cuisine and international specialities as well as freshly tapped Bitburger." },
    { q: "Can I stay with a dog?", a: "Dogs are welcome in our village tavern (Dorfgaststätte). In the main restaurant area and in the rooms dogs are unfortunately not allowed — we ask for your understanding." },
    { q: "Are you suitable for families with children?", a: "Yes. We have two family rooms (up to 4 people, from €170) with two separate rooms and a shared bathroom (no balcony), with extra children's beds on request. Children up to 2 years stay free, up to 12 years at half price." },
    { q: "Is there free parking?", a: "Yes, free parking is available in the courtyard. No reservation is needed — if you arrive with several vehicles, just let us know in advance." },
    { q: "Is there parking for motorcycles?", a: "Yes, we have free motorcycle parking right in the courtyard — popular with riders around the Nürburgring and on the winding roads of the Volcanic Eifel. We don't have a lockable motorcycle garage." },
    { q: "Are you able to host family or corporate celebrations?", a: "Yes. The Eichelberg room seats up to 70 people, the fireplace room 35, and the village tavern and sun terrace 40 each. Whether a birthday, christening, wedding or company event — we put together the menu or buffet individually with you." },
    { q: "Which maars can we hike to from the hotel?", a: "The Immerath Maar is reachable directly on foot. Within about 15–30 minutes by car lie the Daun maars (Gemündener, Weinfelder, Schalkenmehrener Maar) as well as the Pulvermaar, Holzmaar and Meerfelder Maar. We provide hiking maps and tour tips free of charge." },
    { q: "Which hiking trails start nearby?", a: "We're on the Eifelsteig stage Daun ↔ Manderscheid; the premium trail passes close to the hotel. The Maare-Mosel cycle path and many circular routes from Immerath also start right at the door. We keep free hiking maps and personal tour recommendations ready for you." },
    { q: "What is there to see in the area?", a: "Nearby: the Maar Museum in Manderscheid, the Vulkanhaus in Strohn, the Daun wildlife park, the Nürburgring and the Moselle with Cochem (approx. 40 min). The Star Park in the Eifel National Park — Germany's first Dark Sky Park — is about 60–80 min away." },
    { q: "Why book directly with the hotel instead of via a portal?", a: "When you book directly via our website or by phone on +49 6573 306 you pay no commission — commission-free, without a booking portal's surcharge. We're also more flexible with special requests — and you directly support our family business, which has existed since 1856." },
    { q: "When is the hotel's season?", a: "It's best to ask us directly about current opening and season times — by phone on +49 6573 306 or by email to info@landhaus-schend.de. We're happy to help." },
    { q: "How can I book directly?", a: "Directly via our website using the 'Enquire' button or by phone on +49 6573 306. Direct booking is commission-free — without a booking portal's surcharge." },
  ],
  fr: [
    { q: "Où se trouve exactement le Landhaus Schend ?", a: "Le Landhaus Schend se situe Hauptstraße 9, 54552 Immerath, au cœur de l'Eifel volcanique — dans la cuvette d'un volcan éteint. En voiture, vous rejoignez Cochem sur la Moselle en 25 min, le Nürburgring en 30 min, Trèves en 43 min et Cologne en 94 min. Les temps de trajet sont indicatifs, selon le trafic." },
    { q: "Comment venir au mieux ?", a: "Le plus simple est en voiture (temps indicatifs, selon le trafic) : Cochem sur la Moselle 25 min, Nürburgring 30 min, Trèves 43 min, Cologne 94 min, Luxembourg 71 min. Nous vous donnons volontiers un itinéraire et des conseils d'accès gratuitement par téléphone au +49 6573 306." },
    { q: "Combien de chambres l'hôtel compte-t-il et quel est leur équipement ?", a: "Nous avons 21 chambres — 19 chambres doubles et 2 chambres familiales, toutes non-fumeurs. Chaque chambre dispose d'une douche/WC, d'un téléphone, de la TV satellite, du Wi-Fi gratuit et d'un coffre-fort ; la plupart des chambres doubles ont un balcon ou une terrasse." },
    { q: "Combien coûte une nuitée ?", a: "Chambre double à partir de 57 € par personne/nuit, petit-déjeuner buffet inclus. Chambre double en usage individuel à partir de 80 € la nuit. Chambre familiale (jusqu'à 4 personnes) à partir de 170 €, en occupation par 2 personnes à partir de 130 €. Les enfants jusqu'à 2 ans séjournent gratuitement, jusqu'à 12 ans à moitié prix." },
    { q: "Y a-t-il des chambres simples ?", a: "Nous n'avons pas de chambres simples classiques. Les voyageurs seuls réservent une chambre double en usage individuel — à partir de 80 € la nuit, petit-déjeuner buffet inclus. Vous disposez ainsi de bien plus d'espace qu'une chambre simple habituelle." },
    { q: "Avez-vous des chambres avec balcon ?", a: "Oui, la plupart de nos chambres ont un balcon ou une terrasse avec vue sur les paysages de l'Eifel volcanique. Si vous souhaitez une chambre avec balcon, dites-le-nous à la réservation — nous en tiendrons compte avec plaisir." },
    { q: "Le petit-déjeuner est-il inclus ?", a: "Oui, un petit-déjeuner buffet avec des produits frais et régionaux de l'Eifel est compris dans chaque tarif. Si vous préférez venir sans petit-déjeuner, vous bénéficiez d'une remise de 8 € par personne et par nuit — dites-le-nous simplement. Les hôtes sans nuitée sont également les bienvenus pour le petit-déjeuner (15 € par personne). Sur demande, vous pouvez ajouter la demi-pension (+23 € par personne/jour) avec un menu 3 plats de la cuisine régionale de l'Eifel." },
    { q: "Proposez-vous la demi-pension ?", a: "Oui, la demi-pension est disponible sur demande pour +23 € par personne et par jour — un menu 3 plats de cuisine fraîche de l'Eifel. Le petit-déjeuner buffet est toujours compris dans le tarif. Indiquez-le-nous simplement à la réservation." },
    { q: "Le restaurant a-t-il un jour de fermeture ?", a: "Les jours de fermeture sont le lundi, le mardi et le mercredi — le restaurant à la carte est alors fermé. Sur réservation, nous vous régalons toutefois volontiers de nos menus préparés avec soin. Nous servons à la carte du jeudi au samedi de 17h30 à 20h00 et le dimanche de 12h00 à 14h00 ainsi que de 17h30 à 20h00. La carte change chaque semaine ; le menu de la semaine est annoncé le matin." },
    { q: "Puis-je manger au restaurant sans loger à l'hôtel ?", a: "Oui, notre restaurant Landhaus est aussi ouvert aux clients de passage — habitants et voyageurs sont les bienvenus. Nous servons une cuisine régionale de l'Eifel et des spécialités internationales, ainsi que la Bitburger fraîchement tirée." },
    { q: "Puis-je séjourner avec un chien ?", a: "Les chiens sont les bienvenus dans notre auberge du village (Dorfgaststätte). Dans la salle principale du restaurant et dans les chambres, les chiens ne sont malheureusement pas admis — merci de votre compréhension." },
    { q: "Êtes-vous adaptés aux familles avec enfants ?", a: "Oui. Nous avons deux chambres familiales (jusqu'à 4 personnes, à partir de 170 €) avec deux pièces séparées et une salle de bain commune (sans balcon), avec lits enfants supplémentaires sur demande. Les enfants jusqu'à 2 ans séjournent gratuitement, jusqu'à 12 ans à moitié prix." },
    { q: "Y a-t-il un parking gratuit ?", a: "Oui, un parking gratuit est disponible dans la cour. Aucune réservation n'est nécessaire — si vous arrivez avec plusieurs véhicules, prévenez-nous à l'avance." },
    { q: "Y a-t-il un emplacement pour les motos ?", a: "Oui, nous avons un stationnement moto gratuit directement dans la cour — apprécié des motards autour du Nürburgring et sur les routes sinueuses de l'Eifel volcanique. Nous ne disposons pas de garage à motos fermé." },
    { q: "Pouvez-vous organiser des fêtes familiales ou d'entreprise ?", a: "Oui. La salle Eichelberg accueille jusqu'à 70 personnes, la salle cheminée 35, l'auberge du village et la terrasse ensoleillée 40 chacune. Anniversaire, baptême, mariage ou événement d'entreprise — nous composons le menu ou le buffet sur mesure avec vous." },
    { q: "Quels maars peut-on rejoindre à pied depuis l'hôtel ?", a: "Le Maar d'Immerath est accessible directement à pied. À environ 15 à 30 minutes en voiture se trouvent les maars de Daun (Gemündener, Weinfelder, Schalkenmehrener Maar) ainsi que le Pulvermaar, le Holzmaar et le Meerfelder Maar. Nous vous remettons gratuitement des cartes de randonnée et des conseils d'itinéraires." },
    { q: "Quels sentiers de randonnée partent à proximité ?", a: "Nous sommes sur l'étape de l'Eifelsteig Daun ↔ Manderscheid ; ce sentier premium passe tout près de l'hôtel. La piste cyclable Maare-Mosel et de nombreux circuits au départ d'Immerath commencent aussi devant la porte. Nous tenons à votre disposition des cartes de randonnée gratuites et des recommandations d'itinéraires personnalisées." },
    { q: "Que voir dans les environs ?", a: "À proximité : le musée des maars à Manderscheid, la Vulkanhaus à Strohn, le parc animalier de Daun, le Nürburgring et la Moselle avec Cochem (env. 40 min). Le parc étoilé du parc national de l'Eifel — premier Dark Sky Park d'Allemagne — se trouve à environ 60 à 80 min." },
    { q: "Pourquoi réserver directement auprès de l'hôtel plutôt que via un portail ?", a: "En réservant directement via notre site ou par téléphone au +49 6573 306, vous ne payez aucune commission — sans commission, sans supplément de portail de réservation. Nous sommes en outre plus flexibles pour les demandes particulières — et vous soutenez directement notre entreprise familiale, qui existe depuis 1856." },
    { q: "Quelle est la saison de l'hôtel ?", a: "Le mieux est de vous renseigner directement auprès de nous sur les horaires d'ouverture et de saison actuels — par téléphone au +49 6573 306 ou par e-mail à info@landhaus-schend.de. Nous vous renseignons avec plaisir." },
    { q: "Comment réserver directement ?", a: "Directement via notre site avec le bouton « Demander » ou par téléphone au +49 6573 306. La réservation directe est sans commission — sans supplément de portail de réservation." },
  ],
  nl: [
    { q: "Waar ligt Landhaus Schend precies?", a: "Landhaus Schend ligt aan de Hauptstraße 9, 54552 Immerath, midden in de Vulkaaneifel — in de kom van een uitgedoofde vulkaan. Met de auto bereikt u Cochem aan de Moezel in 25 min, de Nürburgring in 30 min, Trier in 43 min en Keulen in 94 min. Reistijden zijn richtwaarden, afhankelijk van het verkeer." },
    { q: "Hoe reis ik het beste?", a: "Het handigst komt u met de auto (reistijden bij benadering, afhankelijk van het verkeer): Cochem aan de Moezel 25 min, Nürburgring 30 min, Trier 43 min, Keulen 94 min, Luxemburg 71 min. We geven u graag gratis een routebeschrijving en aanreistips telefonisch via +49 6573 306." },
    { q: "Hoeveel kamers heeft het hotel en hoe zijn ze ingericht?", a: "We hebben 21 kamers — 19 tweepersoonskamers en 2 familiekamers, allemaal rookvrij. Elke kamer heeft douche/wc, telefoon, satelliet-tv, gratis wifi en een kluis; de meeste tweepersoonskamers hebben een balkon of terras." },
    { q: "Wat kost een overnachting?", a: "Tweepersoonskamer vanaf € 57 per persoon/nacht inclusief ontbijtbuffet. Tweepersoonskamer voor eenpersoonsgebruik vanaf € 80 per nacht. Familiekamer (tot 4 personen) vanaf € 170, gebruik door 2 personen vanaf € 130. Kinderen tot 2 jaar overnachten gratis, tot 12 jaar voor de halve prijs." },
    { q: "Zijn er eenpersoonskamers?", a: "Klassieke eenpersoonskamers hebben we niet. Alleenreizenden boeken een tweepersoonskamer voor eenpersoonsgebruik — vanaf € 80 per nacht inclusief ontbijtbuffet. Zo heeft u veel meer ruimte dan in een gewone eenpersoonskamer." },
    { q: "Hebben jullie kamers met balkon?", a: "Ja, de meeste van onze kamers hebben een balkon of terras met uitzicht over het landschap van de Vulkaaneifel. Wilt u een kamer met balkon, geef het dan door bij de boeking — we houden er graag rekening mee." },
    { q: "Is ontbijt inbegrepen?", a: "Ja, een ontbijtbuffet met verse, regionale producten uit de Eifel is bij elke overnachtingsprijs inbegrepen. Wie zonder ontbijt wil komen, krijgt € 8 per persoon en nacht korting — laat het ons gewoon weten. Ook gasten zonder overnachting zijn van harte welkom voor het ontbijt (€ 15 per persoon). Op verzoek boekt u aanvullend halfpension (+€ 23 per persoon/dag) met een 3-gangenmenu uit de Eifeler streekkeuken." },
    { q: "Bieden jullie halfpension aan?", a: "Ja, halfpension is op verzoek boekbaar voor +€ 23 per persoon en dag — een 3-gangenmenu uit de verse Eifeler streekkeuken. Het ontbijtbuffet is altijd bij de overnachtingsprijs inbegrepen. Geef het gewoon door bij de boeking." },
    { q: "Heeft het restaurant een rustdag?", a: "Rustdagen zijn maandag, dinsdag en woensdag — dan is het à-la-carterestaurant gesloten. Op aanvraag verwennen we u echter graag met onze met zorg samengestelde menu's. À la carte serveren we donderdag t/m zaterdag van 17:30 tot 20:00 uur en op zondag van 12:00 tot 14:00 uur en van 17:30 tot 20:00 uur. De kaart wisselt wekelijks; het weekmenu maken we 's ochtends bekend." },
    { q: "Kan ik in het restaurant eten zonder in het hotel te overnachten?", a: "Ja, ons Landhaus-restaurant is ook open voor dagjesgasten — buurtbewoners en passanten zijn van harte welkom. We serveren Eifeler streekgerechten en internationale specialiteiten en vers getapt Bitburger." },
    { q: "Kan ik met een hond overnachten?", a: "Honden zijn welkom in onze dorpsgaststätte (Dorfgaststätte). In het hoofdgedeelte van het restaurant en in de kamers zijn honden helaas niet toegestaan — we vragen om uw begrip." },
    { q: "Zijn jullie geschikt voor gezinnen met kinderen?", a: "Ja. We hebben twee familiekamers (tot 4 personen, vanaf € 170) met twee aparte ruimtes en een gedeelde badkamer (zonder balkon), op verzoek met extra kinderbedden. Kinderen tot 2 jaar overnachten gratis, tot 12 jaar voor de halve prijs." },
    { q: "Is er gratis parkeergelegenheid?", a: "Ja, op de binnenplaats is gratis parkeren beschikbaar. Reserveren is niet nodig — komt u met meerdere voertuigen, laat het ons dan vooraf weten." },
    { q: "Is er een plek voor motoren?", a: "Ja, we hebben gratis motorparkeerplekken direct op de binnenplaats — geliefd bij rijders rond de Nürburgring en op de bochtige wegen van de Vulkaaneifel. Een afsluitbare motorgarage hebben we niet." },
    { q: "Kunnen jullie familie- of bedrijfsfeesten verzorgen?", a: "Ja. In de Eichelbergzaal vieren tot 70 personen, in de haardkamer 35, in de dorpsgaststätte en op het zonneterras elk 40 personen. Of het nu een verjaardag, doop, bruiloft of bedrijfsevenement is — we stellen menu of buffet samen met u op maat samen." },
    { q: "Welke maren kunnen we vanaf het hotel wandelen?", a: "Het Immerath-Maar bereikt u direct te voet. Op zo'n 15–30 autominuten liggen de Dauner maren (Gemündener, Weinfelder, Schalkenmehrener Maar) en het Pulvermaar, Holzmaar en Meerfelder Maar. Wandelkaarten en routetips geven we u gratis mee." },
    { q: "Welke wandelroutes starten in de buurt?", a: "We liggen aan de Eifelsteig-etappe Daun ↔ Manderscheid; het premium wandelpad loopt vlak langs het hotel. Ook het Maare-Mosel-fietspad en veel rondwandelingen vanuit Immerath beginnen direct voor de deur. Gratis wandelkaarten en persoonlijke routetips houden we voor u klaar." },
    { q: "Wat is er in de omgeving te zien?", a: "In de buurt: het Maarmuseum in Manderscheid, het Vulkanhaus in Strohn, het Wildpark Daun, de Nürburgring en de Moezel met Cochem (ca. 40 min). Het Sterrenpark in het Nationaal Park Eifel — het eerste Dark Sky Park van Duitsland — ligt ongeveer 60–80 min verderop." },
    { q: "Waarom direct bij het hotel boeken in plaats van via een portaal?", a: "Bij een directe boeking via onze website of telefonisch op +49 6573 306 betaalt u geen bemiddelingscommissie — provisievrij, zonder toeslag van een boekingsportaal. Bovendien zijn we flexibeler bij bijzondere wensen — en u steunt direct ons familiebedrijf, dat al sinds 1856 bestaat." },
    { q: "Wanneer heeft het hotel seizoen?", a: "Vraag onze actuele openings- en seizoenstijden het beste rechtstreeks bij ons op — telefonisch via +49 6573 306 of per e-mail naar info@landhaus-schend.de. We helpen u graag." },
    { q: "Hoe kan ik direct boeken?", a: "Direct via onze website met de knop 'Aanvragen' of telefonisch op +49 6573 306. Direct boeken is provisievrij — zonder toeslag van een boekingsportaal." },
  ],
};
