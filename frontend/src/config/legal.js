export const getLegalConfig = (locale) => {
  const l = (locale || (typeof navigator !== "undefined" ? navigator.language : "en")).toLowerCase();
  const base = l.startsWith("fr") ? "fr" : "en";
  const configs = {
    en: {
      companyName: "IdeaCollab",
      tosLabel: "Terms of Service",
      privacyLabel: "Privacy Policy",
      copyrightPrefix: "All rights reserved.",
      regulatoryDisclosure: "",
    },
    fr: {
      companyName: "IdeaCollab",
      tosLabel: "Conditions d’utilisation",
      privacyLabel: "Politique de confidentialité",
      copyrightPrefix: "Tous droits réservés.",
      regulatoryDisclosure: "",
    },
  };
  return configs[base] || configs.en;
};

