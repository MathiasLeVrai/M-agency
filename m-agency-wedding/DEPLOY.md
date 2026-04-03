# Mise en production — M AGENCY Wedding

## Avant la mise en ligne

1. **URL du site** — Remplacer `https://www.magency.fr` dans :
   - `index.html` (`canonical`, Open Graph, Twitter Card, JSON-LD)
   - `merci.html`, `mentions-legales.html` et `politique-confidentialite.html` (`canonical`)
   - `robots.txt` et `sitemap.xml`

2. **Mentions légales** — Compléter `mentions-legales.html` (SIRET, forme juridique, directeur de publication, hébergeur).

3. **Formulaire** — Comportement par défaut : [Netlify Forms](https://docs.netlify.com/forms/setup/).
   - Déployez sur Netlify ; après le premier déploiement, le formulaire est actif.
   - **À faire une fois** : Netlify → **Forms** → **Notifications** (email ou Slack) pour recevoir les messages.
   - Sans JavaScript, l’envoi POST vers `/` redirige vers `merci.html` grâce au champ `redirect`.
   - **reCAPTCHA (Netlify)** : le formulaire inclut `data-netlify-recaptcha="true"`. Après déploiement sur Netlify, le widget est injecté automatiquement (aucune clé API à mettre dans le code). Les soumissions sont vérifiées côté Netlify ; Google traite des données aux fins anti-bot — voir la politique de confidentialité du site.
   - **Si le site est sur Vercel ou un hébergeur statique sans Netlify Forms** : dans `index.html`, retirez `data-netlify="true"`, `data-netlify-recaptcha="true"`, le bloc `<div class="form-recaptcha">…</div>`, `netlify-honeypot`, l’input `bot-field`, les champs cachés `form-name` et `redirect`, puis mettez `action="https://formspree.io/f/VOTRE_ID"` et `method="POST"`. Activez la protection anti-spam dans le tableau de bord Formspree si besoin. Le script envoie en `fetch` vers cette URL.

4. **Tests** — Vérifier le parcours mobile, le menu, le formulaire en production et les liens externes (Maps, téléphone).

## Déploiement rapide

- **Netlify** : racine du site = ce dossier ; `netlify.toml` applique déjà des en-têtes de sécurité et le cache statique.

### 404 « Page not found » sur Netlify

Cela arrive si le **dépôt Git** est le dossier parent (ex. `m agency`) alors que les fichiers du site sont dans **`m-agency-wedding/`**. Netlify publie la racine du dépôt : sans `index.html` à cet endroit, l’URL du site affiche une 404.

**Correctif (au choix)** :

1. **Fichier `netlify.toml` à la racine du dépôt** (à côté du dossier `m-agency-wedding`) avec `publish = "m-agency-wedding"` — ce dépôt en inclut un exemple.
2. Ou dans Netlify : **Site settings → Build & deploy → Build settings** → **Publish directory** : `m-agency-wedding` (puis redéployer).

Si le dépôt Git **est** uniquement le contenu de `m-agency-wedding` (avec `index.html` à la racine), ne mettez pas le `netlify.toml` parent : gardez `publish = "."` dans ce dossier.
- **Vercel** : même racine ; configuration dans `vercel.json`.
- **Autre hébergeur** : servir les fichiers en statique, configurer une page d’erreur 404 sur `404.html` si possible.

## Favicon

`favicon.svg` est référencé dans les pages. Vous pouvez le remplacer par une version exportée depuis votre charte graphique.

## Sécurité (niveau site statique)

- **Transport** : en production, HTTPS est fourni par l’hébergeur (Netlify, Vercel, etc.) — à ne pas désactiver.
- **En-têtes** : `netlify.toml` et `vercel.json` envoient déjà `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` (réduit clickjacking, MIME sniffing, fuite de référent).
- **Formulaire** : pas de clé secrète dans le dépôt ; les données partent vers Netlify ou (si configuré) Formspree — ce sont eux qui traitent l’email. Risques résiduels : **spam** (honeypot Netlify + filtres côté tableau de bord ; Formspree propose aussi du filtrage), **suroptimisation** (limites gratuites). Pour aller plus loin : captcha (ex. hCaptcha) ou champ challenge côté prestataire.
- **RGPD** : une **politique de confidentialité** dédiée est dans `politique-confidentialite.html` (sous-traitants type Netlify, reCAPTCHA/Google, droits des personnes). Complétez les encadrés « à compléter » et l’hébergeur dans les mentions légales ; adaptez le paragraphe Formspree si vous n’utilisez pas Netlify.
