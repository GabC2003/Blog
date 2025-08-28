import os
import re
from glob import glob
import cloudinary
import cloudinary.uploader
import cloudinary.api

# --- CONFIGURATION ---
# Credentials provided by the user.
cloudinary.config(
  cloud_name = "dbrbdlmsx",
  api_key = "794665369471293",
  api_secret = "mZuFgE3nGpxub9QMHgEWoO4EfUM",
  secure = True
)

# The path within your Cloudinary account where images will be stored.
CLOUDINARY_FOLDER = "blog_images"

# --- SCRIPT CONSTANTS ---
# Assumes the script is run from the root of the project.
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
MARKDOWN_DIR = os.path.join(PROJECT_ROOT, "src", "content", "blog")
LOCAL_IMAGE_ROOT = os.path.join(PROJECT_ROOT, "public")

# The correct regex using a raw string, as is standard practice.
IMAGE_REGEX = re.compile(r"!\\\[(.*?)\\\]\(\/images\/blog\/(.*?)\")")

def upload_to_cloudinary(local_file_path, public_id):
    """Uploads a file to Cloudinary if it doesn't already exist."""
    try:
        # Check if the resource already exists by its public_id
        try:
            resource = cloudinary.api.resource(public_id)
            print(f"  - Skipping, already exists in Cloudinary: {resource['secure_url']}")
            return resource['secure_url']
        except cloudinary.api.NotFound:
            # If not found, proceed with upload
            print(f"  + Uploading {os.path.basename(local_file_path)} to Cloudinary...")
            response = cloudinary.uploader.upload(
                local_file_path,
                public_id=public_id,
                folder=CLOUDINARY_FOLDER
            )
            print(f"  + Upload successful.")
            return response['secure_url']

    except Exception as e:
        print(f"  ! Error uploading {os.path.basename(local_file_path)}: {e}")
        return None

def process_markdown_files():
    """
    Scans markdown files, uploads local images to Cloudinary, and updates the image links.
    """
    print("Starting image migration process to Cloudinary...")
    
    markdown_files = glob(os.path.join(MARKDOWN_DIR, "**", "*.md"), recursive=True)
    
    if not markdown_files:
        print("No markdown files found. Exiting.")
        return

    print(f"Found {len(markdown_files)} markdown file(s) to process.")

    for md_file in markdown_files:
        print(f"\nProcessing: {os.path.basename(md_file)}")
        
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        matches = IMAGE_REGEX.findall(content)
        if not matches:
            print("  - No local images found.")
            continue

        updated_content = content
        for alt_text, local_path in matches:
            # local_path is like '/images/blog/image.png'
            local_file_system_path = os.path.join(LOCAL_IMAGE_ROOT, local_path.lstrip('/'))

            if not os.path.exists(local_file_system_path):
                print(f"  ! Warning: Image file not found on disk: {local_file_system_path}")
                continue

            # Create a unique public_id for Cloudinary from the image filename
            image_filename = os.path.splitext(os.path.basename(local_path))[0]
            public_id = f"{image_filename}"

            public_url = upload_to_cloudinary(local_file_system_path, public_id)

            if public_url:
                print(f"  -> Replacing {local_path} with {public_url}")
                original_link = f"![{alt_text}]({local_path})"
                new_link = f"![{alt_text}]({public_url})"
                updated_content = updated_content.replace(original_link, new_link)

        # Write the updated content back to the markdown file
        if updated_content != content:
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"  * Successfully updated {os.path.basename(md_file)}")

    print("\nMigration process finished.")

if __name__ == "__main__":
    process_markdown_files()