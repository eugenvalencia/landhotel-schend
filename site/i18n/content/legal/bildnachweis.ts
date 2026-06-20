// Bildnachweis je Locale (DE-Original-Seite bleibt separat). Die CC-Liste (COMMONS)
// ist sprachneutral und lebt in der Komponente; hier nur die übersetzbaren Texte.
import type { Locale } from "../../index";

export interface BildnachweisContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro1: string;
  intro2: string;
  labelFoto: string;
  labelLizenz: string;
  labelQuelle: string;
  closingPre: string;  // vor der E-Mail
  closingPost: string; // nach der E-Mail
}

export const bildnachweisContent: Record<Exclude<Locale, "de">, BildnachweisContent> = {
  en: {
    metaTitle: "Image credits",
    metaDescription: "Image credits and copyright information for the photos used on landhaus-schend.de.",
    heading: "Image credits",
    intro1:
      "The photos of the house, garden, rooms, restaurant, banquet hall, dishes and the host family are the Beimler family’s own photographs (Landhaus Schend).",
    intro2:
      "For the landscape and nature shots of the region (Volcanic Eifel maars as well as hiking and cycling trails) we use freely licensed photographs from Wikimedia Commons. The images have been cropped and resized for display on this website. Author and licence are listed below:",
    labelFoto: "Photo:",
    labelLizenz: "licence",
    labelQuelle: "source:",
    closingPre: "If you believe that an image used here infringes your rights, please contact us at",
    closingPost: "— we will review it promptly.",
  },
  fr: {
    metaTitle: "Crédits photo",
    metaDescription: "Crédits photo et mentions d’auteur pour les photos utilisées sur landhaus-schend.de.",
    heading: "Crédits photo",
    intro1:
      "Les photos de la maison, du jardin, des chambres, du restaurant, de la salle des fêtes, des plats et de la famille hôtesse sont des clichés réalisés par la famille Beimler (Landhaus Schend).",
    intro2:
      "Pour les photos de paysage et de nature de la région (maars de l’Eifel volcanique ainsi que sentiers de randonnée et pistes cyclables), nous utilisons des photographies sous licence libre de Wikimedia Commons. Les images ont été recadrées et redimensionnées pour l’affichage sur ce site. L’auteur et la licence sont indiqués ci-dessous :",
    labelFoto: "Photo :",
    labelLizenz: "licence",
    labelQuelle: "source :",
    closingPre: "Si vous estimez qu’une image utilisée ici porte atteinte à vos droits, veuillez nous contacter à",
    closingPost: "— nous l’examinerons sans délai.",
  },
  nl: {
    metaTitle: "Fotoverantwoording",
    metaDescription: "Fotoverantwoording en auteursvermeldingen voor de op landhaus-schend.de gebruikte foto’s.",
    heading: "Fotoverantwoording",
    intro1:
      "De foto’s van het huis, de tuin, de kamers, het restaurant, de feestzaal, de gerechten en de gastfamilie zijn eigen opnamen van de familie Beimler (Landhaus Schend).",
    intro2:
      "Voor de landschaps- en natuuropnamen van de regio (Vulkaneifel-maren alsook wandel- en fietspaden) gebruiken wij vrij gelicentieerde foto’s van Wikimedia Commons. De afbeeldingen zijn voor weergave op deze website bijgesneden en van formaat aangepast. Auteur en licentie staan hieronder vermeld:",
    labelFoto: "Foto:",
    labelLizenz: "licentie",
    labelQuelle: "bron:",
    closingPre: "Mocht u van mening zijn dat een hier gebruikte afbeelding uw rechten schendt, neem dan contact op via",
    closingPost: "— wij controleren dat onmiddellijk.",
  },
};
