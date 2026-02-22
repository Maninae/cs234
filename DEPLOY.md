# Deploying to GitHub Pages

## Prerequisites

- A GitHub account (you already have one with a `.github.io` site)
- `gh` CLI installed (`brew install gh`) and authenticated (`gh auth login`)
- Git installed

## Steps

### 1. Create a new GitHub repo

```bash
gh repo create cs234 --public --description "CS234 Reinforcement Learning — Learning Site"
```

### 2. Initialize and push

```bash
cd /Users/ojwang/Developer/cs234-learning-site
git init
git add index.html styles/ scripts/ lectures/ slides/
git commit -m "CS234 Reinforcement Learning learning site"
git remote add origin git@github.com:YOUR_USERNAME/cs234.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Enable GitHub Pages

```bash
gh api repos/YOUR_USERNAME/cs234/pages -X POST \
  -f source.branch=main \
  -f source.path=/
```

Or do it manually: **Repo Settings > Pages > Source: Deploy from branch > Branch: main, / (root) > Save**

### 4. Visit your site

The site will be live within 1-2 minutes at:

```
https://YOUR_USERNAME.github.io/cs234/
```

## Notes

- The `slides/` directory contains ~95 MB of PDFs. GitHub repos have a soft limit of 100 MB per file and repos over 1 GB get warnings. This is fine.
- If you want to exclude the PDFs from the repo (to keep it lightweight), add `slides/*.pdf` to `.gitignore` and the "Original PDF slides" links on each lecture page will just 404. The text content is fully self-contained.
- All paths in the site are relative, so it works at any base URL with no config changes.
- No build step required — it's plain HTML/CSS/JS, GitHub Pages serves it as-is.
