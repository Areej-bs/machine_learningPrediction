# 📄 Guide de Création du Rapport PDF

## Fichiers du Rapport

Le rapport complet est divisé en 6 parties :

1. **RAPPORT_ML_PARTIE_1.md** - Résumé Exécutif & Architecture
2. **RAPPORT_ML_PARTIE_2.md** - Modèles ML (Prédiction & Segmentation)
3. **RAPPORT_ML_PARTIE_3.md** - Système de Recommandations & Pipeline
4. **RAPPORT_ML_PARTIE_4.md** - API Backend & Interface Frontend
5. **RAPPORT_ML_PARTIE_5.md** - Déploiement & Performance
6. **RAPPORT_ML_PARTIE_6.md** - Conclusions & Recommandations

## Option 1 : Conversion avec Pandoc (Recommandé)

### Installation de Pandoc

**Windows:**
```bash
# Télécharger depuis https://pandoc.org/installing.html
# Ou avec Chocolatey
choco install pandoc
```

**Mac:**
```bash
brew install pandoc
```

**Linux:**
```bash
sudo apt-get install pandoc
```

### Conversion en PDF

```bash
# Combiner tous les fichiers et convertir en PDF
pandoc RAPPORT_ML_PARTIE_1.md RAPPORT_ML_PARTIE_2.md RAPPORT_ML_PARTIE_3.md RAPPORT_ML_PARTIE_4.md RAPPORT_ML_PARTIE_5.md RAPPORT_ML_PARTIE_6.md -o RAPPORT_MACHINE_LEARNING_COMPLET.pdf --pdf-engine=xelatex -V geometry:margin=1in
```

### Options Avancées

```bash
# Avec table des matières
pandoc RAPPORT_ML_PARTIE_*.md -o RAPPORT_ML_COMPLET.pdf --toc --toc-depth=3 --pdf-engine=xelatex -V geometry:margin=1in

# Avec numérotation des sections
pandoc RAPPORT_ML_PARTIE_*.md -o RAPPORT_ML_COMPLET.pdf --toc --number-sections --pdf-engine=xelatex -V geometry:margin=1in

# Avec style personnalisé
pandoc RAPPORT_ML_PARTIE_*.md -o RAPPORT_ML_COMPLET.pdf --toc --number-sections --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=11pt -V documentclass=report
```

## Option 2 : Conversion avec Markdown to PDF (VS Code)

### Installation Extension

1. Ouvrir VS Code
2. Aller dans Extensions (Ctrl+Shift+X)
3. Chercher "Markdown PDF"
4. Installer l'extension

### Conversion

1. Ouvrir chaque fichier RAPPORT_ML_PARTIE_X.md
2. Clic droit → "Markdown PDF: Export (pdf)"
3. Combiner les PDFs avec un outil comme Adobe Acrobat ou PDFtk

## Option 3 : Conversion en Ligne

### Sites Recommandés

1. **Markdown to PDF** - https://www.markdowntopdf.com/
2. **Dillinger** - https://dillinger.io/
3. **StackEdit** - https://stackedit.io/

### Étapes

1. Copier le contenu de chaque partie
2. Coller dans l'éditeur en ligne
3. Exporter en PDF
4. Combiner les PDFs

## Option 4 : Conversion avec Python

### Installation

```bash
pip install markdown2 pdfkit
```

### Script Python

```python
import markdown2
import pdfkit

# Lire tous les fichiers
files = [
    'RAPPORT_ML_PARTIE_1.md',
    'RAPPORT_ML_PARTIE_2.md',
    'RAPPORT_ML_PARTIE_3.md',
    'RAPPORT_ML_PARTIE_4.md',
    'RAPPORT_ML_PARTIE_5.md',
    'RAPPORT_ML_PARTIE_6.md'
]

# Combiner le contenu
combined_md = ''
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        combined_md += f.read() + '\n\n'

# Convertir en HTML
html = markdown2.markdown(combined_md, extras=['tables', 'fenced-code-blocks'])

# Ajouter CSS
html_with_css = f'''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; }}
        h1 {{ color: #2c3e50; border-bottom: 2px solid #3498db; }}
        h2 {{ color: #34495e; }}
        table {{ border-collapse: collapse; width: 100%; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #3498db; color: white; }}
        code {{ background-color: #f4f4f4; padding: 2px 4px; }}
        pre {{ background-color: #f4f4f4; padding: 10px; overflow-x: auto; }}
    </style>
</head>
<body>
{html}
</body>
</html>
'''

# Convertir en PDF
pdfkit.from_string(html_with_css, 'RAPPORT_MACHINE_LEARNING_COMPLET.pdf')
print("PDF créé avec succès!")
```

## Option 5 : Utiliser Microsoft Word

### Étapes

1. Ouvrir Word
2. Fichier → Ouvrir → Sélectionner RAPPORT_ML_PARTIE_1.md
3. Word convertira automatiquement le Markdown
4. Répéter pour chaque partie
5. Copier-coller tout dans un seul document
6. Fichier → Enregistrer sous → PDF

## Recommandation

**Meilleure option : Pandoc** (Option 1)

Avantages :
- ✅ Qualité professionnelle
- ✅ Table des matières automatique
- ✅ Numérotation des sections
- ✅ Formatage préservé
- ✅ Une seule commande

## Commande Finale Recommandée

```bash
pandoc RAPPORT_ML_PARTIE_1.md RAPPORT_ML_PARTIE_2.md RAPPORT_ML_PARTIE_3.md RAPPORT_ML_PARTIE_4.md RAPPORT_ML_PARTIE_5.md RAPPORT_ML_PARTIE_6.md -o RAPPORT_MACHINE_LEARNING_COMPLET.pdf --toc --toc-depth=3 --number-sections --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=11pt -V documentclass=report -V title="Système de Prédiction d'Attrition des Employés" -V subtitle="Rapport Technique Complet" -V author="Équipe de Développement ML" -V date="11 Mai 2026"
```

## Résultat Attendu

Un PDF professionnel de ~40-50 pages contenant :
- Page de titre
- Table des matières
- 10 sections principales
- Tableaux formatés
- Code syntax highlighted
- Diagrammes ASCII
- Annexes

---

**Bonne création de PDF ! 📄**
