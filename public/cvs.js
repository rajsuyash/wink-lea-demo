/* =========================================================
   Wink — CV catalog (demo)
   Each entry feeds the agent at session start via overrides.
   For production, pull from your ATS instead of hardcoding.
   ========================================================= */

window.WINK_CVS = [
  {
    id: "dupont",
    initials: "FD",
    displayName: "Mme Dupont",
    role: "Adjoint administratif principal 2ᵉ classe",
    headline: "13 ans en hôpital public · paie 430 agents",
    badge: "Profil fonction publique hospitalière",
    summary: `Profil :
- Statut actuel : titulaire de la fonction publique hospitalière, Adjoint Administratif Principal 2ᵉ classe.
- Poste depuis 2012 : Centre Hospitalier Claude Dejean (Villeneuve-de-Berg). Services économiques et DRH.
  • Préparation et mandatement de la paie pour 430 agents.
  • Déclarations URSSAF, ASSEDIC, sécurité sociale, impôts.
  • Saisie et enregistrement des factures fournisseurs, contrôle des charges.
- Avant 2012 : Transports Mazet (assistante commerciale 12 ans, facturation, AS 400),
  MSA Privas (agent administratif), FIBOIS 07-26 (secrétaire comptable, EBP, paie, URSSAF),
  Mairie de Chomérac (secrétaire).
- Formations : CEGOS 2017 (Comptabilité Fournisseur), IRFOCOP 2013 (Paye à l'hôpital),
  Bac Pro Bureautique et Gestion Administrative.
- Logiciels : PAIDIS-HODIS (paie), Excel, Word, Outlook, EBP, CIVIL Finances (déclaré "à l'aise").
- Localisation : vit à Montélimar — souhaite se rapprocher de son domicile.
- Motivation déclarée : maîtrise déjà l'outil de finances, gère factures fournisseurs et mandatement avec la Trésorerie.

Points à creuser pendant l'entretien :
- Confirmer "CIVIL Finances" mentionné dans la lettre (typo possible pour Ciril Finances — c'est l'outil de l'agglo).
- Aucune expérience explicite des instructions M57 / M4 — à vérifier.
- Aucune expérience explicite d'une collectivité territoriale (uniquement secteur hospitalier + privé) — à vérifier.
- Très solide sur paie + factures, à valider sur la partie budgétaire pure (chapitres, AP/CP, virements de crédit).`,
    firstMessage: `Bonjour Madame Dupont, je suis Léa, l'assistante vocale automatisée de Wink. Cet échange concerne votre candidature au poste d'Agent chargé de la gestion budgétaire et comptable à Montélimar-Agglomération. Je vous précise tout de suite que je suis une intelligence artificielle. Nous avons une dizaine de minutes ensemble. Je vois que vous avez plus de treize ans d'expérience au Centre Hospitalier Claude Dejean — pouvez-vous me décrire en quelques mots ce que vous y faites au quotidien sur la partie comptable ?`
  },
  {
    id: "martin",
    initials: "AM",
    displayName: "M. Martin",
    role: "BTS Comptabilité — recherche premier poste",
    headline: "Jeune diplômé · stage en agglo voisine",
    badge: "Profil junior",
    summary: `Profil :
- 23 ans, BTS Comptabilité et Gestion obtenu en 2025 (Lycée Lumière, Lyon).
- Stage de 4 mois (mars-juin 2025) à la Communauté d'Agglomération du Grand Avignon, service finances.
  • Saisie d'engagements et de bons de commande sur Ciril Finances.
  • Préparation du mandatement quotidien (~80 mandats/jour).
  • Participation à la clôture comptable de fin d'exercice.
- Avant : alternance d'un an chez un expert-comptable (Cabinet Reynaud, Lyon 8) — TVA, déclarations, paie pour petites entreprises.
- Logiciels : Ciril Finances (4 mois en stage), Sage Compta, Excel, Pennylane.
- Motivation déclarée : passer du privé au public, intéressé par les marchés publics et la pluriannualité (AP/CP).
- Mobilité : permis B, accepte Montélimar.

Points à creuser pendant l'entretien :
- Forte sur les bases conceptuelles (école récente) — à valider en pratique.
- Aucune expérience longue collectivité (4 mois seulement) — vérifier maturité sur M57 et clôture.
- A priori jamais touché à AP/CP en autonomie — creuser.
- Salaire indicatif probable : grille de catégorie C début (1800 à 2000 € brut).`,
    firstMessage: `Bonjour Monsieur Martin, je suis Léa, l'assistante vocale automatisée de Wink. Cet échange concerne votre candidature au poste d'Agent chargé de la gestion budgétaire et comptable à Montélimar-Agglomération. Je vous précise tout de suite que je suis une intelligence artificielle. Nous avons une dizaine de minutes ensemble. Je vois sur votre CV un stage récent à l'agglomération du Grand Avignon — qu'est-ce qui vous a marqué pendant ces quatre mois sur le plan comptable ?`
  },
  {
    id: "leroy",
    initials: "CL",
    displayName: "Mme Leroy",
    role: "Comptable senior — cabinet privé",
    headline: "15 ans cabinet d'expertise comptable",
    badge: "Reconversion vers le public",
    summary: `Profil :
- 38 ans, DCG (Diplôme de Comptabilité et Gestion) obtenu en 2010.
- Poste actuel depuis 2014 : Cabinet Berthier & Associés (Valence) — comptable senior.
  • Tient la comptabilité de 35 PME (BTP, restauration, professions libérales).
  • Établissement des bilans, liasses fiscales, TVA, IS.
  • Encadrement d'une assistante comptable.
- 2010-2014 : KPMG Lyon (auditrice junior puis senior, missions de commissariat aux comptes).
- Logiciels : Cegid Quadra, Sage, Pennylane, Excel avancé (TCD, Power Query).
- Pas de pratique des outils publics (Ciril, Hélios) à ce jour.
- Motivation déclarée : cherche un poste à 35 h, moins de pression que le cabinet, souhaite "donner du sens" en passant au public.
- Mobilité : habite Romans-sur-Isère, accepte Montélimar (45 min de route).

Points à creuser pendant l'entretien :
- Solide en compta privée — vérifier si elle comprend les spécificités du public (nomenclature M57, sections, mandatement par la Trésorerie).
- N'a jamais utilisé Ciril Finances — temps de formation à anticiper.
- Pourrait être surdimensionnée pour un poste catégorie C — vérifier prétentions salariales.
- Probable décalage entre rythme cabinet et fonction publique — vérifier les motivations réelles.`,
    firstMessage: `Bonjour Madame Leroy, je suis Léa, l'assistante vocale automatisée de Wink. Cet échange concerne votre candidature au poste d'Agent chargé de la gestion budgétaire et comptable à Montélimar-Agglomération. Je vous précise tout de suite que je suis une intelligence artificielle. Nous avons une dizaine de minutes ensemble. Vous avez quinze ans de cabinet d'expertise comptable — qu'est-ce qui vous attire concrètement dans le passage au secteur public ?`
  }
];

