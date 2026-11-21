/* Référentiel RNCP40573 — Expert en Ingénierie des Systèmes d'Information (EISI)
   Transcrit du « referentiel-RNCP40573-synthetise » (Moodle, 2026-02-06).
   Spécialité suivie : 4B — Big Data & IA. */
window.RNCP = {
  code: "RNCP40573",
  titre: "Expert en Ingénierie des Systèmes d'Information",
  blocs: [
    {
      id: "A1", titre: "Définir une stratégie de systèmes d'information", tronc: true,
      exemples: [
        { titre: "Veille technologique et réglementaire", comp: {
          C1: "Concevoir et structurer une veille technologique et réglementaire (impact environnemental, sécurité, sources fiables).",
          C2: "Synthétiser les données de veille (fiabilité, impact, gains, risques) pour une restitution compréhensible.",
          C3: "Recommander des solutions innovantes à partir de la veille, en intégrant enjeux et réglementations." },
          eval: "Dossier stratégique individuel : conception de la veille, synthèse, présentation aux parties prenantes." },
        { titre: "Stratégie informatique adaptée aux besoins", comp: {
          C4: "Schématiser une cartographie du SI avec une méthode d'analyse de risques.",
          C5: "Élaborer la stratégie informatique à partir de la cartographie validée.",
          C6: "Présenter les préconisations du projet SI (solutions pérennes et écoresponsables)." },
          eval: "Dossier stratégique : cartographie 4 couches, méthode de risques (EBIOS, ISO 27005), diagnostic, axes d'évolution." },
        { titre: "Solutions architecturales adaptées", comp: {
          C7: "Comparer les types d'architectures, leurs caractéristiques et cas d'usage.",
          C8: "Analyser les composants d'une architecture (fonctions, interactions, performance).",
          C9: "Recommander l'architecture adaptée (performance, scalabilité, sécurité, éco-conception)." },
          eval: "Production écrite collective (3 max) + restitution orale individuelle." }
      ]
    },
    {
      id: "A2", titre: "Piloter des projets informatiques", tronc: true,
      exemples: [
        { titre: "Identification des besoins du client", comp: {
          C10: "Analyser la problématique client et formaliser une étude d'opportunité (SWOT, PESTEL).",
          C11: "Évaluer et prioriser les fonctionnalités requises." },
          eval: "Cahier des charges fonctionnel individuel (défis, besoins, matrice de priorisation)." },
        { titre: "Cahier des charges technique", comp: {
          C12: "Construire un cahier des charges technique (RGPD, accessibilité PSH).",
          C13: "Décrire et prioriser chaque fonctionnalité (modélisation des processus métier).",
          C14: "Rédiger une note de cadrage (démarche, délais, budget, ressources, qualité)." },
          eval: "Cahier des charges technique collectif (validation des besoins, infrastructure, risques)." },
        { titre: "Gestion opérationnelle du projet", comp: {
          C15: "Planifier le projet (phases, ressources, méthodologie).",
          C16: "Coordonner les méthodes de gestion de projet et de travail en réseau.",
          C17: "Développer des stratégies de mitigation des risques.",
          C18: "Coordonner la communication entre parties prenantes pluridisciplinaires." },
          eval: "Note de cadrage collective + oral individuel (PERT, chemin critique, budget, risques)." },
        { titre: "Pilotage et management des équipes", comp: {
          C19: "Gérer l'engagement des parties prenantes (DSI, MOA, clients, sous-traitants).",
          C20: "Organiser la capitalisation et le partage des compétences." },
          eval: "Production collective + oral individuel (matrice RACI, tableaux de bord)." }
      ]
    },
    {
      id: "A3", titre: "Concevoir et développer une application informatique", tronc: true,
      exemples: [
        { titre: "Conception d'une application", comp: {
          C21: "Concevoir une architecture applicative et des maquettes.",
          C22: "Schématiser les processus métier (UML).",
          C23: "Recommander un environnement informatique (impact écologique réduit).",
          C24: "Justifier l'usage de design patterns (architecture modulaire, maintenable)." },
          eval: "Dossier de conception collectif + oral individuel." },
        { titre: "Développement de l'application et de son environnement", comp: {
          C25: "Développer des applications métier avec des pratiques de sécurité rigoureuses.",
          C26: "Rédiger et exécuter des scénarios de tests.",
          C27: "Concevoir un suivi qualité automatisé (CI, monitoring, KPI, alertes)." },
          eval: "Application optimisée + dossier technique (sécurité, OWASP, tests, monitoring)." }
      ]
    },
    {
      id: "B4", titre: "Construire et implémenter des modèles de Big Data et d'IA", tronc: false, specialite: true,
      exemples: [
        { titre: "Analyse et exploitation des données massives", comp: {
          C28: "Analyser une problématique Big Data en évaluant volume, vélocité et variété, pour élaborer une stratégie d'analyse qui optimise l'extraction de valeur.",
          C29: "Concevoir et évaluer des modèles statistiques et d'apprentissage automatique (ML, deep learning) pour optimiser la prise de décision." },
          eval: "Programme d'analyse Big Data + dossier REX (stratégie, outils, modèles, visualisations) — écrit individuel + oral individuel.",
          criteres: ["Analyse rigoureuse de la problématique Big Data", "Pertinence des outils et technologies recommandés", "Respect RGPD / PSH / SLA", "Besoins de stockage, requêtes, performances (cycle ETL, éco-conception)", "Code source et jeux de données documentés", "KPI pertinents"] },
        { titre: "Exploitation des données et solutions IA", comp: {
          C30: "Optimiser l'exploitation des données (extraction, transformation, chargement) avec langages, logiciels et IA générative, dans le respect du RGPD.",
          C31: "Concevoir une base de données adaptée aux traitements analytiques et d'IA.",
          C32: "Schématiser et concevoir un programme d'IA répondant aux besoins fonctionnels." },
          eval: "Programme d'exploitation des données et d'IA + dossier REX — écrit individuel + oral individuel.",
          criteres: ["Solution conforme (RGPD, PSH, SLA)", "Processus ETL optimisés", "Base de données efficace pour l'analytique et l'IA", "Programme d'IA schématisé et fonctionnel", "Performances évaluées et argumentées", "Documentation du code et visualisations"],
          outils: ["Apache Airflow", "MLflow", "Tableau", "DataRobot", "CodeCarbon", "Azure ML"] }
      ]
    }
  ]
};
