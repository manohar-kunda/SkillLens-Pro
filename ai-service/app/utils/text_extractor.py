import io
from PyPDF2 import PdfReader

def extract_text(file_content: bytes, filename: str) -> str:
    """
    Extracts raw text from a PDF or DOCX file blob.
    """
    text = ""
    if filename.lower().endswith('.pdf'):
        try:
            pdf_reader = PdfReader(io.BytesIO(file_content))
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
            raise ValueError("Failed to process PDF text")
            
    # Note: Adding actual DOCX parsing here via python-docx would be required for full support,
    # but for this MVP, we will extract PDF first.
    elif filename.lower().endswith('.docx'):
        try:
            from docx import Document
            doc = Document(io.BytesIO(file_content))
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")
            raise ValueError("Failed to process DOCX text")
        
    return text.strip()
