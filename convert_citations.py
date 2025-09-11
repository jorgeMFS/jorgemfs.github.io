#!/usr/bin/env python3
"""Convert {% cite %} tags to numbered citations for GitHub Pages (multi-file version)."""

import re
from collections import OrderedDict
import os

# Read the BibTeX file to get reference information
def parse_bibtex():
    with open('_bibliography/references.bib', 'r') as f:
        content = f.read()
    
    references = {}
    
    # Find all BibTeX entries - handle entries that might have spaces before closing brace
    entries = re.findall(r'@(\w+)\{([^,]+),\s*(.*?)\n\}', content, re.DOTALL)
    
    for entry_type, key, fields in entries:
        entry_type = entry_type.lower()
        key = key.strip()
        
        # Extract fields
        ref_data = {'type': entry_type, 'key': key}
        
        # Better field extraction that handles nested braces
        field_pattern = r'(\w+)\s*=\s*\{((?:[^{}]|\{[^{}]*\})*)\}'
        
        # Extract all fields using a more robust approach
        for field_match in re.finditer(field_pattern, fields):
            field_name = field_match.group(1).lower()
            field_value = field_match.group(2).strip()
            
            # Clean up LaTeX formatting
            if field_name in ['author', 'title', 'journal', 'booktitle', 'publisher', 'institution', 'howpublished', 'note']:
                # First handle \url{} commands
                field_value = re.sub(r'\\url\{([^}]+)\}', r'\1', field_value)
                
                # Handle various accent types with better coverage
                # Acute accents
                field_value = re.sub(r'\\\'\{([a-zA-Z])\}', lambda m: {'a':'á','A':'Á','e':'é','E':'É','i':'í','I':'Í','o':'ó','O':'Ó','u':'ú','U':'Ú','y':'ý','Y':'Ý'}.get(m.group(1), m.group(1)), field_value)
                field_value = re.sub(r'\\\'([a-zA-Z])', lambda m: {'a':'á','A':'Á','e':'é','E':'É','i':'í','I':'Í','o':'ó','O':'Ó','u':'ú','U':'Ú','y':'ý','Y':'Ý'}.get(m.group(1), m.group(1)), field_value)
                
                # Cedilla
                field_value = re.sub(r'\\c\{([a-zA-Z])\}', lambda m: {'c':'ç','C':'Ç'}.get(m.group(1), m.group(1)), field_value)
                
                # Umlaut
                field_value = re.sub(r'\\"\{([a-zA-Z])\}', lambda m: {'a':'ä','A':'Ä','e':'ë','E':'Ë','i':'ï','I':'Ï','o':'ö','O':'Ö','u':'ü','U':'Ü'}.get(m.group(1), m.group(1)), field_value)
                field_value = re.sub(r'\\"([a-zA-Z])', lambda m: {'a':'ä','A':'Ä','e':'ë','E':'Ë','i':'ï','I':'Ï','o':'ö','O':'Ö','u':'ü','U':'Ü'}.get(m.group(1), m.group(1)), field_value)
                
                # Tilde
                field_value = re.sub(r'\\\~\{([a-zA-Z])\}', lambda m: {'n':'ñ','N':'Ñ','a':'ã','A':'Ã','o':'õ','O':'Õ'}.get(m.group(1), m.group(1)), field_value)
                
                # Handle malformed accent patterns like {í\i
                field_value = re.sub(r'\{([áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙäëïöüÄËÏÖÜãñõÃÑÕç])\\[a-z]\}?', r'\1', field_value)
                
                # Handle isolated accent marks (disabled to avoid over-replacement)
                
                # Clean up any LaTeX commands we might have missed
                field_value = re.sub(r'\\[a-zA-Z]+\{([^}]*)\}', r'\1', field_value)
                field_value = re.sub(r'\\[a-zA-Z]+', '', field_value)
                
                # Remove protective braces (but keep ones that might be part of titles)
                # Only remove single-layer braces around words/phrases
                field_value = re.sub(r'\{([^{}]+)\}', r'\1', field_value)
                
                # Handle dashes
                field_value = field_value.replace('---', '—')  # em dash
                field_value = field_value.replace('--', '–')   # en dash
                
                # Clean up any remaining escaped characters
                field_value = field_value.replace('\\&', '&')
                field_value = field_value.replace('\\_', '_')
                field_value = field_value.replace('\\%', '%')
                field_value = field_value.replace('\\$', '$')
                field_value = field_value.replace('\\#', '#')
                
                # Remove any unclosed braces at the end
                if field_value.count('{') > field_value.count('}'):
                    field_value = field_value.rstrip('{')
                
            elif field_name == 'url':
                # Handle \url{} in URL fields
                field_value = re.sub(r'\\url\{([^}]+)\}', r'\1', field_value)
                field_value = field_value.strip('<>')
            
            ref_data[field_name] = field_value
        
        references[key] = ref_data
    
    return references