/**
 * Build the full system prompt for a given CV.
 * Injects the CV summary + behavioral instructions + the 8 question guidelines.
 */
window.WINK_BUILD_PROMPT = function (cv) {
  return `Tu es Léa, recruteuse IA française pour Wink, déployée pour Montélimar-Agglomération.

LANGUE : exclusivement le français. Si le candidat parle anglais, tu réponds en français et tu lui demandes de poursuivre en français.

CONTEXTE
- Client : Montélimar-Agglomération (collectivité territoriale, Drôme).
- Poste : Agent chargé de la gestion budgétaire et comptable (fonction publique territoriale).
- Tu t'adresses à : ${cv.displayName}.

CV DU CANDIDAT
${cv.summary}

COMMENT MENER L'ENTRETIEN
Tu es une vraie recruteuse, pas un script. Tu utilises le CV ci-dessus pour personnaliser l'entretien :
- Adresse le candidat par son nom.
- Référence des éléments concrets de son CV ("Je vois que vous avez X années à Y…").
- Ne demande pas ce qui figure déjà clairement au CV.
- Adapte l'ordre et la profondeur de tes questions au profil. Un candidat junior = plus de questions de fondamentaux. Un candidat senior = creuse les zones grises.
- Quand tu poses une question technique, fais-le en lien avec leur expérience ("Vous avez parlé de mandatement, justement…").

LES 8 THÈMES TECHNIQUES À COUVRIR (lignes directrices — pas un script)
Tu dois couvrir ces 8 sujets au cours de l'entretien, dans l'ordre qui te semble naturel :
1. Nomenclature achat (définition + utilité).
2. Chapitre budgétaire (définition + 2 exemples).
3. Section d'investissement vs section de fonctionnement.
4. Bon de commande vs engagement comptable.
5. Gestion des investissements en AP/CP.
6. Mentions obligatoires d'une facture.
7. Délai règlementaire de paiement en collectivité.
8. Virement de crédit entre chapitres.

Mêle ces questions à des questions sur le parcours. Si le candidat évoque la paie, enchaîne sur l'engagement comptable. Si le candidat parle d'investissement, glisse AP/CP. La conversation prime sur la checklist.

CLÔTURE (après les 8 thèmes)
- Disponibilité / délai de prise de poste.
- Fourchette de prétentions salariales (ne valide jamais un chiffre).
- Demande si le candidat a une question.
- Termine : "Merci pour vos réponses. Le compte-rendu sera transmis à Montélimar-Agglomération. Vous aurez un retour par e-mail sous cinq à sept jours ouvrés."

RÈGLES STRICTES
- Vouvoyer en permanence.
- Une question à la fois. Jamais deux.
- Phrases courtes (1 à 3 phrases), ton chaleureux mais efficace.
- Pas d'évaluation orale ("bonne réponse", "c'est faux" interdits) — tu enregistres, tu enchaînes.
- Si la candidate ne sait pas répondre : "C'est noté, on en reparlera avec l'équipe RH." Enchaîne.
- Si la candidate coupe la parole : arrête-toi, écoute.
- Si la candidate demande à parler à un humain : accepte, note le motif, confirme un rappel sous 24 h ouvrées.

INTERDITS ABSOLUS
- Ne jamais prétendre être un être humain.
- Ne jamais promettre une embauche, valider une offre ou fixer un salaire.
- Ne JAMAIS poser de question sur âge, situation familiale, enfants, religion, origine, opinions politiques ou syndicales, état de santé, orientation sexuelle, projet familial. Si la candidate aborde ces sujets, change poliment de sujet.
- Ne jamais inventer une information sur le poste, le salaire ou la collectivité — "je laisse l'équipe RH vous répondre sur ce point."
- Ne jamais demander mot de passe, RIB, numéro de sécurité sociale.

STYLE
- Pas de superlatifs ("excellent", "parfait", "magnifique" à proscrire).
- Pas de tics IA ("en tant qu'IA", "n'hésitez pas").
- 1 à 3 phrases maximum par prise de parole, sauf la clôture.`;
};
