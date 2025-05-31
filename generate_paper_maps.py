import os
import json
import re

# Base directory containing all papers
BASE_DIR = 'assets/papers'

def make_filename_safe(filename):
    """Make filename safe for Android by removing special characters and spaces."""
    # Keep alphanumeric characters, replace spaces with underscores, remove other special chars
    safe_name = re.sub(r'[^\w\-\.]', '_', filename)
    # Ensure no double underscores
    safe_name = re.sub(r'__+', '_', safe_name)
    # Remove leading/trailing underscores
    safe_name = safe_name.strip('_')
    # Ensure lowercase (optional, helps with case-sensitivity issues)
    safe_name = safe_name.lower()
    return safe_name

def normalize_category_id(category_name):
    """Convert folder names to standardized category IDs."""
    category_name = category_name.lower()
    
    # Map common folder names to standardized IDs
    if "general studies" in category_name and "paper i" in category_name or "gs paper i" in category_name:
        return "gs1"
    elif "general studies" in category_name and "paper ii" in category_name or "gs paper ii" in category_name or "csat" in category_name:
        return "gs2"
    elif "general studies" in category_name and "paper iii" in category_name:
        return "gs3"
    elif "general studies" in category_name and "paper iv" in category_name:
        return "gs4"
    elif "essay" in category_name:
        return "essay"
    else:
        # Generate a safe ID for unmapped categories
        return make_filename_safe(category_name)

def generate_paper_maps():
    """Generate JSON maps based on the papers directory structure."""
    if not os.path.exists(BASE_DIR):
        print(f"Error: Base directory '{BASE_DIR}' not found.")
        return

    # Data structures to populate
    years = []
    paper_types = {}  # year -> types
    categories = {}   # year/type -> categories
    papers = []       # Complete paper list with mappings
    
    # Maps for display names
    type_display_names = {
        "prelims": "Preliminary Examination",
        "preliminary": "Preliminary Examination", 
        "mains": "Main Examination",
        "main": "Main Examination"
    }
    
    # Walk through the directory structure
    for year_dir in sorted(os.listdir(BASE_DIR), reverse=True):
        year_path = os.path.join(BASE_DIR, year_dir)
        
        # Skip non-directories and hidden files
        if not os.path.isdir(year_path) or year_dir.startswith('.'):
            continue
            
        # Add to years list
        years.append(year_dir)
        paper_types[year_dir] = []
        
        # Process exam types within year
        for type_dir in os.listdir(year_path):
            type_path = os.path.join(year_path, type_dir)
            
            if not os.path.isdir(type_path) or type_dir.startswith('.'):
                continue
                
            # Normalize exam type name
            exam_type = type_dir.lower()
            if exam_type.startswith('prelim'):
                exam_type = 'prelims'
            elif exam_type.startswith('main'):
                exam_type = 'mains'
                
            # Add to paper types
            if exam_type not in paper_types[year_dir]:
                paper_types[year_dir].append(exam_type)
                
            # Create key for categories
            year_type_key = f"{year_dir}/{exam_type}"
            if year_type_key not in categories:
                categories[year_type_key] = []
                
            # Process categories within exam type
            for category_dir in os.listdir(type_path):
                category_path = os.path.join(type_path, category_dir)
                
                if not os.path.isdir(category_path) or category_dir.startswith('.'):
                    continue
                    
                # Get category ID and add to categories
                category_id = normalize_category_id(category_dir)
                category_info = {
                    "id": category_id,
                    "name": category_dir,
                    "folder": category_dir
                }
                
                if category_info not in categories[year_type_key]:
                    categories[year_type_key].append(category_info)
                
                # Process papers within category
                for paper_file in os.listdir(category_path):
                    if not paper_file.lower().endswith('.pdf') or paper_file.startswith('.'):
                        continue
                        
                    # Original and safe file paths
                    original_path = os.path.join(category_path, paper_file)
                    rel_path = os.path.join(f"papers/{year_dir}/{type_dir}/{category_dir}", paper_file)
                    
                    # Create safe filename
                    safe_filename = make_filename_safe(paper_file)
                    safe_path = os.path.join(f"papers/{year_dir}/{type_dir}/{category_dir}", safe_filename)
                    
                    # Generate paper info
                    paper_info = {
                        "id": f"{year_dir}-{exam_type}-{category_id}",
                        "year": year_dir,
                        "type": exam_type,
                        "categoryId": category_id,
                        "title": f"UPSC {type_display_names.get(exam_type, exam_type)} {year_dir} - {category_dir}",
                        "originalFileName": paper_file,
                        "fileName": safe_filename,
                        "path": safe_path.replace('\\', '/'),
                        "requirePath": f"@/assets/{safe_path}".replace('\\', '/')
                    }
                    
                    papers.append(paper_info)
    
    # Write data to JSON files
    with open('assets/config/years.json', 'w') as f:
        json.dump(years, f, indent=2)
        
    with open('assets/config/paper_types.json', 'w') as f:
        json.dump(paper_types, f, indent=2)
        
    with open('assets/config/categories.json', 'w') as f:
        json.dump(categories, f, indent=2)
        
    with open('assets/config/papers.json', 'w') as f:
        json.dump(papers, f, indent=2)
        
    print(f"Generated JSON files:")
    print(f"- Found {len(years)} years")
    print(f"- Found {sum(len(types) for types in paper_types.values())} paper types")
    print(f"- Found {sum(len(cats) for cats in categories.values())} categories")
    print(f"- Found {len(papers)} papers")
    
    # Ensure config directory exists
    os.makedirs('assets/config', exist_ok=True)

if __name__ == "__main__":
    generate_paper_maps()