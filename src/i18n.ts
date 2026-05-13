import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  de: {
    translation: {
      nav: {
        home: "STARTSEITE",
        rooms: "ZIMMER",
        pakete: "PAKETE",
        gastro: "GASTRONOMIE",
        about: "ÜBER UNS",
        reviews: "BEWERTUNGEN",
        faq: "FAQ",
        location: "URLAUBSREGION",
        book: "Jetzt buchen",
        subtitle: "Ihr Familienhotel in Immerath | Vulkaneifel",
      },
      hero: {
        eyebrow: "Kurzurlaub & Wanderhotel in der Vulkaneifel",
        title: "Willkommen im Landhotel Schend",
        text:
          "Ihr ★★★ Superior Hotel in Immerath — Eifelsteig, Maare-Mosel-Radweg und Nürburgring direkt vor der Tür. 21 Zimmer mit Balkon, Sauna & Wellness, Eifeler Landküche und kostenlose Motorradgarage. Direkt buchen — provisionsfrei, ohne OTA-Aufpreis.",
        bookDirect: "Jetzt direkt buchen",
        starsBadge: "3 STERNE SUPERIOR",
      },
      usps: {
        parking: "Kostenlose Parkplätze — videoüberwacht",
        moto: "Genügend Motorrad-Parkplätze — videoüberwacht",
        sauna: "Sauna & Wellness",
        restaurant: "Hauseigenes Restaurant",
        rooms: "21 Zimmer mit Balkon/Terrasse",
        wifi: "Kostenloses WLAN",
        breakfast: "Großes Frühstücksbuffet",
        rating: "Booking.com 8.5 · Tripadvisor #1",
      },
      rooms: {
        eyebrow: "Unsere Zimmer",
        title: "Zu Gast im Landhotel Schend",
        intro:
          "21 individuell gestaltete Zimmer und Suiten — alle mit Balkon oder Terrasse und Blick in die Vulkaneifel.",
        from: "ab",
        check: "Verfügbarkeit prüfen",
      },
      restaurant: {
        eyebrow: "Kulinarik",
        title: "Landhaus Restaurant & Terrasse",
        p1:
          "Für den großen Hunger ist unser besonders gemütliches Restaurant genau die richtige Wahl. Dort werden Ihnen Eifeler und Internationale Spezialitäten in stilvoller Atmosphäre serviert. Wir verwöhnen Sie mit Produkten der Eifeler Landküche und frisch gezapftem Bitburger Bier. Eine separate Karte für Kinder und eine Kinderspielecke bieten auch Familien ein attraktives Angebot. Hunde sind lediglich in der Dorfgaststätte erlaubt.",
        p2: "Gruppen und Veranstaltungen gerne auf Anfrage auch zum Frühstück, Kaffee und Mittag.",
        p3:
          "Wir verwenden ausschließlich qualitativ hochwertige frische Zutaten. Ausgewählte Delikatessen und saisonale Spezialitäten unserer Speisekarte lassen selbst Gäste mit verwöhnten Gaumen ein Lob an unseren Küchenchef aussprechen.",
        p4:
          "Neben vielfältigen Gerichten bieten wir Ihnen eine umfangreiche Getränkekarte und eine große Auswahl an erlesenen Weinen.",
        hours: "Öffnungszeiten",
        monSat: "Montag – Samstag",
        sun: "Sonntag",
      },
      feiern: {
        eyebrow: "Wir organisieren Ihre Feste",
        title: "Familien- & Firmenfeiern",
        text:
          "Laden Sie ein zu einem unvergesslichen Fest in ansprechendem Ambiente. Wir kümmern uns mit einem erfahrenen Team um die Details: von der Planung bis zur Dekoration und vom Rahmenprogramm bis zum von Ihnen gewünschten Menü oder Büffet. Feiern Sie bei uns Geburtstag, Kommunion oder Taufe wie auch geschäftliche Anlässe vom Kundenevent bis zur Weihnachtsfeier. Im eleganten Eichelbergzimmer können bis zu 70 Personen speisen, im behaglichen Kaminzimmer 35 und in unserer Dorfgaststätte und auf der Sonnenterrasse jeweils 40. Wir freuen uns, Sie beraten zu dürfen, und stellen Ihnen ein individuelles Paket zusammen.",
      },
      pakete: {
        eyebrow: "Pakete & Angebote",
        title: "Unsere Eifel-Pakete",
        intro:
          "Wandern, Radfahren oder einfach nur entspannen — wählen Sie Ihr passendes Paket für Ihre Auszeit in der Vulkaneifel.",
        more: "Mehr Infos",
        back: "Alle Pakete",
        included: "Im Paket enthalten",
        description: "Beschreibung",
        descriptionTitle: "Ihr Aufenthalt im Detail",
        photos: "Eindrücke",
        photosTitle: "Fotos zum Paket",
        otherTitle: "Auch interessant",
        otherEyebrow: "Weitere Pakete",
        bookNow: "Jetzt buchen",
      },
      gallery: {
        eyebrow: "Galerie",
        title: "Eindrücke aus der Vulkaneifel",
      },
      footer: {
        tagline:
          "Ihr Familienhotel in der Vulkaneifel — mit Sauna, Wellness und hauseigenem Restaurant.",
        quick: "Quick Links",
        home: "Startseite",
        bookRoom: "Zimmer buchen",
        gastro: "Gastronomie",
        contact: "Kontakt",
        contactTitle: "Kontakt",
        impressum: "Impressum",
        privacy: "Datenschutz",
      },
      paketDetails: {
        "eifler-wandertage": {
          title: "Genussvolle Eifler Wandertage",
          intro: "Erleben Sie die Vulkaneifel auf den schönsten Wanderwegen Deutschlands – mit Eifelsteig, Lieserpfad und unzähligen Themenrouten direkt vor unserer Haustür.",
          details: "Unser erfahrenes Team stellt Ihnen täglich passende Routen zusammen – ob gemütliche Tagestour rund um die Maare oder anspruchsvolle Etappen auf dem Eifelsteig. Nach dem Wandertag erwartet Sie ein liebevoll zubereitetes Abendmenü mit regionalen Zutaten und ein entspannender Saunabesuch.",
          highlights: [
            "4 Übernachtungen inkl. großem Frühstücksbuffet",
            "3× Eifeler 3-Gang-Abendmenü im Landhaus Restaurant",
            "Wanderkarte & persönliche Tourenempfehlungen",
            "Lunchpaket für unterwegs",
            "Wellness-Zugang zu Sauna & Ruhebereich",
          ],
        },
        "rad-erlebnisse": {
          title: "Eifler Rad-Erlebnisse",
          intro: "Sattelfest durch die Vulkaneifel – Maare-Mosel-Radweg, Kylltal-Radweg und herausfordernde Mountainbike-Strecken starten direkt am Hotel.",
          details: "Ob Genussradler oder ambitionierter Mountainbiker – unsere Empfehlungen reichen vom familienfreundlichen Maare-Mosel-Radweg bis zu knackigen Trails durch die Vulkaneifel. Nach der Tour locken Sauna, Massage auf Wunsch und ein deftiges Eifeler Menü.",
          highlights: [
            "3 Übernachtungen mit Frühstücksbuffet",
            "2× Eifeler Abendmenü",
            "Abschließbarer Fahrradraum mit Ladestation für E-Bikes",
            "Streckenkarten & GPX-Tracks",
            "Wäscheservice für Funktionsbekleidung",
          ],
        },
        "erholung-entschleunigung": {
          title: "Tage der Erholung und Entschleunigung",
          intro: "Einfach mal abschalten – ankommen, durchatmen und die wohltuende Stille der Eifel genießen.",
          details: "Dieses Paket ist eine Auszeit für Körper und Geist. Lassen Sie sich kulinarisch verwöhnen, genießen Sie ausgedehnte Saunagänge und finden Sie zur Ruhe – mit Blick in die sanften Hügel der Vulkaneifel.",
          highlights: [
            "3 Übernachtungen mit Frühstücksbuffet",
            "1× Candle-Light-Dinner zur Begrüßung",
            "Sauna, Wellnessbereich und Ruhezone",
            "Frische Blumen & Obstteller im Zimmer",
            "Spaziergangs-Empfehlungen rund um Schalkenmehren",
          ],
        },
        "eifelgold-weissdornhecken": {
          title: '"Eifelgold" und Weißdornhecken',
          intro: "Frühling in der Vulkaneifel – wenn Ginster und Weißdorn die Landschaft in Gold und Weiß tauchen, beginnt die schönste Wanderzeit des Jahres.",
          details: "Ein Paket für Naturliebhaber: Erleben Sie die Eifel in voller Blüte, lernen Sie auf einer geführten Tour die Besonderheiten der Vulkanlandschaft kennen und genießen Sie täglich frische Eifeler Küche.",
          highlights: [
            "5 Übernachtungen inkl. Halbpension",
            "Geführte Themenwanderung mit zertifiziertem Wanderführer",
            "Picknickkorb für eine Tagestour",
            "Eintritt in das Naturkundemuseum Daun",
            "Wellness-Zugang inklusive",
          ],
        },
        "bunt-sind-schon-die-waelder": {
          title: '"Bunt sind schon die Wälder"',
          intro: "Wenn sich die Wälder rund um die Eifelmaare bunt färben, beginnt die zauberhafteste Jahreszeit – Goldener Herbst zum Wandern, Genießen und Verweilen.",
          details: "Goldenes Licht über den Maaren, dampfende Tassen Tee nach der Wanderung und herzhafte Wildgerichte am Abend – dieses Paket fängt die magische Atmosphäre des Eifel-Herbstes ein.",
          highlights: [
            "4 Übernachtungen mit Frühstücksbuffet",
            "3× Herbst-Menü mit saisonalen Spezialitäten",
            "Wanderkarte „Herbst rund um die Maare\"",
            "Wildgericht-Abend nach Wahl",
            "Sauna & Ruhebereich inklusive",
          ],
        },
        "zimmer-ohne-paket": {
          title: "Zimmer ohne Paket buchen",
          intro: "Sie möchten flexibel bleiben? Buchen Sie eines unserer 21 Zimmer ohne Paket – ganz nach Ihren Wünschen.",
          details: "Alle Zimmer verfügen über Balkon oder Terrasse mit Blick in die Vulkaneifel. Wählen Sie Ihren Zeitraum frei und stellen Sie sich Ihren Aufenthalt individuell zusammen – wir kümmern uns um den Rest.",
          highlights: [
            "Doppelzimmer, Familienzimmer oder Einzelnutzung",
            "Großes Frühstücksbuffet inklusive",
            "Kostenfreies WLAN & Parkplatz",
            "Sauna & Wellnessbereich nutzbar",
            "Halbpension auf Wunsch zubuchbar",
          ],
        },
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: "HOME",
        rooms: "ROOMS",
        pakete: "PACKAGES",
        gastro: "DINING",
        about: "ABOUT US",
        reviews: "REVIEWS",
        faq: "FAQ",
        location: "REGION",
        book: "Book now",
        subtitle: "Your family hotel in Immerath | Volcanic Eifel",
      },
      hero: {
        eyebrow: "Short break & hiking hotel in the Volcanic Eifel",
        title: "Welcome to Landhotel Schend",
        text:
          "Your ★★★ Superior hotel in Immerath — Eifelsteig premium trail, Maare-Mosel cycle path and Nürburgring right at your door. 21 rooms with balcony, sauna & wellness, Eifel regional cuisine and a free motorcycle garage. Book direct — commission-free, no booking surcharge.",
        bookDirect: "Book directly now",
        starsBadge: "3-STAR SUPERIOR",
      },
      usps: {
        parking: "Free parking — video-monitored",
        moto: "Plenty of motorcycle parking — video-monitored",
        sauna: "Sauna & wellness",
        restaurant: "On-site restaurant",
        rooms: "21 rooms with balcony/terrace",
        wifi: "Free Wi-Fi",
        breakfast: "Generous breakfast buffet",
        rating: "Booking.com 8.5 · Tripadvisor #1",
      },
      rooms: {
        eyebrow: "Our rooms",
        title: "A guest at Landhotel Schend",
        intro:
          "21 individually designed rooms and suites — all with balcony or terrace and views of the Volcanic Eifel.",
        from: "from",
        check: "Check availability",
      },
      restaurant: {
        eyebrow: "Cuisine",
        title: "Landhaus Restaurant & Terrace",
        p1:
          "For a hearty appetite our particularly cosy restaurant is the perfect choice. We serve Eifel and international specialities in a stylish atmosphere, with regional country cuisine and freshly tapped Bitburger beer. A separate kids' menu and a play corner make families feel welcome. Dogs are allowed only in the village tavern.",
        p2: "Groups and events on request — also for breakfast, coffee and lunch.",
        p3:
          "We use only fresh, high-quality ingredients. Selected delicacies and seasonal specialities from our menu earn praise for our chef even from the most discerning guests.",
        p4: "Alongside our varied dishes you'll find an extensive drinks list and a fine selection of wines.",
        hours: "Opening hours",
        monSat: "Monday – Saturday",
        sun: "Sunday",
      },
      feiern: {
        eyebrow: "We organise your celebrations",
        title: "Family & Corporate Events",
        text:
          "Invite your guests to an unforgettable celebration in stylish surroundings. Our experienced team takes care of every detail — from planning and decoration to the entertainment programme and the menu or buffet of your choice. Celebrate birthdays, communions or christenings, as well as corporate events from customer evenings to Christmas parties. The elegant Eichelbergzimmer seats up to 70 guests, the cosy Kaminzimmer 35, and our village tavern and sun terrace 40 each. We'd love to advise you and put together an individual package.",
      },
      pakete: {
        eyebrow: "Packages & offers",
        title: "Our Eifel packages",
        intro:
          "Hiking, cycling or simply relaxing — choose the right package for your time-out in the Volcanic Eifel.",
        more: "More info",
        back: "All packages",
        included: "Included in the package",
        description: "Description",
        descriptionTitle: "Your stay in detail",
        photos: "Impressions",
        photosTitle: "Photos of this package",
        otherTitle: "You may also like",
        otherEyebrow: "More packages",
        bookNow: "Book now",
      },
      gallery: {
        eyebrow: "Gallery",
        title: "Impressions of the Volcanic Eifel",
      },
      footer: {
        tagline:
          "Your family hotel in the Volcanic Eifel — with sauna, wellness and on-site restaurant.",
        quick: "Quick links",
        home: "Home",
        bookRoom: "Book a room",
        gastro: "Dining",
        contact: "Contact",
        contactTitle: "Contact",
        impressum: "Imprint",
        privacy: "Privacy",
      },
      paketDetails: {
        "eifler-wandertage": {
          title: "Eifel Hiking Days",
          intro: "Discover the Volcanic Eifel on Germany's most beautiful trails – the Eifelsteig, Lieserpfad and countless themed routes start right at our doorstep.",
          details: "Our experienced team puts together suitable routes for you each day – from leisurely day tours around the maars to challenging stages on the Eifelsteig. After your hike, a lovingly prepared dinner with regional ingredients and a relaxing sauna visit await.",
          highlights: [
            "4 nights including breakfast buffet",
            "3× Eifel 3-course dinner at the Landhaus Restaurant",
            "Hiking map & personal route recommendations",
            "Lunch package for the trail",
            "Wellness access to sauna & relaxation area",
          ],
        },
        "rad-erlebnisse": {
          title: "Eifel Cycling Adventures",
          intro: "Saddle up through the Volcanic Eifel – the Maare-Mosel cycle path, Kylltal route and challenging mountain bike trails start right at the hotel.",
          details: "Whether leisure cyclist or ambitious mountain biker – our recommendations range from the family-friendly Maare-Mosel route to demanding trails through the Volcanic Eifel. Sauna, optional massage and a hearty Eifel menu await after your ride.",
          highlights: [
            "3 nights with breakfast buffet",
            "2× Eifel dinner",
            "Lockable bike room with e-bike charging",
            "Route maps & GPX tracks",
            "Laundry service for sportswear",
          ],
        },
        "erholung-entschleunigung": {
          title: "Days of Rest and Slowing Down",
          intro: "Simply switch off – arrive, breathe deeply and enjoy the soothing silence of the Eifel.",
          details: "This package is a time-out for body and mind. Be spoiled with our cuisine, enjoy long sauna sessions and find peace – with views over the gentle hills of the Volcanic Eifel.",
          highlights: [
            "3 nights with breakfast buffet",
            "1× welcome candlelight dinner",
            "Sauna, wellness area and relaxation zone",
            "Fresh flowers & fruit plate in the room",
            "Walking suggestions around Schalkenmehren",
          ],
        },
        "eifelgold-weissdornhecken": {
          title: '"Eifel Gold" and Hawthorn Hedges',
          intro: "Spring in the Volcanic Eifel – when broom and hawthorn paint the landscape gold and white, the most beautiful hiking season begins.",
          details: "A package for nature lovers: experience the Eifel in full bloom, learn the secrets of the volcanic landscape on a guided tour, and enjoy fresh Eifel cuisine every day.",
          highlights: [
            "5 nights including half-board",
            "Guided themed hike with certified guide",
            "Picnic basket for one day tour",
            "Admission to the Daun Natural History Museum",
            "Wellness access included",
          ],
        },
        "bunt-sind-schon-die-waelder": {
          title: '"The Forests Are Already Colourful"',
          intro: "When the forests around the Eifel maars turn vivid colours, the most magical season begins – golden autumn for hiking, savouring and lingering.",
          details: "Golden light over the maars, steaming cups of tea after the hike and hearty game dishes in the evening – this package captures the magical atmosphere of the Eifel autumn.",
          highlights: [
            "4 nights with breakfast buffet",
            "3× autumn menu with seasonal specialities",
            "Hiking map “Autumn around the maars”",
            "Game dinner of your choice",
            "Sauna & relaxation area included",
          ],
        },
        "zimmer-ohne-paket": {
          title: "Book a Room Without a Package",
          intro: "Want to stay flexible? Book one of our 21 rooms without a package – exactly how you want it.",
          details: "All rooms have a balcony or terrace with views of the Volcanic Eifel. Choose your dates freely and design your stay individually – we'll take care of the rest.",
          highlights: [
            "Double, family room or single occupancy",
            "Generous breakfast buffet included",
            "Free Wi-Fi & parking",
            "Sauna & wellness area available",
            "Half-board bookable on request",
          ],
        },
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: "ACCUEIL",
        rooms: "CHAMBRES",
        pakete: "FORFAITS",
        gastro: "RESTAURATION",
        about: "À PROPOS",
        reviews: "AVIS",
        faq: "FAQ",
        location: "RÉGION",
        book: "Réserver",
        subtitle: "Votre hôtel familial à Immerath | Eifel volcanique",
      },
      hero: {
        eyebrow: "Court séjour & hôtel de randonnée dans l'Eifel volcanique",
        title: "Bienvenue au Landhotel Schend",
        text:
          "Votre hôtel ★★★ Superior à Immerath — sentier Eifelsteig, piste Maare-Mosel et Nürburgring à votre porte. 21 chambres avec balcon, sauna & bien-être, cuisine de l'Eifel et garage à motos gratuit. Réservez en direct — sans commission, sans supplément.",
        bookDirect: "Réserver en direct",
        starsBadge: "3 ÉTOILES SUPERIOR",
      },
      usps: {
        parking: "Parking gratuit — vidéosurveillé",
        moto: "Nombreuses places moto — vidéosurveillées",
        sauna: "Sauna & bien-être",
        restaurant: "Restaurant maison",
        rooms: "21 chambres avec balcon/terrasse",
        wifi: "Wi-Fi gratuit",
        breakfast: "Grand buffet petit-déjeuner",
        rating: "Booking.com 8,5 · Tripadvisor n°1",
      },
      rooms: {
        eyebrow: "Nos chambres",
        title: "Séjourner au Landhotel Schend",
        intro:
          "21 chambres et suites individuelles — toutes avec balcon ou terrasse et vue sur l'Eifel volcanique.",
        from: "à partir de",
        check: "Vérifier les disponibilités",
      },
      restaurant: {
        eyebrow: "Gastronomie",
        title: "Restaurant Landhaus & Terrasse",
        p1:
          "Pour les grandes faims, notre restaurant chaleureux est l'adresse idéale. Nous servons des spécialités de l'Eifel et internationales dans une atmosphère élégante, avec des produits du terroir et une bière Bitburger pression. Carte enfants et coin jeux pour les familles. Les chiens sont autorisés uniquement dans la taverne du village.",
        p2:
          "Groupes et événements sur demande — également pour le petit-déjeuner, le café et le déjeuner.",
        p3:
          "Nous n'utilisons que des produits frais de grande qualité. Délices sélectionnés et spécialités de saison ravissent même les palais les plus exigeants.",
        p4:
          "Une carte des boissons étoffée et une belle sélection de vins complètent nos plats variés.",
        hours: "Horaires d'ouverture",
        monSat: "Lundi – Samedi",
        sun: "Dimanche",
      },
      feiern: {
        eyebrow: "Nous organisons vos fêtes",
        title: "Événements familiaux & d'entreprise",
        text:
          "Invitez vos proches à une fête inoubliable dans un cadre raffiné. Notre équipe expérimentée s'occupe de tout — de la planification à la décoration, du programme au menu ou buffet de votre choix. Anniversaires, communions, baptêmes ou événements professionnels : le salon Eichelbergzimmer accueille jusqu'à 70 personnes, le Kaminzimmer 35, la taverne du village et la terrasse ensoleillée 40 chacune. Nous vous conseillons volontiers pour composer une formule sur mesure.",
      },
      pakete: {
        eyebrow: "Forfaits & offres",
        title: "Nos forfaits Eifel",
        intro:
          "Randonnée, vélo ou détente — choisissez le forfait qui vous convient pour votre séjour dans l'Eifel volcanique.",
        more: "En savoir plus",
        back: "Tous les forfaits",
        included: "Inclus dans le forfait",
        description: "Description",
        descriptionTitle: "Votre séjour en détail",
        photos: "Impressions",
        photosTitle: "Photos du forfait",
        otherTitle: "À découvrir aussi",
        otherEyebrow: "Autres forfaits",
        bookNow: "Réserver",
      },
      gallery: {
        eyebrow: "Galerie",
        title: "Impressions de l'Eifel volcanique",
      },
      footer: {
        tagline:
          "Votre hôtel familial dans l'Eifel volcanique — sauna, bien-être et restaurant maison.",
        quick: "Liens rapides",
        home: "Accueil",
        bookRoom: "Réserver une chambre",
        gastro: "Restauration",
        contact: "Contact",
        contactTitle: "Contact",
        impressum: "Mentions légales",
        privacy: "Confidentialité",
      },
      paketDetails: {
        "eifler-wandertage": {
          title: "Journées de randonnée dans l'Eifel",
          intro: "Découvrez l'Eifel volcanique sur les plus beaux sentiers d'Allemagne – Eifelsteig, Lieserpfad et de nombreux itinéraires thématiques au pied de l'hôtel.",
          details: "Notre équipe expérimentée vous propose chaque jour des itinéraires adaptés – de la balade tranquille autour des maars aux étapes exigeantes de l'Eifelsteig. Après la randonnée, un dîner soigné aux saveurs régionales et un moment au sauna vous attendent.",
          highlights: [
            "4 nuitées avec buffet petit-déjeuner",
            "3× menu Eifel 3 plats au restaurant Landhaus",
            "Carte de randonnée & conseils personnalisés",
            "Panier-repas pour la journée",
            "Accès sauna & espace détente",
          ],
        },
        "rad-erlebnisse": {
          title: "Aventures à vélo dans l'Eifel",
          intro: "En selle pour l'Eifel volcanique – la Maare-Mosel-Radweg, la Kylltal-Radweg et de superbes pistes de VTT démarrent à l'hôtel.",
          details: "Du cycliste d'agrément au vététiste confirmé – nos conseils vont de la Maare-Mosel familiale aux trails plus engagés. Sauna, massage sur demande et menu Eifel généreux pour récupérer.",
          highlights: [
            "3 nuitées avec buffet petit-déjeuner",
            "2× dîner Eifel",
            "Local à vélos sécurisé avec borne e-bike",
            "Cartes & traces GPX",
            "Service blanchisserie pour vêtements de sport",
          ],
        },
        "erholung-entschleunigung": {
          title: "Jours de détente et de ralentissement",
          intro: "Tout simplement déconnecter – arriver, respirer et profiter du silence apaisant de l'Eifel.",
          details: "Ce forfait est une parenthèse pour le corps et l'esprit. Laissez-vous tenter par notre cuisine, profitez de longues séances de sauna et trouvez le calme – avec vue sur les douces collines de l'Eifel volcanique.",
          highlights: [
            "3 nuitées avec buffet petit-déjeuner",
            "1× dîner aux chandelles de bienvenue",
            "Sauna, espace bien-être et zone de repos",
            "Fleurs fraîches & assiette de fruits en chambre",
            "Conseils de balades autour de Schalkenmehren",
          ],
        },
        "eifelgold-weissdornhecken": {
          title: '« Or de l\'Eifel » et haies d\'aubépine',
          intro: "Le printemps dans l'Eifel volcanique – quand les genêts et les aubépines colorent le paysage d'or et de blanc, la plus belle saison de randonnée commence.",
          details: "Un forfait pour les amoureux de la nature : découvrez l'Eifel en pleine floraison, apprenez les particularités du paysage volcanique lors d'une randonnée guidée et savourez chaque jour une cuisine fraîche.",
          highlights: [
            "5 nuitées en demi-pension",
            "Randonnée thématique avec guide certifié",
            "Panier pique-nique pour une journée",
            "Entrée au Musée d'histoire naturelle de Daun",
            "Accès bien-être inclus",
          ],
        },
        "bunt-sind-schon-die-waelder": {
          title: '« Les forêts se parent déjà de couleurs »',
          intro: "Quand les forêts autour des maars de l'Eifel se colorent, commence la saison la plus magique – l'automne doré pour randonner, savourer et flâner.",
          details: "Lumière dorée sur les maars, tasses de thé fumantes après la randonnée et plats de gibier généreux le soir – ce forfait capture la magie de l'automne dans l'Eifel.",
          highlights: [
            "4 nuitées avec buffet petit-déjeuner",
            "3× menu d'automne avec spécialités de saison",
            "Carte de randonnée « Automne autour des maars »",
            "Soirée gibier au choix",
            "Sauna & espace détente inclus",
          ],
        },
        "zimmer-ohne-paket": {
          title: "Réserver une chambre sans forfait",
          intro: "Vous souhaitez rester flexible ? Réservez l'une de nos 21 chambres sans forfait, selon vos envies.",
          details: "Toutes les chambres disposent d'un balcon ou d'une terrasse avec vue sur l'Eifel volcanique. Choisissez librement votre période et composez votre séjour à votre rythme – nous nous occupons du reste.",
          highlights: [
            "Chambre double, familiale ou occupation simple",
            "Grand buffet petit-déjeuner inclus",
            "Wi-Fi & parking gratuits",
            "Sauna & espace bien-être disponibles",
            "Demi-pension sur demande",
          ],
        },
      },
    },
  },
};

const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;

i18n.use(initReactI18next).init({
  resources,
  lng: saved || "de",
  fallbackLng: "de",
  interpolation: { escapeValue: false },
});

export default i18n;
