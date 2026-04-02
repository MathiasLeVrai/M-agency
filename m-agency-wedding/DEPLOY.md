# Mise en production — M AGENCY Wedding

## Avant la mise en ligne

1. **URL du site** — Remplacer `https://www.magency.fr` dans :
   - `index.html` (`canonical`, Open Graph, Twitter Card, JSON-LD)
   - `merci.html` et `mentions-legales.html` (`canonical`)
   - `robots.txt` et `sitemap.xml`

2. **Mentions légales** — Compléter `mentions-legales.html` (SIRET, forme juridique, directeur de publication, hébergeur).

3. **Formulaire Netlify** — Le formulaire est prêt pour [Netlify Forms](https://docs.netlify.com/forms/setup/) :
   - Déployez le dossier sur Netlify (glisser-déposer ou Git).
   - Activez les notifications (email / Slack) dans le tableau de bord Netlify → Forms.
   - Sans JavaScript, l’envoi redirige vers `merci.html`.

4. **Alternative Formspree** — Retirez `data-netlify`, `netlify-honeypot` et l’input caché `form-name`, puis définissez par exemple  
   `action="https://formspree.io/f/VOTRE_ID" method="POST"`. Le script enverra en `fetch` si l’`action` pointe vers `formspree.io`.

5. **Tests** — Vérifier le parcours mobile, le menu, le formulaire en production et les liens externes (Maps, téléphone).

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
