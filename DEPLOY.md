# Deploying this site to GitHub Pages

A step-by-step guide for publishing the portfolio and updating it later. Everything here is done
by hand: the GitHub website for the one-time setup, and three git commands for every update.

## 0. What you already have

- The folder `F:\Personal\Applications\Portfolio` is a git repository on the `main` branch.
- Git knows who you are (`git config --global user.name` / `user.email`).
- No remote is configured yet, so nothing has left your machine.

Check at any time from the Portfolio folder:

```bash
git status
git log --oneline
git remote -v
```

## 1. Create the repository on GitHub (one time)

1. Sign in at <https://github.com> (create an account if you do not have one).
2. Click the **+** in the top-right corner, then **New repository**.
3. Pick a name. Two options:
   - `portfolio` → the site will live at `https://<username>.github.io/portfolio/`
   - `<username>.github.io` → the site will live at `https://<username>.github.io/` (cleaner; only one such repo per account)
4. Keep it **Public** (GitHub Pages on a free account requires a public repository).
5. Leave **Add a README**, **.gitignore** and **license** unticked. The folder already has files.
6. Click **Create repository**. GitHub shows a page with the repository URL, something like
   `https://github.com/<username>/portfolio.git`. Copy it.

## 2. Connect the folder and push (one time)

Open a terminal in the Portfolio folder (PowerShell, Git Bash or the Claude terminal) and run:

```bash
git remote add origin https://github.com/<username>/portfolio.git
```

```bash
git push -u origin main
```

The first push opens a Git Credential Manager window asking you to sign in to GitHub in the browser.
Approve it once; it remembers you afterwards. When the command finishes, refresh the repository page
and you will see all the files.

> Tip: GitHub links commits to your profile by e-mail. Your commits use
> `shabeebabubaker77@outlook.com`. Add that address under GitHub → Settings → Emails, or the commits
> will show without your avatar.

## 3. Turn on GitHub Pages (one time)

1. On the repository page, open **Settings** (top tab).
2. In the left menu, click **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch**, choose `main` and the folder `/ (root)`, then click **Save**.
5. Wait one to two minutes. The page refreshes with a banner: *"Your site is live at https://…"*.
   You can watch the build under the **Actions** tab, in a workflow called *pages build and deployment*.

Open the URL. You should see the terminal edition. The light edition is at the same URL plus `light/`.

## 4. Put the real address into the site (one time)

The HTML, sitemap and robots file still contain the placeholder `https://YOUR-DOMAIN.example`.
Replace it with your real address **without a trailing slash**:

- For `https://<username>.github.io/portfolio/` use `https://<username>.github.io/portfolio`
- For `https://<username>.github.io/` use `https://<username>.github.io`

Do it with your editor's find-and-replace across the folder, or in PowerShell from the Portfolio folder:

```powershell
$new = 'https://<username>.github.io/portfolio'
Get-ChildItem -Recurse -Include index.html,sitemap.xml,robots.txt | ForEach-Object {
  (Get-Content $_ -Raw) -replace 'https://YOUR-DOMAIN\.example', $new | Set-Content $_ -NoNewline
}
```

Then publish the change (see the next section). Afterwards, paste your URL into
<https://www.opengraph.xyz> or LinkedIn's post composer to confirm the preview image appears.

## 5. Every future update (the routine)

1. Edit files locally and check them with `python -m http.server 8080` → <http://localhost:8080>.
2. If you changed `styles.css` or `script.js`, bump the `?v=` value in the `<link>` and `<script>` tags of
   `index.html` and `light/index.html` so visitors do not get a cached copy.
3. Publish:

```bash
git add -A
```

```bash
git commit -m "Describe what changed"
```

```bash
git push
```

GitHub Pages rebuilds automatically and the live site updates within a minute or two.
Hard-refresh the browser (Ctrl+F5) if you still see the old version.

Useful checks:

```bash
git status
```

```bash
git log --oneline -5
```

## 6. Optional: a custom domain

1. Buy a domain (for example `shabeeb.dev`).
2. In the repository, open **Settings → Pages → Custom domain**, type the domain and save.
   GitHub creates a `CNAME` file in the repository; pull it or commit it yourself.
3. At your domain registrar, add DNS records:
   - `www` → **CNAME** → `<username>.github.io`
   - apex (`@`) → **A** records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Back in Pages settings, tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).
5. Replace the site address in the files again (section 4) with the new domain and push.

## 7. If something goes wrong

- **Push rejected / authentication failed** → run `git push` again and complete the browser sign-in,
  or create a Personal Access Token under GitHub → Settings → Developer settings and use it as the password.
- **404 after enabling Pages** → confirm the branch is `main` and folder is `/ (root)`, wait two minutes,
  and make sure `index.html` is at the repository root.
- **Styles missing on the live site** → the links are relative (`styles.css`, `light/…`, `assets/…`), so this
  usually means a cached stylesheet; bump the `?v=` value and push.
- **Preview image not showing when sharing** → the `og:image` URL must be absolute and public; check section 4
  and re-scrape the link in the sharing tool.
