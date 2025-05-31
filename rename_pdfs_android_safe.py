import os
import re
import shutil

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

def rename_pdfs_recursively(directory):
    """Recursively find and rename PDF files in directory to be Android-safe."""
    pdf_files = []
    renamed_files = []
    
    # Find all PDF files
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_path = os.path.join(root, file)
                pdf_files.append(pdf_path)
    
    # Rename PDF files
    for pdf_path in pdf_files:
        directory = os.path.dirname(pdf_path)
        filename = os.path.basename(pdf_path)
        
        # Create safe filename
        safe_filename = make_filename_safe(filename)
        
        # Skip if filename is already safe
        if safe_filename == filename:
            continue
        
        new_path = os.path.join(directory, safe_filename)
        
        # Handle name conflicts
        counter = 1
        base_name, ext = os.path.splitext(safe_filename)
        while os.path.exists(new_path):
            safe_filename = f"{base_name}_{counter}{ext}"
            new_path = os.path.join(directory, safe_filename)
            counter += 1
        
        # Rename file
        shutil.move(pdf_path, new_path)
        renamed_files.append((pdf_path, new_path))
        print(f"Renamed: {pdf_path} -> {new_path}")
    
    return renamed_files

if __name__ == "__main__":
    directory = "assets/papers"
    
    # Check if directory exists
    if not os.path.isdir(directory):
        print(f"Error: Directory {directory} does not exist.")
        exit(1)
    
    renamed = rename_pdfs_recursively(directory)
    
    print(f"\nTotal renamed PDF files: {len(renamed)}")
    if not renamed:
        print("No files needed renaming - all filenames are already Android-safe.")