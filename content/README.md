# Content Data

The pages read list data from JSON files in their own folders. Add entries to the relevant JSON file; the page markup and renderer do not need to change.

## Projects

Add objects to `projects/projects.json` with these fields:

- `id`: stable, unique slug
- `category`: short project type shown above the title
- `title`: project name
- `description`: short summary
- `capabilities`: array of short labels
- `href`: internal path or HTTP(S) URL
- `actionLabel`: link text
- `originUrl`: optional HTTP(S) link to the original or hosted project; renders as a separate external link

## CVEs

Add objects to `cves/cves.json` with these fields:

- `cveId`: CVE identifier
- `date`: publication or disclosure date in `YYYY-MM-DD` format
- `severity`: severity label
- `title`: short finding title
- `affectedProduct`: affected product or component
- `description`: concise impact summary

## Blogs

`posts.json` provides the blog list metadata. Each post's `id` must match a Markdown file at `blogs/<id>.md`.