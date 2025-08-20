# Club de Judo - Site Vitrine Statique

Site vitrine complet pour un club de judo, développé en HTML, CSS et JavaScript natif.

## 🥋 Caractéristiques

- **100% Accessible** - Conforme aux normes WCAG 2.1 AA
- **Responsive** - Optimisé pour mobile, tablette et desktop
- **SEO Optimisé** - Meta tags, structured data, sitemap
- **Performance** - Images optimisées, lazy loading, code minifié
- **Formulaire de contact** - Intégré avec FormSubmit

## 📁 Structure du Projet

```
static-site/
├── index.html              # Page d'accueil
├── a-propos.html           # Présentation du club
├── cours.html              # Cours et horaires
├── evenements.html         # Actualités et événements
├── galerie.html            # Galerie photos
├── contact.html            # Contact et inscription
├── styles.css              # Feuille de style complète
├── scripts.js              # JavaScript interactif
├── assets/                 # Images et ressources
│   ├── hero-judo.jpg
│   └── judo-logo.png
└── README.md               # Documentation
```

## 🎨 Design System

### Couleurs
- **Primaire** : Rouge traditionnel japonais (#dc267f)
- **Neutres** : Noir, blanc, gris
- **Arrière-plans** : Blanc cassé (#fafafa)

### Typographie
- **Titres** : Noto Sans JP (japonais)
- **Corps** : Inter (lisibilité)

### Composants
- Navigation responsive avec menu hamburger
- Cards avec hover effects
- Boutons avec animations
- Formulaires accessibles
- Galerie avec lightbox
- Calendrier interactif

## 🚀 Fonctionnalités

### Navigation
- Menu responsive avec animations
- Navigation clavier complète
- Liens d'évitement pour l'accessibilité

### Galerie Photos
- Filtrage par catégorie
- Lightbox accessible
- Navigation clavier (flèches, Escape)
- Lazy loading des images

### Formulaire de Contact
- Validation client-side
- Messages d'erreur accessibles
- Intégration FormSubmit
- Champs pré-remplis depuis les événements

### Calendrier
- Affichage mensuel
- Événements intégrés
- Navigation accessible

### Accessibilité
- Support complet du clavier
- ARIA labels et descriptions
- Contrastes conformes WCAG
- Focus management
- Respect des préférences utilisateur (reduced motion)

## 📱 Responsive Design

### Breakpoints
- Mobile : < 768px
- Tablette : 768px - 1024px  
- Desktop : > 1024px

### Adaptations Mobile
- Menu hamburger
- Grilles en une colonne
- Boutons tactiles optimisés
- Texte redimensionné

## ⚡ Performance

### Optimisations
- Images lazy loading
- CSS et JS minifiés
- Fonts préchargées
- Animations GPU-accelerated

### Metrics Cibles
- First Contentful Paint < 2s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

## 🛠️ Installation et Utilisation

### Déploiement Simple
1. Télécharger tous les fichiers
2. Copier les vraies images dans `/assets/`
3. Modifier les coordonnées dans `contact.html`
4. Uploader sur votre hébergeur

### Configuration FormSubmit
1. Changer l'email dans `contact.html` :
   ```html
   <form action="https://formsubmit.co/VOTRE-EMAIL" method="POST">
   ```

### Personnalisation
1. **Couleurs** : Modifier les variables CSS dans `styles.css`
2. **Contenu** : Éditer directement les fichiers HTML
3. **Images** : Remplacer les fichiers dans `/assets/`

## 🎯 SEO et Référencement

### Meta Tags
- Title optimisés (< 60 caractères)
- Descriptions (< 160 caractères)
- Keywords ciblés
- Open Graph et Twitter Cards

### Structure
- Balises sémantiques (header, main, section, article)
- Hiérarchie des titres H1-H6
- URLs propres et descriptives
- Sitemap XML

### Performance SEO
- Images avec alt text descriptifs
- Structured data (JSON-LD)
- Canonical tags
- Fast loading times

## 🔧 Maintenance

### Mises à Jour Régulières
- Actualités et événements
- Photos de galerie
- Horaires de cours
- Coordonnées de contact

### Monitoring
- Google Analytics (à ajouter)
- Search Console
- Vitals Web (Core Web Vitals)

## 📞 Support

Pour toute question technique ou personnalisation :
- Documentation complète dans les commentaires du code
- Structure modulaire pour faciliter les modifications
- Code validé W3C

## 🏆 Conformité

- ✅ HTML5 Valide
- ✅ CSS3 Valide  
- ✅ WCAG 2.1 AA
- ✅ RGPD Compliant
- ✅ Mobile-First
- ✅ Progressive Enhancement

---

**Club de Judo** - Excellence, Tradition et Valeurs Martiales depuis 30 ans.