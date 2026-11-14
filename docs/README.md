# RAPHA Labs website — local executable project

This project is a responsive website with the RAPHA Labs baby-blue / light-gray glassmorphism identity, expanded services, About, Projects, six-step interactive approach, editable founder placeholders, contact section and an enquiry form.

## Requirements
- Windows 10/11
- Python 3.10 or newer
- Internet connection only for Google Fonts (the site still works with system fonts if unavailable)

## Run on Windows
1. Extract the ZIP to a folder, for example `C:\RAPHA\rapha_labs_website`.
2. Open that folder in VS Code.
3. Open Terminal > New Terminal.
4. Run:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

If `py` is unavailable, use `python` instead. If PowerShell blocks virtual-environment activation, these commands deliberately use the venv's Python executable directly, so activation is not required.

5. Open http://127.0.0.1:5000 in your browser.
6. Test the enquiry form. Submitted enquiries are appended to `data/enquiries.csv`.
7. Stop the server with `Ctrl+C`.

## Important before publishing
- Replace the three founder placeholders with names, approved roles and short bios.
- Replace the contact email and phone placeholders with contact details the team controls.
- Add real social profile links only after those accounts are created.
- Review the privacy notice and terms for your actual business practices and applicable legal requirements.
- This local demo stores enquiries on the computer running Flask. It does NOT send email, SMS, or sync data to the internet.
- The Flask development server is for local testing only. For public launch, deploy the frontend and a production backend separately, configure HTTPS, persistent/private storage, spam controls, backups and access permissions. Do not expose the local CSV or use Flask debug mode in production.
- Never commit `.env` files, passwords, API keys, private enquiry data or `data/enquiries.csv` to a public repository.

## Project structure
```
rapha_labs_website/
├── app.py
├── index.html
├── requirements.txt
├── README.md
├── .gitignore
├── static/
│   ├── style.css
│   └── script.js
└── data/
    └── .gitkeep
```

## Customization
- Main page content: `index.html`
- Styling and responsive design: `static/style.css`
- Interactions and form submission: `static/script.js`
- Local form endpoint and CSV storage: `app.py`