# Format a single reference
def format_reference(ref):
    entry = ""
    
    # Authors
    if 'author' in ref:
        authors = ref['author'].replace(' and ', ', ')
        entry += authors + " "
    
    # Year
    if 'year' in ref:
        entry += f"({ref['year']}). "
    
    # Title
    if 'title' in ref:
        title = ref['title']
        if ref['type'] == 'article':
            entry += f"{title}. "
            if 'journal' in ref:
                entry += f"*{ref['journal']}*"
                if 'volume' in ref:
                    entry += f", {ref['volume']}"
                if 'pages' in ref:
                    entry += f", {ref['pages']}"
                entry += ". "
        elif ref['type'] == 'inproceedings':
            entry += f"{title}. "
            if 'booktitle' in ref:
                entry += f"In *{ref['booktitle']}*"
                if 'pages' in ref:
                    entry += f", pp. {ref['pages']}"
                entry += ". "
                if 'publisher' in ref:
                    entry += f"{ref['publisher']}. "
        elif ref['type'] == 'book':
            entry += f"*{title}*. "
            if 'publisher' in ref:
                entry += f"{ref['publisher']}. "
        elif ref['type'] == 'misc' or ref['type'] == 'online':
            entry += f"*{title}*. "
            if 'howpublished' in ref:
                entry += f"{ref['howpublished']}. "
            elif 'note' in ref:
                entry += f"{ref['note']}. "
        elif ref['type'] == 'techreport':
            entry += f"{title}. "
            if 'institution' in ref:
                entry += f"{ref['institution']}. "
        else:
            entry += f"*{title}*. "
    
    # URL or DOI
    if 'doi' in ref:
        entry += f"DOI: [{ref['doi']}](https://doi.org/{ref['doi']})"
    elif 'url' in ref:
        entry += f"Available at: [{ref['url']}]({ref['url']})"
    
    return entry.rstrip()

