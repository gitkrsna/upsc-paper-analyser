#!/bin/zsh

# Script to compress PDF files using Ghostscript
# Optimized for scanned documents and mobile viewing

# Directory containing the PDFs (relative to the script's execution location)
PDF_DIR="assets/papers"

# Ghostscript command and options
# -sDEVICE=pdfwrite: Output device
# -dCompatibilityLevel=1.4: PDF compatibility level
# -dPDFSETTINGS=/ebook: Preset for good balance of size and quality for ebooks/on-screen reading.
#   Alternatives:
#     /screen: Lower quality, smaller size (72 dpi images)
#     /prepress: Higher quality, larger size (300 dpi images)
#     /printer: Similar to /prepress
#     /default: General purpose, often larger files
# -dNOPAUSE -dBATCH -dQUIET: For non-interactive batch processing
# -dDetectDuplicateImages=true: Attempts to identify and share duplicate image data
# -dCompressPages=true: Ensures page content streams are compressed
GS_COMMAND="gs"
GS_OPTIONS=(
  -sDEVICE=pdfwrite
  -dCompatibilityLevel=1.4
  -dPDFSETTINGS=/ebook
  -dNOPAUSE
  -dBATCH
  -dQUIET
  -dDetectDuplicateImages=true
  -dCompressPages=true
)

# Ensure the target directory exists
if [ ! -d "$PDF_DIR" ]; then
  echo "Error: Directory $PDF_DIR does not exist."
  exit 1
fi

echo "Starting PDF compression process..."

# Find all PDF files in the directory and its subdirectories
# and process them one by one.
# -print0 and read -d $' ' handle filenames with spaces or special characters.
find "$PDF_DIR" -type f -name "*.pdf" -print0 | while IFS= read -r -d $'\0' pdf_file; do
  # Define a temporary output file name
  temp_output_file="${pdf_file%.pdf}_temp_compressed.pdf"

  echo "Processing: $pdf_file"
  echo "Temporary output to: $temp_output_file"

  # Run Ghostscript
  "$GS_COMMAND" "${GS_OPTIONS[@]}" -sOutputFile="$temp_output_file" "$pdf_file"

  if [ $? -eq 0 ]; then
    original_size_before_compression=$(stat -f%z "$pdf_file")
    compressed_size=$(stat -f%z "$temp_output_file")
    
    # Replace the original file with the compressed one
    mv "$temp_output_file" "$pdf_file"
    if [ $? -eq 0 ]; then
      echo "Successfully compressed and replaced $pdf_file (Original: $original_size_before_compression bytes, Compressed: $compressed_size bytes)"
    else
      echo "Error replacing $pdf_file with $temp_output_file. The compressed file is still at $temp_output_file."
    fi
  else
    echo "Error compressing $pdf_file. Ghostscript exit code: $?"
    # Remove the temporary output file on error
    rm -f "$temp_output_file"
  fi
  echo "----------------------------------------"
done

echo "PDF compression process finished."