# Process a single markdown file
def process_file(filename, references):
    print(f"\n🔄 Processing {filename}...")
    
    # Read the markdown file  
    with open(filename, 'r') as f:
        content = f.read()
    
    # Track citations in order of appearance for this file
    cited_refs = []
    citation_map = {}
    
    # Add missing references that might be needed
    missing_refs = {
        'bonawitz2019towards': {
            'type': 'inproceedings',
            'author': 'Bonawitz, Keith and Eichner, Hubert and Grieskamp, Wolfgang and Huba, Dzmitry and Ingerman, Alex and Ivanov, Vladimir and Kiddon, Chloé and Konečný, Jakub and Mazzocchi, Stefano and McMahan, Brendan and Van Overveldt, Timon and Petrou, David and Ramage, Daniel and Roselander, Jason',
            'title': 'Towards Federated Learning at Scale: System Design',
            'booktitle': 'Proceedings of Machine Learning and Systems',
            'year': '2019',
            'volume': '1',
            'pages': '374-388',
            'url': 'https://proceedings.mlsys.org/paper/2019/file/bd686fd640be98efaae0091fa301e613-Paper.pdf'
        },
        'wuyts2015linddun': {
            'type': 'techreport', 
            'author': 'Wuyts, Kim and Joosen, Wouter',
            'title': 'LINDDUN privacy threat modeling: a tutorial',
            'institution': 'CW Reports, KU Leuven',
            'year': '2015',
            'url': 'https://downloads.linddun.org/tutorials/pro/v0/tutorial.pdf'
        }
    }
    
    def replace_citation(match):
        keys_str = match.group(1).strip()
        # Skip if it's not a valid citation (e.g., contains 'key' as placeholder)
        if 'key' in keys_str and len(keys_str) < 5:
            return match.group(0)  # Return unchanged
            
        keys = keys_str.split()
        nums = []
        
        for key in keys:
            if key not in citation_map:
                if key in references:
                    cited_refs.append((key, references[key]))
                    citation_map[key] = len(cited_refs)
                elif key in missing_refs:
                    # Reference exists in missing_refs but not yet in references
                    cited_refs.append((key, missing_refs[key]))
                    citation_map[key] = len(cited_refs)
                else:
                    print(f"⚠️  Warning: Citation key '{key}' not found in BibTeX")
                    citation_map[key] = '?'
            
            nums.append(str(citation_map[key]))
        
        return f"[{', '.join(nums)}]"
    
    # Remove the note at the beginning if present
    content = re.sub(
        r'> \*\*Note\*\*: This page includes citations.*?\n\n',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Replace all {% cite %} tags
    content = re.sub(r'\{%\s*cite\s+([^%]+)\s*%\}', replace_citation, content)
    
    # Convert {{ site.baseurl }} to full RDMKit URLs (not #)
    content = content.replace('{{ site.baseurl }}', 'https://rdmkit.elixir-europe.org')
    
    # Build bibliography section
    if cited_refs:
        bibliography = "\n## Bibliography\n\n"
        for i, (key, ref) in enumerate(cited_refs, 1):
            formatted = format_reference(ref)
            if not formatted:
                print(f"Debug: Empty formatting for reference {i}: {key} - {ref}")
            bibliography += f"{i}. {formatted}\n\n"
        
        # Replace the bibliography section if present; otherwise append
        content_new, replaced_count = re.subn(
            r'## Bibliography\n\n.*?$',
            lambda m: bibliography.rstrip(),
            content,
            flags=re.MULTILINE | re.DOTALL
        )
        if replaced_count == 0:
            sep = "" if content.endswith("\n") else "\n"
            content = content + f"{sep}{bibliography}"
        else:
            content = content_new
    
    # Write the updated file
    with open(filename, 'w') as f:
        f.write(content)
    
    print(f"✅ Converted {len(cited_refs)} citations in {filename}")
    return len(cited_refs)

# Main processing
def main():
    # Parse BibTeX
    references = parse_bibtex()
    print(f"📚 Found {len(references)} references in BibTeX file")
    
    # List of files to process (support hyphen and underscore variants; keep only existing)
    candidates = [
        'federated_learning.md',
        'federated_learning_threats.md',
        'federated_learning_ops.md',
        'federated_learning_green.md',
        'federated-learning.md',
        'federated-learning-threats.md', 
        'federated-learning-ops.md',
        'federated-learning-green.md'
    ]
    seen = set()
    files_to_process = []
    for fn in candidates:
        if os.path.exists(fn) and fn not in seen:
            files_to_process.append(fn)
            seen.add(fn)
    
    total_citations = 0
    for filename in files_to_process:
        if os.path.exists(filename):
            citations_count = process_file(filename, references)
            total_citations += citations_count
        else:
            print(f"⚠️  File {filename} not found, skipping...")
    
    print(f"\n🎉 Processing complete!")
    print(f"📊 Total citations processed across all files: {total_citations}")

if __name__ == '__main__':
    main() 